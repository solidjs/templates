## Solid `basic` template

`bare` plus the app floors most projects want: `@solidjs/router` with file-system routes, per-page titles via `@solidjs/meta`, and a `vitest` test suite.

**Deployment contract:** still zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` to any static host.

## How it works

There is no `index.html` and no mount file. `vite-plugin-solid`'s turnkey mode (`start: true` in `vite.config.ts`) generates the entries around two conventions:

- **`src/App.tsx`** — the app, router included. The `<Router>` wraps a shared nav and a `<Loading>` boundary; its routes come from the file system (below).
- **`src/Document.tsx`** — the document shell, the new `index.html`. Site-wide head tags go here; it is compiled only into the prerendered static shell and adds **zero client-side JS**. Per-page head tags (`<Title>` from `@solidjs/meta`) live in the route modules.

## File-system routing

The `fileRoutes()` plugin (from `filesystem-routing/vite`) scans `src/routes` and exposes the result as the `virtual:file-routes` module, which `@solidjs/router/fs` turns into router routes inside `src/App.tsx`. You edit files under `src/routes`; the route table follows:

- `index.tsx` is `/`, `users/[id].tsx` is `/users/:id`, `[...404].tsx` catches everything else.
- Pairing `users.tsx` with the `users/` directory makes it a layout wrapping every page inside.
- A module is a page when it has a **default export** (a file without one is not a route), and may export a `route` config object — `src/routes/users/[id].tsx` uses `preload` to start its data fetch as navigation begins.

Every route is code-split automatically; navigating loads only that page's module.

## Data loading

`src/routes/users/[id].tsx` shows the data pattern: a `query()` (from `@solidjs/router`) over a plain `fetch`, read through a memo. The surrounding `<Loading>` boundary in `App.tsx` shows its fallback until the promise settles, and `query()` caches by key so preload and render share one request. Swap the static `/users.json` for any API endpoint.

## Testing

`vitest` runs component tests in jsdom via `@solidjs/testing-library` — add `*.test.tsx` files next to what they test. See `src/components/Counter.test.tsx` for the pattern; note Solid 2.0 batches DOM updates, so tests call `flush()` after firing events before asserting on the DOM.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the static production site to `dist/client`, routes code-split.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite.

## The `ssr` flip

Streaming SSR is one boolean: add `ssr: true` next to `start: true` in `vite.config.ts`. `src/App.tsx`, `src/Document.tsx`, and the routes carry over unchanged — `<HydrationScript />` is already in place in the Document (in client mode it is stripped from the static shell).

## Growing out of `basic`

- **A server** (data loading via server functions, mutations, sessions, API routes) is the `fullstack` template — same structure, more floors.
- Want less? The `bare` template is the same shape without the router.
