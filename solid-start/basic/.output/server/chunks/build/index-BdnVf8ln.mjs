import { isServer, createComponent, useAssets, ssr, spread, escape } from 'solid-js/web';
import { createContext, createUniqueId, sharedConfig, useContext, createRenderEffect, onCleanup } from 'solid-js';

const y = createContext(), v = ["title", "meta"], p = [], f = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), l = (n, t) => {
  const e = Object.fromEntries(Object.entries(n.props).filter(([r]) => t.includes(r)).sort());
  return (Object.hasOwn(e, "name") || Object.hasOwn(e, "property")) && (e.name = e.name || e.property, delete e.property), n.tag + JSON.stringify(e);
};
function E() {
  if (!sharedConfig.context) {
    const e = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(e, (r) => r.parentNode.removeChild(r));
  }
  const n = /* @__PURE__ */ new Map();
  function t(e) {
    if (e.ref) return e.ref;
    let r = document.querySelector(`[data-sm="${e.id}"]`);
    return r ? (r.tagName.toLowerCase() !== e.tag && (r.parentNode && r.parentNode.removeChild(r), r = document.createElement(e.tag)), r.removeAttribute("data-sm")) : r = document.createElement(e.tag), r;
  }
  return { addTag(e) {
    if (v.indexOf(e.tag) !== -1) {
      const i = e.tag === "title" ? p : f, a = l(e, i);
      n.has(a) || n.set(a, []);
      let s = n.get(a), u = s.length;
      s = [...s, e], n.set(a, s);
      let c = t(e);
      e.ref = c, spread(c, e.props);
      let d = null;
      for (var r = u - 1; r >= 0; r--) if (s[r] != null) {
        d = s[r];
        break;
      }
      return c.parentNode != document.head && document.head.appendChild(c), d && d.ref && d.ref.parentNode && document.head.removeChild(d.ref), u;
    }
    let o = t(e);
    return e.ref = o, spread(o, e.props), o.parentNode != document.head && document.head.appendChild(o), -1;
  }, removeTag(e, r) {
    const o = e.tag === "title" ? p : f, i = l(e, o);
    if (e.ref) {
      const a = n.get(i);
      if (a) {
        if (e.ref.parentNode) {
          e.ref.parentNode.removeChild(e.ref);
          for (let s = r - 1; s >= 0; s--) a[s] != null && document.head.appendChild(a[s].ref);
        }
        a[r] = null, n.set(i, a);
      } else e.ref.parentNode && e.ref.parentNode.removeChild(e.ref);
    }
  } };
}
function w() {
  const n = [];
  return useAssets(() => ssr(S(n))), { addTag(t) {
    if (v.indexOf(t.tag) !== -1) {
      const e = t.tag === "title" ? p : f, r = l(t, e), o = n.findIndex((i) => i.tag === t.tag && l(i, e) === r);
      o !== -1 && n.splice(o, 1);
    }
    return n.push(t), n.length;
  }, removeTag(t, e) {
  } };
}
const I = (n) => {
  const t = isServer ? w() : E();
  return createComponent(y.Provider, { value: t, get children() {
    return n.children;
  } });
}, A = (n, t, e) => (M({ tag: n, props: t, setting: e, id: createUniqueId(), get name() {
  return t.name || t.property;
} }), null);
function M(n) {
  const t = useContext(y);
  if (!t) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const e = t.addTag(n);
    onCleanup(() => t.removeTag(n, e));
  });
}
function S(n) {
  return n.map((t) => {
    var _a, _b;
    const r = Object.keys(t.props).map((i) => i === "children" ? "" : ` ${i}="${escape(t.props[i], true)}"`).join("");
    let o = t.props.children;
    return Array.isArray(o) && (o = o.join("")), ((_a = t.setting) == null ? void 0 : _a.close) ? `<${t.tag} data-sm="${t.id}"${r}>${((_b = t.setting) == null ? void 0 : _b.escape) ? escape(o) : o || ""}</${t.tag}>` : `<${t.tag} data-sm="${t.id}"${r}/>`;
  }).join("");
}
const k = (n) => A("title", n, { escape: true, close: true });

export { I, k };
//# sourceMappingURL=index-BdnVf8ln.mjs.map
