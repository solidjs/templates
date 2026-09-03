# Porting ledger — what did NOT move to `solid-v2`

The `solid-v2` group is a port of the existing templates onto the Solid 2.0 stack
(`solid-js` 2.0 beta, `@solidjs/vite-plugin` turnkey `start` mode). This file records
every template that was **not** ported, and why — so the decision survives the people
who made it.

**Policy:** we do not open upgrade-to-2.0 issues against libraries that have not
opted into the 2.0 line. Entries below are revisited as upstream releases appear;
each "blocked" row says exactly what to check before porting.

## Blocked upstream — revisit as solid-js 2.0 releases land

| Template | Blocked on | What to check before porting |
| --- | --- | --- |
| `with-solid-styled` | `solid-styled` (solid-js `^1.x` peer) | It is a compile-time JSX transform — a 2.0 release must be validated against the native compiler's output, not just a peer-range bump. |
| `with-mdx` | `solid-mdx` | Same compiler-compat question: MDX output flows through the Solid JSX transform; needs a release exercised against the 2.0 native compiler. |
| `with-better-auth` (planned; takes `with-auth`'s third-party slot) | `better-auth` ≤ 1.6.26 (also 1.7.0-rc.4) | Its Solid client bridge imports the removed `solid-js/store` subpath (`ERR_PACKAGE_PATH_NOT_EXPORTED` on 2.0.0-beta.32) and uses the Solid 1 path-style setter `setState("value", reconcile(v))`; 2.0's setter takes a single mutator function. Server half (`betterAuth()` / `auth.handler`) is framework-agnostic and composes fine — only the ~20-line client bridge needs a 2.0 release. |
| `with-authjs` (and the start-era OAuth demo) | `@auth/solid-start` | Auth.js's Solid adapter targets the retired SolidStart server API; needs an adapter written against the `@solidjs/web` request-event surface. |
| `with-solidbase` | `solidbase` | Deeply coupled to Start 2 / vinxi internals; it needs its own migration to the new stack before a template can exist. |

Resolved since the original audit (kept here so the history reads right):

- `@solidjs/testing-library` — unblocked: `1.0.0-beta.3` targets Solid 2 and ships in
  `basic`'s test floor. Advance the pin when a stable lands.
- TanStack Router / Query — unblocked: `with-tanstack-router` and `fullstack-tanstack`
  shipped on their Solid 2 betas.

## Dropped — collapsed or obsolete under the new stack

| Template(s) | Reason |
| --- | --- |
| `solid-start-v1/*` (whole group) | vinxi/h3-era SolidStart; superseded by the turnkey stack. Stays in place for degit, no ports. |
| `with-vite-plugin-pages`, `with-pages-router-file-based` | Superseded by core `filesystem-routing` + `@solidjs/router/fs`, which is `basic`'s floor. |
| `with-jest`, `with-uvu` | Vitest is the repo's testing posture. |
| `with-vitest` | Collapsed: testing is part of `basic`'s floor, not a variant. |
| `with-solid-router` | Collapsed into `basic`: the router is `basic`'s floor. |
| `with-tanstack-router-config-based`, `-file-based` | Collapsed into one `with-tanstack-router` (file-based, their idiomatic shape). |
| `with-tanstack-start` | TanStack Start is its own framework with its own starters; not a template for this stack. |
| `with-trpc` | Server functions + single-flight cover the typed-RPC story in core. Worth re-litigating if a tRPC-on-the-new-runtime pattern proves in demand. |
| `with-auth` | Absorbed into `fullstack`'s session pillar (`@remix-run/cookie` composition). |

## Queued — not dropped, just not built yet

`with-drizzle`, `with-prisma`, `with-strict-csp` extend `fullstack` and are awaiting
their turn (`with-strict-csp` additionally constrains the posture to `ssr: true` —
per-request nonces cannot live in a prerendered shell).
