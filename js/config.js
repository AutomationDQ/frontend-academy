/* =========================================================
   CẤU HÌNH CHUNG
   appsScriptUrl: URL ứng dụng web Google Apps Script (…/exec) – xem apps-script/Code.gs
   Để trống "" → web vẫn chạy: đăng ký & chứng nhận chỉ lưu trên máy học viên
   (chứng nhận hiện nhãn "chưa xác minh online").
   ========================================================= */
window.ACADEMY_CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbxJWW6FSuwK_G0pnP8NxZePCv5gZKeJEDNgl7KSGw3QimMJnjArdtkaRoDhTCV4kcKLJw/exec",
  issuer: "Trần Doãn Quảng",
  issuerTitle: "Người sáng lập & giảng viên Front-end Academy",
  siteUrl: "https://automationdq.github.io/frontend-academy/",
  // Mật khẩu trang quản trị (#/admin) – chỉ lưu MÃ BĂM SHA-256, không lưu mật khẩu gốc.
  // Đổi mật khẩu: vào #/admin → "Tạo mã băm cho mật khẩu mới" → dán mã vào đây.
  adminKeyHash: "38ccb266bb0828f95392b502a38753c7a50038428c1fbbfba43b6e382a1e0de6"
};
