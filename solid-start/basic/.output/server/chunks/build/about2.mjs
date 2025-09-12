import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { k } from '../nitro/nitro.mjs';
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
import 'solid-js';
import 'solid-js/web/storage';

var i = ["<main", "><!--$-->", "<!--/--><h1>About</h1></main>"];
function s() {
  return ssr(i, ssrHydrationKey(), escape(createComponent(k, { children: "About" })));
}

export { s as default };
//# sourceMappingURL=about2.mjs.map
