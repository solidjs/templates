import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx
  // (or a built-in shell). `vite build` prerenders the shell into
  // dist/client/index.html and emits a purely static dist/client.
  plugins: [
    solid({ start: true }), // add `ssr: true` for streaming SSR
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
