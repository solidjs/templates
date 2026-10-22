import { defineConfig } from 'vite';
import { nitro } from "nitro/vite";
import { solidStart } from '@solidjs/start/config';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    solidStart(),
    tanstackRouter({ target: 'solid' }),
    nitro()
  ]
});
