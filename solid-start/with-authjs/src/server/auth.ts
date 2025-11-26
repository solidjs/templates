import Discord from "@auth/core/providers/discord";
import type { StartAuthJSConfig } from "start-authjs";
import { serverEnv } from "~/env/server";

export const authConfig: StartAuthJSConfig = {
  secret: serverEnv.AUTH_SECRET,
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_ID,
      clientSecret: serverEnv.DISCORD_SECRET,
    }),
  ],
  debug: false,
  basePath: new URL(serverEnv.AUTH_URL!).pathname,
};
