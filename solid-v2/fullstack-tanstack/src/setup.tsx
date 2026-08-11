// The per-request SSR seam (wired via `start.setup` in vite.config.ts): the
// generated server entry awaits this default export after the middleware
// chain and renders the returned component in App's place, inside the
// Document. This is what lets a router Solid doesn't own drive streaming
// SSR — each request gets its own TanStack router and Query cache.
import type { RequestEvent } from '@solidjs/web';
import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/solid-router';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';

export default async function setup(event: RequestEvent) {
  const url = new URL(event.request.url);

  // Per-request instances: the cache and router live exactly as long as the
  // request, so one user's data can never leak into another's render.
  const queryClient = createQueryClient();
  const router = createAppRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [url.pathname + url.search] }),
  );

  // Match the URL and start the matched loaders. The loaders only *start*
  // their prefetches (they are non-blocking hints) — the render below begins
  // while the fetches are still in flight, and each useQuery read suspends
  // on its own query. Server functions are called in-process, session cookie
  // and all, since this runs inside the request scope.
  await router.load();

  // No dehydrate/inline-script handoff: QueryClientProvider owns the SSR
  // serialization channel. On the server it streams each query's dehydrated
  // entry into the HTML stream as it settles; the client provider primes its
  // cache from those entries as they arrive, per query — progressive, not a
  // single end-of-render blob.
  return () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
