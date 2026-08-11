import { useMutation, useQuery } from '@tanstack/solid-query';
import { createFileRoute } from '@tanstack/solid-router';
import { For, Show } from 'solid-js';

import Counter from '../components/Counter';
import { formAction } from '../lib/form-action';
import { currentUserQuery, prefetch, usersQuery } from '../lib/queries';
import { login, logout } from '../lib/users';
import logo from '../logo.svg';

// The loader as a prefetch hint: it *starts* these queries as navigation
// begins (and on link hover, via the router's intent preloading) without
// blocking on them — components suspend at the read point instead. It
// doubles as the page's single-flight manifest: after a mutation, the
// server reruns it to put the refreshed data on the action response itself.
// (`prefetch` is hydration-boot aware — see src/lib/queries.ts.)
export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    prefetch(context.queryClient, currentUserQuery());
    prefetch(context.queryClient, usersQuery());
  },
  head: () => ({ meta: [{ title: 'Home - Solid App' }] }),
  component: Home,
});

function Home() {
  // Query reads over server functions: on the server these suspend the
  // surrounding boundary until the data lands; on the client they are cache
  // hits (hydrated, prefetched, or refreshed by a mutation's single flight).
  const me = useQuery(currentUserQuery);
  const users = useQuery(usersQuery);

  // Mutations are Solid server functions wrapped in TanStack's useMutation
  // — no onSuccess invalidation, because the single-flight response already
  // refreshed the cache by the time `mutate` settles (see src/App.tsx). The
  // arrows matter: mutationFn is called with (variables, context), and a
  // server function forwards every argument into the RPC.
  const loginAction = useMutation(() => ({
    mutationFn: (formData: FormData) => login(formData),
  }));
  const logoutAction = useMutation(() => ({ mutationFn: () => logout() }));

  return (
    <main>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Hello Solid!</h1>
      <Counter />
      <p>
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      {/* The session pillar: plain forms posting to server functions. The
          `action` URL serves the no-JS path; onSubmit upgrades it to an RPC
          call whose response carries the refreshed queries (single flight). */}
      <Show
        when={me.data}
        fallback={
          <form
            action={formAction(login)}
            method="post"
            onSubmit={(event) => {
              event.preventDefault();
              loginAction.mutate(new FormData(event.currentTarget));
            }}
          >
            <select name="id">
              <For each={users.data}>
                {(user) => <option value={user.id}>{user.name}</option>}
              </For>
            </select>{' '}
            <button type="submit" disabled={loginAction.isPending}>
              Sign in
            </button>
            {loginAction.error && <p role="alert">{loginAction.error.message}</p>}
          </form>
        }
      >
        {(user) => (
          <form
            action={formAction(logout)}
            method="post"
            onSubmit={(event) => {
              event.preventDefault();
              logoutAction.mutate();
            }}
          >
            Signed in as {user().name}.{' '}
            <button type="submit" disabled={logoutAction.isPending}>
              Sign out
            </button>
          </form>
        )}
      </Show>
      <a
        href="https://docs.solidjs.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}
