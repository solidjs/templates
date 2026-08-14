import { createSignal } from 'solid-js';
import logo from './logo.svg';
import './App.css';

// The app root: a plain content component — the document shell lives in
// src/Document.tsx. This file is the whole demo; replace its contents to
// start your app.
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
