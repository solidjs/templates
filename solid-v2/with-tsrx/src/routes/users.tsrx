import type { ParentProps } from 'solid-js';

// A layout route: pairing users.tsrx with the users/ directory nests every
// page inside it under this component.
export default function UsersLayout(props: ParentProps) @{
  <main>
    <h1>Users</h1>
    {props.children}
  </main>
}
