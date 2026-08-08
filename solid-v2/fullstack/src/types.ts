// Type augmentation for the request event. A regular module (not a .d.ts)
// so TypeScript reliably picks the augmentations up with the default
// project includes.
import type { Session } from './lib/session';

// What our middleware hangs on event.locals (see src/middleware.ts).
// TODO: augment '@solidjs/web' directly (the documented path) once its
// type-only re-export of RequestEventLocals merges augmentations.
declare module '@solidjs/web/types/server.js' {
  interface RequestEventLocals {
    session: Session;
  }
}
