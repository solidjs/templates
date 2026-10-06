import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: 'src/my-counter.tsx',
      name: '@solidjs/my-counter',
      fileName: 'my-counter',
    },
    rollupOptions: {
      plugins: [
        typescript({
          outDir: 'dist',
          declaration: true,
          declarationDir: 'dist/types',
          include: ['src/*'],
        }),
      ],
    },
  },
});
