import { createSignal } from 'solid-js';

export default function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button
      class="btn btn-primary btn-xl"
      onClick={() => setCount(count() + 1)}
    >
      Clicks: {count()}
    </button>
  );
}
