import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';

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
