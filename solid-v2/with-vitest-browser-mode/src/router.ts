import { pageRoutes } from 'virtual:file-routes';
import { createRouter, intentPreload } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';

// Link preloading is opt-in. intentPreload() warms a link's code and runs
// its preload when the pointer rests on it (or on focus/touch).
export const Router = createRouter({
  routes: fileRoutes(pageRoutes),
  preloadLinks: intentPreload(),
});

export const { paths } = Router;
