// An API route: uppercase method exports answer HTTP requests at this
// module's route path (/api/users), dispatched by the createAPIHandler
// middleware in src/middleware.ts. These live under src/api — not
// src/routes, which belongs to TanStack Router — and mount at /api via the
// fileRoutes config in vite.config.ts.
import type { APIHandler } from 'filesystem-routing/api';

import { listUsers } from '../server/db';

export const GET: APIHandler = () => Response.json(listUsers());
