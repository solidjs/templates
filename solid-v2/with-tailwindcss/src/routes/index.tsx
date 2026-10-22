import { Title } from '@solidjs/meta';
import Counter from '../components/Counter';
import logo from '../logo.svg';

export default function Home() {
  return (
    <main class="px-4 py-12">
      <Title>Home - Solid App</Title>
      <img
        src={logo}
        class="pointer-events-none mx-auto h-[24vmin] animate-[spin_20s_linear_infinite]"
        alt="Solid logo"
      />
      <h1 class="my-4 text-4xl font-bold">Hello Solid!</h1>
      <Counter />
      <p class="my-4">
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <a
        class="font-semibold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4 transition-colors hover:text-sky-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
        href="https://v2.solidjs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}
