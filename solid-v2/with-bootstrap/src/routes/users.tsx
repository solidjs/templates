import type { ParentProps } from 'solid-js';

// A layout route: pairing users.tsx with the users/ directory nests every
// page inside it under this component.
export default function UsersLayout(props: ParentProps) {
  return (
    <main class="container py-5">
      <h1 class="my-3">Users</h1>
      {props.children}
    </main>
  );
}
