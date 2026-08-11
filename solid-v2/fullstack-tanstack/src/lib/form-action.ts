// The no-JS half of a mutation form: every 'use server' reference carries
// the URL that invokes it over HTTP (@solidjs/web's ServerFunction
// contract). A form whose `action` points there posts natively — before
// hydration, or with JavaScript off — and the server runs the function and
// redirects back to the referring page, which re-renders with the new
// state. TypeScript only sees the function's source signature, so this
// accessor does the narrowing once instead of casting at every form.
import { isServerFunction } from '@solidjs/web/server-functions';

export function formAction(fn: (...args: never[]) => Promise<unknown>): string {
  if (!isServerFunction(fn)) throw new Error('Expected a server function');
  return fn.url;
}
