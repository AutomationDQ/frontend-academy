# 🎓 Front-end Academy

Web app tự học Front-end từ A–Z cho người mới: **22 bài / 6 cấp độ**, mỗi bài có ví dụ chạy thử ngay, bài tập tự chấm điểm và trợ lý chatbot **Bit 🤖**.

## Cách chạy trong VS Code
1. Mở thư mục `frontend-academy` bằng VS Code (`File → Open Folder`).
2. Cài extension **Live Server** (Ritwick Dey).
3. Chuột phải `index.html` → **Open with Live Server**.
   (Cũng có thể mở thẳng `index.html` bằng trình duyệt.)

## Cấu trúc dự án
```
frontend-academy/
├── index.html          # Khung giao diện: sidebar, topbar, chatbot
├── css/style.css       # Toàn bộ giao diện (dark/light theme bằng CSS variables)
└── js/
    ├── lessons.js      # DỮ LIỆU bài học (thêm/sửa bài ở đây)
    ├── playground.js   # Trình soạn code + chạy thử trong iframe + chấm bài
    ├── chatbot.js      # Trợ lý Bit: offline + tuỳ chọn Gemini/OpenAI
    └── app.js          # Router (#/lesson/id), tiến độ, XP, render trang
```

## Lộ trình
| Cấp | Chủ đề | Số bài |
|---|---|---|
| 1 🧱 | HTML cơ bản | 4 |
| 2 🎨 | CSS – Trang trí | 4 |
| 3 📐 | Flexbox, Grid, Responsive | 3 |
| 4 ⚡ | JavaScript cơ bản | 4 |
| 5 🖱️ | DOM & Sự kiện | 3 |
| 6 🚀 | JS nâng cao + dự án cuối | 4 |

## Cách hoạt động (để bạn tự mở rộng)
- **Chạy code:** `playground.js` ghép HTML/CSS/JS thành một trang hoàn chỉnh rồi nạp vào `<iframe srcdoc>`. `console.log` và lỗi được bắt lại và gửi về app qua `postMessage`.
- **Chấm bài:** mỗi bài có chuỗi `check` trong `lessons.js`. Đoạn này được chèn **sau** code học viên trong iframe, dùng helper `T.$`, `T.css`, `T.click`, `T.logs`, `T.sleep` và trả về `{ pass, msg }`.
- **Thêm bài mới:** copy một object trong mảng `LESSONS`, đổi `id`, `level`, `content`, `example`, `exercise` là xong – sidebar, trang chủ, tiến độ tự cập nhật.
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
