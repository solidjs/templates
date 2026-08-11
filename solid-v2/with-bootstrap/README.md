## Solid `with-bootstrap` template

This is `basic` plus [Bootstrap](https://getbootstrap.com) 5 — same routes, same demo, same tests; the pages are restyled with Bootstrap's components and utilities, and `src/App.css` shrinks to the one thing Bootstrap doesn't cover (the logo's keyframes). The diff against `basic` is the documentation of what Bootstrap changes.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere.

## How Bootstrap fits this stack

- `src/App.tsx` imports `bootstrap/dist/css/bootstrap.min.css`, so it flows into the prerendered document shell exactly like any app CSS; nothing about the turnkey setup changes. Styling then lives in `class` attributes (see `navbar`, `btn`, `container` on the restyled pages).
- This template ships **CSS only**. Interactive Bootstrap components (dropdowns, modals, toasts) need the JS bundle: `import 'bootstrap'` where you need it (and `@types/bootstrap` for types) — do it inside components, not at module scope, since that code touches `document` and the app is written SSR-safe.
- To customize the theme with Sass instead of the prebuilt CSS, add the `sass` package and import `bootstrap/scss/bootstrap.scss` from your own `.scss` entry with your variable overrides — Vite compiles it with no further config.
- Unlike utility-scanner engines, the full stylesheet ships regardless of which classes you use; Bootstrap's value here is the component design system, not CSS pruning.

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

Builds the static production site to `dist/client`, routes code-split.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite.

## Deployment

Deploy the `dist/client` folder to any static host provider (netlify, surge, now, etc.)
