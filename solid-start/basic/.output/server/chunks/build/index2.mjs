import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { k } from '../nitro/nitro.mjs';
import { createSignal } from 'solid-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';

var l = ["<button", ' class="increment" type="button">Clicks: <!--$-->', "<!--/--></button>"];
function i() {
  const [n, p] = createSignal(0);
  return ssr(l, ssrHydrationKey(), escape(n()));
}
var m = ["<main", "><!--$-->", "<!--/--><h1>Hello world!</h1><!--$-->", '<!--/--><p>Visit <a href="https://start.solidjs.com" target="_blank">start.solidjs.com</a> to learn how to build SolidStart apps.</p></main>'];
function f() {
  return ssr(m, ssrHydrationKey(), escape(createComponent(k, { children: "Hello World" })), escape(createComponent(i, {})));
}

export { f as default };
//# sourceMappingURL=index2.mjs.map
