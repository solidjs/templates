import { Title } from '@solidjs/meta';
import {
  query,
  revalidate,
  type RouteDefinition,
  type RouteProps,
} from '@solidjs/router';
import { getRequestEvent, markSafeError } from '@solidjs/web';
import { createMemo } from 'solid-js';
import { paths } from '../../router';

// A query (cached per key) read through a memo; the surrounding @pending
// boundary (in App.tsrx) shows its fallback until it settles.
const getUser = query(async (id: string) => {
  // Same-origin URLs need an explicit origin when this runs during SSR
  // (getRequestEvent() is undefined in the browser, where location wins).
  const origin = getRequestEvent()?.request.url ?? location.origin;
  const response = await fetch(new URL('/users.json', origin));
  const users: Record<string, { name: string; title: string }> =
    await response.json();
  const user = users[id];
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
