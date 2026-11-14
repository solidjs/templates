import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  // @solidjs/vite-plugin compiles `.rx` modules with @reactivescript/compiler
  // when it is installed; no option is needed.
  plugins: [solid({ diagnostics: true })],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
  },
  build: {
    target: 'esnext',
  },
});
