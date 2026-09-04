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

## TSRX modules (`.tsrx`)

This template authors the whole app in experimental TSRX: `src/App.tsrx`, `src/Document.tsrx`, `src/components/*.tsrx`, and every route module under `src/routes`. Rules that differ from `.tsx`:

- The extension is the opt-in: import with it spelled out (`./Counter.tsrx`). The Vite plugin compiles these automatically; no config.
- A function body can be a statement container: `function C(props) @{ setup; <output/> }` — TypeScript statements first, then exactly one rendered output node (use a fragment for siblings).
- Template control flow is directive-based: `@if (cond) { ... } @else { ... }`, `@for (const x of list(); index i) { ... } @empty { ... }`, `@switch`, `@try`. `return`/`break` are syntax errors inside these blocks.
- Boundaries are directives too: `@try { ... } @pending { ... } @catch (err, reset) { ... }` lowers to Solid's `<Loading>` (`@pending` block = fallback) and `<Errored>` (`@catch` block = fallback; `Errored` wraps outside `Loading`). Either block alone is legal; `@finally` is rejected. In `@catch`, reads of the error binding compile to accessor calls — author `err` as the plain error value, never `err()` (that double-calls at runtime), and narrow it (`err instanceof Error ? ... : ...`) so the typecheck projection (which still types the binding as `ErrorAccessor`) accepts the property reads.
- A directive block renders exactly one output node: wrap sibling elements in a fragment, and wrap a bare expression like `{props.children}` in a fragment too (`<>{props.children}</>`) — a `{expr}` statement alone is rejected by the compiler.
- A `<style>` block scopes its **sibling** elements and their descendants (not its ancestors). Unused selectors are pruned from the emitted CSS.
- Authored lazy destructuring (`&{ ... }`/`&[ ... ]`) is rejected by the Solid target — keep reads explicit.
- Type checking: `pnpm typecheck` (`tsrx-tsc`); plain `tsc` cannot resolve `.tsrx` imports. oxlint skips `.tsrx` files.
- Route modules are `.tsrx` too: the fileRoutes scanner (`filesystem-routing` ≥ 0.3.0) analyzes `.tsrx` route exports through `@tsrx/oxc` (a dev dependency here). Keep `route` config exports as plain top-level TypeScript statements — only the component body uses `@{ ... }`.
- Do not put a `<style>` block inside an arrow function (e.g. a render prop): the compiler only scopes a style's siblings and their descendants, and the typecheck projection rejects that placement. Component-level `<style>` in function bodies is fully supported.
