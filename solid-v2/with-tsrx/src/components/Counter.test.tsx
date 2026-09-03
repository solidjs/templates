import { render, fireEvent } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { describe, expect, test } from 'vitest';

// .tsrx modules import with their extension spelled out — the extension is
// what routes them through the TSRX compiler frontend.
import Counter from './Counter.tsrx';

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

  test('the @if block renders once the milestone is reached', () => {
    const { getByRole, getByText, queryByText } = render(() => (
      <Counter milestone={2} />
    ));
    const button = getByRole('button');
    expect(queryByText(/Milestone reached/)).not.toBeInTheDocument();
    fireEvent.click(button);
    flush();
    expect(queryByText(/Milestone reached/)).not.toBeInTheDocument();
    fireEvent.click(button);
    flush();
    expect(getByText(/Milestone reached: 2 clicks!/)).toBeInTheDocument();
  });
});
