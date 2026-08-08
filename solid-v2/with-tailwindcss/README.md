## Solid `with-tailwindcss` template

This is `basic` plus [Tailwind CSS](https://tailwindcss.com) v4 — same routes, same demo, same tests; the pages are restyled with utility classes and `src/App.css` shrinks to one line. The diff against `basic` is the documentation of what Tailwind changes.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere.

## How Tailwind fits this stack

- The `tailwindcss()` Vite plugin (from `@tailwindcss/vite`, registered in `vite.config.ts`) scans your source files for class names and generates exactly that CSS. There is no `tailwind.config.js` — v4 is configured in CSS, and the default setup needs none.
- `src/App.css` is the stylesheet: `@import 'tailwindcss';` pulls in the preflight reset and the generated utilities. It stays imported by `src/App.tsx`, so it flows into the prerendered document shell exactly like any app CSS — nothing about the turnkey setup changes.
- Element defaults are reset by preflight, so styling lives in `class` attributes (see the restyled pages under `src/routes`); site-wide element rules can be added back in `src/App.css` with `@layer base`.
- If a class name doesn't apply, it usually wasn't seen by the scanner: class names must appear as complete strings in source (no runtime string-building).

Everything else — file-system routing, data loading, testing, the one-boolean `ssr: true` flip — is `basic`; see its README.

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

Builds the static production site to `dist/client`, routes code-split, CSS pruned to the classes actually used.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite.

## Deployment

Deploy the `dist/client` folder to any static host provider (netlify, surge, now, etc.)
