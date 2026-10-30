// The server middleware chain (wired via `start.middleware` in
// vite.config.ts). Each function is `(event, next) => Response`: the request
// is `event.request`, and `next()` takes no arguments — assign
// `event.request` before calling it to hand a different request downstream.
// Per-request render inputs (`event.nonce`, `event.renderMode`) go on the
// event before `next()` too, since the page render runs inside it. The chain
// fronts every request the server dispatches — page renders, server function
// calls, and API routes alike — and runs inside the request-event scope, so
// getRequestEvent() and the session helpers work here exactly as in
// application code.
import type { StartMiddleware } from '@solidjs/vite-plugin';
import { createAPIHandler } from 'filesystem-routing/api';
import routes from 'virtual:file-routes';

// createAPIHandler serves the GET/POST/... exports of the modules under
// src/api (mounted at /api — see the fileRoutes config in vite.config.ts)
// and passes everything else down the chain. It still speaks the previous
// (request, next) shape and calls next() with no arguments, so adapt it
// onto the event.
const api = createAPIHandler(routes);

const handleAPI: StartMiddleware = (event, next) => api(event.request, next);

export default [handleAPI];
