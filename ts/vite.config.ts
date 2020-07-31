import { UserConfig } from "vite";
import { solidPlugin } from "@amoutonbrady/vite-plugin-solid";

const config: UserConfig = {
  root: "src",
  outDir: "dist",
  plugins: [solidPlugin()],
  enableEsbuild: false,
};

export default config;
