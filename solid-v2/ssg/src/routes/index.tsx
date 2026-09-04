import { Title } from '@solidjs/meta';
import Counter from '../components/Counter';
import logo from '../logo.svg';
import { paths } from '../router';

export default function Home() {
  return (
    <main>
      <Title>Home - Solid App</Title>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Every page here is a file.</h1>
      <Counter />
      <p>
        Built with streaming SSR at build time, deployed as plain HTML and
        JSON. The counter above hydrates and works — this is a full Solid
        app, it just has no server.
      </p>
      <p>
        <a href={paths.posts()}>Read the posts</a> — their data comes from
        server functions executed during the build.
      </p>
    </main>
  );
}
