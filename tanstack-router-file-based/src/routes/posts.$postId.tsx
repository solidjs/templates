import { createFileRoute } from '@tanstack/solid-router';
import { fetchPost } from '../posts';

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params: { postId } }) => fetchPost(postId),
  component: PostComponent,
});

function PostComponent() {
  const post = Route.useLoaderData();

  return (
    <div class="space-y-2">
      <h4 class="text-xl font-bold underline">{post().title}</h4>
      <div class="text-sm">{post().body}</div>
    </div>
  );
}
