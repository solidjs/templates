// The app's data layer: server functions ('use server') the UI calls
// directly. On the server they are plain function calls; in the browser the
// compiler turns each into a typed fetch against the /_server endpoint.
// query() caches reads per key; action() marks writes, and the router
// revalidates queries after an action settles.
import { action, query } from '@solidjs/router';

import { findUser, listUsers, updateUser } from '../server/db';
import { clearSession, getSession, setSession } from '../server/session';

export const getUsers = query(async () => {
  'use server';
  return listUsers();
}, 'users');

export const getUser = query(async (id: string) => {
  'use server';
  return findUser(id) ?? { name: 'Unknown', title: 'No such user' };
}, 'user');

// The session read: who is signed in. The cookie write in login/logout
// rides the outgoing response (see src/server/session.ts), and because
// they are actions, the router refetches this query when they settle.
export const getCurrentUser = query(async () => {
  'use server';
  const userId = (await getSession())?.userId;
  const user = userId ? findUser(userId) : undefined;
  return user ? { id: userId!, ...user } : null;
}, 'current-user');

export const login = action(async (formData: FormData) => {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!findUser(id)) throw new Error(`No user "${id}"`);
  await setSession({ userId: id });
});

export const logout = action(async () => {
  'use server';
  await clearSession();
});

export const renameUser = action(async (id: string, formData: FormData) => {
  'use server';
  // Server-side authorization off the session — the UI hiding the form is
  // cosmetic; this check is the real gate.
  if (!(await getSession())?.userId) throw new Error('Sign in to rename users');
  updateUser(id, { name: String(formData.get('name') ?? '') });
});
