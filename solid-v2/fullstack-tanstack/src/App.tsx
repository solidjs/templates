import { isServer } from '@solidjs/web';
import * as serverFunctions from '@solidjs/web/server-functions';
import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';

import { flightReporter } from './lib/flight';
import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';
import './App.css';

// One Query cache for the browser session. QueryClientProvider primes it from
// the server's streamed hydration entries and subscribes solid-query's named
// flight-data source ("sq"), so single-flight payloads after mutations land
// here with no hand-rolled consumer. (Subscribing is also the opt-in: while
// mounted, every mutation asks the server to fold refreshed data into its own
// response — see src/server-config.ts for the server half.)
const queryClient = createQueryClient();

// The report leg of scoped collection (src/lib/flight.ts): flight-eligible
// mutation requests carry this cache's inventory so the server can skip what
// the client already holds. Client-only — this module also evaluates on the
// server (the graph is shared with setup.tsx), where there is no transport to
// configure. The namespace import keeps the unused binding unchecked there.
if (!isServer) {
  serverFunctions.configureServerFunctionsClient({
    prepareRequest: flightReporter(queryClient),
  });
}

// Creating the router IS the hydration boot: it primes and commits matches
// from the server's hydration registry — no load before hydrate, no loader
// re-runs.
const router = createAppRouter(queryClient);

// Under SSR, src/setup.tsx renders a per-request pairing in App's place, so
// this tree must mirror the one setup returns.
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
