/* =========================================================
   KHOÁ BACK-END NODE.JS – phần 1: Nền tảng + Express & REST API
   Bài có runtime: "node" chạy trên Node mô phỏng (node-runtime.js):
   - env: biến môi trường (process.env)      - files: file có sẵn trong fs
   - requests: yêu cầu mẫu hiện trên API Tester
   - check có thêm: T.request(method, url, {body, headers}) → {status, headers, body, text}
                    T.server(), T.file(path), T.db(), T.exports(), T.src
   ========================================================= */
LEVELS.push(
  { id: "be-basics", course: "be-node", name: "Nền tảng Back-end", icon: "🌐", color: "#65a30d", desc: "Web hoạt động thế nào, HTTP, Node.js, module, npm và file system bất đồng bộ." },
  { id: "be-express", course: "be-node", name: "Express & REST API", icon: "🚂", color: "#16a34a", desc: "Server HTTP, Express, route, middleware, REST CRUD, validation và xử lý lỗi." },
  { id: "be-db", course: "be-node", name: "Cơ sở dữ liệu SQL", icon: "🗄️", color: "#0891b2", desc: "SQL từ cơ bản đến JOIN, phân trang, và nối API với database." },
  { id: "be-auth", course: "be-node", name: "Bảo mật & xác thực", icon: "🔐", color: "#dc2626", desc: "Băm mật khẩu bcrypt, đăng nhập JWT, phân quyền, chống SQL injection, CORS, rate limit." },
  { id: "be-deploy", course: "be-node", name: "Triển khai & dự án", icon: "🚀", color: "#7c3aed", desc: "Biến môi trường, cấu trúc dự án, deploy lên cloud và dự án cuối Blog API." }
);

LESSONS.push(
  /* ===================== CẤP 1: NỀN TẢNG ===================== */
  {
    id: "web-how-it-works", level: "be-basics", icon: "🌍", title: "Web hoạt động thế nào? Client, Server & HTTP", duration: 18,
    summary: "Mọi trang web là cuộc trò chuyện giữa client (trình duyệt/app) và server qua giao thức HTTP: request đi, response về.",
    content: [
      { h: "Front-end và Back-end" },
      { p: "**Front-end** là phần chạy trên máy người dùng (HTML, CSS, JS trong trình duyệt). **Back-end** chạy trên **server**: nhận yêu cầu, xử lý logic, đọc/ghi **cơ sở dữ liệu**, rồi trả kết quả. Ví dụ đăng nhập: front-end gửi email + mật khẩu → back-end kiểm tra trong database → trả về \"thành công\" hoặc \"sai mật khẩu\"." },
      { h: "Một vòng request – response" },
      { code: "Client (trình duyệt)                          Server (Node.js)\n   |  ── GET /api/products?page=2 ───────────▶   |\n   |      Headers: Accept: application/json      |  đọc database…\n   |  ◀──────────── 200 OK ──────────────────    |\n   |      Content-Type: application/json         |\n   |      [{\"id\":1,\"ten\":\"Bút\"}, ...]           |", lang: "http" },
      { h: "Thành phần của một HTTP request" },
      { list: [
        "**Method** – hành động: `GET` (lấy), `POST` (tạo), `PUT`/`PATCH` (sửa), `DELETE` (xoá).",
        "**URL** – địa chỉ tài nguyên: `/api/products/5`; phần sau dấu `?` là **query string** (`?page=2&q=but`).",
        "**Headers** – thông tin kèm theo: `Content-Type`, `Authorization`, `Cookie`…",
        "**Body** – dữ liệu gửi lên (thường là JSON) với POST/PUT/PATCH."
      ] },
      { h: "Mã trạng thái (status code)" },
      { list: [
        "**2xx thành công**: `200 OK`, `201 Created` (đã tạo), `204 No Content` (thành công, không có body).",
        "**3xx chuyển hướng**: `301`, `302`.",
        "**4xx lỗi phía client**: `400` dữ liệu sai, `401` chưa đăng nhập, `403` không có quyền, `404` không tìm thấy, `409` xung đột (trùng), `429` gửi quá nhiều.",
        "**5xx lỗi phía server**: `500` lỗi không mong muốn, `503` server quá tải."
      ] },
      { h: "JSON và REST API" },
      { p: "**API** là \"cửa giao tiếp\" của back-end. Kiểu phổ biến nhất là **REST**: URL đại diện *tài nguyên* (danh từ: `/users`, `/orders`), method thể hiện *hành động*. Dữ liệu trao đổi bằng **JSON**." },
      { tip: "Mở DevTools → tab **Network** trên bất kỳ website nào để xem hàng trăm request/response thật. Ở khoá này bạn sẽ tự viết server và gửi request bằng **API Tester** ngay trong app." }
    ],
    example: { html: "", css: "", js: "" },
    exercise: {
      type: "quiz",
      task: "Trả lời 5 câu hỏi về HTTP và mô hình client – server.",
      hint: "GET lấy, POST tạo. 2xx thành công, 4xx lỗi do client, 5xx lỗi do server. 401 = chưa đăng nhập, 403 = có đăng nhập nhưng không đủ quyền.",
      questions: [
        { q: "Front-end muốn **tạo** một đơn hàng mới. Request phù hợp nhất là?", options: ["`GET /api/orders`", "`POST /api/orders` kèm body JSON", "`DELETE /api/orders`", "`GET /api/createOrder?ten=...`"], answer: 1, explain: "Tạo tài nguyên mới → POST vào tập hợp `/orders`, dữ liệu nằm trong body." },
        { q: "Server tạo thành công một người dùng mới. Mã trạng thái chuẩn nhất?", options: ["200", "201", "204", "302"], answer: 1, explain: "`201 Created` báo đã tạo tài nguyên; thường trả kèm object vừa tạo." },
        { q: "Người dùng đã đăng nhập nhưng cố vào trang quản trị dành cho admin. Server nên trả?", options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Internal Server Error"], answer: 1, explain: "401 = chưa xác thực (chưa đăng nhập / token sai). 403 = đã biết bạn là ai nhưng không đủ quyền." },
        { q: "Trong URL `/api/products?page=2&q=ban`, phần `page=2&q=ban` gọi là?", options: ["Route params", "Query string", "Header", "Body"], answer: 1, explain: "Query string nằm sau `?`, dùng cho lọc, tìm kiếm, phân trang." },
        { q: "Code back-end bị lỗi chia cho undefined khiến server không xử lý được. Client nhận mã nào?", options: ["400", "404", "500", "201"], answer: 2, explain: "Lỗi do phía server → 5xx. Không đổ lỗi cho client bằng 4xx khi lỗi nằm ở code của bạn." }
      ]
    }
  },
  {
    id: "node-intro", level: "be-basics", icon: "🟩", title: "Node.js: chạy JavaScript trên server", duration: 18, runtime: "node",
    env: { APP_NAME: "Front-end Academy" },
    summary: "Node.js cho phép chạy JavaScript ngoài trình duyệt – trên server, máy tính của bạn hay trong công cụ tự động hoá.",
    content: [
      { h: "Node.js là gì?" },
      { p: "**Node.js** là môi trường chạy JavaScript dựa trên engine **V8** của Chrome, nhưng chạy *ngoài trình duyệt*. Nhờ đó bạn dùng **một ngôn ngữ** cho cả front-end lẫn back-end. Node đặc biệt mạnh ở các ứng dụng nhiều I/O: API, chat realtime, công cụ dòng lệnh." },
      { list: [
        "Trong Node **không có** `document`, `window`, `alert` (không có trang web để vẽ).",
        "Bù lại có `process` (thông tin tiến trình), `require` (nạp module), truy cập file, mạng, hệ điều hành.",
        "Cài tại **nodejs.org** (chọn bản LTS). Kiểm tra: `node -v`, `npm -v`."
      ] },
      { code: "# Tạo file app.js rồi chạy:\nnode app.js\n\n# Truyền biến môi trường khi chạy (macOS/Linux):\nAPP_NAME=\"Shop\" node app.js\n# Windows PowerShell:\n$env:APP_NAME=\"Shop\"; node app.js", lang: "bash" },
      { h: "Đối tượng process" },
      { code: "console.log(process.version);        // phiên bản Node, vd v22.11.0\nconsole.log(process.platform);       // 'linux', 'win32', 'darwin'\nconsole.log(process.env.APP_NAME);   // đọc biến môi trường\nconsole.log(process.argv);           // tham số dòng lệnh\nconsole.log(process.cwd());          // thư mục đang chạy" },
      { h: "module.exports – chia sẻ code" },
      { p: "Mỗi file trong Node là một **module** riêng. Muốn file khác dùng được hàm của bạn, gán vào `module.exports` (kiểu CommonJS – phổ biến nhất trong Node):" },
      { code: "// tinh-toan.js\nfunction tinhTuoi(namSinh) {\n  return new Date().getFullYear() - namSinh;\n}\nmodule.exports = { tinhTuoi };\n\n// app.js\nconst { tinhTuoi } = require('./tinh-toan');\nconsole.log(tinhTuoi(2003));" },
      { tip: "Trong app, khung bên phải là **Node.js mô phỏng**: tab `server.js` là file của bạn, **Terminal** hiển thị `console.log`. Biến môi trường `APP_NAME` đã được đặt sẵn cho bài này." }
    ],
    example: { js: "console.log('👋 Xin chào từ Node.js!');\nconsole.log('Phiên bản:', process.version);\nconsole.log('Hệ điều hành:', process.platform);\nconsole.log('Biến môi trường APP_NAME =', process.env.APP_NAME);\nconsole.log('Thư mục làm việc:', process.cwd());\n\nconst tong = [1, 2, 3, 4].reduce((a, b) => a + b, 0);\nconsole.log('Tổng =', tong);\n" },
    exercise: {
      task: "Trong `server.js`:\n1) In ra dòng `Ứng dụng: <tên>` với tên lấy từ `process.env.APP_NAME` (nếu không có thì dùng `\"Không tên\"`).\n2) In ra dòng `Node <phiên bản>` dùng `process.version`.\n3) Viết hàm `tinhTuoi(namSinh)` (năm hiện tại trừ năm sinh) và xuất ra bằng `module.exports = { tinhTuoi }`.",
      starter: { js: "// 1) In tên ứng dụng từ biến môi trường\n\n// 2) In phiên bản Node\n\n// 3) Hàm tinhTuoi + module.exports\n" },
      hint: "console.log('Ứng dụng: ' + (process.env.APP_NAME || 'Không tên')); console.log('Node ' + process.version); module.exports = { tinhTuoi };",
      solution: { js: "const tenApp = process.env.APP_NAME || 'Không tên';\nconsole.log('Ứng dụng: ' + tenApp);\nconsole.log('Node ' + process.version);\n\nfunction tinhTuoi(namSinh) {\n  return new Date().getFullYear() - namSinh;\n}\n\nmodule.exports = { tinhTuoi };\n" },
      check: `
        if (!T.logs.some(l => l.trim() === "Ứng dụng: Front-end Academy")) return {pass:false, msg:"Chưa thấy dòng \\"Ứng dụng: Front-end Academy\\" trong Terminal – đọc từ process.env.APP_NAME."};
        if (!/process\\.env\\.APP_NAME/.test(T.src)) return {pass:false, msg:"Hãy lấy tên từ process.env.APP_NAME (không gõ cứng)."};
        if (!T.logs.some(l => l.includes("Node") && l.includes(process.version))) return {pass:false, msg:"Chưa in \\"Node " + process.version + "\\" – dùng process.version."};
        const ex = T.exports();
        if (!ex || typeof ex.tinhTuoi !== "function") return {pass:false, msg:"Cần module.exports = { tinhTuoi }."};
        const y = new Date().getFullYear();
        if (ex.tinhTuoi(2000) !== y - 2000) return {pass:false, msg:"tinhTuoi(2000) phải bằng " + (y - 2000) + "."};
        return {pass:true, msg:"Chương trình Node.js đầu tiên chạy ngon lành! 🟩"};`
    }
  },
  {
    id: "node-modules", level: "be-basics", icon: "📚", title: "Module, npm và package.json", duration: 18, runtime: "node",
    summary: "Dùng module có sẵn của Node (path, os, fs…), tự tạo module, cài thư viện bằng npm và hiểu package.json.",
    content: [
      { h: "3 loại module" },
      { list: [
        "**Core module** – có sẵn trong Node: `fs`, `path`, `http`, `os`, `crypto`, `events`…",
        "**Module của bạn** – file trong dự án: `require('./utils')`.",
        "**Package từ npm** – cài bằng `npm install express`, dùng `require('express')`."
      ] },
      { h: "Module path – xử lý đường dẫn đúng chuẩn" },
      { code: "const path = require('path');\npath.join(__dirname, 'data', 'users.json');  // '/app/data/users.json'\npath.extname('anh.png');                     // '.png'\npath.basename('/a/b/bao-cao.pdf');           // 'bao-cao.pdf'\n// __dirname = thư mục chứa file đang chạy" },
      { warn: "Đừng nối đường dẫn bằng tay kiểu `__dirname + '/data/' + ten` – Windows dùng `\\` còn Linux dùng `/`. `path.join` tự xử lý cho mọi hệ điều hành." },
      { h: "CommonJS và ES Modules" },
      { code: "// CommonJS (mặc định trong Node, rất phổ biến)\nconst express = require('express');\nmodule.exports = { cong };\n\n// ES Modules (cần \"type\": \"module\" trong package.json hoặc file .mjs)\nimport express from 'express';\nexport function cong(a, b) { return a + b; }" },
      { h: "package.json và npm scripts" },
      { code: "{\n  \"name\": \"api-ban-hang\",\n  \"version\": \"1.0.0\",\n  \"main\": \"server.js\",\n  \"scripts\": {\n    \"start\": \"node server.js\",\n    \"dev\": \"node --watch server.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^5.1.0\"\n  }\n}", lang: "json" },
      { code: "npm init -y            # tạo package.json\nnpm install express    # cài thư viện → node_modules/ + package-lock.json\nnpm run dev            # chạy server, tự khởi động lại khi sửa code\nnpm start              # chạy bản chính thức", lang: "bash" },
      { tip: "`node --watch` (Node 18.11+) tự chạy lại khi file thay đổi – trước đây phải cài thêm `nodemon`. Trong app, ô **Tự chạy** làm việc tương tự." }
    ],
    example: { js: "const path = require('path');\nconst os = require('os');\n\nconsole.log('File đang chạy:', __filename);\nconsole.log('Đường dẫn data:', path.join(__dirname, 'data', 'users.json'));\nconsole.log('Phần mở rộng:', path.extname('bao-cao.xlsx'));\nconsole.log('Số CPU:', os.cpus().length, '| RAM:', (os.totalmem() / 1024 ** 3) + ' GB');\n\nconst utils = {\n  viHoa: s => s.toUpperCase(),\n  dem: s => s.length\n};\nmodule.exports = utils;\nconsole.log('Đã export:', Object.keys(module.exports));\n" },
    exercise: {
      task: "1) Tạo object `mathUtils` gồm 3 hàm: `cong(a, b)`, `tru(a, b)`, `trungBinh(mang)` (mảng rỗng trả về `0`). Xuất ra bằng `module.exports = mathUtils`.\n2) Dùng core module `path` để tạo đường dẫn tới file `data/users.json` nằm trong `__dirname`, rồi `console.log` đường dẫn đó.",
      starter: { js: "const path = require('path');\n\nconst mathUtils = {\n  \n};\n\n// module.exports = ...\n\n// In đường dẫn tới data/users.json\n" },
      hint: "trungBinh: mang.length ? mang.reduce((t, x) => t + x, 0) / mang.length : 0 — đường dẫn: path.join(__dirname, 'data', 'users.json').",
      solution: { js: "const path = require('path');\n\nconst mathUtils = {\n  cong: (a, b) => a + b,\n  tru: (a, b) => a - b,\n  trungBinh: mang => mang.length ? mang.reduce((t, x) => t + x, 0) / mang.length : 0\n};\n\nmodule.exports = mathUtils;\n\nconst duongDan = path.join(__dirname, 'data', 'users.json');\nconsole.log(duongDan);\n" },
      check: `
        const m = T.exports();
        if (!m || typeof m.cong !== "function" || typeof m.tru !== "function" || typeof m.trungBinh !== "function") return {pass:false, msg:"module.exports phải chứa cong, tru, trungBinh."};
        if (m.cong(2, 3) !== 5 || m.tru(10, 4) !== 6) return {pass:false, msg:"cong/tru tính chưa đúng."};
        if (m.trungBinh([2, 4, 9]) !== 5) return {pass:false, msg:"trungBinh([2, 4, 9]) phải là 5."};
        if (m.trungBinh([]) !== 0) return {pass:false, msg:"trungBinh([]) phải trả về 0 (tránh chia cho 0 ra NaN)."};
        if (!T.logs.some(l => l.trim() === "/app/data/users.json")) return {pass:false, msg:"Chưa in đường dẫn /app/data/users.json."};
        if (!/path\\.join|path\\.resolve/.test(T.src)) return {pass:false, msg:"Hãy dùng path.join(...) thay vì tự nối chuỗi."};
        return {pass:true, msg:"Module hoá gọn gàng! 📚"};`
    }
  },
  {
    id: "node-fs-async", level: "be-basics", icon: "📂", title: "File system & lập trình bất đồng bộ trong Node", duration: 22, runtime: "node",
    files: { "data/products.json": "[\n  { \"id\": 1, \"ten\": \"Bàn phím cơ\", \"gia\": 890000 },\n  { \"id\": 2, \"ten\": \"Chuột không dây\", \"gia\": 250000 },\n  { \"id\": 3, \"ten\": \"Màn hình 24 inch\", \"gia\": 3290000 },\n  { \"id\": 4, \"ten\": \"Lót chuột\", \"gia\": 90000 },\n  { \"id\": 5, \"ten\": \"Tai nghe\", \"gia\": 590000 }\n]" },
    summary: "Đọc/ghi file với module fs, hiểu vì sao Node ưu tiên bất đồng bộ và cách dùng async/await với fs.promises.",
    content: [
      { h: "Đồng bộ vs bất đồng bộ" },
      { p: "Node chạy JavaScript trên **một luồng** (single thread). Nếu đọc file kiểu *đồng bộ* (`readFileSync`), cả server **đứng hình** chờ ổ cứng – mọi người dùng khác phải đợi. Kiểu *bất đồng bộ* giao việc cho hệ điều hành rồi phục vụ request khác, khi xong mới quay lại (nhờ **event loop**)." },
      { code: "const fs = require('fs');\n\n// 1) Đồng bộ – chỉ nên dùng khi khởi động hoặc script nhỏ\nconst text = fs.readFileSync('data/products.json', 'utf8');\n\n// 2) Callback – kiểu cũ\nfs.readFile('data/products.json', 'utf8', (err, data) => {\n  if (err) return console.error(err.message);\n  console.log(data);\n});\n\n// 3) Promise + async/await – nên dùng ✅\nconst fsp = require('fs/promises');   // hoặc require('fs').promises\nasync function doc() {\n  const data = await fsp.readFile('data/products.json', 'utf8');\n  return JSON.parse(data);\n}" },
      { h: "Ghi file" },
      { code: "await fsp.writeFile('data/report.json', JSON.stringify(obj, null, 2));  // ghi đè\nawait fsp.appendFile('logs/app.log', 'Dòng mới\\n');                  // ghi nối\nawait fsp.mkdir('logs', { recursive: true });                         // tạo thư mục" },
      { h: "Xử lý lỗi khi làm việc với file" },
      { code: "try {\n  const raw = await fsp.readFile('config.json', 'utf8');\n} catch (err) {\n  if (err.code === 'ENOENT') console.log('File không tồn tại');\n  else throw err;\n}" },
      { tip: "`JSON.stringify(obj, null, 2)` ghi JSON có thụt lề 2 khoảng trắng – dễ đọc khi mở file. Trong app, các file nằm trong ổ đĩa ảo (bộ nhớ) và được tạo lại mỗi lần chạy." }
    ],
    example: { js: "const fsp = require('fs/promises');\n\nasync function main() {\n  console.log('Các file trong data/:', await fsp.readdir('data'));\n  const raw = await fsp.readFile('data/products.json', 'utf8');\n  const products = JSON.parse(raw);\n  console.table(products.map(p => ({ ten: p.ten, gia: p.gia })));\n\n  await fsp.writeFile('data/ghi-chu.txt', 'Tạo lúc ' + new Date().toLocaleString('vi-VN'));\n  console.log('Đã ghi:', await fsp.readFile('data/ghi-chu.txt', 'utf8'));\n\n  try {\n    await fsp.readFile('khong-co.txt', 'utf8');\n  } catch (e) {\n    console.log('Bắt lỗi:', e.code);\n  }\n}\nmain();\nconsole.log('⚡ Dòng này in TRƯỚC – vì đọc file là bất đồng bộ!');\n" },
    exercise: {
      task: "File `data/products.json` đã có sẵn. Viết 2 hàm **async** dùng `fs/promises`:\n• `docSanPham(giaToiThieu)` – đọc file, parse JSON, trả về mảng sản phẩm có `gia >= giaToiThieu`.\n• `luuBaoCao(danhSach)` – ghi `danhSach` vào `data/report.json` dạng JSON (thụt lề 2), trả về số sản phẩm đã ghi.",
      starter: { js: "const fsp = require('fs/promises');\n\nasync function docSanPham(giaToiThieu) {\n  \n}\n\nasync function luuBaoCao(danhSach) {\n  \n}\n\n// Thử chạy:\ndocSanPham(500000).then(ds => console.log(ds));\n" },
      hint: "const raw = await fsp.readFile('data/products.json', 'utf8'); return JSON.parse(raw).filter(p => p.gia >= giaToiThieu); — ghi: await fsp.writeFile('data/report.json', JSON.stringify(danhSach, null, 2)); return danhSach.length;",
      solution: { js: "const fsp = require('fs/promises');\n\nasync function docSanPham(giaToiThieu) {\n  const raw = await fsp.readFile('data/products.json', 'utf8');\n  const products = JSON.parse(raw);\n  return products.filter(p => p.gia >= giaToiThieu);\n}\n\nasync function luuBaoCao(danhSach) {\n  await fsp.writeFile('data/report.json', JSON.stringify(danhSach, null, 2));\n  return danhSach.length;\n}\n\ndocSanPham(500000).then(async ds => {\n  console.log('Sản phẩm từ 500k:', ds.map(p => p.ten));\n  console.log('Đã lưu', await luuBaoCao(ds), 'sản phẩm');\n});\n" },
      check: `
        if (typeof docSanPham !== "function" || typeof luuBaoCao !== "function") return {pass:false, msg:"Cần 2 hàm docSanPham và luuBaoCao."};
        const p = docSanPham(500000);
        if (!p || typeof p.then !== "function") return {pass:false, msg:"docSanPham phải là hàm async (trả về Promise)."};
        const ds = await p;
        if (!Array.isArray(ds) || ds.length !== 3 || ds.some(x => x.gia < 500000)) return {pass:false, msg:"docSanPham(500000) phải trả 3 sản phẩm có giá >= 500000."};
        if ((await docSanPham(0)).length !== 5) return {pass:false, msg:"docSanPham(0) phải trả đủ 5 sản phẩm."};
        const n = await luuBaoCao([{ id: 9, ten: "Test", gia: 1 }]);
        if (n !== 1) return {pass:false, msg:"luuBaoCao phải trả về số sản phẩm đã ghi."};
        const raw = T.file("data/report.json");
        if (!raw) return {pass:false, msg:"Chưa thấy file data/report.json được ghi."};
        let parsed; try { parsed = JSON.parse(raw); } catch (e) { return {pass:false, msg:"data/report.json không phải JSON hợp lệ."}; }
        if (!Array.isArray(parsed) || parsed[0].ten !== "Test") return {pass:false, msg:"Nội dung report.json chưa đúng."};
        if (!raw.includes("\\n  ")) return {pass:false, msg:"Hãy ghi JSON có thụt lề: JSON.stringify(danhSach, null, 2)."};
        if (/readFileSync|writeFileSync/.test(T.src)) return {pass:false, msg:"Bài này yêu cầu dùng bản bất đồng bộ (fs/promises), không dùng ...Sync."};
        return {pass:true, msg:"Đọc ghi file bất đồng bộ thành thạo! 📂"};`
    }
  },

  /* ===================== CẤP 2: EXPRESS & REST ===================== */
  {
    id: "http-server", level: "be-express", icon: "🔌", title: "Server HTTP đầu tiên với module http", duration: 20, runtime: "node",
    requests: [{ method: "GET", url: "/" }, { method: "GET", url: "/api/time" }, { method: "GET", url: "/khong-co" }],
    summary: "Tự viết web server bằng module http có sẵn của Node để hiểu chuyện gì xảy ra bên dưới mọi framework.",
    content: [
      { h: "Web server là gì?" },
      { p: "Web server là chương trình **lắng nghe** trên một cổng (port, vd 3000). Mỗi khi có request đến, nó gọi hàm xử lý với 2 đối tượng: `req` (yêu cầu) và `res` (phản hồi)." },
      { code: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  console.log(req.method, req.url);\n\n  if (req.method === 'GET' && req.url === '/') {\n    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });\n    return res.end('Xin chào!');\n  }\n\n  res.writeHead(404, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ error: 'Không tìm thấy' }));\n});\n\nserver.listen(3000, () => console.log('Server chạy tại http://localhost:3000'));" },
      { list: [
        "`req.method`, `req.url`, `req.headers` – thông tin yêu cầu.",
        "`res.writeHead(status, headers)` – đặt mã trạng thái và header.",
        "`res.end(noiDung)` – gửi body và **kết thúc** response. Quên gọi `end()` → client chờ mãi.",
        "Muốn trả JSON: tự `JSON.stringify` và đặt `Content-Type: application/json`."
      ] },
      { h: "Đọc body của POST" },
      { code: "let body = '';\nreq.on('data', chunk => body += chunk);   // dữ liệu đến theo từng mảnh\nreq.on('end', () => {\n  const data = JSON.parse(body);\n  // ...\n});" },
      { tip: "Thấy dài dòng chưa? Tự phân tích URL, tự parse body, tự viết `if` cho từng route… Đó chính là lý do **Express** ra đời – bài tiếp theo." },
      { tip: "Chạy thử: bấm các nút yêu cầu mẫu trong **API Tester** (phía trên Terminal) hoặc tự gõ đường dẫn rồi bấm **Gửi**." }
    ],
    example: { js: "const http = require('http');\n\nlet luotTruyCap = 0;\n\nconst server = http.createServer((req, res) => {\n  luotTruyCap++;\n  console.log(`[${luotTruyCap}] ${req.method} ${req.url}`);\n\n  if (req.url === '/') {\n    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });\n    return res.end('<h1>Trang chủ</h1><p>Lượt truy cập: ' + luotTruyCap + '</p>');\n  }\n  if (req.url === '/api/time') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    return res.end(JSON.stringify({ now: new Date().toISOString() }));\n  }\n  res.writeHead(404, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ error: 'Không tìm thấy ' + req.url }));\n});\n\nserver.listen(3000, () => console.log('🚀 http://localhost:3000'));\n" },
    exercise: {
      task: "Dùng **module `http`** (không dùng Express) tạo server cổng 3000:\n• `GET /` → status **200**, `Content-Type: text/plain`, nội dung `Trang chủ`.\n• `GET /api/time` → status **200**, JSON `{ \"now\": \"<thời gian dạng ISO>\" }` (dùng `new Date().toISOString()`).\n• Mọi đường dẫn khác → status **404**, JSON `{ \"error\": \"Không tìm thấy\" }`.",
      starter: { js: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  // viết các nhánh xử lý ở đây\n  \n});\n\nserver.listen(3000, () => console.log('Server chạy cổng 3000'));\n" },
      hint: "if (req.method === 'GET' && req.url === '/api/time') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ now: new Date().toISOString() })); }",
      solution: { js: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  if (req.method === 'GET' && req.url === '/') {\n    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });\n    return res.end('Trang chủ');\n  }\n  if (req.method === 'GET' && req.url === '/api/time') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    return res.end(JSON.stringify({ now: new Date().toISOString() }));\n  }\n  res.writeHead(404, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ error: 'Không tìm thấy' }));\n});\n\nserver.listen(3000, () => console.log('Server chạy cổng 3000'));\n" },
      check: `
        if (/require\\(\\s*['"]express['"]\\s*\\)/.test(T.src)) return {pass:false, msg:"Bài này yêu cầu dùng module http thuần – chưa dùng Express nhé."};
        if (!T.server()) return {pass:false, msg:"Server chưa chạy – nhớ gọi server.listen(3000)."};
        const home = await T.request("GET", "/");
        if (home.error) return {pass:false, msg:home.error};
        if (home.status !== 200 || String(home.text).trim() !== "Trang chủ") return {pass:false, msg:"GET / phải trả 200 và nội dung \\"Trang chủ\\" (đang " + home.status + ": " + home.text + ")."};
        if (!/text\\/plain/.test(home.headers["content-type"] || "")) return {pass:false, msg:"GET / cần header Content-Type: text/plain."};
        const t = await T.request("GET", "/api/time");
        if (t.status !== 200 || !t.body || typeof t.body.now !== "string" || isNaN(Date.parse(t.body.now)) || !t.body.now.includes("T")) return {pass:false, msg:"GET /api/time phải trả JSON { now: new Date().toISOString() } với Content-Type application/json."};
        const nf = await T.request("GET", "/abc");
        if (nf.status !== 404 || !nf.body || nf.body.error !== "Không tìm thấy") return {pass:false, msg:"Đường dẫn lạ phải trả 404 với JSON { error: \\"Không tìm thấy\\" }."};
        return {pass:true, msg:"Bạn đã tự viết web server không cần framework! 🔌"};`
    }
  },
  {
    id: "express-intro", level: "be-express", icon: "🚂", title: "Express: framework web phổ biến nhất của Node", duration: 18, runtime: "node", exampleRequests: [{ method: "GET", url: "/" }, { method: "GET", url: "/api/mon-an" }, { method: "GET", url: "/api/mon-an/ngau-nhien" }],
    requests: [{ method: "GET", url: "/" }, { method: "GET", url: "/api/info" }, { method: "GET", url: "/api/health" }],
    summary: "Express giúp định nghĩa route gọn gàng, tự xử lý header, JSON và lỗi 404 – chỉ vài dòng là có API.",
    content: [
      { h: "Cài đặt và Hello World" },
      { code: "npm install express", lang: "bash" },
      { code: "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Xin chào Express!');\n});\n\napp.get('/api/users', (req, res) => {\n  res.json([{ id: 1, ten: 'An' }]);   // tự JSON.stringify + Content-Type\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));" },
      { h: "Route = method + đường dẫn + handler" },
      { code: "app.get(path, handler)      // đọc\napp.post(path, handler)     // tạo\napp.put(path, handler)      // thay thế\napp.patch(path, handler)    // sửa một phần\napp.delete(path, handler)   // xoá" },
      { h: "Các cách trả response" },
      { list: [
        "`res.send('chữ')` – trả text/HTML; `res.send({...})` cũng tự thành JSON.",
        "`res.json(data)` – trả JSON (nên dùng cho API).",
        "`res.status(201).json(data)` – đặt mã trạng thái rồi trả JSON (nối chuỗi được).",
        "`res.sendStatus(204)` – chỉ gửi mã trạng thái.",
        "Mỗi request chỉ được trả **một lần** – gọi `res.send` hai lần sẽ lỗi *Cannot set headers after they are sent*."
      ] },
      { tip: "App mô phỏng **Express 5** (bản mới nhất). Route không khớp sẽ tự trả 404 `Cannot GET /...` – thử gõ một đường dẫn lạ trong API Tester." }
    ],
    example: { js: "const express = require('express');\nconst app = express();\n\nconst monAn = ['Phở', 'Bún bò', 'Bánh mì', 'Cơm tấm'];\n\napp.get('/', (req, res) => res.send('<h1>🍜 API Món ăn</h1>'));\n\napp.get('/api/mon-an', (req, res) => {\n  res.json({ tongSo: monAn.length, danhSach: monAn });\n});\n\napp.get('/api/mon-an/ngau-nhien', (req, res) => {\n  const mon = monAn[Math.floor(Math.random() * monAn.length)];\n  res.json({ homNayAn: mon });\n});\n\napp.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000'));\n" },
    exercise: {
      task: "Dùng Express tạo server cổng 3000 với 3 route GET:\n• `/` → text `Xin chào Express!`\n• `/api/info` → JSON `{ \"name\": \"Front-end Academy\", \"version\": \"1.0.0\" }`\n• `/api/health` → JSON `{ \"status\": \"ok\", \"uptime\": <số giây server đã chạy> }` (dùng `process.uptime()`).",
      starter: { js: "const express = require('express');\nconst app = express();\n\n// Viết 3 route ở đây\n\napp.listen(3000, () => console.log('Server chạy cổng 3000'));\n" },
      hint: "app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));",
      solution: { js: "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Xin chào Express!');\n});\n\napp.get('/api/info', (req, res) => {\n  res.json({ name: 'Front-end Academy', version: '1.0.0' });\n});\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok', uptime: process.uptime() });\n});\n\napp.listen(3000, () => console.log('Server chạy cổng 3000'));\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy – kiểm tra app.listen(3000) và Terminal xem có lỗi không."};
        const a = await T.request("GET", "/");
        if (a.status !== 200 || String(a.text).trim() !== "Xin chào Express!") return {pass:false, msg:"GET / phải trả \\"Xin chào Express!\\" (đang " + a.status + ": " + a.text + ")."};
        const b = await T.request("GET", "/api/info");
        if (b.status !== 200 || !b.body || b.body.name !== "Front-end Academy" || b.body.version !== "1.0.0") return {pass:false, msg:"GET /api/info phải trả JSON { name: \\"Front-end Academy\\", version: \\"1.0.0\\" }."};
        if (!/json/.test(b.headers["content-type"] || "")) return {pass:false, msg:"/api/info nên dùng res.json(...)."};
        const c = await T.request("GET", "/api/health");
        if (c.status !== 200 || !c.body || c.body.status !== "ok" || typeof c.body.uptime !== "number") return {pass:false, msg:"GET /api/health phải trả { status: \\"ok\\", uptime: <số> }."};
        return {pass:true, msg:"API Express đầu tiên đã lên sóng! 🚂"};`
    }
  },
  {
    id: "express-params", level: "be-express", icon: "🔎", title: "Route params & query string", duration: 20, runtime: "node", exampleRequests: [{ method: "GET", url: "/api/users" }, { method: "GET", url: "/api/users?thanhPho=Hà Nội" }, { method: "GET", url: "/api/users/2" }, { method: "GET", url: "/api/users/9" }],
    requests: [
      { method: "GET", url: "/api/products" }, { method: "GET", url: "/api/products?q=chuột" },
      { method: "GET", url: "/api/products?maxPrice=500000" }, { method: "GET", url: "/api/products/3" }, { method: "GET", url: "/api/products/99" }
    ],
    summary: "Lấy dữ liệu động từ URL: req.params cho định danh (/products/5) và req.query cho lọc, tìm kiếm, phân trang (?q=&page=).",
    content: [
      { h: "Route params – phần động trong đường dẫn" },
      { code: "app.get('/api/users/:id', (req, res) => {\n  console.log(req.params.id);      // '/api/users/42' → '42' (luôn là CHUỖI)\n  const id = Number(req.params.id);\n});\n\napp.get('/api/shops/:shopId/products/:productId', (req, res) => {\n  const { shopId, productId } = req.params;\n});" },
      { h: "Query string – tham số tuỳ chọn" },
      { code: "// GET /api/products?q=ban&maxPrice=500000&page=2\napp.get('/api/products', (req, res) => {\n  const { q = '', maxPrice, page = 1 } = req.query;   // tất cả đều là chuỗi\n  let ketQua = products;\n  if (q) ketQua = ketQua.filter(p => p.ten.toLowerCase().includes(q.toLowerCase()));\n  if (maxPrice) ketQua = ketQua.filter(p => p.gia <= Number(maxPrice));\n  res.json(ketQua);\n});" },
      { h: "Khi nào dùng params, khi nào dùng query?" },
      { list: [
        "**Params**: xác định *một tài nguyên cụ thể* – `/users/42`, `/posts/hoc-node`.",
        "**Query**: *lọc, sắp xếp, tìm kiếm, phân trang* một danh sách – `/products?sort=gia&page=2`."
      ] },
      { h: "Không tìm thấy → 404" },
      { code: "const sp = products.find(p => p.id === Number(req.params.id));\nif (!sp) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });\nres.json(sp);" },
      { warn: "`req.params.id` là chuỗi `'3'`, so sánh `p.id === req.params.id` với `p.id` là số `3` sẽ luôn `false`. Nhớ đổi kiểu bằng `Number(...)`." },
      { tip: "Chữ có dấu trong URL được mã hoá (`chuột` → `chu%E1%BB%99t`); Express tự giải mã lại cho bạn trong `req.query`." }
    ],
    example: { js: "const express = require('express');\nconst app = express();\n\nconst users = [\n  { id: 1, ten: 'An', thanhPho: 'Hà Nội' },\n  { id: 2, ten: 'Bình', thanhPho: 'Đà Nẵng' },\n  { id: 3, ten: 'Chi', thanhPho: 'Hà Nội' }\n];\n\napp.get('/api/users', (req, res) => {\n  const { thanhPho } = req.query;\n  console.log('query =', req.query);\n  res.json(thanhPho ? users.filter(u => u.thanhPho === thanhPho) : users);\n});\n\napp.get('/api/users/:id', (req, res) => {\n  console.log('params =', req.params);\n  const u = users.find(u => u.id === Number(req.params.id));\n  if (!u) return res.status(404).json({ error: 'Không có user ' + req.params.id });\n  res.json(u);\n});\n\napp.listen(3000, () => console.log('Thử: /api/users?thanhPho=Hà Nội và /api/users/2'));\n" },
    exercise: {
      task: "Có sẵn mảng `products`. Hoàn thiện 2 route:\n• `GET /api/products` – hỗ trợ query `q` (tìm theo tên, không phân biệt hoa thường) và `maxPrice` (giá ≤ maxPrice). Có thể dùng cả hai cùng lúc; không có query thì trả tất cả.\n• `GET /api/products/:id` – trả sản phẩm có `id` tương ứng; không có thì **404** với JSON `{ \"error\": \"Không tìm thấy sản phẩm\" }`.",
      starter: { js: "const express = require('express');\nconst app = express();\n\nconst products = [\n  { id: 1, ten: 'Bàn phím cơ', gia: 890000 },\n  { id: 2, ten: 'Chuột không dây', gia: 250000 },\n  { id: 3, ten: 'Màn hình 24 inch', gia: 3290000 },\n  { id: 4, ten: 'Lót chuột', gia: 90000 },\n  { id: 5, ten: 'Tai nghe', gia: 590000 }\n];\n\napp.get('/api/products', (req, res) => {\n  \n});\n\napp.get('/api/products/:id', (req, res) => {\n  \n});\n\napp.listen(3000);\n" },
      hint: "let kq = products; if (q) kq = kq.filter(p => p.ten.toLowerCase().includes(q.toLowerCase())); if (maxPrice) kq = kq.filter(p => p.gia <= Number(maxPrice));",
      solution: { js: "const express = require('express');\nconst app = express();\n\nconst products = [\n  { id: 1, ten: 'Bàn phím cơ', gia: 890000 },\n  { id: 2, ten: 'Chuột không dây', gia: 250000 },\n  { id: 3, ten: 'Màn hình 24 inch', gia: 3290000 },\n  { id: 4, ten: 'Lót chuột', gia: 90000 },\n  { id: 5, ten: 'Tai nghe', gia: 590000 }\n];\n\napp.get('/api/products', (req, res) => {\n  const { q, maxPrice } = req.query;\n  let ketQua = products;\n  if (q) ketQua = ketQua.filter(p => p.ten.toLowerCase().includes(q.toLowerCase()));\n  if (maxPrice) ketQua = ketQua.filter(p => p.gia <= Number(maxPrice));\n  res.json(ketQua);\n});\n\napp.get('/api/products/:id', (req, res) => {\n  const sp = products.find(p => p.id === Number(req.params.id));\n  if (!sp) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });\n  res.json(sp);\n});\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        const all = await T.request("GET", "/api/products");
        if (all.status !== 200 || !Array.isArray(all.body) || all.body.length !== 5) return {pass:false, msg:"GET /api/products (không query) phải trả mảng 5 sản phẩm."};
        const q = await T.request("GET", "/api/products?q=" + encodeURIComponent("CHUỘT"));
        if (!Array.isArray(q.body) || q.body.length !== 2) return {pass:false, msg:"?q=CHUỘT phải trả 2 sản phẩm (tìm không phân biệt hoa thường), đang ra " + (Array.isArray(q.body) ? q.body.length : JSON.stringify(q.body)) + "."};
        const m = await T.request("GET", "/api/products?maxPrice=500000");
        if (!Array.isArray(m.body) || m.body.length !== 2 || m.body.some(p => p.gia > 500000)) return {pass:false, msg:"?maxPrice=500000 phải trả 2 sản phẩm có giá ≤ 500000."};
        const both = await T.request("GET", "/api/products?q=chu&maxPrice=100000");
        if (!Array.isArray(both.body) || both.body.length !== 1 || both.body[0].id !== 4) return {pass:false, msg:"Kết hợp ?q=chu&maxPrice=100000 phải chỉ còn \\"Lót chuột\\"."};
        const one = await T.request("GET", "/api/products/3");
        if (one.status !== 200 || !one.body || one.body.id !== 3) return {pass:false, msg:"GET /api/products/3 phải trả sản phẩm id 3 (nhớ Number(req.params.id))."};
        const nf = await T.request("GET", "/api/products/99");
        if (nf.status !== 404 || !nf.body || nf.body.error !== "Không tìm thấy sản phẩm") return {pass:false, msg:"Id không tồn tại phải trả 404 { error: \\"Không tìm thấy sản phẩm\\" }."};
        return {pass:true, msg:"Lọc, tìm kiếm, tra cứu theo id đều chuẩn! 🔎"};`
    }
  },
  {
    id: "express-middleware", level: "be-express", icon: "🧅", title: "Middleware: lớp xử lý trung gian", duration: 22, runtime: "node", exampleRequests: [{ method: "GET", url: "/" }, { method: "POST", url: "/api/echo", body: { ten: "Quảng" } }],
    env: { API_KEY: "hoc-node-123" },
    requests: [
      { method: "GET", url: "/api/public" }, { method: "GET", url: "/api/secret" },
      { method: "GET", url: "/api/secret", headers: { "x-api-key": "hoc-node-123" }, label: "/api/secret (có key)" },
      { method: "POST", url: "/api/echo", body: { ten: "Quảng", thich: ["Node", "AI"] } }
    ],
    summary: "Middleware là hàm (req, res, next) chạy trước route: ghi log, đọc body JSON, kiểm tra quyền… – xương sống của Express.",
    content: [
      { h: "Request đi qua từng lớp như củ hành" },
      { p: "Khi request đến, Express cho nó đi qua **chuỗi middleware theo đúng thứ tự khai báo**. Mỗi middleware có thể: đọc/sửa `req`, trả response luôn (chặn lại), hoặc gọi `next()` để chuyển cho lớp tiếp theo." },
      { code: "// Middleware ghi log – áp dụng cho MỌI request\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();                          // quên next() → request bị treo!\n});\n\n// Middleware có sẵn: đọc body JSON vào req.body\napp.use(express.json());" },
      { h: "Middleware cho một route cụ thể" },
      { code: "function chiAdmin(req, res, next) {\n  if (req.headers['x-role'] !== 'admin') {\n    return res.status(403).json({ error: 'Cần quyền admin' });  // chặn, không gọi next\n  }\n  next();\n}\n\napp.delete('/api/users/:id', chiAdmin, (req, res) => { /* ... */ });\n// Có thể xếp nhiều middleware: app.get(path, mw1, mw2, handler)" },
      { h: "Thứ tự rất quan trọng" },
      { list: [
        "`app.use(express.json())` phải đặt **trước** các route cần `req.body` – nếu không `req.body` là `undefined`.",
        "Middleware log đặt đầu tiên để ghi được mọi request.",
        "Middleware xử lý lỗi `(err, req, res, next)` – 4 tham số – đặt **cuối cùng**."
      ] },
      { h: "Router – chia nhỏ route theo nhóm" },
      { code: "const router = express.Router();\nrouter.get('/', layDanhSach);\nrouter.post('/', taoMoi);\napp.use('/api/products', router);   // mọi route trong router có tiền tố /api/products" },
      { tip: "Header được Express chuyển hết về **chữ thường**: đọc `req.headers['x-api-key']` hoặc `req.get('X-API-Key')` đều được." }
    ],
    example: { js: "const express = require('express');\nconst app = express();\n\n// 1) Đo thời gian xử lý mỗi request\napp.use((req, res, next) => {\n  const batDau = Date.now();\n  res.on('finish', () => console.log(`${req.method} ${req.url} → ${res.statusCode} (${Date.now() - batDau}ms)`));\n  next();\n});\n\n// 2) Đọc JSON body\napp.use(express.json());\n\n// 3) Gắn thêm dữ liệu vào req cho các lớp sau dùng\napp.use((req, res, next) => {\n  req.thoiGian = new Date().toLocaleTimeString('vi-VN');\n  next();\n});\n\napp.get('/', (req, res) => res.json({ message: 'Xin chào', luc: req.thoiGian }));\napp.post('/api/echo', (req, res) => res.json({ banGui: req.body }));\n\napp.listen(3000, () => console.log('Thử GET / và POST /api/echo'));\n" },
    exercise: {
      task: "Hoàn thiện server:\n1) Middleware **ghi log** cho mọi request, in dạng `GET /api/public` (method + url).\n2) Dùng `express.json()` để đọc body.\n3) Viết middleware `kiemTraApiKey`: nếu header `x-api-key` khác `process.env.API_KEY` thì trả **401** JSON `{ \"error\": \"Thiếu hoặc sai API key\" }`, ngược lại `next()`.\n4) Route: `GET /api/public` → `{ \"message\": \"Ai cũng xem được\" }`; `GET /api/secret` (có `kiemTraApiKey`) → `{ \"message\": \"Bí mật\" }`; `POST /api/echo` → `{ \"nhanDuoc\": <body gửi lên> }`.",
      starter: { js: "const express = require('express');\nconst app = express();\n\n// 1) Middleware log\n\n// 2) express.json()\n\n// 3) Middleware kiểm tra API key\nfunction kiemTraApiKey(req, res, next) {\n  \n}\n\n// 4) Các route\n\napp.listen(3000);\n" },
      hint: "if (req.headers['x-api-key'] !== process.env.API_KEY) return res.status(401).json({ error: 'Thiếu hoặc sai API key' }); next(); — route: app.get('/api/secret', kiemTraApiKey, (req, res) => ...)",
      solution: { js: "const express = require('express');\nconst app = express();\n\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n\napp.use(express.json());\n\nfunction kiemTraApiKey(req, res, next) {\n  if (req.headers['x-api-key'] !== process.env.API_KEY) {\n    return res.status(401).json({ error: 'Thiếu hoặc sai API key' });\n  }\n  next();\n}\n\napp.get('/api/public', (req, res) => {\n  res.json({ message: 'Ai cũng xem được' });\n});\n\napp.get('/api/secret', kiemTraApiKey, (req, res) => {\n  res.json({ message: 'Bí mật' });\n});\n\napp.post('/api/echo', (req, res) => {\n  res.json({ nhanDuoc: req.body });\n});\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        const pub = await T.request("GET", "/api/public");
        if (pub.status !== 200 || !pub.body || pub.body.message !== "Ai cũng xem được") return {pass:false, msg:"GET /api/public phải trả { message: \\"Ai cũng xem được\\" }."};
        await T.sleep(5);
        if (!T.logs.some(l => l.trim() === "GET /api/public")) return {pass:false, msg:"Middleware log chưa in dòng \\"GET /api/public\\"."};
        const s1 = await T.request("GET", "/api/secret");
        if (s1.status !== 401 || !s1.body || s1.body.error !== "Thiếu hoặc sai API key") return {pass:false, msg:"Không có key → 401 { error: \\"Thiếu hoặc sai API key\\" } (đang " + s1.status + ")."};
        const s2 = await T.request("GET", "/api/secret", { headers: { "x-api-key": "sai-roi" } });
        if (s2.status !== 401) return {pass:false, msg:"Sai key cũng phải trả 401."};
        const s3 = await T.request("GET", "/api/secret", { headers: { "X-API-Key": "hoc-node-123" } });
        if (s3.status !== 200 || !s3.body || s3.body.message !== "Bí mật") return {pass:false, msg:"Đúng key (từ process.env.API_KEY) → 200 { message: \\"Bí mật\\" }."};
        if (!/process\\.env\\.API_KEY/.test(T.src)) return {pass:false, msg:"So sánh với process.env.API_KEY – không gõ cứng key trong code."};
        const e = await T.request("POST", "/api/echo", { body: { a: 1, b: [2, 3] } });
        if (e.status !== 200 || !e.body || !e.body.nhanDuoc || e.body.nhanDuoc.a !== 1) return {pass:false, msg:"POST /api/echo phải trả { nhanDuoc: req.body } – đã thêm app.use(express.json()) TRƯỚC route chưa?"};
        if ((await T.request("GET", "/api/public", { headers: { "x-api-key": "x" } })).status !== 200) return {pass:false, msg:"/api/public không được yêu cầu API key."};
        return {pass:true, msg:"Middleware đã nằm trong tay bạn! 🧅"};`
    }
  },
  {
    id: "rest-crud", level: "be-express", icon: "📋", title: "REST API: CRUD hoàn chỉnh", duration: 25, runtime: "node", exampleRequests: [{ method: "GET", url: "/api/notes" }, { method: "POST", url: "/api/notes", body: { noiDung: "Học CRUD" } }, { method: "DELETE", url: "/api/notes/1" }],
    requests: [
      { method: "GET", url: "/api/todos" }, { method: "POST", url: "/api/todos", body: { title: "Học REST API" } },
      { method: "GET", url: "/api/todos/1" }, { method: "PATCH", url: "/api/todos/1", body: { done: true } },
      { method: "DELETE", url: "/api/todos/1" }, { method: "POST", url: "/api/todos", body: {}, label: "/api/todos (thiếu title)" }
    ],
    summary: "Thiết kế và xây API Tạo – Đọc – Sửa – Xoá theo chuẩn REST với đúng method, URL và mã trạng thái.",
    content: [
      { h: "CRUD ↔ HTTP method" },
      { code: "Hành động     Method   URL               Thành công\n───────────   ──────   ───────────────   ──────────────────\nĐọc danh sách GET      /api/todos        200 + mảng\nĐọc 1 mục     GET      /api/todos/:id    200 + object | 404\nTạo mới       POST     /api/todos        201 + object mới\nSửa một phần  PATCH    /api/todos/:id    200 + object | 404\nThay thế      PUT      /api/todos/:id    200 + object | 404\nXoá           DELETE   /api/todos/:id    204 (không body) | 404", lang: "http" },
      { h: "Quy tắc đặt URL theo REST" },
      { list: [
        "Dùng **danh từ số nhiều**: `/api/todos`, không dùng động từ `/api/getTodos`, `/api/deleteTodo`.",
        "Định danh nằm trong đường dẫn: `/api/todos/5`.",
        "Quan hệ lồng nhau: `/api/users/3/orders`.",
        "Lọc/phân trang bằng query: `/api/todos?done=true&page=2`."
      ] },
      { h: "Tạo mới với POST" },
      { code: "let nextId = 1;\nconst todos = [];\n\napp.post('/api/todos', (req, res) => {\n  const { title } = req.body;\n  if (!title) return res.status(400).json({ error: 'Thiếu title' });\n  const todo = { id: nextId++, title, done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});" },
      { h: "Sửa với PATCH và xoá với DELETE" },
      { code: "app.patch('/api/todos/:id', (req, res) => {\n  const todo = todos.find(t => t.id === Number(req.params.id));\n  if (!todo) return res.status(404).json({ error: 'Không tìm thấy' });\n  if (req.body.title !== undefined) todo.title = req.body.title;\n  if (req.body.done !== undefined) todo.done = req.body.done;\n  res.json(todo);\n});\n\napp.delete('/api/todos/:id', (req, res) => {\n  const i = todos.findIndex(t => t.id === Number(req.params.id));\n  if (i === -1) return res.status(404).json({ error: 'Không tìm thấy' });\n  todos.splice(i, 1);\n  res.sendStatus(204);   // hoặc res.status(204).end()\n});" },
      { tip: "Dữ liệu lưu trong biến sẽ **mất khi server khởi động lại** (mỗi lần bạn sửa code ở đây cũng vậy). Cấp 3 sẽ lưu vào cơ sở dữ liệu thật." }
    ],
    example: { js: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nconst ghiChu = [{ id: 1, noiDung: 'Mua sữa' }];\nlet nextId = 2;\n\napp.get('/api/notes', (req, res) => res.json(ghiChu));\n\napp.post('/api/notes', (req, res) => {\n  const note = { id: nextId++, noiDung: req.body.noiDung };\n  ghiChu.push(note);\n  console.log('➕ Tạo:', note);\n  res.status(201).json(note);\n});\n\napp.delete('/api/notes/:id', (req, res) => {\n  const i = ghiChu.findIndex(n => n.id === Number(req.params.id));\n  if (i === -1) return res.status(404).json({ error: 'Không có' });\n  console.log('🗑️ Xoá:', ghiChu.splice(i, 1)[0]);\n  res.sendStatus(204);\n});\n\napp.listen(3000, () => console.log('Thử POST /api/notes với body {\"noiDung\": \"Học CRUD\"}'));\n" },
    exercise: {
      task: "Xây REST API quản lý công việc `/api/todos` (lưu trong mảng `todos`, id tự tăng từ 1):\n• `GET /api/todos` → 200, mảng todos.\n• `GET /api/todos/:id` → 200 todo | 404.\n• `POST /api/todos` body `{ title }` → **201** + `{ id, title, done: false }`; thiếu/rỗng title → **400** `{ error }`.\n• `PATCH /api/todos/:id` → cập nhật `title` và/hoặc `done`, trả 200 todo | 404.\n• `DELETE /api/todos/:id` → **204** | 404.\nMọi lỗi 404 trả JSON `{ \"error\": \"Không tìm thấy\" }`.",
      starter: { js: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nconst todos = [];\nlet nextId = 1;\n\n// GET /api/todos\n\n// GET /api/todos/:id\n\n// POST /api/todos\n\n// PATCH /api/todos/:id\n\n// DELETE /api/todos/:id\n\napp.listen(3000);\n" },
      hint: "Viết hàm timTodo(id) dùng chung. POST: if (!title || !String(title).trim()) return res.status(400).json({ error: 'Thiếu title' });",
      solution: { js: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nconst todos = [];\nlet nextId = 1;\nconst timTodo = id => todos.find(t => t.id === Number(id));\n\napp.get('/api/todos', (req, res) => res.json(todos));\n\napp.get('/api/todos/:id', (req, res) => {\n  const todo = timTodo(req.params.id);\n  if (!todo) return res.status(404).json({ error: 'Không tìm thấy' });\n  res.json(todo);\n});\n\napp.post('/api/todos', (req, res) => {\n  const { title } = req.body;\n  if (!title || !String(title).trim()) return res.status(400).json({ error: 'Thiếu title' });\n  const todo = { id: nextId++, title: String(title).trim(), done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});\n\napp.patch('/api/todos/:id', (req, res) => {\n  const todo = timTodo(req.params.id);\n  if (!todo) return res.status(404).json({ error: 'Không tìm thấy' });\n  if (req.body.title !== undefined) todo.title = req.body.title;\n  if (req.body.done !== undefined) todo.done = req.body.done;\n  res.json(todo);\n});\n\napp.delete('/api/todos/:id', (req, res) => {\n  const i = todos.findIndex(t => t.id === Number(req.params.id));\n  if (i === -1) return res.status(404).json({ error: 'Không tìm thấy' });\n  todos.splice(i, 1);\n  res.sendStatus(204);\n});\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        let r = await T.request("GET", "/api/todos");
        if (r.status !== 200 || !Array.isArray(r.body)) return {pass:false, msg:"GET /api/todos phải trả 200 + mảng."};
        const start = r.body.length;
        r = await T.request("POST", "/api/todos", { body: { title: "Học CRUD" } });
        if (r.status !== 201) return {pass:false, msg:"POST /api/todos phải trả 201 Created (đang " + r.status + ")."};
        if (!r.body || typeof r.body.id !== "number" || r.body.title !== "Học CRUD" || r.body.done !== false) return {pass:false, msg:"POST phải trả todo mới dạng { id, title, done: false }."};
        const id = r.body.id;
        r = await T.request("POST", "/api/todos", { body: { title: "Việc 2" } });
        if (!r.body || r.body.id === id) return {pass:false, msg:"Mỗi todo phải có id khác nhau (tự tăng)."};
        r = await T.request("POST", "/api/todos", { body: {} });
        if (r.status !== 400 || !r.body || !r.body.error) return {pass:false, msg:"Thiếu title phải trả 400 { error }."};
        if ((await T.request("POST", "/api/todos", { body: { title: "   " } })).status !== 400) return {pass:false, msg:"title chỉ có khoảng trắng cũng phải trả 400."};
        r = await T.request("GET", "/api/todos/" + id);
        if (r.status !== 200 || !r.body || r.body.id !== id) return {pass:false, msg:"GET /api/todos/:id chưa trả đúng todo."};
        r = await T.request("PATCH", "/api/todos/" + id, { body: { done: true } });
        if (r.status !== 200 || !r.body || r.body.done !== true || r.body.title !== "Học CRUD") return {pass:false, msg:"PATCH { done: true } phải cập nhật done và giữ nguyên title."};
        r = await T.request("PATCH", "/api/todos/" + id, { body: { title: "Đã sửa" } });
        if (!r.body || r.body.title !== "Đã sửa" || r.body.done !== true) return {pass:false, msg:"PATCH { title } phải đổi title và giữ done."};
        r = await T.request("DELETE", "/api/todos/" + id);
        if (r.status !== 204) return {pass:false, msg:"DELETE thành công phải trả 204 (đang " + r.status + ")."};
        r = await T.request("GET", "/api/todos/" + id);
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy") return {pass:false, msg:"Todo đã xoá: GET phải trả 404 { error: \\"Không tìm thấy\\" }."};
        if ((await T.request("PATCH", "/api/todos/999", { body: { done: true } })).status !== 404) return {pass:false, msg:"PATCH id không tồn tại phải trả 404."};
        if ((await T.request("DELETE", "/api/todos/999")).status !== 404) return {pass:false, msg:"DELETE id không tồn tại phải trả 404."};
        r = await T.request("GET", "/api/todos");
        if (r.body.length !== start + 1) return {pass:false, msg:"Danh sách sau cùng phải còn đúng 1 todo (đã tạo 2, xoá 1)."};
        return {pass:true, msg:"API CRUD chuẩn REST – đủ để làm back-end cho app Todo! 📋"};`
    }
  },
  {
    id: "validation-errors", level: "be-express", icon: "🚧", title: "Validation & xử lý lỗi tập trung", duration: 25, runtime: "node", exampleRequests: [{ method: "GET", url: "/api/chia?a=10&b=2" }, { method: "GET", url: "/api/chia?a=10&b=0" }, { method: "GET", url: "/api/chia?a=abc&b=1" }, { method: "GET", url: "/api/loi-that" }],
    requests: [
      { method: "POST", url: "/api/users", body: { name: "Quảng", email: "quang@example.com", age: 23 } },
      { method: "POST", url: "/api/users", body: { name: "Q", email: "sai-email" }, label: "/api/users (dữ liệu sai)" },
      { method: "GET", url: "/api/users/1" }, { method: "GET", url: "/api/users/99" },
      { method: "GET", url: "/api/slow" }, { method: "GET", url: "/khong-ton-tai" }
    ],
    summary: "Không bao giờ tin dữ liệu client gửi lên: kiểm tra đầu vào, trả lỗi rõ ràng và gom mọi lỗi về một middleware duy nhất.",
    content: [
      { h: "Nguyên tắc vàng: không tin client" },
      { p: "Dù front-end đã kiểm tra form, kẻ xấu vẫn có thể gửi request trực tiếp (Postman, curl…). **Back-end phải tự kiểm tra lại mọi dữ liệu**: có đủ trường không, đúng kiểu không, độ dài, định dạng email…" },
      { code: "function kiemTraUser({ name, email, age }) {\n  const errors = [];\n  if (typeof name !== 'string' || name.trim().length < 2) errors.push('name phải có ít nhất 2 ký tự');\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email || '')) errors.push('email không hợp lệ');\n  if (age !== undefined && !(Number.isInteger(age) && age >= 1 && age <= 120)) errors.push('age phải là số nguyên 1–120');\n  return errors;\n}\n\napp.post('/api/users', (req, res) => {\n  const errors = kiemTraUser(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  // ... tạo user\n});" },
      { h: "Lỗi tuỳ chỉnh + middleware xử lý lỗi" },
      { code: "class AppError extends Error {\n  constructor(status, message) {\n    super(message);\n    this.status = status;\n  }\n}\n\napp.get('/api/users/:id', (req, res) => {\n  const user = users.find(u => u.id === Number(req.params.id));\n  if (!user) throw new AppError(404, 'Không tìm thấy người dùng');  // ném lỗi, không tự res\n  res.json(user);\n});\n\n// 404 cho route không tồn tại – đặt SAU tất cả route\napp.use((req, res) => res.status(404).json({ error: 'Route không tồn tại' }));\n\n// Middleware lỗi – 4 tham số, đặt CUỐI CÙNG\napp.use((err, req, res, next) => {\n  const status = err.status || 500;\n  if (status === 500) console.error(err);          // log lỗi thật cho dev\n  res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });\n});" },
      { h: "Lỗi trong hàm async" },
      { p: "Từ **Express 5**, nếu handler `async` bị lỗi (Promise reject), Express tự chuyển lỗi tới middleware xử lý lỗi. Với Express 4 bạn phải tự `try/catch` rồi gọi `next(err)`." },
      { warn: "Không trả chi tiết lỗi 500 (stack trace, câu SQL…) cho client – kẻ tấn công sẽ lợi dụng. Ghi log phía server, client chỉ nhận thông báo chung." },
      { tip: "Dự án thật thường dùng thư viện validation như **zod** hoặc **joi** để khai báo schema thay vì viết tay." }
    ],
    example: { js: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nclass AppError extends Error {\n  constructor(status, message) { super(message); this.status = status; }\n}\n\napp.get('/api/chia', (req, res) => {\n  const a = Number(req.query.a), b = Number(req.query.b);\n  if (Number.isNaN(a) || Number.isNaN(b)) throw new AppError(400, 'a và b phải là số');\n  if (b === 0) throw new AppError(422, 'Không chia được cho 0');\n  res.json({ ketQua: a / b });\n});\n\napp.get('/api/loi-that', async (req, res) => {\n  const user = undefined;\n  res.json({ ten: user.name });   // TypeError → Express 5 tự chuyển tới middleware lỗi\n});\n\napp.use((err, req, res, next) => {\n  const status = err.status || 500;\n  if (status === 500) console.error('💥', err.message);\n  res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });\n});\n\napp.listen(3000, () => console.log('Thử: /api/chia?a=10&b=0 và /api/loi-that'));\n" },
    exercise: {
      task: "Hoàn thiện API người dùng:\n• `POST /api/users`: kiểm tra `name` (chuỗi ≥ 2 ký tự sau khi trim), `email` (đúng định dạng), `age` (không bắt buộc; nếu có phải là số nguyên 1–120). Sai → **400** `{ \"errors\": [\"...\", ...] }` liệt kê **mọi** lỗi. Đúng → **201** + user `{ id, name, email, age }`.\n• `GET /api/users/:id`: không có → `throw new AppError(404, \"Không tìm thấy người dùng\")`.\n• `GET /api/slow` (đã có sẵn, cố tình lỗi) phải trả **500** `{ \"error\": \"Lỗi máy chủ\" }` – không lộ chi tiết.\n• Route không tồn tại → **404** `{ \"error\": \"Route không tồn tại\" }`.\n• Viết middleware lỗi trả `{ error: err.message }` với `err.status`.",
      starter: { js: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nclass AppError extends Error {\n  constructor(status, message) {\n    super(message);\n    this.status = status;\n  }\n}\n\nconst users = [{ id: 1, name: 'An', email: 'an@example.com', age: 20 }];\nlet nextId = 2;\n\napp.post('/api/users', (req, res) => {\n  \n});\n\napp.get('/api/users/:id', (req, res) => {\n  \n});\n\napp.get('/api/slow', async (req, res) => {\n  const data = await Promise.resolve(null);\n  res.json({ ten: data.ten }); // lỗi cố ý\n});\n\n// 404 handler\n\n// Middleware xử lý lỗi (4 tham số)\n\napp.listen(3000);\n" },
      hint: "Gom lỗi vào mảng errors rồi if (errors.length) return res.status(400).json({ errors }); — middleware lỗi: const status = err.status || 500; res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });",
      solution: { js: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nclass AppError extends Error {\n  constructor(status, message) {\n    super(message);\n    this.status = status;\n  }\n}\n\nconst users = [{ id: 1, name: 'An', email: 'an@example.com', age: 20 }];\nlet nextId = 2;\n\nfunction kiemTraUser({ name, email, age } = {}) {\n  const errors = [];\n  if (typeof name !== 'string' || name.trim().length < 2) errors.push('name phải có ít nhất 2 ký tự');\n  if (typeof email !== 'string' || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) errors.push('email không hợp lệ');\n  if (age !== undefined && !(Number.isInteger(age) && age >= 1 && age <= 120)) errors.push('age phải là số nguyên từ 1 đến 120');\n  return errors;\n}\n\napp.post('/api/users', (req, res) => {\n  const errors = kiemTraUser(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  const { name, email, age } = req.body;\n  const user = { id: nextId++, name: name.trim(), email, age };\n  users.push(user);\n  res.status(201).json(user);\n});\n\napp.get('/api/users/:id', (req, res) => {\n  const user = users.find(u => u.id === Number(req.params.id));\n  if (!user) throw new AppError(404, 'Không tìm thấy người dùng');\n  res.json(user);\n});\n\napp.get('/api/slow', async (req, res) => {\n  const data = await Promise.resolve(null);\n  res.json({ ten: data.ten }); // lỗi cố ý\n});\n\napp.use((req, res) => {\n  res.status(404).json({ error: 'Route không tồn tại' });\n});\n\napp.use((err, req, res, next) => {\n  const status = err.status || 500;\n  if (status === 500) console.error('💥', err.message);\n  res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });\n});\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        let r = await T.request("POST", "/api/users", { body: { name: "Quảng", email: "quang@example.com", age: 23 } });
        if (r.status !== 201 || !r.body || r.body.name !== "Quảng" || typeof r.body.id !== "number") return {pass:false, msg:"Dữ liệu hợp lệ → 201 + user mới (đang " + r.status + ")."};
        const newId = r.body.id;
        r = await T.request("POST", "/api/users", { body: { name: "Bình", email: "binh@example.com" } });
        if (r.status !== 201) return {pass:false, msg:"age là tuỳ chọn – thiếu age vẫn phải tạo được (201)."};
        r = await T.request("POST", "/api/users", { body: { name: " Q ", email: "sai-email", age: 200 } });
        if (r.status !== 400 || !r.body || !Array.isArray(r.body.errors)) return {pass:false, msg:"Dữ liệu sai → 400 { errors: [...] }."};
        if (r.body.errors.length !== 3) return {pass:false, msg:"Phải liệt kê ĐỦ cả 3 lỗi (name, email, age), đang có " + r.body.errors.length + "."};
        r = await T.request("POST", "/api/users", { body: { name: "Chi", email: "chi@example.com", age: 20.5 } });
        if (r.status !== 400) return {pass:false, msg:"age = 20.5 (không phải số nguyên) phải bị từ chối."};
        r = await T.request("POST", "/api/users", { body: { name: "Chi", email: "chi@@x" } });
        if (r.status !== 400) return {pass:false, msg:"email \\"chi@@x\\" không hợp lệ phải bị từ chối."};
        r = await T.request("GET", "/api/users/" + newId);
        if (r.status !== 200 || !r.body || r.body.email !== "quang@example.com") return {pass:false, msg:"GET /api/users/:id phải trả user vừa tạo."};
        r = await T.request("GET", "/api/users/999");
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy người dùng") return {pass:false, msg:"User không tồn tại → 404 { error: \\"Không tìm thấy người dùng\\" } (dùng throw new AppError + middleware lỗi)."};
        if (!/throw\\s+new\\s+AppError/.test(T.src)) return {pass:false, msg:"Hãy dùng throw new AppError(404, ...) trong route thay vì tự res.status(404)."};
        r = await T.request("GET", "/api/slow");
        if (r.status !== 500 || !r.body || r.body.error !== "Lỗi máy chủ") return {pass:false, msg:"/api/slow phải trả 500 { error: \\"Lỗi máy chủ\\" } – không lộ chi tiết lỗi."};
        r = await T.request("GET", "/khong-co-route-nay");
        if (r.status !== 404 || !r.body || r.body.error !== "Route không tồn tại") return {pass:false, msg:"Route lạ → 404 { error: \\"Route không tồn tại\\" } (đặt sau mọi route)."};
        return {pass:true, msg:"API vừa an toàn vừa báo lỗi rõ ràng! 🚧"};`
    }
  }
);
