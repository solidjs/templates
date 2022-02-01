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
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
