import { Title } from '@solidjs/meta';
import Counter from '../components/Counter';
import logo from '../logo.svg';

export default function Home() {
  return (
    <main class="container py-5">
      <Title>Home - Solid App</Title>
      <img
        src={logo}
        class="logo-spin pe-none"
        style={{ height: '24vmin' }}
        alt="Solid logo"
      />
      <h1 class="my-3">Hello Solid!</h1>
      <Counter />
      <p class="my-3">
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <a
        href="https://docs.solidjs.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}
