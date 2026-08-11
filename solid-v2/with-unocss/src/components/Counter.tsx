import { createSignal } from 'solid-js';

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <button
      class="cursor-pointer rounded border border-slate-300 px-6 py-2 text-base hover:bg-slate-100"
      onClick={() => setCount(count() + 1)}
      type="button"
    >
      Clicks: {count()}
    </button>
  );
}
