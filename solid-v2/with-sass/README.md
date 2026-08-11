## Solid `with-sass` template

This is `basic` plus [Sass](https://sass-lang.com) — same routes, same demo, same tests; `src/App.css` becomes `src/App.scss`, re-expressed with variables and nesting. The diff against `basic` is the documentation of what Sass changes.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere.

## How Sass fits this stack

- Vite compiles `.scss` files natively once the `sass` package is installed — there is no plugin and no config; the delta is one devDependency and the file extension.
- `src/App.scss` stays imported by `src/App.tsx`, so it flows into the prerendered document shell exactly like any app CSS; nothing about the turnkey setup changes. Everything Sass compiles to plain CSS at build time and ships zero runtime.
- Scoped styles work the same way: name a file `*.module.scss` and import it for CSS-modules class objects.
- If an `.scss` import fails, the `sass` package is missing — Vite names the fix in its error.

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
