# 🎓 Front-end Academy

Web app tự học lập trình web từ A–Z: **3 khoá học · 54 bài** (Front-end Cơ bản → Front-end Nâng cao → Back-end Node.js). Mỗi bài có ví dụ chạy thử ngay – kể cả **server Node.js/Express mô phỏng ngay trong trình duyệt** – bài tập tự chấm điểm, **184 bài luyện tập thêm** và trợ lý chatbot **Bit 🤖**.

🌐 **Bản online:** https://automationdq.github.io/frontend-academy/

## Cách chạy trong VS Code
1. Mở thư mục `frontend-academy` bằng VS Code (`File → Open Folder`).
2. Cài extension **Live Server** (Ritwick Dey).
3. Chuột phải `index.html` → **Open with Live Server**.
   (Cũng có thể mở thẳng `index.html` bằng trình duyệt.)

## Cấu trúc dự án
```
frontend-academy/
├── index.html               # Khung giao diện: sidebar, topbar, chatbot
├── css/style.css            # Toàn bộ giao diện (sáng/tối bằng CSS variables)
├── apps-script/Code.gs      # Backend Google Apps Script (Google Sheets)
└── js/
    ├── lessons.js           # Khoá 1 – Front-end Cơ bản (22 bài)
    ├── courses.js           # Danh sách khoá học (COURSES)
    ├── lessons-fe-pro.js    # Khoá 2 – Front-end Nâng cao (13 bài)
    ├── lessons-backend.js   # Khoá 3 – Back-end phần 1: Nền tảng, Express & REST
    ├── lessons-backend-2.js # Khoá 3 – Back-end phần 2: SQL, Bảo mật, Triển khai
    ├── practice-html-css.js # Luyện tập: HTML, CSS, Bố cục (11 bài × 4)
    ├── practice-js.js       # Luyện tập: JavaScript, DOM, JS nâng cao (11 bài × 4)
    ├── practice-fe-pro.js   # Luyện tập: Front-end Nâng cao (13 bài × 3)
    ├── practice-backend.js  # Luyện tập: Back-end nền tảng & Express (10 bài × 3)
    ├── practice-backend-2.js# Luyện tập: SQL, Bảo mật, Triển khai (9 bài × 3)
    ├── node-runtime.js      # Node.js mô phỏng: express, http, fs, crypto, bcrypt, jwt, better-sqlite3…
    ├── playground.js        # Trình soạn code, chạy trong iframe, API Tester, chấm bài
    ├── config.js            # Cấu hình: URL Apps Script, người cấp chứng nhận
    ├── account.js           # Đăng ký học viên, cấp & tra cứu chứng nhận
    ├── chatbot.js           # Trợ lý Bit: offline + tuỳ chọn Gemini/OpenAI
    └── app.js               # Router (#/course/id, #/lesson/id), tiến độ, XP, trắc nghiệm
```

## Lộ trình
### 🧱 Khoá 1 – Front-end Cơ bản (22 bài)
| Cấp | Chủ đề | Số bài |
|---|---|---|
| 1 🧱 | HTML cơ bản | 4 |
| 2 🎨 | CSS – Trang trí | 4 |
| 3 📐 | Flexbox, Grid, Responsive | 3 |
| 4 ⚡ | JavaScript cơ bản | 4 |
| 5 🖱️ | DOM & Sự kiện | 3 |
| 6 🚀 | JS nâng cao + dự án cuối | 4 |

### ⚛️ Khoá 2 – Front-end Nâng cao (13 bài)
| Cấp | Chủ đề | Bài |
|---|---|---|
| 1 🛠️ | Công cụ chuyên nghiệp | Git & GitHub · npm, ES Modules, Vite · Debug với DevTools |
| 2 🧬 | JavaScript hiện đại | Destructuring/spread · Class & OOP · Xử lý lỗi & gọi API · TypeScript |
| 3 🧩 | Tư duy Component | Component · State & render (như useState) · Web Components |
| 4 🏁 | Chất lượng & hiệu năng | Accessibility · Debounce/throttle · Unit test |

### 🟩 Khoá 3 – Back-end Node.js (19 bài)
| Cấp | Chủ đề | Bài |
|---|---|---|
| 1 🌐 | Nền tảng | HTTP & client–server · Node.js · Module & npm · File system bất đồng bộ |
| 2 🚂 | Express & REST API | Module http · Express · Params & query · Middleware · CRUD · Validation & lỗi |
| 3 🗄️ | Cơ sở dữ liệu SQL | SQL cơ bản · UPDATE/DELETE/phân trang · JOIN · API + database |
| 4 🔐 | Bảo mật & xác thực | bcrypt · JWT & phân quyền · SQL injection, CORS, rate limit |
| 5 🚀 | Triển khai & dự án | Biến môi trường & deploy · Dự án cuối: Blog API |

## Bài luyện tập thêm (184 bài)
Mỗi bài học có **1 bài tập chính** (tính tiến độ & chứng nhận) + **3–4 bài luyện tập** theo độ khó tăng dần: 🟢 Dễ → 🔵 Trung bình → 🟠 Khó → 🟣 Thử thách.

| Khoá | Số bài học | Luyện tập / bài | Tổng |
|---|---|---|---|
| 🧱 Front-end Cơ bản | 22 | 4 | 88 |
| ⚛️ Front-end Nâng cao | 13 | 3 | 39 |
| 🟩 Back-end Node.js | 19 | 3 | 57 |

- Chọn bài bằng các tab **🎯 Bài chính / 🏋️ Luyện tập 1, 2, 3…** phía trên đề bài; mở thẳng bằng link `#/lesson/<id>/p2`.
- Mỗi bài luyện tập **+30 XP**, có gợi ý, đáp án, tự chấm điểm như bài chính; code được lưu riêng (`state.code["<id>#p<n>"]`), trạng thái hoàn thành ở `state.pdone`.
- Bài luyện tập có thể là code (HTML/CSS/JS/Node) hoặc trắc nghiệm (`type: "quiz"`); bài Node khai báo thêm `env`, `files`, `requests` riêng nếu cần.
- Sidebar hiện số bài luyện tập đã làm (vd `2/4`), hồ sơ có thống kê + 2 huy hiệu mới (*Siêng luyện tập*, *Bậc thầy luyện tập*).
- **Thêm bài luyện tập:** mở file `js/practice-*.js`, thêm object `{ title, level, task, starter, hint, solution, check }` vào mảng `P["<lessonId>"]`.

## Đăng ký học & chứng nhận
- Học viên phải **đăng ký bằng Gmail + họ tên đầy đủ** trước khi vào bài học (trang chủ, lộ trình, sân chơi vẫn xem tự do).
- Hoàn thành **100% bài của một khoá** → nhận **chứng nhận** do *Trần Doãn Quảng* cấp, có mã riêng (vd `FA-BEN-261116-K7P2Q`), in/lưu PDF khổ A4 ngang.
- Tra cứu chứng nhận: `#/verify/<mã>` hoặc trang **🏅 Chứng nhận**.
- Dữ liệu học viên & chứng nhận lưu vào **Google Sheets** qua Google Apps Script (`apps-script/Code.gs`). Thu hồi một chứng nhận: đổi cột *Trạng thái* thành `Thu hồi`.

### Bật máy chủ Google Sheets (1 lần)
1. Mở Google Sheet *Front-end Academy – Học viên & Chứng nhận* → **Tiện ích mở rộng → Apps Script**.
2. Xoá code mẫu, dán toàn bộ `apps-script/Code.gs` → **Lưu**.
3. **Triển khai → Tùy chọn triển khai mới** → loại **Ứng dụng web** · Thực thi dưới dạng **Tôi** · Quyền truy cập **Bất kỳ ai** → **Triển khai** → cấp quyền.
4. Copy **URL ứng dụng web** (kết thúc bằng `/exec`) dán vào `js/config.js` → `appsScriptUrl`, rồi tăng `?v=` trong `index.html` và push.

Chưa cấu hình `appsScriptUrl` thì web vẫn chạy: đăng ký và chứng nhận chỉ lưu trên máy học viên (chứng nhận ghi "chưa xác minh online").

## Back-end chạy trong trình duyệt như thế nào?
- `node-runtime.js` tạo các biến giống Node (`require`, `module`, `process`, `__dirname`, `Buffer`) bên trong iframe sandbox và cung cấp module mô phỏng: **express** (API giống Express 5), `http`, `fs` (ổ đĩa ảo), `path`, `events`, `crypto` (SHA-256/HMAC thật), `bcryptjs`, `jsonwebtoken` (JWT HS256 thật), `dotenv`, `cors`, **better-sqlite3** (bộ máy SQL mini: CREATE, INSERT, SELECT với WHERE/ORDER BY/LIMIT/LIKE/JOIN/GROUP BY, UPDATE, DELETE).
- Không có server thật: **API Tester** gửi request vào app bằng `postMessage`; khi chấm bài dùng `T.request(method, url, { body, headers })`.
- Bài Back-end khai báo `runtime: "node"`; có thể thêm `env` (biến môi trường), `files` (file có sẵn), `requests`/`exampleRequests` (yêu cầu mẫu).
- Bài trắc nghiệm khai báo `exercise.type = "quiz"` với mảng `questions`.

## Cách hoạt động (để bạn tự mở rộng)
- **Chạy code:** `playground.js` ghép HTML/CSS/JS thành một trang hoàn chỉnh rồi nạp vào `<iframe srcdoc>`. `console.log` và lỗi được bắt lại và gửi về app qua `postMessage`.
- **Chấm bài:** mỗi bài có chuỗi `check` trong `lessons.js`. Đoạn này được chèn **sau** code học viên trong iframe, dùng helper `T.$`, `T.css`, `T.click`, `T.logs`, `T.sleep` và trả về `{ pass, msg }`.
- **Thêm bài mới:** copy một object trong mảng `LESSONS`, đổi `id`, `level`, `content`, `example`, `exercise` là xong – sidebar, trang chủ, tiến độ tự cập nhật. Thêm khoá mới: thêm vào `COURSES` (courses.js) rồi `LEVELS.push({... course: "<id>"})`.
- **Cache:** mỗi lần sửa CSS/JS, tăng số `?v=` trong `index.html` để trình duyệt tải bản mới.
- **Tiến độ:** lưu trong `localStorage` (khoá `fe-academy-v1`).

## Chatbot Bit
- **Offline (mặc định):** trả lời từ kho kiến thức ~45 chủ đề, biết bạn đang ở bài nào, có thể *giải thích bài*, *gợi ý*, *xem đáp án*, *kiểm tra code* (thẻ chưa đóng, thiếu `;`, lỗi cú pháp JS, dùng `=` trong `if`…).
- **AI thật (tuỳ chọn):** bấm ⚙️ trong khung chat → chọn Google Gemini hoặc API tương thích OpenAI, dán API key. Bot sẽ nhận kèm đề bài + code hiện tại của bạn.
- ⚠️ API key được lưu ở `localStorage` của trình duyệt – chỉ phù hợp dùng cá nhân. Nếu đưa web lên mạng cho người khác dùng, hãy chuyển việc gọi AI sang một backend/proxy (vd: Cloudflare Worker) để giấu key.

## Phím tắt trong ô code
- `Ctrl + Enter` / `Ctrl + S`: chạy code
- `Tab` / `Shift + Tab`: thụt lề
- Tự đóng ngoặc `() {} [] "" ''`, Enter giữ thụt lề

## Ý tưởng nâng cấp tiếp
- Thay `<textarea>` bằng **Monaco Editor** (lõi của VS Code) hoặc **CodeMirror 6** để có tô màu & gợi ý code.
- Thêm quiz trắc nghiệm cuối mỗi cấp, chứng chỉ khi hoàn thành.
- Đăng nhập + lưu tiến độ lên cloud (Supabase/Firebase).
- Deploy miễn phí bằng **GitHub Pages**.

## Tác giả
**Doãn Quảng** – thực hiện & phát triển Front-end Academy.
