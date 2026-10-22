import { Title } from '@solidjs/meta';
import {
  query,
  revalidate,
  type RouteDefinition,
  type RouteProps,
} from '@solidjs/router';
import { markSafeError } from '@solidjs/web';
import { createMemo } from 'solid-js';
import users from '../../data/users.json';
import { paths } from '../../router';

// A query (cached per key) read through a memo; the surrounding @pending
// boundary (in App.tsrx) shows its fallback until it settles. The data is a
// local JSON module here; swap the body for any API call — an absolute URL,
// or a server function (see the `fullstack` template). Avoid fetching your
// own origin during SSR: behind a proxy the incoming Host header rarely
// routes back to this server.
const getUser = query(async (id: string) => {
  const user = users[id as keyof typeof users];
  // The @catch block below renders this message. markSafeError brands it
  // as client-facing: a production SSR render otherwise replaces a thrown
  // error with a generic "Internal Server Error" before it reaches the wire.
  if (!user) throw markSafeError(new Error(`No user with id ${id}`));
  return user;
}, 'user');

export const route = {
  preload: ({ params }) => void getUser(params.id!),
} satisfies RouteDefinition;

export default function User(props: RouteProps<'/users/:id'>) @{
  const user = createMemo(() => getUser(props.params.id));

  <section>
    <Title>{`User ${props.params.id} - Solid App`}</Title>
    @try {
      <>
        <h2>{user().name}</h2>
        <p>{user().title}</p>
      </>
    } @catch (err, reset) {
      <>
        <p>{err instanceof Error ? err.message : String(err)}</p>
        <button
          onClick={() => {
            // Drop the failed cache entry, then re-render the tried block.
            revalidate(getUser.keyFor(props.params.id));
            reset();
          }}
          type="button"
        >
          Try again
        </button>
      </>
    }
    <p>
      <a href={paths.users(Number(props.params.id) + 1)}>Next user</a>
    </p>
  </section>
}
