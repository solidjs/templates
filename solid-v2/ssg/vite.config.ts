import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';
import { prerender } from '@solidjs/prerender/vite';

export default defineConfig({
  // Static site generation: the app is a full streaming-SSR Solid app —
  // but only at build time. `vite build` renders every page through the
  // server build, writes the HTML, and bakes each `prerendered()` server
  // function call into a static JSON artifact. What you deploy is
  // dist/client alone: plain files, no server.
  plugins: [
    solid({
      start: true,
      // The server halves are build-time tools here, not deliverables:
      // `ssr` renders the pages the prerenderer writes to disk, and
      // `serverFunctions` lets route data live in 'use server' functions —
      // executed during the build (and against the dev server in dev),
      // never in production.
      ssr: true,
      serverFunctions: true,
      diagnostics: true,
      // `extensions` makes @solidjs/vite-plugin also compile the `?pick=` route
      // modules the fileRoutes plugin emits (their ids end in a query string).
      extensions: ['.jsx', '.tsx'],
    }),
    fileRoutes({ types: true }),
    // Crawls the built app starting at `/`, following same-origin links to
    // discover every page — no route list to maintain. `mode: 'static'`
    // writes all rendered HTML and makes a missing data artifact a hard
    // error (there is no server to fall back to). No impact on dev.
    prerender({ mode: 'static' }),
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
});
