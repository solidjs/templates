import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const assetsDir = '';
//const assetsDir = 'assets/';

const outputDefaults = {
  //format: 'iife', // default

  // remove hashes from filenames
  entryFileNames: `${assetsDir}[name].js`,
  chunkFileNames: `${assetsDir}[name].js`,
  assetFileNames: `${assetsDir}[name].[ext]`,
}

export default defineConfig({
  root: "demo",
  base: "./", // generate relative paths in html
  plugins: [
    solidPlugin(),
  ],
  server: {
    //host: 'localhost',
    //port: 3000,
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    //sourcemap: true,
    minify: false, // smaller git diffs
    // example sizes for solidjs app with monaco-editor
    // false: 5396.78 KiB // smaller git diffs
    // 'esbuild': 2027.36 KiB // default
    // 'terser': 2002.37 KiB
    rollupOptions: {
      output: {
        ...outputDefaults,
      }
    },
  },
  worker: {
    rollupOptions: {
      output: {
        ...outputDefaults,
      }
    },
  },
});
