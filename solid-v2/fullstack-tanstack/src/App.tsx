import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';
import './App.css';

// The client's Query cache: one instance for the session. Everything the
// server hands back — the SSR hydration entries QueryClientProvider consumes,
// single-flight payloads after mutations — lands here, and useQuery reads
// throughout the app follow. Both channels are the provider's own: it primes
// this cache from the server's streamed dehydrated entries as they arrive,
// and it subscribes solid-query's named flight-data source ("sq") so
// single-flight payloads hydrate the cache with no hand-rolled consumer.
// (Subscribing is also the opt-in: while the provider is mounted, every
// mutation call asks the server to fold refreshed data for that source into
// its own response — see src/server-config.ts for the server half.)
const queryClient = createQueryClient();

// No client boot pass: creating the router IS the hydration boot. The
// server serialized each matched route's state into Solid's hydration
// registry (content-addressed, alongside the query entries), and
// createRouter primes and commits the matches from it — no load before
// hydrate, no loader re-runs, no prefetch pausing. Route chunks resolve at
// the read point under the boundaries the server rendered.
const router = createAppRouter(queryClient);

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
