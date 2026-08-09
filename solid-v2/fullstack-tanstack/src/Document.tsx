import type { ParentProps } from 'solid-js';
import { HydrationScript, getRequestEvent } from '@solidjs/web';

// The document shell — the new index.html: picked up by the src/Document.*
// convention, it wraps the app in the plugin's generated entries and must
// render the full <html>. Head tags go here. It renders on the server only
// and ships zero client-side JS of its own.
export default function Document(props: ParentProps) {
  // The SSR → client Query handoff: src/setup.tsx parks the request's
  // dehydrated cache on the event, and this inline script carries it to the
  // client boot (src/App.tsx hydrates from it before anything renders). It
  // renders unconditionally — a conditional would add a hydration marker to
  // the shell, shifting the claim walk of the app markup below.
  const queryState = getRequestEvent()?.locals.queryState;

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Solid App</title>
        <HydrationScript />
        <script
          innerHTML={
            queryState
              ? `window.__QUERY_STATE__=${JSON.stringify(queryState).replace(/</g, '\\u003c')}`
              : ''
          }
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
