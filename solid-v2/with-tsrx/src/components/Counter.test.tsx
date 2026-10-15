import { render, fireEvent } from '@solidjs/testing-library';
import {
  captureArtifact,
  expectNoDiagnostics,
  expectRerunBudget,
} from '@solidjs/diagnostics';
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

  test('a click re-runs two scopes and trips no diagnostic', async () => {
    // captureArtifact opens Solid's dev-mode channels around the scenario —
    // diagnostics (coded reactive anti-patterns) and attribution (which
    // scopes re-ran, and why) — and folds what they saw into one artifact.
    const { artifact } = await captureArtifact(
      () => {
        const { getByRole } = render(() => <Counter />);
        const button = getByRole('button');
        fireEvent.click(button);
        flush();
        expect(button).toHaveTextContent('Clicks: 1');
      },
      { scenario: 'counter-click' },
    );
    // Correctness gate: nothing fired. Each code maps to its repair in
    // node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md.
    expectNoDiagnostics(artifact);
    // Granularity gate: one click re-runs exactly two scopes — the button's
    // text binding and the `@if` condition memo (`count() >= milestone()`)
    // — and nothing else. Raise the budget only with a reason;
    // `artifact.attribution.reruns` says what ran and what caused it.
    expectRerunBudget(artifact, 2);
  });
});
