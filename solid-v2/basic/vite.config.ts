import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  // Turnkey streaming SSR: the plugin generates the server and client
  // entries around src/App.tsx, wrapped in src/Document.tsx. Dev streams
  // the render through the vite dev server; `vite build` produces
  // dist/client + dist/server, and dist/server/server.js exports
  // `handleRequest(request)` — see server.js for the production server.
  plugins: [
    // set `ssr: false` for a client-rendered app with a static shell.
    // `extensions` makes vite-plugin-solid also compile the `?pick=` route
    // modules the fileRoutes plugin emits (their ids end in a query string).
    solid({ start: true, ssr: true, extensions: ['.jsx', '.tsx'] }),
    fileRoutes(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
