import { Title } from '@solidjs/meta';
import { type RouteDefinition, type RouteProps } from '@solidjs/router';
import { createMemo } from 'solid-js';

import { getUser, renameUser } from '../../lib/users';

// Starts the fetch as soon as navigation begins, before the page renders.
export const route = {
  preload: ({ params }) => void getUser(params.id!),
} satisfies RouteDefinition;

export default function User(props: RouteProps<'/users/:id'>) {
  // A server function read through a memo — the surrounding <Loading>
  // boundary (in App.tsx) shows its fallback until the promise settles.
  const user = createMemo(() => getUser(props.params.id));

  return (
    <section>
      <Title>{`User ${props.params.id} - Solid App`}</Title>
      <h2>{user().name}</h2>
      <p>{user().title}</p>
      {/* A mutation: posts to the renameUser server function (works before
          hydration too); the router revalidates queries when it settles. */}
      <form action={renameUser.with(props.params.id!)} method="post">
        <input name="name" value={user().name} required />
        <button type="submit">Rename</button>
      </form>
      <p>
        <a href={`/users/${(Number(props.params.id) % 3) + 1}`}>Next user</a>
      </p>
    </section>
  );
}
