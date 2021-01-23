import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

const dispose = render(() => <App />, document.getElementById("root"));

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}
