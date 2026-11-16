/**
 * =========================================================
 *  FRONT-END ACADEMY – Backend Google Apps Script
 *  Lưu học viên đăng ký & chứng nhận vào Google Sheet này.
 * ---------------------------------------------------------
 *  Cài đặt (1 lần):
 *   1. Mở Google Sheet → Tiện ích mở rộng (Extensions) → Apps Script
 *   2. Xoá code mẫu, dán toàn bộ file này → bấm 💾 Lưu
 *   3. Chọn hàm "caiDat" → bấm ▶ Chạy → cấp quyền (tạo 2 trang tính + tiêu đề)
 *   4. Triển khai (Deploy) → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *        - Thực thi dưới dạng: Tôi (chủ sở hữu)
 *        - Người có quyền truy cập: Bất kỳ ai
 *   5. Copy "URL ứng dụng web" (…/exec) dán vào js/config.js → appsScriptUrl
 *  Sửa code xong: Deploy → Quản lý bản triển khai → ✏️ → Phiên bản: Mới → Triển khai
 *  (giữ nguyên URL).
 * ---------------------------------------------------------
 *  API:
 *   POST {action:"register", name, email}                 → {ok, learnerId}
 *   POST {action:"issue", name, email, courseId, ...}     → {ok, certId, issuedAt}
 *   GET  ?action=verify&id=FA-...                         → {ok, valid, name, courseName, ...}
 *   GET  ?action=ping                                     → {ok}
 *  Thu hồi chứng nhận: đổi cột "Trạng thái" thành "Thu hồi".
 * =========================================================
 */

// ID Google Sheet lưu dữ liệu (dùng khi script là dự án độc lập, không gắn với Sheet)
const SHEET_ID = '10d7QSzXfNv4oQCXziYC8akgi2trv_98OuxAW0dS20UU';
const ss_ = () => SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID);

const SHEET_LEARNERS = 'HocVien';
const SHEET_CERTS = 'ChungNhan';
const ISSUER = 'Trần Doãn Quảng';
const COURSES = {
  'fe-basic': { code: 'FEB', name: 'Front-end Cơ bản' },
  'fe-pro':   { code: 'FEP', name: 'Front-end Nâng cao' },
  'be-node':  { code: 'BEN', name: 'Back-end Node.js' }
};
const LEARNER_HEADERS = ['Thời gian đăng ký', 'Họ và tên', 'Gmail', 'Mã học viên', 'Hoạt động gần nhất', 'Số chứng nhận'];
const CERT_HEADERS = ['Mã chứng nhận', 'Họ và tên', 'Gmail', 'Mã khoá', 'Tên khoá', 'Số bài', 'Ngày hoàn thành', 'Ngày cấp', 'Người cấp', 'Trạng thái'];

/* ---------- Chạy 1 lần để tạo trang tính ---------- */
function caiDat() {
  const ss = ss_();
  [[SHEET_LEARNERS, LEARNER_HEADERS], [SHEET_CERTS, CERT_HEADERS]].forEach(([name, headers]) => {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#dcfce7');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  });
  const macDinh = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (macDinh && ss.getSheets().length > 2 && macDinh.getLastRow() === 0) ss.deleteSheet(macDinh);
  return 'Đã tạo trang tính HocVien và ChungNhan ✅';
}

/* ---------- Tiện ích ---------- */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function sheet_(name, headers) {
  const ss = ss_();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function rows_(sh) {
  const n = sh.getLastRow();
  return n < 2 ? [] : sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues();
}
function clean_(s, max) {
  // Bỏ ký tự điều khiển và chặn "công thức" (=, +, -, @) để tránh CSV/formula injection
  s = String(s || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max || 100);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function validEmail_(e) { return /^[a-z0-9](\.?[a-z0-9_+-])*@gmail\.com$/.test(e); }
function validName_(n) { return n.length >= 4 && n.length <= 70 && n.split(' ').length >= 2 && /^[\p{L}\s'.-]+$/u.test(n); }
function randomCode_(len) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // bỏ O/0, I/1 cho dễ đọc
  let s = '';
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}
function fmtDate_(d) { return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm'); }

/* ---------- API ---------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'verify') return json_(verify_(String(p.id || '').trim().toUpperCase()));
    return json_({ ok: true, service: 'Front-end Academy', time: new Date().toISOString() });
  } catch (err) {
    return json_({ ok: false, error: 'Lỗi máy chủ: ' + err.message });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const name = clean_(data.name, 70);
    const email = clean_(data.email, 100).toLowerCase();
    if (!validEmail_(email)) return json_({ ok: false, error: 'Email phải là địa chỉ @gmail.com hợp lệ' });
    if (!validName_(name)) return json_({ ok: false, error: 'Họ và tên chưa hợp lệ (cần ít nhất 2 từ, chỉ chữ cái)' });
    if (data.action === 'register') return json_(register_(name, email));
    if (data.action === 'issue') return json_(issue_(name, email, data));
    return json_({ ok: false, error: 'action không hợp lệ' });
  } catch (err) {
    return json_({ ok: false, error: 'Lỗi máy chủ: ' + err.message });
  } finally {
    lock.releaseLock();
  }
}

function register_(name, email) {
  const sh = sheet_(SHEET_LEARNERS, LEARNER_HEADERS);
  const rows = rows_(sh);
  const i = rows.findIndex(r => String(r[2]).toLowerCase() === email);
  const now = new Date();
  if (i >= 0) {
    sh.getRange(i + 2, 2).setValue(name);             // cho phép sửa lại họ tên
    sh.getRange(i + 2, 5).setValue(fmtDate_(now));
    return { ok: true, learnerId: rows[i][3], existed: true };
  }
  const learnerId = 'HV' + Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyMMdd') + randomCode_(4);
  sh.appendRow([fmtDate_(now), name, email, learnerId, fmtDate_(now), 0]);
  return { ok: true, learnerId: learnerId, existed: false };
}

function issue_(name, email, data) {
  const course = COURSES[data.courseId];
  if (!course) return { ok: false, error: 'Khoá học không tồn tại' };
  const learners = sheet_(SHEET_LEARNERS, LEARNER_HEADERS);
  const lrows = rows_(learners);
  const li = lrows.findIndex(r => String(r[2]).toLowerCase() === email);
  if (li < 0) return { ok: false, error: 'Gmail chưa đăng ký học' };

  const sh = sheet_(SHEET_CERTS, CERT_HEADERS);
  const rows = rows_(sh);
  const old = rows.find(r => String(r[2]).toLowerCase() === email && r[3] === data.courseId && r[9] !== 'Thu hồi');
  if (old) return { ok: true, certId: old[0], issuedAt: old[7], existed: true };   // mỗi khoá chỉ cấp 1 lần

  const now = new Date();
  const ids = new Set(rows.map(r => r[0]));
  let certId;
  do { certId = 'FA-' + course.code + '-' + Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyMMdd') + '-' + randomCode_(5); } while (ids.has(certId));
  const lessons = Math.max(0, Math.min(200, parseInt(data.lessons, 10) || 0));
  const completedAt = clean_(data.completedAt, 30) || fmtDate_(now);
  sh.appendRow([certId, name, email, data.courseId, course.name, lessons, completedAt, fmtDate_(now), ISSUER, 'Hợp lệ']);
  learners.getRange(li + 2, 6).setValue((Number(lrows[li][5]) || 0) + 1);
  learners.getRange(li + 2, 5).setValue(fmtDate_(now));
  return { ok: true, certId: certId, issuedAt: fmtDate_(now), existed: false };
}

function verify_(id) {
  if (!/^FA-[A-Z]{3}-\d{6}-[A-Z0-9]{5}$/.test(id)) return { ok: true, valid: false, reason: 'Mã chứng nhận không đúng định dạng' };
  const r = rows_(sheet_(SHEET_CERTS, CERT_HEADERS)).find(x => x[0] === id);
  if (!r) return { ok: true, valid: false, reason: 'Không tìm thấy chứng nhận này' };
  // Không trả về Gmail để bảo vệ thông tin cá nhân
  return { ok: true, valid: r[9] !== 'Thu hồi', revoked: r[9] === 'Thu hồi', certId: r[0], name: r[1], courseId: r[3],
           courseName: r[4], lessons: r[5], completedAt: String(r[6]), issuedAt: String(r[7]), issuer: r[8] };
}
