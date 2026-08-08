import type { ParentProps } from 'solid-js';
import { HydrationScript } from '@solidjs/web';

// The document shell: picked up by the src/Document.* convention, it wraps
// the app in the plugin's generated entries and must render the full <html>.
// The same file serves client mode (where it is prerendered as the static
// shell — <HydrationScript /> is inert there) and SSR (`ssr: true`), so the
// flip needs no document changes. Delete this file to fall back to the
// plugin's built-in shell.
export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Solid App</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
