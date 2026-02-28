import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import { createSolidBase } from "@kobalte/solidbase/config";
import defaultTheme from "@kobalte/solidbase/default-theme";

const solidbase = createSolidBase(defaultTheme);

export default defineConfig({
  plugins: [
    {
      name: "fix-solidbase",
      enforce: "pre",
      resolveId(id, importer) {
        if (importer?.includes("@kobalte/solidbase") && id.endsWith(".js")) {
          return this.resolve(id.replace(/\.js$/, ""), importer, { skipSelf: true });
        }
      }
    },
    solidbase.plugin({
      title: "SolidBase",
      titleTemplate: ":title - SolidBase",
      description: "Fully featured, fully customisable static site generation for SolidStart",
      themeConfig: {
        sidebar: {
          "/": [
            {
              title: "Overview",
              collapsed: false,
              items: [
                {
                  title: "Home",
                  link: "/"
                },
                {
                  title: "About",
                  link: "/about"
                }
              ]
            }
          ]
        }
      }
    }),
    solidStart(solidbase.startConfig()),
    nitro({
      prerender: {
        crawlLinks: true
      }
    })
  ]
});
