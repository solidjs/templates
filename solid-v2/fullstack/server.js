// The entire production server for a turnkey SSR app: static client assets
// plus one import — the built server bundle's `handleRequest`, an
// adapter-agnostic web `Request -> Response` handler that streams the SSR
// render, resolves hashed client assets through the build manifest, and
// (with serverFunctions enabled) serves the `/_server` endpoint too. The
// node <-> web plumbing below is the only glue; on a web-native platform
// (workers, Deno, Bun.serve) `handleRequest` is used directly.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { handleRequest } from './dist/server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

const MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

function webRequest(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || `localhost:${port}`}`);
  const method = req.method || 'GET';
  const body = method === 'GET' || method === 'HEAD' ? undefined : Readable.toWeb(req);
  // A client that goes away fires the request's AbortSignal, so handlers can
  // cancel streamed renders and in-flight work. The response's 'close' also
  // fires on normal completion; writableEnded tells the two apart.
  // (Technique from srvx's Node adapter, github.com/h3js/srvx.)
  const controller = new AbortController();
  res.once('close', () => {
    if (!res.writableEnded) controller.abort();
  });
  return new Request(url, {
    method,
    headers: req.headers,
    body,
    signal: controller.signal,
    ...(body ? { duplex: 'half' } : {}),
  });
}

async function sendWebResponse(res, response) {
  res.statusCode = response.status;
  // set-cookie is the one header that must not be comma-joined.
  const cookies = response.headers.getSetCookie?.();
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') res.setHeader(key, value);
  });
  if (cookies?.length) res.setHeader('set-cookie', cookies);
  // HEAD gets the head only — and the body must be cancelled, not pumped
  // into node's discarded HEAD writes. (Technique from srvx.)
  if (!response.body || res.req?.method === 'HEAD') {
    response.body?.cancel().catch(() => {});
    res.end();
    return;
  }
  const reader = response.body.getReader();
  res.on('close', () => {
    reader.cancel().catch(() => {});
  });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // Backpressure: an unchecked res.write loop buffers the whole body in
      // memory when the client reads slowly. The 'drain' wait must also
      // settle on 'close'/'error' — a response whose client already went
      // away never emits 'drain', which would park this promise (and the
      // render it holds) forever.
      if (res.destroyed) return;
      if (!res.write(value)) {
        const drained = await new Promise((resolve) => {
          const settle = (ok) => {
            res.off('drain', onDrain);
            res.off('close', onGone);
            res.off('error', onGone);
            resolve(ok);
          };
          const onDrain = () => settle(true);
          const onGone = () => settle(false);
          res.once('drain', onDrain);
          res.once('close', onGone);
          res.once('error', onGone);
        });
        // Client gone mid-stream; the 'close' handler cancels the reader.
        if (!drained) return;
      }
    }
    res.end();
  } catch {
    res.destroy();
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || '/';

  // Static client assets first.
  if (url !== '/' && !url.includes('..')) {
    try {
      const content = readFileSync(path.resolve(__dirname, 'dist/client' + url.split('?')[0]));
      res.setHeader('Content-Type', MIME[path.extname(url)] || 'application/octet-stream');
      res.end(content);
      return;
    } catch {
      // Fall through to the handler (SSR routes, /_server, ...).
    }
  }

  try {
    // The `options.event` seam: extra fields spread into the request event,
    // conventionally the platform's raw request as `nativeEvent` — app code
    // reads it back via getRequestEvent() (e.g. the client IP from
    // event.nativeEvent.socket.remoteAddress on bare Node).
    const response = await handleRequest(webRequest(req, res), { event: { nativeEvent: req } });
    await sendWebResponse(res, response);
  } catch (e) {
    console.error(e);
    // Once the head is on the wire a 500 can't be written any more —
    // touching statusCode would throw ERR_HTTP_HEADERS_SENT.
    if (res.headersSent) return res.destroy();
    res.statusCode = 500;
    res.end(e.message);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
