import { pageRoutes } from 'virtual:file-routes';
import { Title } from '@solidjs/meta';
import { createRouter } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';
import { Loading } from 'solid-js';
import 'bootstrap/dist/css/bootstrap.min.css';
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
          <nav class="navbar justify-content-center gap-3 bg-dark p-3" data-bs-theme="dark">
            <a class="nav-link" href="/">
              Home
            </a>
            <a class="nav-link" href="/users/1">
              Users
            </a>
          </nav>
          <Loading fallback={<main class="container py-5">Loading…</main>}>
            {props.children}
          </Loading>
        </>
      )}
    </Router>
  );
}
