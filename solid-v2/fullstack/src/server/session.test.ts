/**
 * The session helper against the REAL @solidjs/web server runtime: every
 * test drives a full request/response cycle — a web `Request` into
 * `createRequestEvent`, the helper running inside `provideRequestEvent`'s
 * scope, the outgoing `Response` derived by `commitEventResponse` (the
 * same fold server-function responses take), and the NEXT request
 * carrying the previous response's Set-Cookie — not a mocked event bag.
 *
 * The secrets live in process.env.SESSION_SECRET (comma-separated,
 * newest first), read through the virtual:env/server contract at module
 * init — so each test loads a fresh copy of the module via
 * `loadSession(secret)` to pin its own secret list, which is also
 * exactly how a rotation deployment behaves (new process, new list).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { commitEventResponse, createRequestEvent } from '@solidjs/web';
import { provideRequestEvent } from '@solidjs/web/storage';

type SessionModule = typeof import('./session');

async function loadSession(secret: string): Promise<SessionModule> {
  process.env.SESSION_SECRET = secret;
  vi.resetModules();
  return import('./session');
}

afterEach(() => {
  vi.useRealTimers();
  delete process.env.SESSION_SECRET;
});

/** One full server round trip: request in, handler under the event scope, Response out. */
async function runRequest<T>(
  request: Request,
  handler: () => Promise<T>,
): Promise<{ result: T; response: Response }> {
  const event = createRequestEvent(request);
  return provideRequestEvent(event, async () => {
    const result = await handler();
    const response = commitEventResponse(new Response('ok'), event);
    return { result, response };
  });
}

/** Extracts the session cookie pair ("session=...") from a response, ready for a Cookie header. */
function sessionPair(response: Response): string {
  const entries = response.headers
    .getSetCookie()
    .filter((c) => c.startsWith('session='));
  expect(entries.length).toBeGreaterThan(0);
  return entries[entries.length - 1].split(';')[0];
}

describe('session helper (real request/response cycle)', () => {
  it('login sets a signed, attribute-correct session cookie on the outgoing response', async () => {
    const { setSession } = await loadSession('secret-one');
    const { response } = await runRequest(
      new Request('http://localhost/login'),
      () => setSession({ userId: 'user_1' }),
    );
    const [cookie] = response.headers.getSetCookie();
    expect(cookie).toMatch(/^session=/);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain(`Max-Age=${60 * 60 * 24 * 7}`);
    // signed: value.signature, neither readable as plain JSON
    expect(cookie.split(';')[0]).toMatch(/^session=[^;]+\.[^;.]+$/);
  });

  it('the next request carrying the cookie reads the session back', async () => {
    const session = await loadSession('secret-one');
    const login = await runRequest(new Request('http://localhost/login'), () =>
      session.setSession({ userId: 'user_1' }),
    );
    const { result } = await runRequest(
      new Request('http://localhost/me', {
        headers: { cookie: sessionPair(login.response) },
      }),
      () => session.getSession(),
    );
    expect(result).toEqual({ userId: 'user_1' });
  });

  it('no cookie, foreign cookies, or a tampered value all read as null', async () => {
    const session = await loadSession('secret-one');
    const login = await runRequest(new Request('http://localhost/login'), () =>
      session.setSession({ userId: 'user_1' }),
    );
    const pair = sessionPair(login.response);
    const tampered = pair.replace(
      /^session=(.)/,
      (_, c) => `session=${c === 'A' ? 'B' : 'A'}`,
    );

    for (const headers of [
      undefined,
      { cookie: 'theme=dark; other=1' },
      { cookie: tampered },
    ] as const) {
      const { result } = await runRequest(
        new Request('http://localhost/me', { headers }),
        () => session.getSession(),
      );
      expect(result).toBeNull();
    }
  });

  it('expiry is enforced server-side even though the cookie is still presented', async () => {
    const session = await loadSession('secret-one');
    const login = await runRequest(new Request('http://localhost/login'), () =>
      session.setSession({ userId: 'user_1' }),
    );
    const pair = sessionPair(login.response);

    // a rogue client keeps sending the cookie after Max-Age
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + (60 * 60 * 24 * 7 + 60) * 1000);
    const { result } = await runRequest(
      new Request('http://localhost/me', { headers: { cookie: pair } }),
      () => session.getSession(),
    );
    expect(result).toBeNull();
  });

  it("rotation: a cookie signed under the old secret verifies under 'new,old', not under 'new'", async () => {
    const oldDeploy = await loadSession('old-secret');
    const login = await runRequest(new Request('http://localhost/login'), () =>
      oldDeploy.setSession({ userId: 'user_1' }),
    );
    const pair = sessionPair(login.response);

    const rotated = await loadSession('new-secret,old-secret');
    const kept = await runRequest(
      new Request('http://localhost/me', { headers: { cookie: pair } }),
      () => rotated.getSession(),
    );
    expect(kept.result).toEqual({ userId: 'user_1' });

    const dropped = await loadSession('new-secret');
    const gone = await runRequest(
      new Request('http://localhost/me', { headers: { cookie: pair } }),
      () => dropped.getSession(),
    );
    expect(gone.result).toBeNull();
  });

  it('fresh cookies are signed by the FIRST secret in the list', async () => {
    const rotated = await loadSession('new-secret,old-secret');
    const login = await runRequest(new Request('http://localhost/login'), () =>
      rotated.setSession({ userId: 'user_2' }),
    );
    const pair = sessionPair(login.response);

    const newOnly = await loadSession('new-secret');
    const { result } = await runRequest(
      new Request('http://localhost/me', { headers: { cookie: pair } }),
      () => newOnly.getSession(),
    );
    expect(result).toEqual({ userId: 'user_2' });
  });

  it('clearSession expires the cookie on the outgoing response', async () => {
    const session = await loadSession('secret-one');
    const { response } = await runRequest(
      new Request('http://localhost/logout'),
      () => session.clearSession(),
    );
    const [cookie] = response.headers.getSetCookie();
    expect(cookie).toMatch(/^session=;/);
    expect(cookie).toContain('Max-Age=0');
  });

  it('missing SESSION_SECRET fails loudly at module init', async () => {
    delete process.env.SESSION_SECRET;
    vi.resetModules();
    await expect(import('./session')).rejects.toThrow(
      /SESSION_SECRET is not set/,
    );
  });

  it('outside a request scope the helpers fail with a directed error', async () => {
    const { getSession } = await loadSession('secret-one');
    await expect(getSession()).rejects.toThrow(/no request event/);
  });
});
