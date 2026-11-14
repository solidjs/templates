## Solid `with-reactivescript` template (experimental)

A small Solid 2.0 app written in [ReactiveScript](https://reactivescript.dev/): a counter, a guestbook, and a user card that loads data with loading and error regions. The `.rx` modules compile to plain Solid 2.0 at build time.

ReactiveScript is experimental (0.x). It follows Solid 2.0's release candidates, so expect breaking changes until Solid 2.0 is final. Treat this template as a preview of the language, not a stability contract.

**Deployment contract:** `vite build` emits a purely static site to `dist`; deploy it to any static host. There is no server and no `start` script.

## What ReactiveScript is

ReactiveScript is TypeScript's expressions and JSX plus a few reactive forms spelled as words. Solid's reactive rules become language rules, and the compiler checks them before the code runs:

- `source count := 0` is state. Only a source is written, with `:=`, and only in an event handler, an `action` or an `effect`.
- `double = count * 2` is an equation: always equal to its right side, recomputed when what it reads changes, never written.
- `user = await fetchUser(id)` is async data: re-asked whenever `id` changes, with stale answers dropped.
- Control flow and boundaries are braced: `{if c { … } else { … }}`, `{for x in xs { … }}`, `{loading fallback { … } { … }}`, `{errored fallback(e) { … } { … }}`.

Shape mistakes that Solid's dev runtime warns about at run time are build errors here. Each one names the rule it enforces and the fix. Leave the `loading` region out of `src/components/UserCard.rx` and `vite build` fails with `ASYNC_OUTSIDE_LOADING_BOUNDARY`; write `milestone := 1` in `Counter.rx` and it fails with `WRITE_TO_NON_SOURCE`. The checks are static only, and the compiled code adds nothing at run time beyond Solid.

The language fits on one page: `node_modules/@reactivescript/compiler/guide/language.md`, then `async.md` for talking to a server. `diagnostics.md` in the same folder explains every error code.

## How it is wired

- **`vite.config.ts`** uses plain `solid()`. `@solidjs/vite-plugin` (3.0.0-next.57 or later) finds `@reactivescript/compiler` in the project and compiles `.rx` modules with it. No option names it.
- **`index.html` and `src/main.ts`** mount the app. A `.rx` program is mounted by ReactiveScript's runtime, not by `render()`: `createApp({ root }).mount(main(app))`, where `main` is the entry module `src/App.rx`. JavaScript imports only an entry. The other `.rx` modules import each other with the extension spelled out (`import { Counter } from "./components/Counter.rx"`).
- **`@reactivescript/runtime`** is the small layer compiled `.rx` code calls over Solid. `solid-js`, `@solidjs/web` and `@solidjs/signals` are its peers, installed as dependencies here.

## What the `.rx` files show

- **`src/App.rx`** is the entry: its default component is what the runtime mounts.
- **`src/components/Counter.rx`** shows a `source`, an equation over a prop (`milestone = props.milestone ?? 5`), an `if` block, and a scoped `<style>`.
- **`src/components/Guestbook.rx`** shows a functional write (`guests := gs => [...gs, next]`), a `for` block, and a module-level constant.
- **`src/components/UserCard.rx`** shows an `await` in an equation, wrapped in `errored` and `loading` regions. While the next user loads, the card keeps showing the last one: the heading reads ahead with `latest id`, and `pending? user` dims the stale row. User 4 does not exist, so "Next user" from user 3 shows the failure in the `errored` region.
- **`src/users.ts` with `src/users.d.rx`**: `.rx` sees a JavaScript module through a declaration file beside it. `pure fn fetchUser` says the function is safe to call from an equation, and `rejects(NotFound)` names the error class it can fail with. Swap the body of `fetchUser` for a real `fetch()`.

## What stays `.ts`

- **`src/main.ts`** and **`src/App.test.ts`**: JavaScript mounts the program. Both carry a `@ts-expect-error` on the `App.rx` import, because the `rx-tsc` projection of an entry has no default export yet. Remove it once a ReactiveScript release projects one.
- **`src/users.ts`**, **`vite.config.ts`**, **`vitest-setup.ts`**.

## Editor setup

- **VS Code, Cursor, VSCodium:** install the ReactiveScript extension (publisher `solidjs`, recommended via `.vscode/extensions.json`) from the VS Code Marketplace or Open VSX. It brings highlighting, the checker's diagnostics with their rules, and TypeScript's hover, completion and type errors on `.rx`.
- **Other editors:** run the language server this template installs, `npx @reactivescript/language-server --stdio`.

## Type checking and linting

`pnpm typecheck` runs `rx-tsc --noEmit`, which is `tsc` with the `.rx` modules in the program. It reports TypeScript's errors on the `.rx` source and then the checker's errors with their rules. Vite compiles `.rx` without type-checking it, as it does `.ts`, so run this in CI. `tsconfig.json` excludes `src/**/*.d.rx`, because `rx-tsc` 0.3.1 crashes on a declaration file in its program.

oxlint cannot parse `.rx`, so `oxlint.config.ts` ignores those files; `pnpm lint` covers the `.ts` files. The checker is the `.rx` linter.

## Known limits

- **Styles in dev:** an edit to a `<style>` block in a component other than `App.rx` does not show until you restart `vite`. The program's stylesheet is attached to the entry, and the dev server refreshes only the CSS of the file you edited. Production builds are correct.
- **Edits reload the page:** an `.rx` edit in dev does a full page reload, so component state resets.
- **Browser globals** (`console`, `document`, `window`) are not in scope in `.rx`. Bring JavaScript in through an import from a `.ts` or `.js` module.
- **No router integration yet:** a `.rx` program owns its whole view. This template is client-only; ReactiveScript's streamed SSR is not wired up here.
- **TypeScript only:** there is no JavaScript flavor of this template.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and the [ReactiveScript Website](https://reactivescript.dev/), and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Checks every `.rx` module and builds the static production site to `dist`.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite: it mounts the program into jsdom with `createApp` and drives it.

### `npm run typecheck`

Type checks the project with `rx-tsc`, including the `.rx` modules.

### `npm run lint`

Lints the `.ts` files with oxlint.
