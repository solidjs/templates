import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { k, u } from '../nitro/nitro.mjs';
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

var i = ["<main", "><!--$-->", "<!--/--><!--$-->", '<!--/--><h1>Page Not Found</h1><p>Visit <a href="https://start.solidjs.com" target="_blank">start.solidjs.com</a> to learn how to build SolidStart apps.</p></main>'];
function l() {
  return ssr(i, ssrHydrationKey(), escape(createComponent(k, { children: "Not Found" })), escape(createComponent(u, { code: 404 })));
}

export { l as default };
//# sourceMappingURL=_...404_2.mjs.map
