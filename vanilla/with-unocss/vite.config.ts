import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import UnocssPlugin from '@unocss/vite';

export default defineConfig({
  plugins: [
    UnocssPlugin({
      // your config or in uno.config.ts
    }),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
