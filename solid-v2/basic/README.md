## Solid `basic` template

A routed Solid 2.0 app that still deploys as pure static files: `solid-js` + `@solidjs/web`, `@solidjs/router` with file-system routes (`filesystem-routing` + `@solidjs/router/fs`), per-page titles via `@solidjs/meta`, and a `vitest` test suite. There are no server dependencies — `vite build` produces a purely static site with a prerendered document shell; deploy `dist/client` anywhere.

There is no `index.html` and no mount file: `vite-plugin-solid`'s turnkey mode generates the entries around `src/App.tsx`, wrapped in the `src/Document.tsx` shell. `Document.tsx` is where site-wide head tags go; it is compiled only into the static shell and adds zero client-side JS. Per-page head tags (like `<Title>`) live in the route modules.

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

Builds the app for production: prerenders the document shell into `dist/client/index.html` and emits the static client assets alongside it. Routes are code-split automatically.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite with [vitest](https://vitest.dev) + [@solidjs/testing-library](https://github.com/solidjs/solid-testing-library). See `src/components/Counter.test.tsx` for the pattern.

## File-system routing

Route modules live in `src/routes` and are wired through the `fileRoutes()` vite plugin plus `@solidjs/router/fs` inside `src/App.tsx`:

- `index.tsx` is `/`, `about.tsx` would be `/about`, `users/[id].tsx` is `/users/:id`, and `[...404].tsx` would catch everything else.
- Pairing `users.tsx` with the `users/` directory makes it a layout wrapping every page inside.
- A module is a page when it has a default export, and may export a `route` config object (preload etc.).

See the [filesystem-routing](https://github.com/solidjs/filesystem-routing) README for the full convention.

## Deployment

Deploy the `dist/client` folder to any static host provider (netlify, surge, now, etc.)

## Growing out of `basic`

- **Streaming SSR** is one flag: add `ssr: true` next to `start: true` in `vite.config.ts`. `src/App.tsx` and `src/Document.tsx` carry over unchanged (`<HydrationScript />` is already in place; in client mode it is stripped from the static shell).
- **A server** (data loading via server functions, mutations, sessions, API routes) is the `fullstack` template — same structure, more floors.
- Want less? The `bare` template is the same shape without the router.
