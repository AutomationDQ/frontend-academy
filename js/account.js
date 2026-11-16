/* =========================================================
   TÀI KHOẢN HỌC VIÊN & CHỨNG NHẬN
   - Đăng ký bằng Gmail + họ tên đầy đủ (bắt buộc trước khi vào bài học)
   - Đồng bộ lên Google Sheets qua Apps Script (ACADEMY_CONFIG.appsScriptUrl)
   - Cấp chứng nhận khi hoàn thành 100% một khoá, tra cứu bằng mã chứng nhận
   Lưu trên máy: localStorage "fa-account-v1" = { profile, certs, pendingRegister }
   ========================================================= */
(function () {
  const KEY = "fa-account-v1";
  const CFG = () => window.ACADEMY_CONFIG || {};
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const GMAIL_RE = /^[a-z0-9](\.?[a-z0-9_+-])*@gmail\.com$/;
  const NAME_RE = /^[\p{L}\s'.-]+$/u;

  let data = { profile: null, certs: {}, pendingRegister: false };
  const load = () => { try { Object.assign(data, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };

  /* ---------- Chuẩn hoá & kiểm tra ---------- */
  const normName = s => String(s || "").replace(/\s+/g, " ").trim()
    .split(" ").map(w => w ? w.charAt(0).toLocaleUpperCase("vi") + w.slice(1).toLocaleLowerCase("vi") : w).join(" ");
  const normEmail = s => String(s || "").trim().toLowerCase();
  function validate(name, email, agree) {
    const errs = {};
    if (name.length < 4 || name.split(" ").length < 2) errs.name = "Nhập đầy đủ họ và tên (ít nhất 2 từ), ví dụ: Trần Văn An";
    else if (name.length > 70 || !NAME_RE.test(name)) errs.name = "Họ và tên chỉ gồm chữ cái và khoảng trắng";
    if (!email) errs.email = "Vui lòng nhập Gmail";
    else if (!email.endsWith("@gmail.com")) errs.email = "Chỉ chấp nhận địa chỉ Gmail (đuôi @gmail.com)";
    else if (!GMAIL_RE.test(email)) errs.email = "Gmail chưa đúng định dạng";
    if (!agree) errs.agree = "Bạn cần đồng ý để tiếp tục";
    return errs;
  }

  /* ---------- Gọi Apps Script ---------- */
  async function api(method, payload) {
    const url = CFG().appsScriptUrl;
    if (!url) throw Object.assign(new Error("Chưa cấu hình máy chủ"), { offline: true });
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      // POST dạng text/plain (simple request) để tránh preflight CORS với Apps Script
      const res = method === "GET"
        ? await fetch(url + "?" + new URLSearchParams(payload), { signal: ctrl.signal })
        : await fetch(url, { method: "POST", body: JSON.stringify(payload), signal: ctrl.signal });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Máy chủ báo lỗi");
      return json;
    } catch (e) {
      if (e.name === "AbortError") throw new Error("Máy chủ không phản hồi – kiểm tra mạng rồi thử lại");
      if (e instanceof TypeError) throw new Error("Không kết nối được máy chủ – kiểm tra mạng rồi thử lại");
      throw e;
    } finally { clearTimeout(t); }
  }

  async function syncRegister() {
    if (!data.profile || !data.pendingRegister || !CFG().appsScriptUrl) return;
    try {
      const r = await api("POST", { action: "register", name: data.profile.name, email: data.profile.email });
      data.profile.learnerId = r.learnerId; data.pendingRegister = false; save(); renderSidebar();
    } catch (e) { /* thử lại lần sau */ }
  }

  /* ---------- Modal đăng ký ---------- */
  function openModal(opts = {}) {
    closeModal();
    const p = data.profile || {};
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop"; wrap.id = "regModal";
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="regTitle">
        ${opts.closable !== false ? '<button class="icon-btn modal-x" type="button" aria-label="Đóng">✕</button>' : ""}
        <div class="modal-ic">🎓</div>
        <h2 id="regTitle">${p.email ? "Cập nhật thông tin học viên" : "Đăng ký học miễn phí"}</h2>
        <p class="muted">${opts.reason ? esc(opts.reason) + " " : ""}Thông tin này được dùng để <b>cấp chứng nhận hoàn thành khoá học</b> do <b>${esc(CFG().issuer || "")}</b> ký.</p>
        <form id="regForm" novalidate>
          <label for="regName">Họ và tên đầy đủ <small class="muted">(in trên chứng nhận)</small></label>
          <input id="regName" name="name" autocomplete="name" placeholder="Ví dụ: Trần Văn An" value="${esc(p.name || "")}" required>
          <small class="field-err" id="errName"></small>
          <label for="regEmail">Gmail</label>
          <input id="regEmail" name="email" type="email" autocomplete="email" inputmode="email" placeholder="tenban@gmail.com" value="${esc(p.email || "")}" required ${p.email && Object.keys(data.certs).length ? "readonly" : ""}>
          <small class="field-err" id="errEmail"></small>
          <label class="check"><input type="checkbox" id="regAgree" ${p.email ? "checked" : ""}> <span>Tôi đồng ý cho Front-end Academy lưu họ tên và Gmail để quản lý học viên và cấp chứng nhận.</span></label>
          <small class="field-err" id="errAgree"></small>
          <div class="preview-name" id="regPreview" ${p.name ? "" : "hidden"}>Tên trên chứng nhận: <b>${esc(p.name || "")}</b></div>
          <button class="btn primary" type="submit" id="regSubmit">${p.email ? "💾 Lưu thông tin" : "🚀 Đăng ký & bắt đầu học"}</button>
          <p class="form-msg" id="regMsg" role="status"></p>
        </form>
      </div>`;
    document.body.appendChild(wrap);
    const $ = s => wrap.querySelector(s);
    const nameI = $("#regName"), emailI = $("#regEmail");
    setTimeout(() => (p.name ? emailI : nameI).focus(), 50);
    const done = ok => { closeModal(); if (ok && opts.onDone) opts.onDone(); else if (!ok && opts.onCancel) opts.onCancel(); };
    if ($(".modal-x")) $(".modal-x").addEventListener("click", () => done(false));
    wrap.addEventListener("keydown", e => { if (e.key === "Escape" && opts.closable !== false) done(false); });
    nameI.addEventListener("input", () => { const n = normName(nameI.value); $("#regPreview").hidden = !n; $("#regPreview b").textContent = n; });
    $("#regForm").addEventListener("submit", async e => {
      e.preventDefault();
      const name = normName(nameI.value), email = normEmail(emailI.value), agree = $("#regAgree").checked;
      const errs = validate(name, email, agree);
      $("#errName").textContent = errs.name || ""; $("#errEmail").textContent = errs.email || ""; $("#errAgree").textContent = errs.agree || "";
      nameI.setAttribute("aria-invalid", !!errs.name); emailI.setAttribute("aria-invalid", !!errs.email);
      if (Object.keys(errs).length) return;
      const btn = $("#regSubmit"); btn.disabled = true; btn.textContent = "⏳ Đang lưu…";
      const changedEmail = data.profile && data.profile.email !== email;
      data.profile = Object.assign({}, changedEmail ? {} : data.profile, { name, email, registeredAt: (data.profile && !changedEmail && data.profile.registeredAt) || new Date().toISOString() });
      data.pendingRegister = true; save();
      if (CFG().appsScriptUrl) {
        try {
          const r = await api("POST", { action: "register", name, email });
          data.profile.learnerId = r.learnerId; data.pendingRegister = false; save();
        } catch (err) {
          $("#regMsg").textContent = "⚠️ " + err.message + ". Thông tin đã lưu trên máy và sẽ tự đồng bộ sau.";
          await new Promise(r => setTimeout(r, 1600));
        }
      }
      renderSidebar();
      done(true);
    });
  }
  function closeModal() { const m = document.getElementById("regModal"); if (m) m.remove(); }

  /* ---------- Hồ sơ trên sidebar ---------- */
  function renderSidebar() {
    const box = document.getElementById("profileBox");
    if (!box) return;
    const p = data.profile;
    if (!p) {
      box.innerHTML = `<button class="btn primary sm profile-reg" type="button">🎓 Đăng ký học</button>`;
      box.querySelector("button").addEventListener("click", () => openModal({ onDone: () => window.dispatchEvent(new Event("hashchange")) }));
      return;
    }
    const n = Object.keys(data.certs).length;
    box.innerHTML = `
      <div class="profile">
        <a class="pf-link" href="#/profile" title="Xem hồ sơ học viên">
          <span class="avatar" aria-hidden="true">${esc(p.name.split(" ").pop().charAt(0))}</span>
          <span class="pf-info"><b title="${esc(p.name)}">${esc(p.name)}</b><small title="${esc(p.email)}">${p.learnerId ? "🆔 " + esc(p.learnerId) : esc(p.email)}${data.pendingRegister && CFG().appsScriptUrl ? " · ⏳ chưa đồng bộ" : ""}</small></span>
        </a>
        <button class="icon-btn sm" type="button" title="Sửa thông tin" aria-label="Sửa thông tin">✏️</button>
      </div>
      ${n ? `<a class="pf-certs" href="#/certificates">🏅 ${n} chứng nhận</a>` : ""}`;
    box.querySelector(".icon-btn").addEventListener("click", () => openModal({ onDone: () => window.dispatchEvent(new Event("hashchange")) }));
  }

  /* ---------- Chứng nhận ---------- */
  async function issue(course, info) {
    if (!data.profile) throw new Error("Bạn cần đăng ký trước");
    const existing = data.certs[course.id];
    if (existing && (existing.verified || !CFG().appsScriptUrl)) return existing;
    const completedAt = info.completedAt || new Date().toLocaleDateString("vi-VN");
    let cert = { courseId: course.id, courseName: course.name, name: data.profile.name, email: data.profile.email,
      lessons: info.lessons, hours: info.hours, completedAt, issuer: CFG().issuer };
    if (CFG().appsScriptUrl) {
      if (data.pendingRegister) await api("POST", { action: "register", name: data.profile.name, email: data.profile.email }).then(r => { data.profile.learnerId = r.learnerId; data.pendingRegister = false; });
      const r = await api("POST", { action: "issue", name: cert.name, email: cert.email, courseId: course.id, courseName: course.name, lessons: info.lessons, completedAt });
      cert = Object.assign(cert, { certId: r.certId, issuedAt: r.issuedAt, verified: true });
    } else {
      const d = new Date(), pad = x => String(x).padStart(2, "0");
      const code = { "fe-basic": "FEB", "fe-pro": "FEP", "be-node": "BEN" }[course.id] || "XXX";
      const rand = Array.from(crypto.getRandomValues(new Uint8Array(5)), b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
      cert = Object.assign(cert, { certId: "FA-" + code + "-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rand,
        issuedAt: d.toLocaleDateString("vi-VN") + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()), verified: false });
    }
    data.certs[course.id] = cert; save(); renderSidebar();
    return cert;
  }
  const verify = id => api("GET", { action: "verify", id });

  function verifyUrl(id) { return (CFG().siteUrl || location.href.split("#")[0]) + "#/verify/" + encodeURIComponent(id); }

  /* Giao diện tờ chứng nhận (A4 ngang). cert: {name, courseName, lessons, hours, issuedAt, certId, verified} */
  function certificateHTML(cert) {
    const day = String(cert.issuedAt || "").split(" ")[0];
    return `
      <div class="cert" id="certSheet">
        <div class="cert-inner">
          <div class="cert-corner tl"></div><div class="cert-corner tr"></div><div class="cert-corner bl"></div><div class="cert-corner br"></div>
          <div class="cert-brand"><span>🎓</span> Front-end Academy</div>
          <div class="cert-kicker">GIẤY CHỨNG NHẬN</div>
          <div class="cert-title">HOÀN THÀNH KHOÁ HỌC</div>
          <p class="cert-lead">Trân trọng chứng nhận học viên</p>
          <div class="cert-name">${esc(cert.name)}</div>
          <p class="cert-lead">đã hoàn thành xuất sắc khoá học</p>
          <div class="cert-course">${esc(cert.courseName)}</div>
          <p class="cert-meta">gồm ${esc(cert.lessons)} bài học có bài tập thực hành tự chấm${cert.hours ? " · khoảng " + esc(cert.hours) + " giờ học" : ""}</p>
          <div class="cert-foot">
            <div class="cert-date"><small>Ngày cấp</small><b>${esc(day)}</b></div>
            <div class="cert-seal" aria-hidden="true">
              <svg viewBox="0 0 120 120"><defs><path id="sealArc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
                <circle cx="60" cy="60" r="56" fill="#16a34a"/><circle cx="60" cy="60" r="50" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="3 3"/>
                <text font-size="9.5" font-weight="700" fill="#fefce8" letter-spacing="2"><textPath href="#sealArc">FRONT-END ACADEMY • CHỨNG NHẬN •</textPath></text>
                <circle cx="60" cy="60" r="30" fill="#facc15"/><text x="60" y="70" text-anchor="middle" font-size="28">🏅</text></svg>
            </div>
            <div class="cert-sign">
              <div class="cert-sig">${esc(cert.issuer || CFG().issuer)}</div>
              <div class="cert-line"></div>
              <b>${esc(cert.issuer || CFG().issuer)}</b>
              <small>${esc(CFG().issuerTitle || "Người cấp chứng nhận")}</small>
            </div>
          </div>
          <div class="cert-id">Mã chứng nhận: <b>${esc(cert.certId)}</b>${cert.verified ? " · Xác minh tại: " + esc(verifyUrl(cert.certId).replace(/^https?:\/\//, "")) : " · ⚠️ Bản lưu trên máy – chưa xác minh online"}</div>
        </div>
      </div>`;
  }

  load();
  window.Account = {
    get profile() { return data.profile; },
    get certs() { return data.certs; },
    isRegistered: () => !!(data.profile && data.profile.email),
    online: () => !!CFG().appsScriptUrl,
    openModal, renderSidebar, syncRegister, issue, verify, verifyUrl, certificateHTML,
    resync() { if (data.profile && !data.profile.learnerId) { data.pendingRegister = true; save(); } return syncRegister(); },
    restore(acc) {   // khôi phục từ file sao lưu (chỉ nhận cấu trúc hợp lệ)
      if (!acc || !acc.profile || !acc.profile.email || !acc.profile.name) return;
      data.profile = { name: String(acc.profile.name), email: String(acc.profile.email), learnerId: acc.profile.learnerId ? String(acc.profile.learnerId) : undefined, registeredAt: acc.profile.registeredAt };
      data.certs = acc.certs && typeof acc.certs === "object" ? acc.certs : {};
      data.pendingRegister = !data.profile.learnerId; save(); renderSidebar();
    },
    logout() { data = { profile: null, certs: {}, pendingRegister: false }; save(); renderSidebar(); },
    _validate: validate, _normName: normName
  };
})();
