# Solid `ssg` template

`basic` plus static site generation: `vite build` prerenders every page to HTML and executes the app's server functions **at build time**, baking their results into static JSON. What you deploy is a folder of files — a full Solid app with typed server-side data loading, and no server.

**Deployment contract:** `vite build` emits a purely static site; deploy `dist/client` to any static host (Netlify, Cloudflare Pages, GitHub Pages, S3…).

## How it works

Same structure as `basic` — no `index.html`, no mount file, `src/App.tsx` and `src/Document.tsx` conventions, file-system routes under `src/routes` — with three additions in `vite.config.ts`:

- **`ssr: true`** — pages render with streaming SSR. Here that render happens once, during the build; the prerenderer writes the HTML it produces.
- **`serverFunctions: true`** — route data lives in `'use server'` functions with real types across the boundary. In dev they run against the dev server like any fullstack app; in the build they run once and their results ship as static artifacts.
- **`prerender({ mode: 'static' })`** (from `@solidjs/prerender/vite`) — after the client and server builds, crawls the app in-process starting at `/`: renders each page, writes its HTML, follows every same-origin link to discover more pages, and captures each `prerendered()` call as a JSON artifact under `dist/client/_static/`.

There is no route list to maintain. The crawl finds pages the way a user would — by following links. Add a post in `src/server/posts.ts` and the next build emits its page and its data.

## Data loading

`src/data.ts` shows the pattern: a `'use server'` function wrapped in `prerendered()` (from `@solidjs/prerender`), wrapped in `query()` (from `@solidjs/router`):

- **`prerendered()`** declares the call's results are baked at build time. Each call identity — function + arguments — becomes one artifact; on the deployed site the client fetches that file instead of calling a server. It implies `GET`, and values survive richly typed (`publishedAt` comes back a real `Date`).
- **`query()`** layers router caching on top, so `preload` and render share one read per key.

`src/server/posts.ts` is the server-only source behind those functions — swap the in-memory array for a database or CMS client; it never enters the client bundle.

**The constraint to understand:** only calls the build actually made have artifacts. Arguments are part of the address, so a deployed client calling `getPost('new-slug')` when no prerendered page made that call gets an error, not data. Design pages so the crawl exercises the calls the site needs — which happens naturally when pages link to what they use.

## Dev is still live

`npm run dev` runs a normal dev server: server functions execute per request, edits to data code hot-reload, nothing is baked. The prerender plugin only acts on `vite build`. This means dev behaves like a fullstack app while production is static — the same posture TanStack calls static server functions and Astro calls the build-time island.

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

The page will reload if you make edits. Server functions run live against the dev server.

### `npm run build`

Builds, prerenders, and bakes the static production site to `dist/client`: every page as HTML, every `prerendered()` call as a JSON artifact, routes code-split.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite.

## Growing out of `ssg`

- **A live server** (per-request SSR, mutations, sessions, API routes) is the `fullstack` template — same structure, the server ships instead of retiring at build.
- **Both at once**: `prerender({ mode: 'hybrid' })` on top of a fullstack setup bakes chosen calls to static artifacts while everything else stays live — clients fetch artifacts first and fall back to the server.
- Want less? The `basic` template is the same shape without the build-time server: purely client-rendered pages, data via plain `fetch`.
