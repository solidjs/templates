// The router lives in its own module so src/App.tsx (render) and
// src/server-config.ts (single-flight collector) share one instance.
import { pageRoutes } from 'virtual:file-routes';
import { createRouter } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';

export const Router = createRouter({ routes: fileRoutes(pageRoutes) });

export const { paths } = Router;