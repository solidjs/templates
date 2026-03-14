import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import type { PluginOption } from "vite";
import solidStyled from "unplugin-solid-styled";

export default defineConfig({
  plugins: [
    solidStart(),
    solidStyled.vite({
      filter: {
        include: "src/**/*.tsx",
        exclude: "node_modules/**/*.{ts,js}"
      }
    }) as PluginOption,
    nitro()
  ]
});
