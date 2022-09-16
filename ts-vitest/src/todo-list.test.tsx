import { describe, expect, test as it } from 'vitest';
import { render, fireEvent, screen } from 'solid-testing-library';
import { TodoList } from './todo-list';

describe('<TodoList />', () => {
  it('should render an text input and a button', () => {
    const { unmount } = render(() => <TodoList />);

    expect(screen.getByPlaceholderText('new todo here')).toBeInTheDocument();
    expect(screen.getByText('Add Todo')).toBeInTheDocument();

    unmount();
  });

  it('should add a new todo', async () => {
    const { unmount } = render(() => <TodoList />);
    const newTodoPlaceholder = 'new todo here';
    const todoTitle = 'test new todo';

    fireEvent.change(screen.getByPlaceholderText(newTodoPlaceholder), {
      target: {
        value: todoTitle,
      },
    });

    expect(screen.getByPlaceholderText(newTodoPlaceholder)).toHaveValue(
      todoTitle,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add Todo',
        exact: false,
      }),
    );

    expect(screen.getByPlaceholderText(newTodoPlaceholder)).toHaveValue('');
    expect(
      screen.getByText(todoTitle, {
        exact: false,
      }),
    ).toBeInTheDocument();

    unmount();
  });

  it('should mark a todo as completed', async () => {
    const { unmount } = render(() => <TodoList />);
    const todoTitle = 'mark new todo as completed';

    fireEvent.change(screen.getByPlaceholderText('new todo here'), {
      target: {
        value: todoTitle,
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add Todo',
        exact: false,
      }),
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    fireEvent.change(screen.getByRole('checkbox'), {
      target: {
        value: 'on',
      },
    });

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(
      screen.getByText(todoTitle, {
        exact: false,
      }),
    ).toHaveStyle({ 'text-decoration': 'line-through' });

    unmount();
  });
});
