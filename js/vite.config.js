import { solidPlugin } from "@amoutonbrady/vite-plugin-solid";

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: "src",
  outDir: "dist",
  serviceWorker: false,
  plugins: [solidPlugin()],
  enableEsbuild: false,
};

export default config;
