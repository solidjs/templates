import type { ParentProps } from 'solid-js';

// A layout route: pairing posts.tsx with the posts/ directory nests every
// page inside it under this component.
export default function PostsLayout(props: ParentProps) {
  return (
    <main>
      <h1>Posts</h1>
      {props.children}
    </main>
  );
}
