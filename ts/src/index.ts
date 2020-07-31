import { render } from "solid-js/dom";

import "./index.css";
import App from "./App";

export const rootEl = document.getElementById("root");
export const dispose = render(() => App, rootEl);
