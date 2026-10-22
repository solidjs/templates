import { Title } from '@solidjs/meta';
import type { RouteDefinition } from '@solidjs/router';
import { httpStatus } from '@solidjs/web';

// The catch-all route. httpStatus() is a no-op in the browser and takes
// effect when SSR is enabled; it runs in preload so the status code is set
// before the response head flushes.
export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition;

export default function NotFound() {
  return (
    <main class="px-4 py-12">
      <Title>Not Found - Solid App</Title>
      <h1 class="my-4 text-4xl font-bold">Page Not Found</h1>
      <p class="my-4">
        Visit{' '}
        <a
          class="font-semibold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4 transition-colors hover:text-sky-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          href="https://docs.solidjs.com"
          target="_blank"
          rel="noreferrer"
        >
          docs.solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
    </main>
  );
}
