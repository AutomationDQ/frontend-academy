/* =========================================================
   PLAYGROUND – trình soạn code + chạy thử trong iframe
   - 3 tab HTML / CSS / JS
   - Kết quả hiển thị trong iframe (srcdoc), console được bắt lại
   - check(): chạy đoạn mã chấm bài BÊN TRONG iframe, nhận kết quả qua postMessage
   - runtime "node": chỉ có tab server.js, chèn Node mô phỏng (node-runtime.js),
     khung xem trước thay bằng API Tester + Terminal
   ========================================================= */
(function () {
  const TAB_META = {
    html: { label: "HTML", color: "#f97316" },
    css: { label: "CSS", color: "#3b82f6" },
    js: { label: "JS", color: "#eab308" }
  };

  let uid = 0;
  const escHtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  class Playground {
    constructor(container, opts = {}) {
      this.id = "pg" + (++uid);
      this.container = container;
      this.code = Object.assign({ html: "", css: "", js: "" }, opts.code || {});
      this.runtime = opts.runtime === "node" ? "node" : "web";
      this.nodeConfig = opts.nodeConfig || {};
      this.requests = opts.requests || [];
      this.active = this.runtime === "node" ? "js" : (opts.active || "html");
      this.autoRun = opts.autoRun !== false;
      this.onChange = opts.onChange || function () {};
      this.pending = {};
      this.full = !!opts.full;
      this.render();
      this.bindMessages();
      this.run();
    }

    /* ---------- Giao diện ---------- */
    render() {
      const node = this.runtime === "node";
      const keys = node ? ["js"] : Object.keys(TAB_META);
      const tabs = keys.map(k =>
        `<button class="pg-tab ${k === this.active ? "active" : ""}" data-tab="${k}">
           <span class="dot" style="background:${node ? "#65a30d" : TAB_META[k].color}"></span>${node ? "server.js" : TAB_META[k].label}
         </button>`).join("");
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
      const outputTop = node ? `
              <div class="api-box">
                <div class="preview-head api-head">🌐 API Tester <span class="srv-status">⏳ Đang khởi động…</span></div>
                <div class="api-presets"></div>
                <div class="api-row">
                  <select class="api-method">${methods.map(m => `<option>${m}</option>`).join("")}</select>
                  <input class="api-url" value="/" spellcheck="false" aria-label="Đường dẫn">
                  <button class="btn sm primary api-send">Gửi ➤</button>
                </div>
                <input class="api-headers" placeholder="Header (tuỳ chọn) – vd: Authorization: Bearer <token>" spellcheck="false" aria-label="Header">
                <textarea class="api-body" placeholder='Body JSON – vd: {"title": "Học Node.js"}' spellcheck="false" aria-label="Body"></textarea>
                <div class="api-res"><div class="api-res-head muted">Chọn yêu cầu mẫu hoặc nhập đường dẫn rồi bấm <b>Gửi</b>.</div><pre class="api-res-body"></pre></div>
                <div class="frame-holder node-frame" aria-hidden="true"></div>
              </div>` : `
              <div class="preview-box">
                <div class="preview-head">
                  <span class="dots"><span style="background:#ef4444"></span><span style="background:#f59e0b"></span><span style="background:#22c55e"></span></span>
                  Xem trước
                </div>
                <div class="frame-holder" style="min-height:0"></div>
              </div>`;

      this.container.innerHTML = `
        <div class="pg ${this.full ? "full" : ""} ${node ? "node" : ""}">
          <div class="pg-toolbar">
            ${tabs}
            <span class="pg-spacer"></span>
            <label class="pg-toggle"><input type="checkbox" class="auto" ${this.autoRun ? "checked" : ""}> Tự chạy</label>
            <button class="btn sm primary run" title="Ctrl + Enter">▶ Chạy</button>
          </div>
          <div class="pg-split">
            <div class="editor-wrap">
              <div class="line-nums">1</div>
              <textarea class="editor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
            </div>
            <div class="output">${outputTop}
              <div class="console">
                <div class="console-head"><span>${node ? "💻 Terminal" : "🖥️ Console"}</span><button class="clear">Xoá</button></div>
                <div class="logs"></div>
              </div>
            </div>
          </div>
        </div>`;

      const $ = s => this.container.querySelector(s);
      this.editor = $(".editor");
      this.lineNums = $(".line-nums");
      this.frameHolder = $(".frame-holder");
      this.frameHolder.style.height = "100%";
      this.logsEl = $(".logs");
      this.editor.value = this.code[this.active];
      this.updateLines();

      this.container.querySelectorAll(".pg-tab").forEach(b =>
        b.addEventListener("click", () => this.switchTab(b.dataset.tab)));
      $(".run").addEventListener("click", () => this.run());
      $(".auto").addEventListener("change", e => { this.autoRun = e.target.checked; });
      $(".clear").addEventListener("click", () => { this.logsEl.innerHTML = ""; });

      this.editor.addEventListener("input", () => {
        this.code[this.active] = this.editor.value;
        this.updateLines();
        this.onChange(this.getCode());
        if (this.autoRun) {
          clearTimeout(this._t);
          this._t = setTimeout(() => this.run(), 700);
        }
      });
      this.editor.addEventListener("scroll", () => { this.lineNums.scrollTop = this.editor.scrollTop; });
      this.editor.addEventListener("keydown", e => this.handleKeys(e));
      if (node) this.bindApiTester();
    }

    /* ---------- API Tester (chế độ Node) ---------- */
    bindApiTester() {
      const $ = s => this.container.querySelector(s);
      const method = $(".api-method"), url = $(".api-url"), body = $(".api-body"), hdr = $(".api-headers");
      const syncBody = () => { body.style.display = ["POST", "PUT", "PATCH"].includes(method.value) ? "" : "none"; };
      method.addEventListener("change", syncBody); syncBody();
      const send = () => this.sendRequest(method.value, url.value.trim() || "/", body.value, hdr.value);
      $(".api-send").addEventListener("click", send);
      url.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); send(); } });
      this.setRequests(this.requests);
      this.container.querySelector(".api-presets").addEventListener("click", e => {
        const b = e.target.closest(".api-preset"); if (!b) return;
        const r = this.requests[+b.dataset.i];
        method.value = r.method; url.value = r.url;
        body.value = r.body === undefined ? "" : (typeof r.body === "string" ? r.body : JSON.stringify(r.body, null, 2));
        hdr.value = r.headers ? Object.entries(r.headers).map(([k, v]) => k + ": " + v).join("; ") : "";
        syncBody(); send();
      });
    }

    /* Đổi bộ yêu cầu mẫu (vd khi chuyển giữa Ví dụ mẫu ↔ Bài tập) */
    setRequests(list) {
      this.requests = list || [];
      const box = this.container.querySelector(".api-presets");
      if (!box) return;
      box.hidden = !this.requests.length;
      box.innerHTML = this.requests.map((r, i) => `<button class="chip api-preset" data-i="${i}" title="${escHtml(r.body ? "Body: " + JSON.stringify(r.body) : r.method + " " + r.url).replace(/"/g, "&quot;")}"><b class="m-${r.method.toLowerCase()}">${r.method}</b> ${escHtml(r.label || r.url)}</button>`).join("");
    }

    sendRequest(method, url, bodyText, headerText) {
      if (!this.iframe) return;
      const headers = {};
      String(headerText || "").split(/;\s*(?=[\w-]+\s*:)/).forEach(h => { const i = h.indexOf(":"); if (i > 0) headers[h.slice(0, i).trim()] = h.slice(i + 1).trim(); });
      let body;
      if (["POST", "PUT", "PATCH"].includes(method) && String(bodyText || "").trim()) {
        body = bodyText;
        if (!Object.keys(headers).some(k => k.toLowerCase() === "content-type")) {
          try { JSON.parse(bodyText); headers["Content-Type"] = "application/json"; }
          catch (e) { this.showResponse({ status: 0, error: "Body không phải JSON hợp lệ: " + e.message }, method, url); return; }
        }
      }
      const id = Date.now() + Math.random();
      this.apiPending = { id, method, url };
      this.container.querySelector(".api-res-head").innerHTML = "⏳ Đang gửi <b>" + method + " " + escHtml(url) + "</b>…";
      this.iframe.contentWindow.postMessage({ __fe: this.id, type: "api-request", id, method, url, body, headers }, "*");
    }

    showResponse(r, method, url) {
      const head = this.container.querySelector(".api-res-head"), pre = this.container.querySelector(".api-res-body");
      if (!head) return;
      if (r.error) { head.innerHTML = '<span class="st st-err">Lỗi</span> ' + escHtml(method + " " + url); pre.textContent = "⚠️ " + r.error; return; }
      const cls = r.status < 300 ? "st-ok" : r.status < 400 ? "st-warn" : "st-err";
      head.innerHTML = `<span class="st ${cls}">${r.status} ${escHtml(r.statusText || "")}</span> <b>${escHtml(method + " " + url)}</b> <span class="muted">· ${r.ms} ms · ${escHtml((r.headers && r.headers["content-type"] || "").split(";")[0] || "không có body")}</span>`;
      let text = r.text || "";
      if (/json/.test(r.headers && r.headers["content-type"] || "")) { try { text = JSON.stringify(JSON.parse(text), null, 2); } catch (e) {} }
      pre.textContent = text || "(body trống)";
    }

    switchTab(tab) {
      this.code[this.active] = this.editor.value;
      this.active = tab;
      this.container.querySelectorAll(".pg-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
      this.editor.value = this.code[tab];
      this.updateLines();
      this.editor.focus();
    }

    updateLines() {
      const n = this.editor.value.split("\n").length;
      let s = "";
      for (let i = 1; i <= n; i++) s += i + "\n";
      this.lineNums.textContent = s;
    }

    /* Phím tắt: Tab thụt lề, Enter giữ thụt lề, Ctrl+Enter chạy, tự đóng ngoặc */
    handleKeys(e) {
      const ta = this.editor;
      const { selectionStart: s, selectionEnd: en, value: v } = ta;
      const insert = (text, cursorOffset = text.length) => {
        ta.setRangeText(text, s, en, "end");
        ta.selectionStart = ta.selectionEnd = s + cursorOffset;
        ta.dispatchEvent(new Event("input"));
      };

      if ((e.ctrlKey || e.metaKey) && (e.key === "Enter" || e.key === "s")) {
        e.preventDefault(); this.run(); return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          const lineStart = v.lastIndexOf("\n", s - 1) + 1;
          if (v.substr(lineStart, 2) === "  ") {
            ta.setRangeText("", lineStart, lineStart + 2, "end");
            ta.selectionStart = ta.selectionEnd = Math.max(lineStart, s - 2);
            ta.dispatchEvent(new Event("input"));
          }
        } else insert("  ");
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        const indent = (v.slice(lineStart, s).match(/^\s*/) || [""])[0];
        const prev = v[s - 1], next = v[s];
        const opening = prev === "{" || prev === "(" || prev === "[" || (prev === ">" && this.active === "html" && next === "<");
        if (opening) {
          const t = "\n" + indent + "  " + "\n" + indent;
          insert(t, indent.length + 3);
        } else insert("\n" + indent);
        return;
      }
      const pairs = { "(": ")", "{": "}", "[": "]", '"': '"', "'": "'" };
      if (pairs[e.key] && s === en) {
        if ((e.key === '"' || e.key === "'") && v[s] === e.key) { e.preventDefault(); ta.selectionStart = ta.selectionEnd = s + 1; return; }
        e.preventDefault(); insert(e.key + pairs[e.key], 1); return;
      }
      if ([")", "}", "]"].includes(e.key) && v[s] === e.key && s === en) {
        e.preventDefault(); ta.selectionStart = ta.selectionEnd = s + 1;
      }
    }

    /* ---------- Dữ liệu ---------- */
    getCode() {
      this.code[this.active] = this.editor.value;
      return { ...this.code };
    }
    setCode(code, run = true) {
      this.code = Object.assign({ html: "", css: "", js: "" }, code);
      this.editor.value = this.code[this.active];
      this.updateLines();
      this.onChange(this.getCode());
      if (run) this.run();
    }

    /* ---------- Chạy code ---------- */
    buildDoc(code, checkScript, checkId) {
      const safeJs = (code.js || "").replace(/<\/script/gi, "<\\/script");
      const logger = `<script>
(function(){
  window.__logs = [];
  var OFFSET = __OFFSET__;
  function fmt(a){
    if (typeof a === "string") return a;
    if (a instanceof Error) return a.name + ": " + a.message;
    if (a instanceof Element) return "<" + a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + ">";
    if (typeof a === "function") return "ƒ " + (a.name || "anonymous") + "()";
    if (a === undefined) return "undefined";
    try { return JSON.stringify(a); } catch (e) { return String(a); }
  }
  function send(level, args){
    var text = Array.prototype.map.call(args, fmt).join(" ");
    if (level === "log") window.__logs.push(text);
    try { parent.postMessage({ __fe: "${this.id}", type: "console", level: level, text: text }, "*"); } catch (e) {}
  }
  ["log","info","warn","error"].forEach(function(k){
    var o = console[k];
    console[k] = function(){ send(k, arguments); o.apply(console, arguments); };
  });
  window.addEventListener("error", function(e){
    var line = e.lineno ? " (dòng " + Math.max(1, e.lineno - OFFSET) + " trong JS)" : "";
    send("error", [(e.message || "Lỗi không xác định") + line]);
  });
  window.addEventListener("unhandledrejection", function(e){
    send("error", ["Promise bị lỗi: " + ((e.reason && e.reason.message) || e.reason)]);
  });
})();
<\/script>`;

      let check = "";
      if (checkScript) {
        check = `<script>
(async function(){
  await new Promise(function(r){ setTimeout(r, 80); });
  const T = {
    src: ${JSON.stringify(code.js || "").replace(/</g, "\\u003c")},
    html: ${JSON.stringify(code.html || "").replace(/</g, "\\u003c")},
    request: (m, u, o) => window.__node ? __node.request(m, u, o) : Promise.resolve({ status: 0, error: "Không có Node runtime" }),
    file: p => window.__node ? __node.read(p) : undefined,
    server: () => !!(window.__node && __node.server),
    db: () => window.__node ? __node.dbs[__node.dbs.length - 1] : undefined,
    exports: () => window.module ? window.module.exports : undefined,
    $: s => document.querySelector(s),
    $$: s => Array.from(document.querySelectorAll(s)),
    css: (el, p) => el ? getComputedStyle(el).getPropertyValue(p).trim() : "",
    logs: window.__logs,
    sleep: ms => new Promise(r => setTimeout(r, ms)),
    click: el => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
  };
  let res;
  try { res = await (async () => { ${checkScript} })(); }
  catch (e) { res = { pass: false, msg: "Code của bạn gây lỗi khi chấm: " + e.message }; }
  parent.postMessage({ __fe: "${this.id}", type: "check", id: ${checkId}, result: res }, "*");
})();
<\/script>`;
      }

      const nodeRt = this.runtime === "node" && window.__nodeRuntime
        ? "<script>(" + window.__nodeRuntime.toString() + ")(" + JSON.stringify(Object.assign({ pgId: this.id }, this.nodeConfig)).replace(/</g, "\\u003c") + ");<\/script>"
        : "";
      const head = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,'Segoe UI',sans-serif;}</style>
${logger}${nodeRt}
<style>${code.css || ""}</style></head><body>
${code.html || ""}
<script>`;
      const offset = head.split("\n").length; // dòng 1 của JS nằm ngay sau head
      return head.replace("__OFFSET__", offset) + "\n" + safeJs + "\n<\/script>" + check + "</body></html>";
    }

    run(checkScript) {
      const code = this.getCode();
      this.logsEl.innerHTML = "";
      const checkId = Date.now() + Math.floor(Math.random() * 1000);
      const iframe = document.createElement("iframe");
      iframe.className = "preview";
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-modals allow-forms allow-popups");
      iframe.srcdoc = this.buildDoc(code, checkScript, checkId);
      this.frameHolder.innerHTML = "";
      this.frameHolder.appendChild(iframe);
      this.iframe = iframe;
      if (this.runtime === "node") {
        const st = this.container.querySelector(".srv-status");
        this.listening = false;
        if (st) { st.className = "srv-status"; st.textContent = "⏳ Đang khởi động…"; }
        clearTimeout(this._srvT);
        this._srvT = setTimeout(() => { if (!this.listening && st) { st.className = "srv-status off"; st.textContent = "⚪ Không có server (chương trình chỉ chạy script)"; } }, 600);
      }
      return checkId;
    }

    /* Chấm bài: trả về Promise<{pass,msg}> */
    check(checkScript) {
      return new Promise(resolve => {
        const id = this.run(checkScript);
        const timer = setTimeout(() => {
          delete this.pending[id];
          resolve({ pass: false, msg: "Hết thời gian chấm (có thể code bị lỗi cú pháp hoặc vòng lặp vô hạn). Xem Console nhé!" });
        }, 4000);
        this.pending[id] = r => { clearTimeout(timer); resolve(r); };
      });
    }

    bindMessages() {
      this._onMsg = e => {
        const d = e.data;
        if (!d || d.__fe !== this.id) return;
        if (d.type === "console") this.addLog(d.level, d.text);
        if (d.type === "listening") {
          this.listening = true;
          const st = this.container.querySelector(".srv-status");
          if (st) { st.className = "srv-status on"; st.textContent = "🟢 Server chạy tại http://localhost:" + d.port; }
        }
        if (d.type === "api-response" && this.apiPending && this.apiPending.id === d.id) {
          this.showResponse(d.result, this.apiPending.method, this.apiPending.url);
          this.apiPending = null;
        }
        if (d.type === "check" && this.pending[d.id]) {
          this.pending[d.id](d.result || { pass: false, msg: "Không nhận được kết quả." });
          delete this.pending[d.id];
        }
      };
      window.addEventListener("message", this._onMsg);
    }

    addLog(level, text) {
      const div = document.createElement("div");
      div.className = "log " + level;
      const icon = { log: "›", info: "ℹ", warn: "⚠", error: "✖" }[level] || "›";
      div.textContent = icon + " " + text;
      this.logsEl.appendChild(div);
      this.logsEl.parentElement.scrollTop = 1e9;
    }

    destroy() { window.removeEventListener("message", this._onMsg); }
  }

  window.Playground = Playground;
})();
