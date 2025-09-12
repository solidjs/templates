import { ssr, ssrHydrationKey, escape, createComponent, isServer, getRequestEvent } from 'solid-js/web';
import { k } from './index-BdnVf8ln.mjs';
import { onCleanup } from 'solid-js';

const u = isServer ? (e) => {
  const t = getRequestEvent();
  return t.response.status = e.code, t.response.statusText = e.text, onCleanup(() => !t.nativeEvent.handled && !t.complete && (t.response.status = 200)), null;
} : (e) => null;
var d = ["<main", "><!--$-->", "<!--/--><!--$-->", '<!--/--><h1>Page Not Found</h1><p>Visit <a href="https://start.solidjs.com" target="_blank">start.solidjs.com</a> to learn how to build SolidStart apps.</p></main>'];
function f() {
  return ssr(d, ssrHydrationKey(), escape(createComponent(k, { children: "Not Found" })), escape(createComponent(u, { code: 404 })));
}

export { f as default };
//# sourceMappingURL=_...404_.mjs.map
