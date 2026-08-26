import { useQuery } from '@tanstack/solid-query';
import { Link, Outlet, createFileRoute } from '@tanstack/solid-router';
import { For, Loading } from 'solid-js';

import { prefetch, usersQuery } from '../lib/queries';

// A layout route: TanStack's flat convention nests users.$id.tsx inside
// this component's <Outlet /> because their filenames share the `users`
// prefix.
export const Route = createFileRoute('/users')({
  loader: ({ context }) => prefetch(context.queryClient, usersQuery()),
  head: () => ({ meta: [{ title: 'Users - Solid App' }] }),
  component: UsersLayout,
});

function UsersLayout() {
  return (
    <main>
      <h1>Users</h1>
      {/* Each data-dependent slot gets its own Loading boundary: under
          streaming SSR the shell flushes with the fallbacks, and each
          boundary's content flushes as its query settles — the nav after
          the (faster) users list, the outlet after the user detail. */}
      <Loading fallback={<p>Loading users…</p>}>
        <UsersNav />
      </Loading>
      <Loading fallback={<p>Loading user…</p>}>
        <Outlet />
      </Loading>
    </main>
  );
}

function UsersNav() {
  const users = useQuery(usersQuery);

  return (
    <nav class="users-nav" aria-label="Users">
      <For each={users.data}>
        {(user) => (
          <Link to="/users/$id" params={{ id: user.id }}>
            {user.name}
          </Link>
        )}
      </For>
    </nav>
  );
}
