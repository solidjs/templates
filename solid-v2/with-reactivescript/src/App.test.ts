import { createApp } from '@reactivescript/runtime';
import { flush } from 'solid-js';
import { afterEach, describe, expect, test } from 'vitest';
// @ts-expect-error rx-tsc's projection of App.rx has no default export yet
import main from './App.rx';

function mount() {
  const root = document.createElement('div');
  document.body.append(root);
  const app = createApp({ root });
  app.mount(main(app));
  const button = (label: RegExp) =>
    [...root.querySelectorAll('button')].find((b) => label.test(b.textContent ?? ''))!;
  return { root, button };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<App />', () => {
  test('the counter increments and reaches its milestone', () => {
    const { root, button } = mount();
    expect(button(/Clicks/)).toHaveTextContent('Clicks: 0');
    // Solid batches updates; flush() applies each click before the next.
    for (let i = 0; i < 5; i++) {
      button(/Clicks/).click();
      flush();
    }
    expect(button(/Clicks/)).toHaveTextContent('Clicks: 5');
    expect(root).toHaveTextContent('Milestone reached: 5 clicks!');
  });

  test('the guestbook lists signatures', () => {
    const { root, button } = mount();
    expect(root).toHaveTextContent('No signatures yet');
    button(/Sign/).click();
    flush();
    button(/Sign/).click();
    flush();
    expect(root).not.toHaveTextContent('No signatures yet');
    expect(root).toHaveTextContent('AdaGrace');
  });

  test('the user card loads, then shows a failure in its errored region', async () => {
    const { root, button } = mount();
    expect(root).toHaveTextContent('Loading…');
    await expect.poll(() => root.textContent).toContain('Ada Lovelace');
    for (let i = 0; i < 3; i++) {
      button(/Next/).click();
      flush();
    }
    await expect.poll(() => root.textContent).toContain('No user with id 4');
  });
});
