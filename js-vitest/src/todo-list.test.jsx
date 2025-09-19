import { render, fireEvent } from '@solidjs/testing-library';

import { TodoList } from './todo-list';

describe('<TodoList />', () => {
  test('it will render an text input and a button', () => {
    const { getByPlaceholderText, getByText } = render(() => <TodoList />);
    expect(getByPlaceholderText('new todo here')).toBeInTheDocument();
    expect(getByText('Add Todo')).toBeInTheDocument();
  });

  test('it will add a new todo', async () => {
    const { getByPlaceholderText, getByText } = render(() => <TodoList />);
    const input = getByPlaceholderText('new todo here');
    const button = getByText('Add Todo');
    input.value = 'test new todo';
    fireEvent.click(button);
    expect(input.value).toBe('');
    expect(getByText(/test new todo/)).toBeInTheDocument();
  });

  test('it will mark a todo as completed', async () => {
    const { getByPlaceholderText, findByRole, getByText } = render(() => (
      <TodoList />
    ));
    const input = getByPlaceholderText('new todo here');
    const button = getByText('Add Todo');
    input.value = 'mark new todo as completed';
    fireEvent.click(button);
    const completed = await findByRole('checkbox');
    expect(completed?.checked).toBe(false);
    fireEvent.click(completed);
    expect(completed?.checked).toBe(true);
    const text = getByText('mark new todo as completed');
    expect(text).toHaveStyle({ 'text-decoration': 'line-through' });
  });
});
