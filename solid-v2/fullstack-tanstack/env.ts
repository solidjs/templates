import { z } from 'zod';

// The typed env schema (probed by the plugin from the project root): plain
// objects of Standard Schema validators — zod here, but valibot, arktype, or
// any compliant library works, even mixed per key.
//
// `server` vars come through `virtual:env/server` (server modules only —
// importing it from client code fails the build) and are read from
// process.env at BOOT, validated then: secrets rotate without a rebuild and
// never appear in build artifacts. `client` vars must carry the public
// VITE_ prefix and come through `virtual:env/client` as validated values
// baked into the bundle. Generated types land in solid-env.d.ts.
export default {
  server: {
    // Comma-separated, newest first — see src/server/session.ts for the
    // rotation story. Generate one: `openssl rand -base64 32`.
    SESSION_SECRET: z.string().min(32),
  },
  client: {
    VITE_APP_NAME: z.string().min(1).default('Solid App'),
  },
};
