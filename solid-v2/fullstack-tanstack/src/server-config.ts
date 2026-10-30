// Pre-dispatch server-function configuration (pinned into the handler graph
// via `serverFunctions.configure` in vite.config.ts — it loads before any
// dispatch, on the dev middleware and the production handler alike).
//
// This is the server half of single-flight on a router Solid doesn't own,
// composed entirely from the three packages' own seams. solid-query's
// QueryClientProvider subscribes the client to its named flight-data source
// (FLIGHT_DATA_SOURCE, "sq"); registering the matching producer here is
// everything the server needs. solid-router's `loadFlightTarget` is the
// router half: it runs the matched routes' data functions for the URL the
// client will show after the mutation — with the mutation's cookie effects
// already folded in (a session the mutation just wrote or cleared is what
// the loaders see, exactly as the browser's next request would) — and hands
// the loaded router to `collect`. The collection is pure TanStack Query:
// loaders only *start* their prefetches, so `dehydrateSettled` awaits every
// in-flight fetch and ships the dehydrated cache. The payload IS a
// dehydrated QueryClient, which the client provider consumes with
// TanStack's own `hydrate`.
import { registerFlightDataSource } from '@solidjs/web/server-functions/server';
import { FLIGHT_DATA_SOURCE, dehydrateSettled } from '@tanstack/solid-query';
import { loadFlightTarget } from '@tanstack/solid-router/ssr/server';

import {
  planFlightCollection,
  runFlightRecipes,
  setFlightGate,
} from './lib/flight';
import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';

registerFlightDataSource(FLIGHT_DATA_SOURCE, (event, outcome) => {
  // A fresh cache and router per collection: the flight load runs the
  // target URL's loaders into it, the same sequence SSR runs in
  // src/setup.tsx, minus the render. (`loadFlightTarget` resolves undefined
  // when there is no target — a non-browser caller, or a redirect leaving
  // the app.)
  //
  // When the mutation declared its scope (`reload({ revalidate })`), the
  // plan (src/lib/flight.ts) scopes that collection: the gate skips loader
  // prefetches for data the caller already holds that no declared key
  // names, and the recipes re-execute declared queries the loaders don't
  // own. Undeclared mutations get an empty plan — full collection, exactly
  // the sequence above.
  const queryClient = createQueryClient();
  const plan = planFlightCollection(outcome.request, outcome.revalidateKeys);
  setFlightGate(queryClient, plan.skip);
  return loadFlightTarget({
    router: createAppRouter(queryClient),
    event,
    outcome,
    async collect() {
      await runFlightRecipes(queryClient, plan.recipes);
      const state = await dehydrateSettled(queryClient);
      // With keys declared, an empty slice still ships: delivering it is
      // what hands the response to the client-side sweep.
      return state.queries.length > 0 || outcome.revalidateKeys
        ? state
        : undefined;
    },
  });
});
