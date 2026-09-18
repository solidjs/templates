import { Title } from '@solidjs/meta';
import { Loading } from 'solid-js';
// Typed client env, validated and baked in at build time (see env.ts).
import { env } from 'virtual:env/client';
import { paths, Router } from './router';
import './App.css';

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>{env.VITE_APP_NAME}</Title>
          <nav class="site-nav">
            <a href={paths()}>Home</a>
            <a href={paths.users(1)}>Users</a>
          </nav>
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}
