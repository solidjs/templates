import { defineConfig, searchForWorkspaceRoot } from "vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
import presetWind4 from "@unocss/preset-wind4";

export default defineConfig({
  plugins: [
    // UnoCSS must run before solidStart so classes are extracted from source
    // JSX rather than Solid's compiled templates, which omit attribute quotes
    UnoCSS({
      mode: "per-module",
      presets: [presetWind4()]
    }),
    solidStart(),
    nitro()
  ],
  server: {
    fs: {
      // solid-start's dev SSR manifest loads collected CSS with `?inline`,
      // and Vite fs-checks those requests, denying UnoCSS's virtual ids
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        "/__uno.css",
        "/__uno.css?inline",
        "/@unocss"
      ]
    }
  }
});
