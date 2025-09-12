import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal } from 'solid-js';

var s = ["<button", ' class="increment" type="button">Clicks: <!--$-->', "<!--/--></button>"];
function i() {
  const [e, m] = createSignal(0);
  return ssr(s, ssrHydrationKey(), escape(e()));
}
var l = ["<main", "><h1>Hello world!</h1><!--$-->", '<!--/--><p>Visit <a href="https://solidjs.com" target="_blank">solidjs.com</a> to learn how to build Solid apps.</p></main>'];
function u() {
  return ssr(l, ssrHydrationKey(), escape(createComponent(i, {})));
}

export { u as default };
//# sourceMappingURL=index.mjs.map
