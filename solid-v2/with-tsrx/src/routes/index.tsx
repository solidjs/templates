import { Title } from '@solidjs/meta';
import Counter from '../components/Counter.tsrx';
import Guestbook from '../components/Guestbook.tsrx';
import logo from '../logo.svg';

export default function Home() {
  return (
    <main>
      <Title>Home - Solid App</Title>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Hello TSRX!</h1>
      <Counter />
      <Guestbook />
      <p>
        Edit <code>src/components/Counter.tsrx</code> and save to reload.
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
