import { createComponent, ssr, ssrHydrationKey, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { I as I$1, k } from './index-BdnVf8ln.mjs';
import { z as zn } from '../nitro/nitro.mjs';
import { Suspense, createSignal, onCleanup, children, createMemo, createContext, getOwner, sharedConfig, createRenderEffect, on, useContext, runWithOwner, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch, createComponent as createComponent$1 } from 'solid-js';
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

function ae() {
  let e = /* @__PURE__ */ new Set();
  function t(n) {
    return e.add(n), () => e.delete(n);
  }
  let r = false;
  function o(n, a) {
    if (r) return !(r = false);
    const s = { to: n, options: a, defaultPrevented: false, preventDefault: () => s.defaultPrevented = true };
    for (const i of e) i.listener({ ...s, from: i.location, retry: (f) => {
      f && (r = true), i.navigate(n, { ...a, resolve: false });
    } });
    return !s.defaultPrevented;
  }
  return { subscribe: t, confirm: o };
}
let M;
function H() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), M = window.history.state._depth;
}
isServer || H();
function qe(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function Be(e, t) {
  let r = false;
  return () => {
    const o = M;
    H();
    const n = o == null ? null : M - o;
    if (r) {
      r = false;
      return;
    }
    n && t(n) ? (r = true, window.history.go(-n)) : e();
  };
}
const Ie = /^(?:[a-z0-9]+:)?\/\//i, _e = /^\/+|(\/)\/+$/g, se = "http://sr";
function I(e, t = false) {
  const r = e.replace(_e, "$1");
  return r ? t || /^[?#]/.test(r) ? r : "/" + r : "";
}
function W(e, t, r) {
  if (Ie.test(t)) return;
  const o = I(e), n = r && I(r);
  let a = "";
  return !n || t.startsWith("/") ? a = o : n.toLowerCase().indexOf(o.toLowerCase()) !== 0 ? a = o + n : a = n, (a || "/") + I(t, !a);
}
function je(e, t) {
  return I(e).replace(/\/*(\*.*)?$/g, "") + I(t);
}
function ie(e) {
  const t = {};
  return e.searchParams.forEach((r, o) => {
    o in t ? Array.isArray(t[o]) ? t[o].push(r) : t[o] = [t[o], r] : t[o] = r;
  }), t;
}
function Te(e, t, r) {
  const [o, n] = e.split("/*", 2), a = o.split("/").filter(Boolean), s = a.length;
  return (i) => {
    const f = i.split("/").filter(Boolean), c = f.length - s;
    if (c < 0 || c > 0 && n === void 0 && !t) return null;
    const d = { path: s ? "" : "/", params: {} }, y = (m) => r === void 0 ? void 0 : r[m];
    for (let m = 0; m < s; m++) {
      const g = a[m], b = g[0] === ":", u = b ? f[m] : f[m].toLowerCase(), l = b ? g.slice(1) : g.toLowerCase();
      if (b && K(u, y(l))) d.params[l] = u;
      else if (b || !K(u, l)) return null;
      d.path += `/${u}`;
    }
    if (n) {
      const m = c ? f.slice(-c).join("/") : "";
      if (K(m, y(n))) d.params[n] = m;
      else return null;
    }
    return d;
  };
}
function K(e, t) {
  const r = (o) => o === e;
  return t === void 0 ? true : typeof t == "string" ? r(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(r) : t instanceof RegExp ? t.test(e) : false;
}
function We(e) {
  const [t, r] = e.pattern.split("/*", 2), o = t.split("/").filter(Boolean);
  return o.reduce((n, a) => n + (a.startsWith(":") ? 2 : 3), o.length - (r === void 0 ? 0 : 1));
}
function ce(e) {
  const t = /* @__PURE__ */ new Map(), r = getOwner();
  return new Proxy({}, { get(o, n) {
    return t.has(n) || runWithOwner(r, () => t.set(n, createMemo(() => e()[n]))), t.get(n)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  } });
}
function ue(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let r = e.slice(0, t.index), o = e.slice(t.index + t[0].length);
  const n = [r, r += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(o); ) n.push(r += t[1]), o = o.slice(t[0].length);
  return ue(o).reduce((a, s) => [...a, ...n.map((i) => i + s)], []);
}
const $e = 100, De = createContext(), le = createContext();
function Ke(e, t = "") {
  const { component: r, preload: o, load: n, children: a, info: s } = e, i = !a || Array.isArray(a) && !a.length, f = { key: e, component: r, preload: o || n, info: s };
  return fe(e.path).reduce((c, d) => {
    for (const y of ue(d)) {
      const m = je(t, y);
      let g = i ? m : m.split("/*", 1)[0];
      g = g.split("/").map((b) => b.startsWith(":") || b.startsWith("*") ? b : encodeURIComponent(b)).join("/"), c.push({ ...f, originalPath: d, pattern: g, matcher: Te(g, !i, e.matchFilters) });
    }
    return c;
  }, []);
}
function Me(e, t = 0) {
  return { routes: e, score: We(e[e.length - 1]) * 1e4 - t, matcher(r) {
    const o = [];
    for (let n = e.length - 1; n >= 0; n--) {
      const a = e[n], s = a.matcher(r);
      if (!s) return null;
      o.unshift({ ...s, route: a });
    }
    return o;
  } };
}
function fe(e) {
  return Array.isArray(e) ? e : [e];
}
function he(e, t = "", r = [], o = []) {
  const n = fe(e);
  for (let a = 0, s = n.length; a < s; a++) {
    const i = n[a];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const f = Ke(i, t);
      for (const c of f) {
        r.push(c);
        const d = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !d) he(i.children, c.pattern, r, o);
        else {
          const y = Me([...r], o.length);
          o.push(y);
        }
        r.pop();
      }
    }
  }
  return r.length ? o : o.sort((a, s) => s.score - a.score);
}
function _(e, t) {
  for (let r = 0, o = e.length; r < o; r++) {
    const n = e[r].matcher(t);
    if (n) return n;
  }
  return [];
}
function Ne(e, t, r) {
  const o = new URL(se), n = createMemo((d) => {
    const y = e();
    try {
      return new URL(y, o);
    } catch {
      return console.error(`Invalid path ${y}`), d;
    }
  }, o, { equals: (d, y) => d.href === y.href }), a = createMemo(() => n().pathname), s = createMemo(() => n().search, true), i = createMemo(() => n().hash), f = () => "", c = on(s, () => ie(n()));
  return { get pathname() {
    return a();
  }, get search() {
    return s();
  }, get hash() {
    return i();
  }, get state() {
    return t();
  }, get key() {
    return f();
  }, query: r ? r(c) : ce(c) };
}
let x;
function He() {
  return x;
}
function ze(e, t, r, o = {}) {
  const { signal: [n, a], utils: s = {} } = e, i = s.parsePath || ((h) => h), f = s.renderPath || ((h) => h), c = s.beforeLeave || ae(), d = W("", o.base || "");
  if (d === void 0) throw new Error(`${d} is not a valid base path`);
  d && !n().value && a({ value: d, replace: true, scroll: false });
  const [y, m] = createSignal(false);
  let g;
  const b = (h, p) => {
    p.value === u() && p.state === v() || (g === void 0 && m(true), x = h, g = p, startTransition(() => {
      g === p && (l(g.value), w(g.state), resetErrorBoundaries(), isServer || E[1]((R) => R.filter((C) => C.pending)));
    }).finally(() => {
      g === p && batch(() => {
        x = void 0, h === "navigate" && we(g), m(false), g = void 0;
      });
    }));
  }, [u, l] = createSignal(n().value), [v, w] = createSignal(n().state), A = Ne(u, v, s.queryWrapper), S = [], E = createSignal(isServer ? ve() : []), q = createMemo(() => typeof o.transformUrl == "function" ? _(t(), o.transformUrl(A.pathname)) : _(t(), A.pathname)), z = () => {
    const h = q(), p = {};
    for (let R = 0; R < h.length; R++) Object.assign(p, h[R].params);
    return p;
  }, me = s.paramsWrapper ? s.paramsWrapper(z, t) : ce(z), V = { pattern: d, path: () => d, outlet: () => null, resolvePath(h) {
    return W(d, h);
  } };
  return createRenderEffect(on(n, (h) => b("native", h), { defer: true })), { base: V, location: A, params: me, isRouting: y, renderPath: f, parsePath: i, navigatorFactory: ge, matches: q, beforeLeave: c, preloadRoute: ye, singleFlight: o.singleFlight === void 0 ? true : o.singleFlight, submissions: E };
  function pe(h, p, R) {
    untrack(() => {
      if (typeof p == "number") {
        p && (s.go ? s.go(p) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const C = !p || p[0] === "?", { replace: j, resolve: O, scroll: T, state: U } = { replace: false, resolve: !C, scroll: true, ...R }, F = O ? h.resolvePath(p) : W(C && A.pathname || "", p);
      if (F === void 0) throw new Error(`Path '${p}' is not a routable path`);
      if (S.length >= $e) throw new Error("Too many redirects");
      const J = u();
      if (F !== J || U !== v()) if (isServer) {
        const X = getRequestEvent();
        X && (X.response = { status: 302, headers: new Headers({ Location: F }) }), a({ value: F, replace: j, scroll: T, state: U });
      } else c.confirm(F, R) && (S.push({ value: J, replace: j, scroll: T, state: v() }), b("navigate", { value: F, state: U }));
    });
  }
  function ge(h) {
    return h = h || useContext(le) || V, (p, R) => pe(h, p, R);
  }
  function we(h) {
    const p = S[0];
    p && (a({ ...h, replace: p.replace, scroll: p.scroll }), S.length = 0);
  }
  function ye(h, p) {
    const R = _(t(), h.pathname), C = x;
    x = "preload";
    for (let j in R) {
      const { route: O, params: T } = R[j];
      O.component && O.component.preload && O.component.preload();
      const { preload: U } = O;
      p && U && runWithOwner(r(), () => U({ params: T, location: { pathname: h.pathname, search: h.search, hash: h.hash, query: ie(h), state: null, key: "" }, intent: "preload" }));
    }
    x = C;
  }
  function ve() {
    const h = getRequestEvent();
    return h && h.router && h.router.submission ? [h.router.submission] : [];
  }
}
function Ve(e, t, r, o) {
  const { base: n, location: a, params: s } = e, { pattern: i, component: f, preload: c } = o().route, d = createMemo(() => o().path);
  f && f.preload && f.preload();
  const y = c ? c({ params: s, location: a, intent: x || "initial" }) : void 0;
  return { parent: t, pattern: i, path: d, outlet: () => f ? createComponent$1(f, { params: s, location: a, data: y, get children() {
    return r();
  } }) : r(), resolvePath(g) {
    return W(n.path(), g, d());
  } };
}
const de = (e) => (t) => {
  const { base: r } = t, o = children(() => t.children), n = createMemo(() => he(o(), t.base || ""));
  let a;
  const s = ze(e, n, () => a, { base: r, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(s), createComponent(De.Provider, { value: s, get children() {
    return createComponent(Je, { routerState: s, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(a = getOwner()) && null, createComponent(Xe, { routerState: s, get branches() {
        return n();
      } })];
    } });
  } });
};
function Je(e) {
  const t = e.routerState.location, r = e.routerState.params, o = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: r, location: t, intent: He() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (n) => createComponent(n, { params: r, location: t, get data() {
    return o();
  }, get children() {
    return e.children;
  } }) });
}
function Xe(e) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      Ge(n, e.routerState, e.branches);
      return;
    }
    n && ((n.router || (n.router = {})).matches || (n.router.matches = e.routerState.matches().map(({ route: a, path: s, params: i }) => ({ path: a.originalPath, pattern: a.pattern, match: s, params: i, info: a.info }))));
  }
  const t = [];
  let r;
  const o = createMemo(on(e.routerState.matches, (n, a, s) => {
    let i = a && n.length === a.length;
    const f = [];
    for (let c = 0, d = n.length; c < d; c++) {
      const y = a && a[c], m = n[c];
      s && y && m.route.key === y.route.key ? f[c] = s[c] : (i = false, t[c] && t[c](), createRoot((g) => {
        t[c] = g, f[c] = Ve(e.routerState, f[c - 1] || e.routerState.base, Y(() => o()[c + 1]), () => e.routerState.matches()[c]);
      }));
    }
    return t.splice(n.length).forEach((c) => c()), s && i ? s : (r = f[0], f);
  }));
  return Y(() => o() && r)();
}
const Y = (e) => () => createComponent(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent(le.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function Ge(e, t, r) {
  const o = new URL(e.request.url), n = _(r, new URL(e.router.previousUrl || e.request.url).pathname), a = _(r, o.pathname);
  for (let s = 0; s < a.length; s++) {
    (!n[s] || a[s].route !== n[s].route) && (e.router.dataOnly = true);
    const { route: i, params: f } = a[s];
    i.preload && i.preload({ params: f, location: t.location, intent: "preload" });
  }
}
function Qe([e, t], r, o) {
  return [e, o ? (n) => t(o(n)) : t];
}
function Ye(e) {
  let t = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, o = Qe(createSignal(r(e.get()), { equals: (n, a) => n.value === a.value && n.state === a.state }), void 0, (n) => (!t && e.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return e.init && onCleanup(e.init((n = e.get()) => {
    t = true, o[1](r(n)), t = false;
  })), de({ signal: o, create: e.create, utils: e.utils });
}
function Ze(e, t, r) {
  return e.addEventListener(t, r), () => e.removeEventListener(t, r);
}
function et(e, t) {
  const r = e && document.getElementById(e);
  r ? r.scrollIntoView() : t && window.scrollTo(0, 0);
}
function tt(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function nt(e) {
  let t;
  const r = { value: e.url || (t = getRequestEvent()) && tt(t.request.url) || "" };
  return de({ signal: [() => r, (o) => Object.assign(r, o)] })(e);
}
const rt = /* @__PURE__ */ new Map();
function ot(e = true, t = false, r = "/_server", o) {
  return (n) => {
    const a = n.base.path(), s = n.navigatorFactory(n.base);
    let i, f;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function d(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const l = u.composedPath().find((q) => q instanceof Node && q.nodeName.toUpperCase() === "A");
      if (!l || t && !l.hasAttribute("link")) return;
      const v = c(l), w = v ? l.href.baseVal : l.href;
      if ((v ? l.target.baseVal : l.target) || !w && !l.hasAttribute("state")) return;
      const S = (l.getAttribute("rel") || "").split(/\s+/);
      if (l.hasAttribute("download") || S && S.includes("external")) return;
      const E = v ? new URL(w, document.baseURI) : new URL(w);
      if (!(E.origin !== window.location.origin || a && E.pathname && !E.pathname.toLowerCase().startsWith(a.toLowerCase()))) return [l, E];
    }
    function y(u) {
      const l = d(u);
      if (!l) return;
      const [v, w] = l, A = n.parsePath(w.pathname + w.search + w.hash), S = v.getAttribute("state");
      u.preventDefault(), s(A, { resolve: false, replace: v.hasAttribute("replace"), scroll: !v.hasAttribute("noscroll"), state: S ? JSON.parse(S) : void 0 });
    }
    function m(u) {
      const l = d(u);
      if (!l) return;
      const [v, w] = l;
      o && (w.pathname = o(w.pathname)), n.preloadRoute(w, v.getAttribute("preload") !== "false");
    }
    function g(u) {
      clearTimeout(i);
      const l = d(u);
      if (!l) return f = null;
      const [v, w] = l;
      f !== v && (o && (w.pathname = o(w.pathname)), i = setTimeout(() => {
        n.preloadRoute(w, v.getAttribute("preload") !== "false"), f = v;
      }, 20));
    }
    function b(u) {
      if (u.defaultPrevented) return;
      let l = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!l) return;
      if (!l.startsWith("https://action/")) {
        const w = new URL(l, se);
        if (l = n.parsePath(w.pathname + w.search), !l.startsWith(r)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const v = rt.get(l);
      if (v) {
        u.preventDefault();
        const w = new FormData(u.target, u.submitter);
        v.call({ r: n, f: u.target }, u.target.enctype === "multipart/form-data" ? w : new URLSearchParams(w));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", y), e && (document.addEventListener("mousemove", g, { passive: true }), document.addEventListener("focusin", m, { passive: true }), document.addEventListener("touchstart", m, { passive: true })), document.addEventListener("submit", b), onCleanup(() => {
      document.removeEventListener("click", y), e && (document.removeEventListener("mousemove", g), document.removeEventListener("focusin", m), document.removeEventListener("touchstart", m)), document.removeEventListener("submit", b);
    });
  };
}
function at(e) {
  if (isServer) return nt(e);
  const t = () => {
    const o = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: o + window.location.hash, state: n };
  }, r = ae();
  return Ye({ get: t, set({ value: o, replace: n, scroll: a, state: s }) {
    n ? window.history.replaceState(qe(s), "", o) : window.history.pushState(s, "", o), et(decodeURIComponent(window.location.hash.slice(1)), a), H();
  }, init: (o) => Ze(window, "popstate", Be(o, (n) => {
    if (n && n < 0) return !r.confirm(n);
    {
      const a = t();
      return !r.confirm(a.value, { state: a.state });
    }
  })), create: ot(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (o) => window.history.go(o), beforeLeave: r } })(e);
}
var st = ["<a", ' href="/">Index</a>'], it = ["<a", ' href="/about">About</a>'];
function pt() {
  return createComponent(at, { root: (e) => createComponent(I$1, { get children() {
    return [createComponent(k, { children: "SolidStart - Basic" }), ssr(st, ssrHydrationKey()), ssr(it, ssrHydrationKey()), createComponent(Suspense, { get children() {
      return e.children;
    } })];
  } }), get children() {
    return createComponent(zn, {});
  } });
}

export { pt as default };
//# sourceMappingURL=app-BjL9gdBQ.mjs.map
