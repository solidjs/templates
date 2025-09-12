import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { k } from './index-BdnVf8ln.mjs';
import 'solid-js';

var i = ["<main", "><!--$-->", "<!--/--><h1>About</h1></main>"];
function s() {
  return ssr(i, ssrHydrationKey(), escape(createComponent(k, { children: "About" })));
}

export { s as default };
//# sourceMappingURL=about.mjs.map
