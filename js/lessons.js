/* =========================================================
   DỮ LIỆU BÀI HỌC – Front-end Academy
   Mỗi bài học gồm:
   - content: mảng các khối {h|p|code|list|tip|warn}
       + trong p/list/tip: `code` -> <code>, **đậm** -> <strong>
   - example: code mẫu {html, css, js} để chạy thử
   - exercise: { task, starter, hint, solution, check }
       + check là chuỗi JS chạy BÊN TRONG iframe sau code của học viên,
         có sẵn đối tượng T: T.$(sel), T.$$(sel), T.css(el, prop),
         T.logs (mảng console.log), T.sleep(ms), T.click(el)
         -> phải return {pass:boolean, msg:string} (có thể async)
   ========================================================= */

const LEVELS = [
  { id: "html", name: "HTML cơ bản", icon: "🧱", color: "#f97316", desc: "Bộ khung của mọi trang web: thẻ, văn bản, hình ảnh, form." },
  { id: "css", name: "CSS – Trang trí", icon: "🎨", color: "#3b82f6", desc: "Màu sắc, font chữ, box model, hiệu ứng và animation." },
  { id: "layout", name: "Bố cục & Responsive", icon: "📐", color: "#06b6d4", desc: "Flexbox, Grid và giao diện tương thích mọi màn hình." },
  { id: "js", name: "JavaScript cơ bản", icon: "⚡", color: "#eab308", desc: "Biến, điều kiện, vòng lặp, hàm, mảng và object." },
  { id: "dom", name: "DOM & Sự kiện", icon: "🖱️", color: "#22c55e", desc: "Dùng JavaScript điều khiển trang web và tương tác người dùng." },
  { id: "advanced", name: "JavaScript nâng cao", icon: "🚀", color: "#a855f7", desc: "Hàm mũi tên, map/filter/reduce, Promise, async/await, JSON." }
];

const LESSONS = [
  /* ===================== CẤP 1: HTML ===================== */
  {
    id: "html-intro", level: "html", icon: "📄", title: "HTML là gì? Cấu trúc một trang web", duration: 10,
    summary: "HTML (HyperText Markup Language) dùng các thẻ để mô tả nội dung trang web.",
    content: [
      { h: "HTML là gì?" },
      { p: "**HTML** là ngôn ngữ đánh dấu dùng để xây dựng *bộ khung* của trang web. Trình duyệt đọc HTML và hiển thị thành nội dung bạn nhìn thấy." },
      { p: "HTML gồm các **thẻ (tag)** được viết trong dấu ngoặc nhọn. Hầu hết thẻ có thẻ mở `<p>` và thẻ đóng `</p>`, nội dung nằm ở giữa." },
      { code: "<p>Đây là một đoạn văn.</p>" },
      { h: "Cấu trúc chuẩn của một file HTML" },
      { code: "<!DOCTYPE html>\n<html lang=\"vi\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>Trang đầu tiên</title>\n  </head>\n  <body>\n    <h1>Xin chào thế giới!</h1>\n    <p>Mình đang học HTML.</p>\n  </body>\n</html>" },
      { list: [
        "`<!DOCTYPE html>`: báo cho trình duyệt đây là HTML5.",
        "`<head>`: thông tin về trang (tiêu đề, mã hoá, CSS…) – không hiển thị trực tiếp.",
        "`<body>`: mọi thứ người dùng nhìn thấy.",
        "`<h1>` → `<h6>`: tiêu đề từ lớn nhất đến nhỏ nhất."
      ] },
      { tip: "Trong ô soạn code của app, bạn chỉ cần viết phần nằm trong `<body>` – app tự bọc phần còn lại." }
    ],
    example: { html: "<h1>Xin chào thế giới! 👋</h1>\n<p>Đây là trang web đầu tiên của mình.</p>\n<h2>Tiêu đề cấp 2</h2>\n<h3>Tiêu đề cấp 3</h3>", css: "", js: "" },
    exercise: {
      task: "Tạo một thẻ `<h1>` có chứa chữ **Xin chào** và một thẻ `<p>` giới thiệu bản thân bạn.",
      starter: { html: "<!-- Viết code của bạn ở đây -->\n", css: "", js: "" },
      hint: "Dùng <h1>Xin chào ...</h1> và <p>Mình tên là ...</p>",
      solution: { html: "<h1>Xin chào, mình là Quảng!</h1>\n<p>Mình đang học lập trình Front-end.</p>", css: "", js: "" },
      check: `
        const h1 = T.$("h1"), p = T.$("p");
        if (!h1) return {pass:false, msg:"Chưa thấy thẻ <h1>."};
        if (!/xin chào/i.test(h1.textContent)) return {pass:false, msg:"Thẻ <h1> cần chứa chữ 'Xin chào'."};
        if (!p || p.textContent.trim().length < 3) return {pass:false, msg:"Cần thêm một thẻ <p> có nội dung."};
        return {pass:true, msg:"Tuyệt vời! Bạn đã tạo trang HTML đầu tiên."};`
    }
  },
  {
    id: "html-text", level: "html", icon: "✍️", title: "Văn bản, liên kết và danh sách", duration: 12,
    summary: "Định dạng chữ, tạo link với <a> và danh sách với <ul>/<ol>/<li>.",
    content: [
      { h: "Định dạng văn bản" },
      { list: ["`<strong>`: in đậm (nhấn mạnh quan trọng).", "`<em>`: in nghiêng (nhấn giọng).", "`<br>`: xuống dòng (thẻ rỗng, không cần đóng).", "`<hr>`: đường kẻ ngang."] },
      { h: "Liên kết – thẻ <a>" },
      { p: "Thẻ `<a>` tạo đường link. Thuộc tính `href` chứa địa chỉ đích, `target=\"_blank\"` mở ở tab mới." },
      { code: "<a href=\"https://developer.mozilla.org\" target=\"_blank\">Tài liệu MDN</a>" },
      { p: "**Thuộc tính (attribute)** luôn viết trong thẻ mở, dạng `tên=\"giá trị\"`." },
      { h: "Danh sách" },
      { code: "<ul>  <!-- không thứ tự (dấu chấm) -->\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>\n\n<ol>  <!-- có thứ tự (1, 2, 3) -->\n  <li>Học</li>\n  <li>Thực hành</li>\n</ol>" },
      { tip: "Thụt lề (indent) thẻ con giúp code dễ đọc hơn rất nhiều. Trong VS Code bấm Shift + Alt + F để tự định dạng." }
    ],
    example: { html: "<h2>Kỹ năng của mình</h2>\n<p>Mình <strong>rất thích</strong> học <em>lập trình</em>.</p>\n<ul>\n  <li>HTML 🧱</li>\n  <li>CSS 🎨</li>\n  <li>JavaScript ⚡</li>\n</ul>\n<p>Tham khảo: <a href=\"https://developer.mozilla.org\" target=\"_blank\">MDN Web Docs</a></p>", css: "", js: "" },
    exercise: {
      task: "Tạo một danh sách `<ul>` có **ít nhất 3** món ăn bạn thích, và một thẻ `<a>` có `href` trỏ tới một trang web bất kỳ.",
      starter: { html: "<h2>Món ăn yêu thích</h2>\n\n", css: "", js: "" },
      hint: "<ul> chứa nhiều <li>. Link: <a href=\"https://...\">Tên</a>",
      solution: { html: "<h2>Món ăn yêu thích</h2>\n<ul>\n  <li>Phở</li>\n  <li>Bún chả</li>\n  <li>Bánh mì</li>\n</ul>\n<a href=\"https://vi.wikipedia.org/wiki/Phở\">Tìm hiểu về Phở</a>", css: "", js: "" },
      check: `
        const items = T.$$("ul li");
        if (!T.$("ul")) return {pass:false, msg:"Chưa có thẻ <ul>."};
        if (items.length < 3) return {pass:false, msg:"Danh sách cần ít nhất 3 thẻ <li> (hiện có "+items.length+")."};
        const a = T.$("a[href]");
        if (!a || a.getAttribute("href").trim()==="") return {pass:false, msg:"Cần một thẻ <a> có thuộc tính href."};
        return {pass:true, msg:"Chuẩn! Bạn đã nắm được danh sách và liên kết."};`
    }
  },
  {
    id: "html-media", level: "html", icon: "🖼️", title: "Hình ảnh và bảng", duration: 12,
    summary: "Chèn ảnh bằng <img> và trình bày dữ liệu dạng bảng với <table>.",
    content: [
      { h: "Hình ảnh – <img>" },
      { p: "`<img>` là thẻ rỗng. `src` là đường dẫn ảnh, `alt` là mô tả thay thế (rất quan trọng cho người khiếm thị và SEO)." },
      { code: "<img src=\"https://picsum.photos/300/200\" alt=\"Ảnh phong cảnh\" width=\"300\">" },
      { h: "Bảng – <table>" },
      { code: "<table>\n  <tr>\n    <th>Tên</th>\n    <th>Điểm</th>\n  </tr>\n  <tr>\n    <td>An</td>\n    <td>9</td>\n  </tr>\n</table>" },
      { list: ["`<tr>`: một hàng (table row).", "`<th>`: ô tiêu đề (in đậm, căn giữa).", "`<td>`: ô dữ liệu."] },
      { warn: "Đừng dùng bảng để chia bố cục trang – hãy dùng Flexbox/Grid (Cấp 3). Bảng chỉ dành cho dữ liệu dạng bảng." }
    ],
    example: { html: "<img src=\"https://picsum.photos/320/180\" alt=\"Ảnh ngẫu nhiên\">\n<table border=\"1\" cellpadding=\"8\">\n  <tr><th>Môn</th><th>Điểm</th></tr>\n  <tr><td>HTML</td><td>10</td></tr>\n  <tr><td>CSS</td><td>9</td></tr>\n</table>", css: "", js: "" },
    exercise: {
      task: "Chèn một ảnh `<img>` có thuộc tính `alt`, và một bảng `<table>` có **ít nhất 3 hàng** (1 hàng tiêu đề dùng `<th>`).",
      starter: { html: "", css: "", js: "" },
      hint: "Ảnh mẫu: https://picsum.photos/300/200. Hàng tiêu đề: <tr><th>..</th></tr>",
      solution: { html: "<img src=\"https://picsum.photos/300/200\" alt=\"Ảnh mẫu\">\n<table border=\"1\">\n  <tr><th>Tên</th><th>Tuổi</th></tr>\n  <tr><td>An</td><td>20</td></tr>\n  <tr><td>Bình</td><td>22</td></tr>\n</table>", css: "", js: "" },
      check: `
        const img = T.$("img");
        if (!img) return {pass:false, msg:"Chưa có thẻ <img>."};
        if (!img.getAttribute("alt")) return {pass:false, msg:"Ảnh cần có thuộc tính alt mô tả."};
        if (!T.$("table")) return {pass:false, msg:"Chưa có thẻ <table>."};
        if (T.$$("table tr").length < 3) return {pass:false, msg:"Bảng cần ít nhất 3 hàng <tr>."};
        if (!T.$("table th")) return {pass:false, msg:"Cần có ô tiêu đề <th>."};
        return {pass:true, msg:"Rất tốt! Ảnh và bảng đều chuẩn."};`
    }
  },
  {
    id: "html-form", level: "html", icon: "📝", title: "Form và thẻ ngữ nghĩa (Semantic)", duration: 15,
    summary: "Tạo form nhập liệu và dùng các thẻ semantic như header, main, footer.",
    content: [
      { h: "Form nhập liệu" },
      { code: "<form>\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" placeholder=\"ban@gmail.com\" required>\n  <button type=\"submit\">Gửi</button>\n</form>" },
      { list: [
        "`type` của input: `text`, `email`, `password`, `number`, `checkbox`, `radio`, `date`, `color`…",
        "`<label for=\"id\">` gắn nhãn với input có `id` tương ứng – bấm vào nhãn sẽ focus vào ô nhập.",
        "`required`: bắt buộc nhập; `placeholder`: chữ gợi ý mờ."
      ] },
      { h: "Thẻ ngữ nghĩa (Semantic HTML)" },
      { p: "Thay vì dùng toàn `<div>`, HTML5 có các thẻ mang ý nghĩa giúp code dễ hiểu, tốt cho SEO và khả năng truy cập:" },
      { code: "<header>Logo + menu</header>\n<nav>Thanh điều hướng</nav>\n<main>\n  <section>Một phần nội dung</section>\n  <article>Bài viết độc lập</article>\n</main>\n<footer>Chân trang</footer>" }
    ],
    example: { html: "<form>\n  <p>\n    <label for=\"ten\">Họ tên:</label><br>\n    <input id=\"ten\" type=\"text\" placeholder=\"Nguyễn Văn A\">\n  </p>\n  <p>\n    <label for=\"mk\">Mật khẩu:</label><br>\n    <input id=\"mk\" type=\"password\">\n  </p>\n  <p>\n    <label><input type=\"checkbox\"> Ghi nhớ đăng nhập</label>\n  </p>\n  <button type=\"submit\">Đăng nhập</button>\n</form>", css: "", js: "" },
    exercise: {
      task: "Tạo form đăng ký gồm: một `<input type=\"email\">` có `id`, một `<label>` với `for` trỏ đúng tới id đó, và một `<button>`.",
      starter: { html: "<form>\n  \n</form>", css: "", js: "" },
      hint: "<label for=\"email\">Email</label> <input type=\"email\" id=\"email\">",
      solution: { html: "<form>\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" required>\n  <button type=\"submit\">Đăng ký</button>\n</form>", css: "", js: "" },
      check: `
        const inp = T.$("form input[type=email]");
        if (!T.$("form")) return {pass:false, msg:"Chưa có thẻ <form>."};
        if (!inp) return {pass:false, msg:"Cần một <input type=\\"email\\"> bên trong form."};
        if (!inp.id) return {pass:false, msg:"Input email cần có thuộc tính id."};
        const lb = T.$("label[for='"+inp.id+"']");
        if (!lb) return {pass:false, msg:"Cần <label for=\\""+inp.id+"\\"> trỏ tới input."};
        if (!T.$("form button")) return {pass:false, msg:"Thiếu nút <button>."};
        return {pass:true, msg:"Hoàn hảo! Bạn đã hoàn thành cấp HTML 🎉"};`
    }
  },

  /* ===================== CẤP 2: CSS ===================== */
  {
    id: "css-intro", level: "css", icon: "🖌️", title: "CSS là gì? Selector và màu sắc", duration: 12,
    summary: "CSS dùng để trang trí HTML. Selector chọn phần tử, thuộc tính quy định kiểu.",
    content: [
      { h: "Cú pháp CSS" },
      { code: "selector {\n  thuoc-tinh: gia-tri;\n}\n\nh1 {\n  color: tomato;\n  font-size: 40px;\n}" },
      { h: "Các loại selector cơ bản" },
      { list: [
        "Theo thẻ: `p { }` – chọn mọi thẻ p.",
        "Theo class: `.card { }` – chọn phần tử có `class=\"card\"` (dùng lại nhiều lần).",
        "Theo id: `#logo { }` – chọn phần tử có `id=\"logo\"` (duy nhất trên trang).",
        "Lồng nhau: `.menu a { }` – chọn thẻ a nằm trong .menu."
      ] },
      { h: "Cách viết màu" },
      { p: "Tên màu `red`, mã HEX `#ff5733`, `rgb(255, 87, 51)`, hoặc có độ trong suốt `rgba(0,0,0,0.5)`." },
      { tip: "Trong dự án thật, CSS nằm ở file riêng và nhúng bằng `<link rel=\"stylesheet\" href=\"style.css\">` trong `<head>`." }
    ],
    example: { html: "<h1 class=\"title\">Học CSS thật vui</h1>\n<p>Đoạn văn thường.</p>\n<p class=\"highlight\">Đoạn văn được tô sáng!</p>\n<p id=\"special\">Đoạn văn đặc biệt</p>", css: ".title {\n  color: #e11d48;\n  font-family: sans-serif;\n}\n\n.highlight {\n  background: yellow;\n}\n\n#special {\n  color: white;\n  background: rgb(59, 130, 246);\n  padding: 8px;\n}", js: "" },
    exercise: {
      task: "Viết CSS để thẻ có class `.title` có **màu chữ đỏ** (`red`) và cỡ chữ **32px**.",
      starter: { html: "<h1 class=\"title\">Tiêu đề của tôi</h1>", css: "/* Viết CSS ở đây */\n", js: "" },
      hint: ".title { color: red; font-size: 32px; }",
      solution: { html: "<h1 class=\"title\">Tiêu đề của tôi</h1>", css: ".title {\n  color: red;\n  font-size: 32px;\n}", js: "" },
      check: `
        const t = T.$(".title");
        if (!t) return {pass:false, msg:"Đừng xoá thẻ .title nhé!"};
        if (T.css(t,"color") !== "rgb(255, 0, 0)") return {pass:false, msg:"Màu chữ chưa phải đỏ (red). Hiện tại: "+T.css(t,"color")};
        if (T.css(t,"font-size") !== "32px") return {pass:false, msg:"Cỡ chữ cần là 32px. Hiện tại: "+T.css(t,"font-size")};
        return {pass:true, msg:"Đúng rồi! Selector class hoạt động hoàn hảo."};`
    }
  },
  {
    id: "css-box", level: "css", icon: "📦", title: "Box Model: margin, padding, border", duration: 15,
    summary: "Mọi phần tử là một chiếc hộp gồm content, padding, border và margin.",
    content: [
      { h: "Mô hình hộp (Box Model)" },
      { p: "Từ trong ra ngoài: **content** (nội dung) → **padding** (đệm trong) → **border** (viền) → **margin** (khoảng cách bên ngoài)." },
      { code: ".box {\n  width: 200px;\n  padding: 20px;          /* đệm 4 phía */\n  border: 2px solid #333; /* độ dày - kiểu - màu */\n  margin: 16px auto;      /* trên-dưới 16px, trái-phải tự căn giữa */\n  border-radius: 12px;    /* bo góc */\n}" },
      { list: [
        "Viết tắt 4 giá trị theo chiều kim đồng hồ: `padding: trên phải dưới trái;`",
        "`margin: 0 auto;` + có `width` → căn giữa phần tử khối theo chiều ngang.",
        "`box-sizing: border-box;` → width đã bao gồm padding và border (nên dùng mặc định cho mọi dự án)."
      ] },
      { tip: "Mở DevTools (F12) → tab Elements → khung 'Computed' để xem trực quan box model của bất kỳ phần tử nào." }
    ],
    example: { html: "<div class=\"box\">Mình là một chiếc hộp 📦</div>\n<div class=\"box second\">Hộp thứ hai</div>", css: "* { box-sizing: border-box; }\n\n.box {\n  width: 260px;\n  padding: 20px;\n  margin: 16px auto;\n  border: 3px dashed #6366f1;\n  border-radius: 16px;\n  background: #eef2ff;\n  text-align: center;\n}\n\n.second {\n  border-style: solid;\n  border-color: #f43f5e;\n  background: #fff1f2;\n}", js: "" },
    exercise: {
      task: "Cho `.box`: `padding` **20px**, viền `border` **2px solid** (màu tùy ý) và bo góc `border-radius` **12px**.",
      starter: { html: "<div class=\"box\">Hộp của tôi</div>", css: ".box {\n  background: #fde68a;\n  \n}", js: "" },
      hint: "padding: 20px; border: 2px solid black; border-radius: 12px;",
      solution: { html: "<div class=\"box\">Hộp của tôi</div>", css: ".box {\n  background: #fde68a;\n  padding: 20px;\n  border: 2px solid #92400e;\n  border-radius: 12px;\n}", js: "" },
      check: `
        const b = T.$(".box");
        if (!b) return {pass:false, msg:"Không tìm thấy .box"};
        if (T.css(b,"padding-top")!=="20px" || T.css(b,"padding-left")!=="20px") return {pass:false, msg:"padding cần là 20px."};
        if (T.css(b,"border-top-width")!=="2px" || T.css(b,"border-top-style")!=="solid") return {pass:false, msg:"border cần là 2px solid."};
        if (T.css(b,"border-top-left-radius")!=="12px") return {pass:false, msg:"border-radius cần là 12px."};
        return {pass:true, msg:"Xuất sắc! Bạn đã hiểu Box Model."};`
    }
  },
  {
    id: "css-style", level: "css", icon: "✨", title: "Font chữ, đơn vị và trạng thái :hover", duration: 15,
    summary: "Font, đơn vị px/rem/%, nền gradient và pseudo-class :hover.",
    content: [
      { h: "Font chữ & văn bản" },
      { code: "body {\n  font-family: 'Segoe UI', Arial, sans-serif;\n  line-height: 1.6;\n}\nh1 {\n  font-weight: 700;\n  text-align: center;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n}" },
      { h: "Đơn vị đo" },
      { list: ["`px`: cố định.", "`%`: theo phần tử cha.", "`rem`: theo cỡ chữ gốc (thường 16px) – nên dùng cho font-size.", "`vw` / `vh`: % chiều rộng / chiều cao màn hình."] },
      { h: "Pseudo-class :hover và transition" },
      { code: ".btn {\n  background: #6366f1;\n  color: white;\n  cursor: pointer;\n  transition: 0.3s;   /* chuyển đổi mượt */\n}\n.btn:hover {\n  background: #4338ca;\n  transform: scale(1.05);\n}" },
      { tip: "Nền gradient: `background: linear-gradient(135deg, #6366f1, #ec4899);`" }
    ],
    example: { html: "<button class=\"btn\">Rê chuột vào mình 😎</button>", css: "body {\n  font-family: sans-serif;\n  display: grid;\n  place-items: center;\n  height: 90vh;\n}\n.btn {\n  padding: 14px 28px;\n  font-size: 1.1rem;\n  border: none;\n  border-radius: 999px;\n  color: white;\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n  cursor: pointer;\n  transition: transform 0.3s, box-shadow 0.3s;\n}\n.btn:hover {\n  transform: translateY(-4px) scale(1.05);\n  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5);\n}", js: "" },
    exercise: {
      task: "Trang trí `.btn`: có màu nền (`background`), con trỏ dạng bàn tay `cursor: pointer`, và viết thêm một quy tắc `.btn:hover`.",
      starter: { html: "<button class=\"btn\">Đăng ký ngay</button>", css: ".btn {\n  \n}\n", js: "" },
      hint: ".btn { background: green; cursor: pointer; }  .btn:hover { background: darkgreen; }",
      solution: { html: "<button class=\"btn\">Đăng ký ngay</button>", css: ".btn {\n  background: #16a34a;\n  color: white;\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: 0.3s;\n}\n.btn:hover {\n  background: #15803d;\n}", js: "" },
      check: `
        const b = T.$(".btn");
        if (!b) return {pass:false, msg:"Không tìm thấy .btn"};
        if (T.css(b,"cursor")!=="pointer") return {pass:false, msg:"Cần cursor: pointer."};
        const bg = T.css(b,"background-color"), bi = T.css(b,"background-image");
        if (bi==="none" && (bg==="rgba(0, 0, 0, 0)" || bg==="rgb(239, 239, 239)" || bg==="rgb(240, 240, 240)")) return {pass:false, msg:"Hãy đặt màu nền cho nút."};
        let hasHover = false;
        for (const s of document.styleSheets) { try { for (const r of s.cssRules) if (r.selectorText && r.selectorText.includes(".btn:hover")) hasHover = true; } catch(e){} }
        if (!hasHover) return {pass:false, msg:"Thiếu quy tắc .btn:hover."};
        return {pass:true, msg:"Nút bấm đẹp lắm! Hover mượt mà."};`
    }
  },
  {
    id: "css-animation", level: "css", icon: "🎬", title: "Transform và Animation", duration: 15,
    summary: "Tạo chuyển động với transform, @keyframes và animation.",
    content: [
      { h: "Transform" },
      { list: ["`translate(x, y)`: di chuyển.", "`rotate(45deg)`: xoay.", "`scale(1.5)`: phóng to/thu nhỏ."] },
      { h: "Animation với @keyframes" },
      { code: "@keyframes nay {\n  0%   { transform: translateY(0); }\n  50%  { transform: translateY(-50px); }\n  100% { transform: translateY(0); }\n}\n\n.ball {\n  animation: nay 1s ease-in-out infinite;\n  /* tên - thời gian - kiểu chuyển động - số lần */\n}" },
      { tip: "Chỉ nên animate `transform` và `opacity` – trình duyệt xử lý 2 thuộc tính này mượt nhất (dùng GPU)." }
    ],
    example: { html: "<div class=\"ball\">⚽</div>", css: "body { display:grid; place-items:center; height:90vh; }\n.ball {\n  font-size: 64px;\n  animation: nay 0.8s ease-in-out infinite, xoay 2s linear infinite;\n}\n@keyframes nay {\n  50% { transform: translateY(-80px); }\n}\n@keyframes xoay {\n  to { rotate: 360deg; }\n}", js: "" },
    exercise: {
      task: "Tạo `@keyframes` tên bất kỳ và gán `animation` cho `.star` để ngôi sao chuyển động lặp vô hạn (`infinite`).",
      starter: { html: "<div class=\"star\">⭐</div>", css: ".star {\n  font-size: 60px;\n  display: inline-block;\n}\n", js: "" },
      hint: "@keyframes quay { to { transform: rotate(360deg); } }  .star { animation: quay 2s linear infinite; }",
      solution: { html: "<div class=\"star\">⭐</div>", css: ".star {\n  font-size: 60px;\n  display: inline-block;\n  animation: quay 2s linear infinite;\n}\n@keyframes quay {\n  to { transform: rotate(360deg); }\n}", js: "" },
      check: `
        const s = T.$(".star");
        if (!s) return {pass:false, msg:"Không tìm thấy .star"};
        const name = T.css(s,"animation-name");
        if (!name || name==="none") return {pass:false, msg:"Chưa gán animation cho .star."};
        if (T.css(s,"animation-iteration-count")!=="infinite") return {pass:false, msg:"Animation cần lặp vô hạn (infinite)."};
        let found=false;
        for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.type===7 && r.name===name.split(",")[0].trim()) found=true; } catch(e){} }
        if (!found) return {pass:false, msg:"Chưa thấy @keyframes "+name};
        return {pass:true, msg:"Ngôi sao đã nhảy múa! Bạn đã hoàn thành cấp CSS 🎉"};`
    }
  },

  /* ===================== CẤP 3: LAYOUT ===================== */
  {
    id: "flexbox", level: "layout", icon: "↔️", title: "Flexbox – Bố cục một chiều", duration: 18,
    summary: "Sắp xếp phần tử theo hàng hoặc cột, căn giữa dễ dàng.",
    content: [
      { h: "Bật Flexbox" },
      { p: "Đặt `display: flex` cho **phần tử cha** (flex container), các phần tử con trực tiếp sẽ thành flex item." },
      { code: ".container {\n  display: flex;\n  flex-direction: row;          /* row | column */\n  justify-content: space-between; /* căn theo trục chính */\n  align-items: center;          /* căn theo trục phụ */\n  gap: 16px;                    /* khoảng cách giữa các item */\n  flex-wrap: wrap;              /* cho phép xuống dòng */\n}" },
      { list: [
        "`justify-content`: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`.",
        "`align-items`: `stretch` (mặc định), `center`, `flex-start`, `flex-end`.",
        "Trên item: `flex: 1` → giãn ra lấp đầy khoảng trống."
      ] },
      { tip: "Căn giữa tuyệt đối một phần tử: `display:flex; justify-content:center; align-items:center;` cho thẻ cha." }
    ],
    example: { html: "<nav class=\"nav\">\n  <div class=\"logo\">🚀 Logo</div>\n  <div class=\"menu\">\n    <a href=\"#\">Trang chủ</a>\n    <a href=\"#\">Khoá học</a>\n    <a href=\"#\">Liên hệ</a>\n  </div>\n</nav>", css: "body { margin:0; font-family:sans-serif; }\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n  background: #0f172a;\n  color: white;\n}\n.menu {\n  display: flex;\n  gap: 20px;\n}\n.menu a { color: #93c5fd; text-decoration: none; }", js: "" },
    exercise: {
      task: "Cho `.row` dùng **Flexbox**, các item cách đều hai đầu (`justify-content: space-between`) và căn giữa theo chiều dọc (`align-items: center`).",
      starter: { html: "<div class=\"row\">\n  <div class=\"item\">1</div>\n  <div class=\"item\">2</div>\n  <div class=\"item\">3</div>\n</div>", css: ".row { height: 150px; background: #e0f2fe; }\n.item { width: 60px; height: 60px; background: #0284c7; color: white; }\n", js: "" },
      hint: ".row { display:flex; justify-content:space-between; align-items:center; }",
      solution: { html: "<div class=\"row\">\n  <div class=\"item\">1</div>\n  <div class=\"item\">2</div>\n  <div class=\"item\">3</div>\n</div>", css: ".row {\n  height: 150px;\n  background: #e0f2fe;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.item { width: 60px; height: 60px; background: #0284c7; color: white; }", js: "" },
      check: `
        const r = T.$(".row");
        if (!r) return {pass:false, msg:"Không tìm thấy .row"};
        if (T.css(r,"display")!=="flex") return {pass:false, msg:".row cần display: flex."};
        if (T.css(r,"justify-content")!=="space-between") return {pass:false, msg:"justify-content cần là space-between."};
        if (T.css(r,"align-items")!=="center") return {pass:false, msg:"align-items cần là center."};
        return {pass:true, msg:"Flexbox master! 💪"};`
    }
  },
  {
    id: "grid", level: "layout", icon: "🔲", title: "CSS Grid – Bố cục hai chiều", duration: 18,
    summary: "Chia trang thành hàng và cột như một tấm lưới.",
    content: [
      { h: "Tạo lưới" },
      { code: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr); /* 3 cột bằng nhau */\n  gap: 16px;\n}" },
      { list: [
        "`fr` = một phần khoảng trống còn lại. `1fr 2fr` → cột 2 rộng gấp đôi cột 1.",
        "`grid-column: span 2;` → item chiếm 2 cột.",
        "Lưới tự co giãn: `repeat(auto-fit, minmax(200px, 1fr))` – không cần media query!"
      ] },
      { h: "Flexbox hay Grid?" },
      { p: "**Flexbox** cho bố cục một chiều (thanh menu, hàng nút). **Grid** cho bố cục hai chiều (gallery, khung trang tổng thể). Thực tế hay kết hợp cả hai." }
    ],
    example: { html: "<div class=\"gallery\">\n  <div class=\"card big\">🌄</div>\n  <div class=\"card\">🌊</div>\n  <div class=\"card\">🌲</div>\n  <div class=\"card\">🏔️</div>\n  <div class=\"card\">🌅</div>\n</div>", css: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  gap: 12px;\n  padding: 12px;\n}\n.card {\n  background: linear-gradient(135deg,#a5b4fc,#f0abfc);\n  border-radius: 12px;\n  font-size: 40px;\n  display: grid;\n  place-items: center;\n  height: 110px;\n}\n.big { grid-column: span 2; }", js: "" },
    exercise: {
      task: "Biến `.grid` thành lưới **3 cột** bằng nhau với khoảng cách `gap` (giá trị tùy ý).",
      starter: { html: "<div class=\"grid\">\n  <div>A</div><div>B</div><div>C</div>\n  <div>D</div><div>E</div><div>F</div>\n</div>", css: ".grid div { background: #fbcfe8; padding: 20px; text-align: center; }\n.grid {\n  \n}", js: "" },
      hint: ".grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }",
      solution: { html: "<div class=\"grid\">\n  <div>A</div><div>B</div><div>C</div>\n  <div>D</div><div>E</div><div>F</div>\n</div>", css: ".grid div { background: #fbcfe8; padding: 20px; text-align: center; }\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}", js: "" },
      check: `
        const g = T.$(".grid");
        if (T.css(g,"display")!=="grid") return {pass:false, msg:".grid cần display: grid."};
        const cols = T.css(g,"grid-template-columns").trim().split(/\\s+/);
        if (cols.length!==3) return {pass:false, msg:"Lưới cần đúng 3 cột (hiện có "+cols.length+")."};
        if (T.css(g,"column-gap")==="normal" || T.css(g,"column-gap")==="0px") return {pass:false, msg:"Hãy thêm gap."};
        return {pass:true, msg:"Lưới 3 cột chuẩn chỉnh! 🔲"};`
    }
  },
  {
    id: "responsive", level: "layout", icon: "📱", title: "Responsive và Media Query", duration: 15,
    summary: "Giao diện tự thích ứng với điện thoại, máy tính bảng, máy tính.",
    content: [
      { h: "Thẻ meta viewport" },
      { p: "Luôn có trong `<head>` để trang hiển thị đúng trên điện thoại:" },
      { code: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" },
      { h: "Media Query" },
      { code: "/* Mobile-first: viết cho điện thoại trước */\n.cards { display: grid; grid-template-columns: 1fr; }\n\n/* Màn hình từ 768px trở lên (tablet) */\n@media (min-width: 768px) {\n  .cards { grid-template-columns: 1fr 1fr; }\n}\n\n/* Từ 1024px (laptop) */\n@media (min-width: 1024px) {\n  .cards { grid-template-columns: repeat(4, 1fr); }\n}" },
      { tip: "Trong Chrome: F12 → bấm biểu tượng điện thoại (Ctrl+Shift+M) để giả lập nhiều kích thước màn hình." }
    ],
    example: { html: "<div class=\"box\">Thu nhỏ/kéo rộng khung xem trước để thấy màu đổi!</div>", css: ".box {\n  padding: 30px;\n  color: white;\n  font: bold 20px sans-serif;\n  background: #ef4444; /* điện thoại */\n}\n@media (min-width: 400px) {\n  .box { background: #f59e0b; }\n}\n@media (min-width: 600px) {\n  .box { background: #22c55e; }\n}", js: "" },
    exercise: {
      task: "Viết một `@media (max-width: 600px)` bên trong đổi `.menu` thành `flex-direction: column`.",
      starter: { html: "<div class=\"menu\"><a>Home</a><a>Blog</a><a>About</a></div>", css: ".menu { display: flex; gap: 10px; }\n", js: "" },
      hint: "@media (max-width: 600px) { .menu { flex-direction: column; } }",
      solution: { html: "<div class=\"menu\"><a>Home</a><a>Blog</a><a>About</a></div>", css: ".menu { display: flex; gap: 10px; }\n@media (max-width: 600px) {\n  .menu { flex-direction: column; }\n}", js: "" },
      check: `
        let ok=false;
        for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) {
          if (r.type===4 && /max-width/.test(r.conditionText||r.media.mediaText)) {
            for (const rr of r.cssRules) if (rr.selectorText && rr.selectorText.includes(".menu") && rr.style.flexDirection==="column") ok=true;
          } } } catch(e){} }
        if (!ok) return {pass:false, msg:"Chưa thấy @media (max-width: ...) chứa .menu { flex-direction: column }."};
        return {pass:true, msg:"Giao diện đã responsive! Hoàn thành cấp Layout 🎉"};`
    }
  },

  /* ===================== CẤP 4: JAVASCRIPT ===================== */
  {
    id: "js-variables", level: "js", icon: "📦", title: "Biến và kiểu dữ liệu", duration: 15,
    summary: "Lưu trữ dữ liệu bằng let/const, các kiểu: string, number, boolean…",
    content: [
      { h: "JavaScript là gì?" },
      { p: "Nếu HTML là bộ xương, CSS là quần áo thì **JavaScript** là bộ não – giúp trang web tính toán, phản hồi và thay đổi." },
      { h: "Khai báo biến" },
      { code: "let tuoi = 23;          // có thể gán lại\nconst ten = \"Quảng\";    // hằng số, không gán lại được\ntuoi = 24;              // OK\n\nconsole.log(ten, tuoi); // in ra Console" },
      { warn: "Tránh dùng `var` (cách cũ, dễ gây lỗi phạm vi). Ưu tiên `const`, chỉ dùng `let` khi cần gán lại." },
      { h: "Kiểu dữ liệu cơ bản" },
      { list: ["`string`: chuỗi – `\"xin chào\"`", "`number`: số – `42`, `3.14`", "`boolean`: `true` / `false`", "`undefined`: chưa có giá trị; `null`: rỗng có chủ đích", "Kiểm tra kiểu: `typeof tuoi` → `\"number\"`"] },
      { code: "const a = 10, b = 3;\nconsole.log(a + b, a - b, a * b, a / b, a % b); // 13 7 30 3.33 1\nconsole.log(\"Tên: \" + ten);  // nối chuỗi" }
    ],
    example: { html: "<p>Mở khung <b>Console</b> bên dưới để xem kết quả 👇</p>", css: "", js: "const ten = \"Quảng\";\nlet tuoi = 23;\nconst dangHoc = true;\n\nconsole.log(\"Xin chào\", ten);\nconsole.log(\"Năm sau mình\", tuoi + 1, \"tuổi\");\nconsole.log(typeof ten, typeof tuoi, typeof dangHoc);" },
    exercise: {
      task: "Khai báo hai biến `a = 5` và `b = 7`, sau đó dùng `console.log` in ra **tổng** của chúng.",
      starter: { html: "", css: "", js: "// Khai báo biến a, b và in tổng\n" },
      hint: "let a = 5; let b = 7; console.log(a + b);",
      solution: { html: "", css: "", js: "let a = 5;\nlet b = 7;\nconsole.log(a + b);" },
      check: `
        if (typeof a==="undefined" || typeof b==="undefined") return {pass:false, msg:"Cần khai báo biến a và b."};
        if (a!==5 || b!==7) return {pass:false, msg:"a phải bằng 5 và b phải bằng 7."};
        if (!T.logs.some(l => l.trim()==="12")) return {pass:false, msg:"Chưa thấy console.log in ra 12."};
        return {pass:true, msg:"Chính xác! 5 + 7 = 12 ✅"};`
    }
  },
  {
    id: "js-conditions", level: "js", icon: "🔀", title: "Toán tử so sánh và câu lệnh điều kiện", duration: 15,
    summary: "Ra quyết định với if / else if / else và toán tử logic.",
    content: [
      { h: "Toán tử so sánh" },
      { list: ["`===` bằng (so cả kiểu) – **luôn dùng cái này**, tránh `==`.", "`!==` khác", "`>`, `<`, `>=`, `<=`", "Logic: `&&` (và), `||` (hoặc), `!` (phủ định)"] },
      { code: "console.log(5 === \"5\"); // false (khác kiểu)\nconsole.log(5 == \"5\");  // true  (dễ gây bug!)" },
      { h: "if / else" },
      { code: "function kiemTra(diem) {\n  if (diem >= 8) {\n    return \"Giỏi\";\n  } else if (diem >= 6.5) {\n    return \"Khá\";\n  } else {\n    return \"Trung bình\";\n  }\n}\nconsole.log(kiemTra(9)); // Giỏi" },
      { tip: "Toán tử 3 ngôi viết gọn: `const ketQua = diem >= 5 ? \"Đậu\" : \"Rớt\";`" }
    ],
    example: { html: "", css: "", js: "const gio = new Date().getHours();\n\nif (gio < 12) {\n  console.log(\"☀️ Chào buổi sáng!\");\n} else if (gio < 18) {\n  console.log(\"🌤️ Chào buổi chiều!\");\n} else {\n  console.log(\"🌙 Chào buổi tối!\");\n}\n\nconst tuoi = 20;\nconsole.log(tuoi >= 18 ? \"Đủ tuổi\" : \"Chưa đủ tuổi\");" },
    exercise: {
      task: "Viết hàm `xepLoai(diem)` trả về `\"Giỏi\"` nếu điểm ≥ 8, `\"Khá\"` nếu ≥ 6.5, còn lại trả về `\"Trung bình\"`.",
      starter: { html: "", css: "", js: "function xepLoai(diem) {\n  // viết code ở đây\n}\n\nconsole.log(xepLoai(9));" },
      hint: "Dùng if (diem >= 8) return \"Giỏi\"; else if (diem >= 6.5) ...",
      solution: { html: "", css: "", js: "function xepLoai(diem) {\n  if (diem >= 8) return \"Giỏi\";\n  else if (diem >= 6.5) return \"Khá\";\n  else return \"Trung bình\";\n}\n\nconsole.log(xepLoai(9));" },
      check: `
        if (typeof xepLoai!=="function") return {pass:false, msg:"Chưa có hàm xepLoai."};
        const cases=[[9,"Giỏi"],[8,"Giỏi"],[7,"Khá"],[6.5,"Khá"],[5,"Trung bình"],[0,"Trung bình"]];
        for (const [d,kq] of cases) { const r = xepLoai(d); if (r!==kq) return {pass:false, msg:"xepLoai("+d+") trả về '"+r+"', mong đợi '"+kq+"'."}; }
        return {pass:true, msg:"Tất cả 6 test case đều đúng! 🎯"};`
    }
  },
  {
    id: "js-loops", level: "js", icon: "🔁", title: "Mảng và vòng lặp", duration: 18,
    summary: "Lưu danh sách bằng mảng và duyệt qua bằng for, for...of.",
    content: [
      { h: "Mảng (Array)" },
      { code: "const traiCay = [\"Táo\", \"Cam\", \"Xoài\"];\nconsole.log(traiCay[0]);      // Táo (chỉ số bắt đầu từ 0)\nconsole.log(traiCay.length);  // 3\ntraiCay.push(\"Dưa\");          // thêm vào cuối\ntraiCay.pop();                // xoá phần tử cuối" },
      { h: "Vòng lặp" },
      { code: "// for cổ điển\nfor (let i = 0; i < 5; i++) {\n  console.log(\"Lần\", i);\n}\n\n// for...of – duyệt từng phần tử\nfor (const tc of traiCay) {\n  console.log(tc);\n}\n\n// while\nlet n = 3;\nwhile (n > 0) { console.log(n); n--; }" },
      { warn: "Cẩn thận vòng lặp vô hạn (điều kiện luôn đúng) – trình duyệt sẽ bị treo! Nếu bị treo, hãy tải lại trang." }
    ],
    example: { html: "", css: "", js: "const diem = [8, 9.5, 6, 7.5];\nlet tong = 0;\n\nfor (const d of diem) {\n  tong += d;\n}\n\nconsole.log(\"Tổng:\", tong);\nconsole.log(\"Trung bình:\", (tong / diem.length).toFixed(2));\n\nfor (let i = 1; i <= 5; i++) {\n  console.log(\"⭐\".repeat(i));\n}" },
    exercise: {
      task: "Viết hàm `tongMang(arr)` trả về **tổng** các số trong mảng. Ví dụ `tongMang([1,2,3])` → `6`, mảng rỗng → `0`.",
      starter: { html: "", css: "", js: "function tongMang(arr) {\n  let tong = 0;\n  // dùng vòng lặp ở đây\n  return tong;\n}\n\nconsole.log(tongMang([1, 2, 3]));" },
      hint: "for (const so of arr) { tong += so; }",
      solution: { html: "", css: "", js: "function tongMang(arr) {\n  let tong = 0;\n  for (const so of arr) {\n    tong += so;\n  }\n  return tong;\n}\n\nconsole.log(tongMang([1, 2, 3]));" },
      check: `
        if (typeof tongMang!=="function") return {pass:false, msg:"Chưa có hàm tongMang."};
        const cases=[[[1,2,3],6],[[],0],[[10,-5,2.5],7.5],[[100],100]];
        for (const [a,kq] of cases) { const r=tongMang(a); if (r!==kq) return {pass:false, msg:"tongMang(["+a+"]) = "+r+", mong đợi "+kq}; }
        return {pass:true, msg:"Vòng lặp chuẩn! Mọi test đều qua 🔁"};`
    }
  },
  {
    id: "js-functions", level: "js", icon: "🧩", title: "Hàm và Object", duration: 18,
    summary: "Đóng gói logic vào hàm, mô tả dữ liệu phức tạp bằng object.",
    content: [
      { h: "Hàm (Function)" },
      { code: "function chao(ten) {          // ten là tham số\n  return \"Xin chào \" + ten;\n}\nconsole.log(chao(\"An\"));      // \"An\" là đối số" },
      { h: "Template string" },
      { p: "Dùng dấu backtick (phím cạnh số 1) để chèn biến vào chuỗi dễ dàng: `Tôi ${ten}` – ví dụ trong khung code bên dưới." },
      { h: "Object" },
      { code: "const sinhVien = {\n  ten: \"Quảng\",\n  tuoi: 23,\n  kyNang: [\"HTML\", \"CSS\"],\n  gioiThieu() {\n    return \"Tôi là \" + this.ten;\n  }\n};\n\nconsole.log(sinhVien.ten);          // Quảng\nconsole.log(sinhVien[\"tuoi\"]);      // 23\nsinhVien.tuoi = 24;                 // sửa\nsinhVien.email = \"a@b.com\";          // thêm\nconsole.log(sinhVien.gioiThieu());" }
    ],
    example: { html: "", css: "", js: "const sp = { ten: \"Bàn phím cơ\", gia: 1200000, soLuong: 2 };\n\nfunction tinhTien(sanPham) {\n  return sanPham.gia * sanPham.soLuong;\n}\n\nconst tien = tinhTien(sp);\nconsole.log(`${sp.ten}: ${tien.toLocaleString(\"vi-VN\")}đ`);\n\nfor (const key in sp) {\n  console.log(key, \"=>\", sp[key]);\n}" },
    exercise: {
      task: "Viết hàm `gioiThieu(sv)` nhận object có `ten` và `tuoi`, trả về chuỗi đúng dạng: `Tôi là An, 20 tuổi`.",
      starter: { html: "", css: "", js: "function gioiThieu(sv) {\n  \n}\n\nconsole.log(gioiThieu({ ten: \"An\", tuoi: 20 }));" },
      hint: "return \"Tôi là \" + sv.ten + \", \" + sv.tuoi + \" tuổi\";",
      solution: { html: "", css: "", js: "function gioiThieu(sv) {\n  return \"Tôi là \" + sv.ten + \", \" + sv.tuoi + \" tuổi\";\n}\n\nconsole.log(gioiThieu({ ten: \"An\", tuoi: 20 }));" },
      check: `
        if (typeof gioiThieu!=="function") return {pass:false, msg:"Chưa có hàm gioiThieu."};
        const r1 = gioiThieu({ten:"An",tuoi:20}), r2 = gioiThieu({ten:"Bình",tuoi:31});
        if (r1!=="Tôi là An, 20 tuổi") return {pass:false, msg:"Kết quả: '"+r1+"' – mong đợi 'Tôi là An, 20 tuổi'."};
        if (r2!=="Tôi là Bình, 31 tuổi") return {pass:false, msg:"Với Bình/31 ra: '"+r2+"'."};
        return {pass:true, msg:"Tuyệt! Bạn đã hoàn thành cấp JavaScript cơ bản 🎉"};`
    }
  },

  /* ===================== CẤP 5: DOM ===================== */
  {
    id: "dom-select", level: "dom", icon: "🎯", title: "DOM: chọn và thay đổi phần tử", duration: 15,
    summary: "Dùng querySelector để tìm phần tử và thay đổi nội dung, style, class.",
    content: [
      { h: "DOM là gì?" },
      { p: "**DOM (Document Object Model)** là cây đối tượng trình duyệt tạo ra từ HTML. JavaScript dùng DOM để đọc và sửa trang web theo thời gian thực." },
      { h: "Chọn phần tử" },
      { code: "const title = document.querySelector(\"#title\");     // 1 phần tử (id)\nconst card  = document.querySelector(\".card\");      // phần tử đầu tiên có class card\nconst items = document.querySelectorAll(\"li\");       // TẤT CẢ thẻ li" },
      { h: "Thay đổi phần tử" },
      { code: "title.textContent = \"Tiêu đề mới\";      // đổi chữ\ntitle.innerHTML = \"<em>Có HTML</em>\";    // đổi cả HTML\ntitle.style.color = \"red\";               // đổi style (camelCase: backgroundColor)\ntitle.classList.add(\"active\");          // thêm class\ntitle.classList.toggle(\"dark\");         // bật/tắt class\ntitle.setAttribute(\"data-id\", \"1\");" },
      { tip: "Nên đổi giao diện bằng `classList` (định nghĩa style trong CSS) thay vì viết nhiều `style.xxx` trong JS." }
    ],
    example: { html: "<h1 id=\"title\">Tiêu đề gốc</h1>\n<ul>\n  <li>Mục 1</li>\n  <li>Mục 2</li>\n  <li>Mục 3</li>\n</ul>", css: ".highlight { background: #fef08a; font-weight: bold; }", js: "const title = document.querySelector(\"#title\");\ntitle.textContent = \"✨ Đã đổi bằng JavaScript!\";\ntitle.style.color = \"#7c3aed\";\n\nconst items = document.querySelectorAll(\"li\");\nitems.forEach((li, i) => {\n  li.textContent += \" – đã xử lý #\" + (i + 1);\n  if (i % 2 === 0) li.classList.add(\"highlight\");\n});" },
    exercise: {
      task: "Dùng JavaScript đổi nội dung thẻ `#title` thành `Đã đổi!` và đổi màu chữ của nó thành `blue`.",
      starter: { html: "<h1 id=\"title\">Nội dung cũ</h1>", css: "", js: "// chọn #title và thay đổi nó\n" },
      hint: "const t = document.querySelector(\"#title\"); t.textContent = \"Đã đổi!\"; t.style.color = \"blue\";",
      solution: { html: "<h1 id=\"title\">Nội dung cũ</h1>", css: "", js: "const t = document.querySelector(\"#title\");\nt.textContent = \"Đã đổi!\";\nt.style.color = \"blue\";" },
      check: `
        const t = T.$("#title");
        if (!t) return {pass:false, msg:"Đừng xoá #title nhé."};
        if (t.textContent.trim()!=="Đã đổi!") return {pass:false, msg:"Nội dung hiện tại: '"+t.textContent+"' – cần 'Đã đổi!'"};
        if (T.css(t,"color")!=="rgb(0, 0, 255)") return {pass:false, msg:"Màu chữ cần là blue."};
        return {pass:true, msg:"Bạn đã điều khiển được DOM! 🎯"};`
    }
  },
  {
    id: "dom-events", level: "dom", icon: "👆", title: "Sự kiện (Events)", duration: 18,
    summary: "Lắng nghe click, input, submit… bằng addEventListener.",
    content: [
      { h: "addEventListener" },
      { code: "const btn = document.querySelector(\"#btn\");\n\nbtn.addEventListener(\"click\", function () {\n  alert(\"Bạn vừa bấm nút!\");\n});" },
      { h: "Các sự kiện hay dùng" },
      { list: ["`click`, `dblclick`: bấm chuột", "`input`: khi gõ vào ô nhập (mỗi ký tự)", "`change`: khi giá trị thay đổi xong", "`submit`: khi gửi form", "`keydown`: khi nhấn phím", "`mouseenter` / `mouseleave`: rê chuột vào/ra"] },
      { h: "Đối tượng event" },
      { code: "form.addEventListener(\"submit\", (e) => {\n  e.preventDefault();          // chặn tải lại trang\n  console.log(e.target);       // phần tử phát sinh sự kiện\n});\n\ninput.addEventListener(\"input\", (e) => {\n  console.log(e.target.value); // giá trị đang gõ\n});" }
    ],
    example: { html: "<input id=\"ten\" placeholder=\"Gõ tên bạn...\">\n<h2 id=\"out\">Xin chào!</h2>\n<button id=\"btn\">Đổi màu nền 🎨</button>", css: "body { font-family: sans-serif; padding: 20px; transition: background .4s; }\nbutton, input { padding: 8px 14px; font-size: 16px; }", js: "const ten = document.querySelector(\"#ten\");\nconst out = document.querySelector(\"#out\");\n\nten.addEventListener(\"input\", (e) => {\n  out.textContent = \"Xin chào \" + (e.target.value || \"bạn\") + \"! 👋\";\n});\n\ndocument.querySelector(\"#btn\").addEventListener(\"click\", () => {\n  const mau = [\"#fee2e2\", \"#dcfce7\", \"#dbeafe\", \"#fef9c3\", \"#f3e8ff\"];\n  document.body.style.background = mau[Math.floor(Math.random() * mau.length)];\n});" },
    exercise: {
      task: "Làm bộ đếm: mỗi lần bấm nút `#btn`, số trong `#count` tăng thêm 1.",
      starter: { html: "<h1 id=\"count\">0</h1>\n<button id=\"btn\">+1</button>", css: "", js: "let dem = 0;\n// lắng nghe sự kiện click của #btn\n" },
      hint: "document.querySelector(\"#btn\").addEventListener(\"click\", () => { dem++; document.querySelector(\"#count\").textContent = dem; });",
      solution: { html: "<h1 id=\"count\">0</h1>\n<button id=\"btn\">+1</button>", css: "", js: "let dem = 0;\nconst count = document.querySelector(\"#count\");\ndocument.querySelector(\"#btn\").addEventListener(\"click\", () => {\n  dem++;\n  count.textContent = dem;\n});" },
      check: `
        const btn=T.$("#btn"), c=T.$("#count");
        if (!btn||!c) return {pass:false, msg:"Cần giữ #btn và #count."};
        const start = parseInt(c.textContent)||0;
        T.click(btn); T.click(btn); T.click(btn);
        await T.sleep(50);
        if (parseInt(c.textContent)!==start+3) return {pass:false, msg:"Bấm 3 lần nhưng #count hiển thị '"+c.textContent+"' (mong đợi "+(start+3)+")."};
        return {pass:true, msg:"Bộ đếm chạy ngon! 👆"};`
    }
  },
  {
    id: "dom-create", level: "dom", icon: "🏗️", title: "Tạo phần tử động – Todo List", duration: 20,
    summary: "createElement, appendChild, remove – xây ứng dụng Todo đầu tiên.",
    content: [
      { h: "Tạo và chèn phần tử" },
      { code: "const li = document.createElement(\"li\");\nli.textContent = \"Học DOM\";\ndocument.querySelector(\"#list\").appendChild(li);\n\n// Xoá phần tử\nli.remove();" },
      { h: "Ủy quyền sự kiện (Event Delegation)" },
      { p: "Thay vì gắn sự kiện cho từng `li`, gắn một lần cho thẻ cha rồi kiểm tra `e.target` – hoạt động cả với phần tử được thêm sau." },
      { code: "list.addEventListener(\"click\", (e) => {\n  if (e.target.tagName === \"LI\") {\n    e.target.classList.toggle(\"done\");\n  }\n});" },
      { tip: "Luôn kiểm tra dữ liệu trước khi thêm: `if (text.trim() === \"\") return;`" }
    ],
    example: { html: "<h2>📝 Việc cần làm</h2>\n<input id=\"todo\" placeholder=\"Thêm việc...\">\n<button id=\"add\">Thêm</button>\n<ul id=\"list\"></ul>\n<small>Bấm vào việc để đánh dấu xong, nhấp đúp để xoá</small>", css: "body { font-family: sans-serif; padding: 16px; }\nli { padding: 6px; cursor: pointer; }\n.done { text-decoration: line-through; color: #9ca3af; }", js: "const input = document.querySelector(\"#todo\");\nconst list = document.querySelector(\"#list\");\n\nfunction them() {\n  const text = input.value.trim();\n  if (text === \"\") return;\n  const li = document.createElement(\"li\");\n  li.textContent = \"✅ \" + text;\n  list.appendChild(li);\n  input.value = \"\";\n  input.focus();\n}\n\ndocument.querySelector(\"#add\").addEventListener(\"click\", them);\ninput.addEventListener(\"keydown\", e => { if (e.key === \"Enter\") them(); });\nlist.addEventListener(\"click\", e => { if (e.target.tagName === \"LI\") e.target.classList.toggle(\"done\"); });\nlist.addEventListener(\"dblclick\", e => { if (e.target.tagName === \"LI\") e.target.remove(); });" },
    exercise: {
      task: "Khi bấm `#add`, lấy nội dung ô `#todo` và thêm một `<li>` mới vào `#list`, sau đó xoá trống ô nhập. Không thêm nếu ô trống.",
      starter: { html: "<input id=\"todo\">\n<button id=\"add\">Thêm</button>\n<ul id=\"list\"></ul>", css: "", js: "const input = document.querySelector(\"#todo\");\nconst list = document.querySelector(\"#list\");\n\n" },
      hint: "Trong hàm click: tạo li = document.createElement('li'), li.textContent = input.value, list.appendChild(li), input.value = ''",
      solution: { html: "<input id=\"todo\">\n<button id=\"add\">Thêm</button>\n<ul id=\"list\"></ul>", css: "", js: "const input = document.querySelector(\"#todo\");\nconst list = document.querySelector(\"#list\");\n\ndocument.querySelector(\"#add\").addEventListener(\"click\", () => {\n  const text = input.value.trim();\n  if (text === \"\") return;\n  const li = document.createElement(\"li\");\n  li.textContent = text;\n  list.appendChild(li);\n  input.value = \"\";\n});" },
      check: `
        const inp=T.$("#todo"), btn=T.$("#add"), list=T.$("#list");
        if (!inp||!btn||!list) return {pass:false, msg:"Cần giữ #todo, #add và #list."};
        const n0 = list.querySelectorAll("li").length;
        inp.value = "Học Flexbox"; T.click(btn); await T.sleep(30);
        const lis = list.querySelectorAll("li");
        if (lis.length!==n0+1) return {pass:false, msg:"Bấm Thêm nhưng chưa có <li> mới trong #list."};
        if (!lis[lis.length-1].textContent.includes("Học Flexbox")) return {pass:false, msg:"<li> mới không chứa nội dung đã nhập."};
        if (inp.value!=="") return {pass:false, msg:"Cần xoá trống ô nhập sau khi thêm."};
        inp.value = "   "; T.click(btn); await T.sleep(30);
        if (list.querySelectorAll("li").length!==n0+1) return {pass:false, msg:"Không được thêm khi ô nhập trống."};
        return {pass:true, msg:"Todo App hoạt động! Hoàn thành cấp DOM 🎉"};`
    }
  },

  /* ===================== CẤP 6: NÂNG CAO ===================== */
  {
    id: "js-array-methods", level: "advanced", icon: "🧪", title: "Arrow function & map / filter / reduce", duration: 20,
    summary: "Viết hàm ngắn gọn và xử lý mảng theo phong cách hiện đại.",
    content: [
      { h: "Arrow function" },
      { code: "// Hàm thường\nfunction binhPhuong(x) { return x * x; }\n\n// Arrow function\nconst binhPhuong2 = (x) => x * x;   // 1 dòng: tự return\nconst cong = (a, b) => {\n  const tong = a + b;\n  return tong;\n};" },
      { h: "Ba phương thức mảng quan trọng nhất" },
      { code: "const so = [1, 2, 3, 4, 5];\n\nso.map(x => x * 2);          // [2, 4, 6, 8, 10]  – biến đổi từng phần tử\nso.filter(x => x % 2 === 0); // [2, 4]            – lọc theo điều kiện\nso.reduce((tong, x) => tong + x, 0); // 15        – gộp thành 1 giá trị\n\n// Khác: find, some, every, includes, sort, forEach" },
      { tip: "`map`/`filter` trả về **mảng mới**, không làm thay đổi mảng gốc – đây là tư duy 'immutable' rất quan trọng khi học React." }
    ],
    example: { html: "", css: "", js: "const sanPham = [\n  { ten: \"Áo\", gia: 200, loai: \"thoi-trang\" },\n  { ten: \"Laptop\", gia: 15000, loai: \"cong-nghe\" },\n  { ten: \"Chuột\", gia: 300, loai: \"cong-nghe\" },\n  { ten: \"Giày\", gia: 900, loai: \"thoi-trang\" }\n];\n\nconst congNghe = sanPham.filter(sp => sp.loai === \"cong-nghe\");\nconsole.log(\"Công nghệ:\", congNghe.map(sp => sp.ten));\n\nconst tongTien = sanPham.reduce((t, sp) => t + sp.gia, 0);\nconsole.log(\"Tổng:\", tongTien);\n\nconst giamGia = sanPham.map(sp => ({ ...sp, gia: sp.gia * 0.9 }));\nconsole.log(giamGia);" },
    exercise: {
      task: "Viết arrow function `locChan` nhận mảng số và trả về mảng **chỉ gồm số chẵn, đã nhân đôi**. Ví dụ `locChan([1,2,3,4])` → `[4, 8]`. Hãy dùng `filter` và `map`.",
      starter: { html: "", css: "", js: "const locChan = (arr) => {\n  \n};\n\nconsole.log(locChan([1, 2, 3, 4]));" },
      hint: "return arr.filter(x => x % 2 === 0).map(x => x * 2);",
      solution: { html: "", css: "", js: "const locChan = (arr) => arr.filter(x => x % 2 === 0).map(x => x * 2);\n\nconsole.log(locChan([1, 2, 3, 4]));" },
      check: `
        if (typeof locChan!=="function") return {pass:false, msg:"Chưa có hàm locChan."};
        const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
        const cases=[[[1,2,3,4],[4,8]],[[],[]],[[1,3,5],[]],[[10,11,12],[20,24]]];
        for (const [a,kq] of cases) { const r=locChan(a); if (!eq(r,kq)) return {pass:false, msg:"locChan("+JSON.stringify(a)+") = "+JSON.stringify(r)+", mong đợi "+JSON.stringify(kq)}; }
        return {pass:true, msg:"Code rất 'modern'! 🧪"};`
    }
  },
  {
    id: "js-async", level: "advanced", icon: "⏳", title: "Bất đồng bộ: Promise, async/await, fetch", duration: 25,
    summary: "Xử lý tác vụ tốn thời gian như gọi API mà không làm treo trang.",
    content: [
      { h: "Vì sao cần bất đồng bộ?" },
      { p: "Gọi API, đọc file, hẹn giờ… mất thời gian. JavaScript không đứng chờ mà tiếp tục chạy, khi xong sẽ quay lại xử lý kết quả." },
      { h: "Promise" },
      { code: "const cho = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\ncho(1000).then(() => console.log(\"Đã chờ 1 giây\"));" },
      { h: "async / await – cách viết dễ đọc nhất" },
      { code: "async function layNguoiDung() {\n  try {\n    const res = await fetch(\"https://jsonplaceholder.typicode.com/users/1\");\n    if (!res.ok) throw new Error(\"Lỗi HTTP \" + res.status);\n    const data = await res.json();\n    console.log(data.name);\n  } catch (err) {\n    console.error(\"Có lỗi:\", err.message);\n  }\n}\nlayNguoiDung();" },
      { warn: "`await` chỉ dùng được bên trong hàm `async`. Luôn bọc `try...catch` khi gọi API vì mạng có thể lỗi bất cứ lúc nào." }
    ],
    example: { html: "<button id=\"load\">Tải danh sách người dùng 🌐</button>\n<ul id=\"users\"></ul>", css: "body{font-family:sans-serif;padding:16px} button{padding:8px 14px}", js: "const btn = document.querySelector(\"#load\");\nconst ul = document.querySelector(\"#users\");\n\nbtn.addEventListener(\"click\", async () => {\n  btn.textContent = \"Đang tải... ⏳\";\n  try {\n    const res = await fetch(\"https://jsonplaceholder.typicode.com/users\");\n    const users = await res.json();\n    ul.innerHTML = users.map(u => \"<li>\" + u.name + \" – \" + u.email + \"</li>\").join(\"\");\n    console.log(\"Đã tải\", users.length, \"người dùng\");\n  } catch (e) {\n    console.error(\"Không tải được (kiểm tra mạng):\", e.message);\n  }\n  btn.textContent = \"Tải lại 🔄\";\n});" },
    exercise: {
      task: "Viết hàm `async function tinhSau(a, b)`: chờ **100ms** (dùng Promise + setTimeout) rồi trả về `a + b`.",
      starter: { html: "", css: "", js: "const cho = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\nasync function tinhSau(a, b) {\n  \n}\n\ntinhSau(2, 3).then(kq => console.log(kq));" },
      hint: "await cho(100); return a + b;",
      solution: { html: "", css: "", js: "const cho = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\nasync function tinhSau(a, b) {\n  await cho(100);\n  return a + b;\n}\n\ntinhSau(2, 3).then(kq => console.log(kq));" },
      check: `
        if (typeof tinhSau!=="function") return {pass:false, msg:"Chưa có hàm tinhSau."};
        const t0=performance.now(); const p=tinhSau(4,6);
        if (!p || typeof p.then!=="function") return {pass:false, msg:"tinhSau phải trả về Promise (dùng async)."};
        const r = await p; const dt = performance.now()-t0;
        if (r!==10) return {pass:false, msg:"tinhSau(4,6) trả về "+r+", mong đợi 10."};
        if (dt<90) return {pass:false, msg:"Hàm chưa chờ đủ 100ms (chỉ "+Math.round(dt)+"ms)."};
        return {pass:true, msg:"Bạn đã làm chủ async/await! ⏳"};`
    }
  },
  {
    id: "js-json-storage", level: "advanced", icon: "💾", title: "JSON và localStorage", duration: 18,
    summary: "Chuyển đổi dữ liệu với JSON và lưu dữ liệu ngay trên trình duyệt.",
    content: [
      { h: "JSON" },
      { p: "**JSON** là định dạng văn bản để trao đổi dữ liệu (API hầu như đều trả về JSON)." },
      { code: "const obj = { ten: \"An\", diem: [8, 9] };\nconst chuoi = JSON.stringify(obj);   // object -> chuỗi\nconsole.log(chuoi);                  // '{\"ten\":\"An\",\"diem\":[8,9]}'\nconst lai = JSON.parse(chuoi);        // chuỗi -> object" },
      { h: "localStorage" },
      { p: "Lưu dữ liệu dạng chuỗi trong trình duyệt, **không mất khi tải lại trang**. App học này cũng dùng localStorage để lưu tiến độ của bạn!" },
      { code: "localStorage.setItem(\"todos\", JSON.stringify([\"Học JS\"]));\nconst todos = JSON.parse(localStorage.getItem(\"todos\")) || [];\nlocalStorage.removeItem(\"todos\");" },
      { warn: "Không lưu mật khẩu, token hay dữ liệu nhạy cảm vào localStorage – mọi script trên trang đều đọc được." }
    ],
    example: { html: "<p>Số lần bạn đã chạy ví dụ này: <b id=\"n\"></b></p>", css: "", js: "let n = 0;\ntry {\n  n = Number(localStorage.getItem(\"demo-count\")) || 0;\n  n++;\n  localStorage.setItem(\"demo-count\", n);\n} catch (e) {\n  console.warn(\"Môi trường này chặn localStorage\");\n}\ndocument.querySelector(\"#n\").textContent = n;\n\nconst cauHinh = { theme: \"dark\", fontSize: 16 };\nconsole.log(JSON.stringify(cauHinh, null, 2));" },
    exercise: {
      task: "Viết hàm `capNhatJSON(chuoi)` nhận một chuỗi JSON của object, **tăng thuộc tính `diem` thêm 1**, rồi trả về chuỗi JSON mới. Ví dụ `'{\"ten\":\"An\",\"diem\":5}'` → `'{\"ten\":\"An\",\"diem\":6}'`.",
      starter: { html: "", css: "", js: "function capNhatJSON(chuoi) {\n  // 1. parse  2. tăng diem  3. stringify\n}\n\nconsole.log(capNhatJSON('{\"ten\":\"An\",\"diem\":5}'));" },
      hint: "const obj = JSON.parse(chuoi); obj.diem++; return JSON.stringify(obj);",
      solution: { html: "", css: "", js: "function capNhatJSON(chuoi) {\n  const obj = JSON.parse(chuoi);\n  obj.diem += 1;\n  return JSON.stringify(obj);\n}\n\nconsole.log(capNhatJSON('{\"ten\":\"An\",\"diem\":5}'));" },
      check: `
        if (typeof capNhatJSON!=="function") return {pass:false, msg:"Chưa có hàm capNhatJSON."};
        const r = capNhatJSON('{"ten":"An","diem":5}');
        if (typeof r!=="string") return {pass:false, msg:"Hàm cần trả về chuỗi (dùng JSON.stringify)."};
        let o; try { o = JSON.parse(r); } catch(e) { return {pass:false, msg:"Kết quả không phải JSON hợp lệ."}; }
        if (o.diem!==6 || o.ten!=="An") return {pass:false, msg:"Kết quả: "+r};
        const r2 = JSON.parse(capNhatJSON('{"diem":99,"x":true}'));
        if (r2.diem!==100 || r2.x!==true) return {pass:false, msg:"Cần giữ nguyên các thuộc tính khác."};
        return {pass:true, msg:"Dữ liệu được xử lý gọn gàng! 💾"};`
    }
  },
  {
    id: "final-project", level: "advanced", icon: "🏆", title: "Dự án cuối: Máy đổi màu ngẫu nhiên", duration: 30,
    summary: "Kết hợp HTML + CSS + JS để làm một mini app hoàn chỉnh.",
    content: [
      { h: "Mục tiêu" },
      { p: "Xây app **Color Generator**: bấm nút → nền trang đổi sang màu ngẫu nhiên và hiển thị mã màu HEX. Đây là bài tổng hợp mọi kiến thức đã học." },
      { h: "Gợi ý các bước" },
      { list: [
        "**HTML**: một tiêu đề hiển thị mã màu `#code` và nút `#btn`.",
        "**CSS**: căn giữa bằng Flexbox, nút đẹp có hover, `transition` cho nền.",
        "**JS**: hàm tạo màu ngẫu nhiên, lắng nghe click, cập nhật `document.body.style.background`."
      ] },
      { code: "function mauNgauNhien() {\n  const kyTu = \"0123456789ABCDEF\";\n  let mau = \"#\";\n  for (let i = 0; i < 6; i++) {\n    mau += kyTu[Math.floor(Math.random() * 16)];\n  }\n  return mau;\n}" },
      { tip: "Nâng cấp thêm: bấm vào mã màu để copy (`navigator.clipboard.writeText`), lưu lịch sử màu bằng localStorage, nhấn phím Space để đổi màu." }
    ],
    example: { html: "<div class=\"app\">\n  <h1 id=\"code\">#FFFFFF</h1>\n  <button id=\"btn\">🎲 Đổi màu</button>\n</div>", css: "body {\n  margin: 0; height: 100vh;\n  display: flex; justify-content: center; align-items: center;\n  font-family: sans-serif;\n  transition: background 0.5s;\n}\n.app { text-align: center; background: rgba(255,255,255,.85); padding: 30px 40px; border-radius: 20px; }\n#btn { padding: 12px 24px; font-size: 18px; border: none; border-radius: 999px; background: #111827; color: #fff; cursor: pointer; }\n#btn:hover { transform: scale(1.05); }", js: "function mauNgauNhien() {\n  return \"#\" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, \"0\").toUpperCase();\n}\nconst code = document.querySelector(\"#code\");\ndocument.querySelector(\"#btn\").addEventListener(\"click\", () => {\n  const m = mauNgauNhien();\n  document.body.style.background = m;\n  code.textContent = m;\n});" },
    exercise: {
      task: "Hoàn thiện app: khi bấm `#btn`, nền `body` đổi sang một màu mới và `#code` hiển thị mã màu dạng `#RRGGBB`.",
      starter: { html: "<h1 id=\"code\">#FFFFFF</h1>\n<button id=\"btn\">Đổi màu</button>", css: "body { transition: background .4s; font-family: sans-serif; text-align: center; padding-top: 40px; }", js: "function mauNgauNhien() {\n  // trả về chuỗi dạng #A1B2C3\n}\n\n" },
      hint: "Tham khảo hàm mauNgauNhien trong phần lý thuyết, sau đó addEventListener cho #btn.",
      solution: { html: "<h1 id=\"code\">#FFFFFF</h1>\n<button id=\"btn\">Đổi màu</button>", css: "body { transition: background .4s; font-family: sans-serif; text-align: center; padding-top: 40px; }", js: "function mauNgauNhien() {\n  const kyTu = \"0123456789ABCDEF\";\n  let mau = \"#\";\n  for (let i = 0; i < 6; i++) mau += kyTu[Math.floor(Math.random() * 16)];\n  return mau;\n}\n\nconst code = document.querySelector(\"#code\");\ndocument.querySelector(\"#btn\").addEventListener(\"click\", () => {\n  const m = mauNgauNhien();\n  document.body.style.background = m;\n  code.textContent = m;\n});" },
      check: `
        const btn=T.$("#btn"), code=T.$("#code");
        if (!btn||!code) return {pass:false, msg:"Cần giữ #btn và #code."};
        const seen = new Set();
        for (let i=0;i<4;i++) { T.click(btn); await T.sleep(20);
          const txt = code.textContent.trim();
          if (!/^#[0-9a-fA-F]{6}$/.test(txt)) return {pass:false, msg:"#code cần dạng #RRGGBB, hiện là '"+txt+"'."};
          const bg = document.body.style.background || document.body.style.backgroundColor;
          if (!bg) return {pass:false, msg:"Nền body chưa được đổi (document.body.style.background)."};
          seen.add(txt); }
        if (seen.size<2) return {pass:false, msg:"Màu không thay đổi giữa các lần bấm – cần ngẫu nhiên."};
        return {pass:true, msg:"🏆 CHÚC MỪNG! Bạn đã hoàn thành toàn bộ lộ trình Front-end cơ bản!"};`
    }
  }
];

/* Lộ trình học tiếp sau khi hoàn thành */
const ROADMAP_NEXT = [
  { icon: "🌿", name: "Git & GitHub", desc: "Quản lý phiên bản code, đẩy dự án lên GitHub Pages miễn phí." },
  { icon: "📦", name: "npm & Vite", desc: "Quản lý thư viện, công cụ build hiện đại cho dự án front-end." },
  { icon: "🌬️", name: "Tailwind CSS", desc: "Viết giao diện nhanh bằng utility class." },
  { icon: "🔷", name: "TypeScript", desc: "JavaScript có kiểu dữ liệu – ít bug hơn khi dự án lớn." },
  { icon: "⚛️", name: "React", desc: "Thư viện UI phổ biến nhất: component, state, hooks." },
  { icon: "▲", name: "Next.js", desc: "Framework React cho web thực tế: routing, SEO, server." }
];
