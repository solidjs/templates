import { QueryClientProvider } from '@tanstack/solid-query';
import { isRedirect, RouterProvider } from '@tanstack/solid-router';

import { bootLoad, createQueryClient } from './lib/queries';
import { createAppRouter } from './router';
import './App.css';

// The client's Query cache: one instance for the session. Everything the
// server hands back lands here and useQuery reads throughout the app
// follow — with no hand-rolled handoffs on this side: the provider owns
// both channels, priming this cache from the server's streamed hydration
// entries AND hydrating single-flight payloads after mutations (the
// dehydrated QueryClient src/server-config.ts folds into each mutation
// response, applied before `mutate` settles so no follow-up refetch
// happens).
const queryClient = createQueryClient();

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
  // Redirects thrown where the router is driving — beforeLoad, loaders,
  // and any queryFn a loader awaits — are the router's own to handle: it
  // navigates on the client, and the server answers a real 30x
  // (src/setup.tsx). But cache-driven fetches run outside the router: a
  // background refetch or a mutation throwing redirect() (a session
  // expiring, say) would just settle into cache error state with nobody
  // navigating. This is that last stretch of glue — hand redirect errors
  // from both caches to the router. Runtime navigation, so it belongs
  // here in the client boot, not anywhere near SSR.
  const navigateOnRedirect = <TRest extends Array<unknown>>(
    onError?: (error: Error, ...rest: TRest) => void,
  ) => {
    return (error: Error, ...rest: TRest) => {
      if (isRedirect(error)) {
        error.options._fromLocation = router.stores.location.get();
        void router.navigate(router.resolveRedirect(error).options);
        return;
      }
      onError?.(error, ...rest);
    };
  };
  const queryCache = queryClient.getQueryCache();
  const mutationCache = queryClient.getMutationCache();
  queryCache.config.onError = navigateOnRedirect(queryCache.config.onError);
  mutationCache.config.onError = navigateOnRedirect(mutationCache.config.onError);

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
