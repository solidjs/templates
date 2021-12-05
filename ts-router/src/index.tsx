import "windi.css";

import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import App from "./app";

const root = document.getElementById("root")
if (root !== null) {
  // render Router on the #root element
  render(
    () => (
      <Router>
        <App />
      </Router>
    ),
    root
  );
}