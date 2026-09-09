import {createSignal} from 'solid-js';
import {customElement, noShadowDOM} from 'solid-element';

// https://github.com/solidjs/solid/blob/main/packages/solid-element

const style = `div * {
  font-size: 150%;
}
span {
  width: 4rem;
  display: inline-block;
  text-align: center;
}
button {
  width: 4rem;
  height: 4rem;
  border: none;
  border-radius: 10px;
  background-color: seagreen;
  color: white;
}`;

/**
 * Custom element to create a counter.
 * @example <my-counter initial-count="1"></my-counter>
 */
customElement('my-counter', {initialCount: 0}, props => {
  noShadowDOM();

  const [count, setCount] = createSignal(props.initialCount);

  return (
    <div>
      <style>{style}</style>
      <button onClick={() => setCount(count() - 1)}>-</button>
      <span>{count()}</span>
      <button onClick={() => setCount(count() + 1)}>+</button>
    </div>
  );
});
