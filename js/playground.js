/* =========================================================
   PLAYGROUND – trình soạn code + chạy thử trong iframe
   - 3 tab HTML / CSS / JS
   - Kết quả hiển thị trong iframe (srcdoc), console được bắt lại
   - check(): chạy đoạn mã chấm bài BÊN TRONG iframe, nhận kết quả qua postMessage
   ========================================================= */
(function () {
  const TAB_META = {
    html: { label: "HTML", color: "#f97316" },
    css: { label: "CSS", color: "#3b82f6" },
    js: { label: "JS", color: "#eab308" }
  };

  let uid = 0;

  class Playground {
    constructor(container, opts = {}) {
      this.id = "pg" + (++uid);
      this.container = container;
      this.code = Object.assign({ html: "", css: "", js: "" }, opts.code || {});
      this.active = opts.active || "html";
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
      const tabs = Object.keys(TAB_META).map(k =>
        `<button class="pg-tab ${k === this.active ? "active" : ""}" data-tab="${k}">
           <span class="dot" style="background:${TAB_META[k].color}"></span>${TAB_META[k].label}
         </button>`).join("");

      this.container.innerHTML = `
        <div class="pg ${this.full ? "full" : ""}">
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
            <div class="output">
              <div class="preview-box">
                <div class="preview-head">
                  <span class="dots"><span style="background:#ef4444"></span><span style="background:#f59e0b"></span><span style="background:#22c55e"></span></span>
                  Xem trước
                </div>
                <div class="frame-holder" style="min-height:0"></div>
              </div>
              <div class="console">
                <div class="console-head"><span>🖥️ Console</span><button class="clear">Xoá</button></div>
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

      const head = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,'Segoe UI',sans-serif;}</style>
${logger}
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
