// The router lives in its own module so src/App.tsx (render) and
// src/server-config.ts (single-flight collector) share one instance.
import { pageRoutes } from 'virtual:file-routes';
import { createRouter, intentPreload } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';

// Link preloading is opt-in. intentPreload() is the hover/focus/touch
// strategy: resting on a link warms its code and runs its preload, which is
// what makes navigation feel instant once the data lives on the server.
export const Router = createRouter({
  routes: fileRoutes(pageRoutes),
  preloadLinks: intentPreload(),
});

export const { paths } = Router;
