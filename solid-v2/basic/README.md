## Solid 2.0 SSR template

Streaming server-side rendering on the Solid 2.0 stack via `vite-plugin-solid`'s turnkey SSR mode (`ssr: {}`): `solid-js` + `@solidjs/web` 2.0, `@solidjs/router` 2.0 with file-system routing (`filesystem-routing` + `@solidjs/router/fs`), and `@solidjs/meta` 1.0.

There are no entry files to maintain: the plugin generates the server and client entries around `src/App.tsx`, wrapped in the `src/Document.tsx` shell. This is the same app shape as the `solid-v2/basic` SPA template — `src/App.tsx`, `src/routes`, and `src/components` are identical; the SSR part is the one plugin flag plus the document/server files.

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

Runs the app in the development mode: the vite dev server streams the server render (with the entry graph's CSS inlined) and hydrates on the client.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds client assets (+ manifest) to `dist/client` and the server bundle to `dist/server/server.js`.

### `npm start`

Runs the production build with the included `server.js` — a minimal node server that serves `dist/client` statically and dispatches everything else through the built handler.

### `npm run serve`

`vite preview` also runs the production artifact with no server file: preview statics serve `dist/client` and pages dispatch through the built handler.

## File-system routing

Route modules live in `src/routes`: `index.tsx` is `/`, `about.tsx` is `/about`, `blog/[id].tsx` would be `/blog/:id`, and `[...404].tsx` catches everything else. A module is a page when it has a default export, and may export a `route` config object (preload etc.). See the [filesystem-routing](https://github.com/solidjs/filesystem-routing) README for the full convention.

API routes are available through the `ssr.middleware` option: point it at a module default-exporting `[createAPIHandler(routes)]` from `filesystem-routing/api`, and uppercase `GET`/`POST`/... exports in route modules answer requests.

## Deployment

The built server entry exports `handleRequest(request)`, an adapter-agnostic web `Request -> Response` handler:

```js
import { handleRequest } from './dist/server/server.js';
// serve dist/client statically, everything else:
const response = await handleRequest(request);
```

`server.js` is the node version of exactly that; on web-native platforms (workers, Deno, Bun.serve) use `handleRequest` directly.

## Conventions

- `src/App.tsx` — the app root, a plain content component with the router inside (also probed as `src/app.*`, or set `ssr.app`).
- `src/Document.tsx` — the document shell wrapping the app; must render the full `<html>` including `<HydrationScript />`. Optional: delete it for the built-in shell.
- `src/entry-server.*` / `src/entry-client.*` — bring-your-own entries escape hatch; if present the plugin uses them instead of generating entries.
- `ssr.middleware` — a fetch-style middleware chain module fronting every request (see the `vite-plugin-solid` README).
- `server-only` / `client-only` — import these markers (typed via `vite-plugin-solid/boundary-modules` in `src/vite-env.d.ts`) in a module to fail the build if it leaks to the other side.
