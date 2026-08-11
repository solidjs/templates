import { Title } from '@solidjs/meta';
import { type RouteDefinition, type RouteProps } from '@solidjs/router';
import { Show, createMemo } from 'solid-js';

import { getCurrentUser, getUser, renameUser } from '../../lib/users';

// The preload starts these fetches as navigation begins — and it doubles as
// the page's single-flight manifest: after the rename mutation, the server
// reruns it to put the refreshed data on the action response itself.
export const route = {
  preload: ({ params }) => {
    void getUser(params.id!);
    void getCurrentUser();
  },
} satisfies RouteDefinition;

export default function User(props: RouteProps<'/users/:id'>) {
  // Server-function reads through memos — the surrounding <Loading>
  // boundary (in App.tsx) shows its fallback until the promises settle.
  const user = createMemo(() => getUser(props.params.id));
  const me = createMemo(() => getCurrentUser());

  return (
    <section>
      <Title>{`User ${props.params.id} - Solid App`}</Title>
      <h2>{user().name}</h2>
      <p>{user().title}</p>
      {/* The mutation: a form posting to a server function action (works
          before hydration too); the router revalidates queries when it
          settles. The server checks the session — hiding the form when
          signed out is just honest UI (see src/lib/users.ts). */}
      <Show
        when={me()}
        fallback={<p>Sign in on the home page to rename users.</p>}
      >
        <form action={renameUser.with(props.params.id!)} method="post">
          <input name="name" value={user().name} required />
          <button type="submit">Rename</button>
        </form>
      </Show>
    </section>
  );
}
