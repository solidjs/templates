## Solid `with-unocss` template

This is `basic` plus [UnoCSS](https://unocss.dev) — same routes, same demo, same tests; the pages are restyled with utility classes and `src/App.css` shrinks to the one thing utilities don't cover (the logo's keyframes). The diff against `basic` is the documentation of what UnoCSS changes.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere.

## How UnoCSS fits this stack

- The `UnoCSS()` Vite plugin (registered in `vite.config.ts`) scans your source files for class names and generates exactly that CSS, served as the `virtual:uno.css` module — imported by `src/App.tsx` alongside `@unocss/reset/tailwind.css` for the element reset. Both flow into the prerendered document shell exactly like any app CSS; nothing about the turnkey setup changes.
- The wind4 preset provides Tailwind-compatible utilities (see the restyled pages under `src/routes`); custom keyframes still live in plain CSS (`src/App.css`).
- Configuration lives inline in `vite.config.ts` and can move to `uno.config.ts` as it grows (presets, shortcuts, custom rules).
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
