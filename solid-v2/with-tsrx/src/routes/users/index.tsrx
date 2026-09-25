import { Title } from '@solidjs/meta';
import users from '../../data/users.json';
import { paths } from '../../router';

// The layout's index page: what /users itself renders inside users.tsrx.
// Without an index, /users would fall through to the [...404] catch-all.
export default function UsersIndex() @{
  <section>
    <Title>Users - Solid App</Title>
    <ul>
      @for (const [id, user] of Object.entries(users)) {
        <li>
          <a href={paths.users(Number(id))}>{user.name}</a>
        </li>
      }
    </ul>
  </section>
}
