## Solid `bare` template

The smallest useful Solid 2.0 app: `solid-js` + `@solidjs/web`, no router, no server dependencies. `vite build` produces a purely static site with a prerendered document shell — deploy `dist/client` anywhere — and the client ships only Solid and your component.

There is no `index.html` and no mount file: `vite-plugin-solid`'s turnkey mode generates the entries around `src/App.tsx`, wrapped in the `src/Document.tsx` shell. `Document.tsx` is where head tags go (title, meta, favicon); it is compiled only into the static shell and adds zero client-side JS.

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

Builds the app for production: prerenders the document shell into `dist/client/index.html` and emits the static client assets alongside it.

### `npm run serve`

Serves the production build locally.

## Deployment

Deploy the `dist/client` folder to any static host provider (netlify, surge, now, etc.)

## Growing out of `bare`

- **Streaming SSR** is one flag: add `ssr: true` next to `start: true` in `vite.config.ts`, and add `<HydrationScript />` (from `@solidjs/web`) to the `<head>` in `src/Document.tsx`. `src/App.tsx` carries over unchanged.
- **A router, file-system routes, per-page titles, and testing** come with the `basic` template — same structure, more floors.
- **A server** (data loading, mutations, sessions, API routes) is the `fullstack` template.
