import { RouteDefinition } from "solid-app-router";
import { lazy, Component } from "solid-js";

const pages = import.meta.glob("./pages/**/*.tsx");
const pagesData = import.meta.globEager("./pages/**/*.data.ts");

const autoRoutes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages(.*)\.[tj]sx$/)[1].toLowerCase();
  const Comp = pages[path] as () => Promise<{ default: Component<any> }>;

  const routePath = ["/home", "/index"].includes(name) ? "/" : name;

  const data = pagesData[path.replace("tsx", "data.ts")] || {};

  return {
    path: routePath,
    component: lazy(Comp),
    data: data.default,
  } as RouteDefinition;
});

export const routes: RouteDefinition[] = [
  ...autoRoutes,
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
