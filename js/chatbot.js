/* =========================================================
   CHATBOT "BIT" – Trợ lý học tập
   Hai chế độ:
   1. Offline (mặc định): khớp ý định + kho kiến thức + phân tích code cơ bản
   2. AI thật (tuỳ chọn): Google Gemini hoặc API tương thích OpenAI
   Bot luôn biết học viên đang ở bài nào và đang viết code gì.
   ========================================================= */
(function () {
  const norm = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase();
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------------- Kho kiến thức offline ---------------- */
  const KB = [
    { k: ["html la gi", "html"], lesson: "html-intro", a: "**HTML** là ngôn ngữ đánh dấu tạo *bộ khung* trang web bằng các thẻ như `<h1>`, `<p>`, `<img>`. Trình duyệt đọc HTML rồi hiển thị nội dung." },
    { k: ["css la gi", "css"], lesson: "css-intro", a: "**CSS** dùng để trang trí HTML: màu sắc, font, khoảng cách, bố cục, hiệu ứng.\n```css\nh1 { color: tomato; font-size: 32px; }\n```" },
    { k: ["javascript la gi", "js la gi", "javascript"], lesson: "js-variables", a: "**JavaScript** là ngôn ngữ lập trình giúp trang web *tương tác*: xử lý click, tính toán, gọi API, thay đổi nội dung mà không cần tải lại trang." },
    { k: ["the div", "div va span", "span"], a: "`<div>` là khối (block) – chiếm cả dòng; `<span>` là nội tuyến (inline) – chỉ rộng bằng nội dung. Cả hai không mang ý nghĩa, dùng để nhóm phần tử cho CSS/JS. Nên ưu tiên thẻ semantic (`header`, `main`, `section`…) khi có thể." },
    { k: ["semantic", "ngu nghia", "header", "footer", "main"], lesson: "html-form", a: "Thẻ **semantic** mô tả ý nghĩa nội dung: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Giúp SEO tốt hơn, trình đọc màn hình hiểu trang và code dễ đọc." },
    { k: ["form", "input", "label"], lesson: "html-form", a: "Form gồm `<form>`, `<label for=\"id\">`, `<input id=\"id\" type=\"...\">` và `<button>`. Trong JS, lắng nghe sự kiện `submit` và gọi `e.preventDefault()` để không tải lại trang." },
    { k: ["img", "hinh anh", "chen anh", "alt"], lesson: "html-media", a: "Chèn ảnh: `<img src=\"duong-dan.jpg\" alt=\"mô tả\">`. Luôn có `alt` cho người khiếm thị/SEO. Ảnh tràn khung? Dùng CSS `img { max-width: 100%; height: auto; }`." },
    { k: ["class va id", "id va class", "class"], lesson: "css-intro", a: "**class** dùng lại nhiều lần, chọn bằng `.ten`. **id** là duy nhất trên trang, chọn bằng `#ten`. Quy tắc: dùng class cho CSS, id cho JS/neo liên kết." },
    { k: ["margin va padding", "padding", "margin", "box model"], lesson: "css-box", a: "**padding** là khoảng đệm *bên trong* viền, **margin** là khoảng cách *bên ngoài* viền. Mẹo: thêm `* { box-sizing: border-box; }` để width bao gồm cả padding và border." },
    { k: ["can giua", "center", "giua man hinh"], lesson: "flexbox", a: "Căn giữa nhanh nhất cho thẻ cha:\n```css\n.cha {\n  display: flex;\n  justify-content: center; /* ngang */\n  align-items: center;     /* dọc */\n  min-height: 100vh;\n}\n```\nHoặc với Grid: `display:grid; place-items:center;`" },
    { k: ["flexbox", "flex", "justify-content", "align-items"], lesson: "flexbox", a: "**Flexbox** sắp xếp theo một chiều. Cha: `display:flex`. Trục chính dùng `justify-content`, trục phụ dùng `align-items`, khoảng cách dùng `gap`. Đổi chiều: `flex-direction: column`." },
    { k: ["grid", "luoi"], lesson: "grid", a: "**CSS Grid** chia bố cục 2 chiều:\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\nTự co giãn: `repeat(auto-fit, minmax(200px, 1fr))`." },
    { k: ["flex hay grid", "flexbox va grid", "grid va flex"], a: "Flexbox → bố cục **một chiều** (thanh menu, hàng nút, căn giữa). Grid → bố cục **hai chiều** (gallery, khung trang). Thực tế: Grid cho khung lớn, Flexbox cho chi tiết bên trong." },
    { k: ["responsive", "media query", "dien thoai", "mobile"], lesson: "responsive", a: "Responsive = giao diện thích ứng mọi màn hình. Cần `<meta name=\"viewport\" ...>` và **media query**:\n```css\n@media (max-width: 768px) {\n  .menu { flex-direction: column; }\n}\n```" },
    { k: ["position", "absolute", "relative", "fixed", "sticky"], a: "`position`: **relative** (lệch so với vị trí gốc, làm mốc cho con), **absolute** (định vị theo cha gần nhất có position), **fixed** (dính theo màn hình), **sticky** (dính khi cuộn tới). Dùng kèm `top/left/right/bottom`." },
    { k: ["z-index", "de len", "nam tren"], a: "`z-index` quyết định phần tử nào nằm trên. Chỉ có tác dụng khi phần tử có `position` khác `static` (hoặc là flex/grid item). Số lớn hơn nằm trên." },
    { k: ["rem", "don vi", "px"], lesson: "css-style", a: "`px` cố định; `rem` theo cỡ chữ gốc (16px mặc định) – nên dùng cho font; `em` theo cỡ chữ phần tử cha; `%` theo cha; `vw/vh` theo màn hình." },
    { k: ["hover", "transition", "hieu ung"], lesson: "css-style", a: "Hiệu ứng khi rê chuột:\n```css\n.btn { transition: 0.3s; }\n.btn:hover { transform: scale(1.05); background: #4338ca; }\n```" },
    { k: ["animation", "keyframes", "chuyen dong"], lesson: "css-animation", a: "Tạo animation bằng `@keyframes` rồi gán `animation: ten 1s ease infinite;`. Nên animate `transform` và `opacity` để mượt nhất." },
    { k: ["let const var", "let", "const", "var", "bien"], lesson: "js-variables", a: "`const`: không gán lại (dùng mặc định). `let`: gán lại được. `var`: cách cũ, phạm vi hàm, dễ gây lỗi → **tránh dùng**." },
    { k: ["== va ===", "===", "so sanh"], lesson: "js-conditions", a: "`===` so sánh cả **giá trị và kiểu**; `==` tự ép kiểu nên `5 == \"5\"` là `true` → dễ bug. Luôn dùng `===` và `!==`." },
    { k: ["if else", "dieu kien", "if"], lesson: "js-conditions", a: "```js\nif (diem >= 8) {\n  console.log(\"Giỏi\");\n} else if (diem >= 5) {\n  console.log(\"Đạt\");\n} else {\n  console.log(\"Chưa đạt\");\n}\n```" },
    { k: ["vong lap", "for", "while", "loop"], lesson: "js-loops", a: "Duyệt mảng gọn nhất: `for (const x of mang) { ... }`. Vòng lặp đếm: `for (let i = 0; i < n; i++)`. Cẩn thận điều kiện luôn đúng → vòng lặp vô hạn làm treo trình duyệt." },
    { k: ["mang", "array", "push"], lesson: "js-loops", a: "Mảng: `const a = [1, 2, 3]`. Truy cập `a[0]`, độ dài `a.length`, thêm `a.push(4)`, xoá cuối `a.pop()`, kiểm tra `a.includes(2)`." },
    { k: ["ham", "function", "return"], lesson: "js-functions", a: "Hàm đóng gói logic để dùng lại:\n```js\nfunction tong(a, b) {\n  return a + b;\n}\nconst tong2 = (a, b) => a + b; // arrow function\n```\n`return` trả kết quả ra ngoài; không có `return` thì hàm trả về `undefined`." },
    { k: ["object", "doi tuong"], lesson: "js-functions", a: "Object lưu dữ liệu dạng `khóa: giá trị`: `const sv = { ten: \"An\", tuoi: 20 }`. Đọc `sv.ten`, sửa `sv.tuoi = 21`, duyệt `for (const k in sv)`." },
    { k: ["arrow", "mui ten", "=>"], lesson: "js-array-methods", a: "Arrow function: `const binhPhuong = x => x * x;`. Nhiều tham số dùng ngoặc `(a, b) => a + b`; nhiều dòng dùng `{ ... return ...; }`." },
    { k: ["map", "filter", "reduce", "find"], lesson: "js-array-methods", a: "`map` biến đổi từng phần tử → mảng mới; `filter` lọc theo điều kiện; `reduce` gộp thành 1 giá trị; `find` lấy phần tử đầu tiên thoả điều kiện.\n```js\n[1,2,3,4].filter(x => x % 2 === 0).map(x => x * 10); // [20, 40]\n```" },
    { k: ["dom", "queryselector", "chon phan tu"], lesson: "dom-select", a: "DOM là cây phần tử của trang. Chọn: `document.querySelector(\"#id\")` / `.querySelectorAll(\".class\")`. Sửa: `el.textContent`, `el.style.color`, `el.classList.add()`." },
    { k: ["innerhtml", "textcontent"], lesson: "dom-select", a: "`textContent` gán **chữ thuần** (an toàn). `innerHTML` hiểu cả thẻ HTML – tiện nhưng **không dùng với dữ liệu người dùng nhập** vì có thể bị tấn công XSS." },
    { k: ["su kien", "event", "click", "addeventlistener"], lesson: "dom-events", a: "```js\nbtn.addEventListener(\"click\", (e) => {\n  console.log(\"Đã bấm!\", e.target);\n});\n```\nSự kiện hay dùng: `click`, `input`, `submit`, `keydown`, `change`." },
    { k: ["preventdefault", "tai lai trang", "submit"], lesson: "dom-events", a: "Form mặc định sẽ tải lại trang khi gửi. Chặn bằng:\n```js\nform.addEventListener(\"submit\", e => {\n  e.preventDefault();\n});\n```" },
    { k: ["todo", "createelement", "appendchild", "them phan tu"], lesson: "dom-create", a: "Tạo phần tử động:\n```js\nconst li = document.createElement(\"li\");\nli.textContent = \"Việc mới\";\nlist.appendChild(li);\n```" },
    { k: ["promise", "async", "await", "bat dong bo"], lesson: "js-async", a: "`async/await` giúp viết code bất đồng bộ như đồng bộ:\n```js\nasync function load() {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n  } catch (e) { console.error(e); }\n}\n```" },
    { k: ["fetch", "api", "goi api"], lesson: "js-async", a: "Gọi API bằng `fetch(url)` → trả về Promise. Nhớ `await res.json()` để lấy dữ liệu, kiểm tra `res.ok`, và bọc `try/catch`. Thử với API miễn phí: `https://jsonplaceholder.typicode.com/users`." },
    { k: ["json"], lesson: "js-json-storage", a: "`JSON.stringify(obj)` → chuỗi; `JSON.parse(chuoi)` → object. API và localStorage đều làm việc với chuỗi JSON." },
    { k: ["localstorage", "luu du lieu"], lesson: "js-json-storage", a: "```js\nlocalStorage.setItem(\"key\", JSON.stringify(data));\nconst data = JSON.parse(localStorage.getItem(\"key\")) || [];\n```\nDữ liệu tồn tại sau khi tải lại trang. Không lưu thông tin nhạy cảm!" },
    { k: ["console", "debug", "devtools", "f12"], a: "Mở **DevTools** bằng F12: tab *Console* xem lỗi & `console.log`, tab *Elements* xem/sửa HTML-CSS trực tiếp, tab *Sources* đặt breakpoint. Mẹo: `console.table(mang)` hiển thị mảng object dạng bảng." },
    { k: ["undefined", "null"], a: "`undefined`: biến được khai báo nhưng chưa gán giá trị. `null`: bạn chủ động gán 'rỗng'. Lỗi `Cannot read properties of null` thường do `querySelector` không tìm thấy phần tử – kiểm tra lại selector hoặc đặt `<script>` cuối `<body>`." },
    { k: ["is not defined", "not defined"], a: "Lỗi `X is not defined` nghĩa là dùng biến/hàm chưa khai báo: kiểm tra **chính tả** (JS phân biệt hoa/thường), phạm vi (biến khai báo trong `{}` không dùng được bên ngoài) hoặc thứ tự khai báo." },
    { k: ["vs code", "vscode", "live server", "extension"], a: "Gợi ý cho VS Code: cài extension **Live Server** (chuột phải `index.html` → *Open with Live Server*), **Prettier** (định dạng code), **Auto Rename Tag**, **ESLint**. Phím tắt: `Shift+Alt+F` định dạng, `Ctrl+/` comment, `Alt+↑/↓` di chuyển dòng, `Ctrl+D` chọn từ giống nhau." },
    { k: ["git", "github"], a: "**Git** lưu lịch sử thay đổi code: `git init`, `git add .`, `git commit -m \"mô tả\"`, `git push`. Đẩy lên **GitHub** rồi bật *GitHub Pages* là có website miễn phí để khoe dự án!" },
    { k: ["react"], a: "**React** là thư viện xây UI bằng *component*. Nên học sau khi vững JS: arrow function, destructuring, `map/filter`, module, Promise. Bắt đầu: `npm create vite@latest`." },
    { k: ["tailwind", "bootstrap"], a: "**Tailwind** và **Bootstrap** là framework CSS giúp làm giao diện nhanh. Nhưng hãy vững CSS thuần (box model, flex, grid) trước – khi đó dùng framework sẽ hiểu bản chất hơn." }
  ];

  /* ---------------- Phân tích code offline ---------------- */
  const VOID = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"];
  function analyzeCode(code) {
    const issues = [];
    // HTML: kiểm tra thẻ đóng/mở
    const html = (code.html || "").replace(/<!--[\s\S]*?-->/g, "");
    const stack = [];
    const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)[^>]*?(\/?)>/g;
    let m;
    while ((m = re.exec(html))) {
      const tag = m[1].toLowerCase();
      const closing = m[0][1] === "/";
      if (VOID.includes(tag) || m[2] === "/") continue;
      if (!closing) stack.push(tag);
      else {
        if (stack[stack.length - 1] === tag) stack.pop();
        else if (stack.includes(tag)) {
          const unclosed = stack.splice(stack.lastIndexOf(tag)).slice(1);
          issues.push("🧱 HTML: thẻ `<" + unclosed.join(">`, `<") + ">` chưa được đóng trước `</" + tag + ">`.");
        } else issues.push("🧱 HTML: có thẻ đóng `</" + tag + ">` nhưng không thấy thẻ mở tương ứng.");
      }
    }
    if (stack.length) issues.push("🧱 HTML: thẻ `<" + stack.join(">`, `<") + ">` chưa có thẻ đóng.");
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(html)) issues.push("🖼️ HTML: thẻ `<img>` nên có thuộc tính `alt`.");
    if (/=\s*[“”]/.test(html)) issues.push("✏️ HTML: có dấu ngoặc kép kiểu “ ” (do copy từ Word) – hãy dùng dấu \" thường.");

    // CSS
    const css = (code.css || "").replace(/\/\*[\s\S]*?\*\//g, "");
    const open = (css.match(/{/g) || []).length, close = (css.match(/}/g) || []).length;
    if (open !== close) issues.push("🎨 CSS: số dấu `{` (" + open + ") và `}` (" + close + ") không khớp.");
    css.split("\n").forEach((line, i) => {
      const t = line.trim();
      if (t && t.includes(":") && !/[;{}]$/.test(t) && !t.startsWith("@") && !/,$/.test(t) && !/^[^{]*:(hover|focus|active|root|nth|not|first|last|before|after)/.test(t))
        issues.push("🎨 CSS dòng " + (i + 1) + ": có thể thiếu dấu `;` → `" + esc(t) + "`");
      if (/:\s*\d+\s+(px|rem|em|%)/.test(t)) issues.push("🎨 CSS dòng " + (i + 1) + ": không được có khoảng trắng giữa số và đơn vị (vd: `20px`, không phải `20 px`).");
    });

    // JS
    const js = code.js || "";
    if (js.trim()) {
      try { new Function(js); }
      catch (e) { issues.push("⚡ JS lỗi cú pháp: **" + esc(e.message) + "**. Kiểm tra dấu ngoặc `() {} []`, dấu nháy và dấu phẩy."); }
      js.split("\n").forEach((line, i) => {
        if (/\bif\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(line)) issues.push("⚡ JS dòng " + (i + 1) + ": trong `if` đang dùng `=` (gán) – có lẽ bạn muốn `===` (so sánh)?");
        if (/[^=!]==[^=]/.test(line)) issues.push("⚡ JS dòng " + (i + 1) + ": nên dùng `===` thay cho `==`.");
        if (/\bvar\s/.test(line)) issues.push("⚡ JS dòng " + (i + 1) + ": nên dùng `let`/`const` thay cho `var`.");
        if (/getElementById\(\s*["']#/.test(line)) issues.push("⚡ JS dòng " + (i + 1) + ": `getElementById` không cần dấu `#` (khác với `querySelector`).");
        if (/document\.queryselector|addeventlistener|textcontent|innerhtml/.test(line) && !/querySelector|addEventListener|textContent|innerHTML/.test(line))
          issues.push("⚡ JS dòng " + (i + 1) + ": JavaScript phân biệt hoa/thường – kiểm tra `querySelector`, `addEventListener`, `textContent`.");
      });
    }
    return issues;
  }

  /* ---------------- Định dạng tin nhắn ---------------- */
  function format(text) {
    const blocks = [];
    let s = String(text).replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
      blocks.push("<pre><code>" + esc(code.replace(/\n$/, "")) + "</code></pre>");
      return "\u0000" + (blocks.length - 1) + "\u0000";
    });
    s = esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/\[\[lesson:([\w-]+)\|([^\]]+)\]\]/g, '<a class="lesson-jump" data-lesson="$1">📘 $2</a>')
      .replace(/\n/g, "<br>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[i]);
  }

  const lessonLink = id => {
    const l = LESSONS.find(x => x.id === id);
    return l ? "[[lesson:" + l.id + "|" + l.title + "]]" : "";
  };

  /* ---------------- Bộ não offline ---------------- */
  function offlineReply(text, ctx) {
    const q = norm(text);
    const has = (...w) => w.some(x => q.includes(x));
    const L = ctx.lesson;

    if (/^(xin chao|chao|hello|hi|hey|alo)\b/.test(q))
      return "Chào bạn! 👋 Mình là **Bit**, trợ lý học Front-end. Bạn có thể hỏi mình về HTML, CSS, JavaScript, nhờ **kiểm tra code**, xin **gợi ý** bài tập hoặc hỏi **lộ trình học** nhé!";
    if (has("cam on", "thanks", "thank"))
      return "Không có gì! 😄 Cứ học từ từ, mỗi ngày một chút là sẽ giỏi thôi. Cần gì cứ gọi Bit nhé!";

    if (has("kiem tra code", "code loi", "sai o dau", "bi loi", "debug", "review", "sua loi", "loi gi", "check code")) {
      if (!ctx.code) return "Hãy mở một bài học hoặc **Sân chơi code**, viết code rồi hỏi lại mình để mình kiểm tra nhé! 🔍";
      const issues = analyzeCode(ctx.code);
      if (!issues.length)
        return "🔍 Mình đã soát qua code của bạn và **không thấy lỗi cú pháp phổ biến** nào. " + (L ? "Hãy bấm **✅ Kiểm tra bài** để chấm theo yêu cầu đề, hoặc xem tab *Console* để biết lỗi khi chạy." : "Xem tab *Console* nếu kết quả chưa như mong muốn.");
      return "🔍 Mình tìm thấy **" + issues.length + "** điểm cần xem lại:\n\n• " + issues.slice(0, 8).join("\n• ");
    }

    if (has("goi y", "hint", "bi tac", "khong lam duoc", "huong dan bai tap")) {
      if (L) return "💡 **Gợi ý bài \"" + L.title + "\":**\n" + L.exercise.hint + "\n\nThử lại rồi bấm **Kiểm tra bài** nhé. Nếu vẫn kẹt, hãy nhờ mình *kiểm tra code*.";
    }
    if (has("dap an", "loi giai", "solution")) {
      if (L) return "🔑 Đây là **một** lời giải tham khảo (bạn cũng có thể bấm nút *Xem đáp án* trong bài):\n" +
        ["html", "css", "js"].filter(k => L.exercise.solution[k]).map(k => "```" + k + "\n" + L.exercise.solution[k] + "\n```").join("") +
        "\nHãy tự gõ lại thay vì copy – não sẽ nhớ lâu hơn nhiều! 🧠";
    }
    if (L && has("bai nay", "giai thich", "tom tat", "bai hoc nay", "dang hoc gi")) {
      const points = L.content.filter(b => b.h).map(b => "• " + b.h).join("\n");
      return "📘 **" + L.title + "**\n" + L.summary + "\n\nCác ý chính:\n" + points + "\n\n🎯 Bài tập: " + L.exercise.task;
    }
    if (has("lo trinh", "roadmap", "hoc gi tiep", "bat dau tu dau", "nen hoc gi", "hoc tiep")) {
      return "🗺️ **Lộ trình gợi ý:**\n1. 🧱 HTML → 2. 🎨 CSS → 3. 📐 Flexbox/Grid/Responsive → 4. ⚡ JavaScript cơ bản → 5. 🖱️ DOM & Sự kiện → 6. 🚀 JS nâng cao (async, JSON)\n\nSau đó: 🌿 Git/GitHub → 📦 npm + Vite → 🌬️ Tailwind → 🔷 TypeScript → ⚛️ React.\n\nMỗi ngày 1 bài + làm 1 mini project mỗi cấp là tiến bộ rất nhanh! Bắt đầu tại: " + lessonLink("html-intro");
    }
    if (has("tien do", "da hoc", "bao nhieu bai")) {
      return "📊 Bạn đã hoàn thành **" + ctx.done + "/" + LESSONS.length + "** bài và có **" + ctx.xp + " XP**. " + (ctx.next ? "Bài tiếp theo nên học: " + lessonLink(ctx.next) : "Bạn đã học xong tất cả – quá đỉnh! 🏆");
    }

    // Kho kiến thức: chấm điểm theo số từ khoá khớp (ưu tiên cụm dài)
    let best = null, bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const k of item.k) {
        const kn = norm(k);
        const re = new RegExp("(^|[^a-z0-9])" + kn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-z0-9])");
        if (re.test(q)) score += kn.length;
      }
      if (score > bestScore) { best = item; bestScore = score; }
    }
    if (best) return best.a + (best.lesson ? "\n\n👉 Học kỹ hơn: " + lessonLink(best.lesson) : "");

    // Tìm trong nội dung bài học
    const words = q.split(/\s+/).filter(w => w.length > 2);
    const ranked = LESSONS.map(l => {
      const hay = norm(l.title + " " + l.summary + " " + JSON.stringify(l.content));
      return { l, s: words.reduce((t, w) => t + (hay.includes(w) ? 1 : 0), 0) };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
    if (ranked.length) return "Mình nghĩ những bài này sẽ giúp bạn: 👇\n" + ranked.map(x => lessonLink(x.l.id)).join(" ");

    return "Hmm, câu này hơi khó với bộ não offline của mình 😅. Bạn thử hỏi theo từ khoá như *flexbox*, *margin*, *fetch*, *sự kiện click*… hoặc bấm ⚙️ để kết nối **AI thật** (Gemini/OpenAI) nhé!";
  }

  /* ---------------- Gọi AI thật ---------------- */
  async function aiReply(history, ctx, cfg) {
    const sys = [
      "Bạn là Bit – trợ lý dạy lập trình Front-end (HTML, CSS, JavaScript) cho người mới bắt đầu.",
      "Luôn trả lời bằng tiếng Việt, thân thiện, ngắn gọn, có ví dụ code nhỏ khi cần (dùng ```lang).",
      "Ưu tiên gợi mở để học viên tự làm; chỉ đưa lời giải đầy đủ khi họ yêu cầu rõ ràng.",
      ctx.lesson ? "Học viên đang ở bài: \"" + ctx.lesson.title + "\". Đề bài tập: " + ctx.lesson.exercise.task : "Học viên đang ở trang tổng quan hoặc sân chơi.",
      ctx.code ? "Code hiện tại của học viên:\nHTML:\n" + ctx.code.html + "\nCSS:\n" + ctx.code.css + "\nJS:\n" + ctx.code.js : ""
    ].join("\n");
    const recent = history.slice(-10);

    if (cfg.provider === "gemini") {
      const model = cfg.model || "gemini-3.8-flash";
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents: recent.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data.error && data.error.message) || "HTTP " + res.status);
      return (data.candidates?.[0]?.content?.parts || []).map(p => p.text).join("") || "(AI không trả lời)";
    }

    const base = (cfg.base || "https://api.openai.com/v1").replace(/\/$/, "");
    const res = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + cfg.key },
      body: JSON.stringify({
        model: cfg.model || "gpt-4o-mini",
        messages: [{ role: "system", content: sys }].concat(recent.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })))
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data.error && data.error.message) || "HTTP " + res.status);
    return data.choices?.[0]?.message?.content || "(AI không trả lời)";
  }

  /* ---------------- Giao diện chat ---------------- */
  const Chatbot = {
    history: [],
    cfg: { provider: "offline", key: "", model: "", base: "" },

    init(getContext, openLesson) {
      this.getContext = getContext;
      this.openLesson = openLesson;
      const $ = id => document.getElementById(id);
      this.el = { fab: $("chatFab"), box: $("chat"), body: $("chatBody"), form: $("chatForm"), text: $("chatText"), chips: $("chatChips"), mode: $("chatMode"), settings: $("chatSettings") };

      try { Object.assign(this.cfg, JSON.parse(localStorage.getItem("fe-ai-cfg") || "{}")); } catch (e) {}
      $("aiProvider").value = this.cfg.provider; $("aiKey").value = this.cfg.key; $("aiModel").value = this.cfg.model; $("aiBase").value = this.cfg.base;
      this.updateMode();

      this.el.fab.addEventListener("click", () => {
        if (this._dragged) { this._dragged = false; return; } // vừa kéo xong → không mở chat
        this.toggle();
      });
      this.initDrag();
      $("chatClose").addEventListener("click", () => this.toggle(false));
      $("chatSettingsBtn").addEventListener("click", () => { this.el.settings.hidden = !this.el.settings.hidden; });
      $("aiSave").addEventListener("click", () => {
        this.cfg = { provider: $("aiProvider").value, key: $("aiKey").value.trim(), model: $("aiModel").value.trim(), base: $("aiBase").value.trim() };
        try { localStorage.setItem("fe-ai-cfg", JSON.stringify(this.cfg)); } catch (e) {}
        this.el.settings.hidden = true;
        this.updateMode();
        this.add("bot", this.cfg.provider === "offline" ? "Đã chuyển về chế độ **offline** ✅" : "Đã kết nối **" + (this.cfg.provider === "gemini" ? "Google Gemini" : "OpenAI-compatible") + "** ✅ Hỏi thử mình đi!");
      });

      this.el.form.addEventListener("submit", e => { e.preventDefault(); this.send(); });
      this.el.text.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.send(); } });
      this.el.text.addEventListener("input", () => { this.el.text.style.height = "auto"; this.el.text.style.height = Math.min(120, this.el.text.scrollHeight) + "px"; });
      this.el.body.addEventListener("click", e => {
        const a = e.target.closest(".lesson-jump");
        if (a) { this.openLesson(a.dataset.lesson); if (innerWidth < 820) this.toggle(false); }
      });

      this.add("bot", "Xin chào! Mình là **Bit** 🤖 – trợ lý học tập của bạn.\nMình có thể giải thích kiến thức, **gợi ý bài tập**, **kiểm tra lỗi code** và gợi ý **lộ trình học**. Hỏi mình bất cứ lúc nào nhé!");
      this.renderChips();
    },

    updateMode() {
      const on = this.cfg.provider !== "offline" && this.cfg.key;
      this.el.mode.textContent = on ? "🟢 AI: " + (this.cfg.provider === "gemini" ? "Gemini" : "OpenAI") + (this.cfg.model ? " · " + this.cfg.model : "") : "Chế độ offline · luôn sẵn sàng";
      document.querySelectorAll(".openai-only").forEach(x => x.style.display = document.getElementById("aiProvider").value === "openai" ? "" : "none");
      document.getElementById("aiProvider").onchange = () => this.updateMode();
    },

    toggle(force) {
      const open = force !== undefined ? force : !this.el.box.classList.contains("open");
      this.el.box.classList.toggle("open", open);
      this.el.box.setAttribute("aria-hidden", !open);
      this.el.fab.classList.add("seen");
      if (open) { this.positionPanel(); this.renderChips(); setTimeout(() => this.el.text.focus(), 200); }
    },

    /* ---------- Kéo thả logo chatbot ----------
       Kéo > 6px mới tính là "kéo" (dưới ngưỡng vẫn là click mở chat).
       Thả ra: hít vào mép trái/phải gần nhất, lưu { side, ry } vào localStorage
       (ry = tỉ lệ theo chiều cao → giữ đúng chỗ khi đổi kích thước cửa sổ). */
    initDrag() {
      const fab = this.el.fab, KEY = "fe-fab-pos", MARGIN = 20, THRESHOLD = 6;
      const size = () => [fab.offsetWidth, fab.offsetHeight];
      const clamp = (x, y) => {
        const [w, h] = size();
        return [Math.min(Math.max(MARGIN, x), innerWidth - w - MARGIN), Math.min(Math.max(MARGIN, y), innerHeight - h - MARGIN)];
      };
      const place = (x, y) => {
        [x, y] = clamp(x, y);
        Object.assign(fab.style, { left: x + "px", top: y + "px", right: "auto", bottom: "auto" });
      };
      const applySaved = () => {
        if (!this.fabPos) return;
        const [w, h] = size();
        place(this.fabPos.side === "left" ? MARGIN : innerWidth - w - MARGIN, this.fabPos.ry * (innerHeight - h));
        if (this.el.box.classList.contains("open")) this.positionPanel();
      };
      try { this.fabPos = JSON.parse(localStorage.getItem(KEY)); } catch (e) { this.fabPos = null; }
      applySaved();
      addEventListener("resize", applySaved);

      let start = null;
      fab.addEventListener("pointerdown", e => {
        if (e.button !== 0) return;
        const r = fab.getBoundingClientRect();
        start = { px: e.clientX, py: e.clientY, x: r.left, y: r.top, moved: false };
        fab.setPointerCapture(e.pointerId);
      });
      fab.addEventListener("pointermove", e => {
        if (!start) return;
        const dx = e.clientX - start.px, dy = e.clientY - start.py;
        if (!start.moved && Math.hypot(dx, dy) < THRESHOLD) return;
        if (!start.moved) { start.moved = true; fab.classList.add("dragging"); }
        place(start.x + dx, start.y + dy);
        if (this.el.box.classList.contains("open")) this.positionPanel();
      });
      const end = () => {
        if (!start) return;
        const moved = start.moved; start = null;
        fab.classList.remove("dragging");
        if (!moved) return;
        this._dragged = true; setTimeout(() => { this._dragged = false; }, 0); // chặn click ngay sau khi thả
        const r = fab.getBoundingClientRect();
        const side = r.left + r.width / 2 < innerWidth / 2 ? "left" : "right";
        this.fabPos = { side, ry: r.top / Math.max(1, innerHeight - r.height) };
        try { localStorage.setItem(KEY, JSON.stringify(this.fabPos)); } catch (e) {}
        fab.classList.add("snapping");
        applySaved();
        setTimeout(() => fab.classList.remove("snapping"), 300);
      };
      fab.addEventListener("pointerup", end);
      fab.addEventListener("pointercancel", end);
      // Nhấp đúp: đưa logo về góc phải dưới mặc định
      fab.addEventListener("dblclick", () => {
        this.fabPos = null;
        try { localStorage.removeItem(KEY); } catch (e) {}
        fab.removeAttribute("style");
        this.positionPanel();
      });
    },

    /* Đặt khung chat cạnh logo: logo bên trái → khung mở sang phải; logo nửa trên → khung mở xuống dưới */
    positionPanel() {
      const box = this.el.box;
      if (!this.fabPos) { box.removeAttribute("style"); return; } // vị trí mặc định theo CSS
      const r = this.el.fab.getBoundingClientRect(), GAP = 12, M = 16;
      const left = this.fabPos.side === "left", below = r.top + r.height / 2 < innerHeight / 2;
      const s = { left: "auto", right: "auto", top: "auto", bottom: "auto" };
      if (left) s.left = Math.max(M, r.left) + "px"; else s.right = Math.max(M, innerWidth - r.right) + "px";
      if (below) { s.top = r.bottom + GAP + "px"; s.maxHeight = innerHeight - r.bottom - GAP - M + "px"; }
      else { s.bottom = innerHeight - r.top + GAP + "px"; s.maxHeight = r.top - GAP - M + "px"; }
      s.transformOrigin = (below ? "top " : "bottom ") + (left ? "left" : "right");
      Object.assign(box.style, s);
    },

    renderChips() {
      const ctx = this.getContext();
      const chips = ctx.lesson
        ? ["📘 Giải thích bài này", "💡 Gợi ý bài tập", "🔍 Kiểm tra code của tôi", "🔑 Xem đáp án"]
        : ["🗺️ Lộ trình học", "📊 Tiến độ của tôi", "↔️ Flexbox là gì?", "⏳ async/await"];
      this.el.chips.innerHTML = chips.map(c => `<button class="chip">${c}</button>`).join("");
      this.el.chips.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => {
        this.el.text.value = b.textContent.replace(/^\S+\s/, ""); this.send();
      }));
    },

    add(role, text) {
      const div = document.createElement("div");
      div.className = "msg " + role;
      div.innerHTML = role === "user" ? esc(text).replace(/\n/g, "<br>") : format(text);
      this.el.body.appendChild(div);
      this.el.body.scrollTop = 1e9;
      this.history.push({ role, text });
    },

    async send() {
      const text = this.el.text.value.trim();
      if (!text) return;
      this.el.text.value = ""; this.el.text.style.height = "auto";
      this.add("user", text);

      const typing = document.createElement("div");
      typing.className = "msg bot typing"; typing.innerHTML = "<span></span><span></span><span></span>";
      this.el.body.appendChild(typing); this.el.body.scrollTop = 1e9;

      const ctx = this.getContext();
      let reply;
      if (this.cfg.provider !== "offline" && this.cfg.key) {
        try { reply = await aiReply(this.history, ctx, this.cfg); }
        catch (e) { reply = "⚠️ Không gọi được AI (" + e.message + "). Mình trả lời bằng chế độ offline nhé:\n\n" + offlineReply(text, ctx); }
      } else {
        await new Promise(r => setTimeout(r, 450 + Math.random() * 400));
        reply = offlineReply(text, ctx);
      }
      typing.remove();
      this.add("bot", reply);
    },

    /* Cho app gọi khi học viên làm sai nhiều lần */
    nudge(text) {
      this.add("bot", text);
      this.el.fab.classList.remove("seen");
    }
  };

  window.Chatbot = Chatbot;
  window.analyzeCode = analyzeCode;
})();
