## Solid `fullstack-tanstack` template

`fullstack` with the client half swapped out: [TanStack Router](https://tanstack.com/router) owns routing and [TanStack Query](https://tanstack.com/query) owns the data cache, while Solid's server functions, single-flight mutations, sessions, and API routes keep working unchanged. This is the agnosticism proof for the whole stack — the server half never asks who is routing.

**Deployment contract:** there is a server. `vite build` emits static client assets to `dist/client` and a request handler to `dist/server`; `npm start` serves both with the included `server.js`. SSR is the default posture — set `ssr: false` in `vite.config.ts` for a static shell + API server: pages render on the client while server functions, single-flight, sessions, and API routes keep working. Same template, one boolean.

## Who owns what

- **Solid + the plugin** own the RPC (`'use server'` functions compiled to typed fetches), the single-flight envelope, serialization, the turnkey entries, `src/Document.tsx`, sessions, and typed env.
- **TanStack Router** owns routing: the file-based route tree under `src/routes` (generated into `src/routeTree.gen.ts` by `@tanstack/router-plugin` — full typesafety for `<Link>`, params, and loaders), navigation, intent-based preloading (hover a link and its loader runs early), and automatic code splitting (each route's component compiles to its own lazy chunk).
- **TanStack Query** owns the client data cache: route loaders prefetch into it, components read from it with `useQuery`, and everything the server hands back lands in it.

Single-flight crosses all three — through public seams only. No package here patches or wraps another.

## The Router + Query pairing

Every read is declared once in `src/lib/queries.ts` as `queryOptions` wrapping a Solid server function. Route loaders are **non-blocking prefetch hints** — `void queryClient.prefetchQuery(...)` starts the fetch as navigation (or hover) begins without holding navigation on it; components read with `useQuery` and suspend at the read point. The `QueryClient` rides the router context (`src/router.tsx`), which is the idiomatic TanStack pairing.

Mutations are Solid server functions through TanStack's `useMutation`. One gotcha the routes call out: `mutationFn` is invoked with `(variables, context)`, and a server function forwards every argument into the RPC — wrap it in an arrow (`mutationFn: (fd: FormData) => renameUser(fd)`) so only your argument crosses the wire.

## Single-flight mutations on a foreign router

The capstone. When a mutation fires, the client transport asks the server to fold refreshed data into the **same response**. The client opt-in is solid-query's own: `QueryClientProvider` subscribes its named flight-data source (`"sq"`) while mounted, and hydrates the cache from whatever payloads come back — no hand-rolled consumer. On the server, `src/server-config.ts` (wired via `serverFunctions.configure`) registers the matching producer with `registerFlightDataSource`: solid-router's `loadFlightTarget` builds a fresh TanStack router + QueryClient for the page the browser is on — with the mutation's cookie effects already folded in — and runs its loaders; solid-query's `dehydrateSettled` awaits the in-flight fetches and ships the dehydrated cache as the payload.

The payload **is a dehydrated QueryClient**, so consuming it is TanStack's own `hydrate`: the entries land in the cache, every `useQuery` on those keys updates, and no `invalidateQueries` refetch happens anywhere. Watch the network tab while renaming a user: exactly one `POST /_server`, and both the detail heading and the user list in the parent layout update from that one response.

The seams that make this work are all public, on both sides: `registerFlightDataSource(id, hook)` hands the producer a pre-digested outcome (target URL, folded cookie headers) and takes back an opaque payload keyed by source — multiple integrations can contribute additively without competing for one hook — and TanStack's `dehydrate`/`hydrate` pair is its own documented serialization surface. The whole registration is ~15 lines of composition; every moving part ships in the packages. The no-JS fallback is the same machinery minus the envelope: forms also carry the server function's URL as their `action` (`src/lib/form-action.ts`), so a plain form POST runs the mutation and answers `303 See Other` back to the page, which re-renders server-side with fresh data.

## SSR under a router Solid doesn't own

The plugin's `start.setup` hook (`src/setup.tsx`) is the per-request seam: it builds this request's router + QueryClient, `await router.load()` starts the matched loaders' prefetches, and the returned component renders in App's place inside the Document — the render begins while the fetches are still in flight, each `useQuery` suspending on its own query.

The load's verdict rides the same seam. A server load never throws for redirects — a `redirect()` from `beforeLoad` or a loader lands in `router._serverResult` — so setup reads it after the load: a redirect folds its `Location` and status onto the event's response head (the plugin answers a real 30x with no body instead of streaming the abandoned route), and a render carries its 200/404/500 the same way, so unknown URLs answer 404 instead of a masquerading 200.

The SSR → client handoff is provider-owned on both layers, over the same channel. `QueryClientProvider` streams each query's dehydrated entry into the HTML stream as it settles, and the client provider primes its cache from those entries as they arrive — per query, progressively, not a single end-of-render blob. `RouterProvider` does the same for match state: as it renders, it serializes each matched route's transferable state (status, `loaderData`, `beforeLoad` context) into Solid's hydration registry, content-addressed by match id, and on the client `createRouter` primes and commits its matches from those entries before hydrating. No `dehydrate()` collector, no inline `window.__QUERY_STATE__` or `window.$_TSR` script, and no client boot pass: creating the router IS the hydration boot — no `router.load()` before hydrate, no loader re-runs, and each route's lazy chunk resolves at the read point under the boundary the server rendered.

One boundary, stated honestly: TanStack also ships a router-owned SSR protocol (`RouterServer`/`RouterClient` and stream handlers that emit `window.$_TSR` bootstrap data), but that pipeline expects to own the HTML stream — under turnkey, the plugin owns it. The registry transfer above is the bare pairing's native channel for exactly this posture; the Start path and its transport are simply not used here.

`disableGlobalCatchBoundary: true` in `src/router.tsx` is a semantic choice, not a hydration workaround: without the router's global catch boundary, errors bubble past the router to this app's own boundaries and stream handler instead of stopping at the router's `ErrorComponent`. Route-level `errorComponent`/`pendingComponent` options still work.

## Sessions, env, API routes, server-only modules

These are `fullstack`'s pillars, unchanged — its README teaches each in depth:

- **Sessions**: `src/server/session.ts` composes signed cookies from `@remix-run/cookie` over the request event; `login`/`logout` write it, `getCurrentUser` reads it, `renameUser` is authorized against it server-side. The 9-test suite came along too.
- **Typed env**: `env.ts` declares the schema; `virtual:env/server` reads `process.env` at boot (that's where `SESSION_SECRET` comes from), `virtual:env/client` is baked at build time. Copy `.env.example` to `.env` to get started.
- **API routes**: uppercase method exports under `src/api` (try `GET /api/users`), dispatched by the middleware chain. They live outside `src/routes` — that directory belongs to TanStack — so `fileRoutes` in `vite.config.ts` scans `src/api` and mounts it under `/api` with a two-line `toPath`.
- **Server-only modules**: `src/server/db.ts` imports the `server-only` marker, so any path pulling it into the client bundle fails the build naming the importer. (Vite's dependency scanner can print exactly that error on a cold `npm run dev` start — the scanner walks imports before the `'use server'` transform runs. It skips pre-bundling and dev proceeds normally; the build-time guard is unaffected.)

## Testing

Two vitest projects, as in `fullstack`: `client` runs the component test in jsdom, `server` runs the session suite in node against the real server runtime, with the plugin's env module stubbed (`vitest-env-server-stub.ts`).

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
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The route tree (`src/routeTree.gen.ts`) regenerates as files under `src/routes` change.

### `npm run build`

Builds client assets to `dist/client` and the request handler to `dist/server`.

### `npm start`

Runs the production build with the included `server.js` (loading `.env` if present — deploy platforms provide the real environment instead).

### `npm run serve`

`vite preview` runs the production artifact without a server file: statics from `dist/client`, everything else through the built handler.

### `npm test`

Runs both test projects: the component test and the session suite.

## Deployment

The built server entry exposes one adapter-agnostic web `Request -> Response` handler in two forms:

```js
import app, { handleRequest } from './dist/server/server.js';
// serve dist/client statically; everything else:
const response = await handleRequest(request);
const sameResponse = await app.fetch(request);
```

The default `{ fetch(request) }` export follows the Fetchable convention used by deployment integrations. `server.js` is the Node version of the same contract.

The server posture is identical to `fullstack` — same build layout (`dist/client` + `dist/server`), same handler export, same boot-time env contract — so the platform recipes in [`fullstack`'s README](../fullstack/README.md#deployment) (Node, Nitro, Cloudflare Workers, Netlify) apply here verbatim.
