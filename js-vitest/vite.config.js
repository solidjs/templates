import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: {
      web: [/\.jsx?$/],
    },
    setupFiles: './setupVitest.js',
    deps: {
      // solid and solid-testing-library need to be inline to work around a
      // resolution issue in vitest. If you encounter an error like:
      // `'solid-js/web' does not provide an export named 'hydrate'`,
      // you probably need to add something to this list. Setting this to
      // `[/node_modules/`] will almost certainly solve the problem, but might
      // impact performance.
      inline: [/solid-js/, /solid-testing-library/],
    },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    threads: false,
    isolate: false,
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
