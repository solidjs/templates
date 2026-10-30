import { render, fireEvent } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { describe, expect, test } from 'vitest';

import Guestbook from './Guestbook.tsrx';

describe('<Guestbook />', () => {
  test('@empty renders while the list is empty, @for takes over after', () => {
    const { getByRole, getByText, getAllByRole, queryByText } = render(() => (
      <Guestbook />
    ));
    expect(getByText(/No signatures yet/)).toBeInTheDocument();

    const button = getByRole('button');
    fireEvent.click(button);
    flush();
    expect(queryByText(/No signatures yet/)).not.toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(1);
    expect(getByText(/1\. Ada/)).toBeInTheDocument();

    fireEvent.click(button);
    flush();
    expect(getAllByRole('listitem')).toHaveLength(2);
    expect(getByText(/2\. Grace/)).toBeInTheDocument();
  });
});
