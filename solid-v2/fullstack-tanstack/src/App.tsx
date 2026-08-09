import type { DehydratedState } from '@tanstack/solid-query';
import { QueryClientProvider, hydrate } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';
import { subscribeFlightData } from '@solidjs/web/server-functions';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';
import './App.css';

// The client's Query cache: one instance for the session. Everything the
// server hands back — the SSR handoff below, single-flight payloads after
// mutations — lands here, and useQuery reads throughout the app follow.
const queryClient = createQueryClient();

declare global {
  interface Window {
    /** The SSR handoff: `dehydrate(queryClient)` from src/setup.tsx. */
    __QUERY_STATE__?: DehydratedState;
  }
}

// Prime the cache from the server render before anything reads: the inline
// script src/Document.tsx emitted carries every query SSR fetched, so
// hydration renders from data instead of refetching it.
if (typeof window !== 'undefined' && window.__QUERY_STATE__) {
  hydrate(queryClient, window.__QUERY_STATE__);
}

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

// Match the URL and run the loaders BEFORE the entry hydrates (top-level
// await pauses the module until the router is ready): with the cache
// already primed above, the first client render is then synchronous and
// claims the server-rendered HTML instead of re-rendering it.
if (typeof window !== 'undefined') {
  await router.load();
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
