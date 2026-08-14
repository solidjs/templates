import { createFileRoute } from '@tanstack/solid-router';

import Counter from '../components/Counter';
import logo from '../logo.svg';

function Home() {
  return (
    <main>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Hello Solid!</h1>
      <Counter />
      <p>
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <a
        href="https://v2.solidjs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Home - Solid App' }] }),
  component: Home,
});
