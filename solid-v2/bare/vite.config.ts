import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [solid({ start: true, diagnostics: true })],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
});
