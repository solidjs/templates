import type { DehydratedState } from '@tanstack/solid-query';
import { QueryClientProvider, hydrate } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';
import { subscribeFlightData } from '@solidjs/web/server-functions';

import { bootLoad, createQueryClient } from './lib/queries';
import { createAppRouter } from './router';
import './App.css';

// The client's Query cache: one instance for the session. Everything the
// server hands back — the SSR hydration entries QueryClientProvider consumes
// below, single-flight payloads after mutations — lands here, and useQuery
// reads throughout the app follow. (No hand-rolled SSR handoff: the provider
// owns the hydration channel, priming this cache from the server's streamed
// dehydrated entries as they arrive.)
const queryClient = createQueryClient();

// The client half of single-flight — and the opt-in: while a consumer is
// subscribed, every mutation call asks the server to fold refreshed data
// into its own response. That payload is a dehydrated QueryClient (see
// src/server-config.ts), so consuming it is TanStack's own `hydrate`: the
// entries land in the cache, every useQuery on those keys updates, and no
// follow-up refetch happens. The consumer runs before the mutation's
// promise resolves, so by the time `mutate` settles the UI is current.
subscribeFlightData<DehydratedState>((data) => {
  hydrate(queryClient, data);
});

const router = createAppRouter(queryClient);

// Match the URL BEFORE the entry hydrates (top-level await pauses the
// module until the router is ready): this resolves the matched routes' lazy
// chunks and commits the matches, so the first client render claims the
// server-rendered HTML instead of re-rendering it. `bootLoad` pauses the
// loaders' prefetch hints for this one pass — the cache is still cold here
// (QueryClientProvider primes it from the server's streamed entries when it
// hydrates, moments later), so prefetching would refetch everything the
// server just rendered.
if (typeof window !== 'undefined') {
  await bootLoad(router);
}

// The app root: the plugin's generated entries render this component,
// wrapped in src/Document.tsx. (Under SSR, src/setup.tsx renders a
// per-request pairing in its place; this module still provides the client
// boot, so the tree here must mirror the one setup returns.)
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
