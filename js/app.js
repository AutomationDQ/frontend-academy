/* =========================================================
   APP CHÍNH – điều hướng, tiến độ, render giao diện
   Router dùng hash: #/  |  #/course/<id>  |  #/lesson/<id>  |  #/playground  |  #/profile
                     #/certificates  |  #/certificate/<courseId>  |  #/verify/<mã>
   ========================================================= */
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const STORE_KEY = "fe-academy-v1";

  /* ---------------- Lưu trữ tiến độ ---------------- */
  const state = {
    done: {},        // { lessonId: true }
    pdone: {},       // { "<lessonId>#p<n>": thời điểm } – bài luyện tập đã làm
    doneAt: {},      // { lessonId: thời điểm hoàn thành (ms) } – cho hồ sơ & lịch sử học
    code: {},        // { lessonId: {html,css,js} } – code bài tập đã lưu
    xp: 0,
    streak: 0,
    lastDay: null,
    theme: "light",
    themeV: 2,       // v2: bảng màu xanh lá – trắng – vàng
    course: "fe-basic", // khoá học đang chọn ở sidebar
    playground: null
  };
  function load() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) {}
    Object.assign(state, saved);
    if (saved.themeV !== 2) { state.theme = "light"; state.themeV = 2; } // chuyển sang theme mới 1 lần
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function touchStreak() {
    const today = new Date().toDateString();
    if (state.lastDay === today) return;
    const y = new Date(Date.now() - 864e5).toDateString();
    state.streak = state.lastDay === y ? state.streak + 1 : 1;
    state.lastDay = today;
    save();
  }

  const levelOf = id => LEVELS.find(l => l.id === id);
  const lessonsOf = lv => LESSONS.filter(l => l.level === lv);
  const courseById = id => COURSES.find(c => c.id === id) || COURSES[0];
  const courseOf = lesson => courseById(levelOf(lesson.level).course);
  const levelsOfCourse = cid => LEVELS.filter(l => l.course === cid);
  const lessonsOfCourse = cid => LESSONS.filter(l => levelOf(l.level).course === cid);
  const doneCount = (cid) => (cid ? lessonsOfCourse(cid) : LESSONS).filter(l => state.done[l.id]).length;
  const nextLesson = (cid) => {
    const list = lessonsOfCourse(cid || state.course);
    return (list.find(l => !state.done[l.id]) || LESSONS.find(l => !state.done[l.id]) || {}).id;
  };
  const levelNo = lv => levelsOfCourse(lv.course).indexOf(lv) + 1;
  const courseDone = cid => doneCount(cid) === lessonsOfCourse(cid).length;
  const courseHours = cid => Math.max(1, Math.round(lessonsOfCourse(cid).reduce((t, l) => t + l.duration, 0) / 60));

  /* ---------------- Tô màu cú pháp đơn giản ---------------- */
  const RULES = {
    html: [[/<!--[\s\S]*?-->/, "tk-com"], [/<\/?[a-zA-Z][\w-]*|\/?>/, "tk-tag"], [/"[^"]*"/, "tk-str"], [/\s[a-zA-Z-]+(?==)/, "tk-attr"]],
    css: [[/\/\*[\s\S]*?\*\//, "tk-com"], [/@[\w-]+/, "tk-kw"], [/[\w-]+(?=\s*:[^:{]*[;}\n])/, "tk-prop"], [/"[^"]*"|'[^']*'/, "tk-str"], [/#[0-9a-fA-F]{3,8}\b|-?\b\d+(\.\d+)?(px|rem|em|%|s|ms|deg|fr|vh|vw)?\b/, "tk-num"]],
    js: [[/\/\/[^\n]*|\/\*[\s\S]*?\*\//, "tk-com"], [/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`/, "tk-str"],
      [/\b(const|let|var|function|return|if|else|for|of|in|while|new|async|await|try|catch|throw|class|true|false|null|undefined|typeof|this)\b/, "tk-kw"],
      [/\b\d+(\.\d+)?\b/, "tk-num"], [/\.[a-zA-Z_]\w*(?=\()/, "tk-prop"]],
    sql: [[/--[^\n]*/, "tk-com"], [/'(?:[^']|'')*'/, "tk-str"],
      [/\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|IF|NOT|EXISTS|DROP|AND|OR|NULL|IS|IN|LIKE|BETWEEN|ORDER|BY|GROUP|HAVING|ASC|DESC|LIMIT|OFFSET|AS|JOIN|INNER|LEFT|ON|DISTINCT|PRIMARY|KEY|AUTOINCREMENT|UNIQUE|DEFAULT|REFERENCES|INTEGER|TEXT|REAL|COUNT|SUM|AVG|MIN|MAX)\b/i, "tk-kw"],
      [/\b\d+(\.\d+)?\b/, "tk-num"]],
    bash: [[/#[^\n]*/, "tk-com"], [/"[^"]*"|'[^']*'/, "tk-str"], [/^\s*[\w.-]+(?=\s|$)/m, "tk-kw"], [/\s--?[\w-]+/, "tk-attr"]]
  };
  RULES.ts = RULES.js; RULES.json = RULES.js; RULES.http = RULES.bash;
  function highlight(code, lang) {
    const rules = RULES[lang] || RULES.js;
    const re = new RegExp(rules.map(r => "(" + r[0].source + ")").join("|"), "g");
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      if (m[0] === "") { re.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      let g = 0, idx = 1;
      for (let i = 0; i < rules.length; i++) {
        if (m[idx] !== undefined) { g = i; break; }
        idx += 1 + (new RegExp(rules[i][0].source + "|").exec("").length - 1);
      }
      out += '<span class="' + rules[g][1] + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }
  const guessLang = c => /^\s*</.test(c) ? "html" : (/^[\s\S]*\{[\s\S]*:[\s\S]*;/.test(c) && !/\b(const|let|function|=>|console)\b/.test(c) ? "css" : "js");

  function inline(t) {
    const codes = [];
    let s = String(t).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return "\u0001" + (codes.length - 1) + "\u0001"; });
    s = esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return s.replace(/\u0001(\d+)\u0001/g, (_, i) => "<code>" + esc(codes[i]) + "</code>");
  }

  function renderBlocks(blocks) {
    return blocks.map(b => {
      if (b.h) return "<h2>" + esc(b.h) + "</h2>";
      if (b.p) return "<p>" + inline(b.p) + "</p>";
      if (b.list) return "<ul>" + b.list.map(i => "<li>" + inline(i) + "</li>").join("") + "</ul>";
      if (b.tip) return '<div class="callout tip"><span class="ci">💡</span><div>' + inline(b.tip) + "</div></div>";
      if (b.warn) return '<div class="callout warn"><span class="ci">⚠️</span><div>' + inline(b.warn) + "</div></div>";
      if (b.code !== undefined) {
        const lang = b.lang || guessLang(b.code);
        return '<div class="code-block"><button class="copy">📋 Copy</button><pre><code data-lang="' + lang + '">' + highlight(b.code, lang) + "</code></pre></div>";
      }
      return "";
    }).join("");
  }

  /* ---------------- Tiện ích UI ---------------- */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }
  function confetti() {
    const box = $("#confetti");
    const colors = ["#16a34a", "#22c55e", "#84cc16", "#facc15", "#fde047", "#ffffff"];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement("i");
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 1.6 + Math.random() * 1.8 + "s";
      c.style.animationDelay = Math.random() * .4 + "s";
      c.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      box.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }
  function bindCopy(root) {
    root.querySelectorAll(".code-block .copy").forEach(btn => btn.addEventListener("click", () => {
      const txt = btn.nextElementSibling.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
        () => { btn.textContent = "✅ Đã copy"; setTimeout(() => btn.textContent = "📋 Copy", 1500); },
        () => toast("Không copy được – hãy bôi đen và Ctrl+C"));
    }));
  }

  /* ---------------- Sidebar ---------------- */
  function renderProgress() {
    const c = courseById(state.course);
    const pct = Math.round(doneCount(c.id) / lessonsOfCourse(c.id).length * 100);
    $("#progressLabel").textContent = "Tiến độ · " + c.short;
    $("#progressText").textContent = pct + "%";
    $("#progressBar").style.width = pct + "%";
    $("#xpText").textContent = state.xp;
    $("#streakText").textContent = state.streak;
  }

  function renderSidebar(filter = "") {
    const f = filter.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const match = l => !f || (l.title + " " + l.summary).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().includes(f);
    const current = currentLessonId();
    $("#courseTabs").innerHTML = COURSES.map(c => `<button class="course-tab ${c.id === state.course ? "active" : ""}" role="tab" aria-selected="${c.id === state.course}" data-course="${c.id}" title="${c.name}">${c.icon}<br>${c.short}</button>`).join("");
    $("#courseTabs").querySelectorAll(".course-tab").forEach(b => b.addEventListener("click", () => {
      state.course = b.dataset.course; save(); renderSidebar($("#searchInput").value);
    }));
    const levels = f ? LEVELS : levelsOfCourse(state.course);   // đang tìm kiếm → tìm trong mọi khoá
    $("#levelList").innerHTML = levels.map(lv => {
      const ls = lessonsOf(lv.id).filter(match);
      if (!ls.length) return "";
      const d = lessonsOf(lv.id).filter(l => state.done[l.id]).length;
      const prefix = f ? courseById(lv.course).short + " · " : "Cấp " + levelNo(lv) + " · ";
      return `<div class="level-group">
        <div class="level-head"><span class="level-dot" style="background:${lv.color}"></span>${lv.icon} ${prefix}${lv.name}<span class="count">${d}/${lessonsOf(lv.id).length}</span></div>
        <div class="lessons">${ls.map(l => `
          <button class="lesson-link ${l.id === current ? "active" : ""}" data-lesson="${l.id}">
            <span class="ic">${l.icon}</span><span>${esc(l.title)}</span>
            <span class="st">${practiceOf(l.id).length ? `<small class="pc ${pDoneCount(l.id) === practiceOf(l.id).length ? "full" : ""}" title="Bài luyện tập đã làm">${pDoneCount(l.id)}/${practiceOf(l.id).length}</small>` : ""}${state.done[l.id] ? "✅" : ""}</span>
          </button>`).join("")}
        </div></div>`;
    }).join("") || '<p class="muted" style="padding:8px">Không tìm thấy bài học 🔍</p>';

    $("#levelList").querySelectorAll(".lesson-link").forEach(b => b.addEventListener("click", () => go("#/lesson/" + b.dataset.lesson)));
    $("#levelList").querySelectorAll(".level-head").forEach(h => h.addEventListener("click", () => h.parentElement.classList.toggle("collapsed")));
    const pgName = route().page;
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active",
      (b.dataset.nav === "home" && pgName === "home") || (b.dataset.nav === "playground" && pgName === "playground") || (b.dataset.nav === "profile" && pgName === "profile") ||
      (b.dataset.nav === "certificates" && ["certificates", "certificate", "verify"].includes(pgName))));
    renderProgress();
  }

  /* ---------------- Router ---------------- */
  let pg = null;            // playground hiện tại
  let currentLesson = null; // bài học hiện tại

  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    if (h[0] === "lesson" && LESSONS.find(l => l.id === h[1])) return { page: "lesson", id: h[1] };
    if (h[0] === "course" && COURSES.find(c => c.id === h[1])) return { page: "course", id: h[1] };
    if (h[0] === "playground") return { page: "playground" };
    if (h[0] === "certificates") return { page: "certificates" };
    if (h[0] === "profile") return { page: "profile" };
    if (h[0] === "certificate" && COURSES.find(c => c.id === h[1])) return { page: "certificate", id: h[1] };
    if (h[0] === "verify") return { page: "verify", id: decodeURIComponent(h[1] || "") };
    return { page: "home" };
  }
  const currentLessonId = () => route().page === "lesson" ? route().id : null;
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  function render() {
    if (pg) { pg.destroy(); pg = null; }
    currentLesson = null; currentTask = null;
    const r = route();
    const view = $("#view");
    view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
    if (r.page === "lesson" && !Account.isRegistered()) renderLocked(r.id);
    else if (r.page === "lesson") renderLesson(r.id);
    else if (r.page === "course") renderCourse(r.id);
    else if (r.page === "certificates") renderCertificates();
    else if (r.page === "profile") renderProfile();
    else if (r.page === "certificate") renderCertificate(r.id);
    else if (r.page === "verify") renderVerify(r.id);
    else if (r.page === "playground") renderPlayground();
    else renderHome();
    renderSidebar($("#searchInput").value);
    $("#sidebar").classList.remove("open");
    $(".main").scrollTop = 0;
    if (window.Chatbot && Chatbot.el) Chatbot.renderChips();
  }

  /* ---------------- Trang chủ ---------------- */
  function courseCard(c) {
    const ls = lessonsOfCourse(c.id), d = doneCount(c.id), min = ls.reduce((t, l) => t + l.duration, 0);
    const isNew = c.id !== "fe-basic" && d === 0;
    return `<div class="course-card" style="--c:${c.color}" data-go="#/course/${c.id}">
      ${isNew ? '<span class="cc-badge">MỚI</span>' : ""}
      <div class="cc-ic">${c.icon}</div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <div class="cc-tags">${c.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <div class="cc-meta"><span>📘 ${ls.length} bài · ${levelsOfCourse(c.id).length} cấp · ~${Math.round(min / 60)} giờ · 🏅 có chứng nhận</span><span>${d === ls.length ? "🏅 Xong" : d + "/" + ls.length}</span></div>
      <div class="lv-bar"><div style="width:${d / ls.length * 100}%"></div></div>
    </div>`;
  }

  function renderHome() {
    $("#crumbs").innerHTML = "<b>🏠 Trang chủ</b>";
    const nx = nextLesson();
    const totalMin = LESSONS.reduce((t, l) => t + l.duration, 0);
    $("#view").innerHTML = `
      <section class="hero">
        <span class="hero-float" style="right:8%;top:18%">🧱</span>
        <span class="hero-float" style="right:22%;top:55%;animation-delay:-2s">⚛️</span>
        <span class="hero-float" style="right:6%;top:65%;animation-delay:-4s">🟩</span>
        <span class="hero-float" style="right:30%;top:12%;animation-delay:-3s">🗄️</span>
        <div style="font-size:13px;opacity:.8;margin-bottom:10px">👋 Chào mừng đến với Front-end Academy</div>
        <h1>Học lập trình web<br><span>Front-end → Back-end</span> – học đâu chạy đó</h1>
        <p>${COURSES.length} khoá học · ${LESSONS.length} bài, từ HTML cơ bản đến REST API với Node.js, SQL và JWT. Mỗi bài có ví dụ chạy thử ngay (kể cả server Back-end mô phỏng ngay trong trình duyệt), bài tập tự chấm điểm và trợ lý <b>Bit 🤖</b>.</p>
        <div class="hero-actions">
          <button class="btn primary" id="startBtn">${doneCount() ? "▶ Học tiếp" : "🚀 Bắt đầu học ngay"}</button>
          <button class="btn" data-go="#/playground">🧪 Mở sân chơi code</button>
        </div>
      </section>

      <div class="stats">
        <div class="stat"><div class="stat-ic">📚</div><div><b>${doneCount()}/${LESSONS.length}</b><small>Bài đã hoàn thành</small></div></div>
        <div class="stat"><div class="stat-ic">⭐</div><div><b>${state.xp} XP</b><small>Điểm kinh nghiệm</small></div></div>
        <div class="stat"><div class="stat-ic">🔥</div><div><b>${state.streak} ngày</b><small>Chuỗi học liên tục</small></div></div>
        <div class="stat"><div class="stat-ic">⏱️</div><div><b>~${Math.round(totalMin / 60)} giờ</b><small>Tổng thời lượng</small></div></div>
      </div>

      <h2 class="section-title">🎓 Khoá học</h2>
      <div class="courses">${COURSES.map(courseCard).join("")}</div>

      <h2 class="section-title">🔭 Học gì tiếp theo?</h2>
      <div class="next-grid">
        ${ROADMAP_NEXT.map(n => `<div class="next-card"><span>${n.icon}</span><b>${n.name}</b><p>${n.desc}</p></div>`).join("")}
      </div>
      <p class="muted" style="margin:28px 0 0;font-size:13px">💡 Mẹo: bấm <b>Ctrl + Enter</b> trong ô code để chạy, hỏi Bit 🤖 "kiểm tra code" khi gặp lỗi.</p>
      <footer class="site-footer">© ${new Date().getFullYear()} <b>Front-end Academy</b> · Thực hiện bởi <b>Doãn Quảng</b></footer>`;

    $("#startBtn").addEventListener("click", () => go("#/lesson/" + (nx || LESSONS[0].id)));
    $("#view").querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
  }

  /* ---------------- Trang khoá học ---------------- */
  function renderCourse(cid) {
    const c = courseById(cid);
    state.course = cid; save();
    const ls = lessonsOfCourse(cid), d = doneCount(cid);
    $("#crumbs").innerHTML = `<a href="#/">🏠</a> › <b>${c.icon} ${c.name}</b>`;
    $("#view").innerHTML = `
      <section class="course-hero" style="--c:${c.color}">
        <div class="cc-ic">${c.icon}</div>
        <div style="flex:1">
          <h1>${c.name}</h1>
          <p>${c.desc}</p>
          <p style="margin-top:8px;font-size:13px">📘 ${ls.length} bài · ⏱️ ~${Math.round(ls.reduce((t, l) => t + l.duration, 0) / 60)} giờ · ✅ ${d}/${ls.length} hoàn thành</p>
        </div>
        <button class="btn primary" data-go="#/lesson/${nextLesson(cid)}">${d ? "▶ Học tiếp" : "🚀 Bắt đầu khoá"}</button>
      </section>
      ${courseDone(cid) ? `<div class="cert-banner"><span>🏅</span><div><b>Bạn đã hoàn thành khoá ${c.name}!</b><small>${Account.certs[cid] ? "Chứng nhận mã " + esc(Account.certs[cid].certId) + " đã được cấp." : "Nhận chứng nhận hoàn thành do " + esc(ACADEMY_CONFIG.issuer) + " cấp."}</small></div><button class="btn accent" data-go="#/certificate/${cid}">${Account.certs[cid] ? "Xem chứng nhận" : "Nhận chứng nhận"}</button></div>` : `<p class="muted cert-hint">🏅 Hoàn thành đủ ${ls.length} bài để nhận <b>chứng nhận</b> do ${esc(ACADEMY_CONFIG.issuer)} cấp – còn ${ls.length - d} bài.</p>`}
      <h2 class="section-title">🗺️ Lộ trình</h2>
      <div class="levels">
        ${levelsOfCourse(cid).map(lv => {
          const lls = lessonsOf(lv.id), dd = lls.filter(l => state.done[l.id]).length;
          return `<div class="level-card" style="--c:${lv.color}" data-go="#/lesson/${(lls.find(l => !state.done[l.id]) || lls[0]).id}">
            <div class="lv-ic">${lv.icon}</div>
            <div class="lv-step">Cấp ${levelNo(lv)}</div>
            <h3>${lv.name}</h3>
            <p>${lv.desc}</p>
            <div class="lv-meta"><span>📘 ${lls.length} bài · ${lls.reduce((t, l) => t + l.duration, 0)} phút</span><span>${dd === lls.length ? "🏅 Hoàn thành" : dd + "/" + lls.length}</span></div>
            <div class="lv-bar"><div style="width:${dd / lls.length * 100}%"></div></div>
          </div>`;
        }).join("")}
      </div>`;
    $("#view").querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
  }

  /* ---------------- Trang bài học ---------------- */
  function defaultTab(lesson, code) {
    if (lesson.runtime === "node") return "js";
    if (!String(code.html || "").trim() && !String(code.css || "").trim() && String(code.js || "").trim()) return "js";
    if (["js", "advanced"].includes(lesson.level) && !String(code.html || "").trim()) return "js";
    if (["css", "layout"].includes(lesson.level)) return "css";
    if (lesson.level === "dom" || lesson.level === "advanced") return "js";
    return "html";
  }

  /* Mẹo soạn code theo ngữ cảnh bài học (khớp với tính năng của editor-pro.js) */
  function editorTipsHTML(lesson) {
    const ex = lesson.exercise, code = Object.assign({}, lesson.example || {}, ex.starter || {}, ex.solution || {});
    const has = k => lesson.runtime !== "node" && String(code[k] || "").trim();
    const K = s => s.split("+").map(x => `<kbd>${x}</kbd>`).join("+");
    const tips = [];
    if (lesson.runtime === "node") {
      tips.push(`Gõ <code>aget</code> / <code>apost</code> / <code>adel</code> rồi ${K("Enter")} → khung route Express có sẵn`);
      tips.push(`Gõ <code>res.</code> hoặc <code>req.</code> → danh sách <code>json</code>, <code>status</code>, <code>params</code>, <code>body</code>…`);
      tips.push(`Snippet <code>errmw</code> (middleware lỗi), <code>prep</code> (câu SQL an toàn), <code>bhash</code>, <code>jwt-sign</code>`);
    }
    if (has("html")) {
      tips.push(`HTML: gõ <code>ul>li*3</code> hoặc <code>div.card>h3+p</code> rồi ${K("Tab")} (Emmet)`);
      tips.push(`Gõ <code>&lt;</code> để chọn thẻ · gõ <code>&gt;</code> sau <code>&lt;div</code> là tự đóng thẻ`);
    }
    if (has("css")) tips.push(`CSS: trong <code>{ }</code> gõ <code>jus</code> → <code>justify-content</code>; snippet <code>flex-center</code>, <code>grid-auto</code>, <code>media</code>`);
    if (has("js")) tips.push(`JS: <code>qs</code> → querySelector · <code>ael</code> → addEventListener · <code>log</code> → console.log · gõ <code>arr.</code> xem phương thức`);
    tips.push(`${K("Ctrl+Space")} mở gợi ý · ${K("Ctrl+Enter")} chạy · ${K("Ctrl+/")} comment · ${K("Alt+↑")}${K("↓")} di chuyển dòng · ${K("Shift+Alt+F")} căn lề`);
    return `<details class="tips-card"><summary>⌨️ Mẹo soạn code nhanh như VS Code <small class="muted">(bấm để mở)</small></summary>
      <ul>${tips.map(t => `<li>${t}</li>`).join("")}</ul>
      <small class="muted">Bấm nút ⌨️ trên khung code để xem toàn bộ phím tắt.</small></details>`;
  }

  /* ---------------- Bài luyện tập thêm (PRACTICE – js/practice-*.js) ----------------
     Mỗi bài học có 1 bài tập chính (lesson.exercise – tính tiến độ & chứng nhận)
     + nhiều bài luyện tập PRACTICE[lessonId] = [{ title, level, task, starter, hint, solution, check }]
     Bài luyện tập: +30 XP, lưu code ở state.code["<id>#p<n>"], hoàn thành ở state.pdone */
  const practiceOf = id => (window.PRACTICE && PRACTICE[id]) || [];
  const pKey = (id, i) => i === 0 ? id : id + "#p" + i;
  const pDoneCount = id => practiceOf(id).filter((_, i) => state.pdone[pKey(id, i + 1)]).length;
  const totalPractice = () => LESSONS.reduce((t, l) => t + practiceOf(l.id).length, 0);
  const totalPracticeDone = () => LESSONS.reduce((t, l) => t + pDoneCount(l.id), 0);
  const DIFF = { 1: ["Dễ", "#16a34a"], 2: ["Trung bình", "#0ea5e9"], 3: ["Khó", "#f97316"], 4: ["Thử thách", "#a855f7"] };
  let currentTask = null;   // bài tập đang làm (chính hoặc luyện tập) – cho chatbot

  function renderLesson(id) {
    const lesson = LESSONS.find(l => l.id === id);
    currentLesson = lesson;
    const lv = levelOf(lesson.level);
    const course = courseOf(lesson);
    state.course = course.id; save();
    const lvIdx = levelNo(lv);
    const courseLessons = lessonsOfCourse(course.id);
    const idx = courseLessons.indexOf(lesson);
    const prev = courseLessons[idx - 1], next = courseLessons[idx + 1];
    const nextCourse = !next ? COURSES[COURSES.indexOf(course) + 1] : null;
    const tasks = [lesson.exercise, ...practiceOf(id)];
    const hasQuiz = tasks.some(t => t.type === "quiz"), hasCode = tasks.some(t => t.type !== "quiz");
    let cur = 0, fails = 0;
    const T = () => tasks[cur], key = () => pKey(id, cur);
    const isDone = i => i === 0 ? !!state.done[id] : !!state.pdone[pKey(id, i)];
    currentTask = T();

    $("#crumbs").innerHTML = `<a href="#/course/${course.id}">${course.icon} ${course.short}</a> › ${lv.icon} Cấp ${lvIdx} · ${lv.name} › <b>${esc(lesson.title)}</b>`;
    $("#view").innerHTML = `
      <div class="lesson-wrap">
        <article class="lesson-content" style="--c:${lv.color}">
          <span class="lesson-badge">${course.icon} ${course.short} · ${lv.icon} Cấp ${lvIdx} · Bài ${lessonsOf(lv.id).indexOf(lesson) + 1}/${lessonsOf(lv.id).length}${lesson.runtime === "node" ? " · 🟩 Node.js" : ""}${lesson.exercise.type === "quiz" ? " · 📝 Trắc nghiệm" : ""}</span>
          <div class="lesson-title"><div class="big-ic">${lesson.icon}</div><h1>${esc(lesson.title)}</h1></div>
          <div class="lesson-meta"><span>⏱️ ${lesson.duration} phút</span><span>⭐ +100 XP</span>${tasks.length > 1 ? `<span>🏋️ ${tasks.length - 1} bài luyện tập</span>` : ""}${state.done[id] ? '<span class="done-badge">✅ Đã hoàn thành</span>' : ""}</div>
          <p style="color:var(--muted)">${esc(lesson.summary)}</p>
          ${renderBlocks(lesson.content)}
          ${hasCode ? editorTipsHTML(lesson) : ""}

          <div class="exercise-card" id="exCard">
            ${tasks.length > 1 ? `<div class="task-tabs" id="taskTabs" role="tablist"></div><div class="task-progress" id="taskProg"></div>` : ""}
            <h3 id="exTitle"></h3>
            <div class="ex-task" id="exTask"></div>
            <div class="ex-actions">
              <button class="btn primary sm" id="checkBtn">✅ Kiểm tra bài</button>
              <button class="btn sm" id="hintBtn">💡 Gợi ý</button>
              <button class="btn sm" id="resetEx">↺ Làm lại</button>
              <button class="btn sm ghost" id="solBtn">🔑 Xem đáp án</button>
            </div>
            <div class="hint-box" id="hintBox" hidden></div>
            <div class="result" id="result"></div>
            <div class="ex-next" id="exNext" hidden>
              <span id="exNextText"></span>
              <button class="btn" id="nextTaskBtn" hidden></button>
              ${next
                ? `<button class="btn primary" id="nextBtn" data-go="#/lesson/${next.id}">Bài tiếp: ${next.icon} ${esc(next.title)} →</button>`
                : nextCourse
                  ? `<button class="btn primary" id="nextBtn" data-go="#/course/${nextCourse.id}">Sang khoá tiếp: ${nextCourse.icon} ${nextCourse.name} →</button>`
                  : `<button class="btn primary" id="nextBtn" data-go="#/">🏠 Về trang chủ</button>`}
            </div>
          </div>

          <div class="lesson-nav">
            ${prev ? `<button class="btn" data-go="#/lesson/${prev.id}">← ${prev.icon} ${esc(prev.title)}</button>` : "<span></span>"}
            ${next ? `<button class="btn primary" data-go="#/lesson/${next.id}">${next.icon} ${esc(next.title)} →</button>` : nextCourse ? `<button class="btn primary" data-go="#/course/${nextCourse.id}">${nextCourse.icon} ${nextCourse.name} →</button>` : `<button class="btn primary" data-go="#/">🏆 Về trang chủ</button>`}
          </div>
        </article>

        <div>
          ${hasQuiz ? '<div class="quiz-box" id="quizBox" hidden></div>' : ""}
          ${hasCode ? `<div id="codeSide" hidden>
            <div class="mode-switch">
              <button data-mode="example">👀 Ví dụ mẫu</button>
              <button data-mode="exercise">🎯 Làm bài tập</button>
            </div>
            <div id="pgBox"></div>
          </div>` : ""}
        </div>
      </div>`;

    const view = $("#view");
    bindCopy(view);
    view.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));

    const result = $("#result"), exNext = $("#exNext");
    const show = (ok, msg) => { result.className = "result " + (ok ? "ok" : "fail"); result.textContent = (ok ? "🎉 " : "❌ ") + msg; };
    const firstUndone = () => tasks.findIndex((_, i) => i > 0 && !isDone(i));

    function drawTabs() {
      if (tasks.length < 2) return;
      $("#taskTabs").innerHTML = tasks.map((t, i) => {
        const d = i === 0 ? null : DIFF[t.level || 1];
        return `<button class="task-tab ${i === cur ? "active" : ""} ${isDone(i) ? "done" : ""}" role="tab" aria-selected="${i === cur}" data-i="${i}" title="${esc(t.title || "Bài tập chính")}">
          ${isDone(i) ? "✅" : i === 0 ? "🎯" : "🏋️"} ${i === 0 ? "Bài chính" : "Luyện tập " + i}
          ${d ? `<small style="--d:${d[1]}">${d[0]}</small>` : ""}</button>`;
      }).join("");
      $("#taskTabs").querySelectorAll(".task-tab").forEach(b => b.addEventListener("click", () => selectTask(+b.dataset.i)));
      const n = tasks.length - 1, d = pDoneCount(id);
      $("#taskProg").innerHTML = `<div class="tp-bar"><span style="width:${Math.round(d / n * 100)}%"></span></div><small>Luyện tập: <b>${d}/${n}</b> bài · mỗi bài +30 XP</small>`;
    }

    function updateNext(scroll) {
      const i = firstUndone();
      const nt = $("#nextTaskBtn");
      exNext.hidden = !isDone(cur);
      if (exNext.hidden) return;
      if (i > 0 && i !== cur) { nt.hidden = false; nt.textContent = "🏋️ Luyện tập " + i + ": " + (tasks[i].title || ""); nt.onclick = () => selectTask(i, true); }
      else nt.hidden = true;
      $("#exNextText").textContent = cur > 0
        ? (i > 0 ? "Giỏi lắm! Làm tiếp bài luyện tập để nhớ lâu hơn nhé." : "💪 Bạn đã làm hết bài luyện tập của bài này!")
        : next ? "Hoàn thành rồi! " + (i > 0 ? "Luyện thêm cho chắc tay, hoặc sang bài tiếp theo." : "Sẵn sàng cho bài tiếp theo chưa?")
          : "🏆 Bạn đã học xong bài cuối cùng của khoá " + course.name + "!";
      if (scroll) exNext.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const passed = () => {
      if (!isDone(cur)) {
        if (cur === 0) { state.done[id] = true; state.doneAt[id] = Date.now(); state.xp += 100; toast("⭐ +100 XP – " + lesson.title); }
        else { state.pdone[key()] = Date.now(); state.xp += 30; toast("🏋️ +30 XP – Luyện tập " + cur + ": " + (T().title || "")); }
        touchStreak(); save();
        renderSidebar($("#searchInput").value);
      }
      confetti();
      drawTabs();
      updateNext(true);
      if (cur === 0 && courseDone(course.id) && !exNext.querySelector(".cert-cta")) {
        exNext.insertAdjacentHTML("beforeend", `<button class="btn accent cert-cta" data-go="#/certificate/${course.id}">🏅 Nhận chứng nhận khoá ${esc(course.name)}</button>`);
        exNext.querySelector(".cert-cta").addEventListener("click", () => go("#/certificate/" + course.id));
        toast("🎓 Bạn đã hoàn thành khoá " + course.name + "!");
      }
    };

    /* ---- Phần code (playground) ---- */
    let mode = "exercise", buffers = null;
    const reqsFor = m => (m === "example" ? lesson.exampleRequests : null) || (cur > 0 && T().requests) || lesson.requests || [];
    const nodeCfg = () => ({ env: Object.assign({}, lesson.env || {}, (cur > 0 && T().env) || {}), files: (cur > 0 && T().files) || lesson.files || {} });
    const savedCode = () => state.code[key()] && !state.code[key()].quiz ? { ...state.code[key()] } : { ...(T().starter || {}) };
    const setMode = m => {
      buffers[mode] = pg.getCode();
      mode = m;
      view.querySelectorAll(".mode-switch button").forEach(b => b.classList.toggle("active", b.dataset.mode === m));
      if (pg.setRequests) pg.setRequests(reqsFor(m));
      pg.setCode(buffers[m]);
      pg.switchTab(defaultTab(lesson, buffers[m]));
    };
    function openCode(fresh) {
      $("#codeSide").hidden = false;
      buffers = { example: buffers ? buffers.example : { ...{ html: "", css: "", js: "" }, ...lesson.example }, exercise: savedCode() };
      if (fresh) mode = cur === 0 && !state.code[id] && !state.done[id] ? "example" : "exercise";
      if (!pg) {
        pg = new Playground($("#pgBox"), {
          code: buffers[mode], runtime: lesson.runtime, nodeConfig: nodeCfg(), requests: reqsFor(mode),
          active: defaultTab(lesson, buffers[mode]),
          onChange: code => {
            if (mode === "exercise") { buffers.exercise = code; state.code[key()] = code; save(); }
            else buffers.example = code;
          }
        });
        if (pg.pro) {
          const src = Object.values(lesson.example || {}).join("\n") + "\n" + (lesson.content || []).filter(b => b.code).map(b => b.code).join("\n");
          pg.pro.setExtraWords([...new Set(src.match(/[A-Za-z_$][\w$]{3,}/g) || [])]);
        }
        view.querySelectorAll(".mode-switch button").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
      } else {
        pg.nodeConfig = nodeCfg();
        if (pg.setRequests) pg.setRequests(reqsFor(mode));
        pg.setCode(buffers[mode]);
        pg.switchTab(defaultTab(lesson, buffers[mode]));
      }
      view.querySelectorAll(".mode-switch button").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
    }

    /* ---- Phần trắc nghiệm ---- */
    let quiz = null;
    function openQuiz() {
      const ex = T(), box = $("#quizBox"), k = key();
      box.hidden = false;
      const saved = (state.code[k] && state.code[k].quiz) || [];
      let answers = ex.questions.map((_, i) => saved[i] === undefined ? null : saved[i]);
      let graded = false;
      const persist = () => { state.code[k] = { quiz: answers }; save(); };
      const draw = () => {
        box.innerHTML = `<h3>📝 ${ex.questions.length} câu hỏi</h3><p class="muted" style="font-size:13px">Chọn đáp án cho từng câu rồi bấm <b>✅ Kiểm tra bài</b>.</p>` +
          ex.questions.map((q, i) => `<div class="quiz-q">
            <p>${i + 1}. ${inline(q.q)}</p>
            ${q.code ? `<pre>${esc(q.code)}</pre>` : ""}
            ${q.options.map((o, j) => {
              const cls = [answers[i] === j ? "sel" : "", graded && j === q.answer && answers[i] === j ? "right" : "", graded && answers[i] === j && j !== q.answer ? "wrong" : ""].join(" ");
              return `<button class="quiz-opt ${cls}" data-q="${i}" data-o="${j}"><span class="k">${"ABCD"[j]}</span><span>${inline(o)}</span></button>`;
            }).join("")}
            <div class="quiz-explain" ${graded && answers[i] !== null ? "" : "hidden"}>${answers[i] === q.answer ? "✅ " : "❌ "}${inline(q.explain || "")}</div>
          </div>`).join("");
        box.querySelectorAll(".quiz-opt").forEach(b => b.addEventListener("click", () => {
          answers[+b.dataset.q] = +b.dataset.o; graded = false; persist(); draw();
        }));
      };
      draw();
      quiz = {
        check() {
          const missing = answers.map((a, i) => a === null ? i + 1 : 0).filter(Boolean);
          if (missing.length) { show(false, "Bạn chưa trả lời câu " + missing.join(", ") + "."); return; }
          graded = true; draw();
          const wrong = ex.questions.map((q, i) => answers[i] !== q.answer ? i + 1 : 0).filter(Boolean);
          if (wrong.length) show(false, "Đúng " + (ex.questions.length - wrong.length) + "/" + ex.questions.length + ". Xem lại câu " + wrong.join(", ") + " – đọc giải thích bên dưới mỗi câu nhé.");
          else { show(true, "Xuất sắc! Bạn trả lời đúng cả " + ex.questions.length + " câu."); passed(); }
        },
        reset() { answers = ex.questions.map(() => null); graded = false; persist(); draw(); result.className = "result"; },
        solution() {
          if (!confirm("Hiện đáp án đúng cho tất cả câu hỏi?")) return;
          answers = ex.questions.map(q => q.answer); graded = true; persist(); draw();
          toast("🔑 Đã hiện đáp án – đọc kỹ phần giải thích nhé!");
        }
      };
    }

    function selectTask(i, scroll) {
      if (pg && buffers && mode === "exercise") { buffers.exercise = pg.getCode(); }
      cur = i; fails = 0; currentTask = T();
      const ex = T(), d = DIFF[ex.level || 1];
      $("#exTitle").innerHTML = cur === 0
        ? (ex.type === "quiz" ? "📝 Bài trắc nghiệm" : "🎯 Bài tập thực hành")
        : `🏋️ Luyện tập ${cur}: ${esc(ex.title || "")} <span class="diff" style="--d:${d[1]}">${d[0]}</span>`;
      $("#exTask").innerHTML = String(ex.task || "").split("\n").map(line => `<p>${inline(line)}</p>`).join("");
      $("#hintBox").hidden = true; result.className = "result";
      drawTabs(); updateNext(false);
      if ($("#quizBox")) $("#quizBox").hidden = ex.type !== "quiz";
      if ($("#codeSide")) $("#codeSide").hidden = ex.type === "quiz";
      if (ex.type === "quiz") openQuiz(); else { quiz = null; openCode(true); }
      if (scroll) $("#exCard").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    $("#hintBtn").addEventListener("click", () => { const h = $("#hintBox"); h.hidden = !h.hidden; h.textContent = "💡 " + T().hint; });
    $("#checkBtn").addEventListener("click", async () => {
      if (quiz) return quiz.check();
      if (mode !== "exercise") setMode("exercise");
      const btn = $("#checkBtn");
      btn.disabled = true; btn.textContent = "⏳ Đang chấm...";
      const r = await pg.check(T().check);
      btn.disabled = false; btn.textContent = "✅ Kiểm tra bài";
      show(r.pass, r.msg);
      if (r.pass) passed();
      else {
        fails++;
        if (fails === 2 && window.Chatbot) {
          const issues = window.analyzeCode(pg.getCode());
          Chatbot.nudge("Có vẻ bài này hơi khó nhỉ 🤔 " + (issues.length ? "Mình thấy vài điểm đáng chú ý:\n• " + issues.slice(0, 3).join("\n• ") : "Thử bấm **💡 Gợi ý** hoặc hỏi mình nhé!"));
        }
      }
    });
    $("#resetEx").addEventListener("click", () => {
      if (quiz) return quiz.reset();
      if (!confirm("Xoá code bài tập hiện tại và bắt đầu lại?")) return;
      delete state.code[key()]; save();
      buffers.exercise = { ...(T().starter || {}) };
      if (mode === "exercise") pg.setCode(buffers.exercise); else setMode("exercise");
      result.className = "result";
    });
    $("#solBtn").addEventListener("click", () => {
      if (quiz) return quiz.solution();
      if (!confirm("Xem đáp án sẽ thay thế code bài tập hiện tại. Bạn đã thử hết sức chưa? 😉")) return;
      buffers.exercise = { ...T().solution };
      if (mode === "exercise") pg.setCode(buffers.exercise); else setMode("exercise");
      state.code[key()] = buffers.exercise; save();
      toast("🔑 Đã nạp đáp án – hãy đọc hiểu từng dòng nhé!");
    });

    // Mở bài: ?p=<n> trong hash (#/lesson/id/p2) → mở thẳng bài luyện tập n
    const want = +((location.hash.match(/\/p(\d+)$/) || [])[1] || 0);
    selectTask(want > 0 && want < tasks.length ? want : 0);
  }
  /* ---------------- Chưa đăng ký: khoá bài học ---------------- */
  function renderLocked(id) {
    const lesson = LESSONS.find(l => l.id === id), course = courseOf(lesson);
    $("#crumbs").innerHTML = `<a href="#/course/${course.id}">${course.icon} ${course.short}</a> › <b>${esc(lesson.title)}</b>`;
    $("#view").innerHTML = `
      <section class="locked">
        <div class="locked-ic">🔒</div>
        <h1>${lesson.icon} ${esc(lesson.title)}</h1>
        <p>Đăng ký miễn phí bằng <b>Gmail</b> và <b>họ tên đầy đủ</b> để bắt đầu học, lưu tiến độ và nhận <b>chứng nhận hoàn thành khoá học</b> do <b>${esc(ACADEMY_CONFIG.issuer)}</b> cấp.</p>
        <div class="hero-actions" style="justify-content:center">
          <button class="btn primary" id="openReg">🎓 Đăng ký để học</button>
          <button class="btn" data-go="#/course/${course.id}">← Xem lộ trình khoá</button>
        </div>
      </section>`;
    const open = () => Account.openModal({ reason: "Bạn cần đăng ký trước khi bắt đầu khoá học.", onDone: () => { toast("👋 Chào " + Account.profile.name + "! Bắt đầu học thôi"); render(); } });
    $("#openReg").addEventListener("click", open);
    $("#view").querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
    open();
  }


  /* ---------------- Hồ sơ học viên ---------------- */
  const fmtDate = (d, withTime) => { const t = new Date(d); if (isNaN(t)) return "—"; return withTime ? t.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }) : t.toLocaleDateString("vi-VN"); };
  const ago = ms => { const m = Math.round((Date.now() - ms) / 60000); if (m < 1) return "vừa xong"; if (m < 60) return m + " phút trước"; const h = Math.round(m / 60); if (h < 24) return h + " giờ trước"; const d = Math.round(h / 24); return d < 30 ? d + " ngày trước" : fmtDate(ms); };
  function ring(pct, color, size = 92) {
    return `<div class="ring" style="--p:${pct};--c:${color};width:${size}px;height:${size}px" role="img" aria-label="Hoàn thành ${pct}%"><span>${pct}%</span></div>`;
  }
  function achievements() {
    const total = doneCount(), quizDone = LESSONS.filter(l => state.done[l.id] && l.exercise && l.exercise.type === "quiz").length;
    const beDone = lessonsOfCourse("be-node").filter(l => state.done[l.id]).length;
    return [
      { ic: "🌱", t: "Bước đầu tiên", d: "Hoàn thành bài học đầu tiên", ok: total >= 1 },
      { ic: "📚", t: "Chăm chỉ", d: "Hoàn thành 10 bài học", ok: total >= 10 },
      { ic: "🚀", t: "Nửa chặng đường", d: "Hoàn thành 50% tổng số bài", ok: total >= LESSONS.length / 2 },
      { ic: "🔥", t: "Giữ lửa 3 ngày", d: "Học 3 ngày liên tiếp", ok: state.streak >= 3 },
      { ic: "⚡", t: "Kỷ luật thép", d: "Học 7 ngày liên tiếp", ok: state.streak >= 7 },
      { ic: "🧠", t: "Nhà thông thái", d: "Làm đúng 3 bài trắc nghiệm", ok: quizDone >= 3 },
      { ic: "🏋️", t: "Siêng luyện tập", d: "Hoàn thành 20 bài luyện tập", ok: totalPracticeDone() >= 20 },
      { ic: "💎", t: "Bậc thầy luyện tập", d: "Hoàn thành 100 bài luyện tập", ok: totalPracticeDone() >= 100 },
      { ic: "🟩", t: "Chạm tới server", d: "Hoàn thành 1 bài Back-end", ok: beDone >= 1 },
      ...COURSES.map(c => ({ ic: c.icon, t: "Tốt nghiệp " + c.short, d: "Hoàn thành khoá " + c.name, ok: courseDone(c.id) }))
    ];
  }
  function renderProfile() {
    $("#crumbs").innerHTML = "<b>👤 Hồ sơ học viên</b>";
    const p = Account.profile;
    if (!p) {
      $("#view").innerHTML = `<section class="locked"><div class="locked-ic">👤</div><h1>Bạn chưa có hồ sơ học viên</h1>
        <p>Đăng ký bằng Gmail + họ tên để có <b>mã học viên</b>, theo dõi % hoàn thành từng khoá và nhận chứng nhận.</p>
        <div class="hero-actions" style="justify-content:center"><button class="btn primary" id="regNow">🎓 Đăng ký ngay</button></div></section>`;
      $("#regNow").addEventListener("click", () => Account.openModal({ onDone: render }));
      return;
    }
    const total = LESSONS.length, done = doneCount(), pctAll = Math.round(done / total * 100);
    const minutes = LESSONS.filter(l => state.done[l.id]).reduce((t, l) => t + l.duration, 0);
    const certs = Account.certs, nCert = Object.keys(certs).length;
    const recent = Object.entries(state.doneAt || {}).map(([id, t]) => ({ l: LESSONS.find(x => x.id === id), t })).filter(x => x.l).sort((a, b) => b.t - a.t).slice(0, 8);
    const achs = achievements(), nAch = achs.filter(a => a.ok).length;
    const synced = !!p.learnerId, cloud = Account.online();
    $("#view").innerHTML = `
      <section class="pf-hero">
        <div class="pf-avatar">${esc(p.name.split(" ").pop().charAt(0))}</div>
        <div class="pf-main">
          <h1>${esc(p.name)}</h1>
          <div class="pf-meta">
            <span>📧 ${esc(p.email)}</span>
            <span>📅 Tham gia: ${p.registeredAt ? fmtDate(p.registeredAt) : "—"}</span>
            <span>🔥 Chuỗi ${state.streak} ngày</span>
          </div>
          <div class="pf-id">
            <span class="pf-id-label">Mã học viên</span>
            <code id="learnerId">${synced ? esc(p.learnerId) : cloud ? "⏳ Đang đồng bộ…" : "Chưa cấp (chế độ offline)"}</code>
            ${synced ? '<button class="btn sm" id="copyId" type="button">📋 Sao chép</button>' : cloud ? '<button class="btn sm" id="syncId" type="button">🔄 Đồng bộ lại</button>' : ""}
          </div>
        </div>
        <div class="pf-overall">${ring(pctAll, "#facc15", 116)}<small>Tổng tiến độ<br><b>${done}/${total}</b> bài</small></div>
      </section>

      <div class="stats">
        <div class="stat"><div class="stat-ic">✅</div><div><b>${done}</b><small>bài đã hoàn thành</small></div></div>
        <div class="stat"><div class="stat-ic">🏋️</div><div><b>${totalPracticeDone()}/${totalPractice()}</b><small>bài luyện tập</small></div></div>
        <div class="stat"><div class="stat-ic">⭐</div><div><b>${state.xp}</b><small>điểm kinh nghiệm (XP)</small></div></div>
        <div class="stat"><div class="stat-ic">⏱️</div><div><b>${(minutes / 60).toFixed(1)} giờ</b><small>thời lượng đã học</small></div></div>
        <div class="stat"><div class="stat-ic">🏅</div><div><b>${nCert}/${COURSES.length}</b><small>chứng nhận</small></div></div>
      </div>

      <h2 class="section-title">📊 Tiến độ từng khoá học</h2>
      <div class="pf-courses">
        ${COURSES.map(c => {
          const ls = lessonsOfCourse(c.id), d = doneCount(c.id), pct = Math.round(d / ls.length * 100), cert = certs[c.id];
          const left = ls.filter(l => !state.done[l.id]).reduce((t, l) => t + l.duration, 0);
          const action = cert ? `<button class="btn accent sm" data-go="#/certificate/${c.id}">🏅 Xem chứng nhận</button>`
            : d === ls.length ? `<button class="btn primary sm" data-go="#/certificate/${c.id}">🏅 Nhận chứng nhận</button>`
            : `<button class="btn primary sm" data-go="#/lesson/${(ls.find(l => !state.done[l.id]) || ls[0]).id}">${d ? "▶ Học tiếp" : "🚀 Bắt đầu"}</button>`;
          return `<div class="pf-course" style="--c:${c.color}">
            <div class="pf-course-head">
              ${ring(pct, c.color)}
              <div style="flex:1;min-width:0"><h3>${c.icon} ${c.name}</h3>
                <small class="muted">${d}/${ls.length} bài · ${pct === 100 ? "đã hoàn thành 🎉" : "còn khoảng " + Math.max(1, Math.round(left / 60)) + " giờ"}</small>
                ${cert ? `<small class="pf-cert-id">Mã chứng nhận: <b>${esc(cert.certId)}</b></small>` : ""}</div>
            </div>
            <div class="pf-levels">
              ${levelsOfCourse(c.id).map(lv => {
                const lls = lessonsOf(lv.id), dd = lls.filter(l => state.done[l.id]).length;
                return `<div class="pf-level" title="${esc(lv.name)}: ${dd}/${lls.length}"><span>${lv.icon} ${esc(lv.name)}</span><div class="lv-bar"><div style="width:${dd / lls.length * 100}%;background:${lv.color}"></div></div><small>${dd}/${lls.length}</small></div>`;
              }).join("")}
            </div>
            <div class="pf-course-foot"><button class="btn sm" data-go="#/course/${c.id}">📘 Xem khoá</button>${action}</div>
          </div>`;
        }).join("")}
      </div>

      <div class="pf-grid2">
        <div>
          <h2 class="section-title">🕒 Hoạt động gần đây</h2>
          <div class="pf-card">${recent.length ? `<ul class="pf-recent">${recent.map(x => `<li data-go="#/lesson/${x.l.id}"><span>${x.l.icon}</span><div><b>${esc(x.l.title)}</b><small>${courseOf(x.l).short} · ${ago(x.t)}</small></div><em>+100 XP</em></li>`).join("")}</ul>`
            : `<p class="muted" style="margin:0">${done ? "Các bài hoàn thành từ bây giờ sẽ được ghi lại kèm thời gian tại đây." : "Chưa có hoạt động – hoàn thành bài đầu tiên để bắt đầu nhật ký học tập!"}</p>`}</div>
        </div>
        <div>
          <h2 class="section-title">🏆 Thành tích <small class="muted">${nAch}/${achs.length}</small></h2>
          <div class="pf-badges">${achs.map(a => `<div class="pf-badge ${a.ok ? "ok" : ""}" title="${esc(a.d)}"><span>${a.ic}</span><b>${esc(a.t)}</b><small>${esc(a.d)}</small></div>`).join("")}</div>
        </div>
      </div>

      <h2 class="section-title">⚙️ Tài khoản</h2>
      <div class="pf-card pf-actions">
        <button class="btn" id="pfEdit">✏️ Sửa họ tên / Gmail</button>
        <button class="btn" id="pfExport">💾 Tải bản sao lưu tiến độ</button>
        <label class="btn" for="pfImport">📂 Khôi phục từ bản sao lưu</label><input type="file" id="pfImport" accept="application/json,.json" hidden>
        <button class="btn danger-outline" id="pfLogout">🚪 Đăng xuất khỏi máy này</button>
        <p class="muted" style="flex-basis:100%;margin:4px 0 0;font-size:13px">Tiến độ học được lưu trong trình duyệt này. Muốn học trên máy khác: tải bản sao lưu rồi khôi phục ở máy kia.</p>
      </div>`;

    $("#view").querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
    if ($("#copyId")) $("#copyId").addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(p.learnerId); toast("📋 Đã sao chép mã học viên " + p.learnerId); });
    if ($("#syncId")) $("#syncId").addEventListener("click", async () => { $("#syncId").disabled = true; await Account.resync(); render(); if (!Account.profile.learnerId) toast("⚠️ Chưa đồng bộ được – kiểm tra kết nối mạng"); });
    $("#pfEdit").addEventListener("click", () => Account.openModal({ onDone: render }));
    $("#pfExport").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ app: "frontend-academy", version: 1, exportedAt: new Date().toISOString(), progress: state, account: { profile: Account.profile, certs: Account.certs } }, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "frontend-academy-" + (p.learnerId || "tien-do") + ".json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast("💾 Đã tải bản sao lưu");
    });
    $("#pfImport").addEventListener("change", e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => {
        const d = JSON.parse(t);
        if (d.app !== "frontend-academy" || !d.progress || typeof d.progress.done !== "object") throw new Error("File không phải bản sao lưu Front-end Academy");
        if (!confirm("Khôi phục sẽ GHI ĐÈ tiến độ hiện tại bằng bản sao lưu (" + Object.keys(d.progress.done).length + " bài đã xong). Tiếp tục?")) return;
        ["done", "doneAt", "code", "xp", "streak", "lastDay"].forEach(k => { if (d.progress[k] !== undefined) state[k] = d.progress[k]; });
        save(); if (d.account) Account.restore(d.account);
        toast("✅ Đã khôi phục tiến độ"); render();
      }).catch(err => toast("⚠️ " + err.message));
      e.target.value = "";
    });
    $("#pfLogout").addEventListener("click", () => {
      if (!confirm("Đăng xuất sẽ xoá họ tên/Gmail khỏi trình duyệt này (tiến độ học vẫn giữ). Tiếp tục?")) return;
      Account.logout(); go("#/");
    });
  }

  /* ---------------- Chứng nhận ---------------- */
  function renderCertificates() {
    $("#crumbs").innerHTML = "<b>🏅 Chứng nhận của tôi</b>";
    $("#view").innerHTML = `
      <section class="course-hero" style="--c:#facc15">
        <div class="cc-ic">🏅</div>
        <div style="flex:1"><h1>Chứng nhận hoàn thành khoá học</h1>
          <p>Hoàn thành 100% bài học của một khoá để nhận chứng nhận do <b>${esc(ACADEMY_CONFIG.issuer)}</b> cấp. Mỗi chứng nhận có mã riêng để nhà tuyển dụng tra cứu.</p></div>
      </section>
      ${Account.isRegistered() ? "" : `<div class="cert-banner"><span>🎓</span><div><b>Bạn chưa đăng ký</b><small>Đăng ký bằng Gmail + họ tên để học và nhận chứng nhận.</small></div><button class="btn primary" id="regNow">Đăng ký</button></div>`}
      <div class="courses">
        ${COURSES.map(c => {
          const ls = lessonsOfCourse(c.id), d = doneCount(c.id), cert = Account.certs[c.id];
          const action = cert ? `<button class="btn accent" data-go="#/certificate/${c.id}">👁 Xem chứng nhận</button>`
            : d === ls.length ? `<button class="btn primary" data-go="#/certificate/${c.id}">🏅 Nhận chứng nhận</button>`
            : `<button class="btn" data-go="#/lesson/${nextLesson(c.id)}">▶ Học tiếp – còn ${ls.length - d} bài</button>`;
          return `<div class="course-card" style="--c:${c.color}">
            ${cert ? '<span class="cc-badge">ĐÃ CẤP</span>' : ""}
            <div class="cc-ic">${c.icon}</div><h3>${c.name}</h3>
            <p>${cert ? "Mã: <b>" + esc(cert.certId) + "</b><br>Ngày cấp: " + esc(String(cert.issuedAt).split(" ")[0]) : d + "/" + ls.length + " bài đã hoàn thành"}</p>
            <div class="lv-bar" style="margin-bottom:14px"><div style="width:${d / ls.length * 100}%"></div></div>
            ${action}
          </div>`;
        }).join("")}
      </div>
      <h2 class="section-title">🔍 Tra cứu chứng nhận</h2>
      <form class="verify-form" id="verifyForm"><input id="verifyInput" placeholder="Nhập mã, vd FA-BEN-261116-K7P2Q" aria-label="Mã chứng nhận" spellcheck="false"><button class="btn primary">Tra cứu</button></form>`;
    $("#view").querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
    if ($("#regNow")) $("#regNow").addEventListener("click", () => Account.openModal({ onDone: render }));
    $("#verifyForm").addEventListener("submit", e => { e.preventDefault(); const v = $("#verifyInput").value.trim(); if (v) go("#/verify/" + encodeURIComponent(v.toUpperCase())); });
  }

  function renderCertificate(cid) {
    const c = courseById(cid), ls = lessonsOfCourse(cid);
    $("#crumbs").innerHTML = `<a href="#/certificates">🏅 Chứng nhận</a> › <b>${c.icon} ${c.name}</b>`;
    const view = $("#view");
    const bind = () => view.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
    if (!courseDone(cid)) {
      view.innerHTML = `<section class="locked"><div class="locked-ic">⏳</div><h1>Chưa đủ điều kiện</h1><p>Bạn đã hoàn thành <b>${doneCount(cid)}/${ls.length}</b> bài của khoá ${c.name}. Hoàn thành tất cả bài học để nhận chứng nhận.</p>
        <div class="hero-actions" style="justify-content:center"><button class="btn primary" data-go="#/lesson/${nextLesson(cid)}">▶ Học tiếp</button></div></section>`;
      return bind();
    }
    if (!Account.isRegistered()) {
      view.innerHTML = `<section class="locked"><div class="locked-ic">🎓</div><h1>Đăng ký để nhận chứng nhận</h1><p>Chứng nhận cần họ tên đầy đủ và Gmail của bạn.</p><button class="btn primary" id="regNow">Đăng ký</button></section>`;
      $("#regNow").addEventListener("click", () => Account.openModal({ onDone: render }));
      return;
    }
    const cert = Account.certs[cid];
    if (cert && (cert.verified || !Account.online())) return showCert(cert);
    // Xác nhận tên trước khi cấp (tên in trên chứng nhận không đổi được sau khi cấp)
    view.innerHTML = `
      <section class="locked">
        <div class="locked-ic">🏅</div>
        <h1>Nhận chứng nhận: ${c.name}</h1>
        <p>Chúc mừng bạn đã hoàn thành <b>${ls.length}</b> bài học! Kiểm tra lại họ tên sẽ in trên chứng nhận:</p>
        <div class="confirm-name">${esc(Account.profile.name)}</div>
        <p class="muted" style="font-size:13px">Gmail: ${esc(Account.profile.email)} · Sau khi cấp, họ tên trên chứng nhận không thể thay đổi.</p>
        <div class="hero-actions" style="justify-content:center">
          <button class="btn primary" id="issueBtn">✅ Đúng – cấp chứng nhận</button>
          <button class="btn" id="editName">✏️ Sửa họ tên</button>
        </div>
        <p class="form-msg" id="issueMsg" role="status"></p>
      </section>`;
    $("#editName").addEventListener("click", () => Account.openModal({ onDone: render }));
    $("#issueBtn").addEventListener("click", async () => {
      const btn = $("#issueBtn"); btn.disabled = true; btn.textContent = "⏳ Đang cấp chứng nhận…";
      try {
        const c2 = await Account.issue(c, { lessons: ls.length, hours: courseHours(cid), completedAt: new Date().toLocaleDateString("vi-VN") });
        confetti(); toast("🏅 Đã cấp chứng nhận " + c2.certId);
        showCert(c2);
      } catch (e) {
        btn.disabled = false; btn.textContent = "↻ Thử lại";
        $("#issueMsg").textContent = "⚠️ " + e.message;
      }
    });

    function showCert(ct) {
      view.innerHTML = `
        <div class="cert-actions">
          <button class="btn primary" id="printBtn">🖨️ In / Lưu PDF</button>
          ${ct.verified ? '<button class="btn" id="copyLink">🔗 Sao chép link xác minh</button><button class="btn" id="openVerify">🔍 Trang xác minh</button>' : ""}
          <button class="btn ghost" data-go="#/certificates">← Tất cả chứng nhận</button>
        </div>
        <div class="cert-scroll">${Account.certificateHTML(ct)}</div>
        <p class="muted" style="font-size:13px;margin-top:10px">💡 Bấm <b>In / Lưu PDF</b> → chọn máy in <b>"Lưu dưới dạng PDF"</b>, khổ <b>A4 ngang</b>, bật <b>Đồ hoạ nền</b> (Background graphics).</p>`;
      bind();
      $("#printBtn").addEventListener("click", () => window.print());
      if ($("#copyLink")) $("#copyLink").addEventListener("click", () => {
        const url = Account.verifyUrl(ct.certId);
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast("🔗 Đã sao chép: " + url), () => prompt("Copy link xác minh:", url));
      });
      if ($("#openVerify")) $("#openVerify").addEventListener("click", () => go("#/verify/" + encodeURIComponent(ct.certId)));
    }
  }

  function renderVerify(id) {
    $("#crumbs").innerHTML = `<a href="#/certificates">🏅 Chứng nhận</a> › <b>Tra cứu</b>`;
    $("#view").innerHTML = `
      <section class="verify-box">
        <h1>🔍 Tra cứu chứng nhận</h1>
        <p class="muted">Kiểm tra một chứng nhận của Front-end Academy là thật hay giả.</p>
        <form class="verify-form" id="verifyForm"><input id="verifyInput" value="${esc(id)}" placeholder="FA-BEN-261116-K7P2Q" aria-label="Mã chứng nhận" spellcheck="false"><button class="btn primary">Tra cứu</button></form>
        <div id="verifyResult" role="status"></div>
      </section>`;
    $("#verifyForm").addEventListener("submit", e => { e.preventDefault(); const v = $("#verifyInput").value.trim().toUpperCase(); if (v) go("#/verify/" + encodeURIComponent(v)); });
    const out = $("#verifyResult");
    if (!id) return;
    if (!Account.online()) { out.innerHTML = '<div class="verify-res warn">⚠️ Hệ thống tra cứu online chưa được bật (chưa cấu hình máy chủ Google Sheets).</div>'; return; }
    out.innerHTML = '<div class="verify-res">⏳ Đang tra cứu…</div>';
    Account.verify(id.toUpperCase()).then(r => {
      if (r.valid) out.innerHTML = `<div class="verify-res ok"><b>✅ Chứng nhận hợp lệ</b>
        <dl><dt>Mã</dt><dd>${esc(r.certId)}</dd><dt>Học viên</dt><dd><b>${esc(r.name)}</b></dd><dt>Khoá học</dt><dd>${esc(r.courseName)} (${esc(r.lessons)} bài)</dd><dt>Ngày cấp</dt><dd>${esc(String(r.issuedAt).split(" ")[0])}</dd><dt>Người cấp</dt><dd>${esc(r.issuer)}</dd></dl></div>`;
      else out.innerHTML = `<div class="verify-res bad"><b>❌ ${r.revoked ? "Chứng nhận đã bị thu hồi" : "Không hợp lệ"}</b><p>${esc(r.reason || "Chứng nhận này không còn hiệu lực.")}</p></div>`;
    }).catch(e => { out.innerHTML = `<div class="verify-res warn">⚠️ ${esc(e.message)}</div>`; });
  }

  /* ---------------- Bài trắc nghiệm ---------------- */
  /* ---------------- Sân chơi tự do ---------------- */
  const TEMPLATES = {
    blank: { name: "📄 Trống", html: "", css: "", js: "" },
    profile: {
      name: "🙋 Thẻ giới thiệu",
      html: "<div class=\"card\">\n  <div class=\"avatar\">👨‍💻</div>\n  <h2>Tên của bạn</h2>\n  <p>Front-end Developer tương lai</p>\n  <button id=\"follow\">+ Theo dõi</button>\n</div>",
      css: "body {\n  min-height: 100vh; margin: 0;\n  display: grid; place-items: center;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  font-family: sans-serif;\n}\n.card {\n  background: white; padding: 32px; border-radius: 20px;\n  text-align: center; width: 260px;\n  box-shadow: 0 20px 40px rgba(0,0,0,.2);\n}\n.avatar { font-size: 60px; }\nbutton {\n  padding: 10px 20px; border: 0; border-radius: 99px;\n  background: #667eea; color: white; cursor: pointer;\n}",
      js: "const btn = document.querySelector(\"#follow\");\nbtn.addEventListener(\"click\", () => {\n  const dangTheoDoi = btn.textContent.includes(\"Đang\");\n  btn.textContent = dangTheoDoi ? \"+ Theo dõi\" : \"✓ Đang theo dõi\";\n});"
    },
    clock: {
      name: "⏰ Đồng hồ số",
      html: "<div class=\"clock\" id=\"clock\">00:00:00</div>\n<p id=\"date\"></p>",
      css: "body { background:#0f172a; color:#e2e8f0; font-family:monospace; text-align:center; padding-top:60px; }\n.clock { font-size: 64px; color: #22d3ee; text-shadow: 0 0 20px #22d3ee; }",
      js: "function capNhat() {\n  const now = new Date();\n  document.querySelector(\"#clock\").textContent = now.toLocaleTimeString(\"vi-VN\");\n  document.querySelector(\"#date\").textContent = now.toLocaleDateString(\"vi-VN\", { weekday: \"long\", day: \"numeric\", month: \"long\", year: \"numeric\" });\n}\ncapNhat();\nsetInterval(capNhat, 1000);"
    },
    quiz: {
      name: "❓ Mini quiz",
      html: "<div class=\"quiz\">\n  <h2 id=\"q\"></h2>\n  <div id=\"answers\"></div>\n  <p id=\"score\"></p>\n</div>",
      css: "body { font-family: sans-serif; background: #f1f5f9; padding: 20px; }\n.quiz { max-width: 420px; margin: auto; background: white; padding: 24px; border-radius: 16px; }\n#answers button { display: block; width: 100%; margin: 8px 0; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; background: white; cursor: pointer; font-size: 15px; }\n#answers button:hover { border-color: #6366f1; }",
      js: "const cauHoi = [\n  { q: \"Thẻ nào tạo tiêu đề lớn nhất?\", a: [\"<h6>\", \"<h1>\", \"<p>\"], dung: 1 },\n  { q: \"Thuộc tính CSS đổi màu chữ?\", a: [\"color\", \"background\", \"font\"], dung: 0 },\n  { q: \"So sánh bằng nghiêm ngặt trong JS?\", a: [\"=\", \"==\", \"===\"], dung: 2 }\n];\nlet i = 0, diem = 0;\n\nfunction hien() {\n  if (i >= cauHoi.length) {\n    document.querySelector(\"#q\").textContent = \"🎉 Hoàn thành!\";\n    document.querySelector(\"#answers\").innerHTML = \"\";\n    document.querySelector(\"#score\").textContent = \"Điểm: \" + diem + \"/\" + cauHoi.length;\n    return;\n  }\n  const c = cauHoi[i];\n  document.querySelector(\"#q\").textContent = (i + 1) + \". \" + c.q;\n  const box = document.querySelector(\"#answers\");\n  box.innerHTML = \"\";\n  c.a.forEach((txt, idx) => {\n    const b = document.createElement(\"button\");\n    b.textContent = txt;\n    b.onclick = () => { if (idx === c.dung) diem++; i++; hien(); };\n    box.appendChild(b);\n  });\n}\nhien();"
    }
  };

  function renderPlayground() {
    $("#crumbs").innerHTML = "<b>🧪 Sân chơi code</b> – thử nghiệm tự do, code được tự lưu";
    $("#view").innerHTML = `
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
        <span class="muted" style="font-size:13px">Mẫu có sẵn:</span>
        ${Object.entries(TEMPLATES).map(([k, t]) => `<button class="chip" data-tpl="${k}">${t.name}</button>`).join("")}
        <span style="flex:1"></span>
        <button class="btn sm" id="dlBtn">⬇️ Tải file .html</button>
      </div>
      <div id="pgBox"></div>`;
    pg = new Playground($("#pgBox"), {
      full: true,
      code: state.playground || TEMPLATES.profile,
      onChange: c => { state.playground = c; save(); }
    });
    $("#view").querySelectorAll("[data-tpl]").forEach(b => b.addEventListener("click", () => {
      if (state.playground && !confirm("Thay code hiện tại bằng mẫu này?")) return;
      const t = TEMPLATES[b.dataset.tpl];
      pg.setCode({ html: t.html, css: t.css, js: t.js });
    }));
    $("#dlBtn").addEventListener("click", () => {
      const c = pg.getCode();
      const file = `<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Dự án của tôi</title>\n  <style>\n${c.css}\n  </style>\n</head>\n<body>\n${c.html}\n  <script>\n${c.js}\n  <\/script>\n</body>\n</html>`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([file], { type: "text/html" }));
      a.download = "du-an-cua-toi.html";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  /* ---------------- Khởi động ---------------- */
  function applyTheme() {
    document.body.classList.toggle("light", state.theme === "light");
    $("#themeBtn").textContent = state.theme === "light" ? "🌙" : "☀️";
  }

  function init() {
    load();
    touchStreak();
    applyTheme();

    $("#themeBtn").addEventListener("click", () => { state.theme = state.theme === "light" ? "dark" : "light"; save(); applyTheme(); });
    $("#resetBtn").addEventListener("click", () => {
      if (!confirm("Xoá toàn bộ tiến độ, XP và code đã lưu?")) return;
      Object.assign(state, { done: {}, code: {}, xp: 0, streak: 0, lastDay: null, playground: null });
      save(); touchStreak(); render(); toast("♻️ Đã xoá tiến độ");
    });
    $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    document.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => go({ playground: "#/playground", certificates: "#/certificates", profile: "#/profile" }[b.dataset.nav] || "#/")));
    $("#searchInput").addEventListener("input", e => renderSidebar(e.target.value));
    window.addEventListener("hashchange", render);

    Account.renderSidebar();
    Account.syncRegister();

    Chatbot.init(
      () => ({
        lesson: currentLesson ? Object.assign({}, currentLesson, { exercise: currentTask || currentLesson.exercise }) : null,
        course: currentLesson ? courseOf(currentLesson) : courseById(state.course),
        code: pg ? pg.getCode() : null,
        done: doneCount(),
        xp: state.xp,
        next: nextLesson()
      }),
      id => go("#/lesson/" + id)
    );

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
