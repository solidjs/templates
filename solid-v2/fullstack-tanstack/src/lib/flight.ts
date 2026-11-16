// Userland single-flight extension: key-scoped collection with a client
// inventory and re-executable recipes. Everything here composes public
// seams — no package patches.
//
// The base protocol (see src/server-config.ts) reruns the target page's
// loaders on every mutation and ships the results. Correct, but blunt: it
// recomputes data the client already holds, and it can't reach data no
// loader owns (component-owned queries like the session). Declaring scope
// on the mutation (`reload({ revalidate: 'users' })` → the X-Revalidate
// header) sharpens both edges:
//
// - inventory (client → server): the mutation request carries the query
//   hashes this client already caches. The collection gate skips
//   recomputing them — the mutation's declaration is the license: anything
//   it didn't name is fresh by its own testimony. Undeclared data the
//   client DOESN'T hold still collects fully (new pages on redirects).
// - recipes (client → server): queries declared through `serverQueryFn`
//   are addressable — the server can re-execute `(fn.id, args)` via
//   `getServerFunction` and fold the result into the same response. That
//   covers declared data outside the loader graph (the session query) in
//   the one round trip.
// - the sweep (in @tanstack/solid-query): whatever a declared key matches
//   beyond the payload is invalidated client-side — the safety net every
//   failure mode here degrades onto (report too large, version skew,
//   queries without recipes).
//
// Mutations that declare nothing keep today's behavior exactly.
import { hashKey } from '@tanstack/solid-query';
import { SINGLE_FLIGHT_HEADER } from '@solidjs/web/server-functions';
import type { QueryClient, QueryKey } from '@tanstack/solid-query';

/** Request header carrying the report; JSON, ASCII-escaped, capped. */
const FLIGHT_REPORT_HEADER = 'X-Query-Flight';
/** Past this the header is dropped whole — everything degrades to the sweep. */
const REPORT_LIMIT = 4096;

/** How to recompute a query remotely: a server function id + arguments. */
interface FlightRecipe {
  id: string;
  args: Array<unknown>;
}

interface FlightReport {
  /** Cached query hashes (the inventory — what this client holds). */
  i: Array<string>;
  /** Active addressable queries: `[queryKey, recipe]` pairs. */
  r: Array<[QueryKey, FlightRecipe]>;
}

// ---------------------------------------------------------------- client --

/**
 * Declares a query's fetch as an addressable server-function call: builds
 * the queryFn and stashes the `(id, args)` recipe in meta, one source of
 * truth for both. Only recipe-declared queries can ride the flight from
 * outside the loader graph; everything else falls back to the sweep.
 */
export function serverQueryFn<A extends Array<unknown>, R>(
  fn: ((...args: A) => Promise<R>) & { readonly id: string },
  ...args: A
) {
  return {
    queryFn: () => fn(...args),
    meta: { flight: { id: fn.id, args } satisfies FlightRecipe },
  };
}

/**
 * The report leg, as a `prepareRequest` hook (wire it in the client entry
 * via `configureServerFunctionsClient`). On flight-eligible calls — the
 * transport already stamped X-Single-Flight — it attaches the inventory
 * and the active recipes. GET reads and non-flight calls are untouched.
 */
export function flightReporter(queryClient: QueryClient) {
  return (init: RequestInit): RequestInit => {
    if (!new Headers(init.headers).has(SINGLE_FLIGHT_HEADER)) return init;
    const report: FlightReport = { i: [], r: [] };
    for (const query of queryClient.getQueryCache().getAll()) {
      if (query.state.status === 'success') report.i.push(query.queryHash);
      const recipe = query.meta?.flight as FlightRecipe | undefined;
      if (recipe && query.getObserversCount() > 0)
        report.r.push([query.queryKey, recipe]);
    }
    // Header values are latin1: escape everything past printable ASCII
    // (still valid JSON). Oversized reports are dropped whole rather than
    // truncated — a partial report would misread as a partial cache.
    const encoded = JSON.stringify(report).replace(
      /[\u007f-\uffff]/g,
      (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
    if (encoded.length > REPORT_LIMIT) return init;
    return {
      ...init,
      headers: { ...(init.headers as Record<string, string>), [FLIGHT_REPORT_HEADER]: encoded },
    };
  };
}

// ---------------------------------------------------------------- server --

/**
 * Reads the mutation's report + declared keys into a collection plan:
 * `skip` is the loader-prefetch gate, `recipes` the declared active
 * instances to re-execute. Without declared keys there is no plan — the
 * declaration is what licenses skipping — and collection stays full.
 */
export function planFlightCollection(
  request: Request,
  revalidateKeys: Array<string> | undefined,
) {
  let report: FlightReport | undefined;
  try {
    const raw = request.headers.get(FLIGHT_REPORT_HEADER);
    if (raw) report = JSON.parse(raw) as FlightReport;
  } catch {
    // a malformed report is no report
  }
  const declared = (key: QueryKey) =>
    revalidateKeys?.includes(String(key[0])) ?? false;
  return {
    /** Skip fetching what the client holds — unless the mutation declared it. */
    skip: (key: QueryKey) =>
      revalidateKeys !== undefined &&
      report !== undefined &&
      report.i.includes(hashKey(key)) &&
      !declared(key),
    /** Declared, active on the client, shaped like a recipe. */
    recipes:
      revalidateKeys && report
        ? report.r.filter(
            ([key, recipe]) =>
              declared(key) &&
              typeof recipe?.id === 'string' &&
              Array.isArray(recipe.args),
          )
        : [],
  };
}

// The gate rides the per-request QueryClient so `prefetch` (src/lib/
// queries.ts) can consult it without threading arguments through loaders.
const gates = new WeakMap<QueryClient, (key: QueryKey) => boolean>();

export function setFlightGate(
  queryClient: QueryClient,
  skip: (key: QueryKey) => boolean,
) {
  gates.set(queryClient, skip);
}

export function flightGateSkips(queryClient: QueryClient, key: QueryKey) {
  return gates.get(queryClient)?.(key) ?? false;
}

/**
 * Re-executes declared active instances the loaders didn't produce and
 * folds them into the collection client. `getServerFunction` resolves only
 * registered functions (unknown ids — version skew — just skip: the sweep
 * refetches), and each function does its own authorization, exactly as if
 * the client had called it over RPC directly.
 */
export async function runFlightRecipes(
  queryClient: QueryClient,
  recipes: Array<[QueryKey, FlightRecipe]>,
) {
  if (recipes.length === 0) return;
  const { getServerFunction } = await import(
    '@solidjs/web/server-functions/server'
  );
  await Promise.all(
    recipes.map(([queryKey, recipe]) => {
      // Already collected (or being collected) by a loader: covered.
      if (queryClient.getQueryCache().get(hashKey(queryKey))) return;
      return queryClient
        .prefetchQuery({
          queryKey,
          queryFn: () => getServerFunction(recipe.id)(...recipe.args),
          retry: false,
        })
        .catch(() => undefined);
    }),
  );
}
