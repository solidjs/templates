import type { APIEvent } from "@solidjs/start/server";
import { StartAuthJS } from "start-authjs";
import { authConfig } from "~/server/auth";

const { GET: AuthGET, POST: AuthPOST } = StartAuthJS(authConfig);

export const GET = (event: APIEvent) => {
  return AuthGET({ request: event.request, response: new Response() });
};

export const POST = (event: APIEvent) => {
  return AuthPOST({ request: event.request, response: new Response() });
};
