// An API route: uppercase method exports answer HTTP requests at this
// module's route path (/api/users), dispatched by the createAPIHandler
// middleware in src/middleware.ts. No default export means no page.
import type { APIHandler } from 'filesystem-routing/api';

import { listUsers } from '../../server/db';

export const GET: APIHandler = () => Response.json(listUsers());
