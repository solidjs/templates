// @refresh reload
import { MetaProvider, Title } from "@solidjs/meta";
import { cache, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, type ParentProps } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { getSession, type AuthSession } from "start-authjs";
import "./app.css";
import { authConfig } from "~/server/auth";

export const getSessionData = cache(async (): Promise<AuthSession | null> => {
  "use server";
  const event = getRequestEvent();
  if (!event) return null;
  return getSession(event.request, authConfig);
}, "session");

function RootLayout(props: ParentProps) {
  return (
    <MetaProvider>
      <Suspense>{props.children}</Suspense>
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  );
}
