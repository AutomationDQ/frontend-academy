/* =========================================================
   NODE RUNTIME MÔ PHỎNG – chạy code Back-end ngay trong trình duyệt
   ---------------------------------------------------------
   Hàm __nodeRuntime(CONFIG) được chèn vào iframe (sandbox) TRƯỚC code
   của học viên. Nó tạo ra các biến toàn cục giống Node.js:
     require, module, exports, process, __dirname, Buffer, global
   và các module mô phỏng:
     express (API giống Express 5), http, fs, path, events, util, os,
     crypto (sha256/hmac thật), bcryptjs/bcrypt, jsonwebtoken (HS256 thật),
     dotenv, cors, assert, better-sqlite3 (SQL mini viết tay)
   Không có server thật: "request" được gửi bằng hàm __node.request()
   (bảng API tester và hàm chấm bài T.request dùng hàm này).
   ⚠️ Hàm này được chuyển thành chuỗi (Function.toString) nên KHÔNG được
   dùng biến bên ngoài hàm.
   ========================================================= */
function __nodeRuntime(CONFIG) {
  "use strict";
  CONFIG = CONFIG || {};
  const W = window;
  // Chốt tham chiếu: code học viên có thể khai báo "const crypto = require('crypto')" ở phạm vi toàn cục
  const WCRYPTO = window.crypto, PERF = window.performance, TE = window.TextEncoder, TD = window.TextDecoder;
  const post = (msg) => { try { parent.postMessage(Object.assign({ __fe: CONFIG.pgId }, msg), "*"); } catch (e) {} };

  /* ===================== Tiện ích ===================== */
  const STATUS_TEXT = { 200: "OK", 201: "Created", 204: "No Content", 301: "Moved Permanently", 302: "Found", 304: "Not Modified",
    400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 409: "Conflict",
    413: "Payload Too Large", 415: "Unsupported Media Type", 422: "Unprocessable Entity", 429: "Too Many Requests",
    500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable" };
  const lowerKeys = o => { const r = {}; Object.keys(o || {}).forEach(k => { r[k.toLowerCase()] = o[k]; }); return r; };
  const utf8 = s => new TE().encode(String(s));
  const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  const b64 = bytes => { let s = ""; bytes.forEach(b => { s += String.fromCharCode(b); }); return btoa(s); };
  const b64url = bytes => b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const fromB64url = s => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; const bin = atob(s); return Uint8Array.from(bin, c => c.charCodeAt(0)); };
  const bytesToStr = b => new TD().decode(b);

  /* ---- SHA-256 (đồng bộ, thuần JS) ---- */
  const K256 = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  function sha256(data) {
    const msg = typeof data === "string" ? utf8(data) : data;
    const l = msg.length, withOne = l + 1, total = Math.ceil((withOne + 8) / 64) * 64;
    const buf = new Uint8Array(total); buf.set(msg); buf[l] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(total - 4, (l * 8) >>> 0); dv.setUint32(total - 8, Math.floor(l * 8 / 0x100000000));
    let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const w = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < total; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i-15], 7) ^ rotr(w[i-15], 18) ^ (w[i-15] >>> 3);
        const s1 = rotr(w[i-2], 17) ^ rotr(w[i-2], 19) ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K256[i] + w[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      h = [h[0]+a, h[1]+b, h[2]+c, h[3]+d, h[4]+e, h[5]+f, h[6]+g, h[7]+hh].map(x => x >>> 0);
    }
    const out = new Uint8Array(32); const odv = new DataView(out.buffer);
    h.forEach((x, i) => odv.setUint32(i * 4, x));
    return out;
  }
  function hmac256(key, data) {
    let k = typeof key === "string" ? utf8(key) : key;
    if (k.length > 64) k = sha256(k);
    const kp = new Uint8Array(64); kp.set(k);
    const ipad = kp.map(b => b ^ 0x36), opad = kp.map(b => b ^ 0x5c);
    const d = typeof data === "string" ? utf8(data) : data;
    const inner = new Uint8Array(64 + d.length); inner.set(ipad); inner.set(d, 64);
    const ih = sha256(inner);
    const outer = new Uint8Array(96); outer.set(opad); outer.set(ih, 64);
    return sha256(outer);
  }
  const encodeDigest = (bytes, enc) => enc === "hex" ? hex(bytes) : enc === "base64" ? b64(bytes) : enc === "base64url" ? b64url(bytes) : BufferShim.from(bytes);
  const randBytes = n => { const a = new Uint8Array(n); WCRYPTO.getRandomValues(a); return a; };

  /* ---- Buffer tối giản ---- */
  class BufferShim extends Uint8Array {
    static from(v, enc) {
      if (v instanceof Uint8Array) return new BufferShim(v);
      if (Array.isArray(v)) return new BufferShim(v);
      const s = String(v);
      if (enc === "base64" || enc === "base64url") return new BufferShim(fromB64url(s));
      if (enc === "hex") return new BufferShim((s.match(/../g) || []).map(x => parseInt(x, 16)));
      return new BufferShim(utf8(s));
    }
    static byteLength(s) { return utf8(s).length; }
    static isBuffer(x) { return x instanceof BufferShim; }
    static concat(list) { const t = list.reduce((n, b) => n + b.length, 0), r = new BufferShim(t); let o = 0; list.forEach(b => { r.set(b, o); o += b.length; }); return r; }
    static alloc(n) { return new BufferShim(n); }
    toString(enc) { return enc === "hex" ? hex(this) : enc === "base64" ? b64(this) : enc === "base64url" ? b64url(this) : bytesToStr(this); }
    toJSON() { return { type: "Buffer", data: Array.from(this) }; }
  }

  /* ===================== process / module ===================== */
  const env = Object.assign({}, CONFIG.env || {});   // như Node thật: NODE_ENV chưa đặt thì là undefined
  const procListeners = {};
  const proc = {
    env, argv: ["/usr/local/bin/node", "/app/server.js"], version: "v22.11.0", versions: { node: "22.11.0" },
    platform: "linux", pid: 4242, title: "node",
    cwd: () => "/app", exit: code => { console.log("[process.exit(" + (code || 0) + ")]"); },
    on: (ev, fn) => { (procListeners[ev] = procListeners[ev] || []).push(fn); return proc; },
    nextTick: (fn, ...a) => queueMicrotask(() => fn(...a)),
    memoryUsage: () => ({ rss: 41943040, heapTotal: 16777216, heapUsed: 9437184, external: 1048576 }),
    uptime: () => (PERF.now() / 1000), hrtime: { bigint: () => BigInt(Math.round(PERF.now() * 1e6)) }
  };

  /* ===================== fs (bộ nhớ) ===================== */
  const FILES = {};      // "/app/data.json" -> "nội dung"
  const DIRS = new Set(["/", "/app"]);
  const pathMod = {
    sep: "/",
    normalize(p) {
      const abs = p.startsWith("/"); const parts = [];
      p.split("/").forEach(s => { if (!s || s === ".") return; if (s === "..") parts.pop(); else parts.push(s); });
      return (abs ? "/" : "") + parts.join("/") || (abs ? "/" : ".");
    },
    join(...a) { return pathMod.normalize(a.filter(x => x !== "").join("/")); },
    resolve(...a) { let r = "/app"; a.forEach(p => { p = String(p); r = p.startsWith("/") ? p : r + "/" + p; }); return pathMod.normalize(r); },
    basename(p, ext) { const b = String(p).split("/").filter(Boolean).pop() || ""; return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b; },
    dirname(p) { const s = String(p).split("/"); s.pop(); return s.join("/") || "/"; },
    extname(p) { const b = pathMod.basename(p); const i = b.lastIndexOf("."); return i > 0 ? b.slice(i) : ""; },
    parse(p) { return { root: p.startsWith("/") ? "/" : "", dir: pathMod.dirname(p), base: pathMod.basename(p), ext: pathMod.extname(p), name: pathMod.basename(p, pathMod.extname(p)) }; },
    isAbsolute: p => String(p).startsWith("/")
  };
  const abs = p => pathMod.resolve(String(p));
  const fsErr = (code, msg, p) => { const e = new Error(code + ": " + msg + ", '" + p + "'"); e.code = code; e.path = p; return e; };
  const ensureDir = p => { const d = pathMod.dirname(p); if (!DIRS.has(d)) throw fsErr("ENOENT", "no such file or directory, open", p); };
  const toText = (data) => typeof data === "string" ? data : (data instanceof Uint8Array ? bytesToStr(data) : String(data));
  const fs = {
    readFileSync(p, opt) {
      const a = abs(p); if (!(a in FILES)) throw fsErr("ENOENT", "no such file or directory, open", p);
      const enc = typeof opt === "string" ? opt : opt && opt.encoding;
      return enc ? FILES[a] : BufferShim.from(FILES[a]);
    },
    writeFileSync(p, data) { const a = abs(p); ensureDir(a); FILES[a] = toText(data); },
    appendFileSync(p, data) { const a = abs(p); ensureDir(a); FILES[a] = (FILES[a] || "") + toText(data); },
    existsSync(p) { const a = abs(p); return a in FILES || DIRS.has(a); },
    mkdirSync(p, opt) {
      const a = abs(p);
      if (opt && opt.recursive) { let cur = ""; a.split("/").filter(Boolean).forEach(s => { cur += "/" + s; DIRS.add(cur); }); return; }
      if (DIRS.has(a)) throw fsErr("EEXIST", "file already exists, mkdir", p);
      ensureDir(a); DIRS.add(a);
    },
    readdirSync(p) {
      const a = abs(p); if (!DIRS.has(a)) throw fsErr("ENOENT", "no such file or directory, scandir", p);
      const pre = a === "/" ? "/" : a + "/"; const names = new Set();
      Object.keys(FILES).concat([...DIRS]).forEach(f => { if (f.startsWith(pre) && f !== a) names.add(f.slice(pre.length).split("/")[0]); });
      return [...names].sort();
    },
    unlinkSync(p) { const a = abs(p); if (!(a in FILES)) throw fsErr("ENOENT", "no such file or directory, unlink", p); delete FILES[a]; },
    rmSync(p) { const a = abs(p); delete FILES[a]; DIRS.delete(a); },
    statSync(p) {
      const a = abs(p);
      if (a in FILES) return { size: utf8(FILES[a]).length, isFile: () => true, isDirectory: () => false, mtime: new Date() };
      if (DIRS.has(a)) return { size: 0, isFile: () => false, isDirectory: () => true, mtime: new Date() };
      throw fsErr("ENOENT", "no such file or directory, stat", p);
    }
  };
  const later = fn => new Promise((res, rej) => setTimeout(() => { try { res(fn()); } catch (e) { rej(e); } }, 5));
  fs.promises = {
    readFile: (p, o) => later(() => fs.readFileSync(p, o)), writeFile: (p, d) => later(() => fs.writeFileSync(p, d)),
    appendFile: (p, d) => later(() => fs.appendFileSync(p, d)), readdir: p => later(() => fs.readdirSync(p)),
    unlink: p => later(() => fs.unlinkSync(p)), mkdir: (p, o) => later(() => fs.mkdirSync(p, o)), stat: p => later(() => fs.statSync(p)),
    access: p => later(() => { if (!fs.existsSync(p)) throw fsErr("ENOENT", "no such file or directory, access", p); })
  };
  const cbify = name => function (...args) {
    const cb = typeof args[args.length - 1] === "function" ? args.pop() : null;
    fs.promises[name](...args).then(r => cb && cb(null, r), e => cb && cb(e));
  };
  ["readFile", "writeFile", "appendFile", "readdir", "unlink", "mkdir", "stat"].forEach(n => { fs[n] = cbify(n); });
  Object.keys(CONFIG.files || {}).forEach(p => {
    const a = abs(p); let cur = ""; pathMod.dirname(a).split("/").filter(Boolean).forEach(s => { cur += "/" + s; DIRS.add(cur); });
    FILES[a] = CONFIG.files[p];
  });

  /* ===================== events / util / os ===================== */
  class EventEmitter {
    constructor() { this._ev = {}; }
    on(e, f) { (this._ev[e] = this._ev[e] || []).push(f); return this; }
    addListener(e, f) { return this.on(e, f); }
    once(e, f) { const w = (...a) => { this.off(e, w); f.apply(this, a); }; return this.on(e, w); }
    off(e, f) { this._ev[e] = (this._ev[e] || []).filter(x => x !== f); return this; }
    removeListener(e, f) { return this.off(e, f); }
    emit(e, ...a) { const l = (this._ev[e] || []).slice(); l.forEach(f => f.apply(this, a)); return l.length > 0; }
    listenerCount(e) { return (this._ev[e] || []).length; }
  }
  const util = {
    promisify: fn => (...a) => new Promise((res, rej) => fn(...a, (e, r) => e ? rej(e) : res(r))),
    format: (...a) => a.map(x => typeof x === "string" ? x : JSON.stringify(x)).join(" "),
    inspect: x => JSON.stringify(x, null, 2), isDeepStrictEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b)
  };
  const os = { platform: () => "linux", type: () => "Linux", hostname: () => "academy-sandbox", cpus: () => new Array(4).fill({ model: "Virtual CPU" }),
    totalmem: () => 8589934592, freemem: () => 4294967296, homedir: () => "/home/node", tmpdir: () => "/tmp", EOL: "\n", uptime: () => 3600 };

  /* ===================== crypto ===================== */
  const cryptoMod = {
    createHash(alg) {
      if (String(alg).toLowerCase() !== "sha256") throw new Error("Môi trường mô phỏng chỉ hỗ trợ createHash('sha256')");
      const parts = [];
      const o = { update(d) { parts.push(typeof d === "string" ? utf8(d) : d); return o; },
        digest(enc) { return encodeDigest(sha256(BufferShim.concat(parts)), enc); } };
      return o;
    },
    createHmac(alg, key) {
      if (String(alg).toLowerCase() !== "sha256") throw new Error("Môi trường mô phỏng chỉ hỗ trợ createHmac('sha256', key)");
      const parts = [];
      const o = { update(d) { parts.push(typeof d === "string" ? utf8(d) : d); return o; },
        digest(enc) { return encodeDigest(hmac256(key, BufferShim.concat(parts)), enc); } };
      return o;
    },
    randomBytes: n => BufferShim.from(randBytes(n)),
    randomUUID: () => WCRYPTO.randomUUID ? WCRYPTO.randomUUID() : (() => { const b = randBytes(16); b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80; return hex(b).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5"); })(),
    randomInt: (a, b) => { if (b === undefined) { b = a; a = 0; } return a + Math.floor(Math.random() * (b - a)); },
    timingSafeEqual: (a, b) => a.length === b.length && a.every((x, i) => x === b[i])
  };

  /* ===================== bcryptjs (mô phỏng định dạng $2b$) ===================== */
  const B_ALPHA = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bEnc = (bytes, len) => { let s = ""; for (let i = 0; s.length < len; i++) s += B_ALPHA[bytes[i % bytes.length] % 64]; return s; };
  const bcrypt = {
    genSaltSync(rounds) { rounds = rounds || 10; return "$2b$" + String(rounds).padStart(2, "0") + "$" + bEnc(randBytes(22), 22); },
    hashSync(pw, salt) {
      if (pw === undefined || pw === null) throw new Error("Illegal arguments: undefined, " + typeof salt);
      if (typeof salt === "number" || salt === undefined) salt = bcrypt.genSaltSync(salt);
      const m = /^\$2[aby]\$(\d\d)\$(.{22})/.exec(salt); if (!m) throw new Error("Invalid salt version");
      let d = utf8(m[2] + String(pw)); const rounds = Math.min(+m[1], 12);
      for (let i = 0; i < (1 << Math.max(0, rounds - 6)); i++) d = sha256(d);   // mô phỏng "chậm có chủ đích"
      return "$2b$" + m[1] + "$" + m[2] + bEnc(d, 31);
    },
    compareSync(pw, hash) {
      if (typeof hash !== "string" || hash.length !== 60) return false;
      return bcrypt.hashSync(pw, hash.slice(0, 29)) === hash;
    },
    genSalt: r => later(() => bcrypt.genSaltSync(r)),
    hash: (pw, s) => later(() => bcrypt.hashSync(pw, s)),
    compare: (pw, h) => later(() => bcrypt.compareSync(pw, h)),
    getRounds: h => +String(h).slice(4, 6)
  };

  /* ===================== jsonwebtoken (HS256 thật) ===================== */
  class JsonWebTokenError extends Error { constructor(m) { super(m); this.name = "JsonWebTokenError"; } }
  class TokenExpiredError extends JsonWebTokenError { constructor(m, at) { super(m); this.name = "TokenExpiredError"; this.expiredAt = at; } }
  const parseDur = v => {
    if (typeof v === "number") return v;
    const m = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(String(v).trim()); if (!m) throw new Error('"expiresIn" không hợp lệ: ' + v);
    const n = +m[1]; return { ms: n / 1000, s: n, m: n * 60, h: n * 3600, d: n * 86400 }[m[2] || "s"];
  };
  const jwt = {
    sign(payload, secret, opts) {
      if (!secret) throw new Error("secretOrPrivateKey must have a value");
      opts = opts || {}; const now = Math.floor(Date.now() / 1000);
      const body = Object.assign({}, payload, { iat: now });
      if (opts.expiresIn !== undefined) body.exp = now + Math.floor(parseDur(opts.expiresIn));
      if (opts.subject) body.sub = opts.subject;
      const data = b64url(utf8(JSON.stringify({ alg: "HS256", typ: "JWT" }))) + "." + b64url(utf8(JSON.stringify(body)));
      return data + "." + b64url(hmac256(secret, data));
    },
    decode(token) { try { return JSON.parse(bytesToStr(fromB64url(String(token).split(".")[1]))); } catch (e) { return null; } },
    verify(token, secret) {
      const p = String(token || "").split(".");
      if (p.length !== 3) throw new JsonWebTokenError("jwt malformed");
      if (b64url(hmac256(secret, p[0] + "." + p[1])) !== p[2]) throw new JsonWebTokenError("invalid signature");
      const body = jwt.decode(token);
      if (body.exp !== undefined && Math.floor(Date.now() / 1000) >= body.exp) throw new TokenExpiredError("jwt expired", new Date(body.exp * 1000));
      return body;
    },
    JsonWebTokenError, TokenExpiredError
  };

  /* ===================== dotenv / assert ===================== */
  const dotenv = {
    config(o) {
      const p = (o && o.path) || ".env";
      if (!fs.existsSync(p)) return { error: fsErr("ENOENT", "no such file or directory, open", p) };
      const parsed = {};
      fs.readFileSync(p, "utf8").split(/\r?\n/).forEach(line => {
        const m = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line); if (!m || line.trim().startsWith("#")) return;
        let v = (m[2] || "").trim(); if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
        parsed[m[1]] = v; if (!(m[1] in env)) env[m[1]] = v;
      });
      return { parsed };
    }
  };
  const AssertionError = class extends Error { constructor(m) { super(m); this.name = "AssertionError"; } };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const assert = (v, m) => { if (!v) throw new AssertionError(m || "Giá trị không truthy: " + v); };
  Object.assign(assert, {
    ok: assert, equal: (a, b, m) => { if (a != b) throw new AssertionError(m || a + " == " + b); },
    strictEqual: (a, b, m) => { if (a !== b) throw new AssertionError(m || "Mong đợi " + JSON.stringify(b) + " nhưng nhận " + JSON.stringify(a)); },
    notStrictEqual: (a, b, m) => { if (a === b) throw new AssertionError(m || "Không mong đợi " + JSON.stringify(b)); },
    deepStrictEqual: (a, b, m) => { if (!same(a, b)) throw new AssertionError(m || "Mong đợi " + JSON.stringify(b) + " nhưng nhận " + JSON.stringify(a)); },
    throws: (fn, m) => { try { fn(); } catch (e) { return; } throw new AssertionError(m || "Mong đợi hàm ném lỗi"); },
    AssertionError
  });

  /* ===================== MINI SQL (better-sqlite3) ===================== */
  const SQL_KW = new Set("SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE IF NOT EXISTS DROP AND OR NULL IS IN LIKE BETWEEN ORDER BY GROUP HAVING ASC DESC LIMIT OFFSET AS JOIN INNER LEFT ON DISTINCT PRIMARY KEY AUTOINCREMENT UNIQUE DEFAULT REFERENCES TRUE FALSE PRAGMA FOREIGN CHECK CONSTRAINT CASCADE".split(" "));
  class SqliteError extends Error { constructor(m, code) { super(m); this.name = "SqliteError"; this.code = code || "SQLITE_ERROR"; } }
  function sqlTokens(sql) {
    const t = []; let i = 0;
    while (i < sql.length) {
      const c = sql[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === "-" && sql[i + 1] === "-") { while (i < sql.length && sql[i] !== "\n") i++; continue; }
      if (c === "'") { let s = ""; i++; while (i < sql.length) { if (sql[i] === "'" && sql[i + 1] === "'") { s += "'"; i += 2; } else if (sql[i] === "'") break; else s += sql[i++]; } i++; t.push({ t: "str", v: s }); continue; }
      if (c === '"' || c === "`") { const q = c; let s = ""; i++; while (i < sql.length && sql[i] !== q) s += sql[i++]; i++; t.push({ t: "id", v: s }); continue; }
      if (/\d/.test(c) || (c === "." && /\d/.test(sql[i + 1]))) { let s = ""; while (i < sql.length && /[\d.]/.test(sql[i])) s += sql[i++]; t.push({ t: "num", v: +s }); continue; }
      if (/[A-Za-z_]/.test(c)) { let s = ""; while (i < sql.length && /[\w$]/.test(sql[i])) s += sql[i++]; const u = s.toUpperCase(); t.push(SQL_KW.has(u) ? { t: "kw", v: u } : { t: "id", v: s }); continue; }
      if (c === "?") { t.push({ t: "param" }); i++; continue; }
      if ((c === "@" || c === ":" || c === "$") && /[A-Za-z_]/.test(sql[i + 1] || "")) { let s = ""; i++; while (i < sql.length && /\w/.test(sql[i])) s += sql[i++]; t.push({ t: "nparam", v: s }); continue; }
      const two = sql.substr(i, 2);
      if (["<=", ">=", "<>", "!=", "==", "||"].includes(two)) { t.push({ t: "op", v: two }); i += 2; continue; }
      if ("(),.*=<>+-/%;".includes(c)) { t.push({ t: "op", v: c }); i++; continue; }
      throw new SqliteError('lỗi cú pháp SQL: ký tự lạ "' + c + '"');
    }
    return t;
  }
  function sqlParse(sql) {
    const tk = sqlTokens(sql); let p = 0, paramIdx = 0;
    const peek = (o = 0) => tk[p + o];
    const isKw = (v, o = 0) => peek(o) && peek(o).t === "kw" && peek(o).v === v;
    const isOp = (v, o = 0) => peek(o) && peek(o).t === "op" && peek(o).v === v;
    const near = () => peek() ? (peek().v !== undefined ? peek().v : peek().t) : "cuối câu lệnh";
    const fail = () => { throw new SqliteError('lỗi cú pháp SQL gần "' + near() + '"'); };
    const kw = v => { if (!isKw(v)) fail(); p++; };
    const op = v => { if (!isOp(v)) fail(); p++; };
    const opt = v => { if (isKw(v) || isOp(v)) { p++; return true; } return false; };
    const ident = () => { const x = peek(); if (x && (x.t === "id" || (x.t === "kw" && !["FROM", "WHERE", "ORDER", "GROUP", "LIMIT", "ON", "JOIN", "LEFT", "INNER", "SET", "VALUES", "AND", "OR", "HAVING", "OFFSET"].includes(x.v)))) { p++; return x.v; } fail(); };

    function expr() { return orE(); }
    function orE() { let l = andE(); while (opt("OR")) l = { k: "bin", o: "OR", l, r: andE() }; return l; }
    function andE() { let l = notE(); while (opt("AND")) l = { k: "bin", o: "AND", l, r: notE() }; return l; }
    function notE() { if (opt("NOT")) return { k: "not", e: notE() }; return cmpE(); }
    function cmpE() {
      let l = addE();
      for (;;) {
        if (peek() && peek().t === "op" && ["=", "==", "!=", "<>", "<", "<=", ">", ">="].includes(peek().v)) { const o = tk[p++].v; l = { k: "bin", o: o === "==" ? "=" : o === "<>" ? "!=" : o, l, r: addE() }; continue; }
        if (isKw("IS")) { p++; const neg = opt("NOT"); kw("NULL"); l = { k: "isnull", e: l, neg }; continue; }
        const neg = isKw("NOT") && (isKw("LIKE", 1) || isKw("IN", 1) || isKw("BETWEEN", 1)); if (neg) p++;
        if (opt("LIKE")) { l = { k: "like", e: l, pat: addE(), neg }; continue; }
        if (opt("IN")) { op("("); const list = [expr()]; while (opt(",")) list.push(expr()); op(")"); l = { k: "in", e: l, list, neg }; continue; }
        if (opt("BETWEEN")) { const a = addE(); kw("AND"); const b = addE(); l = { k: "between", e: l, a, b, neg }; continue; }
        return l;
      }
    }
    function addE() { let l = mulE(); while (isOp("+") || isOp("-") || isOp("||")) { const o = tk[p++].v; l = { k: "bin", o, l, r: mulE() }; } return l; }
    function mulE() { let l = unE(); while (isOp("*") || isOp("/") || isOp("%")) { const o = tk[p++].v; l = { k: "bin", o, l, r: unE() }; } return l; }
    function unE() { if (opt("-")) return { k: "neg", e: unE() }; return prim(); }
    function prim() {
      const x = peek(); if (!x) fail();
      if (x.t === "num" || x.t === "str") { p++; return { k: "lit", v: x.v }; }
      if (x.t === "param") { p++; return { k: "param", i: paramIdx++ }; }
      if (x.t === "nparam") { p++; return { k: "nparam", n: x.v }; }
      if (isKw("NULL")) { p++; return { k: "lit", v: null }; }
      if (isKw("TRUE")) { p++; return { k: "lit", v: 1 }; }
      if (isKw("FALSE")) { p++; return { k: "lit", v: 0 }; }
      if (isOp("(")) { p++; const e = expr(); op(")"); return e; }
      if (x.t === "id" && /^current_(timestamp|date)$/i.test(x.v)) { p++; return { k: "fn", n: x.v.toUpperCase(), args: [] }; }
      if (x.t === "id" || x.t === "kw") {
        const name = ident();
        if (isOp("(")) {
          p++; const n = name.toUpperCase(); let distinct = false, args = [];
          if (isOp("*")) { p++; args = [{ k: "star" }]; }
          else if (!isOp(")")) { distinct = opt("DISTINCT"); args.push(expr()); while (opt(",")) args.push(expr()); }
          op(")"); return { k: "fn", n, args, distinct };
        }
        if (isOp(".")) { p++; if (isOp("*")) { p++; return { k: "tstar", t: name }; } return { k: "col", t: name, c: ident() }; }
        return { k: "col", c: name };
      }
      fail();
    }

    function select() {
      kw("SELECT"); const distinct = opt("DISTINCT"); const cols = [];
      do {
        const s = p;
        if (isOp("*")) { p++; cols.push({ star: true }); continue; }
        const e = expr(); let as = null;
        if (opt("AS")) as = ident(); else if (peek() && peek().t === "id") as = ident();
        cols.push({ e, as, src: sqlSrc(s, p) });
      } while (opt(","));
      const st = { type: "select", distinct, cols, joins: [] };
      if (opt("FROM")) {
        st.from = ident(); st.alias = st.from;
        if (opt("AS") || (peek() && peek().t === "id")) st.alias = ident();
        for (;;) {
          let jt = null;
          if (isKw("JOIN")) jt = "INNER"; else if (isKw("INNER") && isKw("JOIN", 1)) { p++; jt = "INNER"; } else if (isKw("LEFT")) { p++; opt("OUTER"); jt = "LEFT"; }
          if (!jt) break; kw("JOIN");
          const t = ident(); let a = t; if (opt("AS") || (peek() && peek().t === "id")) a = ident();
          kw("ON"); st.joins.push({ type: jt, table: t, alias: a, on: expr() });
        }
      }
      if (opt("WHERE")) st.where = expr();
      if (opt("GROUP")) { kw("BY"); st.group = [expr()]; while (opt(",")) st.group.push(expr()); }
      if (opt("HAVING")) st.having = expr();
      if (opt("ORDER")) { kw("BY"); st.order = []; do { const e = expr(); let dir = 1; if (opt("DESC")) dir = -1; else opt("ASC"); st.order.push({ e, dir }); } while (opt(",")); }
      if (opt("LIMIT")) { st.limit = expr(); if (opt("OFFSET")) st.offset = expr(); else if (opt(",")) { st.offset = st.limit; st.limit = expr(); } }
      return st;
    }
    const sqlSrc = (a, b) => tk.slice(a, b).map(x => x.t === "str" ? "'" + x.v + "'" : x.t === "param" ? "?" : x.v).join(" ").replace(/ \( /g, "(").replace(/\( /g, "(").replace(/ \)/g, ")").replace(/ \. /g, ".").replace(/ ,/g, ",");

    let st;
    if (isKw("SELECT")) st = select();
    else if (isKw("INSERT")) {
      p++; if (isKw("OR")) { p++; ident(); } kw("INTO"); st = { type: "insert", table: ident(), cols: null, rows: [] };
      if (isOp("(")) { p++; st.cols = [ident()]; while (opt(",")) st.cols.push(ident()); op(")"); }
      kw("VALUES");
      do { op("("); const r = [expr()]; while (opt(",")) r.push(expr()); op(")"); st.rows.push(r); } while (opt(","));
    } else if (isKw("UPDATE")) {
      p++; st = { type: "update", table: ident(), sets: [] }; kw("SET");
      do { const c = ident(); op("="); st.sets.push({ c, e: expr() }); } while (opt(","));
      if (opt("WHERE")) st.where = expr();
    } else if (isKw("DELETE")) {
      p++; kw("FROM"); st = { type: "delete", table: ident() }; if (opt("WHERE")) st.where = expr();
    } else if (isKw("CREATE")) {
      p++; kw("TABLE"); st = { type: "create", ifNot: false, cols: [] };
      if (opt("IF")) { kw("NOT"); kw("EXISTS"); st.ifNot = true; }
      st.table = ident(); op("(");
      do {
        if (isKw("PRIMARY") || isKw("FOREIGN") || isKw("UNIQUE") || isKw("CHECK") || isKw("CONSTRAINT")) {
          let depth = 0; while (peek() && !(depth === 0 && (isOp(",") || isOp(")")))) { if (isOp("(")) depth++; if (isOp(")")) depth--; p++; } continue;
        }
        const col = { name: ident(), type: "", pk: false, auto: false, notNull: false, unique: false, def: undefined };
        while (peek() && !isOp(",") && !isOp(")")) {
          if (opt("PRIMARY")) { kw("KEY"); col.pk = true; opt("ASC"); opt("DESC"); }
          else if (opt("AUTOINCREMENT")) col.auto = true;
          else if (opt("NOT")) { kw("NULL"); col.notNull = true; }
          else if (opt("NULL")) {}
          else if (opt("UNIQUE")) col.unique = true;
          else if (opt("DEFAULT")) { if (isOp("(")) { p++; col.def = expr(); op(")"); } else col.def = prim(); }
          else if (opt("REFERENCES")) { ident(); if (isOp("(")) { p++; ident(); op(")"); } while (isKw("ON")) { p++; p++; if (isKw("CASCADE") || (peek() && peek().t === "id")) p++; if (peek() && peek().t === "id") p++; } }
          else if (opt("CHECK")) { op("("); let d = 1; while (d > 0 && peek()) { if (isOp("(")) d++; if (isOp(")")) d--; p++; } }
          else if (isOp("(")) { p++; while (peek() && !isOp(")")) p++; op(")"); }
          else { const x = tk[p++]; col.type += (col.type ? " " : "") + x.v; }
        }
        st.cols.push(col);
      } while (opt(","));
      op(")");
    } else if (isKw("DROP")) {
      p++; kw("TABLE"); st = { type: "drop" }; if (opt("IF")) { kw("EXISTS"); st.ifExists = true; } st.table = ident();
    } else if (isKw("PRAGMA")) { p = tk.length; st = { type: "noop" }; }
    else fail();
    opt(";");
    if (p < tk.length) fail();
    st.paramCount = paramIdx;
    return st;
  }
  function splitSql(sql) {
    const out = []; let cur = "", q = null;
    for (const c of sql) { if (q) { if (c === q) q = null; } else if (c === "'" || c === '"') q = c; if (c === ";" && !q) { if (cur.trim()) out.push(cur); cur = ""; } else cur += c; }
    if (cur.trim()) out.push(cur); return out;
  }
  const AGG = new Set(["COUNT", "SUM", "AVG", "MIN", "MAX", "TOTAL", "GROUP_CONCAT"]);
  const hasAgg = e => !!e && typeof e === "object" && ((e.k === "fn" && AGG.has(e.n)) || Object.values(e).some(v => Array.isArray(v) ? v.some(hasAgg) : (v && typeof v === "object" && hasAgg(v))));
  const truthy = v => v !== null && v !== undefined && v !== 0 && v !== "" && v !== false;
  const cmp = (a, b) => { if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1; if (b === null || b === undefined) return 1; if (typeof a === "number" && typeof b === "number") return a - b; return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0; };
  const nowIso = () => new Date().toISOString().replace("T", " ").slice(0, 19);

  class Database {
    constructor(file) {
      this.name = file || ":memory:"; this.tables = {}; this.open = true; this.memory = !file || file === ":memory:";
      DBS.push(this);
    }
    _evalFactory(params) {
      const pos = Array.isArray(params) ? params : [];
      const named = params && !Array.isArray(params) ? params : (pos.length === 1 && pos[0] && typeof pos[0] === "object" && !Array.isArray(pos[0]) ? pos[0] : {});
      const bind = v => { if (v === undefined) throw new SqliteError("Thiếu tham số cho dấu ? trong câu SQL (truyền thiếu giá trị)", "SQLITE_RANGE"); if (typeof v === "boolean") return v ? 1 : 0; if (v instanceof Date) return v.toISOString(); if (v !== null && typeof v === "object") throw new TypeError("SQLite chỉ nhận số, chuỗi hoặc null – không truyền object/mảng"); return v; };
      const ev = (e, env, group) => {
        switch (e.k) {
          case "lit": return e.v;
          case "param": return bind(pos[e.i]);
          case "nparam": return bind(named[e.n]);
          case "col": {
            if (e.t) { const r = env[e.t]; if (!r) throw new SqliteError("no such column: " + e.t + "." + e.c); if (!(e.c in r)) throw new SqliteError("no such column: " + e.t + "." + e.c); return r[e.c]; }
            for (const a in env) { if (env[a] && e.c in env[a]) return env[a][e.c]; }
            if (env.__out && e.c in env.__out) return env.__out[e.c];
            throw new SqliteError("no such column: " + e.c);
          }
          case "neg": return -ev(e.e, env, group);
          case "not": { const v = ev(e.e, env, group); return v === null ? null : (truthy(v) ? 0 : 1); }
          case "isnull": { const v = ev(e.e, env, group); const r = v === null || v === undefined; return (e.neg ? !r : r) ? 1 : 0; }
          case "like": {
            const v = ev(e.e, env, group), pat = ev(e.pat, env, group); if (v === null || pat === null) return null;
            const re = new RegExp("^" + String(pat).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".") + "$", "i");
            const r = re.test(String(v)); return (e.neg ? !r : r) ? 1 : 0;
          }
          case "in": { const v = ev(e.e, env, group); const r = e.list.some(x => cmp(ev(x, env, group), v) === 0); return (e.neg ? !r : r) ? 1 : 0; }
          case "between": { const v = ev(e.e, env, group); const r = cmp(v, ev(e.a, env, group)) >= 0 && cmp(v, ev(e.b, env, group)) <= 0; return (e.neg ? !r : r) ? 1 : 0; }
          case "bin": {
            if (e.o === "AND") { const a = ev(e.l, env, group); if (a !== null && !truthy(a)) return 0; const b = ev(e.r, env, group); if (b !== null && !truthy(b)) return 0; return a === null || b === null ? null : 1; }
            if (e.o === "OR") { const a = ev(e.l, env, group); if (truthy(a)) return 1; const b = ev(e.r, env, group); if (truthy(b)) return 1; return a === null || b === null ? null : 0; }
            const a = ev(e.l, env, group), b = ev(e.r, env, group);
            if (e.o === "||") return a === null || b === null ? null : String(a) + String(b);
            if (a === null || a === undefined || b === null || b === undefined) return null;
            switch (e.o) {
              case "=": return cmp(a, b) === 0 ? 1 : 0; case "!=": return cmp(a, b) !== 0 ? 1 : 0;
              case "<": return cmp(a, b) < 0 ? 1 : 0; case "<=": return cmp(a, b) <= 0 ? 1 : 0;
              case ">": return cmp(a, b) > 0 ? 1 : 0; case ">=": return cmp(a, b) >= 0 ? 1 : 0;
              case "+": return +a + +b; case "-": return a - b; case "*": return a * b;
              case "/": return b === 0 ? null : (Number.isInteger(a) && Number.isInteger(b) ? Math.trunc(a / b) : a / b);
              case "%": return b === 0 ? null : a % b;
            }
            return null;
          }
          case "fn": {
            if (AGG.has(e.n)) {
              if (!group) throw new SqliteError("misuse of aggregate function " + e.n + "()");
              let vals = e.args[0].k === "star" ? group.map(() => 1) : group.map(g => ev(e.args[0], g)).filter(v => v !== null && v !== undefined);
              if (e.distinct) vals = [...new Set(vals)];
              switch (e.n) {
                case "COUNT": return vals.length;
                case "SUM": return vals.length ? vals.reduce((t, v) => t + +v, 0) : null;
                case "TOTAL": return vals.reduce((t, v) => t + +v, 0);
                case "AVG": return vals.length ? vals.reduce((t, v) => t + +v, 0) / vals.length : null;
                case "MIN": return vals.length ? vals.reduce((m, v) => cmp(v, m) < 0 ? v : m) : null;
                case "MAX": return vals.length ? vals.reduce((m, v) => cmp(v, m) > 0 ? v : m) : null;
                case "GROUP_CONCAT": return vals.length ? vals.join(",") : null;
              }
            }
            const a = e.args.map(x => ev(x, env, group));
            switch (e.n) {
              case "LOWER": return a[0] === null ? null : String(a[0]).toLowerCase();
              case "UPPER": return a[0] === null ? null : String(a[0]).toUpperCase();
              case "LENGTH": return a[0] === null ? null : String(a[0]).length;
              case "ABS": return a[0] === null ? null : Math.abs(a[0]);
              case "ROUND": return a[0] === null ? null : +(+a[0]).toFixed(a[1] || 0);
              case "COALESCE": case "IFNULL": return a.find(v => v !== null && v !== undefined) ?? null;
              case "TRIM": return a[0] === null ? null : String(a[0]).trim();
              case "SUBSTR": return a[0] === null ? null : String(a[0]).substr(a[1] - 1, a[2] === undefined ? undefined : a[2]);
              case "CURRENT_TIMESTAMP": case "DATETIME": return nowIso();
              case "CURRENT_DATE": case "DATE": return nowIso().slice(0, 10);
              case "RANDOM": return Math.floor(Math.random() * 1e9);
            }
            throw new SqliteError("no such function: " + e.n);
          }
          case "star": return 1;
        }
        throw new SqliteError("biểu thức SQL không hỗ trợ");
      };
      return ev;
    }
    _table(name) { const t = this.tables[name.toLowerCase()]; if (!t) throw new SqliteError("no such table: " + name); return t; }
    _run(st, params) {
      if (!this.open) throw new TypeError("The database connection is not open");
      const ev = this._evalFactory(params);
      switch (st.type) {
        case "noop": return { changes: 0, lastInsertRowid: 0 };
        case "create": {
          const key = st.table.toLowerCase();
          if (this.tables[key]) { if (st.ifNot) return { changes: 0, lastInsertRowid: 0 }; throw new SqliteError("table " + st.table + " already exists"); }
          this.tables[key] = { name: st.table, cols: st.cols, rows: [], seq: 0 };
          return { changes: 0, lastInsertRowid: 0 };
        }
        case "drop": {
          const key = st.table.toLowerCase();
          if (!this.tables[key]) { if (st.ifExists) return { changes: 0, lastInsertRowid: 0 }; throw new SqliteError("no such table: " + st.table); }
          delete this.tables[key]; return { changes: 0, lastInsertRowid: 0 };
        }
        case "insert": {
          const t = this._table(st.table); const names = st.cols || t.cols.map(c => c.name); let last = 0;
          names.forEach(n => { if (!t.cols.some(c => c.name.toLowerCase() === n.toLowerCase())) throw new SqliteError("table " + t.name + " has no column named " + n); });
          st.rows.forEach(vals => {
            if (vals.length !== names.length) throw new SqliteError(names.length + " columns but " + vals.length + " values were supplied");
            const row = {};
            t.cols.forEach(c => { row[c.name] = c.def !== undefined ? ev(c.def, {}) : null; });
            names.forEach((n, i) => { const c = t.cols.find(c => c.name.toLowerCase() === n.toLowerCase()); row[c.name] = ev(vals[i], {}); });
            this._constraints(t, row, null);
            const pk = t.cols.find(c => c.pk && /INT/i.test(c.type));
            if (pk) { if (row[pk.name] === null || row[pk.name] === undefined) row[pk.name] = ++t.seq; else t.seq = Math.max(t.seq, +row[pk.name]); last = row[pk.name]; }
            else last = t.rows.length + 1;
            t.cols.forEach(c => { if (/INT|REAL|NUM/i.test(c.type) && typeof row[c.name] === "string" && row[c.name].trim() !== "" && !isNaN(row[c.name])) row[c.name] = +row[c.name]; });
            t.rows.push(row);
          });
          return { changes: st.rows.length, lastInsertRowid: last };
        }
        case "update": {
          const t = this._table(st.table); let n = 0;
          t.rows.forEach(row => {
            if (st.where && !truthy(ev(st.where, { [t.name]: row }))) return;
            const upd = Object.assign({}, row);
            st.sets.forEach(s => { const c = t.cols.find(c => c.name.toLowerCase() === s.c.toLowerCase()); if (!c) throw new SqliteError("no such column: " + s.c); upd[c.name] = ev(s.e, { [t.name]: row }); });
            this._constraints(t, upd, row); Object.assign(row, upd); n++;
          });
          return { changes: n, lastInsertRowid: 0 };
        }
        case "delete": {
          const t = this._table(st.table); const before = t.rows.length;
          t.rows = t.rows.filter(row => !(st.where ? truthy(ev(st.where, { [t.name]: row })) : true));
          return { changes: before - t.rows.length, lastInsertRowid: 0 };
        }
        case "select": return this._select(st, ev);
      }
    }
    _constraints(t, row, self) {
      t.cols.forEach(c => {
        const v = row[c.name];
        if ((c.notNull || (c.pk && !/INT/i.test(c.type))) && (v === null || v === undefined)) throw new SqliteError("NOT NULL constraint failed: " + t.name + "." + c.name, "SQLITE_CONSTRAINT_NOTNULL");
        if ((c.unique || c.pk) && v !== null && v !== undefined && t.rows.some(r => r !== self && cmp(r[c.name], v) === 0))
          throw new SqliteError("UNIQUE constraint failed: " + t.name + "." + c.name, c.pk ? "SQLITE_CONSTRAINT_PRIMARYKEY" : "SQLITE_CONSTRAINT_UNIQUE");
      });
    }
    _select(st, ev) {
      let envs = [{}];
      if (st.from) {
        const t = this._table(st.from);
        envs = t.rows.map(r => ({ [st.alias]: r }));
        st.joins.forEach(j => {
          const jt = this._table(j.table); const nullRow = {}; jt.cols.forEach(c => { nullRow[c.name] = null; });
          const out = [];
          envs.forEach(env => {
            let matched = false;
            jt.rows.forEach(r => { const e2 = Object.assign({}, env, { [j.alias]: r }); if (truthy(ev(j.on, e2))) { out.push(e2); matched = true; } });
            if (!matched && j.type === "LEFT") out.push(Object.assign({}, env, { [j.alias]: nullRow }));
          });
          envs = out;
        });
      }
      if (st.where) envs = envs.filter(e => truthy(ev(st.where, e)));
      const aliases = st.from ? [st.alias].concat(st.joins.map(j => j.alias)) : [];
      const tableOf = a => this._table(a === st.alias ? st.from : st.joins.find(j => j.alias === a).table);
      const project = (env, group) => {
        const out = {};
        st.cols.forEach(c => {
          if (c.star) { aliases.forEach(a => tableOf(a).cols.forEach(col => { out[col.name] = env[a] ? env[a][col.name] : null; })); return; }
          if (c.e.k === "tstar") { tableOf(c.e.t).cols.forEach(col => { out[col.name] = env[c.e.t] ? env[c.e.t][col.name] : null; }); return; }
          const name = c.as || (c.e.k === "col" ? c.e.c : c.src);
          out[name] = ev(c.e, env, group);
        });
        return out;
      };
      const aggregated = st.group || st.cols.some(c => !c.star && hasAgg(c.e)) || (st.having && hasAgg(st.having));
      let rows;
      if (aggregated) {
        const groups = new Map();
        if (st.group) envs.forEach(e => { const k = JSON.stringify(st.group.map(g => ev(g, e))); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(e); });
        else groups.set("all", envs);
        rows = [];
        groups.forEach(g => {
          const first = g[0] || {};
          if (st.having && !truthy(ev(st.having, first, g))) return;
          rows.push({ out: project(first, g), env: first, group: g });
        });
      } else rows = envs.map(e => ({ out: project(e, null), env: e, group: null }));
      if (st.order) {
        const key = (r, o) => {
          if (o.e.k === "col" && !o.e.t && o.e.c in r.out) return r.out[o.e.c];
          if (o.e.k === "lit" && typeof o.e.v === "number") return Object.values(r.out)[o.e.v - 1];
          return ev(o.e, Object.assign({ __out: r.out }, r.env), r.group);
        };
        rows.sort((a, b) => { for (const o of st.order) { const d = cmp(key(a, o), key(b, o)); if (d) return d * o.dir; } return 0; });
      }
      let out = rows.map(r => r.out);
      if (st.distinct) { const seen = new Set(); out = out.filter(r => { const k = JSON.stringify(r); if (seen.has(k)) return false; seen.add(k); return true; }); }
      const off = st.offset ? +ev(st.offset, {}) : 0;
      if (st.limit) { const lim = +ev(st.limit, {}); out = out.slice(off, lim < 0 ? undefined : off + lim); } else if (off) out = out.slice(off);
      return out;
    }
    exec(sql) { splitSql(sql).forEach(s => this._run(sqlParse(s), [])); return this; }
    prepare(sql) {
      const parts = splitSql(sql);
      if (parts.length !== 1) throw new RangeError("The supplied SQL string contains more than one statement");
      const st = sqlParse(parts[0]); const db = this; const isSelect = st.type === "select";
      const stmt = {
        source: sql, reader: isSelect,
        run: (...p) => { const r = db._run(st, p); return Array.isArray(r) ? { changes: 0, lastInsertRowid: 0 } : r; },
        get: (...p) => { if (!isSelect) throw new TypeError("This statement does not return data. Use run() instead"); return db._run(st, p)[0]; },
        all: (...p) => { if (!isSelect) throw new TypeError("This statement does not return data. Use run() instead"); return db._run(st, p); },
        iterate: (...p) => stmt.all(...p)[Symbol.iterator](),
        pluck: () => { const all = stmt.all, get = stmt.get; stmt.all = (...p) => all(...p).map(r => Object.values(r)[0]); stmt.get = (...p) => { const r = get(...p); return r && Object.values(r)[0]; }; return stmt; }
      };
      return stmt;
    }
    transaction(fn) {
      const db = this;
      return function (...args) {
        const snap = JSON.stringify(db.tables);
        try { return fn.apply(this, args); } catch (e) { db.tables = JSON.parse(snap); throw e; }
      };
    }
    pragma() { return []; }
    close() { this.open = false; return this; }
  }
  Database.SqliteError = SqliteError;
  const DBS = [];

  /* ===================== HTTP: request / response ===================== */
  let SERVER = null;   // { handle(req, res) , port }
  class ServerResponse extends EventEmitter {
    constructor(done) { super(); this.statusCode = 200; this.statusMessage = ""; this._h = {}; this._body = ""; this.headersSent = false; this.finished = false; this.writableEnded = false; this.locals = {}; this._done = done; }
    _guard() { if (this.headersSent) { const e = new Error("Cannot set headers after they are sent to the client"); e.code = "ERR_HTTP_HEADERS_SENT"; throw e; } }
    setHeader(k, v) { this._guard(); this._h[k.toLowerCase()] = v; return this; }
    getHeader(k) { return this._h[k.toLowerCase()]; }
    getHeaders() { return Object.assign({}, this._h); }
    hasHeader(k) { return k.toLowerCase() in this._h; }
    removeHeader(k) { delete this._h[k.toLowerCase()]; }
    writeHead(code, msg, headers) { this._guard(); if (typeof msg === "object") headers = msg; this.statusCode = code; Object.keys(headers || {}).forEach(k => { this._h[k.toLowerCase()] = headers[k]; }); this.headersSent = true; return this; }
    write(chunk) { if (this.finished) throw new Error("write after end"); this.headersSent = true; this._body += chunk instanceof Uint8Array ? bytesToStr(chunk) : String(chunk); return true; }
    end(chunk) {
      if (this.finished) return this;
      if (chunk !== undefined && chunk !== null && typeof chunk !== "function") this._body += chunk instanceof Uint8Array ? bytesToStr(chunk) : String(chunk);
      this.headersSent = true; this.finished = this.writableEnded = true;
      this._done({ status: this.statusCode, statusText: this.statusMessage || STATUS_TEXT[this.statusCode] || "", headers: Object.assign({}, this._h), body: this._body });
      this.emit("finish"); return this;
    }
    /* --- Phần mở rộng của Express --- */
    status(c) { this.statusCode = +c; return this; }
    set(k, v) { if (typeof k === "object") Object.keys(k).forEach(x => this.setHeader(x, k[x])); else this.setHeader(k, v); return this; }
    header(k, v) { return this.set(k, v); }
    get(k) { return this.getHeader(k); }
    append(k, v) { const o = this.getHeader(k); this.setHeader(k, o ? [].concat(o, v) : v); return this; }
    type(t) { const map = { json: "application/json", html: "text/html", text: "text/plain", txt: "text/plain" }; return this.set("content-type", (map[t] || t) + (/json|text|html/.test(map[t] || t) ? "; charset=utf-8" : "")); }
    json(obj) { this._guard(); if (!this.getHeader("content-type")) this.setHeader("content-type", "application/json; charset=utf-8"); return this.end(JSON.stringify(obj === undefined ? null : obj)); }
    send(body) {
      this._guard();
      if (body === null || body === undefined) return this.end("");
      if (typeof body === "object" && !(body instanceof Uint8Array)) return this.json(body);
      if (typeof body === "boolean" || typeof body === "number") return this.json(body);
      if (!this.getHeader("content-type")) this.setHeader("content-type", "text/html; charset=utf-8");
      return this.end(body);
    }
    sendStatus(c) { this.statusCode = c; this.setHeader("content-type", "text/plain; charset=utf-8"); return this.end(STATUS_TEXT[c] || String(c)); }
    redirect(a, b) { const code = typeof a === "number" ? a : 302, url = typeof a === "number" ? b : a; this.statusCode = code; this.setHeader("location", url); return this.end("Redirecting to " + url); }
    location(u) { return this.set("location", u); }
    cookie(n, v, o) { o = o || {}; let c = n + "=" + encodeURIComponent(typeof v === "object" ? "j:" + JSON.stringify(v) : v); if (o.httpOnly) c += "; HttpOnly"; if (o.maxAge) c += "; Max-Age=" + Math.floor(o.maxAge / 1000); if (o.secure) c += "; Secure"; if (o.sameSite) c += "; SameSite=" + o.sameSite; c += "; Path=" + (o.path || "/"); return this.append("set-cookie", c); }
    clearCookie(n) { return this.append("set-cookie", n + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"); }
    sendFile(p) { try { const s = fs.readFileSync(p, "utf8"); const ext = pathMod.extname(p); this.type(ext === ".json" ? "json" : ext === ".html" ? "html" : "text"); return this.end(s); } catch (e) { this.statusCode = 404; return this.end("Not Found"); } }
  }
  class IncomingMessage extends EventEmitter {
    constructor(r) {
      super();
      this.method = r.method; this.url = r.url; this.originalUrl = r.url; this.headers = r.headers; this.httpVersion = "1.1";
      this._raw = r.body; this.socket = { remoteAddress: "127.0.0.1" }; this.ip = "127.0.0.1"; this.ips = []; this.protocol = "http"; this.secure = false;
      this.hostname = "localhost"; this.baseUrl = ""; this.params = {}; this.body = undefined;
      const q = r.url.indexOf("?"); this._rel = decodeURI(q >= 0 ? r.url.slice(0, q) : r.url) || "/";
      const query = {}; new URLSearchParams(q >= 0 ? r.url.slice(q + 1) : "").forEach((v, k) => { query[k] = k in query ? [].concat(query[k], v) : v; });
      Object.defineProperty(this, "query", { value: query, writable: true, enumerable: true, configurable: true });
      setTimeout(() => { if (this._raw) this.emit("data", BufferShim.from(this._raw)); this.emit("end"); }, 0);
    }
    get path() { return this._rel; }
    get(h) { h = h.toLowerCase(); if (h === "referer" || h === "referrer") return this.headers.referer || this.headers.referrer; return this.headers[h]; }
    header(h) { return this.get(h); }
    is(t) { const ct = this.headers["content-type"] || ""; return ct.includes(t === "json" ? "json" : t) ? t : false; }
    async *[Symbol.asyncIterator]() { if (this._raw) yield BufferShim.from(this._raw); }
  }

  /* ===================== express (giống Express 5) ===================== */
  function pathRegex(pattern, prefix) {
    if (pattern instanceof RegExp) return { re: pattern, keys: [] };
    const keys = [];
    let src = String(pattern).replace(/\/+$/, "").replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\/:(\w+)/g, (_, k) => { keys.push(k); return "/([^/]+?)"; })
      .replace(/\/\*(\w*)/g, (_, k) => { keys.push(k || "0"); return "/(.*)"; });
    return { re: new RegExp("^" + src + (prefix ? "(?=/|$)" : "/?$"), "i"), keys };
  }
  function makeRouter(isApp) {
    const r = function (req, res, next) { return r.handle(req, res, next); };
    r.stack = []; r.__router = true;
    const add = (method, path, fns, prefix) => {
      fns.flat(Infinity).forEach(fn => {
        if (typeof fn !== "function") throw new TypeError("Route." + (method || "use").toLowerCase() + "() requires a callback function but got a " + typeof fn);
        r.stack.push(Object.assign({ method, path, fn, prefix }, pathRegex(path, prefix)));
      });
      return r;
    };
    r.use = (path, ...fns) => { if (typeof path !== "string" && !(path instanceof RegExp)) { fns = [path, ...fns]; path = "/"; } return add(null, path === "/" ? "" : path, fns, true); };
    ["get", "post", "put", "patch", "delete", "options", "head", "all"].forEach(m => {
      r[m] = (path, ...fns) => {
        if (isApp && m === "get" && fns.length === 0) return r.settings[path];
        return add(m === "all" ? null : m.toUpperCase(), path, fns, false);
      };
    });
    r.route = path => { const o = {}; ["get", "post", "put", "patch", "delete", "all"].forEach(m => { o[m] = (...fns) => { r[m](path, ...fns); return o; }; }); return o; };
    r.param = () => r;
    r.handle = (req, res, out) => {
      let idx = 0; const rel = req._rel, base = req.baseUrl, params = req.params;
      const next = err => {
        req._rel = rel; req.baseUrl = base; req.params = params;
        if (err === "route" || err === "router") err = undefined;
        if (res.finished) { if (err) console.error((err.name || "Error") + ": " + (err.message || err)); return; }
        const L = r.stack[idx++];
        if (!L) return out ? out(err) : finalHandler(req, res, err);
        const path = rel === "" ? "/" : rel;
        const m = L.prefix && L.path === "" ? [""] : L.re.exec(path);
        if (!m) return next(err);
        if (L.method && L.method !== req.method && !(L.method === "GET" && req.method === "HEAD")) return next(err);
        const isErr = L.fn.length === 4;
        if (err && !isErr) return next(err);
        if (!err && isErr) return next();
        const p = {}; L.keys.forEach((k, i) => { try { p[k] = decodeURIComponent(m[i + 1]); } catch (e) { p[k] = m[i + 1]; } });
        req.params = Object.assign({}, L.prefix ? params : {}, p);
        if (L.prefix) { req.baseUrl = base + m[0]; req._rel = path.slice(m[0].length) || "/"; }
        try {
          const ret = err ? L.fn(err, req, res, next) : L.fn(req, res, next);
          if (ret && typeof ret.then === "function") ret.then(null, e => next(e || new Error("Promise bị reject")));
        } catch (e) { next(e); }
      };
      next();
    };
    return r;
  }
  function finalHandler(req, res, err) {
    if (res.finished) return;
    if (err) {
      const code = err.status || err.statusCode || 500;
      if (code >= 500) console.error((err.name || "Error") + ": " + (err.message || err) + "\n    (lỗi chưa được xử lý – Express trả 500)");
      res.statusCode = code; res._h = { "content-type": "text/html; charset=utf-8" };
      res.headersSent = false; res.end(code >= 500 ? "Internal Server Error" : (err.expose === false ? STATUS_TEXT[code] : err.message || STATUS_TEXT[code]));
    } else {
      res.statusCode = 404; res._h = { "content-type": "text/html; charset=utf-8" };
      res.end("Cannot " + req.method + " " + (req._origPath || req.path));
    }
  }
  function express() {
    const app = makeRouter(true);
    app.settings = { "x-powered-by": true, env: env.NODE_ENV || "development" }; app.locals = {};
    app.set = (k, v) => { app.settings[k] = v; return app; };
    app.enable = k => app.set(k, true); app.disable = k => app.set(k, false);
    app.listen = (port, host, cb) => {
      if (typeof port === "function") { cb = port; port = 3000; }
      if (typeof host === "function") cb = host;
      SERVER = { port: +port || 3000, handle: (req, res) => { if (app.settings["x-powered-by"]) res.setHeader("x-powered-by", "Express"); req._origPath = req._rel; req.app = app; res.app = app; req.res = res; res.req = req; app.handle(req, res, null); } };
      post({ type: "listening", port: SERVER.port });
      const srv = new EventEmitter(); srv.close = c => { SERVER = null; c && c(); return srv; }; srv.address = () => ({ port: SERVER ? SERVER.port : 0, address: "::" });
      if (cb) setTimeout(() => cb(), 0);
      return srv;
    };
    return app;
  }
  express.Router = () => makeRouter(false);
  express.json = (opts) => (req, res, next) => {
    const ct = req.headers["content-type"] || "";
    if (!/json/i.test(ct)) return next();
    const raw = req._raw || "";
    if (opts && opts.limit && utf8(raw).length > parseInt(opts.limit) * (/kb/i.test(opts.limit) ? 1024 : /mb/i.test(opts.limit) ? 1048576 : 1)) {
      const e = new Error("request entity too large"); e.status = 413; e.type = "entity.too.large"; return next(e);
    }
    if (!raw.trim()) { req.body = {}; return next(); }
    try { req.body = JSON.parse(raw); next(); }
    catch (e) { const err = new SyntaxError(e.message); err.status = 400; err.type = "entity.parse.failed"; err.body = raw; next(err); }
  };
  express.urlencoded = () => (req, res, next) => {
    if (!/x-www-form-urlencoded/i.test(req.headers["content-type"] || "")) return next();
    const o = {}; new URLSearchParams(req._raw || "").forEach((v, k) => { o[k] = v; }); req.body = o; next();
  };
  express.text = () => (req, res, next) => { if (/text\//i.test(req.headers["content-type"] || "")) req.body = req._raw || ""; next(); };
  express.static = dir => (req, res, next) => {
    const f = pathMod.join(abs(dir), req.path === "/" ? "index.html" : req.path);
    if (req.method === "GET" && f in FILES) return res.sendFile(f);
    next();
  };
  const cors = (opts) => (req, res, next) => {
    opts = opts || {};
    const origin = opts.origin === undefined ? "*" : (Array.isArray(opts.origin) ? (opts.origin.includes(req.headers.origin) ? req.headers.origin : "") : opts.origin === true ? (req.headers.origin || "*") : opts.origin);
    if (origin) res.setHeader("access-control-allow-origin", origin);
    if (opts.credentials) res.setHeader("access-control-allow-credentials", "true");
    if (req.method === "OPTIONS") {
      res.setHeader("access-control-allow-methods", (opts.methods || ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]).join(","));
      res.setHeader("access-control-allow-headers", req.headers["access-control-request-headers"] || "Content-Type,Authorization");
      res.statusCode = 204; return res.end();
    }
    next();
  };

  /* ===================== http module ===================== */
  const http = {
    STATUS_CODES: STATUS_TEXT,
    createServer(handler) {
      const srv = new EventEmitter();
      if (handler) srv.on("request", handler);
      srv.listen = (port, host, cb) => {
        if (typeof port === "function") { cb = port; port = 3000; }
        if (typeof host === "function") cb = host;
        SERVER = { port: +port || 3000, handle: (req, res) => srv.emit("request", req, res) };
        post({ type: "listening", port: SERVER.port });
        if (cb) setTimeout(() => cb(), 0);
        return srv;
      };
      srv.close = c => { SERVER = null; c && c(); return srv; };
      srv.address = () => ({ port: SERVER ? SERVER.port : 0 });
      return srv;
    }
  };

  /* ===================== Gửi request vào server mô phỏng ===================== */
  function request(method, url, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      const t0 = PERF.now();
      if (!SERVER) return resolve({ status: 0, error: "Server chưa chạy – bạn đã gọi app.listen(...) chưa? (hoặc code đang bị lỗi, xem Terminal)" });
      let body = opts.body, headers = lowerKeys(opts.headers);
      if (body !== undefined && body !== null && typeof body !== "string") { body = JSON.stringify(body); if (!headers["content-type"]) headers["content-type"] = "application/json"; }
      if (body && !headers["content-type"]) headers["content-type"] = /^\s*[[{]/.test(body) ? "application/json" : "text/plain";
      headers = Object.assign({ host: "localhost:" + SERVER.port, "user-agent": "academy-api-tester/1.0", accept: "*/*" }, headers);
      if (body) headers["content-length"] = String(utf8(body).length);
      const path = (url || "/").startsWith("/") ? url || "/" : "/" + url;
      let finished = false;
      const timer = setTimeout(() => { if (!finished) { finished = true; resolve({ status: 0, error: "Server không trả lời sau 3 giây – có route nào quên gọi res.send()/res.json() hoặc next() không?" }); } }, 3000);
      const res = new ServerResponse(r => {
        if (finished) return; finished = true; clearTimeout(timer);
        r.ms = Math.round(PERF.now() - t0);
        r.text = r.body;
        if (/json/i.test(r.headers["content-type"] || "")) { try { r.body = JSON.parse(r.body); } catch (e) {} }
        resolve(r);
      });
      const req = new IncomingMessage({ method: String(method || "GET").toUpperCase(), url: path, headers, body: body || "" });
      try { SERVER.handle(req, res); }
      catch (e) { console.error(e.name + ": " + e.message); if (!res.finished) { res.statusCode = 500; res.headersSent = false; res.end("Internal Server Error"); } }
    });
  }

  /* ===================== require ===================== */
  const MODULES = {
    express, http, https: http, fs, "fs/promises": fs.promises, path: pathMod, events: Object.assign(EventEmitter, { EventEmitter }),
    util, os, crypto: cryptoMod, bcryptjs: bcrypt, bcrypt, jsonwebtoken: jwt, dotenv, cors, assert, "assert/strict": assert,
    "better-sqlite3": Database, buffer: { Buffer: BufferShim }, process: proc
  };
  const LOCAL = {};   // module do học viên định nghĩa: __node.define('./math', exports)
  function req(name) {
    name = String(name).replace(/^node:/, "");
    if (name === "dotenv/config") { dotenv.config(); return {}; }
    if (name in MODULES) return MODULES[name];
    const key = pathMod.normalize(name).replace(/\.js$/, "");
    if (key in LOCAL) return LOCAL[key];
    const e = new Error("Cannot find module '" + name + "'\n   → Môi trường mô phỏng hỗ trợ: " + Object.keys(MODULES).filter(k => k !== "process").join(", "));
    e.code = "MODULE_NOT_FOUND"; throw e;
  }

  /* ===================== Gắn biến toàn cục ===================== */
  const mod = { exports: {}, id: ".", filename: "/app/server.js", loaded: false };
  Object.assign(W, {
    require: req, module: mod, exports: mod.exports, process: proc, __dirname: "/app", __filename: "/app/server.js",
    global: W, Buffer: BufferShim, setImmediate: (f, ...a) => setTimeout(f, 0, ...a), clearImmediate: clearTimeout
  });
  console.table = data => console.log(JSON.stringify(data, null, 2));
  console.dir = data => console.log(JSON.stringify(data, null, 2));
  W.__node = {
    request, files: FILES, dbs: DBS,
    get server() { return SERVER; },
    define: (name, exp) => { LOCAL[pathMod.normalize(name).replace(/\.js$/, "")] = exp; },
    read: p => FILES[abs(p)]
  };

  /* Bảng API tester gửi request qua postMessage */
  W.addEventListener("message", async e => {
    const d = e.data;
    if (!d || d.__fe !== CONFIG.pgId || d.type !== "api-request") return;
    const r = await request(d.method, d.url, { body: d.body, headers: d.headers });
    post({ type: "api-response", id: d.id, result: { status: r.status, statusText: r.statusText, headers: r.headers, text: r.text, error: r.error, ms: r.ms } });
  });
}
