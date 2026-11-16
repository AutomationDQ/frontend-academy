/* =========================================================
   EDITOR PRO – nâng cấp ô soạn code cho giống VS Code
   - Tô màu cú pháp khi gõ (lớp <pre> nằm dưới textarea trong suốt) + tô dòng hiện tại
   - IntelliSense: gợi ý HTML / CSS / JS / Node-Express + snippet, từ trong file và trong bài học
   - Emmet: div.card>h3+p*2 rồi Tab;  tự đóng thẻ HTML khi gõ ">"
   - Phím tắt VS Code: Ctrl+/ comment · Alt+↑↓ di chuyển dòng · Shift+Alt+↑↓ nhân bản dòng
     Ctrl+Shift+K xoá dòng · Ctrl+] / Ctrl+[ thụt lề · Ctrl+D chọn từ/lần xuất hiện tiếp
     Ctrl+L chọn dòng · Shift+Alt+F định dạng · Ctrl+Space gợi ý · Ctrl+Enter / Ctrl+S chạy
   - Thanh trạng thái (Dòng/Cột, ngôn ngữ) + bảng tra phím tắt
   Mọi thay đổi đi qua execCommand('insertText') để Ctrl+Z / Ctrl+Y vẫn hoạt động.
   ========================================================= */
(function () {
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ===================== Tô màu cú pháp ===================== */
  // Chỉ dùng nhóm (?:...) bên trong regex – mỗi luật đúng 1 nhóm bắt
  const HL = {
    html: [
      [/<!--[\s\S]*?(?:-->|$)/, "tk-com"],
      [/<\/?[a-zA-Z][\w-]*/, "tk-tag"], [/\/?>/, "tk-tag"],
      [/"[^"\n]*"?|'[^'\n]*'?/, "tk-str"],
      [/\s[a-zA-Z:@][\w:.-]*(?==)/, "tk-attr"],
      [/&[a-z]+;/, "tk-num"]
    ],
    css: [
      [/\/\*[\s\S]*?(?:\*\/|$)/, "tk-com"],
      [/@[\w-]+/, "tk-kw"],
      [/"[^"\n]*"?|'[^'\n]*'?/, "tk-str"],
      [/[\w-]+(?=\s*:(?!:))(?=[^{}]*[;}\n])/, "tk-prop"],
      [/#[0-9a-fA-F]{3,8}\b|-?\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|deg|fr|vh|vw|ch)?\b/, "tk-num"],
      [/[.#][\w-]+(?=[^{}]*\{)|:{1,2}[\w-]+(?=[^{}]*\{)/, "tk-attr"]
    ],
    js: [
      [/\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/, "tk-com"],
      [/`(?:[^`\\]|\\[\s\S])*`?/, "tk-str"],
      [/"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?/, "tk-str"],
      [/\b(?:const|let|var|function|return|if|else|for|of|in|while|do|new|async|await|try|catch|finally|throw|class|extends|super|import|export|from|default|switch|case|break|continue|typeof|instanceof|this|static|get|set|yield|delete)\b/, "tk-kw"],
      [/\b(?:true|false|null|undefined|NaN|Infinity)\b/, "tk-num"],
      [/\b\d+(?:\.\d+)?\b/, "tk-num"],
      [/\b[A-Z][\w$]*\b/, "tk-type"],
      [/[a-zA-Z_$][\w$]*(?=\s*\()/, "tk-fn"],
      [/\.[a-zA-Z_$][\w$]*/, "tk-prop"]
    ]
  };
  const HL_RE = {};
  Object.keys(HL).forEach(k => { HL_RE[k] = new RegExp(HL[k].map(r => "(" + r[0].source + ")").join("|"), "g"); });
  function highlight(code, lang) {
    const rules = HL[lang] || HL.js, re = HL_RE[lang] || HL_RE.js;
    re.lastIndex = 0;
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      if (m[0] === "") { re.lastIndex++; continue; }
      let g = 0; for (let i = 1; i < m.length; i++) if (m[i] !== undefined) { g = i - 1; break; }
      out += esc(code.slice(last, m.index)) + '<span class="' + rules[g][1] + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  /* ===================== Dữ liệu gợi ý ===================== */
  const S = (label, insert, detail, kind) => ({ label, insert, detail, kind: kind || "snippet" });
  const HTML_TAGS = "div span p a img ul ol li h1 h2 h3 h4 h5 h6 button input form label section header footer nav main article aside table thead tbody tr td th select option textarea strong em code pre br hr blockquote figure figcaption video audio canvas iframe small details summary dialog template".split(" ");
  const VOID = new Set("img input br hr meta link source area col embed wbr".split(" "));
  const HTML_ATTRS = { class: "Lớp CSS", id: "Định danh duy nhất", href: "Đường dẫn liên kết", src: "Đường dẫn ảnh/script", alt: "Mô tả ảnh (a11y)", type: "Kiểu input/button", name: "Tên trường form", value: "Giá trị", placeholder: "Chữ gợi ý trong ô nhập", for: "Nối label với id input", style: "CSS nội tuyến", title: "Chú thích khi rê chuột", disabled: "Vô hiệu hoá", required: "Bắt buộc nhập", target: "_blank: mở tab mới", "aria-label": "Nhãn cho trình đọc màn hình", "data-": "Thuộc tính dữ liệu tuỳ ý", loading: "lazy: tải ảnh khi cần", autocomplete: "Gợi ý tự điền", rel: "Quan hệ liên kết", width: "Chiều rộng", height: "Chiều cao", onclick: "Sự kiện click (nên dùng addEventListener)" };
  const CSS_PROPS = "display position top right bottom left width height min-width max-width min-height max-height margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right border border-radius border-color box-sizing box-shadow background background-color background-image color font-family font-size font-weight font-style line-height letter-spacing text-align text-decoration text-transform text-shadow opacity overflow cursor z-index transition transform animation flex flex-direction flex-wrap flex-grow flex-shrink flex-basis justify-content align-items align-self align-content gap row-gap column-gap grid-template-columns grid-template-rows grid-column grid-row grid-area place-items object-fit outline visibility white-space list-style aspect-ratio filter backdrop-filter inset content".split(" ");
  const CSS_VALUES = "flex grid block inline inline-block none center space-between space-around space-evenly flex-start flex-end stretch column row wrap nowrap relative absolute fixed sticky static auto hidden visible scroll pointer bold normal italic uppercase lowercase capitalize underline transparent inherit 100% 100vh 1fr repeat(3, 1fr) border-box cover contain ease ease-in-out linear solid dashed white black rgba(0, 0, 0, .5) linear-gradient(135deg, #16a34a, #facc15) translateY(-4px) scale(1.05) rotate(45deg) all 0.3s ease".split(" ").concat(["repeat(auto-fit, minmax(200px, 1fr))", "all 0.3s ease", "0 4px 12px rgba(0, 0, 0, .15)"]);
  const CSS_SNIPPETS = [
    S("flex-center", "display: flex;\njustify-content: center;\nalign-items: center;", "Căn giữa bằng Flexbox"),
    S("grid-auto", "display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(${1:200px}, 1fr));\ngap: ${2:16px};", "Lưới tự co giãn"),
    S("media", "@media (max-width: ${1:768px}) {\n  $0\n}", "Media query responsive"),
    S("hover", ":hover {\n  $0\n}", "Trạng thái rê chuột"),
    S("keyframes", "@keyframes ${1:ten} {\n  from { $0 }\n  to { }\n}", "Khai báo animation")
  ];
  const JS_SNIPPETS = [
    S("log", "console.log($0);", "console.log(...)"),
    S("qs", "document.querySelector('$0')", "Chọn 1 phần tử"),
    S("qsa", "document.querySelectorAll('$0')", "Chọn nhiều phần tử"),
    S("ael", "addEventListener('${1:click}', (e) => {\n  $0\n});", "Gắn sự kiện"),
    S("fn", "function ${1:tenHam}(${2}) {\n  $0\n}", "Khai báo hàm"),
    S("af", "(${1}) => {\n  $0\n}", "Hàm mũi tên"),
    S("afn", "async function ${1:tenHam}(${2}) {\n  $0\n}", "Hàm async"),
    S("if", "if (${1:dieuKien}) {\n  $0\n}", "Câu lệnh if"),
    S("ifelse", "if (${1:dieuKien}) {\n  $0\n} else {\n  \n}", "if / else"),
    S("for", "for (let i = 0; i < ${1:mang}.length; i++) {\n  $0\n}", "Vòng lặp for"),
    S("forof", "for (const ${1:item} of ${2:mang}) {\n  $0\n}", "Vòng lặp for...of"),
    S("foreach", "forEach((${1:item}) => {\n  $0\n});", "Duyệt mảng"),
    S("map", "map((${1:item}) => $0)", "Biến đổi mảng"),
    S("filter", "filter((${1:item}) => $0)", "Lọc mảng"),
    S("reduce", "reduce((tong, ${1:item}) => tong + $0, 0)", "Gộp mảng"),
    S("try", "try {\n  $0\n} catch (err) {\n  console.error(err.message);\n}", "try / catch"),
    S("fetch", "const res = await fetch('${1:url}');\nif (!res.ok) throw new Error('HTTP ' + res.status);\nconst data = await res.json();$0", "Gọi API với fetch"),
    S("class", "class ${1:TenLop} {\n  constructor(${2}) {\n    $0\n  }\n}", "Khai báo class"),
    S("timeout", "setTimeout(() => {\n  $0\n}, ${1:1000});", "Hẹn giờ chạy"),
    S("interval", "setInterval(() => {\n  $0\n}, ${1:1000});", "Lặp theo chu kỳ"),
    S("ls-get", "JSON.parse(localStorage.getItem('${1:key}') || '${2:[]}')", "Đọc localStorage"),
    S("ls-set", "localStorage.setItem('${1:key}', JSON.stringify($0));", "Ghi localStorage"),
    S("tpl", "`${$0}`", "Template string")
  ];
  const NODE_SNIPPETS = [
    S("req", "require('$0')", "Nạp module"),
    S("express-app", "const express = require('express');\nconst app = express();\napp.use(express.json());\n\n$0\n\napp.listen(3000, () => console.log('Server chạy cổng 3000'));", "Khung server Express"),
    S("aget", "app.get('/${1:api/items}', (req, res) => {\n  $0\n});", "Route GET"),
    S("apost", "app.post('/${1:api/items}', (req, res) => {\n  const { $0 } = req.body;\n  res.status(201).json({});\n});", "Route POST"),
    S("aput", "app.put('/${1:api/items}/:id', (req, res) => {\n  $0\n});", "Route PUT"),
    S("apatch", "app.patch('/${1:api/items}/:id', (req, res) => {\n  $0\n});", "Route PATCH"),
    S("adel", "app.delete('/${1:api/items}/:id', (req, res) => {\n  $0\n  res.sendStatus(204);\n});", "Route DELETE"),
    S("mw", "function ${1:tenMiddleware}(req, res, next) {\n  $0\n  next();\n}", "Middleware"),
    S("errmw", "app.use((err, req, res, next) => {\n  const status = err.status || 500;\n  res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });\n});", "Middleware xử lý lỗi"),
    S("404", "res.status(404).json({ error: '${1:Không tìm thấy}' });", "Trả 404"),
    S("rjson", "res.json($0);", "Trả JSON"),
    S("listen", "app.listen(${1:3000}, () => console.log('Server chạy cổng ${1:3000}'));", "Chạy server"),
    S("db", "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');", "Kết nối SQLite"),
    S("prep", "db.prepare('${1:SELECT * FROM bang WHERE id = ?}').${2:get}($0)", "Prepared statement"),
    S("jwt-sign", "jwt.sign({ $0 }, process.env.JWT_SECRET, { expiresIn: '1h' })", "Ký JWT"),
    S("jwt-verify", "jwt.verify(token, process.env.JWT_SECRET)", "Xác thực JWT"),
    S("bhash", "await bcrypt.hash(${1:password}, 10)", "Băm mật khẩu"),
    S("bcompare", "await bcrypt.compare(${1:password}, ${2:hash})", "So khớp mật khẩu")
  ];
  const JS_KEYWORDS = "const let var function return if else for of in while new async await try catch finally throw class extends super import export default switch case break continue typeof instanceof this true false null undefined document window console JSON Math Date Promise Array Object String Number Boolean Error Map Set localStorage fetch setTimeout setInterval clearTimeout parseInt parseFloat".split(" ");
  const NODE_WORDS = "require module exports process __dirname express app req res next router Router json send status sendStatus listen params query body headers use get post put patch delete bcrypt jwt Database prepare run all exec lastInsertRowid changes fs path promises readFile writeFile".split(" ");
  const MEMBERS = {
    console: "log error warn info table time timeEnd".split(" "),
    document: "querySelector querySelectorAll getElementById createElement addEventListener body title".split(" "),
    Math: "round floor ceil random max min abs pow sqrt PI".split(" "),
    JSON: "stringify parse".split(" "),
    Object: "keys values entries assign freeze".split(" "),
    Array: "isArray from of".split(" "),
    localStorage: "getItem setItem removeItem clear".split(" "),
    process: "env argv version platform exit cwd uptime".split(" "),
    res: "json send status sendStatus set redirect end cookie".split(" "),
    req: "params query body headers method url path get ip".split(" "),
    app: "get post put patch delete use listen set".split(" "),
    db: "prepare exec transaction close".split(" "),
    jwt: "sign verify decode".split(" "),
    bcrypt: "hash compare hashSync compareSync genSalt".split(" "),
    fs: "readFileSync writeFileSync existsSync promises readFile writeFile mkdirSync".split(" "),
    path: "join resolve basename extname dirname".split(" "),
    express: "json urlencoded static Router".split(" ")
  };
  const GENERIC_MEMBERS = "length push pop shift unshift map filter reduce forEach find findIndex includes indexOf join split slice splice sort reverse some every concat trim toUpperCase toLowerCase replace startsWith endsWith padStart toFixed toString then catch finally textContent innerHTML innerText value classList add remove toggle contains style setAttribute getAttribute appendChild remove addEventListener querySelector dataset parentElement children focus click json ok status get all run".split(" ");

  /* ===================== Emmet rút gọn ===================== */
  function expandEmmet(abbr) {
    if (!/^[a-zA-Z.#][\w.#>*+{}\- ]*$/.test(abbr) || /[>+*]$/.test(abbr)) return null;
    const parseEl = s => {
      const m = /^([a-zA-Z][\w-]*)?((?:[.#][\w-]+)*)(?:\*(\d{1,2}))?(?:\{([^}]*)\})?$/.exec(s.trim());
      if (!m || (!m[1] && !m[2])) return null;
      const classes = [], ids = [];
      (m[2].match(/[.#][\w-]+/g) || []).forEach(t => (t[0] === "." ? classes : ids).push(t.slice(1)));
      return { tag: m[1] || "div", classes, id: ids[0], n: +(m[3] || 1), text: m[4] || "" };
    };
    const levels = abbr.split(">").map(part => part.split("+").map(parseEl));
    if (levels.some(l => l.some(e => !e))) return null;
    if (levels.length === 1 && levels[0].length === 1 && !/[.#*{]/.test(abbr) && !HTML_TAGS.includes(abbr) && !VOID.has(abbr)) return null;
    let cursorPlaced = false;
    const render = (lv, depth) => {
      const pad = "  ".repeat(depth);
      return levels[lv].map(el => {
        let out = "";
        for (let i = 1; i <= el.n; i++) {
          const attrs = (el.id ? ` id="${el.id}"` : "") + (el.classes.length ? ` class="${el.classes.join(" ")}"` : "") + (el.tag === "a" ? ' href="$CUR"' : "") + (el.tag === "img" ? ' src="$CUR" alt=""' : "") + (el.tag === "input" ? ' type="text"' : "");
          const text = el.text.replace(/\$/g, String(i));
          if (VOID.has(el.tag)) { out += pad + "<" + el.tag + attrs + ">\n"; continue; }
          const inner = lv + 1 < levels.length ? "\n" + render(lv + 1, depth + 1) + pad : (text || "$CUR");
          out += pad + "<" + el.tag + attrs + ">" + inner + "</" + el.tag + ">\n";
        }
        return out;
      }).join("");
    };
    let html = render(0, 0).replace(/\n$/, "");
    html = html.replace(/\$CUR/g, () => cursorPlaced ? "" : (cursorPlaced = true, "$0"));
    return html;
  }

  /* ===================== Gắn vào một Playground ===================== */
  function attach(pg) {
    const ta = pg.editor, area = ta.parentElement;
    const pre = document.createElement("pre"); pre.className = "hl"; pre.setAttribute("aria-hidden", "true");
    const curLine = document.createElement("div"); curLine.className = "cur-line";
    const pop = document.createElement("div"); pop.className = "suggest"; pop.hidden = true; pop.setAttribute("role", "listbox");
    area.insertBefore(curLine, ta); area.insertBefore(pre, ta); area.appendChild(pop);
    const status = pg.container.querySelector(".pg-status");
    const lang = () => pg.active;
    const isNode = () => pg.runtime === "node";
    let items = [], sel = 0, open = false, extraWords = [];

    /* ---- đo font ---- */
    const metrics = () => {
      const cs = getComputedStyle(ta);
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;font:" + cs.font;
      probe.textContent = "M".repeat(20); document.body.appendChild(probe);
      const cw = probe.getBoundingClientRect().width / 20; probe.remove();
      return { cw, lh: parseFloat(cs.lineHeight), pl: parseFloat(cs.paddingLeft), pt: parseFloat(cs.paddingTop) };
    };
    const lineCol = pos => { const before = ta.value.slice(0, pos); const line = before.split("\n").length - 1; return { line, col: pos - before.lastIndexOf("\n") - 1 }; };

    function refresh() {
      pre.innerHTML = highlight(ta.value, lang()) + "\n";
      sync();
    }
    function sync() {
      pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft;
      const { line, col } = lineCol(ta.selectionStart);
      const m = metrics();
      curLine.style.top = (m.pt + line * m.lh - ta.scrollTop) + "px"; curLine.style.height = m.lh + "px";
      curLine.hidden = document.activeElement !== ta;
      if (status) {
        const selLen = Math.abs(ta.selectionEnd - ta.selectionStart);
        status.querySelector(".st-pos").textContent = "Dòng " + (line + 1) + ", Cột " + (col + 1) + (selLen ? " (đã chọn " + selLen + ")" : "");
        status.querySelector(".st-lang").textContent = isNode() ? "JavaScript (Node.js)" : ({ html: "HTML", css: "CSS", js: "JavaScript" })[lang()];
      }
      if (open) placePopup();
    }

    /* ---- chỉnh sửa giữ được Undo ---- */
    function replace(start, end, text, selStart, selEnd) {
      ta.focus();
      ta.setSelectionRange(start, end);
      let ok = false;
      try { ok = text ? document.execCommand("insertText", false, text) : document.execCommand("delete"); } catch (e) {}
      if (!ok) { ta.setRangeText(text, start, end, "end"); ta.dispatchEvent(new Event("input")); }
      if (selStart !== undefined) ta.setSelectionRange(selStart, selEnd === undefined ? selStart : selEnd);
    }
    // chèn snippet: $0 = vị trí con trỏ, ${1:mac dinh} = chọn sẵn chữ mặc định; thụt lề theo dòng hiện tại
    function insertSnippet(start, end, snippet) {
      const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
      const indent = (ta.value.slice(lineStart, start).match(/^\s*/) || [""])[0];
      let text = snippet.replace(/\n/g, "\n" + indent), cur = -1, selLen = 0;
      text = text.replace(/\$\{(\d+):([^}]*)\}|\$\{(\d+)\}|\$(\d)/g, (m0, n1, def, n2, n3, off) => {
        const n = n1 || n2 || n3, val = def || "";
        if (cur < 0 && (n === "1" || (n === "0" && !/\$\{?1/.test(text)))) { cur = off; selLen = val.length; }
        return val;
      });
      // vị trí tính lại vì các marker trước đó đã bị thay
      const marker = "\u0007";
      let t2 = snippet.replace(/\n/g, "\n" + indent).replace(/\$\{1:([^}]*)\}|\$\{1\}|\$1/, (m, d) => marker + (d || "") + marker);
      if (!t2.includes(marker)) t2 = t2.replace(/\$0/, marker + marker);
      t2 = t2.replace(/\$\{\d+:([^}]*)\}/g, "$1").replace(/\$\{\d+\}|\$\d/g, "");
      const a = t2.indexOf(marker), b = t2.indexOf(marker, a + 1);
      const clean = t2.replace(new RegExp(marker, "g"), "");
      if (a >= 0) replace(start, end, clean, start + a, start + b - 1);
      else replace(start, end, clean, start + clean.length);
    }

    /* ---- gợi ý ---- */
    function wordBefore() {
      const pos = ta.selectionStart, before = ta.value.slice(0, pos);
      const m = /[\w$@-]*$/.exec(before);
      let w = m[0];
      if (lang() !== "css" && lang() !== "html") w = /[\w$-]*$/.exec(before)[0].replace(/^.*-/, "") === w ? w : w;
      if (lang() === "js") w = /[\w$-]*$/.exec(before)[0];
      return { word: w, start: pos - w.length, before };
    }
    function docWords() {
      const set = new Set();
      (ta.value.match(/[A-Za-z_$][\w$]{2,}/g) || []).forEach(w => set.add(w));
      extraWords.forEach(w => set.add(w));
      return [...set];
    }
    function candidates(force) {
      const { word, start, before } = wordBefore();
      const L = lang(), list = [];
      const add = (arr) => arr.forEach(x => list.push(x));
      if (L === "html") {
        const inTag = /<[a-zA-Z][^<>]*$/.test(before) && !/<[a-zA-Z][\w-]*$/.test(before);
        const afterLt = /<\/?$/.test(before.slice(0, start));
        if (inTag) add(Object.keys(HTML_ATTRS).map(a => S(a, a === "data-" ? 'data-${1:ten}="$0"' : (a === "disabled" || a === "required") ? a : a + '="$0"', HTML_ATTRS[a], "attr")));
        else if (afterLt) add(HTML_TAGS.map(t => S(t, VOID.has(t) ? t + ">" : t + ">$0</" + t + ">", "Thẻ <" + t + ">", "tag")));
        else add(HTML_TAGS.map(t => S(t, VOID.has(t) ? "<" + t + ">" : "<" + t + ">$0</" + t + ">", "Thẻ <" + t + "> · Emmet: gõ " + t + ".lop rồi Tab", "tag")));
      } else if (L === "css") {
        const decl = /[{;]\s*[\w-]+\s*:\s*[^;{}]*$/.test(before) || /^\s*[\w-]+\s*:\s*[^;{}]*$/.test(before.split("\n").pop());
        const inBlock = (before.match(/\{/g) || []).length > (before.match(/\}/g) || []).length;
        if (decl) add(CSS_VALUES.map(v => S(v, v, "Giá trị CSS", "value")));
        else if (inBlock) { add(CSS_PROPS.map(p => S(p, p + ": $0;", "Thuộc tính CSS", "prop"))); add(CSS_SNIPPETS.filter(s => s.label !== "media" && s.label !== "keyframes")); }
        else add(CSS_SNIPPETS.filter(s => ["media", "keyframes"].includes(s.label)).concat(HTML_TAGS.map(t => S(t, t + " {\n  $0\n}", "Selector thẻ", "tag"))));
      } else {
        const dot = /([\w$]+)\.\s*[\w$]*$/.exec(before);
        if (dot) {
          const own = MEMBERS[dot[1]] || [];
          add(own.map(x => Object.assign(S(x, x, dot[1] + "." + x, "method"), { pri: -1 })));
          add(GENERIC_MEMBERS.filter(x => !own.includes(x)).map(x => S(x, x, "thuộc tính / phương thức", "method")));
        } else {
          add(JS_SNIPPETS); if (isNode()) add(NODE_SNIPPETS);
          add(JS_KEYWORDS.map(k => S(k, k, "từ khoá / đối tượng có sẵn", "kw")));
          if (isNode()) add(NODE_WORDS.map(k => S(k, k, "Node / Express", "kw")));
        }
      }
      if (L !== "html" || /<[a-zA-Z][^<>]*$/.test(before) === false) add(docWords().filter(w => w !== word).map(w => S(w, w, "từ trong bài", "word")));
      if (!word && !force) return { list: [], start };
      const rank = x => x.pri !== undefined ? x.pri : x.kind === "snippet" ? 0 : x.kind === "word" ? 2 : 1;
      const q = word.toLowerCase(), seen = new Set();
      const scored = list.filter(x => { const k = x.label + "|" + x.kind; if (seen.has(k)) return false; seen.add(k); return true; })
        .map(x => { const l = x.label.toLowerCase(); return { x, s: !q ? 1 : l === q ? 0 : l.startsWith(q) ? 1 : l.includes(q) ? 2 : -1 }; })
        .filter(o => o.s >= 0 && !(o.x.label === word && o.x.kind === "word"))
        .sort((a, b) => a.s - b.s || rank(a.x) - rank(b.x) || a.x.label.length - b.x.label.length);
      return { list: scored.slice(0, 40).map(o => o.x), start };
    }
    const KIND_IC = { snippet: "⧉", tag: "‹›", attr: "＝", prop: "◆", value: "◇", method: "ƒ", kw: "🔑", word: "abc" };
    function show(force) {
      const { list } = candidates(force);
      items = list; sel = 0;
      if (!items.length) return hide();
      pop.innerHTML = items.map((it, i) => `<div class="sg-item ${i === 0 ? "on" : ""}" role="option" data-i="${i}"><span class="sg-ic k-${it.kind}">${KIND_IC[it.kind] || "•"}</span><span class="sg-label">${esc(it.label)}</span><span class="sg-detail">${esc(it.detail || "")}</span></div>`).join("");
      pop.hidden = false; open = true; placePopup();
    }
    function hide() { pop.hidden = true; open = false; }
    function placePopup() {
      const m = metrics(), { line } = lineCol(ta.selectionStart);
      const lineStart = ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1;
      const vcol = ta.value.slice(lineStart, ta.selectionStart).replace(/\t/g, "  ").length;
      let left = m.pl + vcol * m.cw - ta.scrollLeft, top = m.pt + (line + 1) * m.lh - ta.scrollTop + 2;
      left = Math.max(4, Math.min(left, area.clientWidth - 280));
      if (top + 200 > area.clientHeight && top > 220) top = top - m.lh - Math.min(pop.offsetHeight || 200, 220) - 4;
      pop.style.left = left + "px"; pop.style.top = top + "px";
    }
    function move(d) {
      sel = (sel + d + items.length) % items.length;
      pop.querySelectorAll(".sg-item").forEach((el, i) => el.classList.toggle("on", i === sel));
      const on = pop.querySelector(".sg-item.on");   // không dùng scrollIntoView: nó cuộn cả khung cha
      if (on) { if (on.offsetTop < pop.scrollTop) pop.scrollTop = on.offsetTop - 4; else if (on.offsetTop + on.offsetHeight > pop.scrollTop + pop.clientHeight) pop.scrollTop = on.offsetTop + on.offsetHeight - pop.clientHeight + 4; }
    }
    function accept(i) {
      const it = items[i === undefined ? sel : i]; if (!it) return;
      const { start } = wordBefore();
      hide();
      insertSnippet(start, ta.selectionStart, it.insert);
    }
    pop.addEventListener("mousedown", e => { const el = e.target.closest(".sg-item"); if (el) { e.preventDefault(); accept(+el.dataset.i); } });

    /* ---- thao tác theo dòng ---- */
    function lineRange() {
      const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd;
      const a = v.lastIndexOf("\n", s - 1) + 1;
      let b = v.indexOf("\n", e > s && v[e - 1] === "\n" ? e - 1 : e); if (b < 0) b = v.length;
      return { a, b, text: v.slice(a, b) };
    }
    function mapLines(fn) {
      const { a, b, text } = lineRange(), s = ta.selectionStart, e = ta.selectionEnd;
      const out = text.split("\n").map(fn).join("\n");
      replace(a, b, out, s === e ? Math.max(a, s + (out.length - text.length) * (text.split("\n").length === 1 ? 1 : 0)) : a, s === e ? undefined : a + out.length);
      if (s === e) { const delta = out.split("\n")[0].length - text.split("\n")[0].length; ta.setSelectionRange(Math.max(a, s + delta), Math.max(a, s + delta)); }
    }
    const COMMENT = { html: ["<!-- ", " -->"], css: ["/* ", " */"], js: ["// ", ""] };
    function toggleComment() {
      const [o, c] = COMMENT[lang()] || COMMENT.js;
      const { text } = lineRange();
      const lines = text.split("\n");
      const allCommented = lines.filter(l => l.trim()).every(l => l.trim().startsWith(o.trim()));
      mapLines(l => {
        if (!l.trim()) return l;
        const ind = l.match(/^\s*/)[0], body = l.slice(ind.length);
        if (allCommented) return ind + body.replace(new RegExp("^" + o.trim().replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") + " ?"), "").replace(c ? new RegExp(" ?" + c.trim().replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") + "$") : /$^/, "");
        return ind + o + body + c;
      });
    }
    function moveLines(dir) {
      const v = ta.value, { a, b, text } = lineRange(), s = ta.selectionStart, e = ta.selectionEnd;
      if (dir < 0) {
        if (a === 0) return;
        const pa = v.lastIndexOf("\n", a - 2) + 1, prev = v.slice(pa, a - 1);
        replace(pa, b, text + "\n" + prev, s - prev.length - 1, e - prev.length - 1);
      } else {
        if (b >= v.length) return;
        let nb = v.indexOf("\n", b + 1); if (nb < 0) nb = v.length;
        const next = v.slice(b + 1, nb);
        replace(a, nb, next + "\n" + text, s + next.length + 1, e + next.length + 1);
      }
    }
    function copyLines(dir) {
      const { a, b, text } = lineRange(), s = ta.selectionStart, e = ta.selectionEnd;
      if (dir > 0) replace(b, b, "\n" + text, s + text.length + 1, e + text.length + 1);
      else replace(a, a, text + "\n", s, e);
    }
    function deleteLine() {
      const v = ta.value, { a, b } = lineRange();
      const end = b < v.length ? b + 1 : b, start = b >= v.length && a > 0 ? a - 1 : a;
      replace(start, end, "", start);
    }
    function selectNext() {
      const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd;
      if (s === e) {
        const L = /[\w$-]*$/.exec(v.slice(0, s))[0].length, R = /^[\w$-]*/.exec(v.slice(s))[0].length;
        if (L + R) ta.setSelectionRange(s - L, s + R);
        return;
      }
      const word = v.slice(s, e);
      let i = v.indexOf(word, e); if (i < 0) i = v.indexOf(word);
      if (i >= 0) { ta.setSelectionRange(i, i + word.length); scrollToCaret(); }
    }
    function scrollToCaret() {
      const m = metrics(), { line } = lineCol(ta.selectionStart);
      const y = m.pt + line * m.lh;
      if (y < ta.scrollTop || y > ta.scrollTop + ta.clientHeight - m.lh * 2) ta.scrollTop = Math.max(0, y - ta.clientHeight / 2);
    }
    /* ---- Định dạng (thụt lề lại) ---- */
    function format() {
      const L = lang(), lines = ta.value.replace(/\t/g, "  ").split("\n");
      let depth = 0; const out = [];
      for (const raw of lines) {
        const t = raw.trim();
        if (!t) { out.push(""); continue; }
        let pre = 0, post = 0;
        if (L === "html") {
          const opens = (t.match(/<(?!\/|!|(?:img|input|br|hr|meta|link|source)\b)[a-zA-Z][^>]*[^/]?>/g) || []).length;
          const closes = (t.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
          if (/^<\//.test(t)) pre = 1;
          const net = opens - closes;
          out.push("  ".repeat(Math.max(0, depth - pre)) + t);
          depth = Math.max(0, depth + net);
        } else {
          const clean = t.replace(/(["'`])(?:\\.|(?!\1).)*\1/g, "").replace(/\/\/.*$/, "");
          const lead = (/^[}\])]+/.exec(clean) || [""])[0].length;
          const opens = (clean.match(/[{[(]/g) || []).length, closes = (clean.match(/[}\])]/g) || []).length;
          out.push("  ".repeat(Math.max(0, depth - lead)) + t);
          depth = Math.max(0, depth + opens - closes);
        }
      }
      const res = out.join("\n");
      if (res !== ta.value) { const pos = ta.selectionStart; replace(0, ta.value.length, res, Math.min(pos, res.length)); }
    }

    /* ---- Bàn phím ---- */
    const PAIRS = { "(": ")", "{": "}", "[": "]", '"': '"', "'": "'", "`": "`" };
    ta.addEventListener("keydown", e => {
      const ctrl = e.ctrlKey || e.metaKey, k = e.key;
      if (open) {
        if (k === "ArrowDown") { e.preventDefault(); return move(1); }
        if (k === "ArrowUp") { e.preventDefault(); return move(-1); }
        if (k === "Enter" || k === "Tab") { e.preventDefault(); return accept(); }
        if (k === "Escape") { e.preventDefault(); return hide(); }
      }
      if (ctrl && (k === "Enter" || k === "s")) { e.preventDefault(); hide(); return pg.run(); }
      if (ctrl && k === " ") { e.preventDefault(); return show(true); }
      if (ctrl && k === "/") { e.preventDefault(); return toggleComment(); }
      if (ctrl && e.shiftKey && (k === "K" || k === "k")) { e.preventDefault(); return deleteLine(); }
      if (ctrl && k === "]") { e.preventDefault(); return mapLines(l => "  " + l); }
      if (ctrl && k === "[") { e.preventDefault(); return mapLines(l => l.replace(/^ {1,2}/, "")); }
      if (ctrl && (k === "d" || k === "D") && !e.shiftKey) { e.preventDefault(); return selectNext(); }
      if (ctrl && (k === "l" || k === "L")) { e.preventDefault(); const { a, b } = lineRange(); return ta.setSelectionRange(a, Math.min(b + 1, ta.value.length)); }
      if (e.altKey && e.shiftKey && (k === "F" || k === "f")) { e.preventDefault(); return format(); }
      if (e.altKey && (k === "ArrowUp" || k === "ArrowDown")) { e.preventDefault(); return e.shiftKey ? copyLines(k === "ArrowUp" ? -1 : 1) : moveLines(k === "ArrowUp" ? -1 : 1); }
      if (k === "Escape") return;

      const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
      if (k === "Tab") {
        e.preventDefault();
        if (s !== en && v.slice(s, en).includes("\n")) return mapLines(l => e.shiftKey ? l.replace(/^ {1,2}/, "") : "  " + l);
        if (e.shiftKey) return mapLines(l => l.replace(/^ {1,2}/, ""));
        if (lang() === "html" && s === en) {
          const ab = /[\w.#>*+{}\-$ ]*$/.exec(v.slice(0, s))[0].replace(/^\s+/, "");
          const html = ab && expandEmmet(ab);
          if (html) return insertSnippet(s - ab.length, s, html);
        }
        return replace(s, en, "  ", s + 2);
      }
      if (k === "Enter") {
        e.preventDefault();
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        const indent = (v.slice(lineStart, s).match(/^\s*/) || [""])[0];
        const prev = v[s - 1], next = v[s];
        const opening = prev === "{" || prev === "(" || prev === "[" || (prev === ">" && lang() === "html" && next === "<" && v[s + 1] === "/");
        if (opening) return replace(s, en, "\n" + indent + "  \n" + indent, s + indent.length + 3);
        return replace(s, en, "\n" + indent, s + 1 + indent.length);
      }
      if (k === "Backspace" && s === en && s > 0 && PAIRS[v[s - 1]] && v[s] === PAIRS[v[s - 1]]) {
        e.preventDefault(); return replace(s - 1, s + 1, "", s - 1);
      }
      if (PAIRS[k] && !ctrl && !e.altKey) {
        if ((k === '"' || k === "'" || k === "`") && v[s] === k && s === en) { e.preventDefault(); return ta.setSelectionRange(s + 1, s + 1); }
        if ((k === "'" ) && /\w$/.test(v.slice(0, s)) && s === en) return;   // dấu nháy trong chữ: it's
        e.preventDefault();
        if (s !== en) return replace(s, en, k + v.slice(s, en) + PAIRS[k], s + 1, en + 1);   // bọc vùng chọn
        return replace(s, en, k + PAIRS[k], s + 1);
      }
      if ([")", "}", "]"].includes(k) && v[s] === k && s === en) { e.preventDefault(); return ta.setSelectionRange(s + 1, s + 1); }
      if (k === ">" && lang() === "html" && s === en) {
        const m = /<([a-zA-Z][\w-]*)(?:\s[^<>]*)?$/.exec(v.slice(0, s));
        if (m && !VOID.has(m[1].toLowerCase()) && !/\/$/.test(v.slice(0, s))) { e.preventDefault(); return replace(s, en, "></" + m[1] + ">", s + 1); }
      }
    });
    ta.addEventListener("input", e => {
      refresh();
      if (e.inputType && e.inputType.startsWith("insert") && e.data && /[\w.<$@:-]/.test(e.data.slice(-1))) {
        const { word, before } = wordBefore();
        const memberCtx = lang() === "js" && /[\w$]\.[\w$]*$/.test(before);
        if (word.length >= 2 || memberCtx || (lang() === "html" && /<$/.test(before))) show(memberCtx && !word);
        else hide();
      } else if (!e.inputType || e.inputType.startsWith("delete")) { if (open) show(); }
    });
    ta.addEventListener("scroll", () => { sync(); if (open) placePopup(); });
    ["click", "keyup", "focus", "blur", "select"].forEach(ev => ta.addEventListener(ev, () => { sync(); if (ev === "blur") setTimeout(() => { if (document.activeElement !== ta) hide(); }, 150); if (ev === "click") hide(); }));
    if (window.ResizeObserver) new ResizeObserver(() => sync()).observe(ta);

    refresh();
    return { refresh, hide, setExtraWords: w => { extraWords = (w || []).slice(0, 300); }, format, expandEmmet };
  }

  /* ===================== Bảng phím tắt ===================== */
  const SHORTCUTS = [
    ["Ctrl + Space", "Mở gợi ý code (IntelliSense)"], ["↑ ↓ rồi Enter / Tab", "Chọn gợi ý"],
    ["Tab (trong HTML)", "Emmet: ul>li*3 · div.card>h3+p · a{Trang chủ}"],
    ["Ctrl + Enter / Ctrl + S", "Chạy code"], ["Ctrl + /", "Bật/tắt comment dòng"],
    ["Alt + ↑ / ↓", "Di chuyển dòng lên/xuống"], ["Shift + Alt + ↑ / ↓", "Nhân bản dòng"],
    ["Ctrl + Shift + K", "Xoá dòng"], ["Ctrl + ] / Ctrl + [", "Thụt lề / bỏ thụt lề"],
    ["Tab / Shift + Tab", "Thụt lề (cả vùng chọn nhiều dòng)"], ["Ctrl + D", "Chọn từ, bấm tiếp để tới lần xuất hiện sau"],
    ["Ctrl + L", "Chọn cả dòng"], ["Shift + Alt + F", "Định dạng lại thụt lề"],
    ["Ctrl + Z / Ctrl + Y", "Hoàn tác / làm lại"], ["Gõ ( [ { \" '", "Tự đóng ngoặc, bọc vùng đang chọn"],
    ["Gõ > sau <div", "Tự đóng thẻ HTML"]
  ];
  const SNIPPET_HELP = { html: "ul>li*3 · nav>a*4 · div.card>h3{Tiêu đề}+p · form>label+input · img", css: "flex-center · grid-auto · media · hover · keyframes", js: "log · qs · ael · fn · af · if · forof · map · filter · try · fetch · class", node: "express-app · aget · apost · aput · adel · mw · errmw · rjson · db · prep · jwt-sign · bhash" };
  function shortcutsHTML() {
    return `<div class="kb-head"><b>⌨️ Phím tắt & gợi ý code</b><button class="icon-btn small kb-close" type="button" aria-label="Đóng">✕</button></div>
      <table>${SHORTCUTS.map(([k, d]) => `<tr><td><kbd>${esc(k).replace(/ \+ /g, "</kbd>+<kbd>").replace(/ \/ /g, "</kbd> / <kbd>")}</kbd></td><td>${esc(d)}</td></tr>`).join("")}</table>
      <div class="kb-snips"><b>Snippet nhanh</b> – gõ tên rồi chọn trong gợi ý:
        <div><span>HTML</span>${esc(SNIPPET_HELP.html)}</div><div><span>CSS</span>${esc(SNIPPET_HELP.css)}</div>
        <div><span>JS</span>${esc(SNIPPET_HELP.js)}</div><div><span>Node</span>${esc(SNIPPET_HELP.node)}</div></div>`;
  }

  window.EditorPro = { attach, highlight, expandEmmet, shortcutsHTML };
})();
