# Agent Guide

This is a SolidJS 2.x project. Solid is not React: components run once (there is no re-render), reactivity is fine-grained through signals, and effects/memos have Solid-specific semantics. Do not port React patterns.

## Versioned skills (in node_modules — read on demand)

The installed packages ship agent skills that match their exact installed versions:

- `node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md` — repair guide mapping every dev-mode diagnostic code (e.g. `REACTIVE_WRITE_IN_OWNED_SCOPE`, `STRICT_READ_UNTRACKED`) to its prescribed fix. Read it whenever a Solid diagnostic code appears in test output or the browser console.
- `node_modules/@solidjs/diagnostics/skills/agent-loops/SKILL.md` — how to capture reactive evidence (which scopes re-ran and why, wasted recomputes, cost tables) and assert budgets, in tests and against live pages.

## Reactive diagnostics — capture evidence instead of guessing

Use these whenever you are debugging reactivity (something doesn't update, updates too often, or is slow) or verifying a change didn't regress update granularity:

- **In tests:** `captureArtifact()` from `@solidjs/diagnostics` wraps a scenario and returns a serializable artifact of diagnostics + rerun attribution; matchers from `@solidjs/diagnostics/vitest` (`toHaveNoDiagnostics`, `toStayWithinRerunBudget`, `toHaveNoWaste`, …) assert on it. No browser needed.
- **Against the running dev server** (`diagnostics: true` in vite.config.ts; dev-only, no-op in builds). Requires an open page connected to the dev server (e.g. via a browser tool):
  - `GET /__solid/diagnostics` — status and connected client count
  - `POST /__solid/diagnostics` with JSON `{"method":"begin"}` then `{"method":"end"}` — capture a session into an artifact
  - `{"method":"whyDidRun","params":{"name":"<scope name>"}}` — recorded re-runs of one named scope in the open session
  - `{"method":"costs"}` — running cost tables for the open session

Name your signals/memos/effects (the `{ name: "..." }` option) — attribution reports scopes by name.

## This template is SSG — the deployment has no server

`vite build` prerenders every page and executes every `prerendered()` server function **at build time**; `dist/client` is the entire deployment. Consequences for changes you make:

- `'use server'` functions must be wrapped in `prerendered()` (see `src/data.ts`) and are read-only by nature — there is no server to receive a mutation in production. Do not add actions/mutations expecting them to work when deployed.
- Arguments to `prerendered()` functions are part of the artifact's address and must be JSON-serializable. Only calls the build's crawl actually performs have artifacts — a page must exercise a call (same arguments) for the deployed client to fetch it.
- New pages are discovered by following links from `/`. A page nothing links to will not be prerendered unless added to the plugin's `pages` option in `vite.config.ts`.
- Dev (`npm run dev`) runs server functions live per request — behavior that works in dev but depends on request-time state (cookies, headers, Date.now per request) will be frozen at build time in production. Keep prerendered functions deterministic on their arguments.
- To verify the static output end to end, run `npm run build` then `npm run serve`, and confirm data loads from `/_static/*.json` (not `/_server/...`) in the network panel.
