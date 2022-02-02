const { resolve } = require('path');
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import UnocssPlugin from '@unocss/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnocssPlugin({
      // your config or in uno.config.ts
    }),
  ],
  build: {
    polyfillDynamicImport: false,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
      },
    },
    target: 'esnext',
  },
});
