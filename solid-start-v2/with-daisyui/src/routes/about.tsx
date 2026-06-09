import { A } from '@solidjs/router';
import Counter from '~/components/Counter';

export default function About() {
  return (
    <main class="hero">
      <section class="hero-content flex-col text-center justify-center">
        <h1 class="max-6-xs text-6xl text-accent font-thin uppercase my-16">
          About Page
        </h1>
        <Counter />
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
          <span>About Page</span>
        </div>
      </section>
    </main>
  );
}
