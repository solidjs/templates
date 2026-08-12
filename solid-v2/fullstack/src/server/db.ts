// The data source, as a server-only module: importing it from code that
// could reach the client bundle fails the build (the `server-only` marker
// comes typed via @solidjs/vite-plugin/boundary-modules). Swap the Map for a
// real database client — this file is the only place that knows.
import 'server-only';

export interface User {
  name: string;
  title: string;
}

const users = new Map<string, User>([
  ['1', { name: 'Ada Lovelace', title: 'Wrote the first program' }],
  ['2', { name: 'Grace Hopper', title: 'Invented the compiler' }],
  ['3', { name: 'Margaret Hamilton', title: 'Took Apollo to the moon' }],
]);

export function listUsers() {
  return Array.from(users, ([id, user]) => ({ id, ...user }));
}

export function findUser(id: string) {
  return users.get(id);
}

export function updateUser(id: string, data: Partial<User>) {
  const user = users.get(id);
  if (user) users.set(id, { ...user, ...data });
}
