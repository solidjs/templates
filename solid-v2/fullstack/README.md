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

`server.js` is the node version of exactly that; on web-native platforms (workers, Deno, Bun.serve) use `handleRequest` directly. Any target needs exactly three things:

1. **Serve `dist/client` statically**, and route everything else — pages, `/_server`, API routes — to `handleRequest`.
2. **Provide the server env vars** (`SESSION_SECRET` here) in the process environment: the server bundle reads and validates them **at boot**, not at build time, so they come from the platform's env/secret settings — never from a build artifact. Client `VITE_` vars are the opposite: baked in at `vite build`, so set those on the build machine/CI.
3. **Resolve the bundle's dependencies**: `dist/server` imports its npm deps (`solid-js`, `@solidjs/web`, `zod`, ...) as bare specifiers rather than inlining them, so whatever runs or re-bundles it needs `node_modules` present — true in every recipe below. The bundle itself is pure web-standard code (no `node:` imports; it does use top-level `await`).

### Node

The default — nothing to add. `npm run build`, then `npm start` runs `server.js` (loading `.env` if present; real deployments set the environment instead). Any node host (a VPS, Fly.io, Railway, ...) that runs `node server.js` with `PORT` and `SESSION_SECRET` set is done.

### Nitro

[Nitro](https://nitro.build) wraps the handler in its server toolkit — useful for its compression/route rules and its many deploy presets. Two files, no change to the app:

```ts
// nitro.config.ts
import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  compatibilityDate: '2026-08-11',
  // The Vite build is the input: dist/client served statically,
  // routes/[...].ts mounts the handler for everything else.
  publicAssets: [{ dir: 'dist/client' }],
  // The server bundle uses top-level await (boot-time env validation);
  // nitro's default es2019 target rejects it.
  esbuild: { options: { target: 'esnext' } },
});
```

```ts
// routes/[...].ts  (nitro's routes dir — not src/routes)
import { fromWebHandler } from 'h3';
import { handleRequest } from '../dist/server/server.js';

export default fromWebHandler(handleRequest);
```

Install (`npm i -D nitropack h3`), then build both halves and run:

```bash
$ npm run build && npx nitropack build
$ node --env-file=.env .output/server/index.mjs
```

Nitro's presets retarget the same wrapper: `NITRO_PRESET=cloudflare_module npx nitropack build` emits a worker that runs with `npx wrangler dev .output/server/index.mjs --assets .output/public --compatibility-date 2026-08-11 --compatibility-flags nodejs_compat` and deploys with the same arguments to `wrangler deploy`. One preset caveat: `NITRO_PRESET=netlify` defaults its public output to `dist/`, which would clobber the Vite build it consumes — pin `output: { publicDir: '.netlify/public' }` in `nitro.config.ts` and publish that directory instead.

### Cloudflare Workers

The handler mounts directly in a worker — no adapter. Two files:

```js
// worker.js — the assets config serves dist/client before the worker runs;
// everything else is the handler.
import { handleRequest } from './dist/server/server.js';

export default {
  fetch(request) {
    return handleRequest(request);
  },
};
```

```jsonc
// wrangler.jsonc
{
  "name": "my-app",
  "main": "worker.js",
  "compatibility_date": "2026-08-11",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": "./dist/client" }
}
```

`nodejs_compat` is required, for two things the server runtime needs: `node:async_hooks` (the per-request event scope) and a populated `process.env` (boot-time env validation — populated from your worker's vars/secrets with a compatibility date of 2025-04-01 or later). Everything else in the bundle is web-standard, and Solid resolves to its server build through the package's `worker` export condition.

```bash
$ npm run build
$ echo "SESSION_SECRET=..." > .dev.vars    # local dev secrets
$ npx wrangler dev                          # local workerd — no account needed
$ npx wrangler secret put SESSION_SECRET    # production secret
$ npx wrangler deploy
```

Streaming SSR, server functions, and the session cookie (pure WebCrypto) all work in workerd unchanged. Remember the flip side of baked client env: `VITE_` vars are fixed at `vite build`, not by worker vars.

### Netlify

One function file in the [web-standard Functions format](https://docs.netlify.com/functions/get-started/) plus a `netlify.toml`:

```js
// netlify/functions/ssr.mjs — static files win first (preferStatic),
// everything else is the handler.
import { handleRequest } from '../../dist/server/server.js';

export default (request) => handleRequest(request);

export const config = {
  path: '/*',
  preferStatic: true,
};
```

```toml
# netlify.toml
[build]
command = "npm run build"
publish = "dist/client"
```

Set `SESSION_SECRET` in the site's environment variables (UI or `netlify env:set`); functions read it from `process.env` as usual. Locally, `npx netlify-cli serve` runs the whole thing — build, function, statics — and injects your `.env` for you.

Two notes on Netlify's official Vite integrations, as of `@netlify/vite-plugin` 2.x:

- Its opt-in build integration (`netlify({ build: { enabled: true } })`) generates almost exactly the function above, but expects the server entry to `export default { fetch }` — this plugin's entry exports `handleRequest` by name, so the generated wrapper doesn't work yet. The two-file recipe above is the same thing, written out.
- Don't combine `@netlify/vite-plugin` in `vite.config.ts` with a catch-all function like the one above: the plugin's dev emulation dispatches `netlify/functions` inside `vite dev`, so a `path: '/*'` function shadows dev SSR with your last production build. The recipe above deliberately needs no Vite plugin.
