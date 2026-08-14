import { Title } from '@solidjs/meta';
import { Loading } from 'solid-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { paths, Router } from './router';
import './App.css';

// The app root: the router and the site-wide layout live here. Pages are
// the modules under src/routes.
export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>Solid App</Title>
          <nav class="navbar justify-content-center gap-3 bg-dark p-3" data-bs-theme="dark">
            <a
              class="nav-link rounded px-3 fw-semibold focus-ring focus-ring-info"
              href={paths()}
            >
              Home
            </a>
            <a
              class="nav-link rounded px-3 fw-semibold focus-ring focus-ring-info"
              href={paths.users(1)}
            >
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
