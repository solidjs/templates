import { render, fireEvent } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { describe, expect, test } from 'vitest';

import Counter from './Counter';

describe('<Counter />', () => {
  test('it increments on click', () => {
    const { getByRole } = render(() => <Counter />);
    const button = getByRole('button');
    expect(button).toHaveTextContent('Clicks: 0');
    fireEvent.click(button);
    // Solid batches DOM updates; flush() applies them synchronously.
    flush();
    expect(button).toHaveTextContent('Clicks: 1');
  });
});
