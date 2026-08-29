// Pre-dispatch server-function configuration (pinned into the handler graph
// via `serverFunctions.configure` in vite.config.ts — it loads before any
// dispatch, on the dev middleware and the production handler alike).
//
// This is the server half of single-flight on a router Solid doesn't own,
// composed from each side's own primitive along its natural boundary:
//
//   - `loadFlightTarget` (the router's) owns the trigger — it derives the
//     flight request for the URL the client will show after the mutation
//     (the mutation's cookie effects already folded in, so a session just
//     written or cleared is what the loaders see), points the router at it,
//     and runs the matched routes' data functions.
//   - `dehydrateSettled` (the query cache's) owns the extraction — loaders
//     only *start* their prefetches, so it waits for every in-flight fetch
//     to land, then dehydrates.
//
// The collector registers under the query cache's source id
// (FLIGHT_DATA_SOURCE, "sq") on Solid's multi-source single-flight channel,
// and the returned slice folds into the SAME response as any other cache's.
// The payload IS a dehydrated QueryClient — QueryClientProvider's built-in
// consumer hydrates it on the client, no app wiring on that side.
import { registerFlightDataSource } from '@solidjs/web/server-functions/server';
import { FLIGHT_DATA_SOURCE, dehydrateSettled } from '@tanstack/solid-query';
import { loadFlightTarget } from '@tanstack/solid-router/ssr/server';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';

registerFlightDataSource(
  FLIGHT_DATA_SOURCE,
  function collectFlightData(event, outcome) {
    // No target (a non-browser caller, or a redirect leaving the app) means
    // nothing to produce data for.
    if (!outcome.targetUrl) return undefined;

    // A fresh cache and router per collection — the same pairing SSR builds
    // per request in src/setup.tsx, minus the render.
    const queryClient = createQueryClient();
    return loadFlightTarget({
      router: createAppRouter(queryClient),
      event,
      outcome,
      collect: async () => {
        const state = await dehydrateSettled(queryClient);
        return state.queries.length > 0 ? state : undefined;
      },
    });
  },
);
