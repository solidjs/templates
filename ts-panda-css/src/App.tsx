import type { Component } from 'solid-js';
import { css } from '../styled-system/css';

const App: Component = () => {
  return (
    <p
      class={css({
        textStyle: '5xl',
        fontWeight: 'bold',
        color: 'yellow.600',
        textAlign: 'center',
        py: '24',
      })}
    >
      Hello 🐼!
    </p>
  );
};

export default App;
