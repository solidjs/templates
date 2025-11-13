import { defineConfig } from '@solidjs/start/config';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  vite: {
    // @ts-expect-error Vite 7 plugin types
    plugins: [tanstackRouter({ target: 'solid' })],
  },
});
