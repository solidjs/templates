import { pageRoutes } from 'virtual:file-routes';
import { Title } from '@solidjs/meta';
import { createRouter } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';
import { Loading } from 'solid-js';
import './App.css';

const Router = createRouter({ routes: fileRoutes(pageRoutes) });

// The app root: the router and the site-wide layout live here. Pages are
// the modules under src/routes.
export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>Solid App</Title>
          <nav>
            <a href="/">Home</a>
            <a href="/users/1">Users</a>
          </nav>
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}
