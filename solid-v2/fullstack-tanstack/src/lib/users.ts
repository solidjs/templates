// The app's RPC layer: plain server functions ('use server') — no router
// wrappers, because the router here isn't Solid's. On the server they are
// plain function calls; in the browser the compiler turns each into a typed
// fetch against the /_server endpoint. The reads are wrapped into TanStack
// Query options in src/lib/queries.ts; the mutations take typed arguments
// and are called through useMutation's `mutate` — the typical TanStack
// shape. (The plain fullstack template shows the alternative: FormData
// signatures + form `action` posts for no-JS progressive enhancement.)
import { reload } from '@solidjs/web';
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

// Mutations declare what they invalidate: `reload({ revalidate: key })`
// stamps the key on the response (Solid's X-Revalidate header), and the
// flight machinery scopes its work to it — the collection skips data the
// caller already holds that no key names, re-executes declared queries the
// loaders don't own (the session, on login/logout), and the client sweeps
// whatever a key matches beyond the shipped payload. A mutation that
// declares nothing keeps the unscoped behavior: rerun the page's loaders,
// ship everything they produce.
export async function login(id: string) {
  'use server';
  if (!findUser(id)) throw new Error(`No user "${id}"`);
  await setSession({ userId: id });
  return reload({ revalidate: 'current-user' });
}

export async function logout() {
  'use server';
  await clearSession();
  return reload({ revalidate: 'current-user' });
}

export async function renameUser(input: { id: string; name: string }) {
  'use server';
  // Server-side authorization off the session — the UI hiding the form is
  // cosmetic; this check is the real gate.
  if (!(await getSession())?.userId) throw new Error('Sign in to rename users');
  updateUser(input.id, { name: input.name });
  return reload({ revalidate: 'users' });
}
