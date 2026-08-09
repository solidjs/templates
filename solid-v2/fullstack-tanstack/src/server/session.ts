// Signed cookie sessions: `@remix-run/cookie` (signed HMAC-SHA256 on pure
// WebCrypto — node/deno/bun/workerd — with secret rotation built in)
// composed over @solidjs/web's request event. There is no Solid session API
// on purpose: cookies are a web standard, so sessions compose from a
// standard cookie library instead of a framework opinion.
//
// Reads come off `event.request`; writes append to the `event.response`
// stub and ride whatever response leaves, thrown redirects included (the
// set-session-then-`throw redirect()` login flow works by construction).
//
// Signed, NOT encrypted: the payload is tamper-proof but client-readable.
// Never put secrets in it. (The virtual:env/server import is also the
// server-only boundary: pulling this module into client code fails the
// build, naming the importer.)
import { getRequestEvent } from '@solidjs/web';
import type { RequestEvent, ResponseStub } from '@solidjs/web';
import { createCookie } from '@remix-run/cookie';
import { env } from 'virtual:env/server';

/** Augment with whatever the app stores; keep it small (cookies cap at ~4KB). */
export interface SessionData {
  userId?: string;
}

const MAX_AGE = 60 * 60 * 24 * 7; // seconds — drives cookie Max-Age AND the enforced expiry

// Rotation: SESSION_SECRET is comma-separated, newest first — the first
// entry signs, every entry verifies. To rotate, prepend the new secret
// (`SESSION_SECRET="new,old"`) and drop the old one after a MAX_AGE
// window. Dropping every old secret logs every outstanding session out.
const secrets = (env.SESSION_SECRET ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (secrets.length === 0) {
  throw new Error(
    'session: SESSION_SECRET is not set — generate one with `openssl rand -base64 32`',
  );
}

const cookie = createCookie('session', {
  secrets,
  httpOnly: true, // explicit: @remix-run/cookie defaults httpOnly/secure to FALSE
  secure: true,
  sameSite: 'Lax',
  maxAge: MAX_AGE,
});

function event(): RequestEvent & { response: ResponseStub } {
  const e = getRequestEvent();
  if (!e) {
    throw new Error(
      'session: no request event — call within a server function, SSR handler, or middleware',
    );
  }
  return e as RequestEvent & { response: ResponseStub };
}

/**
 * The current session, or `null` — absent, tampered, signed by a
 * rotated-out secret, and expired all read the same. Reads the REQUEST's
 * cookie only: a `setSession` in the same request does not read back
 * (the request is what arrived; the response is what you're building).
 */
export async function getSession(): Promise<SessionData | null> {
  const raw = await cookie.parse(event().request.headers.get('cookie'));
  if (!raw) return null;
  try {
    const { data, exp } = JSON.parse(raw) as { data: SessionData; exp: number };
    // Expiry is enforced HERE, server-side: the signed format carries no
    // expiry of its own (the MAC covers the value only), and cookie
    // Max-Age is browser hygiene a client is free to ignore.
    return typeof exp === 'number' && Date.now() < exp * 1000 ? data : null;
  } catch {
    return null;
  }
}

/** Replaces the session (whole-payload write) on the outgoing response. */
export async function setSession(data: SessionData): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  event().response.headers.append(
    'set-cookie',
    await cookie.serialize(JSON.stringify({ data, exp })),
  );
}

/** Expires the session cookie on the outgoing response. */
export async function clearSession(): Promise<void> {
  event().response.headers.append(
    'set-cookie',
    await cookie.serialize('', { maxAge: 0 }),
  );
}
