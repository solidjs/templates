// The Query layer: every read the app makes, declared once as typed
// queryOptions wrapping a Solid server function. Route loaders prefetch
// these, components read them with useQuery, and the single-flight
// machinery (src/server-config.ts) refreshes them by key — three consumers,
// one definition.
import type { FetchQueryOptions } from '@tanstack/solid-query';
import { QueryClient, queryOptions } from '@tanstack/solid-query';

import { flightGateSkips, serverQueryFn } from './flight';
import { getCurrentUser, getUser, getUsers } from './users';

export const usersQuery = () =>
  queryOptions({ queryKey: ['users'], queryFn: () => getUsers() });

export const userQuery = (id: string) =>
  queryOptions({ queryKey: ['users', id], queryFn: () => getUser(id) });

// The session read is component-owned: no route prefetches it, because it
// is shell state every page shows rather than any page's data. That puts
// it outside every loader — so this one query declares its fetch as a
// recipe (`serverQueryFn`, src/lib/flight.ts): when a mutation names its
// key (`reload({ revalidate: 'current-user' })`), the server re-executes
// the call and ships the fresh session on the mutation's own response.
// Loader-owned queries like the two above never need this — plain queryFn.
export const currentUserQuery = () =>
  queryOptions({
    queryKey: ['current-user'],
    ...serverQueryFn(getCurrentUser),
  });

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

// The loaders' prefetch hint. Fire-and-forget on every side: loaders
// *start* their queries as navigation begins (and on hover preloads)
// without blocking the router — the navigation commits immediately and
// components pick the data up at the read point. On the server this is
// what lets SSR stream each Loading boundary as its query settles instead
// of collapsing TTFB to the slowest fetch. No hydration exception: the
// client never runs a boot load pass (createRouter primes matches from the
// server's registry entries), so the first time a loader runs client-side
// is a real navigation. During single-flight collection the gate
// (src/lib/flight.ts) can answer that the mutation's client already holds
// this query and didn't declare it stale — then the prefetch is skipped and
// the response ships without it.
export function prefetch(
  queryClient: QueryClient,
  options: FetchQueryOptions<any, any, any, any>,
) {
  if (flightGateSkips(queryClient, options.queryKey)) return;
  void queryClient.prefetchQuery(options);
}
