import { Title } from '@solidjs/meta';
import { paths, Router } from './router';
import './App.css';

// The nav styles stay in App.css: a scoped <style> block does not reach
// markup rendered inside the <Router> render prop, and the tsrx-tsc/editor
// projection does not support <style> inside arrow functions yet. Scoped
// styles are demonstrated in src/components/*.tsrx.
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
