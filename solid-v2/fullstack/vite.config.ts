import { fileURLToPath } from 'node:url';
import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  // Turnkey streaming SSR: no index.html and no entry files — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx.
  // `vite build` emits static client assets to dist/client and the request
  // handler to dist/server; `npm start` serves both with server.js.
  plugins: [
    solid({
      start: {
        // Fetch-style chain fronting every request: dispatches API routes.
        middleware: './src/middleware.ts',
        // Typed env is on by convention: ./env.ts is probed automatically
        // and validated — server vars are read from process.env when the
        // server boots, client vars are baked at build time. (Set
        // `env: false` here to opt out.)
      },
      // Set to false for a static shell + API server: pages render on the
      // client while server functions, sessions, and API routes keep
      // working. (Tests always compile with the client posture.)
      ssr: true,
      // Dev-only agent/diagnostics surface: exposes capture control at
      // /__solid/diagnostics on the dev server (see AGENTS.md). No-op in build.
      diagnostics: true,
      // Compiles 'use server' functions into fetch calls on the client and
      // serves them from the /_server endpoint. The configure module runs
      // in the handler graph before any dispatch — it registers the
      // router's single-flight collector (see src/server-config.ts).
      serverFunctions: { configure: './src/server-config.ts' },
      // `extensions` makes @solidjs/vite-plugin also compile the `?pick=` route
      // modules the fileRoutes plugin emits (their ids end in a query string).
      extensions: ['.jsx', '.tsx'],
    }),
    // `httpMethods` also scans route modules for GET/POST/... exports (API
    // routes). One router serves both sides: handler modules — and the
    // server-only code they import — never enter the client bundle.
    fileRoutes({ httpMethods: true, types: true }),
  ],
  server: {
    port: 3000,
  },
  test: {
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    // Two projects because they need different halves of the framework:
    // component tests run in a DOM against the browser build (the test
    // pipeline's default posture), while server-runtime tests (the session
    // suite) run in node against the real server build.
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
          // plugin automatically: server resolve conditions, the framework
          // inlined, and ssr codegen.
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
    // Keep images as asset files instead of inlining them into the JS bundle.
    assetsInlineLimit: 0,
  },
});
