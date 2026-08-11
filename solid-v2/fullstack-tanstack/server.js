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

function webRequest(req) {
  const url = new URL(req.url || '/', `http://${req.headers.host || `localhost:${port}`}`);
  const method = req.method || 'GET';
  const body = method === 'GET' || method === 'HEAD' ? undefined : Readable.toWeb(req);
  return new Request(url, {
    method,
    headers: req.headers,
    body,
    ...(body ? { duplex: 'half' } : {}),
  });
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
    const response = await handleRequest(webRequest(req));
    res.statusCode = response.status;
    const cookies = response.headers.getSetCookie?.();
    response.headers.forEach((value, key) => {
      if (key !== 'set-cookie') res.setHeader(key, value);
    });
    if (cookies?.length) res.setHeader('set-cookie', cookies);
    if (response.body) {
      for await (const chunk of response.body) res.write(chunk);
    }
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(e.message);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
