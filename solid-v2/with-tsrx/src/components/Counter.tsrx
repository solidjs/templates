import { createSignal } from 'solid-js';

// A TSRX component is an ordinary function whose body is a statement
// container: `@{` opens TypeScript setup statements followed by exactly one
// rendered output. The <style> block is scoped to this component — the
// compiler prunes unused selectors and emits the rest as a virtual CSS
// sidecar that follows the module through dev, HMR, and production builds.
export default function Counter(props: { milestone?: number }) @{
  const [count, setCount] = createSignal(0);
  const milestone = () => props.milestone ?? 5;
  <>
    <style>
      .increment {
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        cursor: pointer;
      }

      .milestone {
        margin-top: 0.75rem;
        color: rgb(22, 163, 74);
        font-weight: 600;
      }
    </style>
    <button
      class="increment"
      onClick={() => setCount(count() + 1)}
      type="button"
    >
      Clicks: {count()}
    </button>
    @if (count() >= milestone()) {
      <p class="milestone">Milestone reached: {count()} clicks!</p>
    }
  </>
}
