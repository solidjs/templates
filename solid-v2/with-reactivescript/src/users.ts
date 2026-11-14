import users from './data/users.json';

export type User = { name: string; title: string };

export class NotFound extends Error {
  constructor(id: number) {
    super(`No user with id ${id}`);
  }
}

// Stands in for a real API call: swap the body for a fetch().
export async function fetchUser(id: number): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = users[String(id) as keyof typeof users];
  if (!user) throw new NotFound(id);
  return user;
}
