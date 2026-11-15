/* =========================================================
   APP CHÍNH – điều hướng, tiến độ, render giao diện
   Router dùng hash: #/  |  #/lesson/<id>  |  #/playground
   ========================================================= */
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const STORE_KEY = "fe-academy-v1";

  /* ---------------- Lưu trữ tiến độ ---------------- */
  const state = {
    done: {},        // { lessonId: true }
    code: {},        // { lessonId: {html,css,js} } – code bài tập đã lưu
    xp: 0,
    streak: 0,
    lastDay: null,
    theme: "dark",
    playground: null
  };
  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(STORE_KEY) || "{}")); } catch (e) {}
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
  const doneCount = () => LESSONS.filter(l => state.done[l.id]).length;
  const nextLesson = () => (LESSONS.find(l => !state.done[l.id]) || {}).id;

  /* ---------------- Tô màu cú pháp đơn giản ---------------- */
  const RULES = {
    html: [[/<!--[\s\S]*?-->/, "tk-com"], [/<\/?[a-zA-Z][\w-]*|\/?>/, "tk-tag"], [/"[^"]*"/, "tk-str"], [/\s[a-zA-Z-]+(?==)/, "tk-attr"]],
    css: [[/\/\*[\s\S]*?\*\//, "tk-com"], [/@[\w-]+/, "tk-kw"], [/[\w-]+(?=\s*:[^:{]*[;}\n])/, "tk-prop"], [/"[^"]*"|'[^']*'/, "tk-str"], [/#[0-9a-fA-F]{3,8}\b|-?\b\d+(\.\d+)?(px|rem|em|%|s|ms|deg|fr|vh|vw)?\b/, "tk-num"]],
    js: [[/\/\/[^\n]*|\/\*[\s\S]*?\*\//, "tk-com"], [/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`/, "tk-str"],
      [/\b(const|let|var|function|return|if|else|for|of|in|while|new|async|await|try|catch|throw|class|true|false|null|undefined|typeof|this)\b/, "tk-kw"],
      [/\b\d+(\.\d+)?\b/, "tk-num"], [/\.[a-zA-Z_]\w*(?=\()/, "tk-prop"]]
  };
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
        const lang = guessLang(b.code);
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
    const colors = ["#7c5cff", "#22d3ee", "#ff5ca8", "#facc15", "#22c55e", "#f97316"];
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
    const pct = Math.round(doneCount() / LESSONS.length * 100);
    $("#progressText").textContent = pct + "%";
    $("#progressBar").style.width = pct + "%";
    $("#xpText").textContent = state.xp;
    $("#streakText").textContent = state.streak;
  }

  function renderSidebar(filter = "") {
    const f = filter.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const match = l => !f || (l.title + " " + l.summary).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().includes(f);
    const current = currentLessonId();
    $("#levelList").innerHTML = LEVELS.map((lv, i) => {
      const ls = lessonsOf(lv.id).filter(match);
      if (!ls.length) return "";
      const d = lessonsOf(lv.id).filter(l => state.done[l.id]).length;
      return `<div class="level-group">
        <div class="level-head"><span class="level-dot" style="background:${lv.color}"></span>${lv.icon} Cấp ${i + 1} · ${lv.name}<span class="count">${d}/${lessonsOf(lv.id).length}</span></div>
        <div class="lessons">${ls.map(l => `
          <button class="lesson-link ${l.id === current ? "active" : ""}" data-lesson="${l.id}">
            <span class="ic">${l.icon}</span><span>${esc(l.title)}</span>
            <span class="st">${state.done[l.id] ? "✅" : ""}</span>
          </button>`).join("")}
        </div></div>`;
    }).join("") || '<p class="muted" style="padding:8px">Không tìm thấy bài học 🔍</p>';

    $("#levelList").querySelectorAll(".lesson-link").forEach(b => b.addEventListener("click", () => go("#/lesson/" + b.dataset.lesson)));
    $("#levelList").querySelectorAll(".level-head").forEach(h => h.addEventListener("click", () => h.parentElement.classList.toggle("collapsed")));
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active",
      (b.dataset.nav === "home" && route().page === "home") || (b.dataset.nav === "playground" && route().page === "playground")));
    renderProgress();
  }

  /* ---------------- Router ---------------- */
  let pg = null;            // playground hiện tại
  let currentLesson = null; // bài học hiện tại

  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    if (h[0] === "lesson" && LESSONS.find(l => l.id === h[1])) return { page: "lesson", id: h[1] };
    if (h[0] === "playground") return { page: "playground" };
    return { page: "home" };
  }
  const currentLessonId = () => route().page === "lesson" ? route().id : null;
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  function render() {
    if (pg) { pg.destroy(); pg = null; }
    currentLesson = null;
    const r = route();
    const view = $("#view");
    view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
    if (r.page === "lesson") renderLesson(r.id);
    else if (r.page === "playground") renderPlayground();
    else renderHome();
    renderSidebar($("#searchInput").value);
    $("#sidebar").classList.remove("open");
    $(".main").scrollTop = 0;
    if (window.Chatbot && Chatbot.el) Chatbot.renderChips();
  }

  /* ---------------- Trang chủ ---------------- */
  function renderHome() {
    $("#crumbs").innerHTML = "<b>🏠 Trang chủ</b>";
    const nx = nextLesson();
    const totalMin = LESSONS.reduce((t, l) => t + l.duration, 0);
    $("#view").innerHTML = `
      <section class="hero">
        <span class="hero-float" style="right:8%;top:18%">🧱</span>
        <span class="hero-float" style="right:22%;top:55%;animation-delay:-2s">🎨</span>
        <span class="hero-float" style="right:6%;top:65%;animation-delay:-4s">⚡</span>
        <span class="hero-float" style="right:30%;top:12%;animation-delay:-3s">🚀</span>
        <div style="font-size:13px;opacity:.8;margin-bottom:10px">👋 Chào mừng đến với Front-end Academy</div>
        <h1>Học lập trình web<br><span>từ A đến Z</span> – học đâu chạy đó</h1>
        <p>${LESSONS.length} bài học chia thành ${LEVELS.length} cấp độ, từ HTML cơ bản đến JavaScript bất đồng bộ. Mỗi bài có ví dụ chạy thử ngay, bài tập tự chấm điểm và trợ lý <b>Bit 🤖</b> luôn sẵn sàng giải đáp.</p>
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

      <h2 class="section-title">🗺️ Lộ trình học</h2>
      <div class="levels">
        ${LEVELS.map((lv, i) => {
          const ls = lessonsOf(lv.id), d = ls.filter(l => state.done[l.id]).length;
          return `<div class="level-card" style="--c:${lv.color}" data-go="#/lesson/${(ls.find(l => !state.done[l.id]) || ls[0]).id}">
            <div class="lv-ic">${lv.icon}</div>
            <div class="lv-step">Cấp ${i + 1}</div>
            <h3>${lv.name}</h3>
            <p>${lv.desc}</p>
            <div class="lv-meta"><span>📘 ${ls.length} bài · ${ls.reduce((t, l) => t + l.duration, 0)} phút</span><span>${d === ls.length ? "🏅 Hoàn thành" : d + "/" + ls.length}</span></div>
            <div class="lv-bar"><div style="width:${d / ls.length * 100}%"></div></div>
          </div>`;
        }).join("")}
      </div>

      <h2 class="section-title">🔭 Học gì tiếp theo?</h2>
      <div class="next-grid">
        ${ROADMAP_NEXT.map(n => `<div class="next-card"><span>${n.icon}</span><b>${n.name}</b><p>${n.desc}</p></div>`).join("")}
      </div>
      <p class="muted" style="margin:28px 0 60px;font-size:13px">💡 Mẹo: bấm <b>Ctrl + Enter</b> trong ô code để chạy, hỏi Bit 🤖 "kiểm tra code" khi gặp lỗi.</p>`;

    $("#startBtn").addEventListener("click", () => go("#/lesson/" + (nx || LESSONS[0].id)));
    $("#view").querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
  }

  /* ---------------- Trang bài học ---------------- */
  function defaultTab(lesson, code) {
    if (["js", "advanced"].includes(lesson.level) && !code.html.trim()) return "js";
    if (["css", "layout"].includes(lesson.level)) return "css";
    if (lesson.level === "dom" || lesson.level === "advanced") return "js";
    return "html";
  }

  function renderLesson(id) {
    const lesson = LESSONS.find(l => l.id === id);
    currentLesson = lesson;
    const lv = levelOf(lesson.level);
    const lvIdx = LEVELS.indexOf(lv) + 1;
    const idx = LESSONS.indexOf(lesson);
    const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    const ex = lesson.exercise;
    let fails = 0;

    $("#crumbs").innerHTML = `${lv.icon} Cấp ${lvIdx} · ${lv.name} › <b>${esc(lesson.title)}</b>`;
    $("#view").innerHTML = `
      <div class="lesson-wrap">
        <article class="lesson-content" style="--c:${lv.color}">
          <span class="lesson-badge">${lv.icon} Cấp ${lvIdx} · Bài ${lessonsOf(lv.id).indexOf(lesson) + 1}/${lessonsOf(lv.id).length}</span>
          <div class="lesson-title"><div class="big-ic">${lesson.icon}</div><h1>${esc(lesson.title)}</h1></div>
          <div class="lesson-meta"><span>⏱️ ${lesson.duration} phút</span><span>⭐ +100 XP</span>${state.done[id] ? '<span class="done-badge">✅ Đã hoàn thành</span>' : ""}</div>
          <p style="color:var(--muted)">${esc(lesson.summary)}</p>
          ${renderBlocks(lesson.content)}

          <div class="exercise-card">
            <h3>🎯 Bài tập thực hành</h3>
            <p>${inline(ex.task)}</p>
            <div class="ex-actions">
              <button class="btn primary sm" id="checkBtn">✅ Kiểm tra bài</button>
              <button class="btn sm" id="hintBtn">💡 Gợi ý</button>
              <button class="btn sm" id="resetEx">↺ Làm lại</button>
              <button class="btn sm ghost" id="solBtn">🔑 Xem đáp án</button>
            </div>
            <div class="hint-box" id="hintBox" hidden></div>
            <div class="result" id="result"></div>
          </div>

          <div class="lesson-nav">
            ${prev ? `<button class="btn" data-go="#/lesson/${prev.id}">← ${prev.icon} ${esc(prev.title)}</button>` : "<span></span>"}
            ${next ? `<button class="btn primary" data-go="#/lesson/${next.id}">${next.icon} ${esc(next.title)} →</button>` : `<button class="btn primary" data-go="#/">🏆 Về trang chủ</button>`}
          </div>
        </article>

        <div>
          <div class="mode-switch">
            <button data-mode="example">👀 Ví dụ mẫu</button>
            <button data-mode="exercise">🎯 Làm bài tập</button>
          </div>
          <div id="pgBox"></div>
        </div>
      </div>`;

    const view = $("#view");
    bindCopy(view);
    view.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));

    // Hai bộ đệm code: ví dụ (không lưu) và bài tập (lưu localStorage)
    const buffers = {
      example: { ...{ html: "", css: "", js: "" }, ...lesson.example },
      exercise: state.code[id] ? { ...state.code[id] } : { ...ex.starter }
    };
    let mode = state.code[id] || state.done[id] ? "exercise" : "example";

    pg = new Playground($("#pgBox"), {
      code: buffers[mode],
      active: defaultTab(lesson, buffers[mode]),
      onChange: code => {
        if (mode === "exercise") { buffers.exercise = code; state.code[id] = code; save(); }
        else buffers.example = code;
      }
    });

    const setMode = m => {
      buffers[mode] = pg.getCode();
      mode = m;
      view.querySelectorAll(".mode-switch button").forEach(b => b.classList.toggle("active", b.dataset.mode === m));
      pg.setCode(buffers[m]);
      pg.switchTab(defaultTab(lesson, buffers[m]));
    };
    view.querySelectorAll(".mode-switch button").forEach(b => {
      b.classList.toggle("active", b.dataset.mode === mode);
      b.addEventListener("click", () => setMode(b.dataset.mode));
    });

    const result = $("#result");
    const show = (ok, msg) => { result.className = "result " + (ok ? "ok" : "fail"); result.textContent = (ok ? "🎉 " : "❌ ") + msg; };

    $("#checkBtn").addEventListener("click", async () => {
      if (mode !== "exercise") setMode("exercise");
      const btn = $("#checkBtn");
      btn.disabled = true; btn.textContent = "⏳ Đang chấm...";
      const r = await pg.check(ex.check);
      btn.disabled = false; btn.textContent = "✅ Kiểm tra bài";
      show(r.pass, r.msg);
      if (r.pass) {
        if (!state.done[id]) {
          state.done[id] = true; state.xp += 100; touchStreak(); save();
          toast("⭐ +100 XP – " + lesson.title);
          renderSidebar($("#searchInput").value);
        }
        confetti();
      } else {
        fails++;
        if (fails === 2 && window.Chatbot) {
          const issues = window.analyzeCode(pg.getCode());
          Chatbot.nudge("Có vẻ bài này hơi khó nhỉ 🤔 " + (issues.length ? "Mình thấy vài điểm đáng chú ý:\n• " + issues.slice(0, 3).join("\n• ") : "Thử bấm **💡 Gợi ý** hoặc hỏi mình nhé!"));
        }
      }
    });
    $("#hintBtn").addEventListener("click", () => { const h = $("#hintBox"); h.hidden = !h.hidden; h.textContent = "💡 " + ex.hint; });
    $("#resetEx").addEventListener("click", () => {
      if (!confirm("Xoá code bài tập hiện tại và bắt đầu lại?")) return;
      delete state.code[id]; save();
      buffers.exercise = { ...ex.starter };
      if (mode === "exercise") pg.setCode(buffers.exercise); else setMode("exercise");
      result.className = "result";
    });
    $("#solBtn").addEventListener("click", () => {
      if (!confirm("Xem đáp án sẽ thay thế code bài tập hiện tại. Bạn đã thử hết sức chưa? 😉")) return;
      buffers.exercise = { ...ex.solution };
      if (mode === "exercise") pg.setCode(buffers.exercise); else setMode("exercise");
      state.code[id] = buffers.exercise; save();
      toast("🔑 Đã nạp đáp án – hãy đọc hiểu từng dòng nhé!");
    });
  }

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
    document.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => go(b.dataset.nav === "playground" ? "#/playground" : "#/")));
    $("#searchInput").addEventListener("input", e => renderSidebar(e.target.value));
    window.addEventListener("hashchange", render);

    Chatbot.init(
      () => ({
        lesson: currentLesson,
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
