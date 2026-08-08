import { fileURLToPath } from 'node:url';
import { PageFileSystemRouter } from 'filesystem-routing';
import { DEFAULT_EXTENSIONS, fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

const routes = (httpMethods: boolean) =>
  new PageFileSystemRouter({
    dir: fileURLToPath(new URL('./src/routes', import.meta.url)),
    extensions: DEFAULT_EXTENSIONS,
    httpMethods,
  });

export default defineConfig(({ mode }) => ({
  // Turnkey streaming SSR: no index.html and no entry files — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx.
  // `vite build` emits static client assets to dist/client and the request
  // handler to dist/server; `npm start` serves both with server.js.
  plugins: [
    // Per-environment routers: only the server scans route modules for
    // GET/POST/... exports (API routes), so handler modules — and the
    // server-only code they import — stay out of the client bundle.
    fileRoutes({
      routers: { client: routes(false), ssr: routes(true) },
    }),
    solid({
      start: {
        // Fetch-style chain fronting every request: decodes the session
        // cookie into event.locals and dispatches API routes.
        middleware: './src/middleware.ts',
      },
      // Set to false for a static shell + API server: pages render on the
      // client while server functions and API routes keep working.
      // (Component tests always compile with the client posture.)
      ssr: mode !== 'test',
      // Compiles 'use server' functions into fetch calls on the client and
      // serves them from the /_server endpoint.
      serverFunctions: true,
      // `extensions` makes vite-plugin-solid also compile the `?pick=` route
      // modules the fileRoutes plugin emits (their ids end in a query string).
      extensions: ['.jsx', '.tsx'],
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    // if you have few tests, try commenting this
    // out to improve performance:
    isolate: false,
  },
  build: {
    target: 'esnext',
    // Keep images as asset files instead of inlining them into the JS bundle.
    assetsInlineLimit: 0,
  },
}));
