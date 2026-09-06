import { Title } from '@solidjs/meta';
import { announceRoutes } from '@solidjs/prerender';
import { Loading } from 'solid-js';
import { paths, Router } from './router';
import './App.css';

// The app root: the router and the site-wide layout live here. Pages are
// the modules under src/routes. The build crawls them into static HTML
// starting from "/", and `announceRoutes` tells the crawl about the router's
// static pages so one nothing links to still builds. (A no-op for visitors
// and in the browser.)
export default function App() {
  announceRoutes(Router);
  return (
    <Router>
      {(props) => (
        <>
          <Title>Solid App</Title>
          <nav>
            <a href={paths()}>Home</a>
            <a href={paths.posts()}>Posts</a>
          </nav>
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}
