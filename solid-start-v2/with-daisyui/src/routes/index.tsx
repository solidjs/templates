import { A } from '@solidjs/router';
import Counter from '~/components/Counter';

export default function Home() {
  return (
    <main class="hero">
      <section class="hero-content flex-col text-center justify-center">
        <h1 class="max-6-xs text-6xl text-accent font-thin uppercase my-16">
          Hello world!
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
          <span>Home</span>
          <A href="/about" class="link link-accent link-hover">
            About Page
          </A>
        </div>
      </section>
    </main>
  );
}
