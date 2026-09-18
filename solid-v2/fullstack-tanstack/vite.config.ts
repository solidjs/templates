import { fileURLToPath } from 'node:url';
import { routePathFromFile } from 'filesystem-routing';
import { fileRoutes } from 'filesystem-routing/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  // Turnkey streaming SSR under a third-party router: no index.html and no
  // entry files — the plugin generates the entries around src/App.tsx,
  // wrapped in src/Document.tsx. `vite build` emits client assets to
  // dist/client and the request handler to dist/server, plus the Node server
  // (dist/server/node.js) `npm start` runs.
  plugins: [
    // Generates src/routeTree.gen.ts from src/routes; must be registered
    // before solid(). Each route's component compiles to a lazy chunk that
    // resolves at the read point during hydration (the router commits the
    // server's matches from Solid's hydration registry before rendering), so
    // no chunk-preload manifest from TanStack's start layer is needed.
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solid({
      start: {
        middleware: './src/middleware.ts',
        // Per-request SSR preparation: builds this request's TanStack
        // router + Query cache and runs the loaders (see src/setup.tsx).
        // Ignored when `ssr` is false.
        setup: './src/setup.tsx',
        // Emit dist/server/node.js: a ready-to-run Node server (static
        // assets + the handler). Other platforms import dist/server/server.js.
        node: true,
        // Typed env is on by convention: ./env.ts is probed automatically.
        // (Set `env: false` here to opt out.)
      },
      // Set to false for a static shell + API server: pages render on the
      // client while server functions, sessions, and API routes keep working.
      ssr: true,
      // Dev-only: capture control at /__solid/diagnostics (see AGENTS.md).
      diagnostics: true,
      // The configure module runs in the handler graph before any dispatch —
      // it registers the Query single-flight collector.
      serverFunctions: { configure: './src/server-config.ts' },
    }),
    // API routes only — TanStack owns src/routes, so the file-system router
    // scans src/api instead and mounts every module under /api.
    fileRoutes({
      dir: 'src/api',
      httpMethods: true,
      toPath: (file) => '/api' + routePathFromFile(file),
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    // Two projects because they need different halves of the framework:
    // component tests run in a DOM against the browser build, server-runtime
    // tests (the session suite) run in node against the real server build.
    projects: [
      {
        extends: true,
        test: {
          name: 'client',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
        },
      },
      {
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/server/**/*.test.ts'],
          // Inline the framework so the aliases below decide which build
          // loads (externalized modules resolve through node instead).
          server: { deps: { inline: [/@solidjs[+/]web/] } },
          alias: [
            // The test pipeline resolves the framework's browser build even
            // in node (the client posture applies pipeline-wide), so the
            // main entry is pinned to the server build here.
            {
              find: /^@solidjs\/web$/,
              replacement: fileURLToPath(
                new URL(
                  './node_modules/@solidjs/web/dist/server.js',
                  import.meta.url,
                ),
              ),
            },
            // Inlines the storage module so its own framework import goes
            // through the alias above instead of node's externalized copy.
            {
              find: /^@solidjs\/web\/storage$/,
              replacement: fileURLToPath(
                new URL(
                  './node_modules/@solidjs/web/storage/dist/storage.js',
                  import.meta.url,
                ),
              ),
            },
            // Tests run outside the turnkey server: the plugin's env module
            // is stubbed with the same contract (live process.env reads).
            {
              find: 'virtual:env/server',
              replacement: fileURLToPath(
                new URL('./vitest-env-server-stub.ts', import.meta.url),
              ),
            },
          ],
        },
      },
    ],
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
});
