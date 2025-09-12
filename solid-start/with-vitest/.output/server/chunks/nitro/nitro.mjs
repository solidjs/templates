import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { sharedConfig, lazy, createComponent, createContext as createContext$1, catchError, ErrorBoundary, Suspense, onCleanup, createUniqueId, createSignal, useContext, createRenderEffect, children, createMemo, getOwner, on as on$1, runWithOwner, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch } from 'solid-js';
import { renderToString, getRequestEvent, isServer, ssrElement, escape, mergeProps, ssr, renderToStream, createComponent as createComponent$1, ssrHydrationKey, NoHydration, useAssets, Hydration, ssrAttribute, HydrationScript, delegateEvents, spread } from 'solid-js/web';
import { provideRequestEvent } from 'solid-js/web/storage';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _$1(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function g(...n){return function(...e){for(const t of n)t(...e);}}const m$1=_$1();let A$1 = class A extends m$1{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};let y$1 = class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$1;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p$1(this.headers)}get trailersDistinct(){return p$1(this.trailers)}};function p$1(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}let w$1 = class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}};const E$1=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E$1,t=Array.isArray(n)||H$1(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$1(n){return typeof n?.entries=="function"}function S$1(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C$1=new Set([101,204,205,304]);async function b(n,e){const t=new y$1,r=new w$1(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C$1.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S$1(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$2=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$2;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s$1="base64url";function digest(t){if(e)return e(r,t,s$1);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s$1):o.digest(s$1)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {
      "/_build/assets/**": {
        "headers": {
          "cache-control": "public, immutable, max-age=31536000"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest","order":0,"outDir":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest","base":"/","outDir":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest","outDir":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"../node_modules/.pnpm/@solidjs+start@1.1.4_@testing-library+jest-dom@6.6.3_@types+node@20.17.50_jiti@2.5.1_li_da102430cd02cba25a40f77e2eb578ef/node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest","outDir":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true}},"root":"/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest"};
					const buildManifest = {"ssr":{"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"css":["assets/index-BzuOmeKI.css"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"dynamicImports":["src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css"]}},"client":{"_web-DiiVmrR4.js":{"file":"assets/web-DiiVmrR4.js","name":"web"},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-DF08Dppd.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-DiiVmrR4.js"],"css":["assets/index-BzuOmeKI.css"]},"virtual:$vinxi/handler/client":{"file":"assets/client-V1mZqjvZ.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_web-DiiVmrR4.js"],"dynamicImports":["src/routes/index.tsx?pick=default&pick=$css"]}},"server-fns":{"_server-fns-CpbZp8aT.js":{"file":"assets/server-fns-CpbZp8aT.js","name":"server-fns","dynamicImports":["src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/app.tsx"]},"src/app.tsx":{"file":"assets/app-DgtWNHGm.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_server-fns-CpbZp8aT.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"css":["assets/index-BzuOmeKI.css"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-CpbZp8aT.js"]}}};

					const routeManifest = {"ssr":{},"client":{},"server-fns":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"298-hdW7/pL89QptiszdYCHH67XxLxs\"",
    "mtime": "2025-08-28T10:52:19.463Z",
    "size": 664,
    "path": "../public/favicon.ico"
  },
  "/assets/index-BzuOmeKI.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2ac-mLzrwO8keUBbWnjJR10C7ezOx6I\"",
    "mtime": "2025-08-28T10:52:19.464Z",
    "size": 684,
    "path": "../public/assets/index-BzuOmeKI.css"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "etag": "\"2ca-y9VQEV7GeIkJO/3KtjVYQSNjy6Y\"",
    "mtime": "2025-08-28T10:52:19.465Z",
    "size": 714,
    "path": "../public/_build/.vite/manifest.json"
  },
  "/_build/assets/client-V1mZqjvZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5a2b-kFOP+8jm3UR3SANuVyHgqQNJJBs\"",
    "mtime": "2025-08-28T10:52:19.465Z",
    "size": 23083,
    "path": "../public/_build/assets/client-V1mZqjvZ.js"
  },
  "/_build/assets/client-V1mZqjvZ.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2167-+ilc47zBowDpus0Kf5gsKdIbYfU\"",
    "mtime": "2025-08-28T10:52:19.488Z",
    "size": 8551,
    "path": "../public/_build/assets/client-V1mZqjvZ.js.br"
  },
  "/_build/assets/client-V1mZqjvZ.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"24ea-ZFtb6P8kXtIteFMSLbwzozCIwR0\"",
    "mtime": "2025-08-28T10:52:19.483Z",
    "size": 9450,
    "path": "../public/_build/assets/client-V1mZqjvZ.js.gz"
  },
  "/_build/assets/index-BzuOmeKI.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2ac-mLzrwO8keUBbWnjJR10C7ezOx6I\"",
    "mtime": "2025-08-28T10:52:19.465Z",
    "size": 684,
    "path": "../public/_build/assets/index-BzuOmeKI.css"
  },
  "/_build/assets/index-DF08Dppd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"270-j4zoqF9VkwnEM9ityoTnEQAqJ4I\"",
    "mtime": "2025-08-28T10:52:19.465Z",
    "size": 624,
    "path": "../public/_build/assets/index-DF08Dppd.js"
  },
  "/_build/assets/web-DiiVmrR4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"59d6-e3fpJHm0vZ3K1sMekgD6Y2KCGnE\"",
    "mtime": "2025-08-28T10:52:19.465Z",
    "size": 22998,
    "path": "../public/_build/assets/web-DiiVmrR4.js"
  },
  "/_build/assets/web-DiiVmrR4.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"1fc5-hSeyHy01ILbMHtjFp6hgpHH6Dpc\"",
    "mtime": "2025-08-28T10:52:19.487Z",
    "size": 8133,
    "path": "../public/_build/assets/web-DiiVmrR4.js.br"
  },
  "/_build/assets/web-DiiVmrR4.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"22e5-6RJ8bIX3CPtHT+4lxW995gS1aIc\"",
    "mtime": "2025-08-28T10:52:19.484Z",
    "size": 8933,
    "path": "../public/_build/assets/web-DiiVmrR4.js.gz"
  },
  "/_server/assets/index-BzuOmeKI.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2ac-mLzrwO8keUBbWnjJR10C7ezOx6I\"",
    "mtime": "2025-08-28T10:52:19.467Z",
    "size": 684,
    "path": "../public/_server/assets/index-BzuOmeKI.css"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _oPMbh5 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
var Ft = ((e) => (e[e.AggregateError = 1] = "AggregateError", e[e.ArrowFunction = 2] = "ArrowFunction", e[e.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", e[e.ObjectAssign = 8] = "ObjectAssign", e[e.BigIntTypedArray = 16] = "BigIntTypedArray", e))(Ft || {});
function Ct(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function m(e) {
  let t = "", r = 0, n;
  for (let a = 0, i = e.length; a < i; a++) n = Ct(e[a]), n && (t += e.slice(r, a) + n, r = a + 1);
  return r === 0 ? t = e : t += e.slice(r), t;
}
function Tt(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function v(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, Tt);
}
var A = "__SEROVAL_REFS__", _ = "$R", V$1 = `self.${_}`;
function $t(e) {
  return e == null ? `${V$1}=${V$1}||[]` : `(${V$1}=${V$1}||{})["${m(e)}"]=[]`;
}
function w(e, t) {
  if (!e) throw t;
}
var Ne = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
function De$1(e) {
  return Ne.has(e);
}
function Ot(e) {
  return R.has(e);
}
function jt(e) {
  return w(De$1(e), new yr$1(e)), Ne.get(e);
}
function Vt$1(e) {
  return w(Ot(e), new br$1(e)), R.get(e);
}
typeof globalThis < "u" ? Object.defineProperty(globalThis, A, { value: R, configurable: true, writable: false, enumerable: false }) : typeof self < "u" ? Object.defineProperty(self, A, { value: R, configurable: true, writable: false, enumerable: false }) : typeof global < "u" && Object.defineProperty(global, A, { value: R, configurable: true, writable: false, enumerable: false });
function _e(e, t) {
  for (let r = 0, n = t.length; r < n; r++) {
    let a = t[r];
    e.has(a) || (e.add(a), a.extends && _e(e, a.extends));
  }
}
function Me$1(e) {
  if (e) {
    let t = /* @__PURE__ */ new Set();
    return _e(t, e), [...t];
  }
}
var Nt = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, Le = { [Symbol.asyncIterator]: 0, [Symbol.hasInstance]: 1, [Symbol.isConcatSpreadable]: 2, [Symbol.iterator]: 3, [Symbol.match]: 4, [Symbol.matchAll]: 5, [Symbol.replace]: 6, [Symbol.search]: 7, [Symbol.species]: 8, [Symbol.split]: 9, [Symbol.toPrimitive]: 10, [Symbol.toStringTag]: 11, [Symbol.unscopables]: 12 }, Dt$1 = { 0: Symbol.asyncIterator, 1: Symbol.hasInstance, 2: Symbol.isConcatSpreadable, 3: Symbol.iterator, 4: Symbol.match, 5: Symbol.matchAll, 6: Symbol.replace, 7: Symbol.search, 8: Symbol.species, 9: Symbol.split, 10: Symbol.toPrimitive, 11: Symbol.toStringTag, 12: Symbol.unscopables }, _t = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, Mt = { 2: true, 3: false, 1: void 0, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN }, He = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, Lt = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError }, s = void 0;
function f(e, t, r, n, a, i, o, l, u, c, d, S) {
  return { t: e, i: t, s: r, l: n, c: a, m: i, p: o, e: l, a: u, f: c, b: d, o: S };
}
function z(e) {
  return f(2, s, e, s, s, s, s, s, s, s, s, s);
}
var J = z(2), Z$1 = z(3), Ht = z(1), Ut$1 = z(0), qt = z(4), Wt$1 = z(5), Bt$1 = z(6), Kt$1 = z(7);
function ue$1(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function Xt$1(e) {
  let t = He[ue$1(e)];
  return e.name !== t ? { name: e.name } : e.constructor.name !== t ? { name: e.constructor.name } : {};
}
function ge$1(e, t) {
  let r = Xt$1(e), n = Object.getOwnPropertyNames(e);
  for (let a = 0, i = n.length, o; a < i; a++) o = n[a], o !== "name" && o !== "message" && (o === "stack" ? t & 4 && (r = r || {}, r[o] = e[o]) : (r = r || {}, r[o] = e[o]));
  return r;
}
function Ue$1(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function Yt$1(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return Wt$1;
    case Number.NEGATIVE_INFINITY:
      return Bt$1;
  }
  return e !== e ? Kt$1 : Object.is(e, -0) ? qt : f(0, s, e, s, s, s, s, s, s, s, s, s);
}
function Q(e) {
  return f(1, s, m(e), s, s, s, s, s, s, s, s, s);
}
function Gt$1(e) {
  return f(3, s, "" + e, s, s, s, s, s, s, s, s, s);
}
function Jt$1(e) {
  return f(4, e, s, s, s, s, s, s, s, s, s, s);
}
function Zt$1(e, t) {
  let r = t.valueOf();
  return f(5, e, r !== r ? "" : t.toISOString(), s, s, s, s, s, s, s, s, s);
}
function Qt$1(e, t) {
  return f(6, e, s, s, m(t.source), t.flags, s, s, s, s, s, s);
}
function er$1(e, t) {
  let r = new Uint8Array(t), n = r.length, a = new Array(n);
  for (let i = 0; i < n; i++) a[i] = r[i];
  return f(19, e, a, s, s, s, s, s, s, s, s, s);
}
function tr$1(e, t) {
  return f(17, e, Le[t], s, s, s, s, s, s, s, s, s);
}
function rr$1(e, t) {
  return f(18, e, m(jt(t)), s, s, s, s, s, s, s, s, s);
}
function qe(e, t, r) {
  return f(25, e, r, s, m(t), s, s, s, s, s, s, s);
}
function sr$1(e, t, r) {
  return f(9, e, s, t.length, s, s, s, s, r, s, s, Ue$1(t));
}
function nr$1(e, t) {
  return f(21, e, s, s, s, s, s, s, s, t, s, s);
}
function ar$1(e, t, r) {
  return f(15, e, s, t.length, t.constructor.name, s, s, s, s, r, t.byteOffset, s);
}
function ir$1(e, t, r) {
  return f(16, e, s, t.length, t.constructor.name, s, s, s, s, r, t.byteOffset, s);
}
function or$1(e, t, r) {
  return f(20, e, s, t.byteLength, s, s, s, s, s, r, t.byteOffset, s);
}
function lr$1(e, t, r) {
  return f(13, e, ue$1(t), s, s, m(t.message), r, s, s, s, s, s);
}
function ur$1(e, t, r) {
  return f(14, e, ue$1(t), s, s, m(t.message), r, s, s, s, s, s);
}
function cr$1(e, t, r) {
  return f(7, e, s, t, s, s, s, s, r, s, s, s);
}
function We$1(e, t) {
  return f(28, s, s, s, s, s, s, s, [e, t], s, s, s);
}
function Be$1(e, t) {
  return f(30, s, s, s, s, s, s, s, [e, t], s, s, s);
}
function Ke$1(e, t, r) {
  return f(31, e, s, s, s, s, s, s, r, t, s, s);
}
function hr$1(e, t) {
  return f(32, e, s, s, s, s, s, s, s, t, s, s);
}
function fr$1(e, t) {
  return f(33, e, s, s, s, s, s, s, s, t, s, s);
}
function dr$1(e, t) {
  return f(34, e, s, s, s, s, s, s, s, t, s, s);
}
var { toString: ce } = Object.prototype;
function pr$1(e, t) {
  return t instanceof Error ? `Seroval caught an error during the ${e} process.
  
${t.name}
${t.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new` : `Seroval caught an error during the ${e} process.

"${ce.call(t)}"

For more information, please check the "cause" property of this error.`;
}
var he = class extends Error {
  constructor(t, r) {
    super(pr$1(t, r)), this.cause = r;
  }
}, me = class extends he {
  constructor(e) {
    super("parsing", e);
  }
}, gr$1 = class gr extends he {
  constructor(e) {
    super("serialization", e);
  }
}, mr$1 = class mr extends he {
  constructor(e) {
    super("deserialization", e);
  }
}, M = class extends Error {
  constructor(t) {
    super(`The value ${ce.call(t)} of type "${typeof t}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`), this.value = t;
  }
}, Xe$1 = class Xe extends Error {
  constructor(t) {
    super('Unsupported node type "' + t.t + '".');
  }
}, Ye$1 = class Ye extends Error {
  constructor(t) {
    super('Missing plugin for tag "' + t + '".');
  }
}, I = class extends Error {
  constructor(t) {
    super('Missing "' + t + '" instance.');
  }
}, yr$1 = class yr extends Error {
  constructor(t) {
    super('Missing reference for the value "' + ce.call(t) + '" of type "' + typeof t + '"'), this.value = t;
  }
}, br$1 = class br extends Error {
  constructor(e) {
    super('Missing reference for id "' + m(e) + '"');
  }
}, wr$1 = class wr extends Error {
  constructor(e) {
    super('Unknown TypedArray "' + e + '"');
  }
}, zr = class {
  constructor(t, r) {
    this.value = t, this.replacement = r;
  }
};
function P(e, t, r) {
  return e & 2 ? (t.length === 1 ? t[0] : "(" + t.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + t.join(",") + "){return " + r + "}";
}
function y(e, t, r) {
  return e & 2 ? (t.length === 1 ? t[0] : "(" + t.join(",") + ")") + "=>{" + r + "}" : "function(" + t.join(",") + "){" + r + "}";
}
var vr$1 = {}, Sr = {}, Rr$1 = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} };
function xr$1(e) {
  return P(e, ["r"], "(r.p=new Promise(" + y(e, ["s", "f"], "r.s=s,r.f=f") + "))");
}
function Ir(e) {
  return y(e, ["r", "d"], "r.s(d),r.p.s=1,r.p.v=d");
}
function Ar(e) {
  return y(e, ["r", "d"], "r.f(d),r.p.s=2,r.p.v=d");
}
function Er(e) {
  return P(e, ["b", "a", "s", "l", "p", "f", "e", "n"], "(b=[],a=!0,s=!1,l=[],p=0,f=" + y(e, ["v", "m", "x"], "for(x=0;x<p;x++)l[x]&&l[x][m](v)") + ",n=" + y(e, ["o", "x", "z", "c"], 'for(x=0,z=b.length;x<z;x++)(c=b[x],(!a&&x===z-1)?o[s?"return":"throw"](c):o.next(c))') + ",e=" + P(e, ["o", "t"], "(a&&(l[t=p++]=o),n(o)," + y(e, [], "a&&(l[t]=void 0)") + ")") + ",{__SEROVAL_STREAM__:!0,on:" + P(e, ["o"], "e(o)") + ",next:" + y(e, ["v"], 'a&&(b.push(v),f(v,"next"))') + ",throw:" + y(e, ["v"], 'a&&(b.push(v),f(v,"throw"),a=s=!1,l.length=0)') + ",return:" + y(e, ["v"], 'a&&(b.push(v),f(v,"return"),a=!1,s=!0,l.length=0)') + "})");
}
function Pr(e, t) {
  switch (t) {
    case 0:
      return "[]";
    case 1:
      return xr$1(e);
    case 2:
      return Ir(e);
    case 3:
      return Ar(e);
    case 4:
      return Er(e);
    default:
      return "";
  }
}
function ee$1() {
  let e, t;
  return { promise: new Promise((r, n) => {
    e = r, t = n;
  }), resolve(r) {
    e(r);
  }, reject(r) {
    t(r);
  } };
}
function kr(e) {
  return "__SEROVAL_STREAM__" in e;
}
function $() {
  let e = /* @__PURE__ */ new Set(), t = [], r = true, n = true;
  function a(l) {
    for (let u of e.keys()) u.next(l);
  }
  function i(l) {
    for (let u of e.keys()) u.throw(l);
  }
  function o(l) {
    for (let u of e.keys()) u.return(l);
  }
  return { __SEROVAL_STREAM__: true, on(l) {
    r && e.add(l);
    for (let u = 0, c = t.length; u < c; u++) {
      let d = t[u];
      u === c - 1 && !r ? n ? l.return(d) : l.throw(d) : l.next(d);
    }
    return () => {
      r && e.delete(l);
    };
  }, next(l) {
    r && (t.push(l), a(l));
  }, throw(l) {
    r && (t.push(l), i(l), r = false, n = false, e.clear());
  }, return(l) {
    r && (t.push(l), o(l), r = false, n = true, e.clear());
  } };
}
function Fr(e) {
  let t = $(), r = e[Symbol.asyncIterator]();
  async function n() {
    try {
      let a = await r.next();
      a.done ? t.return(a.value) : (t.next(a.value), await n());
    } catch (a) {
      t.throw(a);
    }
  }
  return n().catch(() => {
  }), t;
}
function Cr(e) {
  return () => {
    let t = [], r = [], n = 0, a = -1, i = false;
    function o() {
      for (let u = 0, c = r.length; u < c; u++) r[u].resolve({ done: true, value: void 0 });
    }
    e.on({ next(u) {
      let c = r.shift();
      c && c.resolve({ done: false, value: u }), t.push(u);
    }, throw(u) {
      let c = r.shift();
      c && c.reject(u), o(), a = t.length, t.push(u), i = true;
    }, return(u) {
      let c = r.shift();
      c && c.resolve({ done: true, value: u }), o(), a = t.length, t.push(u);
    } });
    function l() {
      let u = n++, c = t[u];
      if (u !== a) return { done: false, value: c };
      if (i) throw c;
      return { done: true, value: c };
    }
    return { [Symbol.asyncIterator]() {
      return this;
    }, async next() {
      if (a === -1) {
        let u = n++;
        if (u >= t.length) {
          let c = ee$1();
          return r.push(c), await c.promise;
        }
        return { done: false, value: t[u] };
      }
      return n > a ? { done: true, value: void 0 } : l();
    } };
  };
}
function Ge$1(e) {
  let t = [], r = -1, n = -1, a = e[Symbol.iterator]();
  for (; ; ) try {
    let i = a.next();
    if (t.push(i.value), i.done) {
      n = t.length - 1;
      break;
    }
  } catch (i) {
    r = t.length, t.push(i);
  }
  return { v: t, t: r, d: n };
}
function Tr(e) {
  return () => {
    let t = 0;
    return { [Symbol.iterator]() {
      return this;
    }, next() {
      if (t > e.d) return { done: true, value: s };
      let r = t++, n = e.v[r];
      if (r === e.t) throw n;
      return { done: r === e.d, value: n };
    } };
  };
}
var $r = class {
  constructor(t) {
    this.marked = /* @__PURE__ */ new Set(), this.plugins = t.plugins, this.features = 31 ^ (t.disabledFeatures || 0), this.refs = t.refs || /* @__PURE__ */ new Map();
  }
  markRef(t) {
    this.marked.add(t);
  }
  isMarked(t) {
    return this.marked.has(t);
  }
  createIndex(t) {
    let r = this.refs.size;
    return this.refs.set(t, r), r;
  }
  getIndexedValue(t) {
    let r = this.refs.get(t);
    return r != null ? (this.markRef(r), { type: 1, value: Jt$1(r) }) : { type: 0, value: this.createIndex(t) };
  }
  getReference(t) {
    let r = this.getIndexedValue(t);
    return r.type === 1 ? r : De$1(t) ? { type: 2, value: rr$1(r.value, t) } : r;
  }
  parseWellKnownSymbol(t) {
    let r = this.getReference(t);
    return r.type !== 0 ? r.value : (w(t in Le, new M(t)), tr$1(r.value, t));
  }
  parseSpecialReference(t) {
    let r = this.getIndexedValue(Rr$1[t]);
    return r.type === 1 ? r.value : f(26, r.value, t, s, s, s, s, s, s, s, s, s);
  }
  parseIteratorFactory() {
    let t = this.getIndexedValue(vr$1);
    return t.type === 1 ? t.value : f(27, t.value, s, s, s, s, s, s, s, this.parseWellKnownSymbol(Symbol.iterator), s, s);
  }
  parseAsyncIteratorFactory() {
    let t = this.getIndexedValue(Sr);
    return t.type === 1 ? t.value : f(29, t.value, s, s, s, s, s, s, [this.parseSpecialReference(1), this.parseWellKnownSymbol(Symbol.asyncIterator)], s, s, s);
  }
  createObjectNode(t, r, n, a) {
    return f(n ? 11 : 10, t, s, s, s, s, a, s, s, s, s, Ue$1(r));
  }
  createMapNode(t, r, n, a) {
    return f(8, t, s, s, s, s, s, { k: r, v: n, s: a }, s, this.parseSpecialReference(0), s, s);
  }
  createPromiseConstructorNode(t, r) {
    return f(22, t, r, s, s, s, s, s, s, this.parseSpecialReference(1), s, s);
  }
};
function Or(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new wr$1(e);
  }
}
function ye$1(e, t) {
  switch (t) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var jr = class {
  constructor(e) {
    this.plugins = e.plugins, this.refs = e.refs || /* @__PURE__ */ new Map();
  }
  deserializeReference(e) {
    return this.assignIndexedValue(e.i, Vt$1(v(e.s)));
  }
  deserializeArray(e) {
    let t = e.l, r = this.assignIndexedValue(e.i, new Array(t)), n;
    for (let a = 0; a < t; a++) n = e.a[a], n && (r[a] = this.deserialize(n));
    return ye$1(r, e.o), r;
  }
  deserializeProperties(e, t) {
    let r = e.s;
    if (r) {
      let n = e.k, a = e.v;
      for (let i = 0, o; i < r; i++) o = n[i], typeof o == "string" ? t[v(o)] = this.deserialize(a[i]) : t[this.deserialize(o)] = this.deserialize(a[i]);
    }
    return t;
  }
  deserializeObject(e) {
    let t = this.assignIndexedValue(e.i, e.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
    return this.deserializeProperties(e.p, t), ye$1(t, e.o), t;
  }
  deserializeDate(e) {
    return this.assignIndexedValue(e.i, new Date(e.s));
  }
  deserializeRegExp(e) {
    return this.assignIndexedValue(e.i, new RegExp(v(e.c), e.m));
  }
  deserializeSet(e) {
    let t = this.assignIndexedValue(e.i, /* @__PURE__ */ new Set()), r = e.a;
    for (let n = 0, a = e.l; n < a; n++) t.add(this.deserialize(r[n]));
    return t;
  }
  deserializeMap(e) {
    let t = this.assignIndexedValue(e.i, /* @__PURE__ */ new Map()), r = e.e.k, n = e.e.v;
    for (let a = 0, i = e.e.s; a < i; a++) t.set(this.deserialize(r[a]), this.deserialize(n[a]));
    return t;
  }
  deserializeArrayBuffer(e) {
    let t = new Uint8Array(e.s);
    return this.assignIndexedValue(e.i, t.buffer);
  }
  deserializeTypedArray(e) {
    let t = Or(e.c), r = this.deserialize(e.f);
    return this.assignIndexedValue(e.i, new t(r, e.b, e.l));
  }
  deserializeDataView(e) {
    let t = this.deserialize(e.f);
    return this.assignIndexedValue(e.i, new DataView(t, e.b, e.l));
  }
  deserializeDictionary(e, t) {
    if (e.p) {
      let r = this.deserializeProperties(e.p, {});
      Object.assign(t, r);
    }
    return t;
  }
  deserializeAggregateError(e) {
    let t = this.assignIndexedValue(e.i, new AggregateError([], v(e.m)));
    return this.deserializeDictionary(e, t);
  }
  deserializeError(e) {
    let t = Lt[e.s], r = this.assignIndexedValue(e.i, new t(v(e.m)));
    return this.deserializeDictionary(e, r);
  }
  deserializePromise(e) {
    let t = ee$1(), r = this.assignIndexedValue(e.i, t), n = this.deserialize(e.f);
    return e.s ? t.resolve(n) : t.reject(n), r.promise;
  }
  deserializeBoxed(e) {
    return this.assignIndexedValue(e.i, Object(this.deserialize(e.f)));
  }
  deserializePlugin(e) {
    let t = this.plugins;
    if (t) {
      let r = v(e.c);
      for (let n = 0, a = t.length; n < a; n++) {
        let i = t[n];
        if (i.tag === r) return this.assignIndexedValue(e.i, i.deserialize(e.s, this, { id: e.i }));
      }
    }
    throw new Ye$1(e.c);
  }
  deserializePromiseConstructor(e) {
    return this.assignIndexedValue(e.i, this.assignIndexedValue(e.s, ee$1()).promise);
  }
  deserializePromiseResolve(e) {
    let t = this.refs.get(e.i);
    w(t, new I("Promise")), t.resolve(this.deserialize(e.a[1]));
  }
  deserializePromiseReject(e) {
    let t = this.refs.get(e.i);
    w(t, new I("Promise")), t.reject(this.deserialize(e.a[1]));
  }
  deserializeIteratorFactoryInstance(e) {
    this.deserialize(e.a[0]);
    let t = this.deserialize(e.a[1]);
    return Tr(t);
  }
  deserializeAsyncIteratorFactoryInstance(e) {
    this.deserialize(e.a[0]);
    let t = this.deserialize(e.a[1]);
    return Cr(t);
  }
  deserializeStreamConstructor(e) {
    let t = this.assignIndexedValue(e.i, $()), r = e.a.length;
    if (r) for (let n = 0; n < r; n++) this.deserialize(e.a[n]);
    return t;
  }
  deserializeStreamNext(e) {
    let t = this.refs.get(e.i);
    w(t, new I("Stream")), t.next(this.deserialize(e.f));
  }
  deserializeStreamThrow(e) {
    let t = this.refs.get(e.i);
    w(t, new I("Stream")), t.throw(this.deserialize(e.f));
  }
  deserializeStreamReturn(e) {
    let t = this.refs.get(e.i);
    w(t, new I("Stream")), t.return(this.deserialize(e.f));
  }
  deserializeIteratorFactory(e) {
    this.deserialize(e.f);
  }
  deserializeAsyncIteratorFactory(e) {
    this.deserialize(e.a[1]);
  }
  deserializeTop(e) {
    try {
      return this.deserialize(e);
    } catch (t) {
      throw new mr$1(t);
    }
  }
  deserialize(e) {
    switch (e.t) {
      case 2:
        return Mt[e.s];
      case 0:
        return e.s;
      case 1:
        return v(e.s);
      case 3:
        return BigInt(e.s);
      case 4:
        return this.refs.get(e.i);
      case 18:
        return this.deserializeReference(e);
      case 9:
        return this.deserializeArray(e);
      case 10:
      case 11:
        return this.deserializeObject(e);
      case 5:
        return this.deserializeDate(e);
      case 6:
        return this.deserializeRegExp(e);
      case 7:
        return this.deserializeSet(e);
      case 8:
        return this.deserializeMap(e);
      case 19:
        return this.deserializeArrayBuffer(e);
      case 16:
      case 15:
        return this.deserializeTypedArray(e);
      case 20:
        return this.deserializeDataView(e);
      case 14:
        return this.deserializeAggregateError(e);
      case 13:
        return this.deserializeError(e);
      case 12:
        return this.deserializePromise(e);
      case 17:
        return Dt$1[e.s];
      case 21:
        return this.deserializeBoxed(e);
      case 25:
        return this.deserializePlugin(e);
      case 22:
        return this.deserializePromiseConstructor(e);
      case 23:
        return this.deserializePromiseResolve(e);
      case 24:
        return this.deserializePromiseReject(e);
      case 28:
        return this.deserializeIteratorFactoryInstance(e);
      case 30:
        return this.deserializeAsyncIteratorFactoryInstance(e);
      case 31:
        return this.deserializeStreamConstructor(e);
      case 32:
        return this.deserializeStreamNext(e);
      case 33:
        return this.deserializeStreamThrow(e);
      case 34:
        return this.deserializeStreamReturn(e);
      case 27:
        return this.deserializeIteratorFactory(e);
      case 29:
        return this.deserializeAsyncIteratorFactory(e);
      default:
        throw new Xe$1(e);
    }
  }
}, Vr = /^[$A-Z_][0-9A-Z_$]*$/i;
function be$1(e) {
  let t = e[0];
  return (t === "$" || t === "_" || t >= "A" && t <= "Z" || t >= "a" && t <= "z") && Vr.test(e);
}
function E(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function Nr(e) {
  let t = [], r = e[0];
  for (let n = 1, a = e.length, i, o = r; n < a; n++) i = e[n], i.t === 0 && i.v === o.v ? r = { t: 0, s: i.s, k: s, v: E(r) } : i.t === 2 && i.s === o.s ? r = { t: 2, s: E(r), k: i.k, v: i.v } : i.t === 1 && i.s === o.s ? r = { t: 1, s: E(r), k: s, v: i.v } : i.t === 3 && i.s === o.s ? r = { t: 3, s: E(r), k: i.k, v: s } : (t.push(r), r = i), o = i;
  return t.push(r), t;
}
function we$1(e) {
  if (e.length) {
    let t = "", r = Nr(e);
    for (let n = 0, a = r.length; n < a; n++) t += E(r[n]) + ",";
    return t;
  }
  return s;
}
var Dr = "Object.create(null)", _r = "new Set", Mr = "new Map", Lr = "Promise.resolve", Hr = "Promise.reject", Ur = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: s }, qr = class {
  constructor(e) {
    this.stack = [], this.flags = [], this.assignments = [], this.plugins = e.plugins, this.features = e.features, this.marked = new Set(e.markedRefs);
  }
  createFunction(e, t) {
    return P(this.features, e, t);
  }
  createEffectfulFunction(e, t) {
    return y(this.features, e, t);
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  pushObjectFlag(e, t) {
    e !== 0 && (this.markRef(t), this.flags.push({ type: e, value: this.getRefParam(t) }));
  }
  resolveFlags() {
    let e = "";
    for (let t = 0, r = this.flags, n = r.length; t < n; t++) {
      let a = r[t];
      e += Ur[a.type] + "(" + a.value + "),";
    }
    return e;
  }
  resolvePatches() {
    let e = we$1(this.assignments), t = this.resolveFlags();
    return e ? t ? e + t : e : t;
  }
  createAssignment(e, t) {
    this.assignments.push({ t: 0, s: e, k: s, v: t });
  }
  createAddAssignment(e, t) {
    this.assignments.push({ t: 1, s: this.getRefParam(e), k: s, v: t });
  }
  createSetAssignment(e, t, r) {
    this.assignments.push({ t: 2, s: this.getRefParam(e), k: t, v: r });
  }
  createDeleteAssignment(e, t) {
    this.assignments.push({ t: 3, s: this.getRefParam(e), k: t, v: s });
  }
  createArrayAssign(e, t, r) {
    this.createAssignment(this.getRefParam(e) + "[" + t + "]", r);
  }
  createObjectAssign(e, t, r) {
    this.createAssignment(this.getRefParam(e) + "." + t, r);
  }
  isIndexedValueInStack(e) {
    return e.t === 4 && this.stack.includes(e.i);
  }
  serializeReference(e) {
    return this.assignIndexedValue(e.i, A + '.get("' + e.s + '")');
  }
  serializeArrayItem(e, t, r) {
    return t ? this.isIndexedValueInStack(t) ? (this.markRef(e), this.createArrayAssign(e, r, this.getRefParam(t.i)), "") : this.serialize(t) : "";
  }
  serializeArray(e) {
    let t = e.i;
    if (e.l) {
      this.stack.push(t);
      let r = e.a, n = this.serializeArrayItem(t, r[0], 0), a = n === "";
      for (let i = 1, o = e.l, l; i < o; i++) l = this.serializeArrayItem(t, r[i], i), n += "," + l, a = l === "";
      return this.stack.pop(), this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(t, "[" + n + (a ? ",]" : "]"));
    }
    return this.assignIndexedValue(t, "[]");
  }
  serializeProperty(e, t, r) {
    if (typeof t == "string") {
      let n = Number(t), a = n >= 0 && n.toString() === t || be$1(t);
      if (this.isIndexedValueInStack(r)) {
        let i = this.getRefParam(r.i);
        return this.markRef(e.i), a && n !== n ? this.createObjectAssign(e.i, t, i) : this.createArrayAssign(e.i, a ? t : '"' + t + '"', i), "";
      }
      return (a ? t : '"' + t + '"') + ":" + this.serialize(r);
    }
    return "[" + this.serialize(t) + "]:" + this.serialize(r);
  }
  serializeProperties(e, t) {
    let r = t.s;
    if (r) {
      let n = t.k, a = t.v;
      this.stack.push(e.i);
      let i = this.serializeProperty(e, n[0], a[0]);
      for (let o = 1, l = i; o < r; o++) l = this.serializeProperty(e, n[o], a[o]), i += (l && i && ",") + l;
      return this.stack.pop(), "{" + i + "}";
    }
    return "{}";
  }
  serializeObject(e) {
    return this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(e.i, this.serializeProperties(e, e.p));
  }
  serializeWithObjectAssign(e, t, r) {
    let n = this.serializeProperties(e, t);
    return n !== "{}" ? "Object.assign(" + r + "," + n + ")" : r;
  }
  serializeStringKeyAssignment(e, t, r, n) {
    let a = this.serialize(n), i = Number(r), o = i >= 0 && i.toString() === r || be$1(r);
    if (this.isIndexedValueInStack(n)) o && i !== i ? this.createObjectAssign(e.i, r, a) : this.createArrayAssign(e.i, o ? r : '"' + r + '"', a);
    else {
      let l = this.assignments;
      this.assignments = t, o && i !== i ? this.createObjectAssign(e.i, r, a) : this.createArrayAssign(e.i, o ? r : '"' + r + '"', a), this.assignments = l;
    }
  }
  serializeAssignment(e, t, r, n) {
    if (typeof r == "string") this.serializeStringKeyAssignment(e, t, r, n);
    else {
      let a = this.stack;
      this.stack = [];
      let i = this.serialize(n);
      this.stack = a;
      let o = this.assignments;
      this.assignments = t, this.createArrayAssign(e.i, this.serialize(r), i), this.assignments = o;
    }
  }
  serializeAssignments(e, t) {
    let r = t.s;
    if (r) {
      let n = [], a = t.k, i = t.v;
      this.stack.push(e.i);
      for (let o = 0; o < r; o++) this.serializeAssignment(e, n, a[o], i[o]);
      return this.stack.pop(), we$1(n);
    }
    return s;
  }
  serializeDictionary(e, t) {
    if (e.p) if (this.features & 8) t = this.serializeWithObjectAssign(e, e.p, t);
    else {
      this.markRef(e.i);
      let r = this.serializeAssignments(e, e.p);
      if (r) return "(" + this.assignIndexedValue(e.i, t) + "," + r + this.getRefParam(e.i) + ")";
    }
    return this.assignIndexedValue(e.i, t);
  }
  serializeNullConstructor(e) {
    return this.pushObjectFlag(e.o, e.i), this.serializeDictionary(e, Dr);
  }
  serializeDate(e) {
    return this.assignIndexedValue(e.i, 'new Date("' + e.s + '")');
  }
  serializeRegExp(e) {
    return this.assignIndexedValue(e.i, "/" + e.c + "/" + e.m);
  }
  serializeSetItem(e, t) {
    return this.isIndexedValueInStack(t) ? (this.markRef(e), this.createAddAssignment(e, this.getRefParam(t.i)), "") : this.serialize(t);
  }
  serializeSet(e) {
    let t = _r, r = e.l, n = e.i;
    if (r) {
      let a = e.a;
      this.stack.push(n);
      let i = this.serializeSetItem(n, a[0]);
      for (let o = 1, l = i; o < r; o++) l = this.serializeSetItem(n, a[o]), i += (l && i && ",") + l;
      this.stack.pop(), i && (t += "([" + i + "])");
    }
    return this.assignIndexedValue(n, t);
  }
  serializeMapEntry(e, t, r, n) {
    if (this.isIndexedValueInStack(t)) {
      let a = this.getRefParam(t.i);
      if (this.markRef(e), this.isIndexedValueInStack(r)) {
        let o = this.getRefParam(r.i);
        return this.createSetAssignment(e, a, o), "";
      }
      if (r.t !== 4 && r.i != null && this.isMarked(r.i)) {
        let o = "(" + this.serialize(r) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, a, this.getRefParam(r.i)), this.createDeleteAssignment(e, n), o;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, a, this.serialize(r)), this.stack = i, "";
    }
    if (this.isIndexedValueInStack(r)) {
      let a = this.getRefParam(r.i);
      if (this.markRef(e), t.t !== 4 && t.i != null && this.isMarked(t.i)) {
        let o = "(" + this.serialize(t) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, this.getRefParam(t.i), a), this.createDeleteAssignment(e, n), o;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, this.serialize(t), a), this.stack = i, "";
    }
    return "[" + this.serialize(t) + "," + this.serialize(r) + "]";
  }
  serializeMap(e) {
    let t = Mr, r = e.e.s, n = e.i, a = e.f, i = this.getRefParam(a.i);
    if (r) {
      let o = e.e.k, l = e.e.v;
      this.stack.push(n);
      let u = this.serializeMapEntry(n, o[0], l[0], i);
      for (let c = 1, d = u; c < r; c++) d = this.serializeMapEntry(n, o[c], l[c], i), u += (d && u && ",") + d;
      this.stack.pop(), u && (t += "([" + u + "])");
    }
    return a.t === 26 && (this.markRef(a.i), t = "(" + this.serialize(a) + "," + t + ")"), this.assignIndexedValue(n, t);
  }
  serializeArrayBuffer(e) {
    let t = "new Uint8Array(", r = e.s, n = r.length;
    if (n) {
      t += "[" + r[0];
      for (let a = 1; a < n; a++) t += "," + r[a];
      t += "]";
    }
    return this.assignIndexedValue(e.i, t + ").buffer");
  }
  serializeTypedArray(e) {
    return this.assignIndexedValue(e.i, "new " + e.c + "(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeDataView(e) {
    return this.assignIndexedValue(e.i, "new DataView(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeAggregateError(e) {
    let t = e.i;
    this.stack.push(t);
    let r = this.serializeDictionary(e, 'new AggregateError([],"' + e.m + '")');
    return this.stack.pop(), r;
  }
  serializeError(e) {
    return this.serializeDictionary(e, "new " + He[e.s] + '("' + e.m + '")');
  }
  serializePromise(e) {
    let t, r = e.f, n = e.i, a = e.s ? Lr : Hr;
    if (this.isIndexedValueInStack(r)) {
      let i = this.getRefParam(r.i);
      t = a + (e.s ? "().then(" + this.createFunction([], i) + ")" : "().catch(" + this.createEffectfulFunction([], "throw " + i) + ")");
    } else {
      this.stack.push(n);
      let i = this.serialize(r);
      this.stack.pop(), t = a + "(" + i + ")";
    }
    return this.assignIndexedValue(n, t);
  }
  serializeWellKnownSymbol(e) {
    return this.assignIndexedValue(e.i, Nt[e.s]);
  }
  serializeBoxed(e) {
    return this.assignIndexedValue(e.i, "Object(" + this.serialize(e.f) + ")");
  }
  serializePlugin(e) {
    let t = this.plugins;
    if (t) for (let r = 0, n = t.length; r < n; r++) {
      let a = t[r];
      if (a.tag === e.c) return this.assignIndexedValue(e.i, a.serialize(e.s, this, { id: e.i }));
    }
    throw new Ye$1(e.c);
  }
  getConstructor(e) {
    let t = this.serialize(e);
    return t === this.getRefParam(e.i) ? t : "(" + t + ")";
  }
  serializePromiseConstructor(e) {
    let t = this.assignIndexedValue(e.s, "{p:0,s:0,f:0}");
    return this.assignIndexedValue(e.i, this.getConstructor(e.f) + "(" + t + ")");
  }
  serializePromiseResolve(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializePromiseReject(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializeSpecialReference(e) {
    return this.assignIndexedValue(e.i, Pr(this.features, e.s));
  }
  serializeIteratorFactory(e) {
    let t = "", r = false;
    return e.f.t !== 4 && (this.markRef(e.f.i), t = "(" + this.serialize(e.f) + ",", r = true), t += this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["i", "c", "d", "t"], "(i=0,t={[" + this.getRefParam(e.f.i) + "]:" + this.createFunction([], "t") + ",next:" + this.createEffectfulFunction([], "if(i>s.d)return{done:!0,value:void 0};if(d=s.v[c=i++],c===s.t)throw d;return{done:c===s.d,value:d}") + "})"))), r && (t += ")"), t;
  }
  serializeIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeAsyncIteratorFactory(e) {
    let t = e.a[0], r = e.a[1], n = "";
    t.t !== 4 && (this.markRef(t.i), n += "(" + this.serialize(t)), r.t !== 4 && (this.markRef(r.i), n += (n ? "," : "(") + this.serialize(r)), n && (n += ",");
    let a = this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["b", "c", "p", "d", "e", "t", "f"], "(b=[],c=0,p=[],d=-1,e=!1,f=" + this.createEffectfulFunction(["i", "l"], "for(i=0,l=p.length;i<l;i++)p[i].s({done:!0,value:void 0})") + ",s.on({next:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!1,value:v});b.push(v)") + ",throw:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.f(v);f(),d=b.length,e=!0,b.push(v)") + ",return:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!0,value:v});f(),d=b.length,b.push(v)") + "}),t={[" + this.getRefParam(r.i) + "]:" + this.createFunction([], "t.p") + ",next:" + this.createEffectfulFunction(["i", "t", "v"], "if(d===-1){return((i=c++)>=b.length)?(" + this.getRefParam(t.i) + "(t={p:0,s:0,f:0}),p.push(t),t.p):{done:!1,value:b[i]}}if(c>d)return{done:!0,value:void 0};if(v=b[i=c++],i!==d)return{done:!1,value:v};if(e)throw v;return{done:!0,value:v}") + "})")));
    return n ? n + a + ")" : a;
  }
  serializeAsyncIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeStreamConstructor(e) {
    let t = this.assignIndexedValue(e.i, this.getConstructor(e.f) + "()"), r = e.a.length;
    if (r) {
      let n = this.serialize(e.a[0]);
      for (let a = 1; a < r; a++) n += "," + this.serialize(e.a[a]);
      return "(" + t + "," + n + "," + this.getRefParam(e.i) + ")";
    }
    return t;
  }
  serializeStreamNext(e) {
    return this.getRefParam(e.i) + ".next(" + this.serialize(e.f) + ")";
  }
  serializeStreamThrow(e) {
    return this.getRefParam(e.i) + ".throw(" + this.serialize(e.f) + ")";
  }
  serializeStreamReturn(e) {
    return this.getRefParam(e.i) + ".return(" + this.serialize(e.f) + ")";
  }
  serialize(e) {
    try {
      switch (e.t) {
        case 2:
          return _t[e.s];
        case 0:
          return "" + e.s;
        case 1:
          return '"' + e.s + '"';
        case 3:
          return e.s + "n";
        case 4:
          return this.getRefParam(e.i);
        case 18:
          return this.serializeReference(e);
        case 9:
          return this.serializeArray(e);
        case 10:
          return this.serializeObject(e);
        case 11:
          return this.serializeNullConstructor(e);
        case 5:
          return this.serializeDate(e);
        case 6:
          return this.serializeRegExp(e);
        case 7:
          return this.serializeSet(e);
        case 8:
          return this.serializeMap(e);
        case 19:
          return this.serializeArrayBuffer(e);
        case 16:
        case 15:
          return this.serializeTypedArray(e);
        case 20:
          return this.serializeDataView(e);
        case 14:
          return this.serializeAggregateError(e);
        case 13:
          return this.serializeError(e);
        case 12:
          return this.serializePromise(e);
        case 17:
          return this.serializeWellKnownSymbol(e);
        case 21:
          return this.serializeBoxed(e);
        case 22:
          return this.serializePromiseConstructor(e);
        case 23:
          return this.serializePromiseResolve(e);
        case 24:
          return this.serializePromiseReject(e);
        case 25:
          return this.serializePlugin(e);
        case 26:
          return this.serializeSpecialReference(e);
        case 27:
          return this.serializeIteratorFactory(e);
        case 28:
          return this.serializeIteratorFactoryInstance(e);
        case 29:
          return this.serializeAsyncIteratorFactory(e);
        case 30:
          return this.serializeAsyncIteratorFactoryInstance(e);
        case 31:
          return this.serializeStreamConstructor(e);
        case 32:
          return this.serializeStreamNext(e);
        case 33:
          return this.serializeStreamThrow(e);
        case 34:
          return this.serializeStreamReturn(e);
        default:
          throw new Xe$1(e);
      }
    } catch (t) {
      throw new gr$1(t);
    }
  }
}, Wr = class extends qr {
  constructor(e) {
    super(e), this.mode = "cross", this.scopeId = e.scopeId;
  }
  getRefParam(e) {
    return _ + "[" + e + "]";
  }
  assignIndexedValue(e, t) {
    return this.getRefParam(e) + "=" + t;
  }
  serializeTop(e) {
    let t = this.serialize(e), r = e.i;
    if (r == null) return t;
    let n = this.resolvePatches(), a = this.getRefParam(r), i = this.scopeId == null ? "" : _, o = n ? "(" + t + "," + n + a + ")" : t;
    if (i === "") return e.t === 10 && !n ? "(" + o + ")" : o;
    let l = this.scopeId == null ? "()" : "(" + _ + '["' + m(this.scopeId) + '"])';
    return "(" + this.createFunction([i], o) + ")" + l;
  }
}, Br = class extends $r {
  parseItems(e) {
    let t = [];
    for (let r = 0, n = e.length; r < n; r++) r in e && (t[r] = this.parse(e[r]));
    return t;
  }
  parseArray(e, t) {
    return sr$1(e, t, this.parseItems(t));
  }
  parseProperties(e) {
    let t = Object.entries(e), r = [], n = [];
    for (let i = 0, o = t.length; i < o; i++) r.push(m(t[i][0])), n.push(this.parse(t[i][1]));
    let a = Symbol.iterator;
    return a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(We$1(this.parseIteratorFactory(), this.parse(Ge$1(e))))), a = Symbol.asyncIterator, a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(Be$1(this.parseAsyncIteratorFactory(), this.parse($())))), a = Symbol.toStringTag, a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(Q(e[a]))), a = Symbol.isConcatSpreadable, a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(e[a] ? J : Z$1)), { k: r, v: n, s: r.length };
  }
  parsePlainObject(e, t, r) {
    return this.createObjectNode(e, t, r, this.parseProperties(t));
  }
  parseBoxed(e, t) {
    return nr$1(e, this.parse(t.valueOf()));
  }
  parseTypedArray(e, t) {
    return ar$1(e, t, this.parse(t.buffer));
  }
  parseBigIntTypedArray(e, t) {
    return ir$1(e, t, this.parse(t.buffer));
  }
  parseDataView(e, t) {
    return or$1(e, t, this.parse(t.buffer));
  }
  parseError(e, t) {
    let r = ge$1(t, this.features);
    return lr$1(e, t, r ? this.parseProperties(r) : s);
  }
  parseAggregateError(e, t) {
    let r = ge$1(t, this.features);
    return ur$1(e, t, r ? this.parseProperties(r) : s);
  }
  parseMap(e, t) {
    let r = [], n = [];
    for (let [a, i] of t.entries()) r.push(this.parse(a)), n.push(this.parse(i));
    return this.createMapNode(e, r, n, t.size);
  }
  parseSet(e, t) {
    let r = [];
    for (let n of t.keys()) r.push(this.parse(n));
    return cr$1(e, t.size, r);
  }
  parsePlugin(e, t) {
    let r = this.plugins;
    if (r) for (let n = 0, a = r.length; n < a; n++) {
      let i = r[n];
      if (i.parse.sync && i.test(t)) return qe(e, i.tag, i.parse.sync(t, this, { id: e }));
    }
  }
  parseStream(e, t) {
    return Ke$1(e, this.parseSpecialReference(4), []);
  }
  parsePromise(e, t) {
    return this.createPromiseConstructorNode(e, this.createIndex({}));
  }
  parseObject(e, t) {
    if (Array.isArray(t)) return this.parseArray(e, t);
    if (kr(t)) return this.parseStream(e, t);
    let r = t.constructor;
    if (r === zr) return this.parse(t.replacement);
    let n = this.parsePlugin(e, t);
    if (n) return n;
    switch (r) {
      case Object:
        return this.parsePlainObject(e, t, false);
      case void 0:
        return this.parsePlainObject(e, t, true);
      case Date:
        return Zt$1(e, t);
      case RegExp:
        return Qt$1(e, t);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return this.parseError(e, t);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return this.parseBoxed(e, t);
      case ArrayBuffer:
        return er$1(e, t);
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return this.parseTypedArray(e, t);
      case DataView:
        return this.parseDataView(e, t);
      case Map:
        return this.parseMap(e, t);
      case Set:
        return this.parseSet(e, t);
    }
    if (r === Promise || t instanceof Promise) return this.parsePromise(e, t);
    let a = this.features;
    if (a & 16) switch (r) {
      case BigInt64Array:
      case BigUint64Array:
        return this.parseBigIntTypedArray(e, t);
    }
    if (a & 1 && typeof AggregateError < "u" && (r === AggregateError || t instanceof AggregateError)) return this.parseAggregateError(e, t);
    if (t instanceof Error) return this.parseError(e, t);
    if (Symbol.iterator in t || Symbol.asyncIterator in t) return this.parsePlainObject(e, t, !!r);
    throw new M(t);
  }
  parseFunction(e) {
    let t = this.getReference(e);
    if (t.type !== 0) return t.value;
    let r = this.parsePlugin(t.value, e);
    if (r) return r;
    throw new M(e);
  }
  parse(e) {
    switch (typeof e) {
      case "boolean":
        return e ? J : Z$1;
      case "undefined":
        return Ht;
      case "string":
        return Q(e);
      case "number":
        return Yt$1(e);
      case "bigint":
        return Gt$1(e);
      case "object": {
        if (e) {
          let t = this.getReference(e);
          return t.type === 0 ? this.parseObject(t.value, e) : t.value;
        }
        return Ut$1;
      }
      case "symbol":
        return this.parseWellKnownSymbol(e);
      case "function":
        return this.parseFunction(e);
      default:
        throw new M(e);
    }
  }
  parseTop(e) {
    try {
      return this.parse(e);
    } catch (t) {
      throw t instanceof me ? t : new me(t);
    }
  }
}, Kr = class extends Br {
  constructor(e) {
    super(e), this.alive = true, this.pending = 0, this.initial = true, this.buffer = [], this.onParseCallback = e.onParse, this.onErrorCallback = e.onError, this.onDoneCallback = e.onDone;
  }
  onParseInternal(e, t) {
    try {
      this.onParseCallback(e, t);
    } catch (r) {
      this.onError(r);
    }
  }
  flush() {
    for (let e = 0, t = this.buffer.length; e < t; e++) this.onParseInternal(this.buffer[e], false);
  }
  onParse(e) {
    this.initial ? this.buffer.push(e) : this.onParseInternal(e, false);
  }
  onError(e) {
    if (this.onErrorCallback) this.onErrorCallback(e);
    else throw e;
  }
  onDone() {
    this.onDoneCallback && this.onDoneCallback();
  }
  pushPendingState() {
    this.pending++;
  }
  popPendingState() {
    --this.pending <= 0 && this.onDone();
  }
  parseProperties(e) {
    let t = Object.entries(e), r = [], n = [];
    for (let i = 0, o = t.length; i < o; i++) r.push(m(t[i][0])), n.push(this.parse(t[i][1]));
    let a = Symbol.iterator;
    return a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(We$1(this.parseIteratorFactory(), this.parse(Ge$1(e))))), a = Symbol.asyncIterator, a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(Be$1(this.parseAsyncIteratorFactory(), this.parse(Fr(e))))), a = Symbol.toStringTag, a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(Q(e[a]))), a = Symbol.isConcatSpreadable, a in e && (r.push(this.parseWellKnownSymbol(a)), n.push(e[a] ? J : Z$1)), { k: r, v: n, s: r.length };
  }
  handlePromiseSuccess(e, t) {
    let r = this.parseWithError(t);
    r && this.onParse(f(23, e, s, s, s, s, s, s, [this.parseSpecialReference(2), r], s, s, s)), this.popPendingState();
  }
  handlePromiseFailure(e, t) {
    if (this.alive) {
      let r = this.parseWithError(t);
      r && this.onParse(f(24, e, s, s, s, s, s, s, [this.parseSpecialReference(3), r], s, s, s));
    }
    this.popPendingState();
  }
  parsePromise(e, t) {
    let r = this.createIndex({});
    return t.then(this.handlePromiseSuccess.bind(this, r), this.handlePromiseFailure.bind(this, r)), this.pushPendingState(), this.createPromiseConstructorNode(e, r);
  }
  parsePlugin(e, t) {
    let r = this.plugins;
    if (r) for (let n = 0, a = r.length; n < a; n++) {
      let i = r[n];
      if (i.parse.stream && i.test(t)) return qe(e, i.tag, i.parse.stream(t, this, { id: e }));
    }
    return s;
  }
  parseStream(e, t) {
    let r = Ke$1(e, this.parseSpecialReference(4), []);
    return this.pushPendingState(), t.on({ next: (n) => {
      if (this.alive) {
        let a = this.parseWithError(n);
        a && this.onParse(hr$1(e, a));
      }
    }, throw: (n) => {
      if (this.alive) {
        let a = this.parseWithError(n);
        a && this.onParse(fr$1(e, a));
      }
      this.popPendingState();
    }, return: (n) => {
      if (this.alive) {
        let a = this.parseWithError(n);
        a && this.onParse(dr$1(e, a));
      }
      this.popPendingState();
    } }), r;
  }
  parseWithError(e) {
    try {
      return this.parse(e);
    } catch (t) {
      return this.onError(t), s;
    }
  }
  start(e) {
    let t = this.parseWithError(e);
    t && (this.onParseInternal(t, true), this.initial = false, this.flush(), this.pending <= 0 && this.destroy());
  }
  destroy() {
    this.alive && (this.onDone(), this.alive = false);
  }
  isAlive() {
    return this.alive;
  }
}, Xr = class extends Kr {
  constructor() {
    super(...arguments), this.mode = "cross";
  }
};
function Yr(e, t) {
  let r = Me$1(t.plugins), n = new Xr({ plugins: r, refs: t.refs, disabledFeatures: t.disabledFeatures, onParse(a, i) {
    let o = new Wr({ plugins: r, features: n.features, scopeId: t.scopeId, markedRefs: n.marked }), l;
    try {
      l = o.serializeTop(a);
    } catch (u) {
      t.onError && t.onError(u);
      return;
    }
    t.onSerialize(l, i);
  }, onError: t.onError, onDone: t.onDone });
  return n.start(e), n.destroy.bind(n);
}
var Gr = class extends jr {
  constructor(t) {
    super(t), this.mode = "vanilla", this.marked = new Set(t.markedRefs);
  }
  assignIndexedValue(t, r) {
    return this.marked.has(t) && this.refs.set(t, r), r;
  }
};
function ze$1(e, t = {}) {
  let r = Me$1(t.plugins);
  return new Gr({ plugins: r, markedRefs: e.m }).deserializeTop(e.t);
}
function U(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Jr = { tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent > "u" ? false : e instanceof CustomEvent;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(U(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(U(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(U(e)) };
} }, serialize(e, t) {
  return "new CustomEvent(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new CustomEvent(t.deserialize(e.type), t.deserialize(e.options));
} }, te = Jr, Zr = { tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException > "u" ? false : e instanceof DOMException;
}, parse: { sync(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
}, async async(e, t) {
  return { name: await t.parse(e.name), message: await t.parse(e.message) };
}, stream(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
} }, serialize(e, t) {
  return "new DOMException(" + t.serialize(e.message) + "," + t.serialize(e.name) + ")";
}, deserialize(e, t) {
  return new DOMException(t.deserialize(e.message), t.deserialize(e.name));
} }, re$1 = Zr;
function q(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Qr = { tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event > "u" ? false : e instanceof Event;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(q(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(q(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(q(e)) };
} }, serialize(e, t) {
  return "new Event(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Event(t.deserialize(e.type), t.deserialize(e.options));
} }, se$1 = Qr, es = { tag: "seroval-plugins/web/File", test(e) {
  return typeof File > "u" ? false : e instanceof File;
}, parse: { async async(e, t) {
  return { name: await t.parse(e.name), options: await t.parse({ type: e.type, lastModified: e.lastModified }), buffer: await t.parse(await e.arrayBuffer()) };
} }, serialize(e, t) {
  return "new File([" + t.serialize(e.buffer) + "]," + t.serialize(e.name) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new File([t.deserialize(e.buffer)], t.deserialize(e.name), t.deserialize(e.options));
} }, ts = es;
function W$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var k = {}, rs = { tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === k;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, t) {
  return t.createEffectfulFunction(["e", "f", "i", "s", "t"], "f=new FormData;for(i=0,s=e.length;i<s;i++)f.append((t=e[i])[0],t[1]);return f");
}, deserialize() {
  return k;
} }, ss = { tag: "seroval-plugins/web/FormData", extends: [ts, rs], test(e) {
  return typeof FormData > "u" ? false : e instanceof FormData;
}, parse: { sync(e, t) {
  return { factory: t.parse(k), entries: t.parse(W$1(e)) };
}, async async(e, t) {
  return { factory: await t.parse(k), entries: await t.parse(W$1(e)) };
}, stream(e, t) {
  return { factory: t.parse(k), entries: t.parse(W$1(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.entries) + ")";
}, deserialize(e, t) {
  let r = new FormData(), n = t.deserialize(e.entries);
  for (let a = 0, i = n.length; a < i; a++) {
    let o = n[a];
    r.append(o[0], o[1]);
  }
  return r;
} }, ne$1 = ss;
function B(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var ns = { tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers > "u" ? false : e instanceof Headers;
}, parse: { sync(e, t) {
  return t.parse(B(e));
}, async async(e, t) {
  return await t.parse(B(e));
}, stream(e, t) {
  return t.parse(B(e));
} }, serialize(e, t) {
  return "new Headers(" + t.serialize(e) + ")";
}, deserialize(e, t) {
  return new Headers(t.deserialize(e));
} }, C = ns, F$1 = {}, as = { tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === F$1;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, t) {
  return t.createFunction(["d"], "new ReadableStream({start:" + t.createEffectfulFunction(["c"], "d.on({next:" + t.createEffectfulFunction(["v"], "c.enqueue(v)") + ",throw:" + t.createEffectfulFunction(["v"], "c.error(v)") + ",return:" + t.createEffectfulFunction([], "c.close()") + "})") + "})");
}, deserialize() {
  return F$1;
} };
function ve$1(e) {
  let t = $(), r = e.getReader();
  async function n() {
    try {
      let a = await r.read();
      a.done ? t.return(a.value) : (t.next(a.value), await n());
    } catch (a) {
      t.throw(a);
    }
  }
  return n().catch(() => {
  }), t;
}
var is = { tag: "seroval/plugins/web/ReadableStream", extends: [as], test(e) {
  return typeof ReadableStream > "u" ? false : e instanceof ReadableStream;
}, parse: { sync(e, t) {
  return { factory: t.parse(F$1), stream: t.parse($()) };
}, async async(e, t) {
  return { factory: await t.parse(F$1), stream: await t.parse(ve$1(e)) };
}, stream(e, t) {
  return { factory: t.parse(F$1), stream: t.parse(ve$1(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.stream) + ")";
}, deserialize(e, t) {
  let r = t.deserialize(e.stream);
  return new ReadableStream({ start(n) {
    r.on({ next(a) {
      n.enqueue(a);
    }, throw(a) {
      n.error(a);
    }, return() {
      n.close();
    } });
  } });
} }, T = is;
function Se$1(e, t) {
  return { body: t, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var os = { tag: "seroval-plugins/web/Request", extends: [T, C], test(e) {
  return typeof Request > "u" ? false : e instanceof Request;
}, parse: { async async(e, t) {
  return { url: await t.parse(e.url), options: await t.parse(Se$1(e, e.body ? await e.clone().arrayBuffer() : null)) };
}, stream(e, t) {
  return { url: t.parse(e.url), options: t.parse(Se$1(e, e.clone().body)) };
} }, serialize(e, t) {
  return "new Request(" + t.serialize(e.url) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Request(t.deserialize(e.url), t.deserialize(e.options));
} }, ae$1 = os;
function Re$1(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var ls = { tag: "seroval-plugins/web/Response", extends: [T, C], test(e) {
  return typeof Response > "u" ? false : e instanceof Response;
}, parse: { async async(e, t) {
  return { body: await t.parse(e.body ? await e.clone().arrayBuffer() : null), options: await t.parse(Re$1(e)) };
}, stream(e, t) {
  return { body: t.parse(e.clone().body), options: t.parse(Re$1(e)) };
} }, serialize(e, t) {
  return "new Response(" + t.serialize(e.body) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Response(t.deserialize(e.body), t.deserialize(e.options));
} }, ie$1 = ls, us = { tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL > "u" ? false : e instanceof URL;
}, parse: { sync(e, t) {
  return t.parse(e.href);
}, async async(e, t) {
  return await t.parse(e.href);
}, stream(e, t) {
  return t.parse(e.href);
} }, serialize(e, t) {
  return "new URL(" + t.serialize(e) + ")";
}, deserialize(e, t) {
  return new URL(t.deserialize(e));
} }, oe$1 = us, cs = { tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams > "u" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, t) {
  return t.parse(e.toString());
}, async async(e, t) {
  return await t.parse(e.toString());
}, stream(e, t) {
  return t.parse(e.toString());
} }, serialize(e, t) {
  return "new URLSearchParams(" + t.serialize(e) + ")";
}, deserialize(e, t) {
  return new URLSearchParams(t.deserialize(e));
} }, le = cs;
function hs(e = {}) {
  let t, r = false;
  const n = (o) => {
    if (t && t !== o) throw new Error("Context conflict");
  };
  let a;
  if (e.asyncContext) {
    const o = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    o ? a = new o() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const i = () => {
    if (a) {
      const o = a.getStore();
      if (o !== void 0) return o;
    }
    return t;
  };
  return { use: () => {
    const o = i();
    if (o === void 0) throw new Error("Context is not available");
    return o;
  }, tryUse: () => i(), set: (o, l) => {
    l || n(o), t = o, r = true;
  }, unset: () => {
    t = void 0, r = false;
  }, call: (o, l) => {
    n(o), t = o;
    try {
      return a ? a.run(o, l) : l();
    } finally {
      r || (t = void 0);
    }
  }, async callAsync(o, l) {
    t = o;
    const u = () => {
      t = o;
    }, c = () => t === o ? u : void 0;
    Ae$1.add(c);
    try {
      const d = a ? a.run(o, l) : l();
      return r || (t = void 0), await d;
    } finally {
      Ae$1.delete(c);
    }
  } };
}
function fs(e = {}) {
  const t = {};
  return { get(r, n = {}) {
    return t[r] || (t[r] = hs({ ...e, ...n })), t[r];
  } };
}
const L = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, xe$1 = "__unctx__", ds = L[xe$1] || (L[xe$1] = fs()), ps = (e, t = {}) => ds.get(e, t), Ie$1 = "__unctx_async_handlers__", Ae$1 = L[Ie$1] || (L[Ie$1] = /* @__PURE__ */ new Set());
function gs(e) {
  let t;
  const r = Ze$1(e), n = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(r, { ...n, body: e.node.req.body }) : new Request(r, { ...n, get body() {
    return t || (t = Is(e), t);
  } });
}
function ms(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: gs(e), url: Ze$1(e) }, e.web.request;
}
function ys() {
  return ks();
}
const Je$1 = Symbol("$HTTPEvent");
function bs(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[Je$1]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function p(e) {
  return function(...t) {
    var _a;
    let r = t[0];
    if (bs(r)) t[0] = r instanceof H3Event || r.__is_event__ ? r : r[Je$1];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = ys(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(r);
    }
    return e(...t);
  };
}
const Ze$1 = p(getRequestURL), ws = p(getRequestIP), H = p(setResponseStatus), Ee$1 = p(getResponseStatus), zs = p(getResponseStatusText), N$1 = p(getResponseHeaders), Pe = p(getResponseHeader), vs = p(setResponseHeader), Qe$1 = p(appendResponseHeader), Ss = p(parseCookies), Rs = p(getCookie), xs = p(setCookie), D$1 = p(setHeader), Is = p(getRequestWebStream), As = p(removeResponseHeader), Es = p(ms);
function Ps() {
  var _a;
  return ps("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function ks() {
  return Ps().use().event;
}
const K = "Invariant Violation", { setPrototypeOf: Fs = function(e, t) {
  return e.__proto__ = t, e;
} } = Object;
class fe extends Error {
  constructor(t = K) {
    super(typeof t == "number" ? `${K}: ${t} (see https://github.com/apollographql/invariant-packages)` : t);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", K);
    Fs(this, fe.prototype);
  }
}
function Cs(e, t) {
  if (!e) throw new fe(t);
}
const X$1 = "solidFetchEvent";
function Ts(e) {
  return { request: Es(e), response: Vs(e), clientAddress: ws(e), locals: {}, nativeEvent: e };
}
function $s(e) {
  return { ...e };
}
function Os(e) {
  if (!e.context[X$1]) {
    const t = Ts(e);
    e.context[X$1] = t;
  }
  return e.context[X$1];
}
function ke(e, t) {
  for (const [r, n] of t.entries()) Qe$1(e, r, n);
}
class js {
  constructor(t) {
    __publicField$1(this, "event");
    this.event = t;
  }
  get(t) {
    const r = Pe(this.event, t);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(t) {
    return this.get(t) !== void 0;
  }
  set(t, r) {
    return vs(this.event, t, r);
  }
  delete(t) {
    return As(this.event, t);
  }
  append(t, r) {
    Qe$1(this.event, t, r);
  }
  getSetCookie() {
    const t = Pe(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(N$1(this.event)).forEach(([r, n]) => t(Array.isArray(n) ? n.join(", ") : n, r, this));
  }
  entries() {
    return Object.entries(N$1(this.event)).map(([t, r]) => [t, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(N$1(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(N$1(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function Vs(e) {
  return { get status() {
    return Ee$1(e);
  }, set status(t) {
    H(e, t);
  }, get statusText() {
    return zs(e);
  }, set statusText(t) {
    H(e, Ee$1(e), t);
  }, headers: new js(e) };
}
const x = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function Ns(e = {}) {
  const t = { options: e, rootNode: et$1(), staticRoutesMap: {} }, r = (n) => e.strictTrailingSlash ? n : n.replace(/\/$/, "") || "/";
  if (e.routes) for (const n in e.routes) Fe$1(t, r(n), e.routes[n]);
  return { ctx: t, lookup: (n) => Ds(t, r(n)), insert: (n, a) => Fe$1(t, r(n), a), remove: (n) => _s(t, r(n)) };
}
function Ds(e, t) {
  const r = e.staticRoutesMap[t];
  if (r) return r.data;
  const n = t.split("/"), a = {};
  let i = false, o = null, l = e.rootNode, u = null;
  for (let c = 0; c < n.length; c++) {
    const d = n[c];
    l.wildcardChildNode !== null && (o = l.wildcardChildNode, u = n.slice(c).join("/"));
    const S = l.children.get(d);
    if (S === void 0) {
      if (l && l.placeholderChildren.length > 1) {
        const b = n.length - c;
        l = l.placeholderChildren.find((h) => h.maxDepth === b) || null;
      } else l = l.placeholderChildren[0] || null;
      if (!l) break;
      l.paramName && (a[l.paramName] = d), i = true;
    } else l = S;
  }
  return (l === null || l.data === null) && o !== null && (l = o, a[l.paramName || "_"] = u, i = true), l ? i ? { ...l.data, params: i ? a : void 0 } : l.data : null;
}
function Fe$1(e, t, r) {
  let n = true;
  const a = t.split("/");
  let i = e.rootNode, o = 0;
  const l = [i];
  for (const u of a) {
    let c;
    if (c = i.children.get(u)) i = c;
    else {
      const d = Ms(u);
      c = et$1({ type: d, parent: i }), i.children.set(u, c), d === x.PLACEHOLDER ? (c.paramName = u === "*" ? `_${o++}` : u.slice(1), i.placeholderChildren.push(c), n = false) : d === x.WILDCARD && (i.wildcardChildNode = c, c.paramName = u.slice(3) || "_", n = false), l.push(c), i = c;
    }
  }
  for (const [u, c] of l.entries()) c.maxDepth = Math.max(l.length - u, c.maxDepth || 0);
  return i.data = r, n === true && (e.staticRoutesMap[t] = i), i;
}
function _s(e, t) {
  let r = false;
  const n = t.split("/");
  let a = e.rootNode;
  for (const i of n) if (a = a.children.get(i), !a) return r;
  if (a.data) {
    const i = n.at(-1) || "";
    a.data = null, Object.keys(a.children).length === 0 && a.parent && (a.parent.children.delete(i), a.parent.wildcardChildNode = null, a.parent.placeholderChildren = []), r = true;
  }
  return r;
}
function et$1(e = {}) {
  return { type: e.type || x.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function Ms(e) {
  return e.startsWith("**") ? x.WILDCARD : e[0] === ":" || e === "*" ? x.PLACEHOLDER : x.NORMAL;
}
const tt = [{ page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index.mjs'), import: () => import('../build/index.mjs') }, path: "/", filePath: "/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest/src/routes/index.tsx" }], Ls = Hs(tt.filter((e) => e.page));
function Hs(e) {
  function t(r, n, a, i) {
    const o = Object.values(r).find((l) => a.startsWith(l.id + "/"));
    return o ? (t(o.children || (o.children = []), n, a.slice(o.id.length)), r) : (r.push({ ...n, id: a, path: a.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, n) => r.path.length - n.path.length).reduce((r, n) => t(r, n, n.path, n.path), []);
}
function Us(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
Ns({ routes: tt.reduce((e, t) => {
  if (!Us(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (n, a) => `**:${a}`).split("/").map((n) => n.startsWith(":") || n.startsWith("*") ? n : encodeURIComponent(n)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) });
var Ws = " ";
const Bs = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(Ws), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function Ks(e, t) {
  let { tag: r, attrs: { key: n, ...a } = { key: void 0 }, children: i } = e;
  return Bs[r]({ attrs: { ...a, nonce: t }, key: n, children: i });
}
function Xs(e, t, r, n = "default") {
  return lazy(async () => {
    var _a;
    {
      const i = (await e.import())[n], l = (await ((_a = t.inputs) == null ? void 0 : _a[e.src].assets())).filter((c) => c.tag === "style" || c.attrs.rel === "stylesheet");
      return { default: (c) => [...l.map((d) => Ks(d)), createComponent(i, c)] };
    }
  });
}
function rt() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && Xs(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return Ls.map(e);
}
let Ce$1;
const wn$1 = isServer ? () => getRequestEvent().routes : () => Ce$1 || (Ce$1 = rt());
function Ys(e) {
  const t = Rs(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const n = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], a = r.error ? new Error(r.result) : r.result;
    return { input: n, url: r.url, pending: false, result: r.thrown ? void 0 : a, error: r.thrown ? a : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    xs(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Gs(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: Ys(e) }, routes: rt(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Js = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function Zs(e) {
  return e.status && Js.has(e.status) ? e.status : 302;
}
const Qs = {};
function en$1(e) {
  const t = new TextEncoder().encode(e), r = t.length, n = r.toString(16), a = "00000000".substring(0, 8 - n.length) + n, i = new TextEncoder().encode(`;0x${a};`), o = new Uint8Array(12 + r);
  return o.set(i), o.set(t, 12), o;
}
function Te(e, t) {
  return new ReadableStream({ start(r) {
    Yr(t, { scopeId: e, plugins: [te, re$1, se$1, ne$1, C, T, ae$1, ie$1, le, oe$1], onSerialize(n, a) {
      r.enqueue(en$1(a ? `(${$t(e)},${n})` : n));
    }, onDone() {
      r.close();
    }, onError(n) {
      r.error(n);
    } });
  } });
}
async function tn$1(e) {
  const t = Os(e), r = t.request, n = r.headers.get("X-Server-Id"), a = r.headers.get("X-Server-Instance"), i = r.headers.has("X-Single-Flight"), o = new URL(r.url);
  let l, u;
  if (n) Cs(typeof n == "string", "Invalid server function"), [l, u] = n.split("#");
  else if (l = o.searchParams.get("id"), u = o.searchParams.get("name"), !l || !u) return new Response(null, { status: 404 });
  const c = Qs[l];
  let d;
  if (!c) return new Response(null, { status: 404 });
  d = await c.importer();
  const S = d[c.functionName];
  let b = [];
  if (!a || e.method === "GET") {
    const h = o.searchParams.get("args");
    if (h) {
      const g = JSON.parse(h);
      (g.t ? ze$1(g, { plugins: [te, re$1, se$1, ne$1, C, T, ae$1, ie$1, le, oe$1] }) : g).forEach((O) => b.push(O));
    }
  }
  if (e.method === "POST") {
    const h = r.headers.get("content-type"), g = e.node.req, O = g instanceof ReadableStream, st = g.body instanceof ReadableStream, de = O && g.locked || st && g.body.locked, pe = O ? g : g.body;
    if ((h == null ? void 0 : h.startsWith("multipart/form-data")) || (h == null ? void 0 : h.startsWith("application/x-www-form-urlencoded"))) b.push(await (de ? r : new Request(r, { ...r, body: pe })).formData());
    else if (h == null ? void 0 : h.startsWith("application/json")) {
      const nt = de ? r : new Request(r, { ...r, body: pe });
      b = ze$1(await nt.json(), { plugins: [te, re$1, se$1, ne$1, C, T, ae$1, ie$1, le, oe$1] });
    }
  }
  try {
    let h = await provideRequestEvent(t, async () => (sharedConfig.context = { event: t }, t.locals.serverFunctionMeta = { id: l + "#" + u }, S(...b)));
    if (i && a && (h = await Oe(t, h)), h instanceof Response) {
      if (h.headers && h.headers.has("X-Content-Raw")) return h;
      a && (h.headers && ke(e, h.headers), h.status && (h.status < 300 || h.status >= 400) && H(e, h.status), h.customBody ? h = await h.customBody() : h.body == null && (h = null));
    }
    return a ? (D$1(e, "content-type", "text/javascript"), Te(a, h)) : $e$1(h, r, b);
  } catch (h) {
    if (h instanceof Response) i && a && (h = await Oe(t, h)), h.headers && ke(e, h.headers), h.status && (!a || h.status < 300 || h.status >= 400) && H(e, h.status), h.customBody ? h = h.customBody() : h.body == null && (h = null), D$1(e, "X-Error", "true");
    else if (a) {
      const g = h instanceof Error ? h.message : typeof h == "string" ? h : "true";
      D$1(e, "X-Error", g.replace(/[\r\n]+/g, ""));
    } else h = $e$1(h, r, b, true);
    return a ? (D$1(e, "content-type", "text/javascript"), Te(a, h)) : h;
  }
}
function $e$1(e, t, r, n) {
  const a = new URL(t.url), i = e instanceof Error;
  let o = 302, l;
  return e instanceof Response ? (l = new Headers(e.headers), e.headers.has("Location") && (l.set("Location", new URL(e.headers.get("Location"), a.origin + "").toString()), o = Zs(e))) : l = new Headers({ Location: new URL(t.headers.get("referer")).toString() }), e && l.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: a.pathname + a.search, result: i ? e.message : e, thrown: n, error: i, input: [...r.slice(0, -1), [...r[r.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: o, headers: l });
}
let Y$1;
function rn$1(e) {
  var _a;
  const t = new Headers(e.request.headers), r = Ss(e.nativeEvent), n = e.response.headers.getSetCookie();
  t.delete("cookie");
  let a = false;
  return ((_a = e.nativeEvent.node) == null ? void 0 : _a.req) && (a = true, e.nativeEvent.node.req.headers.cookie = ""), n.forEach((i) => {
    if (!i) return;
    const o = i.split(";")[0], [l, u] = o.split("=");
    l && u && (r[l] = u);
  }), Object.entries(r).forEach(([i, o]) => {
    t.append("cookie", `${i}=${o}`), a && (e.nativeEvent.node.req.headers.cookie += `${i}=${o};`);
  }), t;
}
async function Oe(e, t) {
  let r, n = new URL(e.request.headers.get("referer")).toString();
  t instanceof Response && (t.headers.has("X-Revalidate") && (r = t.headers.get("X-Revalidate").split(",")), t.headers.has("Location") && (n = new URL(t.headers.get("Location"), new URL(e.request.url).origin + "").toString()));
  const a = $s(e);
  return a.request = new Request(n, { headers: rn$1(e) }), await provideRequestEvent(a, async () => {
    await Gs(a), Y$1 || (Y$1 = (await import('../build/app-DgtWNHGm.mjs')).default), a.router.dataOnly = r || true, a.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = a, Y$1();
      });
    } catch (l) {
      console.log(l);
    }
    const i = a.router.data;
    if (!i) return t;
    let o = false;
    for (const l in i) i[l] === void 0 ? delete i[l] : o = true;
    return o && (t instanceof Response ? t.customBody && (i._$value = t.customBody()) : (i._$value = t, t = new Response(null, { status: 200 })), t.customBody = () => i, t.headers.set("X-Single-Flight", "true")), t;
  });
}
const zn$1 = eventHandler(tn$1);

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function Ut(e = {}) {
  let t, n = false;
  const r = (a) => {
    if (t && t !== a) throw new Error("Context conflict");
  };
  let o;
  if (e.asyncContext) {
    const a = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    a ? o = new a() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const s = () => {
    if (o) {
      const a = o.getStore();
      if (a !== void 0) return a;
    }
    return t;
  };
  return { use: () => {
    const a = s();
    if (a === void 0) throw new Error("Context is not available");
    return a;
  }, tryUse: () => s(), set: (a, i) => {
    i || r(a), t = a, n = true;
  }, unset: () => {
    t = void 0, n = false;
  }, call: (a, i) => {
    r(a), t = a;
    try {
      return o ? o.run(a, i) : i();
    } finally {
      n || (t = void 0);
    }
  }, async callAsync(a, i) {
    t = a;
    const l = () => {
      t = a;
    }, c = () => t === a ? l : void 0;
    we.add(c);
    try {
      const u = o ? o.run(a, i) : i();
      return n || (t = void 0), await u;
    } finally {
      we.delete(c);
    }
  } };
}
function Dt(e = {}) {
  const t = {};
  return { get(n, r = {}) {
    return t[n] || (t[n] = Ut({ ...e, ...r })), t[n];
  } };
}
const Y = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, ge = "__unctx__", Wt = Y[ge] || (Y[ge] = Dt()), Bt = (e, t = {}) => Wt.get(e, t), ye = "__unctx_async_handlers__", we = Y[ye] || (Y[ye] = /* @__PURE__ */ new Set());
function Kt(e) {
  let t;
  const n = Me(e), r = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(n, { ...r, body: e.node.req.body }) : new Request(n, { ...r, get body() {
    return t || (t = nn(e), t);
  } });
}
function zt(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: Kt(e), url: Me(e) }, e.web.request;
}
function Jt() {
  return an();
}
const Ie = Symbol("$HTTPEvent");
function Gt(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[Ie]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function S(e) {
  return function(...t) {
    var _a;
    let n = t[0];
    if (Gt(n)) t[0] = n instanceof H3Event || n.__is_event__ ? n : n[Ie];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (n = Jt(), !n) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(n);
    }
    return e(...t);
  };
}
const Me = S(getRequestURL), Vt = S(getRequestIP), ne = S(setResponseStatus), ve = S(getResponseStatus), Yt = S(getResponseStatusText), G = S(getResponseHeaders), Re = S(getResponseHeader), Xt = S(setResponseHeader), Qt = S(appendResponseHeader), be = S(sendRedirect), Zt = S(getCookie), en = S(setCookie), tn = S(setHeader), nn = S(getRequestWebStream), rn = S(removeResponseHeader), on = S(zt);
function sn() {
  var _a;
  return Bt("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function an() {
  return sn().use().event;
}
const F = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function cn(e = {}) {
  const t = { options: e, rootNode: Fe(), staticRoutesMap: {} }, n = (r) => e.strictTrailingSlash ? r : r.replace(/\/$/, "") || "/";
  if (e.routes) for (const r in e.routes) Se(t, n(r), e.routes[r]);
  return { ctx: t, lookup: (r) => ln(t, n(r)), insert: (r, o) => Se(t, n(r), o), remove: (r) => un(t, n(r)) };
}
function ln(e, t) {
  const n = e.staticRoutesMap[t];
  if (n) return n.data;
  const r = t.split("/"), o = {};
  let s = false, a = null, i = e.rootNode, l = null;
  for (let c = 0; c < r.length; c++) {
    const u = r[c];
    i.wildcardChildNode !== null && (a = i.wildcardChildNode, l = r.slice(c).join("/"));
    const g = i.children.get(u);
    if (g === void 0) {
      if (i && i.placeholderChildren.length > 1) {
        const m = r.length - c;
        i = i.placeholderChildren.find((f) => f.maxDepth === m) || null;
      } else i = i.placeholderChildren[0] || null;
      if (!i) break;
      i.paramName && (o[i.paramName] = u), s = true;
    } else i = g;
  }
  return (i === null || i.data === null) && a !== null && (i = a, o[i.paramName || "_"] = l, s = true), i ? s ? { ...i.data, params: s ? o : void 0 } : i.data : null;
}
function Se(e, t, n) {
  let r = true;
  const o = t.split("/");
  let s = e.rootNode, a = 0;
  const i = [s];
  for (const l of o) {
    let c;
    if (c = s.children.get(l)) s = c;
    else {
      const u = dn(l);
      c = Fe({ type: u, parent: s }), s.children.set(l, c), u === F.PLACEHOLDER ? (c.paramName = l === "*" ? `_${a++}` : l.slice(1), s.placeholderChildren.push(c), r = false) : u === F.WILDCARD && (s.wildcardChildNode = c, c.paramName = l.slice(3) || "_", r = false), i.push(c), s = c;
    }
  }
  for (const [l, c] of i.entries()) c.maxDepth = Math.max(i.length - l, c.maxDepth || 0);
  return s.data = n, r === true && (e.staticRoutesMap[t] = s), s;
}
function un(e, t) {
  let n = false;
  const r = t.split("/");
  let o = e.rootNode;
  for (const s of r) if (o = o.children.get(s), !o) return n;
  if (o.data) {
    const s = r.at(-1) || "";
    o.data = null, Object.keys(o.children).length === 0 && o.parent && (o.parent.children.delete(s), o.parent.wildcardChildNode = null, o.parent.placeholderChildren = []), n = true;
  }
  return n;
}
function Fe(e = {}) {
  return { type: e.type || F.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function dn(e) {
  return e.startsWith("**") ? F.WILDCARD : e[0] === ":" || e === "*" ? F.PLACEHOLDER : F.NORMAL;
}
const je = [{ page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index2.mjs'), import: () => import('../build/index2.mjs') }, path: "/", filePath: "/Users/atila.fassina/Developer/atila/solid/start/examples/with-vitest/src/routes/index.tsx" }], fn = hn(je.filter((e) => e.page));
function hn(e) {
  function t(n, r, o, s) {
    const a = Object.values(n).find((i) => o.startsWith(i.id + "/"));
    return a ? (t(a.children || (a.children = []), r, o.slice(a.id.length)), n) : (n.push({ ...r, id: o, path: o.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), n);
  }
  return e.sort((n, r) => n.path.length - r.path.length).reduce((n, r) => t(n, r, r.path, r.path), []);
}
function pn(e, t) {
  const n = gn.lookup(e);
  if (n && n.route) {
    const r = t === "HEAD" ? n.route.$HEAD || n.route.$GET : n.route[`$${t}`];
    return r === void 0 ? void 0 : { handler: r, params: n.params };
  }
}
function mn(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
const gn = cn({ routes: je.reduce((e, t) => {
  if (!mn(t)) return e;
  let n = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (r, o) => `**:${o}`).split("/").map((r) => r.startsWith(":") || r.startsWith("*") ? r : encodeURIComponent(r)).join("/");
  if (/:[^/]*\?/g.test(n)) throw new Error(`Optional parameters are not supported in API routes: ${n}`);
  if (e[n]) throw new Error(`Duplicate API routes for "${n}" found at "${e[n].route.path}" and "${t.path}"`);
  return e[n] = { route: t }, e;
}, {}) }), Z = "solidFetchEvent";
function yn(e) {
  return { request: on(e), response: Rn(e), clientAddress: Vt(e), locals: {}, nativeEvent: e };
}
function wn(e) {
  if (!e.context[Z]) {
    const t = yn(e);
    e.context[Z] = t;
  }
  return e.context[Z];
}
class vn {
  constructor(t) {
    __publicField(this, "event");
    this.event = t;
  }
  get(t) {
    const n = Re(this.event, t);
    return Array.isArray(n) ? n.join(", ") : n || null;
  }
  has(t) {
    return this.get(t) !== void 0;
  }
  set(t, n) {
    return Xt(this.event, t, n);
  }
  delete(t) {
    return rn(this.event, t);
  }
  append(t, n) {
    Qt(this.event, t, n);
  }
  getSetCookie() {
    const t = Re(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(G(this.event)).forEach(([n, r]) => t(Array.isArray(r) ? r.join(", ") : r, n, this));
  }
  entries() {
    return Object.entries(G(this.event)).map(([t, n]) => [t, Array.isArray(n) ? n.join(", ") : n])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(G(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(G(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function Rn(e) {
  return { get status() {
    return ve(e);
  }, set status(t) {
    ne(e, t);
  }, get statusText() {
    return Yt(e);
  }, set statusText(t) {
    ne(e, ve(e), t);
  }, headers: new vn(e) };
}
var Sn = " ";
const En = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(Sn), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function re(e, t) {
  let { tag: n, attrs: { key: r, ...o } = { key: void 0 }, children: s } = e;
  return En[n]({ attrs: { ...o, nonce: t }, key: r, children: s });
}
function An(e, t, n, r = "default") {
  return lazy(async () => {
    var _a;
    {
      const s = (await e.import())[r], i = (await ((_a = t.inputs) == null ? void 0 : _a[e.src].assets())).filter((c) => c.tag === "style" || c.attrs.rel === "stylesheet");
      return { default: (c) => [...i.map((u) => re(u)), createComponent(s, c)] };
    }
  });
}
function Ue() {
  function e(n) {
    return { ...n, ...n.$$route ? n.$$route.require().route : void 0, info: { ...n.$$route ? n.$$route.require().route.info : {}, filesystem: true }, component: n.$component && An(n.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: n.children ? n.children.map(e) : void 0 };
  }
  return fn.map(e);
}
let Ee;
const Cn = isServer ? () => getRequestEvent().routes : () => Ee || (Ee = Ue());
function $n(e) {
  const t = Zt(e.nativeEvent, "flash");
  if (t) try {
    let n = JSON.parse(t);
    if (!n || !n.result) return;
    const r = [...n.input.slice(0, -1), new Map(n.input[n.input.length - 1])], o = n.error ? new Error(n.result) : n.result;
    return { input: r, url: n.url, pending: false, result: n.thrown ? void 0 : o, error: n.thrown ? o : void 0 };
  } catch (n) {
    console.error(n);
  } finally {
    en(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function xn(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: $n(e) }, routes: Ue(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Tn = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function oe(e) {
  return e.status && Tn.has(e.status) ? e.status : 302;
}
function Pn(e, t, n = {}, r) {
  return eventHandler({ handler: (o) => {
    const s = wn(o);
    return provideRequestEvent(s, async () => {
      const a = pn(new URL(s.request.url).pathname, s.request.method);
      if (a) {
        const f = await a.handler.import(), v = s.request.method === "HEAD" ? f.HEAD || f.GET : f[s.request.method];
        s.params = a.params || {}, sharedConfig.context = { event: s };
        const d = await v(s);
        if (d !== void 0) return d;
        if (s.request.method !== "GET") throw new Error(`API handler for ${s.request.method} "${s.request.url}" did not return a response.`);
      }
      const i = await t(s), l = typeof n == "function" ? await n(i) : { ...n }, c = l.mode || "stream";
      if (l.nonce && (i.nonce = l.nonce), c === "sync") {
        const f = renderToString(() => (sharedConfig.context.event = i, e(i)), l);
        if (i.complete = true, i.response && i.response.headers.get("Location")) {
          const v = oe(i.response);
          return be(o, i.response.headers.get("Location"), v);
        }
        return f;
      }
      if (l.onCompleteAll) {
        const f = l.onCompleteAll;
        l.onCompleteAll = (v) => {
          Ce(i)(v), f(v);
        };
      } else l.onCompleteAll = Ce(i);
      if (l.onCompleteShell) {
        const f = l.onCompleteShell;
        l.onCompleteShell = (v) => {
          Ae(i, o)(), f(v);
        };
      } else l.onCompleteShell = Ae(i, o);
      const u = renderToStream(() => (sharedConfig.context.event = i, e(i)), l);
      if (i.response && i.response.headers.get("Location")) {
        const f = oe(i.response);
        return be(o, i.response.headers.get("Location"), f);
      }
      if (c === "async") return u;
      const { writable: g, readable: m } = new TransformStream();
      return u.pipeTo(g), m;
    });
  } });
}
function Ae(e, t) {
  return () => {
    if (e.response && e.response.headers.get("Location")) {
      const n = oe(e.response);
      ne(t, n), tn(t, "Location", e.response.headers.get("Location"));
    }
  };
}
function Ce(e) {
  return ({ write: t }) => {
    e.complete = true;
    const n = e.response && e.response.headers.get("Location");
    n && t(`<script>window.location="${n}"<\/script>`);
  };
}
function Ln(e, t, n) {
  return Pn(e, xn, t);
}
const De = createContext$1(), We = ["title", "meta"], se = [], ae = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), X = (e, t) => {
  const n = Object.fromEntries(Object.entries(e.props).filter(([r]) => t.includes(r)).sort());
  return (Object.hasOwn(n, "name") || Object.hasOwn(n, "property")) && (n.name = n.name || n.property, delete n.property), e.tag + JSON.stringify(n);
};
function Nn() {
  if (!sharedConfig.context) {
    const n = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(n, (r) => r.parentNode.removeChild(r));
  }
  const e = /* @__PURE__ */ new Map();
  function t(n) {
    if (n.ref) return n.ref;
    let r = document.querySelector(`[data-sm="${n.id}"]`);
    return r ? (r.tagName.toLowerCase() !== n.tag && (r.parentNode && r.parentNode.removeChild(r), r = document.createElement(n.tag)), r.removeAttribute("data-sm")) : r = document.createElement(n.tag), r;
  }
  return { addTag(n) {
    if (We.indexOf(n.tag) !== -1) {
      const s = n.tag === "title" ? se : ae, a = X(n, s);
      e.has(a) || e.set(a, []);
      let i = e.get(a), l = i.length;
      i = [...i, n], e.set(a, i);
      let c = t(n);
      n.ref = c, spread(c, n.props);
      let u = null;
      for (var r = l - 1; r >= 0; r--) if (i[r] != null) {
        u = i[r];
        break;
      }
      return c.parentNode != document.head && document.head.appendChild(c), u && u.ref && u.ref.parentNode && document.head.removeChild(u.ref), l;
    }
    let o = t(n);
    return n.ref = o, spread(o, n.props), o.parentNode != document.head && document.head.appendChild(o), -1;
  }, removeTag(n, r) {
    const o = n.tag === "title" ? se : ae, s = X(n, o);
    if (n.ref) {
      const a = e.get(s);
      if (a) {
        if (n.ref.parentNode) {
          n.ref.parentNode.removeChild(n.ref);
          for (let i = r - 1; i >= 0; i--) a[i] != null && document.head.appendChild(a[i].ref);
        }
        a[r] = null, e.set(s, a);
      } else n.ref.parentNode && n.ref.parentNode.removeChild(n.ref);
    }
  } };
}
function On() {
  const e = [];
  return useAssets(() => ssr(kn(e))), { addTag(t) {
    if (We.indexOf(t.tag) !== -1) {
      const n = t.tag === "title" ? se : ae, r = X(t, n), o = e.findIndex((s) => s.tag === t.tag && X(s, n) === r);
      o !== -1 && e.splice(o, 1);
    }
    return e.push(t), e.length;
  }, removeTag(t, n) {
  } };
}
const Hn = (e) => {
  const t = isServer ? On() : Nn();
  return createComponent$1(De.Provider, { value: t, get children() {
    return e.children;
  } });
}, _n = (e, t, n) => (qn({ tag: e, props: t, setting: n, id: createUniqueId(), get name() {
  return t.name || t.property;
} }), null);
function qn(e) {
  const t = useContext(De);
  if (!t) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const n = t.addTag(e);
    onCleanup(() => t.removeTag(e, n));
  });
}
function kn(e) {
  return e.map((t) => {
    var _a, _b;
    const r = Object.keys(t.props).map((s) => s === "children" ? "" : ` ${s}="${escape(t.props[s], true)}"`).join("");
    let o = t.props.children;
    return Array.isArray(o) && (o = o.join("")), ((_a = t.setting) == null ? void 0 : _a.close) ? `<${t.tag} data-sm="${t.id}"${r}>${((_b = t.setting) == null ? void 0 : _b.escape) ? escape(o) : o || ""}</${t.tag}>` : `<${t.tag} data-sm="${t.id}"${r}/>`;
  }).join("");
}
const In = (e) => _n("title", e, { escape: true, close: true });
function Be() {
  let e = /* @__PURE__ */ new Set();
  function t(o) {
    return e.add(o), () => e.delete(o);
  }
  let n = false;
  function r(o, s) {
    if (n) return !(n = false);
    const a = { to: o, options: s, defaultPrevented: false, preventDefault: () => a.defaultPrevented = true };
    for (const i of e) i.listener({ ...a, from: i.location, retry: (l) => {
      l && (n = true), i.navigate(o, { ...s, resolve: false });
    } });
    return !a.defaultPrevented;
  }
  return { subscribe: t, confirm: r };
}
let ie;
function ue() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), ie = window.history.state._depth;
}
isServer || ue();
function Mn(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function Fn(e, t) {
  let n = false;
  return () => {
    const r = ie;
    ue();
    const o = r == null ? null : ie - r;
    if (n) {
      n = false;
      return;
    }
    o && t(o) ? (n = true, window.history.go(-o)) : e();
  };
}
const jn = /^(?:[a-z0-9]+:)?\/\//i, Un = /^\/+|(\/)\/+$/g, Ke = "http://sr";
function D(e, t = false) {
  const n = e.replace(Un, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function V(e, t, n) {
  if (jn.test(t)) return;
  const r = D(e), o = n && D(n);
  let s = "";
  return !o || t.startsWith("/") ? s = r : o.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? s = r + o : s = o, (s || "/") + D(t, !s);
}
function Dn(e, t) {
  return D(e).replace(/\/*(\*.*)?$/g, "") + D(t);
}
function ze(e) {
  const t = {};
  return e.searchParams.forEach((n, r) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(n) : t[r] = [t[r], n] : t[r] = n;
  }), t;
}
function Wn(e, t, n) {
  const [r, o] = e.split("/*", 2), s = r.split("/").filter(Boolean), a = s.length;
  return (i) => {
    const l = i.split("/").filter(Boolean), c = l.length - a;
    if (c < 0 || c > 0 && o === void 0 && !t) return null;
    const u = { path: a ? "" : "/", params: {} }, g = (m) => n === void 0 ? void 0 : n[m];
    for (let m = 0; m < a; m++) {
      const f = s[m], v = f[0] === ":", d = v ? l[m] : l[m].toLowerCase(), h = v ? f.slice(1) : f.toLowerCase();
      if (v && ee(d, g(h))) u.params[h] = d;
      else if (v || !ee(d, h)) return null;
      u.path += `/${d}`;
    }
    if (o) {
      const m = c ? l.slice(-c).join("/") : "";
      if (ee(m, g(o))) u.params[o] = m;
      else return null;
    }
    return u;
  };
}
function ee(e, t) {
  const n = (r) => r === e;
  return t === void 0 ? true : typeof t == "string" ? n(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(n) : t instanceof RegExp ? t.test(e) : false;
}
function Bn(e) {
  const [t, n] = e.pattern.split("/*", 2), r = t.split("/").filter(Boolean);
  return r.reduce((o, s) => o + (s.startsWith(":") ? 2 : 3), r.length - (n === void 0 ? 0 : 1));
}
function Je(e) {
  const t = /* @__PURE__ */ new Map(), n = getOwner();
  return new Proxy({}, { get(r, o) {
    return t.has(o) || runWithOwner(n, () => t.set(o, createMemo(() => e()[o]))), t.get(o)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  } });
}
function Ge(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let n = e.slice(0, t.index), r = e.slice(t.index + t[0].length);
  const o = [n, n += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); ) o.push(n += t[1]), r = r.slice(t[0].length);
  return Ge(r).reduce((s, a) => [...s, ...o.map((i) => i + a)], []);
}
const Kn = 100, zn = createContext$1(), Ve = createContext$1();
function Jn(e, t = "") {
  const { component: n, preload: r, load: o, children: s, info: a } = e, i = !s || Array.isArray(s) && !s.length, l = { key: e, component: n, preload: r || o, info: a };
  return Ye(e.path).reduce((c, u) => {
    for (const g of Ge(u)) {
      const m = Dn(t, g);
      let f = i ? m : m.split("/*", 1)[0];
      f = f.split("/").map((v) => v.startsWith(":") || v.startsWith("*") ? v : encodeURIComponent(v)).join("/"), c.push({ ...l, originalPath: u, pattern: f, matcher: Wn(f, !i, e.matchFilters) });
    }
    return c;
  }, []);
}
function Gn(e, t = 0) {
  return { routes: e, score: Bn(e[e.length - 1]) * 1e4 - t, matcher(n) {
    const r = [];
    for (let o = e.length - 1; o >= 0; o--) {
      const s = e[o], a = s.matcher(n);
      if (!a) return null;
      r.unshift({ ...a, route: s });
    }
    return r;
  } };
}
function Ye(e) {
  return Array.isArray(e) ? e : [e];
}
function Xe(e, t = "", n = [], r = []) {
  const o = Ye(e);
  for (let s = 0, a = o.length; s < a; s++) {
    const i = o[s];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const l = Jn(i, t);
      for (const c of l) {
        n.push(c);
        const u = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !u) Xe(i.children, c.pattern, n, r);
        else {
          const g = Gn([...n], r.length);
          r.push(g);
        }
        n.pop();
      }
    }
  }
  return n.length ? r : r.sort((s, a) => a.score - s.score);
}
function W(e, t) {
  for (let n = 0, r = e.length; n < r; n++) {
    const o = e[n].matcher(t);
    if (o) return o;
  }
  return [];
}
function Vn(e, t, n) {
  const r = new URL(Ke), o = createMemo((u) => {
    const g = e();
    try {
      return new URL(g, r);
    } catch {
      return console.error(`Invalid path ${g}`), u;
    }
  }, r, { equals: (u, g) => u.href === g.href }), s = createMemo(() => o().pathname), a = createMemo(() => o().search, true), i = createMemo(() => o().hash), l = () => "", c = on$1(a, () => ze(o()));
  return { get pathname() {
    return s();
  }, get search() {
    return a();
  }, get hash() {
    return i();
  }, get state() {
    return t();
  }, get key() {
    return l();
  }, query: n ? n(c) : Je(c) };
}
let N;
function Yn() {
  return N;
}
function Xn(e, t, n, r = {}) {
  const { signal: [o, s], utils: a = {} } = e, i = a.parsePath || ((p) => p), l = a.renderPath || ((p) => p), c = a.beforeLeave || Be(), u = V("", r.base || "");
  if (u === void 0) throw new Error(`${u} is not a valid base path`);
  u && !o().value && s({ value: u, replace: true, scroll: false });
  const [g, m] = createSignal(false);
  let f;
  const v = (p, y) => {
    y.value === d() && y.state === b() || (f === void 0 && m(true), N = p, f = y, startTransition(() => {
      f === y && (h(f.value), R(f.state), resetErrorBoundaries(), isServer || L[1]((E) => E.filter((q) => q.pending)));
    }).finally(() => {
      f === y && batch(() => {
        N = void 0, p === "navigate" && ot(f), m(false), f = void 0;
      });
    }));
  }, [d, h] = createSignal(o().value), [b, R] = createSignal(o().state), P = Vn(d, b, a.queryWrapper), $ = [], L = createSignal(isServer ? at() : []), j = createMemo(() => typeof r.transformUrl == "function" ? W(t(), r.transformUrl(P.pathname)) : W(t(), P.pathname)), de = () => {
    const p = j(), y = {};
    for (let E = 0; E < p.length; E++) Object.assign(y, p[E].params);
    return y;
  }, tt = a.paramsWrapper ? a.paramsWrapper(de, t) : Je(de), fe = { pattern: u, path: () => u, outlet: () => null, resolvePath(p) {
    return V(u, p);
  } };
  return createRenderEffect(on$1(o, (p) => v("native", p), { defer: true })), { base: fe, location: P, params: tt, isRouting: g, renderPath: l, parsePath: i, navigatorFactory: rt, matches: j, beforeLeave: c, preloadRoute: st, singleFlight: r.singleFlight === void 0 ? true : r.singleFlight, submissions: L };
  function nt(p, y, E) {
    untrack(() => {
      if (typeof y == "number") {
        y && (a.go ? a.go(y) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const q = !y || y[0] === "?", { replace: B, resolve: k, scroll: K, state: I } = { replace: false, resolve: !q, scroll: true, ...E }, M = k ? p.resolvePath(y) : V(q && P.pathname || "", y);
      if (M === void 0) throw new Error(`Path '${y}' is not a routable path`);
      if ($.length >= Kn) throw new Error("Too many redirects");
      const he = d();
      if (M !== he || I !== b()) if (isServer) {
        const pe = getRequestEvent();
        pe && (pe.response = { status: 302, headers: new Headers({ Location: M }) }), s({ value: M, replace: B, scroll: K, state: I });
      } else c.confirm(M, E) && ($.push({ value: he, replace: B, scroll: K, state: b() }), v("navigate", { value: M, state: I }));
    });
  }
  function rt(p) {
    return p = p || useContext(Ve) || fe, (y, E) => nt(p, y, E);
  }
  function ot(p) {
    const y = $[0];
    y && (s({ ...p, replace: y.replace, scroll: y.scroll }), $.length = 0);
  }
  function st(p, y) {
    const E = W(t(), p.pathname), q = N;
    N = "preload";
    for (let B in E) {
      const { route: k, params: K } = E[B];
      k.component && k.component.preload && k.component.preload();
      const { preload: I } = k;
      y && I && runWithOwner(n(), () => I({ params: K, location: { pathname: p.pathname, search: p.search, hash: p.hash, query: ze(p), state: null, key: "" }, intent: "preload" }));
    }
    N = q;
  }
  function at() {
    const p = getRequestEvent();
    return p && p.router && p.router.submission ? [p.router.submission] : [];
  }
}
function Qn(e, t, n, r) {
  const { base: o, location: s, params: a } = e, { pattern: i, component: l, preload: c } = r().route, u = createMemo(() => r().path);
  l && l.preload && l.preload();
  const g = c ? c({ params: a, location: s, intent: N || "initial" }) : void 0;
  return { parent: t, pattern: i, path: u, outlet: () => l ? createComponent(l, { params: a, location: s, data: g, get children() {
    return n();
  } }) : n(), resolvePath(f) {
    return V(o.path(), f, u());
  } };
}
const Qe = (e) => (t) => {
  const { base: n } = t, r = children(() => t.children), o = createMemo(() => Xe(r(), t.base || ""));
  let s;
  const a = Xn(e, o, () => s, { base: n, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(a), createComponent$1(zn.Provider, { value: a, get children() {
    return createComponent$1(Zn, { routerState: a, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(s = getOwner()) && null, createComponent$1(er, { routerState: a, get branches() {
        return o();
      } })];
    } });
  } });
};
function Zn(e) {
  const t = e.routerState.location, n = e.routerState.params, r = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: n, location: t, intent: Yn() || "initial" });
  }));
  return createComponent$1(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (o) => createComponent$1(o, { params: n, location: t, get data() {
    return r();
  }, get children() {
    return e.children;
  } }) });
}
function er(e) {
  if (isServer) {
    const o = getRequestEvent();
    if (o && o.router && o.router.dataOnly) {
      tr(o, e.routerState, e.branches);
      return;
    }
    o && ((o.router || (o.router = {})).matches || (o.router.matches = e.routerState.matches().map(({ route: s, path: a, params: i }) => ({ path: s.originalPath, pattern: s.pattern, match: a, params: i, info: s.info }))));
  }
  const t = [];
  let n;
  const r = createMemo(on$1(e.routerState.matches, (o, s, a) => {
    let i = s && o.length === s.length;
    const l = [];
    for (let c = 0, u = o.length; c < u; c++) {
      const g = s && s[c], m = o[c];
      a && g && m.route.key === g.route.key ? l[c] = a[c] : (i = false, t[c] && t[c](), createRoot((f) => {
        t[c] = f, l[c] = Qn(e.routerState, l[c - 1] || e.routerState.base, $e(() => r()[c + 1]), () => e.routerState.matches()[c]);
      }));
    }
    return t.splice(o.length).forEach((c) => c()), a && i ? a : (n = l[0], l);
  }));
  return $e(() => r() && n)();
}
const $e = (e) => () => createComponent$1(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent$1(Ve.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function tr(e, t, n) {
  const r = new URL(e.request.url), o = W(n, new URL(e.router.previousUrl || e.request.url).pathname), s = W(n, r.pathname);
  for (let a = 0; a < s.length; a++) {
    (!o[a] || s[a].route !== o[a].route) && (e.router.dataOnly = true);
    const { route: i, params: l } = s[a];
    i.preload && i.preload({ params: l, location: t.location, intent: "preload" });
  }
}
function nr([e, t], n, r) {
  return [e, r ? (o) => t(r(o)) : t];
}
function rr(e) {
  let t = false;
  const n = (o) => typeof o == "string" ? { value: o } : o, r = nr(createSignal(n(e.get()), { equals: (o, s) => o.value === s.value && o.state === s.state }), void 0, (o) => (!t && e.set(o), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), o));
  return e.init && onCleanup(e.init((o = e.get()) => {
    t = true, r[1](n(o)), t = false;
  })), Qe({ signal: r, create: e.create, utils: e.utils });
}
function or(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function sr(e, t) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
function ar(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function ir(e) {
  let t;
  const n = { value: e.url || (t = getRequestEvent()) && ar(t.request.url) || "" };
  return Qe({ signal: [() => n, (r) => Object.assign(n, r)] })(e);
}
const cr = /* @__PURE__ */ new Map();
function lr(e = true, t = false, n = "/_server", r) {
  return (o) => {
    const s = o.base.path(), a = o.navigatorFactory(o.base);
    let i, l;
    function c(d) {
      return d.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function u(d) {
      if (d.defaultPrevented || d.button !== 0 || d.metaKey || d.altKey || d.ctrlKey || d.shiftKey) return;
      const h = d.composedPath().find((j) => j instanceof Node && j.nodeName.toUpperCase() === "A");
      if (!h || t && !h.hasAttribute("link")) return;
      const b = c(h), R = b ? h.href.baseVal : h.href;
      if ((b ? h.target.baseVal : h.target) || !R && !h.hasAttribute("state")) return;
      const $ = (h.getAttribute("rel") || "").split(/\s+/);
      if (h.hasAttribute("download") || $ && $.includes("external")) return;
      const L = b ? new URL(R, document.baseURI) : new URL(R);
      if (!(L.origin !== window.location.origin || s && L.pathname && !L.pathname.toLowerCase().startsWith(s.toLowerCase()))) return [h, L];
    }
    function g(d) {
      const h = u(d);
      if (!h) return;
      const [b, R] = h, P = o.parsePath(R.pathname + R.search + R.hash), $ = b.getAttribute("state");
      d.preventDefault(), a(P, { resolve: false, replace: b.hasAttribute("replace"), scroll: !b.hasAttribute("noscroll"), state: $ ? JSON.parse($) : void 0 });
    }
    function m(d) {
      const h = u(d);
      if (!h) return;
      const [b, R] = h;
      r && (R.pathname = r(R.pathname)), o.preloadRoute(R, b.getAttribute("preload") !== "false");
    }
    function f(d) {
      clearTimeout(i);
      const h = u(d);
      if (!h) return l = null;
      const [b, R] = h;
      l !== b && (r && (R.pathname = r(R.pathname)), i = setTimeout(() => {
        o.preloadRoute(R, b.getAttribute("preload") !== "false"), l = b;
      }, 20));
    }
    function v(d) {
      if (d.defaultPrevented) return;
      let h = d.submitter && d.submitter.hasAttribute("formaction") ? d.submitter.getAttribute("formaction") : d.target.getAttribute("action");
      if (!h) return;
      if (!h.startsWith("https://action/")) {
        const R = new URL(h, Ke);
        if (h = o.parsePath(R.pathname + R.search), !h.startsWith(n)) return;
      }
      if (d.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const b = cr.get(h);
      if (b) {
        d.preventDefault();
        const R = new FormData(d.target, d.submitter);
        b.call({ r: o, f: d.target }, d.target.enctype === "multipart/form-data" ? R : new URLSearchParams(R));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", g), e && (document.addEventListener("mousemove", f, { passive: true }), document.addEventListener("focusin", m, { passive: true }), document.addEventListener("touchstart", m, { passive: true })), document.addEventListener("submit", v), onCleanup(() => {
      document.removeEventListener("click", g), e && (document.removeEventListener("mousemove", f), document.removeEventListener("focusin", m), document.removeEventListener("touchstart", m)), document.removeEventListener("submit", v);
    });
  };
}
function ur(e) {
  if (isServer) return ir(e);
  const t = () => {
    const r = window.location.pathname.replace(/^\/+/, "/") + window.location.search, o = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: r + window.location.hash, state: o };
  }, n = Be();
  return rr({ get: t, set({ value: r, replace: o, scroll: s, state: a }) {
    o ? window.history.replaceState(Mn(a), "", r) : window.history.pushState(a, "", r), sr(decodeURIComponent(window.location.hash.slice(1)), s), ue();
  }, init: (r) => or(window, "popstate", Fn(r, (o) => {
    if (o && o < 0) return !n.confirm(o);
    {
      const s = t();
      return !n.confirm(s.value, { state: s.state });
    }
  })), create: lr(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (r) => window.history.go(r), beforeLeave: n } })(e);
}
function dr() {
  return createComponent$1(ur, { root: (e) => createComponent$1(Hn, { get children() {
    return [createComponent$1(In, { children: "SolidStart - with Vitest" }), createComponent$1(Suspense, { get children() {
      return e.children;
    } })];
  } }), get children() {
    return createComponent$1(Cn, {});
  } });
}
const Ze = isServer ? (e) => {
  const t = getRequestEvent();
  return t.response.status = e.code, t.response.statusText = e.text, onCleanup(() => !t.nativeEvent.handled && !t.complete && (t.response.status = 200)), null;
} : (e) => null;
var fr = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], hr = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const pr = (e) => {
  const t = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary, { fallback: (n) => (console.error(n), [ssr(fr, ssrHydrationKey(), escape(t)), createComponent$1(Ze, { code: 500 })]), get children() {
    return e.children;
  } });
}, mr = (e) => {
  let t = false;
  const n = catchError(() => e.children, (r) => {
    console.error(r), t = !!r;
  });
  return t ? [ssr(hr, ssrHydrationKey()), createComponent$1(Ze, { code: 500 })] : n;
};
var xe = ["<script", ">", "<\/script>"], gr = ["<script", ' type="module"', " async", "><\/script>"], yr = ["<script", ' type="module" async', "><\/script>"];
const wr = ssr("<!DOCTYPE html>");
function et(e, t, n = []) {
  for (let r = 0; r < t.length; r++) {
    const o = t[r];
    if (o.path !== e[0].path) continue;
    let s = [...n, o];
    if (o.children) {
      const a = e.slice(1);
      if (a.length === 0 || (s = et(a, o.children, s), !s)) continue;
    }
    return s;
  }
}
function vr(e) {
  const t = getRequestEvent(), n = t.nonce;
  let r = [];
  return Promise.resolve().then(async () => {
    let o = [];
    if (t.router && t.router.matches) {
      const s = [...t.router.matches];
      for (; s.length && (!s[0].info || !s[0].info.filesystem); ) s.shift();
      const a = s.length && et(s, t.routes);
      if (a) {
        const i = globalThis.MANIFEST.client.inputs;
        for (let l = 0; l < a.length; l++) {
          const c = a[l], u = i[c.$component.src];
          o.push(u.assets());
        }
      }
    }
    r = await Promise.all(o).then((s) => [...new Map(s.flat().map((a) => [a.attrs.key, a])).values()].filter((a) => a.attrs.rel === "modulepreload" && !t.assets.find((i) => i.attrs.key === a.attrs.key)));
  }), useAssets(() => r.length ? r.map((o) => re(o)) : void 0), createComponent$1(NoHydration, { get children() {
    return [wr, createComponent$1(mr, { get children() {
      return createComponent$1(e.document, { get assets() {
        return [createComponent$1(HydrationScript, {}), t.assets.map((o) => re(o, n))];
      }, get scripts() {
        return n ? [ssr(xe, ssrHydrationKey() + ssrAttribute("nonce", escape(n, true), false), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(gr, ssrHydrationKey(), ssrAttribute("nonce", escape(n, true), false), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(xe, ssrHydrationKey(), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(yr, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      }, get children() {
        return createComponent$1(Hydration, { get children() {
          return createComponent$1(pr, { get children() {
            return createComponent$1(dr, {});
          } });
        } });
      } });
    } })];
  } });
}
var Rr = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.ico">', "</head>"], br = ["<html", ' lang="en">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const xr = Ln(() => createComponent$1(vr, { document: ({ assets: e, children: t, scripts: n }) => ssr(br, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(Rr, escape(e));
} }), escape(t), escape(n)) }));

const handlers = [
  { route: '', handler: _oPMbh5, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: zn$1, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: xr, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { nodeServer as n, wn$1 as w };
//# sourceMappingURL=nitro.mjs.map
