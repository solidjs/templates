/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { playwright } from ' ̰';

export default defineConfig({
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    browser: {
      provider: playwright(), // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [{ browser: 'chromium' }],
    },
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
