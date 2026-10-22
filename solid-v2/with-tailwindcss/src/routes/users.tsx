import type { ParentProps } from 'solid-js';

// A layout route: pairing users.tsx with the users/ directory nests every
// page inside it under this component.
export default function UsersLayout(props: ParentProps) {
  return (
    <main class="px-4 py-12">
      <h1 class="my-4 text-4xl font-bold">Users</h1>
      {props.children}
    </main>
  );
}
