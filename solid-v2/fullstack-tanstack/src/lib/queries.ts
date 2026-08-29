// The Query layer: every read the app makes, declared once as typed
// queryOptions wrapping a Solid server function. Route loaders prefetch
// these, components read them with useQuery, and the single-flight
// machinery (src/server-config.ts, src/App.tsx) refreshes them by key —
// three consumers, one definition.
import type { FetchQueryOptions } from '@tanstack/solid-query';
import { QueryClient, queryOptions } from '@tanstack/solid-query';

import { getCurrentUser, getUser, getUsers } from './users';

export const usersQuery = () =>
  queryOptions({ queryKey: ['users'], queryFn: () => getUsers() });

export const userQuery = (id: string) =>
  queryOptions({ queryKey: ['users', id], queryFn: () => getUser(id) });

export const currentUserQuery = () =>
  queryOptions({ queryKey: ['current-user'], queryFn: () => getCurrentUser() });

// One factory for every side that needs a cache: the client boot
// (src/App.tsx, one for the session), the per-request SSR setup
// (src/setup.tsx), and the single-flight collector (src/server-config.ts).
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data the server just rendered (or a mutation just refreshed) is
        // fresh — without this, every observer would kick off a refetch the
        // moment it mounts, defeating both SSR hydration and single-flight.
        staleTime: 30_000,
      },
    },
  });
}

// The loaders' prefetch hint, hydration-boot aware. Fire-and-forget on
// every side: loaders *start* their queries as navigation begins (and on
// hover preloads) without blocking the router — the navigation commits
// immediately and components pick the data up at the read point. On the
// server this is what lets SSR stream each Loading boundary as its query
// settles instead of collapsing TTFB to the slowest fetch.
//
// The one exception is the client boot: loaders run inside the pre-hydrate
// `router.load()` (src/App.tsx), before QueryClientProvider's channel has
// primed the cache with the entries the server is shipping — fetching then
// would refetch everything the server just rendered, so the hint stands
// down. (A query SSR failed to dehydrate is not stranded: the channel's
// done marker releases its useQuery, which then fetches.)
let bootLoading = false;

export function prefetch(
  queryClient: QueryClient,
  options: FetchQueryOptions<any, any, any, any>,
) {
  if (bootLoading) return;
  void queryClient.prefetchQuery(options);
}

// The client boot's router pre-load (src/App.tsx), with prefetch hints
// paused for its duration. Only ever called on the client, so the module
// flag cannot leak across concurrent server requests.
export async function bootLoad(router: { load: () => Promise<void> }) {
  const entryHref = window.location.href;
  bootLoading = true;
  try {
    await router.load();
  } finally {
    bootLoading = false;
  }
  // Server-side redirects answer a real 30x (src/setup.tsx), so this load
  // normally lands where the server rendered. But a `beforeLoad` can still
  // diverge on the client — client-only state, a session expiring between
  // the two runs — and the router will have already moved the URL while the
  // markup below is still the abandoned route's. Hydration cannot claim
  // that; it would come up blank. A full document load of the target gets
  // its real SSR instead, and the never-resolving await keeps the doomed
  // hydration from starting while the navigation tears this page down.
  if (window.location.href !== entryHref) {
    window.location.reload();
    await new Promise(() => {});
  }
}