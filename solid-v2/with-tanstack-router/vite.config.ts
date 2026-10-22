import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin generates
  // the entries around src/App.tsx (wrapped in src/Document.tsx) and `vite build`
  // prerenders the shell into a purely static dist/client.
  plugins: [
    // Generates src/routeTree.gen.ts from src/routes; must be registered
    // before solid().
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    // Client mode only: TanStack's SSR needs per-request router wiring the
    // generated streaming entry doesn't perform — see the README's SSR note.
    solid({ start: true, diagnostics: true }),
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
    assetsInlineLimit: 0,
  },
});
