import { defineConfig } from 'vite';
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from '@solidjs/start/config';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    solidStart(),
    tanstackRouter({ target: 'solid' }),
    nitro()
  ]
});
