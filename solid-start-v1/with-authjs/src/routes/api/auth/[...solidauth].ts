import type { AuthRequestContext } from "start-authjs";
import { StartAuthJS } from "start-authjs";
import { authConfig } from "~/server/auth";

const { GET: AuthGET, POST: AuthPOST } = StartAuthJS(authConfig);

export const GET = (event: AuthRequestContext) => {
  return AuthGET({ request: event.request, response: new Response() });
};

export const POST = (event: AuthRequestContext) => {
  return AuthPOST({ request: event.request, response: new Response() });
};
