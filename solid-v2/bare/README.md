## Solid 2.0 SPA template

Client-only rendering on the Solid 2.0 stack: `solid-js` + `@solidjs/web` 2.0, `@solidjs/router` 2.0 with file-system routing (`filesystem-routing` + `@solidjs/router/fs`), `@solidjs/meta` 1.0, and `vite-plugin-solid` 3.0.

The app is shaped after the plugin's turnkey SSR conventions — the entire app, router included, lives in a default-exported `src/App.tsx`, and only `index.html` + `src/index.tsx` are client-only wiring — so moving to server rendering later is a config change, not a rewrite (see the `solid-v2/basic-ssr` template).

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

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## File-system routing

Route modules live in `src/routes`: `index.tsx` is `/`, `about.tsx` is `/about`, `blog/[id].tsx` would be `/blog/:id`, and `[...404].tsx` catches everything else. A module is a page when it has a default export, and may export a `route` config object (preload etc.). See the [filesystem-routing](https://github.com/solidjs/filesystem-routing) README for the full convention.

## Moving to SSR

This template intentionally mirrors the turnkey SSR conventions of `vite-plugin-solid`:

- `src/App.tsx` is the whole app — a plain content component with the router inside; no document shell, no `window` access at module scope.
- `index.html` stays minimal (mount + favicon + title) and the mount file is `src/index.tsx`.

To enable server rendering: pass `ssr: {}` to the plugin in `vite.config.ts`, delete `index.html` and `src/index.tsx`, and move any head tags into a `src/Document.tsx` shell. Everything under `src/routes`, `src/components`, and `src/App.tsx` carries over unchanged — see the `solid-v2/basic-ssr` template for the result.
