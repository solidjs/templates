import { render } from 'solid-js/web';

import { TodoList } from './todo-list';

render(() => <TodoList />, document.getElementById('root') as HTMLElement);
