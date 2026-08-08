// The server middleware chain (wired via `start.middleware` in
// vite.config.ts): fetch-style functions fronting every request the server
// dispatches — page renders, server function calls, and API routes alike.
import { getRequestEvent } from '@solidjs/web';
import { createAPIHandler } from 'filesystem-routing/api';
import routes from 'virtual:file-routes';

import { readSession, writeSession } from './lib/session';

type Next = (request?: Request) => Promise<Response>;

// Decodes the session cookie into event.locals for everything downstream,
// and commits any changes back onto the response. The returned response's
// headers stay mutable until the outermost middleware returns — streamed
// pages included.
async function session(request: Request, next: Next) {
  const event = getRequestEvent()!;
  event.locals.session = readSession();
  const response = await next();
  writeSession(event.locals.session, response.headers);
  return response;
}

// createAPIHandler serves the GET/POST/... exports of route modules
// (see src/routes/api) and passes everything else down the chain.
export default [session, createAPIHandler(routes)];
