// Pre-dispatch server-function configuration (pinned into the handler graph
// via `serverFunctions.configure` in vite.config.ts — it loads before any
// dispatch, on the dev middleware and the production handler alike).
//
// Registering the router as the single-flight collector is what turns a
// mutation into ONE round trip: the action response carries the refreshed
// `query()` data for the page the client will show (the collector reruns
// that route's preloads on the server), and the router seeds its cache from
// the envelope instead of refetching.
import { configureServerFunctionsServer } from '@solidjs/web/server-functions/server';
import { createFlightDataCollector } from '@solidjs/router/server';

import { Router } from './router';

configureServerFunctionsServer({
  collectFlightData: createFlightDataCollector(Router),
});
