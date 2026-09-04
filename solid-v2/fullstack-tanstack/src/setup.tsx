// The per-request SSR seam (wired via `start.setup` in vite.config.ts): the
// generated server entry awaits this default export after the middleware
// chain and renders the returned component in App's place, inside the
// Document. This is what lets a router Solid doesn't own drive streaming
// SSR — each request gets its own TanStack router and Query cache.
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

  // The load's verdict. A server load never throws for redirects — a
  // `redirect()` thrown in `beforeLoad` or a loader lands in
  // `router._serverResult` (the seam TanStack's own start handler reads),
  // and the router commits no matches for it. Rendering anyway would stream
  // a 200 with an empty body, leaving the client boot to hydrate a blank
  // page. Instead, fold the redirect's headers and status onto the event's
  // response head: the plugin sees the `Location` before the first flush
  // and answers a real 30x with no body, so the browser lands on the
  // target's own SSR. The empty component keeps the discarded Document
  // render trivial.
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

  // Renders carry their status the same way: a URL that resolves to
  // not-found answers 404 (and an errored load 500) instead of a
  // masquerading 200.
  if (result) event.response.status = result.status;

  // No dehydrate/inline-script handoff: QueryClientProvider owns the SSR
  // serialization channel. On the server it streams each query's dehydrated
  // entry into the HTML stream as it settles; the client provider primes its
  // cache from those entries as they arrive, per query — progressive, not a
  // single end-of-render blob. RouterProvider rides the same registry for
  // match state: it serializes each matched route's transferable state
  // (status, loaderData, beforeLoad context) as it renders, and the client's
  // createRouter primes and commits its matches from those entries before
  // hydrating — no boot load, no loader re-runs.
  return () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
