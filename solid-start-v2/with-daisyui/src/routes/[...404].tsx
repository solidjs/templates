import { A } from '@solidjs/router';

export default function NotFound() {
  return (
    <main class="hero">
      <section class="hero-content flex-col text-center justify-center">
        <h1 class="text-6xl text-accent font-thin uppercase my-16">
          Not Found
        </h1>
        <p class="mt-8">
          Visit{' '}
          <a
            href="https://solidjs.com"
            target="_blank"
            class="link link-accent link-hover"
          >
            solidjs.com
          </a>{' '}
          to learn how to build Solid apps.
        </p>
        <div class="menu menu-horizontal gap-2">
          <A href="/" class="link link-accent link-hover">
            Home
          </A>
          <A href="/about" class="link link-accent link-hover">
            About Page
          </A>
        </div>
      </section>
    </main>
  );
}
