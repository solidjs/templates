// The per-request SSR seam (`start.setup` in vite.config.ts): the generated
// server entry awaits this default export after the middleware chain and
// renders the returned component in App's place, inside the Document. Each
// request gets its own TanStack router and Query cache.
import type { RequestEvent, ResponseStub } from '@solidjs/web';
import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/solid-router';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';

export default async function setup(
  // The generated entry builds the event with a mutable `response` head
  // (status + headers, folded onto the wire at first flush); the base
  // RequestEvent type leaves it to integrations to declare.
  event: RequestEvent & { response: ResponseStub },
) {
  const url = new URL(event.request.url);

  const queryClient = createQueryClient();
  const router = createAppRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [url.pathname + url.search] }),
  );

  // Matches the URL and *starts* the matched loaders' prefetches; the render
  // below begins while they are in flight and each useQuery read suspends on
  // its own query. Server functions run in-process here, session cookie
  // and all.
  await router.load();

  // A server load never throws for redirects — a `redirect()` from
  // `beforeLoad` or a loader lands in `router._serverResult` (the seam
  // TanStack's own start handler reads) with no matches committed. Folding
  // its headers and status onto the event's response head lets the plugin
  // answer a real 30x with no body instead of streaming an empty 200.
  const result = router._serverResult;
  if (result?.type === 'redirect') {
    result.redirect.headers.forEach((value, key) =>
      key === 'set-cookie'
        ? event.response.headers.append(key, value)
        : event.response.headers.set(key, value),
    );
    event.response.status = result.redirect.status;
    return () => null;
  }

  // Renders carry their status the same way: not-found answers 404 (an
  // errored load 500) instead of a masquerading 200.
  if (result) event.response.status = result.status;

  // No dehydrate/inline-script handoff: QueryClientProvider streams each
  // query's dehydrated entry as it settles, and RouterProvider serializes each
  // matched route's state into the same hydration registry (see README).
  return () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
