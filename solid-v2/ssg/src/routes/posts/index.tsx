import { Title } from '@solidjs/meta';
import { createMemo, For } from 'solid-js';
import { getPosts } from '../../data';
import { paths } from '../../router';

// The list is one prerendered call, baked into a single artifact at build
// time. The links below are also how the build finds the post pages: the
// crawl renders this page, follows every same-origin href, and prerenders
// whatever it reaches — add a post to src/server/posts.ts and the next
// build emits its page, no config.
export default function PostsIndex() {
  const posts = createMemo(() => getPosts());
  return (
    <section>
      <Title>Posts - Solid App</Title>
      <ul>
        <For each={posts()}>
          {(post) => (
            <li>
              <a href={paths.posts(post.slug)}>{post.title}</a>{' '}
              <small>{post.publishedAt.toISOString().slice(0, 10)}</small>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
