import { For, createSignal } from 'solid-js';

export const TodoList = () => {
  let input;
  let todoId = 0;
  const [todos, setTodos] = createSignal([]);
  const addTodo = (text) => {
    setTodos([...todos(), { id: ++todoId, text, completed: false }]);
  };
  const toggleTodo = (id) => {
    setTodos(
      todos().map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <>
      <div>
        <input placeholder="new todo here" ref={input} />
        <button
          onClick={() => {
            if (!input.value.trim()) return;
            addTodo(input.value);
            input.value = '';
          }}
        >
          Add Todo
        </button>
      </div>
      <For each={todos()}>
        {(todo) => {
          const { id, text } = todo;
          return (
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onchange={[toggleTodo, id]}
              />
              <span
                style={{
                  'text-decoration': todo.completed ? 'line-through' : 'none',
                }}
              >
                {text}
              </span>
            </div>
          );
        }}
      </For>
    </>
  );
};
