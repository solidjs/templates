import { createSignal } from 'solid-js';
import './App.css';

// The app root: a plain content component — the document shell lives in
// src/Document.tsx. This file is the whole demo; replace its contents to
// start your app.
export default function App() {
  const [count, setCount] = createSignal(0);

  return (
    <main>
      <h1>Hello Solid!</h1>
      <button
        class="increment"
        onClick={() => setCount(count() + 1)}
        type="button"
      >
        Clicks: {count()}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
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
