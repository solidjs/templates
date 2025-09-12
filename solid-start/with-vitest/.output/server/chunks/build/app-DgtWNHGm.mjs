import { createComponent, isServer, getRequestEvent, delegateEvents, useAssets, ssr, spread, escape } from 'solid-js/web';
import { Suspense, createContext, createUniqueId, createSignal, onCleanup, sharedConfig, useContext, createRenderEffect, children, createMemo, getOwner, on, runWithOwner, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch, createComponent as createComponent$1 } from 'solid-js';
import { w as wn } from '../nitro/nitro.mjs';
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

const le = createContext(), de = ["title", "meta"], D = [], V = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), W = (e, t) => {
  const n = Object.fromEntries(Object.entries(e.props).filter(([o]) => t.includes(o)).sort());
  return (Object.hasOwn(n, "name") || Object.hasOwn(n, "property")) && (n.name = n.name || n.property, delete n.property), e.tag + JSON.stringify(n);
};
function Be() {
  if (!sharedConfig.context) {
    const n = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(n, (o) => o.parentNode.removeChild(o));
  }
  const e = /* @__PURE__ */ new Map();
  function t(n) {
    if (n.ref) return n.ref;
    let o = document.querySelector(`[data-sm="${n.id}"]`);
    return o ? (o.tagName.toLowerCase() !== n.tag && (o.parentNode && o.parentNode.removeChild(o), o = document.createElement(n.tag)), o.removeAttribute("data-sm")) : o = document.createElement(n.tag), o;
  }
  return { addTag(n) {
    if (de.indexOf(n.tag) !== -1) {
      const a = n.tag === "title" ? D : V, s = W(n, a);
      e.has(s) || e.set(s, []);
      let i = e.get(s), d = i.length;
      i = [...i, n], e.set(s, i);
      let c = t(n);
      n.ref = c, spread(c, n.props);
      let l = null;
      for (var o = d - 1; o >= 0; o--) if (i[o] != null) {
        l = i[o];
        break;
      }
      return c.parentNode != document.head && document.head.appendChild(c), l && l.ref && l.ref.parentNode && document.head.removeChild(l.ref), d;
    }
    let r = t(n);
    return n.ref = r, spread(r, n.props), r.parentNode != document.head && document.head.appendChild(r), -1;
  }, removeTag(n, o) {
    const r = n.tag === "title" ? D : V, a = W(n, r);
    if (n.ref) {
      const s = e.get(a);
      if (s) {
        if (n.ref.parentNode) {
          n.ref.parentNode.removeChild(n.ref);
          for (let i = o - 1; i >= 0; i--) s[i] != null && document.head.appendChild(s[i].ref);
        }
        s[o] = null, e.set(a, s);
      } else n.ref.parentNode && n.ref.parentNode.removeChild(n.ref);
    }
  } };
}
function Ke() {
  const e = [];
  return useAssets(() => ssr(De(e))), { addTag(t) {
    if (de.indexOf(t.tag) !== -1) {
      const n = t.tag === "title" ? D : V, o = W(t, n), r = e.findIndex((a) => a.tag === t.tag && W(a, n) === o);
      r !== -1 && e.splice(r, 1);
    }
    return e.push(t), e.length;
  }, removeTag(t, n) {
  } };
}
const Me = (e) => {
  const t = isServer ? Ke() : Be();
  return createComponent(le.Provider, { value: t, get children() {
    return e.children;
  } });
}, We = (e, t, n) => (_e({ tag: e, props: t, setting: n, id: createUniqueId(), get name() {
  return t.name || t.property;
} }), null);
function _e(e) {
  const t = useContext(le);
  if (!t) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const n = t.addTag(e);
    onCleanup(() => t.removeTag(e, n));
  });
}
function De(e) {
  return e.map((t) => {
    var _a, _b;
    const o = Object.keys(t.props).map((a) => a === "children" ? "" : ` ${a}="${escape(t.props[a], true)}"`).join("");
    let r = t.props.children;
    return Array.isArray(r) && (r = r.join("")), ((_a = t.setting) == null ? void 0 : _a.close) ? `<${t.tag} data-sm="${t.id}"${o}>${((_b = t.setting) == null ? void 0 : _b.escape) ? escape(r) : r || ""}</${t.tag}>` : `<${t.tag} data-sm="${t.id}"${o}/>`;
  }).join("");
}
const Ve = (e) => We("title", e, { escape: true, close: true });
function fe() {
  let e = /* @__PURE__ */ new Set();
  function t(r) {
    return e.add(r), () => e.delete(r);
  }
  let n = false;
  function o(r, a) {
    if (n) return !(n = false);
    const s = { to: r, options: a, defaultPrevented: false, preventDefault: () => s.defaultPrevented = true };
    for (const i of e) i.listener({ ...s, from: i.location, retry: (d) => {
      d && (n = true), i.navigate(r, { ...a, resolve: false });
    } });
    return !s.defaultPrevented;
  }
  return { subscribe: t, confirm: o };
}
let H;
function G() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), H = window.history.state._depth;
}
isServer || G();
function He(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function ze(e, t) {
  let n = false;
  return () => {
    const o = H;
    G();
    const r = o == null ? null : H - o;
    if (n) {
      n = false;
      return;
    }
    r && t(r) ? (n = true, window.history.go(-r)) : e();
  };
}
const Je = /^(?:[a-z0-9]+:)?\/\//i, Xe = /^\/+|(\/)\/+$/g, he = "http://sr";
function N(e, t = false) {
  const n = e.replace(Xe, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function K(e, t, n) {
  if (Je.test(t)) return;
  const o = N(e), r = n && N(n);
  let a = "";
  return !r || t.startsWith("/") ? a = o : r.toLowerCase().indexOf(o.toLowerCase()) !== 0 ? a = o + r : a = r, (a || "/") + N(t, !a);
}
function Ge(e, t) {
  return N(e).replace(/\/*(\*.*)?$/g, "") + N(t);
}
function me(e) {
  const t = {};
  return e.searchParams.forEach((n, o) => {
    o in t ? Array.isArray(t[o]) ? t[o].push(n) : t[o] = [t[o], n] : t[o] = n;
  }), t;
}
function Qe(e, t, n) {
  const [o, r] = e.split("/*", 2), a = o.split("/").filter(Boolean), s = a.length;
  return (i) => {
    const d = i.split("/").filter(Boolean), c = d.length - s;
    if (c < 0 || c > 0 && r === void 0 && !t) return null;
    const l = { path: s ? "" : "/", params: {} }, y = (m) => n === void 0 ? void 0 : n[m];
    for (let m = 0; m < s; m++) {
      const g = a[m], b = g[0] === ":", u = b ? d[m] : d[m].toLowerCase(), f = b ? g.slice(1) : g.toLowerCase();
      if (b && _(u, y(f))) l.params[f] = u;
      else if (b || !_(u, f)) return null;
      l.path += `/${u}`;
    }
    if (r) {
      const m = c ? d.slice(-c).join("/") : "";
      if (_(m, y(r))) l.params[r] = m;
      else return null;
    }
    return l;
  };
}
function _(e, t) {
  const n = (o) => o === e;
  return t === void 0 ? true : typeof t == "string" ? n(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(n) : t instanceof RegExp ? t.test(e) : false;
}
function Ye(e) {
  const [t, n] = e.pattern.split("/*", 2), o = t.split("/").filter(Boolean);
  return o.reduce((r, a) => r + (a.startsWith(":") ? 2 : 3), o.length - (n === void 0 ? 0 : 1));
}
function pe(e) {
  const t = /* @__PURE__ */ new Map(), n = getOwner();
  return new Proxy({}, { get(o, r) {
    return t.has(r) || runWithOwner(n, () => t.set(r, createMemo(() => e()[r]))), t.get(r)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  } });
}
function ge(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let n = e.slice(0, t.index), o = e.slice(t.index + t[0].length);
  const r = [n, n += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(o); ) r.push(n += t[1]), o = o.slice(t[0].length);
  return ge(o).reduce((a, s) => [...a, ...r.map((i) => i + s)], []);
}
const Ze = 100, et = createContext(), we = createContext();
function tt(e, t = "") {
  const { component: n, preload: o, load: r, children: a, info: s } = e, i = !a || Array.isArray(a) && !a.length, d = { key: e, component: n, preload: o || r, info: s };
  return ye(e.path).reduce((c, l) => {
    for (const y of ge(l)) {
      const m = Ge(t, y);
      let g = i ? m : m.split("/*", 1)[0];
      g = g.split("/").map((b) => b.startsWith(":") || b.startsWith("*") ? b : encodeURIComponent(b)).join("/"), c.push({ ...d, originalPath: l, pattern: g, matcher: Qe(g, !i, e.matchFilters) });
    }
    return c;
  }, []);
}
function nt(e, t = 0) {
  return { routes: e, score: Ye(e[e.length - 1]) * 1e4 - t, matcher(n) {
    const o = [];
    for (let r = e.length - 1; r >= 0; r--) {
      const a = e[r], s = a.matcher(n);
      if (!s) return null;
      o.unshift({ ...s, route: a });
    }
    return o;
  } };
}
function ye(e) {
  return Array.isArray(e) ? e : [e];
}
function ve(e, t = "", n = [], o = []) {
  const r = ye(e);
  for (let a = 0, s = r.length; a < s; a++) {
    const i = r[a];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const d = tt(i, t);
      for (const c of d) {
        n.push(c);
        const l = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !l) ve(i.children, c.pattern, n, o);
        else {
          const y = nt([...n], o.length);
          o.push(y);
        }
        n.pop();
      }
    }
  }
  return n.length ? o : o.sort((a, s) => s.score - a.score);
}
function q(e, t) {
  for (let n = 0, o = e.length; n < o; n++) {
    const r = e[n].matcher(t);
    if (r) return r;
  }
  return [];
}
function rt(e, t, n) {
  const o = new URL(he), r = createMemo((l) => {
    const y = e();
    try {
      return new URL(y, o);
    } catch {
      return console.error(`Invalid path ${y}`), l;
    }
  }, o, { equals: (l, y) => l.href === y.href }), a = createMemo(() => r().pathname), s = createMemo(() => r().search, true), i = createMemo(() => r().hash), d = () => "", c = on(s, () => me(r()));
  return { get pathname() {
    return a();
  }, get search() {
    return s();
  }, get hash() {
    return i();
  }, get state() {
    return t();
  }, get key() {
    return d();
  }, query: n ? n(c) : pe(c) };
}
let C;
function ot() {
  return C;
}
function at(e, t, n, o = {}) {
  const { signal: [r, a], utils: s = {} } = e, i = s.parsePath || ((h) => h), d = s.renderPath || ((h) => h), c = s.beforeLeave || fe(), l = K("", o.base || "");
  if (l === void 0) throw new Error(`${l} is not a valid base path`);
  l && !r().value && a({ value: l, replace: true, scroll: false });
  const [y, m] = createSignal(false);
  let g;
  const b = (h, p) => {
    p.value === u() && p.state === v() || (g === void 0 && m(true), C = h, g = p, startTransition(() => {
      g === p && (f(g.value), w(g.state), resetErrorBoundaries(), isServer || L[1]((P) => P.filter((O) => O.pending)));
    }).finally(() => {
      g === p && batch(() => {
        C = void 0, h === "navigate" && Ae(g), m(false), g = void 0;
      });
    }));
  }, [u, f] = createSignal(r().value), [v, w] = createSignal(r().state), E = rt(u, v, s.queryWrapper), S = [], L = createSignal(isServer ? Le() : []), $ = createMemo(() => typeof o.transformUrl == "function" ? q(t(), o.transformUrl(E.pathname)) : q(t(), E.pathname)), Q = () => {
    const h = $(), p = {};
    for (let P = 0; P < h.length; P++) Object.assign(p, h[P].params);
    return p;
  }, Pe = s.paramsWrapper ? s.paramsWrapper(Q, t) : pe(Q), Y = { pattern: l, path: () => l, outlet: () => null, resolvePath(h) {
    return K(l, h);
  } };
  return createRenderEffect(on(r, (h) => b("native", h), { defer: true })), { base: Y, location: E, params: Pe, isRouting: y, renderPath: d, parsePath: i, navigatorFactory: Se, matches: $, beforeLeave: c, preloadRoute: Ee, singleFlight: o.singleFlight === void 0 ? true : o.singleFlight, submissions: L };
  function Re(h, p, P) {
    untrack(() => {
      if (typeof p == "number") {
        p && (s.go ? s.go(p) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const O = !p || p[0] === "?", { replace: k, resolve: T, scroll: I, state: j } = { replace: false, resolve: !O, scroll: true, ...P }, U = T ? h.resolvePath(p) : K(O && E.pathname || "", p);
      if (U === void 0) throw new Error(`Path '${p}' is not a routable path`);
      if (S.length >= Ze) throw new Error("Too many redirects");
      const Z = u();
      if (U !== Z || j !== v()) if (isServer) {
        const ee = getRequestEvent();
        ee && (ee.response = { status: 302, headers: new Headers({ Location: U }) }), a({ value: U, replace: k, scroll: I, state: j });
      } else c.confirm(U, P) && (S.push({ value: Z, replace: k, scroll: I, state: v() }), b("navigate", { value: U, state: j }));
    });
  }
  function Se(h) {
    return h = h || useContext(we) || Y, (p, P) => Re(h, p, P);
  }
  function Ae(h) {
    const p = S[0];
    p && (a({ ...h, replace: p.replace, scroll: p.scroll }), S.length = 0);
  }
  function Ee(h, p) {
    const P = q(t(), h.pathname), O = C;
    C = "preload";
    for (let k in P) {
      const { route: T, params: I } = P[k];
      T.component && T.component.preload && T.component.preload();
      const { preload: j } = T;
      p && j && runWithOwner(n(), () => j({ params: I, location: { pathname: h.pathname, search: h.search, hash: h.hash, query: me(h), state: null, key: "" }, intent: "preload" }));
    }
    C = O;
  }
  function Le() {
    const h = getRequestEvent();
    return h && h.router && h.router.submission ? [h.router.submission] : [];
  }
}
function st(e, t, n, o) {
  const { base: r, location: a, params: s } = e, { pattern: i, component: d, preload: c } = o().route, l = createMemo(() => o().path);
  d && d.preload && d.preload();
  const y = c ? c({ params: s, location: a, intent: C || "initial" }) : void 0;
  return { parent: t, pattern: i, path: l, outlet: () => d ? createComponent$1(d, { params: s, location: a, data: y, get children() {
    return n();
  } }) : n(), resolvePath(g) {
    return K(r.path(), g, l());
  } };
}
const be = (e) => (t) => {
  const { base: n } = t, o = children(() => t.children), r = createMemo(() => ve(o(), t.base || ""));
  let a;
  const s = at(e, r, () => a, { base: n, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(s), createComponent(et.Provider, { value: s, get children() {
    return createComponent(it, { routerState: s, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(a = getOwner()) && null, createComponent(ct, { routerState: s, get branches() {
        return r();
      } })];
    } });
  } });
};
function it(e) {
  const t = e.routerState.location, n = e.routerState.params, o = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: n, location: t, intent: ot() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (r) => createComponent(r, { params: n, location: t, get data() {
    return o();
  }, get children() {
    return e.children;
  } }) });
}
function ct(e) {
  if (isServer) {
    const r = getRequestEvent();
    if (r && r.router && r.router.dataOnly) {
      ut(r, e.routerState, e.branches);
      return;
    }
    r && ((r.router || (r.router = {})).matches || (r.router.matches = e.routerState.matches().map(({ route: a, path: s, params: i }) => ({ path: a.originalPath, pattern: a.pattern, match: s, params: i, info: a.info }))));
  }
  const t = [];
  let n;
  const o = createMemo(on(e.routerState.matches, (r, a, s) => {
    let i = a && r.length === a.length;
    const d = [];
    for (let c = 0, l = r.length; c < l; c++) {
      const y = a && a[c], m = r[c];
      s && y && m.route.key === y.route.key ? d[c] = s[c] : (i = false, t[c] && t[c](), createRoot((g) => {
        t[c] = g, d[c] = st(e.routerState, d[c - 1] || e.routerState.base, re(() => o()[c + 1]), () => e.routerState.matches()[c]);
      }));
    }
    return t.splice(r.length).forEach((c) => c()), s && i ? s : (n = d[0], d);
  }));
  return re(() => o() && n)();
}
const re = (e) => () => createComponent(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent(we.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function ut(e, t, n) {
  const o = new URL(e.request.url), r = q(n, new URL(e.router.previousUrl || e.request.url).pathname), a = q(n, o.pathname);
  for (let s = 0; s < a.length; s++) {
    (!r[s] || a[s].route !== r[s].route) && (e.router.dataOnly = true);
    const { route: i, params: d } = a[s];
    i.preload && i.preload({ params: d, location: t.location, intent: "preload" });
  }
}
function lt([e, t], n, o) {
  return [e, o ? (r) => t(o(r)) : t];
}
function dt(e) {
  let t = false;
  const n = (r) => typeof r == "string" ? { value: r } : r, o = lt(createSignal(n(e.get()), { equals: (r, a) => r.value === a.value && r.state === a.state }), void 0, (r) => (!t && e.set(r), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), r));
  return e.init && onCleanup(e.init((r = e.get()) => {
    t = true, o[1](n(r)), t = false;
  })), be({ signal: o, create: e.create, utils: e.utils });
}
function ft(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function ht(e, t) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
function mt(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function pt(e) {
  let t;
  const n = { value: e.url || (t = getRequestEvent()) && mt(t.request.url) || "" };
  return be({ signal: [() => n, (o) => Object.assign(n, o)] })(e);
}
const gt = /* @__PURE__ */ new Map();
function wt(e = true, t = false, n = "/_server", o) {
  return (r) => {
    const a = r.base.path(), s = r.navigatorFactory(r.base);
    let i, d;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function l(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const f = u.composedPath().find(($) => $ instanceof Node && $.nodeName.toUpperCase() === "A");
      if (!f || t && !f.hasAttribute("link")) return;
      const v = c(f), w = v ? f.href.baseVal : f.href;
      if ((v ? f.target.baseVal : f.target) || !w && !f.hasAttribute("state")) return;
      const S = (f.getAttribute("rel") || "").split(/\s+/);
      if (f.hasAttribute("download") || S && S.includes("external")) return;
      const L = v ? new URL(w, document.baseURI) : new URL(w);
      if (!(L.origin !== window.location.origin || a && L.pathname && !L.pathname.toLowerCase().startsWith(a.toLowerCase()))) return [f, L];
    }
    function y(u) {
      const f = l(u);
      if (!f) return;
      const [v, w] = f, E = r.parsePath(w.pathname + w.search + w.hash), S = v.getAttribute("state");
      u.preventDefault(), s(E, { resolve: false, replace: v.hasAttribute("replace"), scroll: !v.hasAttribute("noscroll"), state: S ? JSON.parse(S) : void 0 });
    }
    function m(u) {
      const f = l(u);
      if (!f) return;
      const [v, w] = f;
      o && (w.pathname = o(w.pathname)), r.preloadRoute(w, v.getAttribute("preload") !== "false");
    }
    function g(u) {
      clearTimeout(i);
      const f = l(u);
      if (!f) return d = null;
      const [v, w] = f;
      d !== v && (o && (w.pathname = o(w.pathname)), i = setTimeout(() => {
        r.preloadRoute(w, v.getAttribute("preload") !== "false"), d = v;
      }, 20));
    }
    function b(u) {
      if (u.defaultPrevented) return;
      let f = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!f) return;
      if (!f.startsWith("https://action/")) {
        const w = new URL(f, he);
        if (f = r.parsePath(w.pathname + w.search), !f.startsWith(n)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const v = gt.get(f);
      if (v) {
        u.preventDefault();
        const w = new FormData(u.target, u.submitter);
        v.call({ r, f: u.target }, u.target.enctype === "multipart/form-data" ? w : new URLSearchParams(w));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", y), e && (document.addEventListener("mousemove", g, { passive: true }), document.addEventListener("focusin", m, { passive: true }), document.addEventListener("touchstart", m, { passive: true })), document.addEventListener("submit", b), onCleanup(() => {
      document.removeEventListener("click", y), e && (document.removeEventListener("mousemove", g), document.removeEventListener("focusin", m), document.removeEventListener("touchstart", m)), document.removeEventListener("submit", b);
    });
  };
}
function yt(e) {
  if (isServer) return pt(e);
  const t = () => {
    const o = window.location.pathname.replace(/^\/+/, "/") + window.location.search, r = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: o + window.location.hash, state: r };
  }, n = fe();
  return dt({ get: t, set({ value: o, replace: r, scroll: a, state: s }) {
    r ? window.history.replaceState(He(s), "", o) : window.history.pushState(s, "", o), ht(decodeURIComponent(window.location.hash.slice(1)), a), G();
  }, init: (o) => ft(window, "popstate", ze(o, (r) => {
    if (r && r < 0) return !n.confirm(r);
    {
      const a = t();
      return !n.confirm(a.value, { state: a.state });
    }
  })), create: wt(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (o) => window.history.go(o), beforeLeave: n } })(e);
}
function Et() {
  return createComponent(yt, { root: (e) => createComponent(Me, { get children() {
    return [createComponent(Ve, { children: "SolidStart - with Vitest" }), createComponent(Suspense, { get children() {
      return e.children;
    } })];
  } }), get children() {
    return createComponent(wn, {});
  } });
}

export { Et as default };
//# sourceMappingURL=app-DgtWNHGm.mjs.map
