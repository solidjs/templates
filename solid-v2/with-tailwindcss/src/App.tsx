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
          <nav class="bg-slate-800 p-4">
            <a class="mx-2 text-purple-400" href="/">
              Home
            </a>
            <a class="mx-2 text-purple-400" href="/users/1">
              Users
            </a>
          </nav>
          <Loading fallback={<main class="px-4 py-12">Loading…</main>}>
            {props.children}
          </Loading>
        </>
      )}
    </Router>
  );
}
