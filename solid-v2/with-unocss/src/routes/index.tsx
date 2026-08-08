import { Title } from '@solidjs/meta';
import Counter from '../components/Counter';
import logo from '../logo.svg';

export default function Home() {
  return (
    <main class="px-4 py-12">
      <Title>Home - Solid App</Title>
      <img
        src={logo}
        class="logo-spin pointer-events-none mx-auto h-[24vmin]"
        alt="Solid logo"
      />
      <h1 class="my-4 text-4xl font-bold">Hello Solid!</h1>
      <Counter />
      <p class="my-4">
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <a
        class="text-sky-700 underline"
        href="https://docs.solidjs.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}
