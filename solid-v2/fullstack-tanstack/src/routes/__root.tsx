import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/solid-router';

import type { RouterContext } from '../router';

// The root route: the site-wide layout every route renders inside, plus the
// not-found boundary. Declaring the RouterContext type here is what types
// `context` in every loader below. <HeadContent /> renders whatever the
// matched routes declare in their `head` options (titles here).
export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({ meta: [{ title: 'Solid App' }] }),
  component: () => (
    <>
      <HeadContent />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main>
      <h1>Page Not Found</h1>
      <p>
        Visit{' '}
        <a href="https://docs.solidjs.com" target="_blank" rel="noreferrer">
          docs.solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
    </main>
  ),
});
