// The per-request SSR seam (wired via `start.setup` in vite.config.ts): the
// generated server entry awaits this default export after the middleware
// chain and renders the returned component in App's place, inside the
// Document. This is what lets a router Solid doesn't own drive streaming
// SSR — each request gets its own TanStack router and Query cache, loaded
// before the render begins.
import type { RequestEvent } from '@solidjs/web';
import type { DehydratedState } from '@tanstack/solid-query';
import { QueryClientProvider, dehydrate } from '@tanstack/solid-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/solid-router';

import { createQueryClient, settled } from './lib/queries';
import { createAppRouter } from './router';

declare module '@solidjs/web' {
  interface RequestEventLocals {
    /** The request's Query cache, dehydrated — src/Document.tsx ships it. */
    queryState?: DehydratedState;
  }
}

export default async function setup(event: RequestEvent) {
  const url = new URL(event.request.url);

  // Per-request instances: the cache and router live exactly as long as the
  // request, so one user's data can never leak into another's render.
  const queryClient = createQueryClient();
  const router = createAppRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [url.pathname + url.search] }),
  );

  // TanStack's own SSR sequence: match the URL and run the matched loaders.
  // The loaders only *start* their prefetches (they are non-blocking hints),
  // so `settled` then awaits the fetches themselves — server functions
  // called in-process, session cookie and all, since this runs inside the
  // request scope.
  await router.load();
  await settled(queryClient);

  // The handoff: park the dehydrated cache on the request event for
  // src/Document.tsx to inline, so the client boots with a warm cache and
  // hydration renders from data instead of refetching it.
  event.locals.queryState = dehydrate(queryClient);

  return () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
