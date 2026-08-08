// The session cookie as plain functions over the request event: read parses
// it off the incoming request, write re-serializes it onto the response
// head. Both are called from src/middleware.ts, which exposes the decoded
// session as `event.locals.session`. For real apps, sign or encrypt the
// value — the shape of this module stays the same.
import 'server-only';

import {
  getRequestEvent,
  parseCookieHeader,
  serializeCookie,
} from '@solidjs/web';

const COOKIE = 'session';

export interface Session {
  /** Ids of the users viewed in this session, most recent first. */
  viewed: string[];
}

export function readSession(): Session {
  const cookies = parseCookieHeader(
    getRequestEvent()?.request.headers.get('cookie') ?? '',
  );
  try {
    return { viewed: [], ...JSON.parse(cookies[COOKIE] ?? '{}') };
  } catch {
    return { viewed: [] };
  }
}

export function writeSession(session: Session, headers: Headers) {
  headers.append(
    'set-cookie',
    serializeCookie(COOKIE, JSON.stringify(session), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    }),
  );
}
