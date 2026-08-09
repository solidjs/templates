// Pre-dispatch server-function configuration (pinned into the handler graph
// via `serverFunctions.configure` in vite.config.ts — it loads before any
// dispatch, on the dev middleware and the production handler alike).
//
// This is the server half of single-flight on a router Solid doesn't own.
// The hook's contract is router-agnostic: core hands it the pre-digested
// mutation outcome (the URL the client will show, the mutation's folded
// cookie headers) and takes back an opaque payload to fold into the SAME
// response. The strategy here is pure TanStack: build a router + Query
// cache for the target URL, run its loaders, and ship `dehydrate(cache)` —
// the payload IS a dehydrated QueryClient, which the client half
// (src/App.tsx) consumes with TanStack's own `hydrate`.
import { configureServerFunctionsServer } from '@solidjs/web/server-functions/server';
import { provideRequestEvent } from '@solidjs/web/storage';
import { dehydrate } from '@tanstack/solid-query';
import { createMemoryHistory } from '@tanstack/solid-router';

import { createQueryClient, settled } from './lib/queries';
import { createAppRouter } from './router';

configureServerFunctionsServer({
  async collectFlightData(sourceEvent, outcome) {
    // No target (a non-browser caller, or a redirect leaving the app) means
    // nothing to produce data for.
    if (!outcome.targetUrl) return undefined;
    const url = new URL(outcome.targetUrl);

    // The flight event: the source event pointed at the target URL, with
    // the mutation's cookie effects already folded in — so a session the
    // mutation just wrote (login) or cleared (logout) is what the reads
    // below see, exactly as the browser's next request would.
    const event = {
      ...sourceEvent,
      locals: { ...sourceEvent.locals },
      request: new Request(outcome.targetUrl, { headers: outcome.foldedHeaders }),
    };

    return provideRequestEvent(event, async () => {
      // A fresh cache, the target URL's matched loaders prefetching into
      // it, then the settle — the same sequence SSR runs in src/setup.tsx,
      // minus the render.
      const queryClient = createQueryClient();
      const router = createAppRouter(
        queryClient,
        createMemoryHistory({ initialEntries: [url.pathname + url.search] }),
      );
      await router.load();
      await settled(queryClient);

      const state = dehydrate(queryClient);
      return state.queries.length > 0 ? state : undefined;
    });
  },
});
