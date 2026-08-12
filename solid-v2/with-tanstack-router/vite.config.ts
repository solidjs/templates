import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx
  // (or a built-in shell). `vite build` prerenders the shell into
  // dist/client/index.html and emits a purely static dist/client.
  plugins: [
    // Scans src/routes and generates src/routeTree.gen.ts — the typed route
    // tree — on dev and build. Must be registered before solid().
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    // Client mode only for now: TanStack's SSR needs per-request router
    // wiring (router.load() + dehydration) that the generated streaming
    // entry doesn't perform — see the README's SSR note.
    solid({ start: true }),
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
