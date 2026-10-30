import { createSignal } from 'solid-js';
import logo from './logo.svg';
import './App.css';

export default function App() {
  const [count, setCount] = createSignal(0);

  return (
    <header class="header">
      <img src={logo} class="logo" alt="Solid logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <button class="increment" onClick={() => setCount(count() + 1)}>
        Clicks: {count()}
      </button>
      <a
        class="link"
        href="https://v2.solidjs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </header>
  );
}
