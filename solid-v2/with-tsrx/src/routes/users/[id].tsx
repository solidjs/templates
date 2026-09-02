import { Title } from '@solidjs/meta';
import { query, type RouteDefinition, type RouteProps } from '@solidjs/router';
import { getRequestEvent } from '@solidjs/web';
import { createMemo } from 'solid-js';
import { paths } from '../../router';

// Async data loading: a query (cached per key) read through a memo — the
// surrounding <Loading> boundary (in App.tsx) shows its fallback until the
// promise settles. Swap the static JSON for any API endpoint.
const getUser = query(async (id: string) => {
  // Same-origin URLs need an explicit origin when this runs during SSR
  // (getRequestEvent() is undefined in the browser, where location wins).
  const origin = getRequestEvent()?.request.url ?? location.origin;
  const response = await fetch(new URL('/users.json', origin));
  const users: Record<string, { name: string; title: string }> =
    await response.json();
  return users[id] ?? { name: 'Unknown', title: 'No such user' };
}, 'user');

// Starts the fetch as soon as navigation begins, before the page renders.
export const route = {
  preload: ({ params }) => void getUser(params.id!),
} satisfies RouteDefinition;

export default function User(props: RouteProps<'/users/:id'>) {
  const user = createMemo(() => getUser(props.params.id));

  return (
    <section>
      <Title>{`User ${props.params.id} - Solid App`}</Title>
      <h2>{user().name}</h2>
      <p>{user().title}</p>
      <p>
        <a href={paths.users(Number(props.params.id) + 1)}>Next user</a>
      </p>
    </section>
  );
}
