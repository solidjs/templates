import { Title } from '@solidjs/meta';
import { type RouteDefinition, type RouteProps } from '@solidjs/router';
import { createMemo, Show } from 'solid-js';
import { getPost } from '../../data';
import { paths } from '../../router';

// A dynamic route, statically built: the crawl found each slug by
// following links from /posts, and every getPost(slug) call it executed
// became its own artifact — one file per argument list. On the deployed
// site, client-side navigation here fetches that file; there is no server
// to ask for anything else.
export const route = {
  preload: ({ params }) => void getPost(params.slug!),
} satisfies RouteDefinition;

export default function PostPage(props: RouteProps<'/posts/:slug'>) {
  const post = createMemo(() => getPost(props.params.slug!));

  return (
    <Show when={post()} fallback={<p>No such post.</p>}>
      {(found) => (
        <article>
          <Title>{`${found().title} - Solid App`}</Title>
          <h2>{found().title}</h2>
          <p>
            <time>{found().publishedAt.toISOString().slice(0, 10)}</time>
          </p>
          <p>{found().body}</p>
          <p>
            <a href={paths.posts()}>Back to posts</a>
          </p>
        </article>
      )}
    </Show>
  );
}
