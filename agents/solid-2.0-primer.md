# Solid 2.0 primer for coding agents

Solid is **not React** and Solid 2.0 is **not Solid 1.x**. Components run once (no re-render); reactivity is fine-grained and tracked by _reads_ of signals, memos, stores and props. Both priors are the dominant bug sources here, so check generated code against this file before trusting it. Each pair below is `wrong` → `right`.

## The three rules that matter most

- **Props are read, not destructured, and passed as values.** `function Row({ item })` + `<Row item={item} />` → `function Row(props) { return <li>{props.item.name}</li>; }` + `<Row item={item()} />`.
- **`createEffect` takes two functions: compute, then apply.** `createEffect(() => { el.title = count(); })` → `createEffect(() => count(), (v) => { el.title = v; })` — compute tracks, apply is untracked and may return a cleanup.
- **Stores are written through the draft.** `setStore('user', 'name', 'B')` → `setStore((s) => { s.user.name = 'B'; })` — mutate in place; return a new value only for filter/remove.

## 1.x → 2.0 corrections

- `import { render } from 'solid-js/web'` → `from '@solidjs/web'`; tsconfig `jsxImportSource: "@solidjs/web"`.
- `import { createStore } from 'solid-js/store'` → `from 'solid-js'` (store APIs live in core).
- `<Suspense>` / `<SuspenseList>` → `<Loading fallback={…}>` / `<Reveal>`.
- `<ErrorBoundary>` → `<Errored fallback={(err, reset) => …}>` — `err` is an accessor, `reset` an action.
- `mergeProps(a, b)` / `splitProps(props, ['x'])` → `merge(a, b)` / `omit(props, 'x')`; `undefined` is a real value in `merge`.
- `onMount(fn)` + `onCleanup(fn)` in a component → `onSettled(() => { setup(); return () => teardown(); })`.
- `unwrap(store)` → `snapshot(store)`.
- `createResource(id, fetchUser)` → `createMemo(() => fetchUser(id()))` read under `<Loading>`; `.loading` → `isPending(() => user())`; `refetch()` → `affects(user); refresh(user)`.
- `batch(() => …)` → nothing: updates batch per microtask; `flush()` applies them now (`setX(1); x()` is stale until then).
- `createEffect(on(dep, fn))` → `createEffect(() => dep(), fn)` — the compute phase _is_ the dependency list; `{ defer: true }` skips the first run.
- `createComputed(fn)` → `createMemo(fn)`, a split `createEffect`, or a writable memo `createSignal(() => expr)`.
- `createSelector(id)` → `createProjection(fn)` (or `createStore(fn, init)`).
- `startTransition` / `useTransition` → built in: `action(function* () { … })`, `isPending`, `latest`, `createOptimistic`, `createOptimisticStore`.
- `setStore(produce((d) => …))` / `createMutable` / `modifyMutable` → `createStore` with draft setters (the default).
- `<Index each={xs()}>{(x) => …}</Index>` → `<For each={xs()} keyed={false}>{(x, i) => <li>{x()}</li>}</For>` — there `x` is an accessor and `i` a number; keyed `<For>` is the reverse.
- `use:tooltip={opts}` → `ref={tooltip(opts)}`; compose with `ref={[autofocus, tooltip(opts)]}`; refs are functions, not objects.
- `classList={{ active: on() }}` → `class={{ active: on() }}` or `class={['card', props.class, { active: on() }]}` — never join class strings.
- `<Ctx.Provider value={v}>` → `<Ctx value={v}>` — the context _is_ the provider; `createContext<T>()` throws without one.
- `onError` / `catchError` / `resetErrorBoundaries` → `<Errored>` or the effect `error` option; boundaries heal on their own.
- `attr:x`, `bool:x`, `on:click`, `oncapture:click` → plain attributes; native listener options via a ref callback.
- `tabIndex`, `readOnly` → lowercase `tabindex`, `readonly`; event handlers stay camelCase (`onClick`).
- `getListener()` / `equalFn` → `getObserver()` / `isEqual`.
- `from(observable)` → return an `AsyncIterable` from a computation.

New in 2.0, no 1.x precedent:

- Writing a signal or store inside a memo, an effect's compute phase or a component body throws in dev (`untrack` does not exempt it); write from event handlers or `onSettled`.
- Reading a signal or prop at the top level of a component body warns; read inside JSX, a memo or `untrack`.
- `<For>` / `<Show>` / `<Match>` callback bodies are owners, not tracking scopes: read the accessor in JSX, a memo or an effect, never `const x = item()` at the top.
- `onClick={cond() ? a : b}` binds once; decide inside a stable handler.
- Boolean attributes are presence/absence: `muted={false}` removes the attribute.
- Tests: `flush()` before asserting; reactive primitives need an owner (`render()` or `createRoot`).

## 2.0 primitives to reach for

| Need           | Use                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| State          | `createSignal(v, { name })`; writable derived `createSignal(() => expr)`                                          |
| Derived        | `createMemo(fn)` — return a Promise/AsyncIterable for async; reads participate in `<Loading>`                     |
| Side effects   | `createEffect(compute, apply, { defer, name })`; once after settle `onSettled(() => cleanup)`                     |
| Nested state   | `createStore(obj)`; derived `createProjection(fn, init, { key })`; merge data `reconcile(data, 'id')(draft)`      |
| Lists/branches | `<For each keyed fallback>`, `<Repeat count>`, `<Show when>{(v) => …}</Show>`, `<Switch>` + `<Match>`             |
| Async UI       | `<Loading fallback on>`, `isPending(() => x())`, `latest(x)`, `affects(x)` + `refresh(x)`, `<Reveal>`             |
| Errors         | `<Errored fallback={(err, reset) => …}>`; effect `{ error }` option                                               |
| Mutations      | `action(function* () { … })`, `createOptimistic`, `createOptimisticStore`                                         |
| Context        | `createContext<T>()` + `<Ctx value>` + `useContext(Ctx)`; app-wide state is a module-scope signal or store        |
| DOM            | from `@solidjs/web`: `render`, `hydrate`, `Portal`, `dynamic(() => C)` / `<Dynamic>`, `isServer`, `clientOnly`    |
| Escape hatches | `untrack`, `flush`, `snapshot`, `deep`, `createRoot`, `getOwner` / `runWithOwner`, `onCleanup`, `resolve`, `lazy` |

## Where to look (offline, versioned with the installed packages)

- `node_modules/solid-js/CHEATSHEET.md` — the one-page reference; its last section is the full 1.x → 2.0 list.
- `node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md` — every dev-mode diagnostic code (`STRICT_READ_UNTRACKED`, `REACTIVE_WRITE_IN_OWNED_SCOPE`, …) mapped to its repair. Read it when a code shows up in tests or the console.
- `node_modules/@solidjs/web/skills/` — the web runtime's skills (server components, SSR).
- `node_modules/@solidjs/diagnostics/skills/agent-loops/SKILL.md` — capture evidence instead of guessing: `captureArtifact(scenario)` returns diagnostics + rerun attribution; assert with `expectNoDiagnostics(artifact)`, `expectRerunBudget(artifact, max, { scope })`, `expectNoWaste`, `expectNoSilentHolds`, or the matchers from `@solidjs/diagnostics/vitest`. `src/components/Counter.test.tsx` is the pattern.
- Dev server (`diagnostics: true` in `vite.config.ts`, dev-only): `GET /__solid/diagnostics` for status; `POST` JSON `{"method":"begin"}` … `{"method":"end"}` captures a session; `whyDidRun` (`params.name`), `costs`, `feedback` query the open page live.
- The console footer: the first report of each diagnostic code ends with `[CODE] repair guide: node_modules/solid-js/skills/…` — follow it.
- Name signals, memos and effects (`{ name: '…' }`): attribution and diagnostics report scopes by name.
- Docs: https://v2.solidjs.com (release-candidate docs); machine-readable at https://v2.solidjs.com/llms.txt and https://v2.solidjs.com/llms-full.txt.
