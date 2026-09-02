import { createSignal } from 'solid-js';

const names = ['Ada', 'Grace', 'Anders', 'Brendan'];

// Demonstrates TSRX template control flow: `@for` iterates a reactive list
// (the item is deferred — reads stay live when a row updates) with an
// optional `index` binding, and `@empty` renders while the list is empty.
// The <style> block scopes its sibling elements and their descendants, so
// these rules only ever apply to this component's markup.
export default function Guestbook() @{
  const [guests, setGuests] = createSignal<string[]>([]);
  const sign = () => setGuests([...guests(), names[guests().length % names.length]]);
  <>
    <style>
      .guestbook {
        margin: 2rem auto 0;
        max-width: 20rem;
        padding: 1rem;
        border: 1px solid #d4d4d8;
        border-radius: 0.75rem;
      }

      .guestbook ul {
        margin: 1rem 0 0;
        padding: 0;
        list-style: none;
      }

      .sign {
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        cursor: pointer;
      }

      .entry {
        padding: 0.25rem 0;
        color: rgb(29, 95, 145);
      }

      .empty {
        padding: 0.25rem 0;
        color: #71717a;
        font-style: italic;
      }
    </style>
    <section class="guestbook">
      <h2>Guestbook</h2>
      <button class="sign" onClick={sign} type="button">
        Sign the guestbook
      </button>
      <ul>
        @for (const guest of guests(); index i) {
          <li class="entry">
            {i + 1}. {guest}
          </li>
        } @empty {
          <li class="empty">No signatures yet — be the first.</li>
        }
      </ul>
    </section>
  </>
}
