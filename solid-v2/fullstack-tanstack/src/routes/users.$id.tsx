import { useMutation, useQuery } from '@tanstack/solid-query';
import { createFileRoute } from '@tanstack/solid-router';
import { Show } from 'solid-js';

import { formAction } from '../lib/form-action';
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
    mutationFn: (formData: FormData) => renameUser(formData),
  }));

  return (
    <section>
      <Show when={user.data}>
        {(user) => (
          <>
            <h2>{user().name}</h2>
            <p>{user().title}</p>
          </>
        )}
      </Show>
      {/* The server checks the session — hiding the form when signed out is
          just honest UI (see src/lib/users.ts). The hidden id field keeps
          the native (no-JS) post self-contained. */}
      <Show
        when={me.data}
        fallback={<p>Sign in on the home page to rename users.</p>}
      >
        <form
          action={formAction(renameUser)}
          method="post"
          onSubmit={(event) => {
            event.preventDefault();
            rename.mutate(new FormData(event.currentTarget));
          }}
        >
          <input type="hidden" name="id" value={params().id} />
          <input name="name" defaultValue={user.data?.name ?? ''} required />
          <button type="submit" disabled={rename.isPending}>
            Rename
          </button>
        </form>
      </Show>
    </section>
  );
}
