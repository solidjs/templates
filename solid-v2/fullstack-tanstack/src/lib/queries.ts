// The Query layer: every read the app makes, declared once as typed
// queryOptions wrapping a Solid server function. Route loaders prefetch
// these, components read them with useQuery, and the single-flight
// machinery (src/server-config.ts, src/App.tsx) refreshes them by key —
// three consumers, one definition.
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

// Awaits every in-flight fetch in the cache — the server-side settling
// point after `router.load()`, whose loaders only *start* prefetches (they
// don't block navigation). `query.promise` is query-core's public handle on
// the pending fetch; errors surface through the query state, not here.
export async function settled(queryClient: QueryClient) {
  await Promise.all(
    queryClient
      .getQueryCache()
      .getAll()
      .map((query) => query.promise?.catch(() => undefined)),
  );
}
