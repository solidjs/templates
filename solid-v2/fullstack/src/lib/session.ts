// The session cookie as plain functions over the request event: read parses
// and verifies it off the incoming request, write signs and re-serializes it
// onto the response headers. Both are called from src/middleware.ts, which
// exposes the decoded session as `event.locals.session`.
import 'server-only';

import { createHmac } from 'node:crypto';
import { getRequestEvent, parseCookieHeader, serializeCookie } from '@solidjs/web';

const COOKIE = 'session';

// Validated at startup so misconfiguration fails loud, not as a silently
// unsigned cookie. See .env.example.
const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    'SESSION_SECRET must be set (32+ chars). Copy .env.example to .env and fill it in.',
  );
}

export interface Session {
  /** Ids of the users viewed in this session, most recent first. */
  viewed: string[];
}

const sign = (payload: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

export function readSession(): Session {
  const cookies = parseCookieHeader(
    getRequestEvent()?.request.headers.get('cookie') ?? '',
  );
  // Tampered or unsigned cookies fail verification and fall back to a
  // fresh session.
  const [payload, signature] = cookies[COOKIE]?.split('.') ?? [];
  if (!payload || signature !== sign(payload)) return { viewed: [] };
  return {
    viewed: [],
    ...JSON.parse(Buffer.from(payload, 'base64url').toString()),
  };
}

export function writeSession(session: Session, headers: Headers) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  headers.append(
    'set-cookie',
    serializeCookie(COOKIE, `${payload}.${sign(payload)}`, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    }),
  );
}
