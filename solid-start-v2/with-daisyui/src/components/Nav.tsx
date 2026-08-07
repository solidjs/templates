import { useLocation } from '@solidjs/router';

export default function Nav() {
  const location = useLocation();

  return (
    <nav class="navbar bg-base-300 shadow-sm">
      <ul class="menu menu-horizontal gap-2">
        <li>
          <a
            href="/"
            class="btn btn-soft btn-accent"
            classList={{ 'btn-active': '/' === location.pathname }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/about"
            class="btn btn-soft btn-accent"
            classList={{
              'btn-active': '/about' === location.pathname,
            }}
          >
            About
          </a>
        </li>
      </ul>
    </nav>
  );
}
