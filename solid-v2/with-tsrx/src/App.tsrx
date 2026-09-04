import { Title } from '@solidjs/meta';
import { paths, Router } from './router';
import './App.css';

// The app root: the router and the site-wide layout live here. Pages are
// the modules under src/routes. The nav styles stay in App.css: a scoped
// <style> block reaches its sibling elements and their descendants, but not
// markup rendered inside the <Router> render prop — and the tsrx-tsc/editor
// projection does not support <style> inside arrow functions yet. Scoped
// styles are demonstrated in src/components/*.tsrx, where they work
// end-to-end.
export default function App() @{
  <Router>
    {(props) => @{
      <>
        <Title>Solid App</Title>
        <nav>
          <a href={paths()}>Home</a>
          <a href={paths.users(1)}>Users</a>
        </nav>
        @try {
          <>{props.children}</>
        } @pending {
          <main>Loading…</main>
        }
      </>
    }}
  </Router>
}
