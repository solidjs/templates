import { Title } from '@solidjs/meta';
import { For, createMemo } from 'solid-js';

import Counter from '../components/Counter';
import { getViewedUsers } from '../lib/users';
import logo from '../logo.svg';

export default function Home() {
  // Server-function read backed by the session cookie: the list of users
  // viewed in this session (see src/lib/users.ts and src/middleware.ts).
  const viewed = createMemo(() => getViewedUsers());

  return (
    <main>
      <Title>Home - Solid App</Title>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Hello Solid!</h1>
      <Counter />
      <p>
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <For each={viewed()} fallback={<p>No users viewed yet.</p>}>
        {(user) => (
          <p>
            Recently viewed: <a href={`/users/${user.id}`}>{user.name}</a>
          </p>
        )}
      </For>
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
