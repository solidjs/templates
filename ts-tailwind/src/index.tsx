import "./tailwind.css";
import { render } from "solid-js/dom";

import App from "./App";

export const dispose = render(() => <App />, document.getElementById("root"));
