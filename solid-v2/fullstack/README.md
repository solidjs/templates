## Solid `fullstack` template

`basic` plus a server. Same structure, same conventions — the diff against `basic` is what a server adds:

- **Data loading through server functions** — `'use server'` functions the UI calls like local async functions (`src/lib/users.ts`).
- **A single-flight mutation** — a `<form>` posting to an `action()` server function; the response carries the refreshed page data, so the UI updates in one round trip. Works before hydration too.
- **Session cookie auth** — a signed cookie read and written by plain server functions (`src/server/session.ts`); sign in on the home page, and the rename mutation is authorized against it server-side.
- **An API route** — uppercase method exports under `src/routes/api` answer HTTP requests (try `GET /api/users`).

**Deployment contract:** there is a server. `vite build` emits static client assets to `dist/client` and a request handler to `dist/server`; `npm start` serves both with the included `server.js`. Streaming SSR is the default posture — set `ssr: false` in `vite.config.ts` for a static shell + API server: pages render on the client while server functions, sessions, and API routes keep working. Same template, one boolean.

## Server functions

A function marked `'use server'` always runs on the server. On the server it is a plain call; in the browser the compiler turns it into a typed fetch against the `/_server` endpoint — you never write the endpoint. Wrap reads in `query()` (cached per key, shared between preload and render) and writes in `action()`; both come from `@solidjs/router`. `src/lib/users.ts` is the whole data layer.

Inside a server function, `getRequestEvent()` (from `@solidjs/web`) is the current request — headers, `locals`, the mutable `response` head.

## Single-flight mutations

The payoff the whole stack builds toward. When a form submits, the router sends the action call with a single-flight marker; on the server, after the mutation runs, the registered collector (`src/server-config.ts`) reruns the target route's `preload` and folds the refreshed `query()` data into the **same response**. The router seeds its cache from that envelope — no follow-up refetch, no stale frame in between.

Watch the network tab while renaming a user: exactly one `POST /_server` — the heading *and* the user list in the layout both update from that one response. Without single-flight that interaction is a POST followed by one GET per revalidated query.

Two things make a route single-flight-complete, and both are already good practice: reads go through `query()`, and the route's `preload` touches every query the page renders (that is what the server reruns — `src/routes/users/[id].tsx` calls it "the page's single-flight manifest"). The no-JS fallback is the same machinery minus the envelope: the plain form POST runs the action and answers `303 See Other` back to the page, which re-renders with fresh data — one round trip there too.

## Sessions

`src/server/session.ts` composes sessions from [`@remix-run/cookie`](https://www.npmjs.com/package/@remix-run/cookie) (signed HMAC-SHA256 on pure WebCrypto, secret rotation built in) over the request event: `getSession` parses and verifies the incoming request's cookie, `setSession`/`clearSession` append `Set-Cookie` to the outgoing response — from any server function, thrown redirects included. There is no Solid session API on purpose: cookies are a web standard, so sessions compose from a standard cookie library instead of a framework opinion.

Semantics worth knowing (all covered by `src/server/session.test.ts`):

- **Signed, not encrypted** — the payload is tamper-proof but client-readable; never put secrets in it, and keep it small (cookies cap at ~4KB).
- **Expiry is enforced server-side** via an `exp` claim in the payload; the cookie's `Max-Age` is browser hygiene a client is free to ignore.
- **Rotation**: `SESSION_SECRET` is comma-separated, newest first — the first entry signs, every entry verifies. Deploy `"new,old"`, drop `old` after a week.
- `getSession()` returns `null` uniformly for absent, tampered, rotated-out, and expired cookies — and it reads the *request's* cookie, so a `setSession` in the same request does not read back.

The demo wires it as auth: `login`/`logout` actions write the cookie, `getCurrentUser` reads it, and `renameUser` checks it server-side — the UI hiding the form when signed out is cosmetic; the check in the server function is the real gate.

## Typed environment variables

`env.ts` at the project root declares every variable as a [Standard Schema](https://standardschema.dev) validator (zod here; valibot or arktype work identically — nothing is imported from the plugin). The plugin probes it automatically and serves two fully typed virtual modules; generated types land in `solid-env.d.ts`.

- **`virtual:env/server`** — every var, **read from `process.env` when the server boots** and validated then: secrets rotate without a rebuild, platform-injected vars work, and no secret value exists in any build artifact. A misconfigured server fails at boot with a per-key report (delete `SESSION_SECRET` from `.env` and run `npm start` to see it). Importing this module from client code fails the build, naming the importer.
- **`virtual:env/client`** — the `VITE_`-prefixed vars, validated and **baked into the bundle** at build time (defaults applied, zero schema-library bytes shipped). The prefix is the line: client values are public, server values never leave the server.

The plugin folds `.env` files into `process.env` for dev, build, and preview — no `loadEnv` boilerplate. Copy `.env.example` to `.env` to get started (`.env` is git-ignored); `npm start` picks it up via `--env-file-if-exists`, and deploy platforms provide the real environment.

## Server-only modules

`src/server/db.ts` imports the `server-only` marker: if any code path would pull it into the client bundle, the build **fails at resolve time**, naming the importer — instead of silently shipping your data layer to the browser. (`client-only` marks the reverse.) The db module is the only file that knows the data source; swap the in-memory `Map` for a real database client and nothing else changes.

## Middleware and API routes

`src/middleware.ts` (wired via `start.middleware` in `vite.config.ts`) exports a chain of fetch-style functions fronting every request — page renders, server function calls, and API routes alike. It runs inside the request-event scope, so `getRequestEvent()` and the session helpers work there exactly as in application code.

A route module may export uppercase `GET`/`POST`/... handlers — an API route. A module with handlers but no default export is a route without a page (`src/routes/api/users.ts`). Handlers are dispatched by the `createAPIHandler` middleware; `fileRoutes({ httpMethods: true })` scans for them with one router serving both sides — handler modules, and the server-only code they import, never enter the client bundle.

## File-system routing

Routing works exactly as in `basic` (see its README): the `fileRoutes` plugin scans `src/routes`, `@solidjs/router/fs` consumes the result. The router instance lives in `src/router.ts` so the single-flight collector and the app share one source of truth.

## Testing

Two vitest projects, because they need different halves of the framework: `client` runs the DOM component tests from `basic` in jsdom, and `server` runs the session suite in node against the real server runtime — full request/response cycles through the same code paths production takes, with the plugin's env module stubbed (`vitest-env-server-stub.ts`).

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
$ cp .env.example .env # then fill in SESSION_SECRET
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

Runs the production build with the included `server.js` (loading `.env` if present — deploy platforms provide the real environment instead).

### `npm run serve`

`vite preview` runs the production artifact without a server file: statics from `dist/client`, everything else through the built handler.

### `npm test`

Runs both test projects: the component tests inherited from `basic` and the session suite.

## Deployment

The built server entry exports `handleRequest(request)` — an adapter-agnostic web `Request -> Response` handler:

```js
import { handleRequest } from './dist/server/server.js';
// serve dist/client statically; everything else:
const response = await handleRequest(request);
```

`server.js` is the node version of exactly that; on web-native platforms (workers, Deno, Bun.serve) use `handleRequest` directly.
