import { Link, createFileRoute } from '@tanstack/solid-router';

import users from '../data/users.json';

// Loader-driven data: TanStack runs the loader when navigation starts (and
// caches it per params), so the component renders with data in hand — no
// in-component fetching. The data is a local JSON module here; swap the
// body for any API call — an absolute URL, or a server function (see the
// `fullstack-tanstack` template). Avoid fetching your own origin during SSR:
// behind a proxy the incoming Host header rarely routes back to this server.
async function fetchUser(id: string) {
  return (
    users[id as keyof typeof users] ?? {
      name: 'Unknown',
      title: 'No such user',
    }
  );
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
