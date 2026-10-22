import { Link, createFileRoute } from '@tanstack/solid-router';
import { For } from 'solid-js';

import users from '../data/users.json';

// The index route for /users: TanStack's flat convention makes
// `users.index.tsx` the page at `/users` itself, alongside `users.$id.tsx`.
// Without it, /users would render the not-found component.
function UsersIndex() {
  return (
    <main>
      <h1>Users</h1>
      <ul>
        <For each={Object.entries(users)}>
          {([id, user]) => (
            <li>
              <Link to="/users/$id" params={{ id }}>
                {user.name}
              </Link>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}

export const Route = createFileRoute('/users/')({
  head: () => ({ meta: [{ title: 'Users - Solid App' }] }),
  component: UsersIndex,
});
