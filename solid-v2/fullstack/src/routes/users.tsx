import type { RouteDefinition } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import { For, createMemo } from 'solid-js';

import { getUsers } from '../lib/users';

export const route = {
  preload: () => void getUsers(),
} satisfies RouteDefinition;

// A layout route: pairing users.tsx with the users/ directory nests every
// page inside it under this component.
export default function UsersLayout(props: ParentProps) {
  // Data loading through a server function: on the server a direct call,
  // in the browser a typed fetch (see src/lib/users.ts).
  const users = createMemo(() => getUsers());

  return (
    <main>
      <h1>Users</h1>
      <nav>
        <For each={users()}>
          {(user) => <a href={`/users/${user.id}`}>{user.name}</a>}
        </For>
      </nav>
      {props.children}
    </main>
  );
}
