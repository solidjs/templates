// The app's RPC layer: plain server functions ('use server') — no router
// wrappers, because the router here isn't Solid's. On the server they are
// plain function calls; in the browser the compiler turns each into a typed
// fetch against the /_server endpoint. The reads are wrapped into TanStack
// Query options in src/lib/queries.ts; the mutations take FormData so the
// same function serves a native form post (no JS) and an enhanced submit.
import { GET } from '@solidjs/web/server-functions';

import { findUser, listUsers, updateUser } from '../server/db';
import { clearSession, getSession, setSession } from '../server/session';

// Reads are marked GET: without it, every server-function call is a POST,
// and while a single-flight consumer is subscribed (src/App.tsx) the client
// stamps X-Single-Flight on every POST — so each useQuery fetch would make
// the server rerun the whole page's loaders and hold the response until the
// slowest one settled. GET calls skip the flight header (and get cacheable
// HTTP semantics).
export const getUsers = GET(async () => {
  'use server';
  return listUsers();
});

export const getUser = GET(async (id: string) => {
  'use server';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return findUser(id) ?? { name: 'Unknown', title: 'No such user' };
});

// The session read: who is signed in. The cookie writes in login/logout
// ride the outgoing response (see src/server/session.ts).
export const getCurrentUser = GET(async () => {
  'use server';
  const userId = (await getSession())?.userId;
  const user = userId ? findUser(userId) : undefined;
  return user ? { id: userId!, ...user } : null;
});

export async function login(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!findUser(id)) throw new Error(`No user "${id}"`);
  await setSession({ userId: id });
}

export async function logout() {
  'use server';
  await clearSession();
}

export async function renameUser(formData: FormData) {
  'use server';
  // Server-side authorization off the session — the UI hiding the form is
  // cosmetic; this check is the real gate.
  if (!(await getSession())?.userId) throw new Error('Sign in to rename users');
  updateUser(String(formData.get('id') ?? ''), {
    name: String(formData.get('name') ?? ''),
  });
}
