import { useQuery } from '@tanstack/solid-query';
import { Link, Outlet, createFileRoute } from '@tanstack/solid-router';
import { For } from 'solid-js';

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
  const users = useQuery(usersQuery);

  return (
    <main>
      <h1>Users</h1>
      <nav>
        <For each={users.data}>
          {(user) => (
            <Link to="/users/$id" params={{ id: user.id }}>
              {user.name}
            </Link>
          )}
        </For>
      </nav>
      <Outlet />
    </main>
  );
}
