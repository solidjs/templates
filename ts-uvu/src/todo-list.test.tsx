import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { render, fireEvent, waitFor } from 'solid-testing-library';
import { isInDocument, hasStyle } from 'solid-dom-testing';

import { TodoList } from './todo-list';

const test = suite<ReturnType<typeof render>>('<TodoList />');

test.before.each((context) => {
  const returnValue = render(() => <TodoList />);
  Object.getOwnPropertyNames(returnValue).forEach((name) => {
    context[name] = returnValue[name];
  });
});

test.after.each(({ unmount }) => unmount());

test('it will render an text input and a button', ({
  getByPlaceholderText,
  getByText,
}) => {
  assert.ok(isInDocument(getByPlaceholderText('new todo here')));
  assert.ok(isInDocument(getByText('Add Todo')));
});

test('it will add a new todo', async ({ getByPlaceholderText, getByText }) => {
  const input = getByPlaceholderText('new todo here') as HTMLInputElement;
  const button = getByText('Add Todo');
  input.value = 'test new todo';
  fireEvent.click(button as HTMLInputElement);
  assert.is(input.value, '');
  await waitFor(() => assert.ok(isInDocument(getByText(/test new todo/))));
});

test('it will mark a todo as completed', async ({
  getByPlaceholderText,
  findByRole,
  getByText,
}) => {
  const input = getByPlaceholderText('new todo here') as HTMLInputElement;
  const button = getByText('Add Todo') as HTMLButtonElement;
  input.value = 'mark new todo as completed';
  fireEvent.click(button);
  const completed = (await findByRole('checkbox')) as HTMLInputElement;
  assert.is(completed?.checked, false);
  fireEvent.click(completed);
  assert.is(completed?.checked, true);
  const text = getByText('mark new todo as completed') as HTMLSpanElement;
  assert.ok(hasStyle(text, { 'text-decoration': 'line-through' }));
});

test.run();
