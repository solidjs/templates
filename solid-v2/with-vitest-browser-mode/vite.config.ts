import { playwright } from '@vitest/browser-playwright';
import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx
  // (or a built-in shell). `vite build` prerenders the shell into
  // dist/client/index.html and emits a purely static dist/client.
  plugins: [
    // `extensions` makes vite-plugin-solid also compile the `?pick=` route
    // modules the fileRoutes plugin emits (their ids end in a query string).
    solid({ start: true, extensions: ['.jsx', '.tsx'] }), // add `ssr: true` for streaming SSR
    fileRoutes(),
  ],
  server: {
    port: 3000,
  },
  test: {
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    // Browser mode ignores `environment`, but set it explicitly so
    // vite-plugin-solid's jsdom default doesn't fire — vitest's startup
    // probe for the jsdom package fails the run (exit 1) even though the
    // tests pass in Chromium. Removable once the plugin gates its default
    // on `browser.enabled`.
    environment: 'node',
    // Tests run in a real Chromium page instead of a simulated jsdom
    // document. `vitest --ui` (or headless: false) opens it visibly.
    browser: {
      enabled: true,
      provider: playwright(), // or 'webdriverio'
      headless: true,
      // at least one instance is required
      instances: [{ browser: 'chromium' }],
    },
  },
  build: {
    target: 'esnext',
    // Keep images as asset files instead of inlining them into the JS bundle.
    assetsInlineLimit: 0,
  },
});
