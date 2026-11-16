/* =========================================================
   KHOÁ FRONT-END NÂNG CAO – 4 cấp, 13 bài
   Cùng định dạng với lessons.js. Bài trắc nghiệm: exercise.type = "quiz"
   ========================================================= */
LEVELS.push(
  { id: "fe-tools", course: "fe-pro", name: "Công cụ chuyên nghiệp", icon: "🛠️", color: "#0ea5e9", desc: "Git & GitHub, npm, ES Modules, Vite và kỹ năng debug với DevTools." },
  { id: "fe-modern", course: "fe-pro", name: "JavaScript hiện đại", icon: "🧬", color: "#8b5cf6", desc: "Destructuring, spread, class, xử lý lỗi, gọi API thực tế và TypeScript." },
  { id: "fe-component", course: "fe-pro", name: "Tư duy Component", icon: "🧩", color: "#06b6d4", desc: "Chia giao diện thành component, quản lý state và Web Components – nền tảng để học React." },
  { id: "fe-quality", course: "fe-pro", name: "Chất lượng & hiệu năng", icon: "🏁", color: "#f59e0b", desc: "Accessibility (a11y), tối ưu hiệu năng và viết kiểm thử tự động." }
);

LESSONS.push(
  /* ===================== CẤP 1: CÔNG CỤ ===================== */
  {
    id: "git-basics", level: "fe-tools", icon: "🌿", title: "Git & GitHub: quản lý phiên bản code", duration: 20,
    summary: "Git lưu lại lịch sử mọi thay đổi của code; GitHub là nơi lưu trữ và chia sẻ repository trên mạng.",
    content: [
      { h: "Vì sao cần Git?" },
      { p: "Không có Git, bạn sẽ có các file kiểu `index-final-v2-sua-lan-cuoi.html`. **Git** là hệ thống quản lý phiên bản: mỗi lần lưu (gọi là **commit**) là một *ảnh chụp* toàn bộ dự án. Bạn có thể xem lại, so sánh hoặc quay về bất kỳ thời điểm nào." },
      { list: [
        "**Repository (repo)**: thư mục dự án được Git theo dõi (có thư mục ẩn `.git`).",
        "**Commit**: một lần lưu thay đổi kèm lời mô tả.",
        "**Branch (nhánh)**: dòng phát triển riêng – làm tính năng mới mà không ảnh hưởng nhánh chính `main`.",
        "**Remote**: bản sao repo trên máy chủ, ví dụ GitHub (thường tên là `origin`)."
      ] },
      { h: "Ba khu vực của Git" },
      { p: "File đi qua 3 trạng thái: **Working directory** (đang sửa) → `git add` → **Staging area** (đã chọn để lưu) → `git commit` → **Repository** (đã lưu vào lịch sử)." },
      { code: "git init                      # biến thư mục thành repo\ngit status                    # xem file nào đã thay đổi\ngit add index.html            # đưa 1 file vào staging\ngit add .                     # đưa tất cả thay đổi vào staging\ngit commit -m \"Thêm trang chủ\" # lưu ảnh chụp kèm mô tả\ngit log --oneline             # xem lịch sử commit", lang: "bash" },
      { h: "Làm việc với GitHub" },
      { code: "git remote add origin https://github.com/ten-ban/du-an.git\ngit push -u origin main   # đẩy lên lần đầu (ghi nhớ nhánh upstream)\ngit push                  # những lần sau\ngit pull                  # kéo code mới nhất về\ngit clone <url>           # tải nguyên repo về máy", lang: "bash" },
      { h: "Nhánh và Pull Request" },
      { code: "git switch -c tinh-nang-dang-nhap   # tạo + chuyển sang nhánh mới\n# ... sửa code, add, commit ...\ngit push -u origin tinh-nang-dang-nhap\n# Lên GitHub tạo Pull Request để review rồi merge vào main", lang: "bash" },
      { tip: "Commit nhỏ, thường xuyên, mô tả rõ *làm gì*: \"Sửa lỗi nút gửi form\" tốt hơn nhiều so với \"update\"." },
      { warn: "Không bao giờ commit file chứa mật khẩu/API key (ví dụ `.env`). Liệt kê chúng trong file `.gitignore` để Git bỏ qua." }
    ],
    example: { html: "", css: "", js: "" },
    exercise: {
      type: "quiz",
      task: "Trả lời 5 câu hỏi về quy trình Git & GitHub.",
      hint: "Nhớ thứ tự: sửa file → git add → git commit → git push. Nhánh mới: git switch -c.",
      questions: [
        { q: "Thứ tự đúng để lưu thay đổi và đẩy lên GitHub là?", options: ["`git commit` → `git add` → `git push`", "`git add` → `git commit` → `git push`", "`git push` → `git add` → `git commit`", "`git pull` → `git push` → `git add`"], answer: 1, explain: "Chọn file vào staging (add) → lưu vào lịch sử (commit) → đẩy lên remote (push)." },
        { q: "Lệnh nào tạo nhánh mới tên `giao-dien-moi` và chuyển sang nhánh đó?", options: ["`git branch giao-dien-moi --go`", "`git checkout main`", "`git switch -c giao-dien-moi`", "`git merge giao-dien-moi`"], answer: 2, explain: "`git switch -c <tên>` (hoặc cách cũ `git checkout -b <tên>`) tạo và chuyển nhánh." },
        { q: "Bạn vừa đổi máy tính và muốn tải toàn bộ repo từ GitHub về. Dùng lệnh gì?", options: ["`git clone <url>`", "`git init`", "`git commit -m \"tai ve\"`", "`git push`"], answer: 0, explain: "`git clone` tải nguyên repo kèm toàn bộ lịch sử." },
        { q: "File `.env` chứa API key nên được xử lý thế nào?", options: ["Commit bình thường để đồng đội dùng", "Ghi tên file vào `.gitignore` để Git bỏ qua", "Đổi tên thành `env.txt` rồi commit", "Đẩy lên nhánh riêng"], answer: 1, explain: "Bí mật không bao giờ lên Git. Chia sẻ file mẫu `.env.example` (không có giá trị thật) thay thế." },
        { q: "`git pull` báo lỗi *\"There is no tracking information for the current branch\"*. Nguyên nhân?", options: ["Mạng bị lỗi", "Nhánh local chưa liên kết với nhánh trên remote", "Chưa cài Git", "File bị trùng tên"], answer: 1, explain: "Chạy `git branch --set-upstream-to=origin/main main` (hoặc `git push -u` lần đầu) để liên kết." }
      ]
    }
  },
  {
    id: "npm-modules", level: "fe-tools", icon: "📦", title: "npm, ES Modules và Vite", duration: 18,
    summary: "Chia code thành module với import/export, cài thư viện bằng npm và dùng Vite để chạy/build dự án hiện đại.",
    content: [
      { h: "ES Modules: chia code thành nhiều file" },
      { p: "Dự án lớn không thể nằm trong một file. **ES Modules** cho phép mỗi file *xuất* (export) những gì muốn chia sẻ và file khác *nhập* (import) để dùng." },
      { code: "// math.js\nexport function cong(a, b) { return a + b; }\nexport const PI = 3.14159;\nexport default function nhan(a, b) { return a * b; }\n\n// main.js\nimport nhan, { cong, PI } from './math.js';\nconsole.log(cong(2, 3), nhan(2, 3), PI);" },
      { list: [
        "**Named export** (`export function cong`) – import trong ngoặc nhọn đúng tên: `{ cong }`.",
        "**Default export** (`export default`) – mỗi file tối đa 1, import đặt tên tuỳ ý.",
        "Trong trình duyệt cần `<script type=\"module\" src=\"main.js\">`."
      ] },
      { h: "npm – kho thư viện của JavaScript" },
      { p: "**npm** (Node Package Manager) đi kèm Node.js, giúp cài hàng triệu thư viện có sẵn. Mọi thông tin dự án nằm trong `package.json`." },
      { code: "npm init -y              # tạo package.json\nnpm install dayjs        # cài thư viện (ghi vào \"dependencies\")\nnpm install -D vite      # cài công cụ chỉ dùng khi phát triển (\"devDependencies\")\nnpm run dev              # chạy script tên \"dev\" trong package.json", lang: "bash" },
      { code: "{\n  \"name\": \"du-an-cua-toi\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\"\n  },\n  \"dependencies\": { \"dayjs\": \"^1.11.13\" },\n  \"devDependencies\": { \"vite\": \"^7.0.0\" }\n}", lang: "json" },
      { tip: "Thư mục `node_modules` rất nặng – luôn cho vào `.gitignore`. Người khác chỉ cần chạy `npm install` là có lại đầy đủ nhờ `package.json` + `package-lock.json`." },
      { h: "Semantic Versioning: ^1.11.13 nghĩa là gì?" },
      { p: "Phiên bản có dạng **MAJOR.MINOR.PATCH**. Tăng MAJOR = thay đổi phá vỡ tương thích; MINOR = thêm tính năng; PATCH = sửa lỗi. Dấu `^` cho phép cập nhật MINOR và PATCH nhưng giữ nguyên MAJOR." },
      { h: "Vite – công cụ build siêu nhanh" },
      { code: "npm create vite@latest my-app   # chọn Vanilla / React / Vue...\ncd my-app\nnpm install\nnpm run dev      # server phát triển, sửa code là trình duyệt cập nhật ngay\nnpm run build    # tạo thư mục dist/ tối ưu để deploy", lang: "bash" }
    ],
    example: { html: "", css: "", js: "" },
    exercise: {
      type: "quiz",
      task: "Trả lời 5 câu hỏi về module, npm và Vite.",
      hint: "Named export dùng ngoặc nhọn khi import; default thì không. -D là devDependencies.",
      questions: [
        { q: "File `utils.js` có `export function dinhDangTien(x) {...}`. Import đúng là?", options: ["`import dinhDangTien from './utils.js'`", "`import { dinhDangTien } from './utils.js'`", "`require dinhDangTien`", "`import * dinhDangTien`"], answer: 1, explain: "Named export phải import trong ngoặc nhọn và đúng tên." },
        { q: "Lệnh nào cài Vite như công cụ phát triển (devDependency)?", options: ["`npm install vite`", "`npm install -D vite`", "`npm run vite`", "`npm init vite`"], answer: 1, explain: "Cờ `-D` (`--save-dev`) ghi vào devDependencies – không cần khi chạy production." },
        { q: "Có nên commit thư mục `node_modules` lên GitHub?", options: ["Có, để người khác khỏi cài", "Không – thêm vào `.gitignore`, người khác chạy `npm install`", "Chỉ commit khi dự án nhỏ", "Chỉ commit trên nhánh main"], answer: 1, explain: "`package.json` + `package-lock.json` đủ để tái tạo chính xác node_modules." },
        { q: "Với `\"dayjs\": \"^1.11.13\"`, npm có thể cài phiên bản nào?", options: ["2.0.0", "1.12.0", "0.9.0", "Chỉ đúng 1.11.13"], answer: 1, explain: "`^` cho phép tăng MINOR/PATCH (1.x.x) nhưng không lên MAJOR 2." },
        { q: "`npm run build` trong dự án Vite tạo ra gì?", options: ["Cài lại thư viện", "Thư mục `dist/` chứa file đã tối ưu để deploy", "Một commit mới", "File package.json"], answer: 1, explain: "Vite gộp, nén và tối ưu code vào `dist/` – thứ bạn đưa lên hosting." }
      ]
    }
  },
  {
    id: "devtools-debug", level: "fe-tools", icon: "🐞", title: "Debug như dân chuyên: DevTools & console", duration: 18,
    summary: "Tìm lỗi có hệ thống: đọc thông báo lỗi, console.log đúng chỗ, breakpoint và các lỗi JavaScript kinh điển.",
    content: [
      { h: "Quy trình debug 4 bước" },
      { list: [
        "**Tái hiện**: làm lỗi xảy ra lại một cách chắc chắn.",
        "**Khoanh vùng**: lỗi ở HTML, CSS hay JS? Ở hàm nào, dòng nào?",
        "**Kiểm chứng giả thuyết**: in giá trị ra (`console.log`) hoặc đặt breakpoint.",
        "**Sửa và kiểm tra lại**: chạy lại đúng kịch bản ban đầu."
      ] },
      { h: "Mở DevTools" },
      { p: "Nhấn **F12** (hoặc Ctrl+Shift+I). Các tab quan trọng: **Console** (lỗi + log), **Elements** (HTML/CSS trực tiếp), **Sources** (đặt breakpoint), **Network** (xem request gọi API)." },
      { h: "console có nhiều hơn log" },
      { code: "console.log('Giá trị:', x);\nconsole.table([{ ten: 'An', diem: 9 }, { ten: 'Bình', diem: 7 }]);\nconsole.warn('Cảnh báo');\nconsole.error('Lỗi!');\nconsole.time('vong-lap'); /* ... */ console.timeEnd('vong-lap');\ndebugger; // trình duyệt dừng tại đây khi DevTools đang mở" },
      { h: "Các lỗi kinh điển" },
      { list: [
        "**Cộng chuỗi thay vì cộng số**: giá trị từ input luôn là *chuỗi* → `\"10\" + 5 = \"105\"`. Dùng `Number(x)`.",
        "**So sánh bằng `==`**: `0 == \"\"` là `true`! Luôn dùng `===`.",
        "**Gán thay vì so sánh**: `if (x = 5)` luôn đúng. Phải là `if (x === 5)`.",
        "**undefined do sai tên thuộc tính**: `user.Name` khác `user.name`.",
        "**Sai biên vòng lặp**: `i <= arr.length` đọc thừa một phần tử."
      ] },
      { tip: "Đọc kỹ thông báo lỗi: `TypeError: Cannot read properties of undefined (reading 'gia')` nghĩa là bạn đang đọc `.gia` từ một thứ đang là `undefined`." }
    ],
    example: {
      html: "<h3>Mở tab Console bên dưới 👇</h3>",
      css: "",
      js: "const gioHang = [\n  { ten: 'Bút', gia: '5000', soLuong: 2 },\n  { ten: 'Vở', gia: '12000', soLuong: 1 }\n];\nconsole.table(gioHang);\n\n// Lỗi cộng chuỗi kinh điển:\nconsole.log('Sai:', gioHang[0].gia + gioHang[1].gia);\nconsole.log('Đúng:', Number(gioHang[0].gia) + Number(gioHang[1].gia));"
    },
    exercise: {
      task: "Hàm `tinhTongTien(gioHang)` đang có **3 lỗi** khiến kết quả sai. Hãy debug và sửa để hàm trả về đúng tổng tiền (số) = tổng của `gia × soLuong`, và trả về `0` khi giỏ hàng rỗng.",
      starter: { html: "", css: "", js: "function tinhTongTien(gioHang) {\n  let tong = '';\n  for (let i = 0; i <= gioHang.length; i++) {\n    const sp = gioHang[i];\n    tong = tong + sp.gia * sp.soluong;\n  }\n  return tong;\n}\n\nconst gio = [\n  { ten: 'Bút', gia: '5000', soLuong: 2 },\n  { ten: 'Vở', gia: '12000', soLuong: 1 }\n];\nconsole.log('Tổng:', tinhTongTien(gio)); // mong đợi 22000\n" },
      hint: "Lỗi 1: tong khởi tạo bằng chuỗi. Lỗi 2: vòng lặp dùng <= nên đọc phần tử undefined. Lỗi 3: soluong sai chữ hoa (soLuong).",
      solution: { html: "", css: "", js: "function tinhTongTien(gioHang) {\n  let tong = 0;\n  for (let i = 0; i < gioHang.length; i++) {\n    const sp = gioHang[i];\n    tong = tong + Number(sp.gia) * sp.soLuong;\n  }\n  return tong;\n}\n\nconst gio = [\n  { ten: 'Bút', gia: '5000', soLuong: 2 },\n  { ten: 'Vở', gia: '12000', soLuong: 1 }\n];\nconsole.log('Tổng:', tinhTongTien(gio)); // 22000\n" },
      check: `
        if (typeof tinhTongTien !== "function") return {pass:false, msg:"Không tìm thấy hàm tinhTongTien."};
        let r;
        try { r = tinhTongTien([{ten:"A",gia:"5000",soLuong:2},{ten:"B",gia:"12000",soLuong:1}]); }
        catch (e) { return {pass:false, msg:"Hàm vẫn gây lỗi: " + e.message}; }
        if (typeof r !== "number") return {pass:false, msg:"Kết quả đang là " + typeof r + " (" + JSON.stringify(r) + ") – phải là số. Kiểm tra giá trị khởi tạo của tong."};
        if (r !== 22000) return {pass:false, msg:"Tổng ra " + r + ", mong đợi 22000. Kiểm tra tên thuộc tính soLuong."};
        if (tinhTongTien([]) !== 0) return {pass:false, msg:"Giỏ hàng rỗng phải trả về 0."};
        if (tinhTongTien([{gia:"1500",soLuong:3}]) !== 4500) return {pass:false, msg:"Sai với giỏ 1 sản phẩm (1500 × 3)."};
        return {pass:true, msg:"Bắt bọ thành công cả 3 lỗi! 🐞🔨"};`
    }
  },

  /* ===================== CẤP 2: JAVASCRIPT HIỆN ĐẠI ===================== */
  {
    id: "js-destructuring", level: "fe-modern", icon: "🎁", title: "Destructuring, spread và optional chaining", duration: 20,
    summary: "Cú pháp ES6+ giúp code ngắn và an toàn hơn: tách giá trị, gộp object/mảng, đọc thuộc tính lồng nhau không sợ lỗi.",
    content: [
      { h: "Destructuring – tách giá trị" },
      { code: "const user = { ten: 'An', tuoi: 22, diaChi: { thanhPho: 'Đà Nẵng' } };\nconst { ten, tuoi } = user;                 // lấy thuộc tính\nconst { ten: hoTen } = user;                // đổi tên biến\nconst { quocGia = 'Việt Nam' } = user;      // giá trị mặc định\nconst { diaChi: { thanhPho } } = user;      // lồng nhau\n\nconst [dau, thuHai, ...conLai] = [10, 20, 30, 40];\n// dau = 10, thuHai = 20, conLai = [30, 40]" },
      { p: "Rất hay dùng ở **tham số hàm**:" },
      { code: "function chao({ ten, tuoi = 18 }) {\n  return `Xin chào ${ten}, ${tuoi} tuổi`;\n}\nchao({ ten: 'Bình' }); // \"Xin chào Bình, 18 tuổi\"" },
      { h: "Spread ... – trải ra và gộp" },
      { code: "const a = [1, 2], b = [3, 4];\nconst gop = [...a, ...b, 5];           // [1, 2, 3, 4, 5]\nconst macDinh = { theme: 'light', lang: 'vi' };\nconst caiDat = { ...macDinh, theme: 'dark' }; // ghi đè theme\nconst banSao = { ...user };            // sao chép nông (shallow copy)" },
      { tip: "Thứ tự quan trọng: thuộc tính viết **sau** sẽ ghi đè thuộc tính trước. `{ ...macDinh, ...tuyChinh }` = tuỳ chỉnh thắng." },
      { h: "Optional chaining ?. và nullish ??" },
      { code: "const sp = { ten: 'Áo', khuyenMai: null };\nsp.nhaCungCap?.ten        // undefined (không lỗi!)\nsp.khuyenMai?.phanTram    // undefined\nconst giam = sp.khuyenMai?.phanTram ?? 0;  // 0\n\n// ?? chỉ thay thế null/undefined; || thay cả 0, '' , false\n0 || 10   // 10\n0 ?? 10   // 0" }
    ],
    example: {
      html: "", css: "",
      js: "const sanPham = { ten: 'Laptop', gia: 15000000, thongSo: { ram: 16 } };\nconst { ten, gia, thongSo: { ram }, baoHanh = 12 } = sanPham;\nconsole.log(ten, gia, ram + 'GB', baoHanh + ' tháng');\n\nconst capNhat = { ...sanPham, gia: 14000000 };\nconsole.log('Giá mới:', capNhat.gia, '| Giá cũ:', sanPham.gia);\n\nconsole.log('Màu:', sanPham.mau?.ten ?? 'chưa có');"
    },
    exercise: {
      task: "Viết 2 hàm:\n1) `tomTatDonHang(don)` trả về chuỗi `\"<tên khách> - <số món> món - <thành phố>\"`. Dùng **destructuring**; nếu thiếu `khach.diaChi.thanhPho` thì dùng `\"Chưa rõ\"` (dùng `?.` và `??`).\n2) `gopCaiDat(macDinh, tuyChinh)` trả về **object mới** gộp hai object (tuỳ chỉnh ghi đè), không sửa object gốc.",
      starter: { html: "", css: "", js: "function tomTatDonHang(don) {\n  // const { khach, mon } = don; ...\n}\n\nfunction gopCaiDat(macDinh, tuyChinh) {\n  \n}\n\nconsole.log(tomTatDonHang({ khach: { ten: 'An', diaChi: { thanhPho: 'Huế' } }, mon: ['Phở', 'Trà'] }));\nconsole.log(gopCaiDat({ theme: 'light', lang: 'vi' }, { theme: 'dark' }));\n" },
      hint: "const { khach, mon } = don; const thanhPho = khach.diaChi?.thanhPho ?? 'Chưa rõ'; return `${khach.ten} - ${mon.length} món - ${thanhPho}`. Gộp: return { ...macDinh, ...tuyChinh }.",
      solution: { html: "", css: "", js: "function tomTatDonHang(don) {\n  const { khach, mon } = don;\n  const thanhPho = khach.diaChi?.thanhPho ?? 'Chưa rõ';\n  return `${khach.ten} - ${mon.length} món - ${thanhPho}`;\n}\n\nfunction gopCaiDat(macDinh, tuyChinh) {\n  return { ...macDinh, ...tuyChinh };\n}\n\nconsole.log(tomTatDonHang({ khach: { ten: 'An', diaChi: { thanhPho: 'Huế' } }, mon: ['Phở', 'Trà'] }));\nconsole.log(gopCaiDat({ theme: 'light', lang: 'vi' }, { theme: 'dark' }));\n" },
      check: `
        if (typeof tomTatDonHang !== "function" || typeof gopCaiDat !== "function") return {pass:false, msg:"Cần định nghĩa cả hai hàm tomTatDonHang và gopCaiDat."};
        let a, b;
        try { a = tomTatDonHang({ khach: { ten: "Bình", diaChi: { thanhPho: "Cần Thơ" } }, mon: ["A","B","C"] }); } catch (e) { return {pass:false, msg:"tomTatDonHang lỗi: " + e.message}; }
        if (a !== "Bình - 3 món - Cần Thơ") return {pass:false, msg:"tomTatDonHang trả về \\"" + a + "\\" – mong đợi \\"Bình - 3 món - Cần Thơ\\"."};
        try { b = tomTatDonHang({ khach: { ten: "Chi" }, mon: [] }); } catch (e) { return {pass:false, msg:"Khi khách không có diaChi, hàm bị lỗi: " + e.message + " – hãy dùng ?."}; }
        if (b !== "Chi - 0 món - Chưa rõ") return {pass:false, msg:"Thiếu địa chỉ phải ra \\"Chi - 0 món - Chưa rõ\\", đang ra \\"" + b + "\\"."};
        const md = { theme: "light", lang: "vi", size: 14 }, tc = { theme: "dark" };
        const g = gopCaiDat(md, tc);
        if (!g || g.theme !== "dark" || g.lang !== "vi" || g.size !== 14) return {pass:false, msg:"gopCaiDat chưa gộp đúng (tuỳ chỉnh phải ghi đè mặc định)."};
        if (md.theme !== "light" || g === md || g === tc) return {pass:false, msg:"gopCaiDat không được sửa object gốc – hãy tạo object mới bằng spread."};
        return {pass:true, msg:"Code gọn và an toàn như dân chuyên! 🎁"};`
    }
  },
  {
    id: "js-classes", level: "fe-modern", icon: "🏛️", title: "Class và lập trình hướng đối tượng", duration: 22,
    summary: "Đóng gói dữ liệu và hành vi vào class: constructor, method, getter, kế thừa với extends và trường private #.",
    content: [
      { h: "Class là bản thiết kế" },
      { p: "**Class** mô tả một loại đối tượng: có *dữ liệu* (thuộc tính) và *hành vi* (phương thức). Mỗi lần `new` sẽ tạo ra một **instance** (đối tượng cụ thể)." },
      { code: "class SanPham {\n  constructor(ten, gia) {\n    this.ten = ten;\n    this.gia = gia;\n  }\n  giamGia(phanTram) {\n    this.gia = this.gia * (1 - phanTram / 100);\n    return this;                 // trả this để gọi nối tiếp\n  }\n  get giaHienThi() {             // getter: dùng như thuộc tính\n    return this.gia.toLocaleString('vi-VN') + 'đ';\n  }\n  static soSanh(a, b) { return a.gia - b.gia; } // gọi qua class\n}\n\nconst ao = new SanPham('Áo thun', 200000);\nao.giamGia(10);\nconsole.log(ao.giaHienThi);      // \"180.000đ\"" },
      { h: "Trường private với #" },
      { code: "class ViTien {\n  #soDu = 0;                     // chỉ truy cập được bên trong class\n  nap(x) { this.#soDu += x; }\n  get soDu() { return this.#soDu; }\n}\nconst v = new ViTien();\nv.nap(50000);\nv.soDu;     // 50000\n// v.#soDu  → SyntaxError: không thể truy cập từ bên ngoài" },
      { h: "Kế thừa với extends và super" },
      { code: "class SachDienTu extends SanPham {\n  constructor(ten, gia, dungLuongMB) {\n    super(ten, gia);             // gọi constructor của lớp cha\n    this.dungLuongMB = dungLuongMB;\n  }\n  get giaHienThi() {\n    return super.giaHienThi + ' (ebook)';\n  }\n}" },
      { h: "Ném lỗi khi dữ liệu không hợp lệ" },
      { code: "rut(x) {\n  if (x > this.#soDu) throw new Error('Số dư không đủ');\n  this.#soDu -= x;\n}" },
      { tip: "React dùng function component là chính, nhưng class vẫn xuất hiện khắp nơi: Web Components, Node.js, lỗi tuỳ chỉnh (`class AppError extends Error`)…" }
    ],
    example: {
      html: "", css: "",
      js: "class ConVat {\n  constructor(ten) { this.ten = ten; }\n  keu() { return this.ten + ' phát ra âm thanh'; }\n}\nclass Cho extends ConVat {\n  keu() { return this.ten + ' sủa gâu gâu 🐶'; }\n}\nconst ds = [new ConVat('Vật nuôi'), new Cho('Milu')];\nds.forEach(c => console.log(c.keu()));\nconsole.log(ds[1] instanceof ConVat); // true"
    },
    exercise: {
      task: "Tạo class `TaiKhoan`:\n• `constructor(chuTaiKhoan)` – số dư ban đầu 0 (lưu trong trường private `#soDu`).\n• `napTien(x)`: tăng số dư; nếu `x <= 0` thì `throw new Error(...)`.\n• `rutTien(x)`: giảm số dư; nếu `x` lớn hơn số dư thì `throw new Error(\"Số dư không đủ\")`.\n• getter `soDu` trả về số dư.\nTạo class `TaiKhoanTietKiem extends TaiKhoan` có phương thức `tinhLai(phanTram)` cộng lãi vào số dư (vd 1000000 với 5% → 1050000) và trả về số tiền lãi.",
      starter: { html: "", css: "", js: "class TaiKhoan {\n  #soDu = 0;\n  constructor(chuTaiKhoan) {\n    this.chuTaiKhoan = chuTaiKhoan;\n  }\n  // napTien, rutTien, get soDu ...\n}\n\nclass TaiKhoanTietKiem extends TaiKhoan {\n  // tinhLai(phanTram) ...\n}\n\nconst tk = new TaiKhoanTietKiem('An');\ntk.napTien(1000000);\nconsole.log(tk.tinhLai(5), tk.soDu);\n" },
      hint: "Lớp con không truy cập được #soDu của lớp cha – trong tinhLai hãy dùng this.soDu (getter) và this.napTien(lai).",
      solution: { html: "", css: "", js: "class TaiKhoan {\n  #soDu = 0;\n  constructor(chuTaiKhoan) {\n    this.chuTaiKhoan = chuTaiKhoan;\n  }\n  napTien(x) {\n    if (x <= 0) throw new Error('Số tiền nạp phải lớn hơn 0');\n    this.#soDu += x;\n  }\n  rutTien(x) {\n    if (x > this.#soDu) throw new Error('Số dư không đủ');\n    this.#soDu -= x;\n  }\n  get soDu() {\n    return this.#soDu;\n  }\n}\n\nclass TaiKhoanTietKiem extends TaiKhoan {\n  tinhLai(phanTram) {\n    const lai = this.soDu * phanTram / 100;\n    this.napTien(lai);\n    return lai;\n  }\n}\n\nconst tk = new TaiKhoanTietKiem('An');\ntk.napTien(1000000);\nconsole.log(tk.tinhLai(5), tk.soDu);\n" },
      check: `
        if (typeof TaiKhoan !== "function" || typeof TaiKhoanTietKiem !== "function") return {pass:false, msg:"Cần có class TaiKhoan và TaiKhoanTietKiem."};
        const t = new TaiKhoan("Test");
        if (t.chuTaiKhoan !== "Test") return {pass:false, msg:"constructor cần lưu this.chuTaiKhoan."};
        if (t.soDu !== 0) return {pass:false, msg:"Số dư ban đầu phải là 0 (getter soDu)."};
        t.napTien(500); t.rutTien(200);
        if (t.soDu !== 300) return {pass:false, msg:"Sau nạp 500, rút 200 số dư phải là 300, đang là " + t.soDu + "."};
        let threw = false; try { t.rutTien(1000); } catch (e) { threw = true; }
        if (!threw) return {pass:false, msg:"rutTien quá số dư phải throw Error."};
        if (t.soDu !== 300) return {pass:false, msg:"Rút thất bại không được làm thay đổi số dư."};
        threw = false; try { t.napTien(-5); } catch (e) { threw = true; }
        if (!threw) return {pass:false, msg:"napTien với số <= 0 phải throw Error."};
        if ("soDu" in t && Object.getOwnPropertyDescriptor(t, "soDu")) return {pass:false, msg:"Số dư nên lưu trong trường private #soDu, không phải thuộc tính công khai."};
        const s = new TaiKhoanTietKiem("B");
        if (!(s instanceof TaiKhoan)) return {pass:false, msg:"TaiKhoanTietKiem phải extends TaiKhoan."};
        s.napTien(1000000); const lai = s.tinhLai(5);
        if (lai !== 50000 || s.soDu !== 1050000) return {pass:false, msg:"tinhLai(5) với 1.000.000 phải trả 50000 và số dư thành 1.050.000 (đang: lãi " + lai + ", số dư " + s.soDu + ")."};
        return {pass:true, msg:"Hướng đối tượng chuẩn chỉnh! 🏛️"};`
    }
  },
  {
    id: "js-errors-fetch", level: "fe-modern", icon: "🛡️", title: "Xử lý lỗi & gọi API thực tế", duration: 22,
    summary: "try/catch/finally, lỗi tuỳ chỉnh và cách gọi API đúng chuẩn: kiểm tra response.ok, timeout và hiển thị trạng thái.",
    content: [
      { h: "try / catch / finally" },
      { code: "try {\n  const data = JSON.parse('{sai cú pháp}');\n} catch (err) {\n  console.error('Không đọc được JSON:', err.message);\n} finally {\n  console.log('Luôn chạy – dù thành công hay lỗi');\n}" },
      { h: "Tự tạo lỗi có ý nghĩa" },
      { code: "class HttpError extends Error {\n  constructor(status, message) {\n    super(message);\n    this.name = 'HttpError';\n    this.status = status;\n  }\n}\nthrow new HttpError(404, 'Không tìm thấy sản phẩm');" },
      { h: "Bẫy kinh điển của fetch" },
      { warn: "`fetch` **không** báo lỗi khi server trả 404 hay 500! Nó chỉ reject khi *mất mạng*. Bạn phải tự kiểm tra `response.ok` (true khi status 200–299)." },
      { code: "async function layDanhSach() {\n  const res = await fetch('https://api.example.com/products');\n  if (!res.ok) throw new HttpError(res.status, 'Lỗi HTTP ' + res.status);\n  return res.json();\n}\n\n// Gửi dữ liệu (POST)\nawait fetch('/api/todos', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ title: 'Học fetch' })\n});" },
      { h: "Hiển thị 3 trạng thái: đang tải – thành công – lỗi" },
      { code: "status.textContent = 'Đang tải…';\ntry {\n  const ds = await layDanhSach();\n  render(ds);\n  status.textContent = '';\n} catch (e) {\n  status.textContent = '⚠️ ' + e.message + ' – thử lại sau';\n}" },
      { h: "Timeout với AbortController" },
      { code: "const ctrl = new AbortController();\nconst timer = setTimeout(() => ctrl.abort(), 5000);\ntry {\n  const res = await fetch(url, { signal: ctrl.signal });\n} finally {\n  clearTimeout(timer);\n}" },
      { tip: "Trong bài tập, hàm nhận thêm tham số `fetchFn` (mặc định là `fetch`). Kỹ thuật này gọi là *dependency injection* – giúp kiểm thử mà không cần mạng thật." }
    ],
    example: {
      html: "<button id=\"btn\">Tải dữ liệu</button>\n<p id=\"status\"></p>\n<ul id=\"list\"></ul>",
      css: "body{font-family:sans-serif;padding:16px} #status{color:#64748b}",
      js: "// fetch giả lập: 50% thành công, 50% lỗi 500\nconst fakeFetch = () => new Promise(r => setTimeout(() => {\n  const ok = Math.random() > 0.5;\n  r({ ok, status: ok ? 200 : 500, json: async () => ['Phở', 'Bún chả', 'Cơm tấm'] });\n}, 600));\n\ndocument.querySelector('#btn').onclick = async () => {\n  const status = document.querySelector('#status');\n  const list = document.querySelector('#list');\n  status.textContent = '⏳ Đang tải…'; list.innerHTML = '';\n  try {\n    const res = await fakeFetch();\n    if (!res.ok) throw new Error('Server lỗi ' + res.status);\n    const mon = await res.json();\n    list.innerHTML = mon.map(m => '<li>' + m + '</li>').join('');\n    status.textContent = '✅ Thành công';\n  } catch (e) {\n    status.textContent = '⚠️ ' + e.message + ' – bấm lại nhé';\n  }\n};"
    },
    exercise: {
      task: "Viết `async function layDuLieu(url, fetchFn = fetch)`:\n• Gọi `await fetchFn(url)`.\n• Nếu `res.ok` là false → `throw new Error(\"HTTP \" + res.status)` (vd \"HTTP 404\").\n• Nếu ok → trả về `await res.json()`.\nViết thêm `async function layAnToan(url, fetchFn = fetch)` gọi `layDuLieu` và **không bao giờ ném lỗi**: thành công trả `{ ok: true, data }`, thất bại (kể cả mất mạng) trả `{ ok: false, error: <message> }`.",
      starter: { html: "", css: "", js: "async function layDuLieu(url, fetchFn = fetch) {\n  \n}\n\nasync function layAnToan(url, fetchFn = fetch) {\n  \n}\n" },
      hint: "layAnToan: try { const data = await layDuLieu(url, fetchFn); return { ok: true, data }; } catch (e) { return { ok: false, error: e.message }; }",
      solution: { html: "", css: "", js: "async function layDuLieu(url, fetchFn = fetch) {\n  const res = await fetchFn(url);\n  if (!res.ok) throw new Error('HTTP ' + res.status);\n  return await res.json();\n}\n\nasync function layAnToan(url, fetchFn = fetch) {\n  try {\n    const data = await layDuLieu(url, fetchFn);\n    return { ok: true, data };\n  } catch (e) {\n    return { ok: false, error: e.message };\n  }\n}\n" },
      check: `
        if (typeof layDuLieu !== "function" || typeof layAnToan !== "function") return {pass:false, msg:"Cần có hai hàm layDuLieu và layAnToan."};
        const okF = async u => ({ ok: true, status: 200, json: async () => ({ url: u, items: [1,2] }) });
        const nfF = async () => ({ ok: false, status: 404, json: async () => ({}) });
        const netF = async () => { throw new TypeError("Failed to fetch"); };
        let d; try { d = await layDuLieu("/api/x", okF); } catch (e) { return {pass:false, msg:"layDuLieu lỗi khi response ok: " + e.message}; }
        if (!d || d.url !== "/api/x" || !Array.isArray(d.items)) return {pass:false, msg:"layDuLieu cần trả về await res.json()."};
        let msg = null; try { await layDuLieu("/x", nfF); } catch (e) { msg = e.message; }
        if (msg === null) return {pass:false, msg:"Khi res.ok là false (404), layDuLieu phải throw Error."};
        if (msg !== "HTTP 404") return {pass:false, msg:"Thông báo lỗi nên là \\"HTTP 404\\", đang là \\"" + msg + "\\"."};
        let a; try { a = await layAnToan("/x", okF); } catch (e) { return {pass:false, msg:"layAnToan không được ném lỗi."}; }
        if (!a || a.ok !== true || !a.data) return {pass:false, msg:"layAnToan khi thành công phải trả { ok: true, data }."};
        let b, c; try { b = await layAnToan("/x", nfF); c = await layAnToan("/x", netF); } catch (e) { return {pass:false, msg:"layAnToan không bao giờ được ném lỗi – hãy dùng try/catch."}; }
        if (!b || b.ok !== false || b.error !== "HTTP 404") return {pass:false, msg:"Lỗi 404 → { ok: false, error: \\"HTTP 404\\" }."};
        if (!c || c.ok !== false || c.error !== "Failed to fetch") return {pass:false, msg:"Mất mạng → { ok: false, error: \\"Failed to fetch\\" }."};
        return {pass:true, msg:"Gọi API chống đạn! 🛡️"};`
    }
  },
  {
    id: "typescript-basics", level: "fe-modern", icon: "🔷", title: "TypeScript cơ bản", duration: 22,
    summary: "TypeScript thêm kiểu dữ liệu cho JavaScript, giúp phát hiện lỗi ngay khi gõ code thay vì lúc người dùng gặp.",
    content: [
      { h: "Vì sao TypeScript?" },
      { p: "JavaScript chỉ báo lỗi khi *chạy*. **TypeScript (TS)** kiểm tra kiểu *trước khi chạy*: truyền sai kiểu, gõ sai tên thuộc tính, quên xử lý `undefined`… đều bị gạch đỏ trong VS Code. TS được biên dịch (compile) thành JavaScript thường." },
      { code: "let ten: string = 'An';\nlet tuoi: number = 22;\nlet daKichHoat: boolean = true;\nlet diem: number[] = [8, 9, 10];\nlet id: string | number;        // union: string HOẶC number\n\nfunction cong(a: number, b: number): number {\n  return a + b;\n}\ncong(1, '2'); // ❌ Lỗi: '2' không phải number", lang: "ts" },
      { h: "Mô tả hình dạng object: type và interface" },
      { code: "interface SanPham {\n  id: number;\n  ten: string;\n  gia: number;\n  moTa?: string;                 // ? = không bắt buộc\n  readonly ngayTao: Date;        // không được gán lại\n}\n\ntype TrangThai = 'cho-xu-ly' | 'dang-giao' | 'da-giao';  // literal type\n\nfunction inGia(sp: SanPham): string {\n  return sp.ten + ': ' + sp.gia.toLocaleString('vi-VN') + 'đ';\n}", lang: "ts" },
      { h: "Generic – kiểu dữ liệu dạng tham số" },
      { code: "function phanTuDau<T>(mang: T[]): T | undefined {\n  return mang[0];\n}\nconst so = phanTuDau([1, 2, 3]);       // so: number | undefined\nconst chu = phanTuDau(['a', 'b']);     // chu: string | undefined\n\ninterface ApiResponse<T> { data: T; error?: string; }", lang: "ts" },
      { h: "Thu hẹp kiểu (narrowing)" },
      { code: "function dinhDang(x: string | number) {\n  if (typeof x === 'number') return x.toFixed(2); // ở đây x là number\n  return x.toUpperCase();                         // ở đây x là string\n}", lang: "ts" },
      { tip: "Bắt đầu nhanh: `npm create vite@latest` → chọn **Vanilla + TypeScript** hoặc **React + TypeScript**. File đuôi `.ts` / `.tsx`." }
    ],
    example: { html: "", css: "", js: "" },
    exercise: {
      type: "quiz",
      task: "Đọc code TypeScript và trả lời 5 câu hỏi.",
      hint: "Dấu ? nghĩa là tuỳ chọn; union | là 'hoặc'; generic <T> giữ nguyên kiểu đầu vào.",
      questions: [
        { q: "Dòng nào gây lỗi TypeScript?", code: "function tinhThue(gia: number): number {\n  return gia * 0.1;\n}", options: ["`tinhThue(100)`", "`tinhThue('100')`", "`tinhThue(99.5)`", "`const t: number = tinhThue(0)`"], answer: 1, explain: "Tham số `gia` có kiểu number, truyền chuỗi `'100'` sẽ bị báo lỗi ngay khi gõ." },
        { q: "Với interface dưới đây, object nào hợp lệ?", code: "interface User {\n  id: number;\n  ten: string;\n  email?: string;\n}", options: ["`{ id: 1 }`", "`{ id: '1', ten: 'An' }`", "`{ id: 1, ten: 'An' }`", "`{ ten: 'An', email: 'a@x.com' }`"], answer: 2, explain: "`id` và `ten` bắt buộc đúng kiểu; `email?` có thể bỏ qua." },
        { q: "`type TrangThai = 'mo' | 'dong'`. Gán `let t: TrangThai = 'tam-dung'` thì sao?", options: ["Hợp lệ", "Lỗi – chỉ nhận 'mo' hoặc 'dong'", "Tự đổi thành 'mo'", "Chỉ lỗi khi chạy"], answer: 1, explain: "Literal union giới hạn đúng các giá trị được liệt kê – rất hữu ích cho trạng thái đơn hàng, theme…" },
        { q: "`phanTuDau(['x', 'y'])` trả về kiểu gì?", code: "function phanTuDau<T>(mang: T[]): T | undefined {\n  return mang[0];\n}", options: ["`any`", "`string[]`", "`string | undefined`", "`number`"], answer: 2, explain: "Generic suy ra T = string; mảng có thể rỗng nên kèm `undefined`." },
        { q: "TypeScript chạy trong trình duyệt như thế nào?", options: ["Trình duyệt hiểu TS trực tiếp", "TS được biên dịch thành JavaScript rồi mới chạy", "Phải cài plugin cho Chrome", "Chỉ chạy được trên server"], answer: 1, explain: "Công cụ như `tsc` hoặc Vite chuyển `.ts` thành `.js`; kiểu dữ liệu bị xoá đi khi biên dịch." }
      ]
    }
  },

  /* ===================== CẤP 3: TƯ DUY COMPONENT ===================== */
  {
    id: "component-thinking", level: "fe-component", icon: "🧩", title: "Component: chia giao diện thành khối", duration: 22,
    summary: "Component là hàm nhận dữ liệu (props) và trả về giao diện. Ghép component nhỏ thành trang lớn – đúng tư duy của React/Vue.",
    content: [
      { h: "Nhìn trang web như những khối LEGO" },
      { p: "Một trang bán hàng gồm: `Header`, `ThanhTimKiem`, `DanhSachSanPham` → nhiều `TheSanPham`, `Footer`. Mỗi khối là một **component**: tự chứa giao diện, nhận dữ liệu qua **props**, có thể tái sử dụng." },
      { h: "Component = hàm trả về giao diện" },
      { code: "function TheSanPham({ ten, gia }) {\n  return `\n    <div class=\"card\">\n      <h3>${ten}</h3>\n      <p class=\"gia\">${gia.toLocaleString('vi-VN')}đ</p>\n    </div>`;\n}\n\nfunction DanhSach(sanPhams) {\n  return `<div class=\"grid\">${sanPhams.map(TheSanPham).join('')}</div>`;\n}\n\ndocument.querySelector('#app').innerHTML = DanhSach(data);" },
      { h: "So sánh với React" },
      { code: "// React (JSX) – cùng một ý tưởng:\nfunction TheSanPham({ ten, gia }) {\n  return (\n    <div className=\"card\">\n      <h3>{ten}</h3>\n      <p className=\"gia\">{gia.toLocaleString('vi-VN')}đ</p>\n    </div>\n  );\n}\nfunction DanhSach({ sanPhams }) {\n  return <div className=\"grid\">{sanPhams.map(sp => <TheSanPham key={sp.id} {...sp} />)}</div>;\n}" },
      { list: [
        "**Props đi một chiều**: cha truyền xuống con; con không sửa props.",
        "**Một component – một nhiệm vụ**: dễ đọc, dễ kiểm thử, dễ tái sử dụng.",
        "**Danh sách cần key** (trong React) để biết phần tử nào thay đổi."
      ] },
      { warn: "Khi chèn dữ liệu người dùng nhập vào `innerHTML`, kẻ xấu có thể chèn `<script>` (lỗi **XSS**). Dữ liệu không tin cậy hãy dùng `textContent` hoặc thoát ký tự `<` `>`. React tự làm việc này cho bạn." }
    ],
    example: {
      html: "<div id=\"app\"></div>",
      css: "body{font-family:sans-serif;padding:16px;background:#f6fbf4}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}\n.card{background:#fff;border-radius:14px;padding:14px;box-shadow:0 4px 14px rgba(0,0,0,.08)}\n.card h3{margin:0 0 6px;font-size:16px}.gia{color:#16a34a;font-weight:700;margin:0}",
      js: "const data = [\n  { id: 1, ten: 'Bàn phím', gia: 450000 },\n  { id: 2, ten: 'Chuột', gia: 190000 },\n  { id: 3, ten: 'Tai nghe', gia: 690000 }\n];\nconst TheSanPham = ({ ten, gia }) => `\n  <div class=\"card\"><h3>${ten}</h3><p class=\"gia\">${gia.toLocaleString('vi-VN')}đ</p></div>`;\nconst DanhSach = ds => `<div class=\"grid\">${ds.map(TheSanPham).join('')}</div>`;\ndocument.querySelector('#app').innerHTML = DanhSach(data);"
    },
    exercise: {
      task: "Viết 2 component:\n• `TheKhoaHoc({ ten, soBai, mien_phi })` trả về chuỗi HTML: `<div class=\"course\">` chứa `<h3>` là tên, `<p>` ghi `\"<soBai> bài\"`, và nếu `mien_phi` là true thì thêm `<span class=\"badge\">Miễn phí</span>`.\n• `DanhSachKhoaHoc(ds)` trả về `<section class=\"courses\">…</section>` chứa các thẻ khoá học.\nCuối cùng render `DanhSachKhoaHoc(khoaHoc)` vào `#app`.",
      starter: {
        html: "<div id=\"app\"></div>",
        css: ".courses{display:grid;gap:10px}.course{border:1px solid #d5ead0;border-radius:12px;padding:12px}\n.badge{background:#facc15;padding:2px 8px;border-radius:99px;font-size:12px}",
        js: "const khoaHoc = [\n  { ten: 'HTML & CSS', soBai: 11, mien_phi: true },\n  { ten: 'JavaScript', soBai: 11, mien_phi: true },\n  { ten: 'Node.js', soBai: 19, mien_phi: false }\n];\n\nfunction TheKhoaHoc({ ten, soBai, mien_phi }) {\n  \n}\n\nfunction DanhSachKhoaHoc(ds) {\n  \n}\n\n// render vào #app\n"
      },
      hint: "Trong TheKhoaHoc: const badge = mien_phi ? '<span class=\"badge\">Miễn phí</span>' : ''; DanhSachKhoaHoc: return `<section class=\"courses\">${ds.map(TheKhoaHoc).join('')}</section>`;",
      solution: {
        html: "<div id=\"app\"></div>",
        css: ".courses{display:grid;gap:10px}.course{border:1px solid #d5ead0;border-radius:12px;padding:12px}\n.badge{background:#facc15;padding:2px 8px;border-radius:99px;font-size:12px}",
        js: "const khoaHoc = [\n  { ten: 'HTML & CSS', soBai: 11, mien_phi: true },\n  { ten: 'JavaScript', soBai: 11, mien_phi: true },\n  { ten: 'Node.js', soBai: 19, mien_phi: false }\n];\n\nfunction TheKhoaHoc({ ten, soBai, mien_phi }) {\n  const badge = mien_phi ? '<span class=\"badge\">Miễn phí</span>' : '';\n  return `<div class=\"course\"><h3>${ten}</h3><p>${soBai} bài</p>${badge}</div>`;\n}\n\nfunction DanhSachKhoaHoc(ds) {\n  return `<section class=\"courses\">${ds.map(TheKhoaHoc).join('')}</section>`;\n}\n\ndocument.querySelector('#app').innerHTML = DanhSachKhoaHoc(khoaHoc);\n"
      },
      check: `
        if (typeof TheKhoaHoc !== "function" || typeof DanhSachKhoaHoc !== "function") return {pass:false, msg:"Cần có hàm TheKhoaHoc và DanhSachKhoaHoc."};
        const box = document.createElement("div");
        box.innerHTML = TheKhoaHoc({ ten: "React", soBai: 7, mien_phi: false }) || "";
        const c = box.querySelector(".course");
        if (!c) return {pass:false, msg:"TheKhoaHoc phải trả về chuỗi HTML có <div class=\\"course\\">."};
        if (!c.querySelector("h3") || c.querySelector("h3").textContent.trim() !== "React") return {pass:false, msg:"Thẻ <h3> phải chứa tên khoá học."};
        if (!c.querySelector("p") || c.querySelector("p").textContent.trim() !== "7 bài") return {pass:false, msg:"Thẻ <p> phải ghi \\"7 bài\\"."};
        if (c.querySelector(".badge")) return {pass:false, msg:"Khoá không miễn phí thì không có badge."};
        box.innerHTML = TheKhoaHoc({ ten: "Git", soBai: 3, mien_phi: true });
        if (!box.querySelector(".badge") || !/Miễn phí/.test(box.querySelector(".badge").textContent)) return {pass:false, msg:"mien_phi = true phải có <span class=\\"badge\\">Miễn phí</span>."};
        const app = T.$("#app");
        const sec = app && app.querySelector("section.courses");
        if (!sec) return {pass:false, msg:"Chưa render <section class=\\"courses\\"> vào #app."};
        const cards = sec.querySelectorAll(".course");
        if (cards.length !== 3) return {pass:false, msg:"Cần 3 thẻ khoá học trong #app, đang có " + cards.length + "."};
        if (sec.querySelectorAll(".badge").length !== 2) return {pass:false, msg:"Phải có đúng 2 badge Miễn phí."};
        return {pass:true, msg:"Tư duy component đã vào nếp! 🧩"};`
    }
  },
  {
    id: "state-render", level: "fe-component", icon: "🔄", title: "State và render lại giao diện", duration: 22,
    summary: "Giao diện = hàm của dữ liệu (UI = f(state)). Thay đổi state rồi render lại – nguyên lý cốt lõi của React (useState).",
    content: [
      { h: "UI = f(state)" },
      { p: "Thay vì tìm từng phần tử để sửa (`el.textContent = ...` ở 10 nơi), ta giữ **một nguồn dữ liệu duy nhất** gọi là **state**. Mỗi khi state đổi → gọi `render()` vẽ lại giao diện từ state. Code dễ đoán hơn rất nhiều." },
      { code: "let state = { dem: 0 };\n\nfunction setState(moi) {\n  state = { ...state, ...moi };   // tạo state mới (bất biến)\n  render();\n}\n\nfunction render() {\n  document.querySelector('#app').innerHTML = `\n    <h2>${state.dem}</h2>\n    <button data-action=\"tang\">+1</button>`;\n}\n\n// Event delegation: gắn 1 lần ở phần tử cha\ndocument.querySelector('#app').addEventListener('click', e => {\n  if (e.target.dataset.action === 'tang') setState({ dem: state.dem + 1 });\n});\nrender();" },
      { h: "React làm y hệt – chỉ thông minh hơn" },
      { code: "import { useState } from 'react';\n\nfunction BoDem() {\n  const [dem, setDem] = useState(0);\n  return (\n    <>\n      <h2>{dem}</h2>\n      <button onClick={() => setDem(dem + 1)}>+1</button>\n    </>\n  );\n}\n// React so sánh giao diện mới/cũ (Virtual DOM) và chỉ cập nhật phần thay đổi." },
      { h: "Event delegation" },
      { p: "Vì `render()` thay toàn bộ `innerHTML`, các nút bị tạo mới mỗi lần. Gắn listener vào **phần tử cha cố định** và dùng `data-action` để biết nút nào được bấm – gọi là *event delegation*." },
      { tip: "Không sửa trực tiếp state (`state.dem++`) rồi quên render. Luôn đi qua `setState` – đây chính là lý do React bắt bạn dùng `setDem`." }
    ],
    example: {
      html: "<div id=\"app\"></div>",
      css: "body{font-family:sans-serif;text-align:center;padding:20px}\nbutton{font-size:18px;margin:4px;padding:6px 14px;border-radius:10px;border:1px solid #d5ead0;background:#fff;cursor:pointer}\n.list{list-style:none;padding:0}",
      js: "let state = { viec: ['Học state'], nhap: '' };\nconst setState = moi => { state = { ...state, ...moi }; render(); };\n\nfunction render() {\n  document.querySelector('#app').innerHTML = `\n    <h3>Việc cần làm (${state.viec.length})</h3>\n    <ul class=\"list\">${state.viec.map((v, i) => `<li>${v} <button data-xoa=\"${i}\">✕</button></li>`).join('')}</ul>\n    <button data-action=\"them\">+ Thêm việc ngẫu nhiên</button>`;\n}\ndocument.querySelector('#app').addEventListener('click', e => {\n  if (e.target.dataset.action === 'them') setState({ viec: [...state.viec, 'Việc #' + (state.viec.length + 1)] });\n  if (e.target.dataset.xoa) setState({ viec: state.viec.filter((_, i) => i !== +e.target.dataset.xoa) });\n});\nrender();"
    },
    exercise: {
      task: "Làm **bộ đếm** theo mô hình state:\n• `let state = { dem: 0 }` và hàm `setState(moi)` gộp state mới rồi gọi `render()`.\n• `render()` vẽ vào `#app`: `<h2 id=\"so\">` hiển thị số đếm và 3 nút có `data-action` lần lượt `\"giam\"`, `\"tang\"`, `\"reset\"`.\n• Bấm tăng/giảm thay đổi 1 đơn vị; reset về 0; **không cho đếm xuống dưới 0**.\n• Dùng event delegation trên `#app`.",
      starter: { html: "<div id=\"app\"></div>", css: "body{font-family:sans-serif;text-align:center}button{font-size:18px;margin:4px;padding:6px 14px}", js: "let state = { dem: 0 };\n\nfunction setState(moi) {\n  \n}\n\nfunction render() {\n  \n}\n\n// event delegation trên #app\n\nrender();\n" },
      hint: "setState: state = { ...state, ...moi }; render(); — trong listener: const a = e.target.dataset.action; if (a === 'giam') setState({ dem: Math.max(0, state.dem - 1) });",
      solution: { html: "<div id=\"app\"></div>", css: "body{font-family:sans-serif;text-align:center}button{font-size:18px;margin:4px;padding:6px 14px}", js: "let state = { dem: 0 };\n\nfunction setState(moi) {\n  state = { ...state, ...moi };\n  render();\n}\n\nfunction render() {\n  document.querySelector('#app').innerHTML = `\n    <h2 id=\"so\">${state.dem}</h2>\n    <button data-action=\"giam\">−</button>\n    <button data-action=\"tang\">+</button>\n    <button data-action=\"reset\">Reset</button>`;\n}\n\ndocument.querySelector('#app').addEventListener('click', e => {\n  const a = e.target.dataset.action;\n  if (a === 'tang') setState({ dem: state.dem + 1 });\n  if (a === 'giam') setState({ dem: Math.max(0, state.dem - 1) });\n  if (a === 'reset') setState({ dem: 0 });\n});\n\nrender();\n" },
      check: `
        const btn = a => T.$('#app [data-action="' + a + '"]');
        const so = () => (T.$("#so") || {}).textContent;
        if (!T.$("#so")) return {pass:false, msg:"Chưa thấy <h2 id=\\"so\\"> trong #app – đã gọi render() chưa?"};
        if (!btn("tang") || !btn("giam") || !btn("reset")) return {pass:false, msg:"Cần 3 nút với data-action: giam, tang, reset."};
        if (so().trim() !== "0") return {pass:false, msg:"Ban đầu phải hiển thị 0."};
        T.click(btn("tang")); T.click(btn("tang")); T.click(btn("tang"));
        if (so().trim() !== "3") return {pass:false, msg:"Bấm + 3 lần phải ra 3, đang là " + so() + ". (Nút được render lại – nhớ dùng event delegation trên #app)"};
        if (typeof state === "undefined" || state.dem !== 3) return {pass:false, msg:"state.dem phải đồng bộ với giao diện (đang " + (typeof state === "undefined" ? "không có state" : state.dem) + ")."};
        T.click(btn("giam"));
        if (so().trim() !== "2") return {pass:false, msg:"Bấm − phải giảm còn 2."};
        T.click(btn("reset"));
        if (so().trim() !== "0") return {pass:false, msg:"Reset phải về 0."};
        T.click(btn("giam"));
        if (so().trim() !== "0") return {pass:false, msg:"Không được đếm xuống dưới 0."};
        return {pass:true, msg:"Bạn vừa tự viết lại useState của React! 🔄"};`
    }
  },
  {
    id: "web-components", level: "fe-component", icon: "🧱", title: "Web Components: tự tạo thẻ HTML", duration: 20,
    summary: "Tạo thẻ HTML của riêng bạn như <user-card> bằng customElements – component chuẩn của trình duyệt, không cần thư viện.",
    content: [
      { h: "Custom Elements" },
      { p: "Trình duyệt cho phép định nghĩa thẻ mới bằng một class kế thừa `HTMLElement`. Tên thẻ **bắt buộc có dấu gạch ngang** (vd `user-card`, `nut-like`) để không trùng thẻ chuẩn." },
      { code: "class UserCard extends HTMLElement {\n  connectedCallback() {               // chạy khi thẻ được gắn vào trang\n    const ten = this.getAttribute('name') || 'Ẩn danh';\n    this.innerHTML = `<div class=\"card\"><h3>${ten}</h3></div>`;\n  }\n}\ncustomElements.define('user-card', UserCard);" },
      { code: "<user-card name=\"Doãn Quảng\"></user-card>\n<user-card name=\"An\"></user-card>" },
      { h: "Vòng đời của component" },
      { list: [
        "`constructor()` – khởi tạo (chưa nên đụng tới DOM con).",
        "`connectedCallback()` – đã gắn vào trang → render ở đây.",
        "`disconnectedCallback()` – bị gỡ khỏi trang → dọn dẹp timer, listener.",
        "`attributeChangedCallback(ten, cu, moi)` – thuộc tính trong `static observedAttributes` thay đổi."
      ] },
      { h: "Shadow DOM – đóng gói CSS" },
      { code: "class NutDep extends HTMLElement {\n  constructor() {\n    super();\n    const root = this.attachShadow({ mode: 'open' });\n    root.innerHTML = `\n      <style>button { background: #16a34a; color: white; border: 0; padding: 8px 16px; border-radius: 99px; }</style>\n      <button><slot></slot></button>`;   // <slot> hiển thị nội dung bên trong thẻ\n  }\n}\ncustomElements.define('nut-dep', NutDep);\n// <nut-dep>Đăng ký</nut-dep> – CSS bên trong không ảnh hưởng ra ngoài" },
      { tip: "Web Components chạy được mọi nơi: trang HTML thuần, React, Vue… Nhiều công ty (GitHub, Adobe) dùng chúng cho design system." }
    ],
    example: {
      html: "<rating-stars value=\"3\"></rating-stars>\n<rating-stars value=\"5\"></rating-stars>",
      css: "body{font-family:sans-serif;padding:16px} rating-stars{display:block;font-size:26px;cursor:pointer}",
      js: "class RatingStars extends HTMLElement {\n  static observedAttributes = ['value'];\n  connectedCallback() {\n    this.addEventListener('click', e => {\n      if (e.target.dataset.i) this.setAttribute('value', e.target.dataset.i);\n    });\n    this.render();\n  }\n  attributeChangedCallback() { this.render(); }\n  render() {\n    const v = +this.getAttribute('value') || 0;\n    this.innerHTML = [1,2,3,4,5].map(i => `<span data-i=\"${i}\">${i <= v ? '★' : '☆'}</span>`).join('');\n  }\n}\ncustomElements.define('rating-stars', RatingStars);"
    },
    exercise: {
      task: "Tạo custom element `<user-card>`:\n• Đọc thuộc tính `name` và `role`.\n• Trong `connectedCallback`, render vào chính nó (`this.innerHTML`): `<h3>` chứa tên và `<p class=\"role\">` chứa vai trò (nếu thiếu `role` thì ghi `\"Học viên\"`).\n• Đăng ký bằng `customElements.define('user-card', ...)`.\nTrong HTML đã có sẵn 2 thẻ `<user-card>`.",
      starter: { html: "<user-card name=\"Doãn Quảng\" role=\"Kỹ sư tự động hoá\"></user-card>\n<user-card name=\"An\"></user-card>", css: "user-card{display:block;border:1px solid #d5ead0;border-radius:12px;padding:10px 14px;margin:8px 0}\n.role{color:#5a7464;margin:0}", js: "class UserCard extends HTMLElement {\n  connectedCallback() {\n    \n  }\n}\n\n// customElements.define(...)\n" },
      hint: "const ten = this.getAttribute('name'); const vaiTro = this.getAttribute('role') || 'Học viên'; this.innerHTML = `<h3>${ten}</h3><p class=\"role\">${vaiTro}</p>`;",
      solution: { html: "<user-card name=\"Doãn Quảng\" role=\"Kỹ sư tự động hoá\"></user-card>\n<user-card name=\"An\"></user-card>", css: "user-card{display:block;border:1px solid #d5ead0;border-radius:12px;padding:10px 14px;margin:8px 0}\n.role{color:#5a7464;margin:0}", js: "class UserCard extends HTMLElement {\n  connectedCallback() {\n    const ten = this.getAttribute('name');\n    const vaiTro = this.getAttribute('role') || 'Học viên';\n    this.innerHTML = `<h3>${ten}</h3><p class=\"role\">${vaiTro}</p>`;\n  }\n}\n\ncustomElements.define('user-card', UserCard);\n" },
      check: `
        if (!customElements.get("user-card")) return {pass:false, msg:"Chưa đăng ký customElements.define('user-card', ...)."};
        const cards = T.$$("user-card");
        if (cards.length < 2) return {pass:false, msg:"Đừng xoá 2 thẻ <user-card> trong HTML."};
        const h = cards[0].querySelector("h3"), r = cards[0].querySelector("p.role");
        if (!h || h.textContent.trim() !== "Doãn Quảng") return {pass:false, msg:"Thẻ đầu tiên phải có <h3> chứa tên \\"Doãn Quảng\\"."};
        if (!r || r.textContent.trim() !== "Kỹ sư tự động hoá") return {pass:false, msg:"Cần <p class=\\"role\\"> chứa vai trò."};
        const r2 = cards[1].querySelector("p.role");
        if (!r2 || r2.textContent.trim() !== "Học viên") return {pass:false, msg:"Thiếu thuộc tính role thì ghi \\"Học viên\\"."};
        const n = document.createElement("user-card"); n.setAttribute("name", "Mới"); document.body.appendChild(n);
        if (!n.querySelector("h3") || n.querySelector("h3").textContent.trim() !== "Mới") return {pass:false, msg:"Thẻ tạo bằng JavaScript cũng phải tự render (dùng connectedCallback)."};
        return {pass:true, msg:"Bạn đã tạo được thẻ HTML của riêng mình! 🧱"};`
    }
  },

  /* ===================== CẤP 4: CHẤT LƯỢNG ===================== */
  {
    id: "accessibility", level: "fe-quality", icon: "♿", title: "Accessibility (a11y): web cho mọi người", duration: 20,
    summary: "Làm web dùng được với trình đọc màn hình, bàn phím và người khiếm thị màu – đồng thời tốt cho SEO.",
    content: [
      { h: "a11y là gì?" },
      { p: "**Accessibility** (viết tắt a11y – 11 chữ giữa a và y) là làm cho website dùng được với *mọi người*: người khiếm thị dùng **trình đọc màn hình**, người chỉ dùng **bàn phím**, người lớn tuổi, người mù màu… Ở nhiều nước đây là yêu cầu bắt buộc theo luật." },
      { h: "5 quy tắc vàng" },
      { list: [
        "**Dùng đúng thẻ**: nút bấm là `<button>`, link là `<a href>` – không dùng `<div onclick>` (không bấm được bằng Tab/Enter).",
        "**Ảnh có `alt`** mô tả nội dung; ảnh trang trí thì `alt=\"\"`.",
        "**Mọi input có `<label>`** liên kết qua `for` = `id`.",
        "**Nút chỉ có icon** cần `aria-label` (vd nút 🔍 → `aria-label=\"Tìm kiếm\"`).",
        "**Tương phản màu đủ** (tối thiểu 4.5:1 với chữ thường) và không truyền tải thông tin *chỉ* bằng màu."
      ] },
      { code: "<!-- ❌ Kém -->\n<div class=\"btn\" onclick=\"gui()\">🔍</div>\n<img src=\"logo.png\">\n<input type=\"email\" placeholder=\"Email\">\n\n<!-- ✅ Tốt -->\n<button type=\"button\" aria-label=\"Tìm kiếm\" onclick=\"gui()\">🔍</button>\n<img src=\"logo.png\" alt=\"Logo Front-end Academy\">\n<label for=\"email\">Email</label>\n<input id=\"email\" type=\"email\">" },
      { h: "Bàn phím và focus" },
      { p: "Thử dùng trang chỉ bằng phím **Tab / Shift+Tab / Enter**. Không bao giờ xoá viền focus (`outline: none`) mà không có kiểu thay thế – dùng `:focus-visible`." },
      { code: "button:focus-visible {\n  outline: 3px solid #facc15;\n  outline-offset: 2px;\n}" },
      { tip: "Kiểm tra nhanh: DevTools → tab **Lighthouse** → chọn Accessibility → *Analyze*. Hoặc cài tiện ích axe DevTools." }
    ],
    example: {
      html: "<form>\n  <label for=\"ten\">Họ tên</label>\n  <input id=\"ten\" autocomplete=\"name\">\n  <button type=\"button\" aria-label=\"Xoá họ tên\" onclick=\"ten.value=''\">✕</button>\n</form>\n<p>Bấm Tab để thấy viền focus màu vàng 👀</p>",
      css: "body{font-family:sans-serif;padding:16px} input,button{font-size:16px;padding:6px 10px;margin:4px}\n:focus-visible{outline:3px solid #facc15;outline-offset:2px}",
      js: ""
    },
    exercise: {
      task: "Form đăng ký dưới đây có nhiều lỗi a11y. Hãy sửa HTML để:\n• Ảnh `<img>` có `alt` mô tả (không rỗng).\n• Mọi `<input>` đều có `<label for>` trỏ đúng `id`.\n• Nút \"Đăng ký\" là thẻ `<button>` thật (không còn `div` có `onclick`).\n• Nút chỉ có icon 👁 có `aria-label`.",
      starter: { html: "<img src=\"banner.png\">\n<h2>Đăng ký học</h2>\n<input type=\"text\" placeholder=\"Họ tên\">\n<input type=\"email\" placeholder=\"Email\">\n<input type=\"password\" placeholder=\"Mật khẩu\">\n<button type=\"button\">👁</button>\n<div class=\"btn\" onclick=\"alert('ok')\">Đăng ký</div>", css: "body{font-family:sans-serif;padding:12px} label{display:block;margin-top:8px}\n.btn,button{display:inline-block;margin-top:10px;padding:8px 14px;background:#16a34a;color:#fff;border:0;border-radius:8px;cursor:pointer}", js: "" },
      hint: "Ví dụ: <label for=\"hoten\">Họ tên</label><input id=\"hoten\" type=\"text\">; <button type=\"button\" aria-label=\"Hiện mật khẩu\">👁</button>; <button type=\"submit\">Đăng ký</button>",
      solution: { html: "<img src=\"banner.png\" alt=\"Banner khoá học lập trình web\">\n<h2>Đăng ký học</h2>\n<label for=\"hoten\">Họ tên</label>\n<input id=\"hoten\" type=\"text\" autocomplete=\"name\">\n<label for=\"email\">Email</label>\n<input id=\"email\" type=\"email\" autocomplete=\"email\">\n<label for=\"matkhau\">Mật khẩu</label>\n<input id=\"matkhau\" type=\"password\" autocomplete=\"new-password\">\n<button type=\"button\" aria-label=\"Hiện mật khẩu\">👁</button>\n<button type=\"submit\">Đăng ký</button>", css: "body{font-family:sans-serif;padding:12px} label{display:block;margin-top:8px}\n.btn,button{display:inline-block;margin-top:10px;padding:8px 14px;background:#16a34a;color:#fff;border:0;border-radius:8px;cursor:pointer}", js: "" },
      check: `
        const img = T.$("img");
        if (!img || !(img.getAttribute("alt") || "").trim()) return {pass:false, msg:"Ảnh cần thuộc tính alt mô tả nội dung."};
        const inputs = T.$$("input");
        if (inputs.length < 3) return {pass:false, msg:"Giữ đủ 3 ô nhập: họ tên, email, mật khẩu."};
        for (const i of inputs) {
          if (!i.id) return {pass:false, msg:"Mỗi <input> cần có id để label trỏ tới."};
          const lb = document.querySelector('label[for="' + i.id + '"]');
          if (!lb || !lb.textContent.trim()) return {pass:false, msg:"Ô nhập #" + i.id + " chưa có <label for=\\"" + i.id + "\\"> có chữ."};
        }
        if (T.$$("[onclick]").some(el => el.tagName !== "BUTTON")) return {pass:false, msg:"Vẫn còn phần tử không phải <button> dùng onclick – đổi thành <button>."};
        const buttons = T.$$("button");
        const dk = buttons.find(b => /đăng ký/i.test(b.textContent));
        if (!dk) return {pass:false, msg:"Nút \\"Đăng ký\\" phải là thẻ <button>."};
        const icon = buttons.find(b => !b.textContent.replace(/[^\\p{L}\\p{N}]/gu, "").trim());
        if (icon && !(icon.getAttribute("aria-label") || "").trim()) return {pass:false, msg:"Nút chỉ có icon 👁 cần aria-label (vd \\"Hiện mật khẩu\\")."};
        return {pass:true, msg:"Form thân thiện với mọi người dùng! ♿"};`
    }
  },
  {
    id: "performance-debounce", level: "fe-quality", icon: "⚡", title: "Hiệu năng: debounce, throttle & lazy loading", duration: 22,
    summary: "Giảm số lần chạy hàm tốn kém khi gõ phím/cuộn trang, và chỉ tải tài nguyên khi thật sự cần.",
    content: [
      { h: "Vấn đề: sự kiện bắn quá nhiều lần" },
      { p: "Ô tìm kiếm gọi API mỗi lần gõ phím → gõ \"javascript\" = **10 request**! Sự kiện `scroll`/`resize` còn bắn hàng trăm lần mỗi giây. Giải pháp: **debounce** và **throttle**." },
      { h: "Debounce – chờ người dùng ngừng tay" },
      { p: "Chỉ chạy hàm sau khi sự kiện **ngừng** xảy ra trong `ms` mili-giây. Mỗi lần sự kiện mới đến thì *huỷ hẹn cũ, hẹn lại từ đầu*." },
      { code: "function debounce(fn, ms) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), ms);\n  };\n}\n\nconst timKiem = debounce(tuKhoa => goiApi(tuKhoa), 400);\ninput.addEventListener('input', e => timKiem(e.target.value));" },
      { h: "Throttle – tối đa 1 lần mỗi khoảng thời gian" },
      { code: "function throttle(fn, ms) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= ms) { last = now; fn(...args); }\n  };\n}\nwindow.addEventListener('scroll', throttle(capNhatThanhTienDo, 100));" },
      { h: "Lazy loading và các mẹo khác" },
      { list: [
        "Ảnh dưới màn hình đầu: `<img src=\"...\" loading=\"lazy\" width=\"600\" height=\"400\">` (đặt width/height để tránh trang bị *giật*).",
        "Nén ảnh sang **WebP/AVIF**, đúng kích thước hiển thị.",
        "Script không cần ngay: `<script src=\"app.js\" defer>`.",
        "Tránh đọc rồi ghi DOM xen kẽ trong vòng lặp (gây *layout thrashing*)."
      ] },
      { tip: "Đo trước khi tối ưu: DevTools → **Lighthouse** (Performance) và tab **Performance** để ghi lại những gì chậm." }
    ],
    example: {
      html: "<input id=\"q\" placeholder=\"Gõ thật nhanh…\" style=\"font-size:16px;padding:8px;width:90%\">\n<p>Số lần sự kiện input: <b id=\"raw\">0</b></p>\n<p>Số lần gọi API (debounce 400ms): <b id=\"api\">0</b></p>",
      css: "body{font-family:sans-serif;padding:16px}",
      js: "function debounce(fn, ms) {\n  let t;\n  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };\n}\nlet raw = 0, api = 0;\nconst goiApi = debounce(v => {\n  document.querySelector('#api').textContent = ++api;\n  console.log('🔎 Gọi API tìm:', v);\n}, 400);\ndocument.querySelector('#q').addEventListener('input', e => {\n  document.querySelector('#raw').textContent = ++raw;\n  goiApi(e.target.value);\n});"
    },
    exercise: {
      task: "Tự viết hàm `debounce(fn, ms)` trả về một hàm mới:\n• Gọi hàm mới nhiều lần liên tiếp → `fn` chỉ chạy **1 lần**, sau khi ngừng gọi `ms` mili-giây.\n• `fn` nhận **tham số của lần gọi cuối cùng**.\n• Hai đợt gọi cách nhau lâu hơn `ms` → `fn` chạy 2 lần.",
      starter: { html: "", css: "", js: "function debounce(fn, ms) {\n  \n}\n\nconst log = debounce(x => console.log('Chạy với', x), 300);\nlog(1); log(2); log(3); // chỉ in: Chạy với 3\n" },
      hint: "Dùng closure giữ biến timer: mỗi lần gọi thì clearTimeout(timer) rồi timer = setTimeout(() => fn(...args), ms).",
      solution: { html: "", css: "", js: "function debounce(fn, ms) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), ms);\n  };\n}\n\nconst log = debounce(x => console.log('Chạy với', x), 300);\nlog(1); log(2); log(3); // chỉ in: Chạy với 3\n" },
      check: `
        if (typeof debounce !== "function") return {pass:false, msg:"Không tìm thấy hàm debounce."};
        const calls = [];
        const d = debounce((...a) => calls.push(a), 60);
        if (typeof d !== "function") return {pass:false, msg:"debounce phải trả về một hàm."};
        d("a"); d("b"); d("c", 9);
        if (calls.length) return {pass:false, msg:"fn không được chạy ngay lập tức – phải chờ ms mili-giây."};
        await T.sleep(30); d("d", 1);
        await T.sleep(40);
        if (calls.length) return {pass:false, msg:"Mỗi lần gọi mới phải huỷ hẹn cũ và đếm lại từ đầu."};
        await T.sleep(60);
        if (calls.length !== 1) return {pass:false, msg:"Sau loạt gọi liên tiếp, fn phải chạy đúng 1 lần (đang " + calls.length + ")."};
        if (calls[0][0] !== "d" || calls[0][1] !== 1) return {pass:false, msg:"fn phải nhận tham số của lần gọi cuối cùng (\\"d\\", 1)."};
        d("e"); await T.sleep(110);
        if (calls.length !== 2) return {pass:false, msg:"Đợt gọi thứ hai (cách xa) phải làm fn chạy thêm 1 lần."};
        return {pass:true, msg:"Debounce chuẩn – ô tìm kiếm của bạn sẽ nhẹ hều! ⚡"};`
    }
  },
  {
    id: "testing-basics", level: "fe-quality", icon: "🧪", title: "Kiểm thử tự động (unit test)", duration: 22,
    summary: "Viết code để kiểm tra code: mỗi lần sửa chỉ cần chạy test là biết có làm hỏng gì không.",
    content: [
      { h: "Vì sao phải viết test?" },
      { p: "Sửa một chỗ, hỏng ba chỗ – chuyện thường ngày. **Unit test** là những đoạn code nhỏ kiểm tra từng hàm: *với đầu vào X, kết quả phải là Y*. Chạy hàng trăm test chỉ mất vài giây, nên bạn dám sửa code mà không sợ." },
      { h: "Cấu trúc một test: Arrange – Act – Assert" },
      { code: "test('tính tổng giỏ hàng', () => {\n  const gio = [{ gia: 100, sl: 2 }, { gia: 50, sl: 1 }]; // Arrange: chuẩn bị\n  const tong = tinhTong(gio);                          // Act: thực hiện\n  expect(tong).toBe(250);                              // Assert: khẳng định\n});" },
      { h: "Tự viết mini framework để hiểu bản chất" },
      { code: "function expect(thucTe) {\n  return {\n    toBe(mongDoi) {\n      if (thucTe !== mongDoi) throw new Error(`Mong đợi ${mongDoi} nhưng nhận ${thucTe}`);\n    }\n  };\n}\nfunction test(ten, fn) {\n  try { fn(); console.log('✅', ten); }\n  catch (e) { console.log('❌', ten, '→', e.message); }\n}" },
      { h: "Công cụ thật: Vitest / Jest" },
      { code: "// tinh-tong.test.js\nimport { describe, it, expect } from 'vitest';\nimport { tinhTong } from './tinh-tong.js';\n\ndescribe('tinhTong', () => {\n  it('giỏ rỗng = 0', () => expect(tinhTong([])).toBe(0));\n  it('cộng đúng', () => expect(tinhTong([{ gia: 100, sl: 2 }])).toBe(200));\n});\n// chạy: npx vitest" },
      { tip: "Nhớ test **trường hợp biên**: mảng rỗng, số 0, số âm, chuỗi rỗng, giá trị null… Bug thường trốn ở đó." }
    ],
    example: {
      html: "", css: "",
      js: "function expect(a) { return { toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); } }; }\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nconst viHoa = s => s.charAt(0).toUpperCase() + s.slice(1);\ntest('viết hoa chữ đầu', () => expect(viHoa('xin chào')).toBe('Xin chào'));\ntest('chuỗi rỗng', () => expect(viHoa('')).toBe(''));\ntest('test cố tình sai', () => expect(viHoa('abc')).toBe('ABC'));"
    },
    exercise: {
      task: "Mini framework `test` / `expect` đã có sẵn. Hãy:\n1) Viết hàm `laSoNguyenTo(n)` trả `true`/`false` (số nguyên tố là số nguyên > 1 chỉ chia hết cho 1 và chính nó).\n2) Viết **ít nhất 5 test** bằng `test(...)` cho hàm đó, bao gồm trường hợp biên (0, 1, số âm, 2) – tất cả phải ✅.",
      starter: { html: "", css: "", js: "function expect(a) { return { toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); } }; }\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nfunction laSoNguyenTo(n) {\n  \n}\n\n// Viết test ở đây:\ntest('7 là số nguyên tố', () => expect(laSoNguyenTo(7)).toBe(true));\n" },
      hint: "if (!Number.isInteger(n) || n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true;",
      solution: { html: "", css: "", js: "function expect(a) { return { toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); } }; }\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nfunction laSoNguyenTo(n) {\n  if (!Number.isInteger(n) || n < 2) return false;\n  for (let i = 2; i * i <= n; i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}\n\ntest('7 là số nguyên tố', () => expect(laSoNguyenTo(7)).toBe(true));\ntest('2 là số nguyên tố chẵn duy nhất', () => expect(laSoNguyenTo(2)).toBe(true));\ntest('1 không phải số nguyên tố', () => expect(laSoNguyenTo(1)).toBe(false));\ntest('0 không phải số nguyên tố', () => expect(laSoNguyenTo(0)).toBe(false));\ntest('số âm không phải số nguyên tố', () => expect(laSoNguyenTo(-7)).toBe(false));\ntest('9 = 3 × 3', () => expect(laSoNguyenTo(9)).toBe(false));\n" },
      check: `
        if (typeof laSoNguyenTo !== "function") return {pass:false, msg:"Không tìm thấy hàm laSoNguyenTo."};
        const cases = [[2,true],[3,true],[5,true],[7,true],[13,true],[97,true],[7919,true],[0,false],[1,false],[-7,false],[4,false],[9,false],[25,false],[100,false],[2.5,false]];
        for (const [n, kq] of cases) {
          let r; try { r = laSoNguyenTo(n); } catch (e) { return {pass:false, msg:"laSoNguyenTo(" + n + ") gây lỗi: " + e.message}; }
          if (r !== kq) return {pass:false, msg:"laSoNguyenTo(" + n + ") phải là " + kq + ", đang ra " + r + "."};
        }
        const ok = T.logs.filter(l => l.startsWith("✅")).length, bad = T.logs.filter(l => l.startsWith("❌")).length;
        if (bad) return {pass:false, msg:"Có " + bad + " test đang ❌ – xem Console."};
        if (ok < 5) return {pass:false, msg:"Cần ít nhất 5 test ✅ (đang có " + ok + ")."};
        if (!/\\(\\s*(0|1|-\\d+)\\s*\\)/.test(T.src)) return {pass:false, msg:"Hãy viết thêm test cho trường hợp biên như 0, 1 hoặc số âm."};
        return {pass:true, msg:ok + " test đều xanh – bạn đã có tư duy kiểm thử! 🧪"};`
    }
  }
);

/* Gợi ý học tiếp sau 3 khoá */
ROADMAP_NEXT.splice(0, ROADMAP_NEXT.length,
  { icon: "⚛️", name: "React + Vite", desc: "Áp dụng tư duy component & state vào thư viện UI phổ biến nhất." },
  { icon: "▲", name: "Next.js", desc: "Full-stack với React: routing, SSR, API route, SEO." },
  { icon: "🌬️", name: "Tailwind CSS", desc: "Viết giao diện nhanh bằng utility class." },
  { icon: "🐘", name: "PostgreSQL + Prisma", desc: "Cơ sở dữ liệu production và ORM có kiểu dữ liệu." },
  { icon: "🐳", name: "Docker & CI/CD", desc: "Đóng gói ứng dụng, tự động test và deploy mỗi lần push." },
  { icon: "🤖", name: "AI API & Automation", desc: "Gọi Gemini/OpenAI từ back-end, kết hợp n8n tự động hoá quy trình." }
);
