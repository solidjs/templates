import type { ParentProps } from 'solid-js';

// The document shell — the new index.html: picked up by the src/Document.*
// convention, it wraps the app in the plugin's generated entries and must
// render the full <html>. Head tags go here. It is compiled only into the
// prerendered static shell and ships zero client-side JS. Delete this file
// to fall back to the plugin's built-in shell.
//
// When flipping to SSR (`ssr: true` in vite.config.ts), also add
// `<HydrationScript />` from '@solidjs/web' to <head>.
export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Solid App</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
