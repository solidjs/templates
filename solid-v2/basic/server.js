// The production server: static client assets plus one import — the built
// server bundle's `handleRequest`, an adapter-agnostic web
// `Request -> Response` handler that streams the SSR render. The node <->
// web plumbing below is the only glue; on a web-native platform (workers,
// Deno, Bun.serve) use `handleRequest` directly.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { handleRequest } from './dist/server/server.js';

const root = path.dirname(fileURLToPath(import.meta.url));
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
  const url = new URL(
    req.url || '/',
    `http://${req.headers.host || `localhost:${port}`}`,
  );
  const method = req.method || 'GET';
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : Readable.toWeb(req);
  return new Request(url, {
    method,
    headers: req.headers,
    body,
    ...(body ? { duplex: 'half' } : {}),
  });
}

createServer(async (req, res) => {
  const url = req.url || '/';

  // Static client assets first.
  if (url !== '/' && !url.includes('..')) {
    try {
      const file = url.split('?')[0];
      const content = readFileSync(path.resolve(root, 'dist/client' + file));
      res.setHeader(
        'Content-Type',
        MIME[path.extname(file)] || 'application/octet-stream',
      );
      return res.end(content);
    } catch {
      // Fall through to the handler (SSR routes).
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
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
