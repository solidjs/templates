## Solid `with-tanstack-router` template

This is `basic` with the routing layer swapped for [TanStack Router](https://tanstack.com/router)'s Solid adapter — same demo, same tests, but routing, data loading, and navigation are TanStack's own mental model, not `@solidjs/router`'s. It doubles as the "bring your own router" documentation for the Solid 2.0 turnkey stack.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere.

## Who owns what

- **`@solidjs/vite-plugin` owns** the compile and the app shell: the JSX transform (including TanStack's own components — the adapter ships Solid source through its `solid` export condition and compiles like your code), the turnkey entries around `src/App.tsx`, and the `src/Document.tsx` document shell. It neither knows nor cares which router renders inside.
- **TanStack owns** everything routing: the route files under `src/routes` (their naming convention — `__root.tsx`, `index.tsx`, `users.$id.tsx`), loaders, and navigation. `@tanstack/router-plugin` in `vite.config.ts` watches those files and regenerates `src/routeTree.gen.ts`, the typed route tree `src/App.tsx` feeds to `createRouter`.

## The TanStack idioms in this template

- **Typesafe navigation**: `<Link to="/users/$id" params={{ id: '1' }}>` typechecks `to` and `params` against the actual route tree, via the `Register` interface augmentation in `src/App.tsx`. A typo'd path is a compile error.
- **Loader-driven data**: `src/routes/users.$id.tsx` declares `loader: ({ params }) => fetchUser(params.id)` — the router starts it when navigation begins, caches it per params, and `Route.useLoaderData()` hands the component typed, already-loaded data (an accessor, reactive to param changes).
- **Head management**: routes declare `head` options; `<HeadContent />` in the root route renders the matched routes' titles. (`@solidjs/meta` is not used here — head management is part of what the router owns.)
- **Route-level code splitting**: `autoCodeSplitting: true` splits each route's component out of the entry automatically.

## SSR note

This template ships client-mode (`start: true` without `ssr`). TanStack's SSR model needs per-request router wiring — create the router, `await router.load()` for the matched route's loaders, dehydrate state into the stream — which the plugin's generated streaming entry does not perform for third-party routers today. Flipping `ssr: true` as-is renders a 500 (`RouterProvider` reads router state that only `load()` initializes). When the adapter's SSR utilities stabilize, this template can grow the flip; until then the honest posture is the static shell.

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

The page will reload if you make edits (`routeTree.gen.ts` regenerates as you add route files).<br>

### `npm run build`

Builds the static production site to `dist/client`, routes code-split.

### `npm run serve`

Serves the production build locally.

### `npm test`

Runs the test suite.

## Deployment

Deploy the `dist/client` folder to any static host provider (netlify, surge, now, etc.)
