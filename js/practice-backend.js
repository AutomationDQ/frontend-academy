/* =========================================================
   BÀI LUYỆN TẬP THÊM – Khoá 3 (phần 1): Nền tảng & Express
   Bài Node có thể khai báo thêm: env, files, requests (giống bài học)
   Trong check: T.request(method, url, { body, headers }) → { status, headers, body, text }
   ========================================================= */
window.PRACTICE = window.PRACTICE || {};
(function () {
  const P = window.PRACTICE;
  const J = js => ({ js });
  const SRV = String.raw`if (!T.server()) return {pass:false, msg:"Server chưa chạy – kiểm tra app.listen(3000) và lỗi ở Terminal."};`;

  /* ===================== NỀN TẢNG ===================== */
  P["web-how-it-works"] = [
    {
      type: "quiz", title: "Mã trạng thái HTTP", level: 1,
      task: "Chọn mã trạng thái (status code) phù hợp cho từng tình huống.",
      hint: "2xx thành công · 3xx chuyển hướng · 4xx lỗi phía client · 5xx lỗi phía server.",
      questions: [
        { q: "Tạo mới bài viết thành công bằng POST. Server nên trả mã nào?", options: ["200 OK", "201 Created", "204 No Content", "302 Found"], answer: 1, explain: "201 Created – kèm object vừa tạo (và thường có header Location)." },
        { q: "Người dùng chưa đăng nhập mà gọi API cần đăng nhập?", options: ["400", "401", "403", "404"], answer: 1, explain: "401 Unauthorized = chưa xác thực (chưa biết bạn là ai). 403 = đã biết nhưng không có quyền." },
        { q: "Đã đăng nhập với vai trò *user* nhưng gọi API chỉ dành cho *admin*?", options: ["401", "403", "405", "500"], answer: 1, explain: "403 Forbidden – biết bạn là ai nhưng bạn không được phép." },
        { q: "Form gửi email sai định dạng lên server?", options: ["400 Bad Request", "404 Not Found", "500 Internal Server Error", "201 Created"], answer: 0, explain: "Dữ liệu client gửi không hợp lệ → 400 (hoặc 422)." },
        { q: "Code server bị lỗi `TypeError` chưa được bắt?", options: ["400", "404", "500", "503"], answer: 2, explain: "500 Internal Server Error – lỗi phía server, không phải lỗi của người dùng." }
      ]
    },
    {
      title: "Bóc tách một URL", level: 2,
      task: "Viết `phanTichURL(url)` dùng class `URL` có sẵn, trả về object:\n`{ giaoThuc, tenMien, cong, duongDan, thamSo }`\nVí dụ `\"https://shop.vn:8080/api/sp?trang=2&loc=re\"` → `{ giaoThuc: \"https\", tenMien: \"shop.vn\", cong: \"8080\", duongDan: \"/api/sp\", thamSo: { trang: \"2\", loc: \"re\" } }`.\nKhông ghi cổng → `cong: \"\"`.",
      starter: { html: "", css: "", js: "function phanTichURL(url) {\n  const u = new URL(url);\n  \n}\n\nconsole.log(phanTichURL(\"https://shop.vn:8080/api/sp?trang=2&loc=re\"));\n" },
      hint: "u.protocol (có dấu ':' ở cuối – dùng replace), u.hostname, u.port, u.pathname, Object.fromEntries(u.searchParams).",
      solution: { html: "", css: "", js: "function phanTichURL(url) {\n  const u = new URL(url);\n  return {\n    giaoThuc: u.protocol.replace(\":\", \"\"),\n    tenMien: u.hostname,\n    cong: u.port,\n    duongDan: u.pathname,\n    thamSo: Object.fromEntries(u.searchParams)\n  };\n}\n\nconsole.log(phanTichURL(\"https://shop.vn:8080/api/sp?trang=2&loc=re\"));" },
      check: String.raw`
        if (typeof phanTichURL !== "function") return {pass:false, msg:"Chưa có hàm phanTichURL."};
        const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        const r1 = phanTichURL("https://shop.vn:8080/api/sp?trang=2&loc=re");
        if (!eq(r1, { giaoThuc: "https", tenMien: "shop.vn", cong: "8080", duongDan: "/api/sp", thamSo: { trang: "2", loc: "re" } })) return {pass:false, msg:"Kết quả chưa đúng: " + JSON.stringify(r1)};
        const r2 = phanTichURL("http://localhost/");
        if (!eq(r2, { giaoThuc: "http", tenMien: "localhost", cong: "", duongDan: "/", thamSo: {} })) return {pass:false, msg:"Với http://localhost/ kết quả chưa đúng: " + JSON.stringify(r2)};
        return {pass:true, msg:"Hiểu cấu trúc URL là bước đầu để thiết kế API!"};`
    },
    {
      type: "quiz", title: "Method, header & body", level: 2,
      task: "5 câu hỏi về phương thức HTTP, header và cách client – server trao đổi dữ liệu.",
      hint: "GET để đọc, POST tạo, PUT/PATCH sửa, DELETE xoá. Header là 'phong bì', body là 'lá thư'.",
      questions: [
        { q: "Method nào **idempotent** (gọi nhiều lần cho cùng kết quả) và **không nên có body**?", options: ["POST", "GET", "PATCH", "CONNECT"], answer: 1, explain: "GET chỉ đọc dữ liệu, gọi bao nhiêu lần cũng không làm thay đổi server." },
        { q: "Gửi JSON lên server cần header nào để server hiểu đúng?", options: ["`Accept: text/html`", "`Content-Type: application/json`", "`Cache-Control: no-cache`", "`Authorization: JSON`"], answer: 1, explain: "Content-Type mô tả định dạng body đang gửi. express.json() chỉ đọc body khi Content-Type là JSON." },
        { q: "Token đăng nhập thường được gửi trong header nào?", options: ["`Cookie-Token`", "`Authorization: Bearer <token>`", "`X-Login`", "`Host`"], answer: 1, explain: "Chuẩn phổ biến: Authorization: Bearer eyJhbGciOi..." },
        { q: "Khác nhau giữa PUT và PATCH?", options: ["Không khác gì", "PUT thay thế toàn bộ tài nguyên, PATCH chỉ sửa một phần", "PUT để xoá, PATCH để tạo", "PATCH chỉ dùng cho file"], answer: 1, explain: "PUT gửi bản đầy đủ để thay thế; PATCH gửi những trường cần đổi." },
        { q: "Trình duyệt chặn front-end ở `a.com` gọi API ở `b.com`. Đây là cơ chế gì?", options: ["Firewall", "CORS (Same-Origin Policy)", "HTTPS", "DNS"], answer: 1, explain: "Server b.com phải trả header Access-Control-Allow-Origin để cho phép." }
      ]
    }
  ];

  P["node-intro"] = [
    {
      title: "Đọc cổng từ biến môi trường", level: 1, env: { PORT: "8080" },
      task: "In ra đúng dòng `Cổng: <PORT>` với PORT lấy từ `process.env.PORT`; nếu không có thì dùng `3000`. (Môi trường bài này đã đặt `PORT=8080`.)\nIn thêm dòng `Môi trường: <NODE_ENV>` – nếu chưa đặt thì in `development`.",
      starter: J("// process.env chứa các biến môi trường\n"),
      hint: "const port = process.env.PORT || 3000;\nconsole.log(\"Cổng: \" + port);\nconsole.log(\"Môi trường: \" + (process.env.NODE_ENV || \"development\"));",
      solution: J("const port = process.env.PORT || 3000;\nconst moiTruong = process.env.NODE_ENV || \"development\";\nconsole.log(\"Cổng: \" + port);\nconsole.log(\"Môi trường: \" + moiTruong);"),
      check: String.raw`
        if (!T.logs.includes("Cổng: 8080")) return {pass:false, msg:"Cần in đúng 'Cổng: 8080' (lấy từ process.env.PORT)."};
        if (!T.logs.includes("Môi trường: development")) return {pass:false, msg:"NODE_ENV chưa đặt → in 'Môi trường: development'."};
        if (/Cổng: 8080/.test(T.src)) return {pass:false, msg:"Đừng gõ cứng 8080 – hãy đọc từ process.env.PORT."};
        return {pass:true, msg:"Cấu hình qua biến môi trường là chuẩn khi deploy (Render, Railway, Docker…)."};`
    },
    {
      title: "Làm việc với đường dẫn – module path", level: 2,
      task: "Dùng module `path`:\n• Tạo `duongDan = path.join(__dirname, \"data\", \"users.json\")` rồi in ra.\n• In ra phần mở rộng của nó bằng `path.extname` (kết quả `.json`).\n• In ra tên file bằng `path.basename` (kết quả `users.json`).",
      starter: J("const path = require(\"path\");\n\n"),
      hint: "path.join tự xử lý dấu '/' – đừng nối chuỗi bằng tay (Windows dùng '\\').",
      solution: J("const path = require(\"path\");\n\nconst duongDan = path.join(__dirname, \"data\", \"users.json\");\nconsole.log(duongDan);\nconsole.log(path.extname(duongDan));\nconsole.log(path.basename(duongDan));"),
      check: String.raw`
        if (!/path\.join\(/.test(T.src)) return {pass:false, msg:"Hãy dùng path.join."};
        if (!T.logs.includes("/app/data/users.json")) return {pass:false, msg:"Chưa in ra đường dẫn đầy đủ /app/data/users.json (__dirname là /app)."};
        if (!T.logs.includes(".json")) return {pass:false, msg:"Chưa in ra '.json' bằng path.extname."};
        if (!T.logs.includes("users.json")) return {pass:false, msg:"Chưa in ra 'users.json' bằng path.basename."};
        return {pass:true, msg:"path giúp code chạy đúng trên cả Windows, macOS và Linux."};`
    },
    {
      title: "Sự kiện với EventEmitter", level: 3,
      task: "Tạo `donHang = new EventEmitter()`:\n• Lắng nghe sự kiện `\"dat\"` nhận `{ id, tong }` và in `Đơn #<id>: <tong>đ`.\n• Lắng nghe `\"huy\"` nhận `id` và in `Huỷ đơn #<id>`.\n• Xuất ra: `module.exports = { donHang }`.",
      starter: J("const EventEmitter = require(\"events\");\n\n"),
      hint: "donHang.on(\"dat\", ({ id, tong }) => console.log(`Đơn #${id}: ${tong}đ`)); — thử donHang.emit(\"dat\", { id: 1, tong: 50000 });",
      solution: J("const EventEmitter = require(\"events\");\n\nconst donHang = new EventEmitter();\ndonHang.on(\"dat\", ({ id, tong }) => console.log(`Đơn #${id}: ${tong}đ`));\ndonHang.on(\"huy\", id => console.log(`Huỷ đơn #${id}`));\n\ndonHang.emit(\"dat\", { id: 1, tong: 50000 });\nmodule.exports = { donHang };"),
      check: String.raw`
        const ex = T.exports();
        if (!ex || !ex.donHang || typeof ex.donHang.emit !== "function") return {pass:false, msg:"Cần module.exports = { donHang } với donHang là EventEmitter."};
        ex.donHang.emit("dat", { id: 42, tong: 125000 });
        if (!T.logs.includes("Đơn #42: 125000đ")) return {pass:false, msg:"emit('dat', { id: 42, tong: 125000 }) phải in 'Đơn #42: 125000đ'."};
        ex.donHang.emit("huy", 7);
        if (!T.logs.includes("Huỷ đơn #7")) return {pass:false, msg:"emit('huy', 7) phải in 'Huỷ đơn #7'."};
        return {pass:true, msg:"Node được xây trên mô hình sự kiện – server, stream, socket đều là EventEmitter."};`
    }
  ];

  P["node-modules"] = [
    {
      title: "Xuất một hàm", level: 1,
      task: "Viết hàm `chaoHoi(ten)` trả về `\"Xin chào, <ten>!\"` và xuất **chính hàm đó** bằng `module.exports = chaoHoi`.",
      starter: J("function chaoHoi(ten) {\n  \n}\n\n"),
      hint: "module.exports = chaoHoi;  → file khác dùng: const chao = require('./chao'); chao('An');",
      solution: J("function chaoHoi(ten) {\n  return `Xin chào, ${ten}!`;\n}\n\nmodule.exports = chaoHoi;"),
      check: String.raw`
        const f = T.exports();
        if (typeof f !== "function") return {pass:false, msg:"module.exports phải là một hàm."};
        if (f("Node") !== "Xin chào, Node!") return {pass:false, msg:"chaoHoi('Node') phải trả về 'Xin chào, Node!'."};
        return {pass:true, msg:"Mỗi file là một module – chỉ những gì exports mới dùng được từ bên ngoài."};`
    },
    {
      title: "Module tiện ích định dạng", level: 2,
      task: "Xuất object gồm 2 hàm:\n• `dinhDangTien(n)` → chuỗi có dấu chấm ngăn cách hàng nghìn + ` ₫`: `1250000` → `\"1.250.000 ₫\"`.\n• `vietHoaChuDau(s)` → viết hoa chữ cái đầu mỗi từ: `\"nguyễn văn an\"` → `\"Nguyễn Văn An\"`.",
      starter: J("function dinhDangTien(n) {\n  \n}\n\nfunction vietHoaChuDau(s) {\n  \n}\n\nmodule.exports = { dinhDangTien, vietHoaChuDau };\n"),
      hint: "String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, \".\") + \" ₫\"\ns.split(\" \").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(\" \")",
      solution: J("function dinhDangTien(n) {\n  return String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, \".\") + \" ₫\";\n}\n\nfunction vietHoaChuDau(s) {\n  return s.split(\" \").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(\" \");\n}\n\nmodule.exports = { dinhDangTien, vietHoaChuDau };"),
      check: String.raw`
        const m = T.exports();
        if (!m || typeof m.dinhDangTien !== "function" || typeof m.vietHoaChuDau !== "function") return {pass:false, msg:"Cần module.exports = { dinhDangTien, vietHoaChuDau }."};
        for (const [n, kq] of [[1250000, "1.250.000 ₫"], [999, "999 ₫"], [1000, "1.000 ₫"], [0, "0 ₫"]]) if (m.dinhDangTien(n) !== kq) return {pass:false, msg:"dinhDangTien(" + n + ") phải là '" + kq + "' (đang '" + m.dinhDangTien(n) + "')."};
        if (m.vietHoaChuDau("nguyễn văn an") !== "Nguyễn Văn An") return {pass:false, msg:"vietHoaChuDau('nguyễn văn an') phải là 'Nguyễn Văn An'."};
        if (m.vietHoaChuDau("đoàn") !== "Đoàn") return {pass:false, msg:"vietHoaChuDau('đoàn') phải là 'Đoàn'."};
        return {pass:true, msg:"Module tiện ích (utils) như thế này có trong mọi dự án thực tế."};`
    },
    {
      title: "Đọc package.json", level: 3,
      files: { "package.json": "{\n  \"name\": \"blog-api\",\n  \"version\": \"1.4.2\",\n  \"scripts\": { \"start\": \"node server.js\", \"dev\": \"node --watch server.js\" },\n  \"dependencies\": { \"express\": \"^5.1.0\", \"better-sqlite3\": \"^11.0.0\", \"bcryptjs\": \"^3.0.2\" },\n  \"devDependencies\": { \"vitest\": \"^2.1.0\" }\n}\n" },
      task: "File `package.json` đã có sẵn. Đọc nó bằng `fs.readFileSync` + `JSON.parse` rồi in ra **đúng 3 dòng**:\n• `Dự án blog-api v1.4.2`\n• `Thư viện: 3` (số dependencies)\n• `Scripts: start, dev`",
      starter: J("const fs = require(\"fs\");\n\n"),
      hint: "const pkg = JSON.parse(fs.readFileSync(\"package.json\", \"utf8\")); Object.keys(pkg.dependencies).length; Object.keys(pkg.scripts).join(\", \")",
      solution: J("const fs = require(\"fs\");\n\nconst pkg = JSON.parse(fs.readFileSync(\"package.json\", \"utf8\"));\nconsole.log(`Dự án ${pkg.name} v${pkg.version}`);\nconsole.log(`Thư viện: ${Object.keys(pkg.dependencies || {}).length}`);\nconsole.log(`Scripts: ${Object.keys(pkg.scripts || {}).join(\", \")}`);"),
      check: String.raw`
        if (/blog-api|1\.4\.2/.test(T.src)) return {pass:false, msg:"Đọc từ file, đừng gõ cứng tên/phiên bản."};
        for (const d of ["Dự án blog-api v1.4.2", "Thư viện: 3", "Scripts: start, dev"]) if (!T.logs.includes(d)) return {pass:false, msg:"Chưa in đúng dòng: '" + d + "'."};
        return {pass:true, msg:"package.json chỉ là JSON – công cụ nào cũng đọc được nó."};`
    }
  ];

  P["node-fs-async"] = [
    {
      title: "Đọc file văn bản", level: 1,
      files: { "data/loichao.txt": "Xin chào từ Node.js! 👋" },
      task: "Dùng `fs/promises` đọc file `data/loichao.txt` (mã hoá `utf8`) bằng `await` rồi in nội dung ra.",
      starter: J("const fs = require(\"fs/promises\");\n\nasync function main() {\n  \n}\n\nmain();\n"),
      hint: "const noiDung = await fs.readFile(\"data/loichao.txt\", \"utf8\"); console.log(noiDung);",
      solution: J("const fs = require(\"fs/promises\");\n\nasync function main() {\n  const noiDung = await fs.readFile(\"data/loichao.txt\", \"utf8\");\n  console.log(noiDung);\n}\n\nmain();"),
      check: String.raw`
        await T.sleep(60);
        if (!/await/.test(T.src)) return {pass:false, msg:"Hãy dùng await với fs/promises."};
        if (!T.logs.includes("Xin chào từ Node.js! 👋")) return {pass:false, msg:"Chưa in đúng nội dung file."};
        return {pass:true, msg:"Đọc file bất đồng bộ – server vẫn phục vụ người khác trong lúc chờ ổ đĩa."};`
    },
    {
      title: "Ghi nhật ký (append)", level: 2,
      task: "Viết `async function ghiNhatKy(dong)`:\n• Đảm bảo thư mục `logs` tồn tại: `fs.mkdir(\"logs\", { recursive: true })`.\n• **Nối thêm** một dòng `[<thời gian ISO>] <dong>` + xuống dòng vào `logs/app.log` bằng `appendFile`.\nXuất `module.exports = { ghiNhatKy }`.",
      starter: J("const fs = require(\"fs/promises\");\n\nasync function ghiNhatKy(dong) {\n  \n}\n\nmodule.exports = { ghiNhatKy };\n"),
      hint: "await fs.appendFile(\"logs/app.log\", `[${new Date().toISOString()}] ${dong}\\n`);",
      solution: J("const fs = require(\"fs/promises\");\n\nasync function ghiNhatKy(dong) {\n  await fs.mkdir(\"logs\", { recursive: true });\n  await fs.appendFile(\"logs/app.log\", `[${new Date().toISOString()}] ${dong}\\n`);\n}\n\nmodule.exports = { ghiNhatKy };\n\nghiNhatKy(\"Server khởi động\");"),
      check: String.raw`
        const m = T.exports();
        if (!m || typeof m.ghiNhatKy !== "function") return {pass:false, msg:"Cần module.exports = { ghiNhatKy }."};
        const truoc = (T.file("logs/app.log") || "").split("\n").filter(Boolean).length;
        await m.ghiNhatKy("Người dùng đăng nhập");
        await m.ghiNhatKy("Người dùng đăng xuất");
        const dong = (T.file("logs/app.log") || "").split("\n").filter(Boolean);
        if (dong.length !== truoc + 2) return {pass:false, msg:"Gọi 2 lần phải thêm đúng 2 dòng (không ghi đè)."};
        const cuoi = dong[dong.length - 1];
        if (!/^\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\] Người dùng đăng xuất$/.test(cuoi)) return {pass:false, msg:"Dòng phải có dạng '[2026-11-16T08:00:00.000Z] nội dung' – đang: " + cuoi};
        if (!(T.file("logs/app.log") || "").endsWith("\n")) return {pass:false, msg:"Mỗi dòng phải kết thúc bằng xuống dòng \\n."};
        return {pass:true, msg:"Log là 'hộp đen' của server – không có log thì debug production rất khổ!"};`
    },
    {
      title: "Đọc nhiều file song song", level: 3,
      files: { "data/thang1.json": "[{\"gia\":120000},{\"gia\":80000}]", "data/thang2.json": "[{\"gia\":200000}]", "data/thang3.json": "[{\"gia\":50000},{\"gia\":50000},{\"gia\":100000}]" },
      task: "Viết `async function tongDoanhThu(dsFile)` đọc **song song** (`Promise.all`) các file JSON (mỗi file là mảng `{ gia }`), trả về tổng `gia` của tất cả.\nFile **không tồn tại** thì coi như 0 và in cảnh báo `Bỏ qua <tên file>` (không làm hỏng cả hàm).\nXuất `module.exports = { tongDoanhThu }`.",
      starter: J("const fs = require(\"fs/promises\");\n\nasync function tongDoanhThu(dsFile) {\n  \n}\n\nmodule.exports = { tongDoanhThu };\n"),
      hint: "const docMot = async f => { try { const ds = JSON.parse(await fs.readFile(f, \"utf8\")); return ds.reduce((t, x) => t + x.gia, 0); } catch (e) { console.log(\"Bỏ qua \" + f); return 0; } };\nconst cacTong = await Promise.all(dsFile.map(docMot));",
      solution: J("const fs = require(\"fs/promises\");\n\nasync function docMot(file) {\n  try {\n    const ds = JSON.parse(await fs.readFile(file, \"utf8\"));\n    return ds.reduce((t, x) => t + x.gia, 0);\n  } catch (e) {\n    console.log(\"Bỏ qua \" + file);\n    return 0;\n  }\n}\n\nasync function tongDoanhThu(dsFile) {\n  const cacTong = await Promise.all(dsFile.map(docMot));\n  return cacTong.reduce((a, b) => a + b, 0);\n}\n\nmodule.exports = { tongDoanhThu };"),
      check: String.raw`
        const m = T.exports();
        if (!m || typeof m.tongDoanhThu !== "function") return {pass:false, msg:"Cần module.exports = { tongDoanhThu }."};
        if (!/Promise\.all/.test(T.src)) return {pass:false, msg:"Hãy đọc song song bằng Promise.all."};
        const r1 = await m.tongDoanhThu(["data/thang1.json", "data/thang2.json", "data/thang3.json"]);
        if (r1 !== 600000) return {pass:false, msg:"Tổng 3 tháng phải là 600000 (đang " + r1 + ")."};
        let r2; try { r2 = await m.tongDoanhThu(["data/thang2.json", "data/khong-co.json"]); } catch (e) { return {pass:false, msg:"File không tồn tại không được làm hỏng cả hàm: " + e.message}; }
        if (r2 !== 200000) return {pass:false, msg:"Bỏ qua file thiếu → tổng phải là 200000."};
        if (!T.logs.includes("Bỏ qua data/khong-co.json")) return {pass:false, msg:"Cần in 'Bỏ qua data/khong-co.json'."};
        return {pass:true, msg:"Promise.all + try/catch từng phần: nhanh mà vẫn bền bỉ."};`
    }
  ];

  /* ===================== EXPRESS & REST ===================== */
  P["http-server"] = [
    {
      title: "Trả JSON bằng module http", level: 1,
      requests: [{ method: "GET", url: "/" }],
      task: "Dùng `http.createServer` (không Express) tạo server cổng 3000: **mọi** request đều nhận status 200, header `Content-Type: application/json` và body `{\"ok\":true,\"message\":\"Xin chào HTTP\"}`.",
      starter: J("const http = require(\"http\");\n\nconst server = http.createServer((req, res) => {\n  \n});\n\nserver.listen(3000);\n"),
      hint: "res.writeHead(200, { \"Content-Type\": \"application/json\" }); res.end(JSON.stringify({ ok: true, message: \"Xin chào HTTP\" }));",
      solution: J("const http = require(\"http\");\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { \"Content-Type\": \"application/json\" });\n  res.end(JSON.stringify({ ok: true, message: \"Xin chào HTTP\" }));\n});\n\nserver.listen(3000, () => console.log(\"Server chạy ở cổng 3000\"));"),
      check: SRV + String.raw`
        if (/require\(["']express/.test(T.src)) return {pass:false, msg:"Bài này dùng module http, không dùng Express."};
        for (const u of ["/", "/bat-ky"]) {
          const r = await T.request("GET", u);
          if (r.status !== 200) return {pass:false, msg:"GET " + u + " phải trả 200."};
          if (!/application\/json/.test(r.headers["content-type"] || "")) return {pass:false, msg:"Thiếu header Content-Type: application/json."};
          if (!r.body || r.body.ok !== true || r.body.message !== "Xin chào HTTP") return {pass:false, msg:"Body phải là {\"ok\":true,\"message\":\"Xin chào HTTP\"}."};
        }
        return {pass:true, msg:"Express cũng chỉ là lớp bọc quanh những dòng này!"};`
    },
    {
      title: "Định tuyến thủ công + query", level: 2,
      requests: [{ method: "GET", url: "/api/hello?ten=An" }, { method: "GET", url: "/api/hello" }, { method: "POST", url: "/api/hello" }, { method: "GET", url: "/khac" }],
      task: "Server `http` cổng 3000:\n• `GET /api/hello?ten=An` → 200 text `Xin chào An` (thiếu `ten` → `Xin chào bạn`).\n• Đúng đường dẫn nhưng **sai method** → **405** text `Method Not Allowed`.\n• Đường dẫn khác → **404** text `Không tìm thấy`.",
      starter: J("const http = require(\"http\");\n\nhttp.createServer((req, res) => {\n  const url = new URL(req.url, \"http://localhost\");\n  \n}).listen(3000);\n"),
      hint: "if (url.pathname === \"/api/hello\") { if (req.method !== \"GET\") { res.statusCode = 405; return res.end(\"Method Not Allowed\"); } ... }",
      solution: J("const http = require(\"http\");\n\nhttp.createServer((req, res) => {\n  const url = new URL(req.url, \"http://localhost\");\n  res.setHeader(\"Content-Type\", \"text/plain; charset=utf-8\");\n  if (url.pathname === \"/api/hello\") {\n    if (req.method !== \"GET\") {\n      res.statusCode = 405;\n      return res.end(\"Method Not Allowed\");\n    }\n    const ten = url.searchParams.get(\"ten\") || \"bạn\";\n    return res.end(\"Xin chào \" + ten);\n  }\n  res.statusCode = 404;\n  res.end(\"Không tìm thấy\");\n}).listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/hello?ten=An");
        if (r.status !== 200 || r.text !== "Xin chào An") return {pass:false, msg:"GET /api/hello?ten=An → 200 'Xin chào An' (đang " + r.status + " '" + r.text + "')."};
        r = await T.request("GET", "/api/hello?ten=Qu%E1%BA%A3ng");
        if (r.text !== "Xin chào Quảng") return {pass:false, msg:"Phải giải mã được tiếng Việt trong query (dùng url.searchParams)."};
        r = await T.request("GET", "/api/hello");
        if (r.text !== "Xin chào bạn") return {pass:false, msg:"Thiếu ten → 'Xin chào bạn'."};
        r = await T.request("POST", "/api/hello");
        if (r.status !== 405) return {pass:false, msg:"POST /api/hello phải trả 405 (đang " + r.status + ")."};
        r = await T.request("GET", "/khac");
        if (r.status !== 404 || r.text !== "Không tìm thấy") return {pass:false, msg:"Đường dẫn khác → 404 'Không tìm thấy'."};
        return {pass:true, msg:"Tự định tuyến mới thấy Express tiện thế nào 😄"};`
    },
    {
      title: "Đọc body POST bằng stream", level: 3,
      requests: [{ method: "POST", url: "/api/echo", body: { ten: "Quảng", tuoi: 23 } }, { method: "POST", url: "/api/echo", body: "khong phai json", label: "/api/echo (body sai)" }],
      task: "`POST /api/echo`: đọc body bằng sự kiện `data`/`end`, parse JSON và trả về **201** JSON `{ nhanDuoc: <object gửi lên>, soTruong: <số thuộc tính> }`.\nBody không phải JSON hợp lệ → **400** JSON `{ \"error\": \"JSON không hợp lệ\" }`.",
      starter: J("const http = require(\"http\");\n\nhttp.createServer((req, res) => {\n  if (req.method === \"POST\" && req.url === \"/api/echo\") {\n    let raw = \"\";\n    // req.on(\"data\", ...) và req.on(\"end\", ...)\n    return;\n  }\n  res.statusCode = 404;\n  res.end();\n}).listen(3000);\n"),
      hint: "req.on(\"data\", chunk => raw += chunk); req.on(\"end\", () => { try { const obj = JSON.parse(raw); ... } catch { ... } });",
      solution: J("const http = require(\"http\");\n\nfunction guiJSON(res, status, data) {\n  res.writeHead(status, { \"Content-Type\": \"application/json\" });\n  res.end(JSON.stringify(data));\n}\n\nhttp.createServer((req, res) => {\n  if (req.method === \"POST\" && req.url === \"/api/echo\") {\n    let raw = \"\";\n    req.on(\"data\", chunk => { raw += chunk; });\n    req.on(\"end\", () => {\n      try {\n        const obj = JSON.parse(raw);\n        guiJSON(res, 201, { nhanDuoc: obj, soTruong: Object.keys(obj).length });\n      } catch (e) {\n        guiJSON(res, 400, { error: \"JSON không hợp lệ\" });\n      }\n    });\n    return;\n  }\n  res.statusCode = 404;\n  res.end();\n}).listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("POST", "/api/echo", { body: { ten: "Quảng", tuoi: 23 } });
        if (r.status !== 201) return {pass:false, msg:"POST hợp lệ phải trả 201 (đang " + r.status + ")."};
        if (!r.body || !r.body.nhanDuoc || r.body.nhanDuoc.ten !== "Quảng" || r.body.soTruong !== 2) return {pass:false, msg:"Body trả về phải là { nhanDuoc: {...}, soTruong: 2 }."};
        r = await T.request("POST", "/api/echo", { body: "{sai", headers: { "content-type": "application/json" } });
        if (r.status !== 400 || !r.body || r.body.error !== "JSON không hợp lệ") return {pass:false, msg:"JSON sai phải trả 400 { error: 'JSON không hợp lệ' }."};
        return {pass:true, msg:"Đây chính là việc express.json() làm giúp bạn mỗi request."};`
    }
  ];

  P["express-intro"] = [
    {
      title: "Hai route đầu tiên", level: 1,
      requests: [{ method: "GET", url: "/api/ping" }, { method: "GET", url: "/about" }],
      task: "Dùng Express (cổng 3000):\n• `GET /api/ping` → JSON `{ \"pong\": true }`.\n• `GET /about` → text `Giới thiệu Front-end Academy` (dùng `res.send`).",
      starter: J("const express = require(\"express\");\nconst app = express();\n\n\napp.listen(3000);\n"),
      hint: "app.get(\"/api/ping\", (req, res) => res.json({ pong: true }));",
      solution: J("const express = require(\"express\");\nconst app = express();\n\napp.get(\"/api/ping\", (req, res) => res.json({ pong: true }));\napp.get(\"/about\", (req, res) => res.send(\"Giới thiệu Front-end Academy\"));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/ping");
        if (r.status !== 200 || !r.body || r.body.pong !== true) return {pass:false, msg:"GET /api/ping phải trả JSON { pong: true }."};
        r = await T.request("GET", "/about");
        if (r.status !== 200 || r.text !== "Giới thiệu Front-end Academy") return {pass:false, msg:"GET /about phải trả text 'Giới thiệu Front-end Academy'."};
        return {pass:true, msg:"Một dòng = một route. Gọn hơn module http rất nhiều!"};`
    },
    {
      title: "Status code & chuyển hướng", level: 2,
      requests: [{ method: "GET", url: "/api/health" }, { method: "GET", url: "/api/old-health" }, { method: "GET", url: "/api/teapot" }],
      task: "• `GET /api/health` → 200 JSON `{ status: \"ok\", time: <chuỗi ISO> }`.\n• `GET /api/old-health` → chuyển hướng **301** sang `/api/health`.\n• `GET /api/teapot` → status **418** JSON `{ error: \"Tôi là ấm trà\" }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\n\napp.listen(3000);\n"),
      hint: "res.redirect(301, \"/api/health\");  res.status(418).json({ ... });  new Date().toISOString()",
      solution: J("const express = require(\"express\");\nconst app = express();\n\napp.get(\"/api/health\", (req, res) => res.json({ status: \"ok\", time: new Date().toISOString() }));\napp.get(\"/api/old-health\", (req, res) => res.redirect(301, \"/api/health\"));\napp.get(\"/api/teapot\", (req, res) => res.status(418).json({ error: \"Tôi là ấm trà\" }));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/health");
        if (r.status !== 200 || !r.body || r.body.status !== "ok") return {pass:false, msg:"GET /api/health phải trả { status: 'ok', time }."};
        if (typeof r.body.time !== "string" || isNaN(Date.parse(r.body.time)) || !r.body.time.endsWith("Z")) return {pass:false, msg:"time phải là chuỗi ISO (new Date().toISOString())."};
        r = await T.request("GET", "/api/old-health");
        if (r.status !== 301 || r.headers.location !== "/api/health") return {pass:false, msg:"/api/old-health phải redirect 301 tới /api/health."};
        r = await T.request("GET", "/api/teapot");
        if (r.status !== 418 || !r.body || r.body.error !== "Tôi là ấm trà") return {pass:false, msg:"/api/teapot phải trả 418 { error: 'Tôi là ấm trà' }."};
        return {pass:true, msg:"418 là mã có thật (RFC 2324) – trò đùa Cá tháng Tư của giới lập trình ☕"};`
    },
    {
      title: "Router & trang 404 dạng JSON", level: 3,
      requests: [{ method: "GET", url: "/api/v1/users" }, { method: "GET", url: "/api/v1/users/count" }, { method: "GET", url: "/api/v2/users" }],
      task: "• Tạo `express.Router()` có `GET /users` → `[\"An\", \"Bình\"]` và `GET /users/count` → `{ count: 2 }`. Gắn router vào tiền tố `/api/v1`.\n• Mọi đường dẫn không khớp → **404** JSON `{ error: \"Không tìm thấy\", path: <đường dẫn được yêu cầu> }` (middleware đặt **cuối cùng**).",
      starter: J("const express = require(\"express\");\nconst app = express();\nconst router = express.Router();\n\n\napp.listen(3000);\n"),
      hint: "app.use(\"/api/v1\", router);\napp.use((req, res) => res.status(404).json({ error: \"Không tìm thấy\", path: req.originalUrl }));",
      solution: J("const express = require(\"express\");\nconst app = express();\nconst router = express.Router();\n\nconst users = [\"An\", \"Bình\"];\nrouter.get(\"/users\", (req, res) => res.json(users));\nrouter.get(\"/users/count\", (req, res) => res.json({ count: users.length }));\n\napp.use(\"/api/v1\", router);\n\napp.use((req, res) => {\n  res.status(404).json({ error: \"Không tìm thấy\", path: req.originalUrl });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/v1/users");
        if (r.status !== 200 || JSON.stringify(r.body) !== '["An","Bình"]') return {pass:false, msg:"GET /api/v1/users phải trả [\"An\", \"Bình\"]."};
        r = await T.request("GET", "/api/v1/users/count");
        if (!r.body || r.body.count !== 2) return {pass:false, msg:"GET /api/v1/users/count phải trả { count: 2 }."};
        if (!/express\.Router\(\)/.test(T.src) || !/app\.use\(\s*["']\/api\/v1["']/.test(T.src)) return {pass:false, msg:"Dùng express.Router() và app.use('/api/v1', router)."};
        r = await T.request("GET", "/api/v2/users");
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy" || r.body.path !== "/api/v2/users") return {pass:false, msg:"Đường dẫn lạ phải trả 404 { error: 'Không tìm thấy', path: '/api/v2/users' }."};
        return {pass:true, msg:"Router giúp chia API thành nhiều file theo tài nguyên – và đánh phiên bản v1, v2."};`
    }
  ];

  P["express-params"] = [
    {
      title: "Route params", level: 1,
      requests: [{ method: "GET", url: "/api/chao/Quang" }, { method: "GET", url: "/api/binh-phuong/12" }],
      task: "• `GET /api/chao/:ten` → `{ loiChao: \"Xin chào, <ten>!\" }`.\n• `GET /api/binh-phuong/:so` → `{ so, ketQua }` (đều là **số**). `:so` không phải số → **400** `{ error: \"so phải là số\" }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\n\napp.listen(3000);\n"),
      hint: "const so = Number(req.params.so); if (Number.isNaN(so)) return res.status(400).json({ error: \"so phải là số\" });",
      solution: J("const express = require(\"express\");\nconst app = express();\n\napp.get(\"/api/chao/:ten\", (req, res) => {\n  res.json({ loiChao: `Xin chào, ${req.params.ten}!` });\n});\n\napp.get(\"/api/binh-phuong/:so\", (req, res) => {\n  const so = Number(req.params.so);\n  if (Number.isNaN(so)) return res.status(400).json({ error: \"so phải là số\" });\n  res.json({ so, ketQua: so * so });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/chao/Quang");
        if (!r.body || r.body.loiChao !== "Xin chào, Quang!") return {pass:false, msg:"/api/chao/Quang → { loiChao: 'Xin chào, Quang!' }."};
        r = await T.request("GET", "/api/binh-phuong/12");
        if (!r.body || r.body.so !== 12 || r.body.ketQua !== 144) return {pass:false, msg:"/api/binh-phuong/12 → { so: 12, ketQua: 144 } (kiểu số)."};
        r = await T.request("GET", "/api/binh-phuong/abc");
        if (r.status !== 400 || !r.body || r.body.error !== "so phải là số") return {pass:false, msg:"/api/binh-phuong/abc → 400 { error: 'so phải là số' }."};
        return {pass:true, msg:"Nhớ: params luôn là CHUỖI – phải tự đổi kiểu."};`
    },
    {
      title: "Máy tính qua query string", level: 2,
      requests: [{ method: "GET", url: "/api/tinh?a=6&b=3&phep=nhan" }, { method: "GET", url: "/api/tinh?a=6&b=0&phep=chia" }, { method: "GET", url: "/api/tinh?a=x&b=1&phep=cong" }],
      task: "`GET /api/tinh?a=&b=&phep=` với `phep` là `cong` | `tru` | `nhan` | `chia` → `{ ketQua }`.\nTrả **400** `{ error }` khi: `a`/`b` không phải số, `phep` không hợp lệ, hoặc chia cho 0.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\napp.get(\"/api/tinh\", (req, res) => {\n  \n});\n\napp.listen(3000);\n"),
      hint: "const a = Number(req.query.a), b = Number(req.query.b); const phepTinh = { cong: a + b, tru: a - b, nhan: a * b, chia: a / b }; kiểm tra lỗi trước rồi trả phepTinh[phep].",
      solution: J("const express = require(\"express\");\nconst app = express();\n\napp.get(\"/api/tinh\", (req, res) => {\n  const { phep } = req.query;\n  const a = Number(req.query.a), b = Number(req.query.b);\n  if (req.query.a === undefined || req.query.b === undefined || Number.isNaN(a) || Number.isNaN(b))\n    return res.status(400).json({ error: \"a và b phải là số\" });\n  if (![\"cong\", \"tru\", \"nhan\", \"chia\"].includes(phep))\n    return res.status(400).json({ error: \"phep không hợp lệ\" });\n  if (phep === \"chia\" && b === 0)\n    return res.status(400).json({ error: \"Không thể chia cho 0\" });\n  const ketQua = { cong: a + b, tru: a - b, nhan: a * b, chia: a / b }[phep];\n  res.json({ ketQua });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const g = async q => T.request("GET", "/api/tinh?" + q);
        for (const [q, kq] of [["a=6&b=3&phep=cong", 9], ["a=6&b=3&phep=tru", 3], ["a=6&b=3&phep=nhan", 18], ["a=6&b=3&phep=chia", 2], ["a=1.5&b=2&phep=nhan", 3]]) {
          const r = await g(q);
          if (r.status !== 200 || !r.body || r.body.ketQua !== kq) return {pass:false, msg:"?" + q + " → { ketQua: " + kq + " } (đang " + r.status + " " + r.text + ")."};
        }
        for (const q of ["a=6&b=0&phep=chia", "a=x&b=1&phep=cong", "a=1&b=2&phep=mu", "b=2&phep=cong"]) {
          const r = await g(q);
          if (r.status !== 400 || !r.body || !r.body.error) return {pass:false, msg:"?" + q + " phải trả 400 { error }."};
        }
        return {pass:true, msg:"Validate query cẩn thận – người dùng có thể gõ bất cứ thứ gì lên URL!"};`
    },
    {
      title: "Tài nguyên lồng nhau + phân trang", level: 3,
      requests: [{ method: "GET", url: "/api/users/1/posts" }, { method: "GET", url: "/api/users/1/posts?page=2&limit=2" }, { method: "GET", url: "/api/users/9/posts" }],
      task: "`GET /api/users/:userId/posts?page=&limit=` trả về bài viết của user đó, có phân trang:\n`{ page, limit, total, data: [...] }` (mặc định `page=1`, `limit=2`).\nUser không tồn tại → **404** `{ error: \"Không tìm thấy user\" }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\nconst users = [{ id: 1, ten: \"An\" }, { id: 2, ten: \"Bình\" }];\nconst posts = [\n  { id: 1, userId: 1, tieuDe: \"Học HTML\" },\n  { id: 2, userId: 2, tieuDe: \"Học SQL\" },\n  { id: 3, userId: 1, tieuDe: \"Học CSS\" },\n  { id: 4, userId: 1, tieuDe: \"Học JS\" },\n  { id: 5, userId: 1, tieuDe: \"Học Node\" }\n];\n\n\napp.listen(3000);\n"),
      hint: "const ds = posts.filter(p => p.userId === userId); const start = (page - 1) * limit; data: ds.slice(start, start + limit)",
      solution: J("const express = require(\"express\");\nconst app = express();\n\nconst users = [{ id: 1, ten: \"An\" }, { id: 2, ten: \"Bình\" }];\nconst posts = [\n  { id: 1, userId: 1, tieuDe: \"Học HTML\" },\n  { id: 2, userId: 2, tieuDe: \"Học SQL\" },\n  { id: 3, userId: 1, tieuDe: \"Học CSS\" },\n  { id: 4, userId: 1, tieuDe: \"Học JS\" },\n  { id: 5, userId: 1, tieuDe: \"Học Node\" }\n];\n\napp.get(\"/api/users/:userId/posts\", (req, res) => {\n  const userId = Number(req.params.userId);\n  if (!users.some(u => u.id === userId)) return res.status(404).json({ error: \"Không tìm thấy user\" });\n  const page = Math.max(1, Number(req.query.page) || 1);\n  const limit = Math.max(1, Number(req.query.limit) || 2);\n  const ds = posts.filter(p => p.userId === userId);\n  const start = (page - 1) * limit;\n  res.json({ page, limit, total: ds.length, data: ds.slice(start, start + limit) });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/users/1/posts");
        if (r.status !== 200 || !r.body) return {pass:false, msg:"GET /api/users/1/posts phải trả 200."};
        if (r.body.page !== 1 || r.body.limit !== 2 || r.body.total !== 4) return {pass:false, msg:"Mặc định: page 1, limit 2, total 4 (user 1 có 4 bài)."};
        if (!Array.isArray(r.body.data) || r.body.data.map(p => p.id).join() !== "1,3") return {pass:false, msg:"Trang 1 phải gồm bài id 1, 3."};
        r = await T.request("GET", "/api/users/1/posts?page=2&limit=3");
        if (!r.body || r.body.page !== 2 || r.body.limit !== 3 || r.body.data.map(p => p.id).join() !== "5") return {pass:false, msg:"page=2&limit=3 → chỉ còn bài id 5."};
        r = await T.request("GET", "/api/users/2/posts");
        if (!r.body || r.body.total !== 1 || r.body.data[0].tieuDe !== "Học SQL") return {pass:false, msg:"User 2 có đúng 1 bài 'Học SQL'."};
        r = await T.request("GET", "/api/users/9/posts");
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy user") return {pass:false, msg:"User không tồn tại → 404 { error: 'Không tìm thấy user' }."};
        return {pass:true, msg:"URL lồng nhau + phân trang: đúng chuẩn REST mà các API lớn đang dùng."};`
    }
  ];

  P["express-middleware"] = [
    {
      title: "Middleware gắn header & thời gian", level: 1,
      requests: [{ method: "GET", url: "/api/time" }],
      task: "Viết middleware chạy cho **mọi** request:\n• Gắn header `X-App: Front-end Academy`.\n• Lưu `req.batDau = Date.now()` rồi gọi `next()`.\nRoute `GET /api/time` trả `{ batDau: req.batDau }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\n// app.use((req, res, next) => { ... });\n\napp.listen(3000);\n"),
      hint: "app.use((req, res, next) => { res.set(\"X-App\", \"Front-end Academy\"); req.batDau = Date.now(); next(); }); — nhớ đặt TRƯỚC các route.",
      solution: J("const express = require(\"express\");\nconst app = express();\n\napp.use((req, res, next) => {\n  res.set(\"X-App\", \"Front-end Academy\");\n  req.batDau = Date.now();\n  next();\n});\n\napp.get(\"/api/time\", (req, res) => res.json({ batDau: req.batDau }));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const t0 = Date.now();
        let r = await T.request("GET", "/api/time");
        if (r.headers["x-app"] !== "Front-end Academy") return {pass:false, msg:"Thiếu header X-App: Front-end Academy."};
        if (!r.body || typeof r.body.batDau !== "number" || Math.abs(r.body.batDau - t0) > 2000) return {pass:false, msg:"/api/time phải trả { batDau } là Date.now() của request."};
        r = await T.request("POST", "/api/time");
        if (r.status !== 404) return {pass:false, msg:"Chỉ tạo route GET /api/time."};
        return {pass:true, msg:"Middleware = trạm kiểm soát mà mọi request đều đi qua."};`
    },
    {
      title: "Bảo vệ bằng API key", level: 2, env: { API_KEY: "fa-secret-2026" },
      requests: [{ method: "GET", url: "/api/public" }, { method: "GET", url: "/api/private/data" }, { method: "GET", url: "/api/private/data", headers: { "x-api-key": "fa-secret-2026" }, label: "/api/private/data (có key)" }],
      task: "• `GET /api/public` → `{ data: \"Ai cũng xem được\" }`.\n• Mọi route dưới `/api/private` cần header `x-api-key` khớp `process.env.API_KEY`; sai/thiếu → **401** `{ error: \"Sai API key\" }`.\n• `GET /api/private/data` → `{ data: \"Bí mật\" }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\nfunction kiemTraKey(req, res, next) {\n  \n}\n\n\napp.listen(3000);\n"),
      hint: "if (req.get(\"x-api-key\") !== process.env.API_KEY) return res.status(401).json({ error: \"Sai API key\" }); next();\napp.use(\"/api/private\", kiemTraKey);",
      solution: J("const express = require(\"express\");\nconst app = express();\n\nfunction kiemTraKey(req, res, next) {\n  if (req.get(\"x-api-key\") !== process.env.API_KEY) {\n    return res.status(401).json({ error: \"Sai API key\" });\n  }\n  next();\n}\n\napp.get(\"/api/public\", (req, res) => res.json({ data: \"Ai cũng xem được\" }));\napp.use(\"/api/private\", kiemTraKey);\napp.get(\"/api/private/data\", (req, res) => res.json({ data: \"Bí mật\" }));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        if (/fa-secret-2026/.test(T.src)) return {pass:false, msg:"Không gõ cứng key – đọc từ process.env.API_KEY."};
        let r = await T.request("GET", "/api/public");
        if (r.status !== 200 || !r.body || r.body.data !== "Ai cũng xem được") return {pass:false, msg:"/api/public phải mở tự do."};
        r = await T.request("GET", "/api/private/data");
        if (r.status !== 401 || !r.body || r.body.error !== "Sai API key") return {pass:false, msg:"Thiếu key → 401 { error: 'Sai API key' }."};
        r = await T.request("GET", "/api/private/data", { headers: { "x-api-key": "sai" } });
        if (r.status !== 401) return {pass:false, msg:"Sai key → 401."};
        r = await T.request("GET", "/api/private/data", { headers: { "x-api-key": "fa-secret-2026" } });
        if (r.status !== 200 || !r.body || r.body.data !== "Bí mật") return {pass:false, msg:"Đúng key → 200 { data: 'Bí mật' }."};
        return {pass:true, msg:"API key là cách bảo vệ đơn giản cho API giữa các server."};`
    },
    {
      title: "Middleware phân quyền có tham số", level: 3,
      requests: [{ method: "GET", url: "/api/posts", headers: { "x-role": "user" }, label: "/api/posts (user)" }, { method: "DELETE", url: "/api/posts/1", headers: { "x-role": "user" }, label: "/api/posts/1 (user)" }, { method: "DELETE", url: "/api/posts/1", headers: { "x-role": "admin" }, label: "/api/posts/1 (admin)" }],
      task: "Viết **hàm tạo middleware** `chiCho(...vaiTro)` đọc header `x-role`:\n• Không có header → **401** `{ error: \"Chưa đăng nhập\" }`.\n• Vai trò không nằm trong danh sách → **403** `{ error: \"Không có quyền\" }`.\nÁp dụng: `GET /api/posts` cho `user`, `admin` → `[]`; `DELETE /api/posts/:id` chỉ `admin` → **204**.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\nfunction chiCho(...vaiTro) {\n  return (req, res, next) => {\n    \n  };\n}\n\n\napp.listen(3000);\n"),
      hint: "const role = req.get(\"x-role\"); if (!role) return res.status(401)...; if (!vaiTro.includes(role)) return res.status(403)...; next();\napp.delete(\"/api/posts/:id\", chiCho(\"admin\"), (req, res) => res.sendStatus(204));",
      solution: J("const express = require(\"express\");\nconst app = express();\n\nfunction chiCho(...vaiTro) {\n  return (req, res, next) => {\n    const role = req.get(\"x-role\");\n    if (!role) return res.status(401).json({ error: \"Chưa đăng nhập\" });\n    if (!vaiTro.includes(role)) return res.status(403).json({ error: \"Không có quyền\" });\n    next();\n  };\n}\n\napp.get(\"/api/posts\", chiCho(\"user\", \"admin\"), (req, res) => res.json([]));\napp.delete(\"/api/posts/:id\", chiCho(\"admin\"), (req, res) => res.sendStatus(204));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const q = (m, u, role) => T.request(m, u, role ? { headers: { "x-role": role } } : {});
        let r = await q("GET", "/api/posts");
        if (r.status !== 401 || !r.body || r.body.error !== "Chưa đăng nhập") return {pass:false, msg:"Không có x-role → 401 { error: 'Chưa đăng nhập' }."};
        for (const role of ["user", "admin"]) { r = await q("GET", "/api/posts", role); if (r.status !== 200) return {pass:false, msg:"GET /api/posts với role " + role + " phải 200."}; }
        r = await q("GET", "/api/posts", "guest");
        if (r.status !== 403 || !r.body || r.body.error !== "Không có quyền") return {pass:false, msg:"Role guest → 403 { error: 'Không có quyền' }."};
        r = await q("DELETE", "/api/posts/1", "user");
        if (r.status !== 403) return {pass:false, msg:"user xoá bài → 403."};
        r = await q("DELETE", "/api/posts/1", "admin");
        if (r.status !== 204) return {pass:false, msg:"admin xoá bài → 204 (đang " + r.status + ")."};
        if (typeof chiCho("x") !== "function") return {pass:false, msg:"chiCho(...) phải trả về một middleware."};
        return {pass:true, msg:"Hàm trả về middleware (higher-order) – mẫu thiết kế rất hay gặp trong Express."};`
    }
  ];

  P["rest-crud"] = [
    {
      title: "Đọc danh sách & lọc", level: 2,
      requests: [{ method: "GET", url: "/api/books" }, { method: "GET", url: "/api/books?author=Nguyễn Nhật Ánh" }, { method: "GET", url: "/api/books/2" }, { method: "GET", url: "/api/books/99" }],
      task: "Với mảng `books` có sẵn:\n• `GET /api/books` → 200 mảng; hỗ trợ lọc `?author=` (so khớp chính xác).\n• `GET /api/books/:id` → 200 sách | **404** `{ error: \"Không tìm thấy\" }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\nconst books = [\n  { id: 1, title: \"Mắt biếc\", author: \"Nguyễn Nhật Ánh\" },\n  { id: 2, title: \"Dế Mèn phiêu lưu ký\", author: \"Tô Hoài\" },\n  { id: 3, title: \"Cho tôi xin một vé đi tuổi thơ\", author: \"Nguyễn Nhật Ánh\" }\n];\n\n\napp.listen(3000);\n"),
      hint: "const { author } = req.query; res.json(author ? books.filter(b => b.author === author) : books);",
      solution: J("const express = require(\"express\");\nconst app = express();\n\nconst books = [\n  { id: 1, title: \"Mắt biếc\", author: \"Nguyễn Nhật Ánh\" },\n  { id: 2, title: \"Dế Mèn phiêu lưu ký\", author: \"Tô Hoài\" },\n  { id: 3, title: \"Cho tôi xin một vé đi tuổi thơ\", author: \"Nguyễn Nhật Ánh\" }\n];\n\napp.get(\"/api/books\", (req, res) => {\n  const { author } = req.query;\n  res.json(author ? books.filter(b => b.author === author) : books);\n});\n\napp.get(\"/api/books/:id\", (req, res) => {\n  const book = books.find(b => b.id === Number(req.params.id));\n  if (!book) return res.status(404).json({ error: \"Không tìm thấy\" });\n  res.json(book);\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/books");
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.length !== 3) return {pass:false, msg:"GET /api/books → mảng 3 sách."};
        r = await T.request("GET", "/api/books?author=" + encodeURIComponent("Nguyễn Nhật Ánh"));
        if (!Array.isArray(r.body) || r.body.map(b => b.id).join() !== "1,3") return {pass:false, msg:"?author=Nguyễn Nhật Ánh → sách id 1, 3."};
        r = await T.request("GET", "/api/books?author=Ai");
        if (!Array.isArray(r.body) || r.body.length !== 0) return {pass:false, msg:"Tác giả không có sách → mảng rỗng []."};
        r = await T.request("GET", "/api/books/2");
        if (r.status !== 200 || !r.body || r.body.title !== "Dế Mèn phiêu lưu ký") return {pass:false, msg:"GET /api/books/2 → sách 'Dế Mèn phiêu lưu ký'."};
        r = await T.request("GET", "/api/books/99");
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy") return {pass:false, msg:"Không có sách → 404 { error: 'Không tìm thấy' }."};
        return {pass:true, msg:"Lọc bằng query string – không cần tạo thêm route mới."};`
    },
    {
      title: "Thay thế toàn bộ với PUT", level: 3,
      requests: [{ method: "PUT", url: "/api/books/1", body: { title: "Mắt biếc (tái bản)", author: "Nguyễn Nhật Ánh" } }, { method: "PUT", url: "/api/books/1", body: { title: "Thiếu tác giả" }, label: "/api/books/1 (thiếu author)" }],
      task: "`PUT /api/books/:id` **thay thế toàn bộ** sách (giữ nguyên `id`) bằng `{ title, author }` từ body:\n• Thiếu `title` hoặc `author` → **400** `{ error: \"Cần title và author\" }`.\n• Không tìm thấy → **404**.\n• Thành công → 200 sách mới. Các trường cũ không gửi lên (vd `year`) phải **mất đi**.",
      starter: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nlet books = [\n  { id: 1, title: \"Mắt biếc\", author: \"Nguyễn Nhật Ánh\", year: 1990 },\n  { id: 2, title: \"Dế Mèn phiêu lưu ký\", author: \"Tô Hoài\", year: 1941 }\n];\n\n\napp.get(\"/api/books/:id\", (req, res) => {\n  const b = books.find(x => x.id === Number(req.params.id));\n  b ? res.json(b) : res.status(404).json({ error: \"Không tìm thấy\" });\n});\n\napp.listen(3000);\n"),
      hint: "const i = books.findIndex(...); books[i] = { id: books[i].id, title, author }; — tạo object MỚI thay vì Object.assign.",
      solution: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nlet books = [\n  { id: 1, title: \"Mắt biếc\", author: \"Nguyễn Nhật Ánh\", year: 1990 },\n  { id: 2, title: \"Dế Mèn phiêu lưu ký\", author: \"Tô Hoài\", year: 1941 }\n];\n\napp.put(\"/api/books/:id\", (req, res) => {\n  const { title, author } = req.body;\n  if (!title || !author) return res.status(400).json({ error: \"Cần title và author\" });\n  const i = books.findIndex(b => b.id === Number(req.params.id));\n  if (i === -1) return res.status(404).json({ error: \"Không tìm thấy\" });\n  books[i] = { id: books[i].id, title, author };\n  res.json(books[i]);\n});\n\napp.get(\"/api/books/:id\", (req, res) => {\n  const b = books.find(x => x.id === Number(req.params.id));\n  b ? res.json(b) : res.status(404).json({ error: \"Không tìm thấy\" });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("PUT", "/api/books/1", { body: { title: "Mắt biếc (tái bản)", author: "Nguyễn Nhật Ánh" } });
        if (r.status !== 200 || !r.body || r.body.id !== 1 || r.body.title !== "Mắt biếc (tái bản)") return {pass:false, msg:"PUT hợp lệ phải trả 200 sách mới (id giữ nguyên 1)."};
        if ("year" in r.body) return {pass:false, msg:"PUT thay thế TOÀN BỘ – trường year cũ phải mất (khác PATCH)."};
        r = await T.request("GET", "/api/books/1");
        if (!r.body || r.body.title !== "Mắt biếc (tái bản)" || "year" in r.body) return {pass:false, msg:"Dữ liệu lưu trong mảng phải được thay thế."};
        r = await T.request("PUT", "/api/books/2", { body: { title: "Chỉ có title" } });
        if (r.status !== 400 || !r.body || r.body.error !== "Cần title và author") return {pass:false, msg:"Thiếu author → 400 { error: 'Cần title và author' }."};
        r = await T.request("GET", "/api/books/2");
        if (r.body.title !== "Dế Mèn phiêu lưu ký") return {pass:false, msg:"Request lỗi 400 không được làm thay đổi dữ liệu."};
        r = await T.request("PUT", "/api/books/99", { body: { title: "A", author: "B" } });
        if (r.status !== 404) return {pass:false, msg:"PUT id không tồn tại → 404."};
        return {pass:true, msg:"Giờ bạn đã phân biệt rõ PUT (thay thế) và PATCH (sửa một phần)."};`
    },
    {
      title: "Tài nguyên con: bình luận của bài viết", level: 4,
      requests: [{ method: "GET", url: "/api/posts/1/comments" }, { method: "POST", url: "/api/posts/1/comments", body: { noiDung: "Bài hay quá!" } }, { method: "POST", url: "/api/posts/9/comments", body: { noiDung: "?" } }],
      task: "• `GET /api/posts/:postId/comments` → 200 mảng bình luận của bài đó.\n• `POST /api/posts/:postId/comments` body `{ noiDung }` → **201** `{ id, postId, noiDung }` (id tự tăng **toàn hệ thống**, `postId` là số).\n• `noiDung` rỗng/thiếu → **400**. Bài viết không tồn tại → **404** `{ error: \"Không tìm thấy bài viết\" }` (cả GET và POST).",
      starter: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst posts = [{ id: 1, tieuDe: \"Học REST\" }, { id: 2, tieuDe: \"Học SQL\" }];\nconst comments = [{ id: 1, postId: 2, noiDung: \"SQL khó quá\" }];\nlet nextId = 2;\n\n\napp.listen(3000);\n"),
      hint: "Viết middleware timBai(req, res, next) gắn req.post rồi dùng cho cả 2 route: app.get(\"/api/posts/:postId/comments\", timBai, ...).",
      solution: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst posts = [{ id: 1, tieuDe: \"Học REST\" }, { id: 2, tieuDe: \"Học SQL\" }];\nconst comments = [{ id: 1, postId: 2, noiDung: \"SQL khó quá\" }];\nlet nextId = 2;\n\nfunction timBai(req, res, next) {\n  req.post = posts.find(p => p.id === Number(req.params.postId));\n  if (!req.post) return res.status(404).json({ error: \"Không tìm thấy bài viết\" });\n  next();\n}\n\napp.get(\"/api/posts/:postId/comments\", timBai, (req, res) => {\n  res.json(comments.filter(c => c.postId === req.post.id));\n});\n\napp.post(\"/api/posts/:postId/comments\", timBai, (req, res) => {\n  const noiDung = String(req.body.noiDung || \"\").trim();\n  if (!noiDung) return res.status(400).json({ error: \"Thiếu nội dung\" });\n  const c = { id: nextId++, postId: req.post.id, noiDung };\n  comments.push(c);\n  res.status(201).json(c);\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/posts/1/comments");
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.length !== 0) return {pass:false, msg:"Bài 1 ban đầu chưa có bình luận → []."};
        r = await T.request("POST", "/api/posts/1/comments", { body: { noiDung: "Bài hay quá!" } });
        if (r.status !== 201 || !r.body || r.body.id !== 2 || r.body.postId !== 1 || r.body.noiDung !== "Bài hay quá!") return {pass:false, msg:"POST hợp lệ → 201 { id: 2, postId: 1, noiDung } (id tự tăng toàn hệ thống, postId là số)."};
        r = await T.request("POST", "/api/posts/2/comments", { body: { noiDung: "Cố lên" } });
        if (!r.body || r.body.id !== 3) return {pass:false, msg:"Bình luận tiếp theo (dù khác bài) phải có id 3."};
        r = await T.request("GET", "/api/posts/2/comments");
        if (!Array.isArray(r.body) || r.body.map(c => c.id).join() !== "1,3") return {pass:false, msg:"Bài 2 phải có bình luận id 1, 3."};
        r = await T.request("POST", "/api/posts/1/comments", { body: { noiDung: "  " } });
        if (r.status !== 400) return {pass:false, msg:"noiDung rỗng → 400."};
        for (const m of ["GET", "POST"]) { r = await T.request(m, "/api/posts/9/comments", { body: { noiDung: "x" } }); if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy bài viết") return {pass:false, msg:m + " bài không tồn tại → 404 { error: 'Không tìm thấy bài viết' }."}; }
        return {pass:true, msg:"Middleware dùng chung (timBai) giúp không lặp code kiểm tra – DRY!"};`
    }
  ];

  P["validation-errors"] = [
    {
      title: "Gom mọi lỗi validate", level: 2,
      requests: [{ method: "POST", url: "/api/products", body: { name: "Bàn phím", price: 890000 } }, { method: "POST", url: "/api/products", body: { name: "AB", price: -5 }, label: "/api/products (sai 2 trường)" }],
      task: "`POST /api/products` kiểm tra **tất cả** lỗi rồi trả một lần:\n• `name`: chuỗi, **≥ 3** ký tự (sau trim) → lỗi `\"name phải có ít nhất 3 ký tự\"`.\n• `price`: **số > 0** → lỗi `\"price phải là số dương\"`.\nCó lỗi → **400** `{ errors: [...] }` (đúng thứ tự trên). Hợp lệ → **201** `{ id, name, price }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst products = [];\nlet nextId = 1;\n\n\napp.listen(3000);\n"),
      hint: "const errors = []; if (typeof name !== \"string\" || name.trim().length < 3) errors.push(...); if (typeof price !== \"number\" || !(price > 0)) errors.push(...);",
      solution: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst products = [];\nlet nextId = 1;\n\nfunction kiemTra({ name, price }) {\n  const errors = [];\n  if (typeof name !== \"string\" || name.trim().length < 3) errors.push(\"name phải có ít nhất 3 ký tự\");\n  if (typeof price !== \"number\" || !(price > 0)) errors.push(\"price phải là số dương\");\n  return errors;\n}\n\napp.post(\"/api/products\", (req, res) => {\n  const errors = kiemTra(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  const p = { id: nextId++, name: req.body.name.trim(), price: req.body.price };\n  products.push(p);\n  res.status(201).json(p);\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const post = b => T.request("POST", "/api/products", { body: b });
        let r = await post({ name: "Bàn phím", price: 890000 });
        if (r.status !== 201 || !r.body || r.body.id !== 1 || r.body.name !== "Bàn phím") return {pass:false, msg:"Dữ liệu hợp lệ → 201 { id: 1, name, price }."};
        r = await post({ name: "AB", price: -5 });
        if (r.status !== 400 || !r.body || JSON.stringify(r.body.errors) !== JSON.stringify(["name phải có ít nhất 3 ký tự", "price phải là số dương"])) return {pass:false, msg:"Sai cả 2 trường → 400 với errors chứa CẢ 2 lỗi theo thứ tự. Đang: " + r.text};
        r = await post({ name: "Chuột", price: "100" });
        if (r.status !== 400 || JSON.stringify(r.body.errors) !== '["price phải là số dương"]') return {pass:false, msg:"price là chuỗi \"100\" vẫn sai (phải kiểu number)."};
        r = await post({ name: "   Ổ   ", price: 10 });
        if (r.status !== 400) return {pass:false, msg:"name chỉ có 1 ký tự sau trim → 400."};
        r = await post({});
        if (r.status !== 400 || r.body.errors.length !== 2) return {pass:false, msg:"Body rỗng → 400 với 2 lỗi."};
        return {pass:true, msg:"Trả hết lỗi một lần → người dùng sửa form một lượt, không phải gửi đi gửi lại."};`
    },
    {
      title: "Bắt lỗi async tập trung", level: 3,
      requests: [{ method: "GET", url: "/api/users/1" }, { method: "GET", url: "/api/users/9" }, { method: "GET", url: "/api/users/1?fail=1", label: "/api/users/1?fail=1 (DB lỗi)" }],
      task: "Hàm `layUserTuDB(id, fail)` (giả lập database) đã có. Hoàn thiện:\n• `GET /api/users/:id` là **async**: không tìm thấy → `throw new AppError(404, \"Không tìm thấy user\")`.\n• Middleware lỗi (4 tham số, đặt cuối): lỗi có `status` → trả `status` + `{ error: message }`; lỗi khác → **500** `{ error: \"Lỗi máy chủ\" }` và **không lộ** thông điệp gốc.",
      starter: J("const express = require(\"express\");\nconst app = express();\n\nclass AppError extends Error {\n  constructor(status, message) { super(message); this.status = status; }\n}\n\nasync function layUserTuDB(id, fail) {\n  await new Promise(r => setTimeout(r, 10));\n  if (fail) throw new Error(\"ECONNREFUSED: mất kết nối tới database 10.0.0.5\");\n  return [{ id: 1, ten: \"Quảng\" }].find(u => u.id === id);\n}\n\napp.get(\"/api/users/:id\", async (req, res) => {\n  const user = await layUserTuDB(Number(req.params.id), req.query.fail);\n  \n});\n\n// middleware lỗi\n\napp.listen(3000);\n"),
      hint: "Express 5 tự chuyển lỗi của hàm async sang middleware lỗi. app.use((err, req, res, next) => { if (err.status) return res.status(err.status).json({ error: err.message }); console.error(err); res.status(500).json({ error: \"Lỗi máy chủ\" }); });",
      solution: J("const express = require(\"express\");\nconst app = express();\n\nclass AppError extends Error {\n  constructor(status, message) { super(message); this.status = status; }\n}\n\nasync function layUserTuDB(id, fail) {\n  await new Promise(r => setTimeout(r, 10));\n  if (fail) throw new Error(\"ECONNREFUSED: mất kết nối tới database 10.0.0.5\");\n  return [{ id: 1, ten: \"Quảng\" }].find(u => u.id === id);\n}\n\napp.get(\"/api/users/:id\", async (req, res) => {\n  const user = await layUserTuDB(Number(req.params.id), req.query.fail);\n  if (!user) throw new AppError(404, \"Không tìm thấy user\");\n  res.json(user);\n});\n\napp.use((err, req, res, next) => {\n  if (err.status) return res.status(err.status).json({ error: err.message });\n  console.error(\"Lỗi:\", err.message);\n  res.status(500).json({ error: \"Lỗi máy chủ\" });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/users/1");
        if (r.status !== 200 || !r.body || r.body.ten !== "Quảng") return {pass:false, msg:"GET /api/users/1 → 200 user Quảng."};
        r = await T.request("GET", "/api/users/9");
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy user") return {pass:false, msg:"User 9 → 404 { error: 'Không tìm thấy user' } (đang " + r.status + " " + r.text + ")."};
        r = await T.request("GET", "/api/users/1?fail=1");
        if (r.status !== 500 || !r.body || r.body.error !== "Lỗi máy chủ") return {pass:false, msg:"DB lỗi → 500 { error: 'Lỗi máy chủ' } (dạng JSON)."};
        if (/ECONNREFUSED|10\.0\.0\.5/.test(r.text)) return {pass:false, msg:"Không được lộ thông điệp lỗi gốc (IP database!) ra ngoài."};
        return {pass:true, msg:"Một nơi xử lý lỗi duy nhất – code route gọn, lỗi không bao giờ lọt ra ngoài."};`
    },
    {
      title: "Body JSON sai định dạng", level: 3,
      requests: [{ method: "POST", url: "/api/notes", body: { text: "Học Express" } }, { method: "POST", url: "/api/notes", body: "{ text: thiếu ngoặc kép", headers: { "content-type": "application/json" }, label: "/api/notes (JSON hỏng)" }],
      task: "Client gửi JSON hỏng thì `express.json()` ném lỗi `SyntaxError` với `err.type === \"entity.parse.failed\"`. Viết middleware lỗi:\n• Lỗi parse JSON → **400** `{ error: \"JSON không hợp lệ\" }`.\n• Lỗi khác → **500** `{ error: \"Lỗi máy chủ\" }`.\n`POST /api/notes` body `{ text }` → **201** `{ text }`.",
      starter: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\napp.post(\"/api/notes\", (req, res) => {\n  res.status(201).json({ text: req.body.text });\n});\n\n// middleware lỗi\n\napp.listen(3000);\n"),
      hint: "app.use((err, req, res, next) => { if (err.type === \"entity.parse.failed\") return res.status(400).json({ error: \"JSON không hợp lệ\" }); res.status(500).json({ error: \"Lỗi máy chủ\" }); });",
      solution: J("const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\napp.post(\"/api/notes\", (req, res) => {\n  res.status(201).json({ text: req.body.text });\n});\n\napp.use((err, req, res, next) => {\n  if (err.type === \"entity.parse.failed\") {\n    return res.status(400).json({ error: \"JSON không hợp lệ\" });\n  }\n  res.status(500).json({ error: \"Lỗi máy chủ\" });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("POST", "/api/notes", { body: { text: "Học Express" } });
        if (r.status !== 201 || !r.body || r.body.text !== "Học Express") return {pass:false, msg:"JSON hợp lệ → 201 { text }."};
        r = await T.request("POST", "/api/notes", { body: "{ text: thiếu ngoặc kép", headers: { "content-type": "application/json" } });
        if (r.status !== 400 || !r.body || r.body.error !== "JSON không hợp lệ") return {pass:false, msg:"JSON hỏng → 400 { error: 'JSON không hợp lệ' } dạng JSON (đang " + r.status + " " + r.text + ")."};
        return {pass:true, msg:"Mặc định Express trả về trang HTML lỗi – API chuyên nghiệp luôn trả JSON."};`
    }
  ];
})();
