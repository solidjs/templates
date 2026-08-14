// The router instance, in its own module so both graphs share one source
// of truth: src/App.tsx renders it; src/server-config.ts hands it to the
// single-flight data collector so mutation responses carry refreshed route
// data. Its routes come from the file system (src/routes, scanned by the
// fileRoutes plugin in vite.config.ts).
import { pageRoutes } from 'virtual:file-routes';
import { createRouter } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';

export const Router = createRouter({ routes: fileRoutes(pageRoutes) });

export const { paths } = Router;