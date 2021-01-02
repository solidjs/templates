import { UserConfig } from "vite";
import { solidPlugin } from "vite-plugin-solid";

const config: UserConfig = {
  plugins: [solidPlugin()],
};

export default config;
