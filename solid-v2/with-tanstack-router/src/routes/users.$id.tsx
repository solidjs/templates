import { Link, createFileRoute } from '@tanstack/solid-router';
import { getRequestEvent } from '@solidjs/web';

// Loader-driven data: TanStack runs the loader when navigation starts (and
// caches it per params), so the component renders with data in hand — no
// in-component fetching. Swap the static JSON for any API endpoint.
async function fetchUser(id: string) {
  // Same-origin URLs need an explicit origin when this runs during SSR
  // (getRequestEvent() is undefined in the browser, where location wins).
  const origin = getRequestEvent()?.request.url ?? location.origin;
  const response = await fetch(new URL('/users.json', origin));
  const users: Record<string, { name: string; title: string }> =
    await response.json();
  return users[id] ?? { name: 'Unknown', title: 'No such user' };
}

function UserPage() {
  // Typed by the loader's return type; reactive to param changes.
  const user = Route.useLoaderData();

  return (
    <main>
      <h1>Users</h1>
      <section>
        <h2>{user().name}</h2>
        <p>{user().title}</p>
        <p>
          <Link
            to="/users/$id"
            params={(prev) => ({ id: String(Number(prev.id) + 1) })}
          >
            Next user
          </Link>
        </p>
      </section>
    </main>
  );
}

export const Route = createFileRoute('/users/$id')({
  loader: ({ params }) => fetchUser(params.id),
  head: ({ params }) => ({
    meta: [{ title: `User ${params.id} - Solid App` }],
  }),
  component: UserPage,
});
