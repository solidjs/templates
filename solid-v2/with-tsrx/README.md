## Solid `with-tsrx` template (experimental)

This is `basic` plus **experimental TSRX** — same routes, same demo, same tests; the app is authored in `.tsrx` instead of `.tsx` wherever the current tooling allows: the app root (`src/App.tsrx`), the document shell (`src/Document.tsrx`), and the components (`src/components/*.tsrx`). Route modules under `src/routes` stay `.tsx` for now — see "What stays `.tsx` and why" below. The diff against `basic` is the documentation of what TSRX changes.

TSRX support is experimental across the whole stack: the compiler frontends in `solid-js` 2.0 RC, the `.tsrx` pipeline in `@solidjs/vite-plugin`, and the third-party editor tooling are all pre-1.0 and may change. Treat this template as a preview of the format, not a stability contract.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere.

## What TSRX is

[TSRX](https://tsrx.dev) is a TypeScript-compatible syntax extension for component-oriented UI code: everything valid in TypeScript stays valid, and the format adds statement-container function bodies (`@{ ... }`), template control flow (`@if`/`@else`, `@for ... @empty`, `@switch`, `@try`), scoped `<style>` blocks, and dynamic tags (`<{expr}>`). It is a cross-framework specification; Solid ships its own compiler frontends for it (native and Babel) as of `solid-js` 2.0.0-rc.6.

**The file extension is the opt-in.** `@solidjs/vite-plugin` routes `.tsrx` modules through the Solid compiler automatically — there is no config flag, nothing was added to `vite.config.ts` for this template. Retained TypeScript is stripped as usual, and `.tsrx` modules participate in dependency scanning, code splitting, and entry discovery like any other source file: the turnkey `src/App.*` and `src/Document.*` conventions pick up the `.tsrx` versions directly. Imports spell the extension out (`import Counter from './Counter.tsrx'`).

## What the `.tsrx` files demonstrate

- **`src/App.tsrx`** — the app root as TSRX: a statement-container function body (`function App() @{ ... }`) rendering the router, with an ordinary arrow render prop inside the template.
- **`src/Document.tsrx`** — the document shell, picked up by the `src/Document.*` convention and compiled only into the prerendered static shell.
- **`src/components/Counter.tsrx`** — the statement-container body with setup (`@{` TypeScript first, then exactly one rendered output), a scoped `<style>` block, and an `@if` block that renders a milestone message (it lowers to Solid's `<Show>`).
- **`src/components/Guestbook.tsrx`** — `@for (const guest of guests(); index i) { ... } @empty { ... }` over a reactive list (it lowers to Solid's `<For>`; item reads stay deferred, so a replaced row updates in place) plus descendant selectors in its scoped styles.

## What stays `.tsx` and why

- **Route modules (`src/routes/**`)** — the `fileRoutes()` scanner (`filesystem-routing`) statically analyzes every route module's exports to apply the page convention (default export = page, `route` export = config), and its parser (`oxc-parser`) cannot parse TSRX syntax yet: a `.tsrx`route fails the build at the first`@{`. Route pages can freely *import* `.tsrx` components (the home route imports both), so only the thin route modules themselves wait on the scanner.
- **Test files (`*.test.tsx`)** — by design: vitest never needs to parse TSRX-authored source, the tests import the compiled `.tsrx` components and stay ordinary TSX.
- **`src/router.ts`, `vite.config.ts`, `vitest-setup.ts`** — no JSX, nothing to convert.

One styling note: `src/App.tsrx` keeps its nav styles in `App.css`. A scoped `<style>` block reaches its sibling elements and their descendants, but not markup rendered inside the `<Router>` render prop — and the `tsrx-tsc`/editor projection does not support `<style>` inside arrow functions yet. Scoped styles are demonstrated in the components, where they work end-to-end.

## Scoped CSS sidecars

A `<style>` block inside a TSRX template is scoped to the component: the compiler adds a `tsrx-<hash>` class to matching elements, prunes selectors that match nothing, and emits the result as a **virtual CSS sidecar** imported once by the compiled module. A `<style>` block scopes its _sibling_ elements and their descendants — put it next to your markup, not around it.

The sidecar flows through Vite's normal CSS pipeline, so it behaves like a real CSS file in every mode: extracted and code-split with the importing chunk in production builds (see `dist/client/assets/index-*.css` after `pnpm build`), hot-updated in dev (edit a style rule in `Counter.tsrx` — the change applies without a full reload), and collected during SSR dev when you flip `ssr: true`. The counter's button styles live in its `.tsrx` file rather than `src/App.css` for exactly this reason.

## Editor setup

- **VS Code:** install [TSRX Syntax](https://marketplace.visualstudio.com/items?itemName=TSRX.tsrx-vscode-plugin) (recommended via `.vscode/extensions.json`). It bundles `@tsrx/language-server` — syntax highlighting, diagnostics, completions, and go-to-definition work with no further configuration.
- **Other editors / tsserver:** this template ships `@tsrx/typescript-plugin` wired into `tsconfig.json` (`compilerOptions.plugins` plus the top-level `"tsrx": { "compiler": "@tsrx/solid" }` selector), which teaches any tsserver-based editor to type `.tsrx` modules. `@tsrx/solid` projects TSRX to virtual TypeScript checked under this project's Solid JSX settings. A Zed extension also exists on its marketplace.
- Expect a peer-dependency warning on install: `@tsrx/solid` currently pins `solid-js` 2.0.0-rc.3 while this template floors rc.6. The package is editor/typecheck tooling only — it is not part of the build — and works fine; the pin should catch up as TSRX tracks the RC line.

## Type checking

Plain `tsc` cannot resolve `.tsrx` imports. `pnpm typecheck` runs `tsrx-tsc --noEmit` instead — a drop-in `tsc` wrapper from `@tsrx/typescript-plugin` that checks the whole project _including_ the `.tsrx` modules, reporting errors at their authored positions.

## Linting and formatting

`oxlint` cannot parse TSRX syntax; `.tsrx` is excluded in `oxlint.config.mjs` (the files are outside oxlint's extension set today — the ignore entry makes the posture explicit). `pnpm lint` still covers every `.ts`/`.tsx` file. The TSRX project publishes [`@tsrx/oxc`](https://www.npmjs.com/package/@tsrx/oxc) (`.tsrx`-aware oxlint/oxfmt) and `@tsrx/prettier-plugin`; `eslint-plugin-solid` coverage for `.tsrx` is future work, so this template keeps the stock toolchain and leaves those opt-in.

## Current limits

- Authored lazy destructuring (`&{ ... }` / `&[ ... ]`) is part of the TSRX grammar but **rejected by the Solid target** — Solid keeps property reads and accessor calls explicit.
- TSRX's host-defined `module server { ... }` profile is not supported; function-level `"use server"` in `.tsrx` works with the plugin's `serverFunctions` mode (see the `fullstack` template for server functions in general).
- **JavaScript conversion doesn't apply.** TSRX is a TypeScript superset — there is no JS flavor of a `.tsrx` module, so this template is TypeScript-only.

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

The page will reload if you make edits — including hot updates for `.tsrx` modules and their scoped styles.<br>

### `npm run build`

Builds the static production site to `dist/client`, routes code-split, TSRX scoped CSS extracted.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite (the `.tsrx` components are tested like any other module).

### `npm run typecheck`

Type checks the project with `tsrx-tsc`, including `.tsrx` modules.
