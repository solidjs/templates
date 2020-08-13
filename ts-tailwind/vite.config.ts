import { UserConfig } from "vite";
import { solidPlugin } from "@amoutonbrady/vite-plugin-solid";

const config: UserConfig = {
  outDir: "dist",
  plugins: [solidPlugin()],
  enableEsbuild: false,
};

export default config;
