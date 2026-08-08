// The app's data layer: server functions ('use server') the UI calls
// directly. On the server they are plain function calls; in the browser the
// compiler turns each into a typed fetch against the /_server endpoint.
// query() caches reads per key; action() marks writes, and the router
// revalidates queries after an action settles.
import { action, query } from '@solidjs/router';
import { getRequestEvent } from '@solidjs/web';

import { findUser, listUsers, updateUser } from './db';

export const getUsers = query(async () => {
  'use server';
  return listUsers();
}, 'users');

export const getUser = query(async (id: string) => {
  'use server';
  // Record the visit in the session (decoded by src/middleware.ts, which
  // also commits the change back into the cookie).
  const session = getRequestEvent()!.locals.session;
  session.viewed = [id, ...session.viewed.filter((v) => v !== id)].slice(0, 3);
  return findUser(id) ?? { name: 'Unknown', title: 'No such user' };
}, 'user');

export const getViewedUsers = query(async () => {
  'use server';
  const { viewed } = getRequestEvent()!.locals.session;
  return viewed.flatMap((id) => {
    const user = findUser(id);
    return user ? [{ id, ...user }] : [];
  });
}, 'viewed-users');

export const renameUser = action(async (id: string, formData: FormData) => {
  'use server';
  updateUser(id, { name: String(formData.get('name') ?? '') });
});
