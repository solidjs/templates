import { fileURLToPath } from 'node:url';
import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  // Turnkey streaming SSR: no index.html and no entry files — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx.
  // `vite build` emits client assets to dist/client and the request handler
  // to dist/server, plus the Node server (dist/server/node.js) `npm start` runs.
  plugins: [
    solid({
      start: {
        middleware: './src/middleware.ts',
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
      // it registers the router's single-flight collector.
      serverFunctions: { configure: './src/server-config.ts' },
      // `extensions` makes @solidjs/vite-plugin also compile the `?pick=` route
      // modules the fileRoutes plugin emits (their ids end in a query string).
      extensions: ['.jsx', '.tsx'],
    }),
    // `httpMethods` also scans route modules for GET/POST/... exports (API
    // routes); handler modules never enter the client bundle.
    fileRoutes({ httpMethods: true, types: true }),
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
          // environment:'node' projects get the server posture from the
          // plugin automatically (server conditions, framework inlined).
          environment: 'node',
          include: ['src/server/**/*.test.ts'],
          alias: [
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
