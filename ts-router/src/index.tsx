import "windi.css";

import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import { routes } from "./routes";
import App from "./app";

render(
  () => (
    <Router routes={routes}>
      <App />
    </Router>
  ),
  document.getElementById("root")
);
