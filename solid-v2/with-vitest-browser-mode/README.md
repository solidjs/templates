## Solid `with-vitest-browser-mode` template

This is `basic` with its test suite moved from jsdom to [Vitest browser mode](https://vitest.dev/guide/browser/) — same routes, same demo, and the **same test file**: `src/components/Counter.test.tsx` runs unchanged, in a real Chromium page instead of a simulated DOM. The diff against `basic` is the documentation of what browser mode changes.

**Deployment contract** (inherited from `basic`): zero server dependencies — `vite build` emits a purely static site; deploy `dist/client` anywhere. Test tooling never ships to the client.

## How browser mode fits this stack

- The `test.browser` block in `vite.config.ts` replaces `environment: 'jsdom'`: Vitest launches Chromium through Playwright (`provider: playwright()` from `@vitest/browser-playwright`) and runs each test file in a real page — real layout, real events, real CSS.
- `@solidjs/testing-library` and the `@testing-library/jest-dom` matchers work identically in both environments, which is why the test file needs no changes — jsdom is just no longer approximating the browser. Note Solid 2.0 batches DOM updates, so tests call `flush()` after firing events before asserting.
- Browsers need their binaries once per machine: `npx playwright install chromium`. If a test run fails asking for it, that is the fix.
- Set `headless: false` (or run `vitest --ui`) to watch tests execute in the open browser.

Everything else — file-system routing, data loading, the one-boolean `ssr: true` flip — is `basic`; see its README.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
$ npx playwright install chromium # once per machine
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

Runs the test suite in headless Chromium.

## Deployment

Deploy the `dist/client` folder to any static host provider (netlify, surge, now, etc.)
