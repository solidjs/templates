// Test stub for the plugin's `virtual:env/server` module (aliased in
// vite.config.ts's test block), honoring the same contract: runtime
// process.env reads through a live proxy — values read at ACCESS time, so
// tests can set process.env per test.
export const env: Record<string, string | undefined> = new Proxy(
  {},
  { get: (_, key) => (typeof key === 'string' ? process.env[key] : undefined) },
);
