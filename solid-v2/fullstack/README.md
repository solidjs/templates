## Solid `fullstack` template

`basic` plus a server. Same structure, same routes, same tests — the diff against `basic` is what a server adds:

- **Data loading through server functions** — `'use server'` functions the UI calls like local async functions (`src/lib/users.ts`).
- **A mutation** — a `<form>` posting to an `action()` server function; works before hydration, and the router revalidates queries when it settles.
- **A session cookie** — decoded into `event.locals` by middleware, committed back onto the response (`src/lib/session.ts`, `src/middleware.ts`).
- **An API route** — uppercase method exports under `src/routes/api` answer HTTP requests (try `GET /api/users`).

**Deployment contract:** there is a server. `vite build` emits static client assets to `dist/client` and a request handler to `dist/server`; `npm start` serves both with the included `server.js`. Streaming SSR is the default posture — set `ssr: false` in `vite.config.ts` for a static shell + API server: pages render on the client while server functions, sessions, and API routes keep working. Same template, one boolean.

## Server functions

A function marked `'use server'` always runs on the server. On the server it is a plain call; in the browser the compiler turns it into a typed fetch against the `/_server` endpoint — you never write the endpoint. Wrap reads in `query()` (cached per key, shared between preload and render) and writes in `action()` (the router revalidates queries after it settles); both come from `@solidjs/router`. `src/lib/users.ts` is the whole data layer.

Inside a server function, `getRequestEvent()` (from `@solidjs/web`) is the current request — headers, `locals`, the mutable `response` head.

## Server-only modules

`src/lib/db.ts` imports the `server-only` marker: if any code path would pull it into the client bundle, the build **fails at resolve time**, naming the importer — instead of silently shipping your data layer to the browser. (`client-only` marks the reverse.) The db module is the only file that knows the data source; swap the in-memory `Map` for a real database client and nothing else changes.

## Middleware and sessions

`src/middleware.ts` (wired via `start.middleware` in `vite.config.ts`) exports a chain of fetch-style functions fronting every request — page renders, server function calls, and API routes alike. It runs inside the request-event scope, so `getRequestEvent()` works exactly as in application code.

The session middleware decodes the cookie into `event.locals.session` and re-serializes it onto the returned response's headers after the chain runs (they stay mutable until the outermost middleware returns — streamed pages included). `event.locals` is typed by augmenting `RequestEventLocals` in `src/types.ts`. For real apps, sign or encrypt the cookie value — the shape of `src/lib/session.ts` stays the same.

## File-system routing and API routes

Routing works exactly as in `basic` (see its README): `fileRoutes()` scans `src/routes`, `@solidjs/router/fs` consumes the result in `src/App.tsx`. Two additions here:

- A route module may export uppercase `GET`/`POST`/... handlers — an API route. A module with handlers but no default export is a route without a page (`src/routes/api/users.ts`). Handlers are dispatched by the `createAPIHandler` middleware in `src/middleware.ts`.
- `vite.config.ts` configures one router per environment: only the server router scans for handler exports, so API modules — and the server-only code they import — stay out of the client bundle.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode with streaming SSR.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds client assets to `dist/client` and the request handler to `dist/server`.

### `npm start`

Runs the production build with the included `server.js`.

### `npm run serve`

`vite preview` runs the production artifact without a server file: statics from `dist/client`, everything else through the built handler.

### `npm test`

Runs the test suite inherited from `basic` (component tests compile with the client posture).

## Deployment

The built server entry exports `handleRequest(request)` — an adapter-agnostic web `Request -> Response` handler:

```js
import { handleRequest } from './dist/server/server.js';
// serve dist/client statically; everything else:
const response = await handleRequest(request);
```

`server.js` is the node version of exactly that; on web-native platforms (workers, Deno, Bun.serve) use `handleRequest` directly.
