import { useMutation, useQuery } from '@tanstack/solid-query';
import { createFileRoute } from '@tanstack/solid-router';
import { isPending, Show } from 'solid-js';

import { currentUserQuery, prefetch, userQuery } from '../lib/queries';
import { renameUser } from '../lib/users';

// The prefetch-hint loader again — and again the single-flight manifest:
// after the rename below, the server reruns this loader (and the parent
// /users one) against a fresh cache and ships the result on the mutation's
// own response.
export const Route = createFileRoute('/users/$id')({
  loader: ({ context, params }) => {
    prefetch(context.queryClient, userQuery(params.id));
    prefetch(context.queryClient, currentUserQuery());
  },
  head: ({ params }) => ({
    meta: [{ title: `User ${params.id} - Solid App` }],
  }),
  component: UserPage,
});

function UserPage() {
  const params = Route.useParams();
  const user = useQuery(() => userQuery(params().id));
  const me = useQuery(currentUserQuery);

  // The mutation pillar: a Solid server function through TanStack's
  // useMutation. No invalidation call anywhere — when `mutate` settles, the
  // single-flight envelope has already written the renamed user (and the
  // parent list) into the Query cache, so every read below is current. (The
  // arrow keeps useMutation's extra context argument out of the RPC.)
  const rename = useMutation(() => ({
    mutationFn: (input: { id: string; name: string }) => renameUser(input),
  }));

  return (
    <section style={{ opacity: isPending(() => user.data) ? 0.5 : 1 }}>
      {/* Reads suspend to the surrounding boundary until the query settles —
          no loading guard, same shape as the plain fullstack template. */}
      <h2>{user.data.name}</h2>
      <p>{user.data.title}</p>
      {/* The server checks the session — hiding the form when signed out is
          just honest UI (see src/lib/users.ts). */}
      <Show
        when={me.data}
        fallback={<p>Sign in on the home page to rename users.</p>}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = new FormData(event.currentTarget).get('name');
            rename.mutate({ id: params().id, name: String(name) });
          }}
        >
          <input name="name" value={user.data.name} required />
          <button type="submit" disabled={rename.isPending}>
            Rename
          </button>
        </form>
      </Show>
    </section>
  );
}
