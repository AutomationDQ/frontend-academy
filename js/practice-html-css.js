/* =========================================================
   BÀI LUYỆN TẬP THÊM – Khoá 1: HTML & CSS & Bố cục
   PRACTICE[lessonId] = [{ title, level (1 Dễ · 2 Trung bình · 3 Khó · 4 Thử thách),
                          task, starter, hint, solution, check }]
   - check: giống bài tập chính – chạy trong iframe, có sẵn T.$, T.$$, T.css, T.html…
   - Bài luyện tập không ảnh hưởng tiến độ/chứng nhận, mỗi bài +30 XP
   ========================================================= */
window.PRACTICE = window.PRACTICE || {};
(function () {
  const P = window.PRACTICE;

  /* Helper dùng trong check CSS: đọc mọi quy tắc CSS (kể cả trong @media)
     rule(".a")            → quy tắc .a ngoài @media
     rule(".a", "600px")   → quy tắc .a nằm trong @media có chứa "600px"
     kf("ten")             → @keyframes ten */
  const CSSR = String.raw`
    const ALL = [];
    (function walk(list, media) {
      for (const r of list) {
        if (r.media && r.cssRules) walk(r.cssRules, r.media.mediaText);
        else ALL.push({ r, media, sel: r.selectorText || "", style: r.style });
      }
    })([...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch (e) { return []; } }), "");
    const rule = (sel, media) => ALL.find(x => x.sel.split(",").map(s => s.trim()).includes(sel) && (media === undefined ? !x.media : (x.media || "").includes(media)));
    const kf = name => ALL.map(x => x.r).find(r => r.type === 7 && (!name || r.name === name));
  `;

  /* ===================== HTML ===================== */
  P["html-intro"] = [
    {
      title: "Ba cấp tiêu đề", level: 1,
      task: "Tạo lần lượt một `<h1>`, một `<h2>` và một `<h3>`, mỗi thẻ đều có nội dung (không để trống).",
      starter: { html: "<!-- Viết h1, h2, h3 ở đây -->\n", css: "", js: "" },
      hint: "<h1>Tiêu đề lớn</h1>\n<h2>Tiêu đề vừa</h2>\n<h3>Tiêu đề nhỏ</h3>",
      solution: { html: "<h1>Học Front-end</h1>\n<h2>Phần 1: HTML</h2>\n<h3>Bài 1: Thẻ tiêu đề</h3>", css: "", js: "" },
      check: String.raw`
        for (const t of ["h1", "h2", "h3"]) {
          const el = T.$(t);
          if (!el) return {pass:false, msg:"Chưa thấy thẻ <" + t + ">."};
          if (!el.textContent.trim()) return {pass:false, msg:"Thẻ <" + t + "> đang trống."};
        }
        return {pass:true, msg:"Chuẩn! h1 → h6 là thứ bậc tiêu đề, giống mục lục của một cuốn sách."};`
    },
    {
      title: "Đoạn văn & chú thích", level: 2,
      task: "Viết **ít nhất 3** thẻ `<p>` có nội dung, và thêm **một chú thích HTML** `<!-- ... -->` giải thích đoạn code của bạn.",
      starter: { html: "", css: "", js: "" },
      hint: "Chú thích không hiển thị trên trang: <!-- Đây là phần giới thiệu -->",
      solution: { html: "<!-- Phần giới thiệu bản thân -->\n<p>Mình tên là Quảng.</p>\n<p>Mình là kỹ sư tự động hoá.</p>\n<p>Mình đang học làm web.</p>", css: "", js: "" },
      check: String.raw`
        if (!/<!--[\s\S]*?-->/.test(T.html)) return {pass:false, msg:"Chưa có chú thích dạng <!-- ... -->."};
        const ps = T.$$("p").filter(p => p.textContent.trim());
        if (ps.length < 3) return {pass:false, msg:"Cần ít nhất 3 thẻ <p> có nội dung (đang có " + ps.length + ")."};
        return {pass:true, msg:"Tốt! Chú thích giúp người khác (và chính bạn sau này) hiểu code."};`
    },
    {
      title: "Sửa lỗi thẻ đóng/mở", level: 3,
      task: "Đoạn HTML sau viết sai thẻ đóng nên trình duyệt hiểu nhầm. Hãy sửa để trang có **đúng 1** `<h1>` (chữ *Trang của tôi*) và **đúng 2** `<p>` (*Đoạn 1*, *Đoạn 2*), mọi thẻ đều được đóng đúng.",
      starter: { html: "<h1>Trang của tôi<h1>\n<p>Đoạn 1\n<p>Đoạn 2</h1>\n", css: "", js: "" },
      hint: "Thẻ đóng luôn có dấu gạch chéo: </h1>, </p>. Thẻ đóng phải cùng tên với thẻ mở.",
      solution: { html: "<h1>Trang của tôi</h1>\n<p>Đoạn 1</p>\n<p>Đoạn 2</p>", css: "", js: "" },
      check: String.raw`
        const h1s = T.$$("h1"), ps = T.$$("p");
        const cnt = re => (T.html.match(re) || []).length;
        if (h1s.length !== 1 || cnt(/<\/h1>/gi) !== 1) return {pass:false, msg:"Phải có đúng 1 cặp <h1>...</h1> (đang có " + h1s.length + " thẻ h1)."};
        if (h1s[0].textContent.trim() !== "Trang của tôi") return {pass:false, msg:"<h1> phải chứa đúng chữ 'Trang của tôi'."};
        if (ps.length !== 2 || cnt(/<\/p>/gi) !== 2) return {pass:false, msg:"Cần đúng 2 cặp <p>...</p>, mỗi thẻ đều có </p>."};
        if (ps[0].textContent.trim() !== "Đoạn 1" || ps[1].textContent.trim() !== "Đoạn 2") return {pass:false, msg:"Nội dung 2 đoạn phải là 'Đoạn 1' và 'Đoạn 2'."};
        return {pass:true, msg:"Mắt tinh đấy! Lỗi quên dấu / là lỗi HTML phổ biến nhất."};`
    },
    {
      title: "Trang giới thiệu có bố cục", level: 4,
      task: "Làm trang giới thiệu gồm:\n• 1 `<h1>` là tên bạn.\n• **Ít nhất 2** `<h2>` (vd *Sở thích*, *Mục tiêu*), **ngay sau mỗi** `<h2>` là một `<p>` có nội dung.\n• Một đường kẻ ngang `<hr>` ngăn cách giữa các phần.",
      starter: { html: "", css: "", js: "" },
      hint: "Cấu trúc: h1 → h2 → p → hr → h2 → p. 'Ngay sau' nghĩa là thẻ <p> đứng liền kề sau </h2>.",
      solution: { html: "<h1>Trần Doãn Quảng</h1>\n<h2>Sở thích</h2>\n<p>Lập trình, tự động hoá và đọc sách.</p>\n<hr>\n<h2>Mục tiêu</h2>\n<p>Trở thành full-stack developer.</p>", css: "", js: "" },
      check: String.raw`
        if (T.$$("h1").length !== 1 || !T.$("h1").textContent.trim()) return {pass:false, msg:"Cần đúng 1 thẻ <h1> có nội dung."};
        const h2s = T.$$("h2");
        if (h2s.length < 2) return {pass:false, msg:"Cần ít nhất 2 thẻ <h2>."};
        for (const h of h2s) {
          const n = h.nextElementSibling;
          if (!n || n.tagName !== "P" || !n.textContent.trim()) return {pass:false, msg:"Ngay sau <h2>'" + h.textContent.trim() + "' phải là một <p> có nội dung."};
        }
        if (!T.$("hr")) return {pass:false, msg:"Thiếu đường kẻ ngang <hr>."};
        return {pass:true, msg:"Trang có cấu trúc rõ ràng – Google và trình đọc màn hình đều thích điều này!"};`
    }
  ];

  P["html-text"] = [
    {
      title: "In đậm và in nghiêng", level: 1,
      task: "Viết một `<p>` bên trong có **một** từ được bọc bởi `<strong>` và **một** từ được bọc bởi `<em>`.",
      starter: { html: "<p>Học lập trình cần kiên trì và sáng tạo.</p>\n", css: "", js: "" },
      hint: "<p>Học lập trình cần <strong>kiên trì</strong> và <em>sáng tạo</em>.</p>",
      solution: { html: "<p>Học lập trình cần <strong>kiên trì</strong> và <em>sáng tạo</em>.</p>", css: "", js: "" },
      check: String.raw`
        const s = T.$("p strong"), e = T.$("p em");
        if (!s || !s.textContent.trim()) return {pass:false, msg:"Cần một <strong> có chữ, nằm bên trong <p>."};
        if (!e || !e.textContent.trim()) return {pass:false, msg:"Cần một <em> có chữ, nằm bên trong <p>."};
        return {pass:true, msg:"Đúng rồi! <strong>/<em> mang ý nghĩa nhấn mạnh, không chỉ là kiểu chữ."};`
    },
    {
      title: "Công thức nấu ăn – danh sách có thứ tự", level: 2,
      task: "Viết `<h2>` *Cách nấu mì* và một danh sách **có thứ tự** `<ol>` gồm **ít nhất 4 bước** (mỗi `<li>` có nội dung).",
      starter: { html: "", css: "", js: "" },
      hint: "ol = ordered list (đánh số 1, 2, 3…), ul = unordered list (dấu chấm).",
      solution: { html: "<h2>Cách nấu mì</h2>\n<ol>\n  <li>Đun sôi 400ml nước</li>\n  <li>Cho mì và gói gia vị vào</li>\n  <li>Đợi 3 phút</li>\n  <li>Thêm trứng, hành và thưởng thức</li>\n</ol>", css: "", js: "" },
      check: String.raw`
        if (!T.$("h2") || !/mì/i.test(T.$("h2").textContent)) return {pass:false, msg:"Cần <h2> chứa chữ 'Cách nấu mì'."};
        const lis = T.$$("ol > li").filter(li => li.textContent.trim());
        if (T.$("ul") && !T.$("ol")) return {pass:false, msg:"Các bước cần thứ tự → dùng <ol> chứ không phải <ul>."};
        if (lis.length < 4) return {pass:false, msg:"<ol> cần ít nhất 4 <li> có nội dung (đang có " + lis.length + ")."};
        return {pass:true, msg:"Ngon! Trình duyệt tự đánh số cho bạn."};`
    },
    {
      title: "Thanh điều hướng có link", level: 3,
      task: "Tạo `<nav>` chứa `<ul>` với **3 mục** `<li>`, mỗi mục là một `<a>` trỏ tới vị trí trong trang: `#home`, `#about`, `#contact`.\nThêm một link **ra ngoài** (href bắt đầu bằng `https://`) mở ở **tab mới** bằng `target=\"_blank\"`.",
      starter: { html: "", css: "", js: "" },
      hint: "<a href=\"#about\">Giới thiệu</a> · <a href=\"https://github.com\" target=\"_blank\">GitHub</a>",
      solution: { html: "<nav>\n  <ul>\n    <li><a href=\"#home\">Trang chủ</a></li>\n    <li><a href=\"#about\">Giới thiệu</a></li>\n    <li><a href=\"#contact\">Liên hệ</a></li>\n  </ul>\n</nav>\n<p>Xem code của mình trên <a href=\"https://github.com\" target=\"_blank\" rel=\"noopener\">GitHub</a>.</p>", css: "", js: "" },
      check: String.raw`
        const links = T.$$("nav ul li a").map(a => a.getAttribute("href"));
        for (const h of ["#home", "#about", "#contact"]) if (!links.includes(h)) return {pass:false, msg:"Trong nav > ul > li cần có link href=\"" + h + "\"."};
        const ext = T.$$("a").find(a => /^https:\/\//.test(a.getAttribute("href") || ""));
        if (!ext) return {pass:false, msg:"Cần một link ra ngoài có href bắt đầu bằng https://"};
        if (ext.getAttribute("target") !== "_blank") return {pass:false, msg:"Link ra ngoài cần target=\"_blank\" để mở tab mới."};
        return {pass:true, msg:"Tuyệt! Mẹo: thêm rel=\"noopener\" cho link _blank để an toàn hơn."};`
    },
    {
      title: "Danh sách lồng nhau", level: 4,
      task: "Tạo `<ul>` có 2 mục: **Front-end** và **Back-end**. Bên trong **mỗi** mục có một `<ul>` con với **ít nhất 2** công nghệ (vd HTML, CSS… / Node.js, SQL…).",
      starter: { html: "", css: "", js: "" },
      hint: "<li>Front-end\n  <ul><li>HTML</li><li>CSS</li></ul>\n</li> — danh sách con nằm BÊN TRONG <li>, trước </li>.",
      solution: { html: "<ul>\n  <li>Front-end\n    <ul>\n      <li>HTML</li>\n      <li>CSS</li>\n      <li>JavaScript</li>\n    </ul>\n  </li>\n  <li>Back-end\n    <ul>\n      <li>Node.js</li>\n      <li>SQL</li>\n    </ul>\n  </li>\n</ul>", css: "", js: "" },
      check: String.raw`
        const top = T.$$("body > ul > li");
        if (top.length < 2) return {pass:false, msg:"Danh sách ngoài cùng cần 2 <li> (Front-end, Back-end)."};
        const name = li => (li.firstChild && li.firstChild.textContent || "").trim().toLowerCase();
        const fe = top.find(li => name(li).includes("front")), be = top.find(li => name(li).includes("back"));
        if (!fe || !be) return {pass:false, msg:"Hai mục ngoài cần ghi 'Front-end' và 'Back-end'."};
        for (const li of [fe, be]) {
          const sub = li.querySelector(":scope > ul");
          if (!sub) return {pass:false, msg:"Mục '" + name(li) + "' chưa có <ul> con nằm bên trong <li>."};
          if (sub.querySelectorAll(":scope > li").length < 2) return {pass:false, msg:"Danh sách con của '" + name(li) + "' cần ít nhất 2 mục."};
        }
        return {pass:true, msg:"Chuẩn! Menu nhiều cấp trên các website đều là danh sách lồng nhau như vậy."};`
    }
  ];

  P["html-media"] = [
    {
      title: "Ảnh có kích thước", level: 1,
      task: "Chèn một `<img>` có `src`, `alt` mô tả (không rỗng) và thuộc tính `width=\"200\"`.",
      starter: { html: "", css: "", js: "" },
      hint: "<img src=\"https://picsum.photos/400\" alt=\"Ảnh phong cảnh\" width=\"200\">",
      solution: { html: "<img src=\"https://picsum.photos/400\" alt=\"Ảnh phong cảnh ngẫu nhiên\" width=\"200\">", css: "", js: "" },
      check: String.raw`
        const img = T.$("img");
        if (!img) return {pass:false, msg:"Chưa có thẻ <img>."};
        if (!img.getAttribute("src")) return {pass:false, msg:"<img> cần thuộc tính src."};
        if (!(img.getAttribute("alt") || "").trim()) return {pass:false, msg:"alt không được để trống – nó giúp người khiếm thị và SEO."};
        if (img.getAttribute("width") !== "200") return {pass:false, msg:"Cần width=\"200\"."};
        return {pass:true, msg:"Đẹp! Khai báo width giúp trang không bị 'giật' khi ảnh tải xong."};`
    },
    {
      title: "Ảnh kèm chú thích – figure", level: 2,
      task: "Dùng `<figure>` bọc một `<img>` (có `alt`) và một `<figcaption>` chú thích cho ảnh.",
      starter: { html: "", css: "", js: "" },
      hint: "<figure>\n  <img src=\"...\" alt=\"...\">\n  <figcaption>Chú thích ảnh</figcaption>\n</figure>",
      solution: { html: "<figure>\n  <img src=\"https://picsum.photos/300/200\" alt=\"Vịnh Hạ Long\" width=\"300\">\n  <figcaption>Vịnh Hạ Long – di sản thiên nhiên thế giới</figcaption>\n</figure>", css: "", js: "" },
      check: String.raw`
        const f = T.$("figure");
        if (!f) return {pass:false, msg:"Chưa có <figure>."};
        const img = f.querySelector("img"), cap = f.querySelector("figcaption");
        if (!img || !(img.getAttribute("alt") || "").trim()) return {pass:false, msg:"Trong <figure> cần <img> có alt."};
        if (!cap || !cap.textContent.trim()) return {pass:false, msg:"Trong <figure> cần <figcaption> có nội dung."};
        return {pass:true, msg:"Chính xác – figure + figcaption gắn chú thích với ảnh về mặt ngữ nghĩa."};`
    },
    {
      title: "Bảng điểm chuẩn cấu trúc", level: 3,
      task: "Tạo bảng điểm có:\n• `<thead>` chứa 1 hàng với **3** ô `<th>`: *Họ tên*, *Môn*, *Điểm*.\n• `<tbody>` chứa **ít nhất 3** hàng, mỗi hàng **3** ô `<td>`.",
      starter: { html: "", css: "td, th { border: 1px solid #94a3b8; padding: 6px 10px; }\ntable { border-collapse: collapse; }", js: "" },
      hint: "<table>\n  <thead><tr><th>Họ tên</th><th>Môn</th><th>Điểm</th></tr></thead>\n  <tbody>\n    <tr><td>An</td><td>Toán</td><td>9</td></tr>\n  </tbody>\n</table>",
      solution: { html: "<table>\n  <thead>\n    <tr><th>Họ tên</th><th>Môn</th><th>Điểm</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>An</td><td>Toán</td><td>9</td></tr>\n    <tr><td>Bình</td><td>Văn</td><td>8</td></tr>\n    <tr><td>Chi</td><td>Anh</td><td>10</td></tr>\n  </tbody>\n</table>", css: "td, th { border: 1px solid #94a3b8; padding: 6px 10px; }\ntable { border-collapse: collapse; }", js: "" },
      check: String.raw`
        const ths = T.$$("table thead tr th").map(t => t.textContent.trim().toLowerCase());
        if (ths.length !== 3) return {pass:false, msg:"<thead> cần đúng 3 ô <th> (đang có " + ths.length + ")."};
        if (!ths[0].includes("họ tên") || !ths[1].includes("môn") || !ths[2].includes("điểm")) return {pass:false, msg:"3 tiêu đề lần lượt là: Họ tên, Môn, Điểm."};
        const rows = T.$$("table tbody tr");
        if (rows.length < 3) return {pass:false, msg:"<tbody> cần ít nhất 3 hàng."};
        if (rows.some(r => r.querySelectorAll("td").length !== 3)) return {pass:false, msg:"Mỗi hàng trong <tbody> cần đúng 3 ô <td>."};
        return {pass:true, msg:"Bảng chuẩn chỉnh! thead/tbody giúp in ấn và đọc màn hình tốt hơn."};`
    },
    {
      title: "Gộp ô: colspan & rowspan", level: 4,
      task: "Làm **thời khoá biểu** có:\n• `<caption>` tiêu đề bảng.\n• Một ô tiêu đề gộp **2 cột** bằng `colspan=\"2\"`.\n• Một ô dữ liệu gộp **2 hàng** bằng `rowspan=\"2\"`.",
      starter: { html: "", css: "td, th { border: 1px solid #94a3b8; padding: 6px 10px; text-align: center; }\ntable { border-collapse: collapse; }", js: "" },
      hint: "<th colspan=\"2\">Buổi sáng</th> chiếm chỗ 2 cột; <td rowspan=\"2\">Toán</td> chiếm chỗ 2 hàng – hàng dưới bớt đi 1 ô.",
      solution: { html: "<table>\n  <caption>Thời khoá biểu thứ Hai</caption>\n  <tr><th>Lớp</th><th colspan=\"2\">Buổi sáng</th></tr>\n  <tr><td>12A1</td><td rowspan=\"2\">Toán</td><td>Văn</td></tr>\n  <tr><td>12A2</td><td>Anh</td></tr>\n</table>", css: "td, th { border: 1px solid #94a3b8; padding: 6px 10px; text-align: center; }\ntable { border-collapse: collapse; }", js: "" },
      check: String.raw`
        if (!T.$("table caption") || !T.$("table caption").textContent.trim()) return {pass:false, msg:"Bảng cần <caption> có nội dung."};
        if (!T.$$("table th, table td").some(c => c.colSpan === 2)) return {pass:false, msg:"Chưa có ô nào colspan=\"2\"."};
        if (!T.$$("table td, table th").some(c => c.rowSpan === 2)) return {pass:false, msg:"Chưa có ô nào rowspan=\"2\"."};
        return {pass:true, msg:"Thử thách hoàn thành! Gộp ô là kỹ năng hay dùng khi làm bảng báo cáo."};`
    }
  ];

  P["html-form"] = [
    {
      title: "Ô nhập bắt buộc", level: 1,
      task: "Tạo `<input type=\"text\">` có `name=\"hoTen\"`, `placeholder` gợi ý và thuộc tính `required`.",
      starter: { html: "<form>\n  \n</form>\n", css: "", js: "" },
      hint: "<input type=\"text\" name=\"hoTen\" placeholder=\"Nhập họ tên\" required>",
      solution: { html: "<form>\n  <input type=\"text\" name=\"hoTen\" placeholder=\"Nhập họ tên\" required>\n</form>", css: "", js: "" },
      check: String.raw`
        const i = T.$("input[name=hoTen]");
        if (!i) return {pass:false, msg:"Chưa có input name=\"hoTen\"."};
        if (i.type !== "text") return {pass:false, msg:"Input cần type=\"text\"."};
        if (!i.placeholder.trim()) return {pass:false, msg:"Thêm placeholder để gợi ý người dùng."};
        if (!i.required) return {pass:false, msg:"Thiếu thuộc tính required."};
        return {pass:true, msg:"Tốt! required giúp trình duyệt tự chặn form khi ô còn trống."};`
    },
    {
      title: "Radio & checkbox", level: 2,
      task: "Tạo nhóm **2 radio** chọn giới tính (`name=\"gioiTinh\"`, giá trị `nam` / `nu`) và **1 checkbox** *Đồng ý điều khoản*. Mỗi input đều có `id` và `<label for>` trỏ đúng.",
      starter: { html: "<form>\n  \n</form>\n", css: "", js: "" },
      hint: "Các radio cùng nhóm phải có CÙNG name thì mới chỉ chọn được 1. <input type=\"radio\" id=\"nam\" name=\"gioiTinh\" value=\"nam\"><label for=\"nam\">Nam</label>",
      solution: { html: "<form>\n  <input type=\"radio\" id=\"nam\" name=\"gioiTinh\" value=\"nam\">\n  <label for=\"nam\">Nam</label>\n  <input type=\"radio\" id=\"nu\" name=\"gioiTinh\" value=\"nu\">\n  <label for=\"nu\">Nữ</label>\n  <br>\n  <input type=\"checkbox\" id=\"dongY\" name=\"dongY\">\n  <label for=\"dongY\">Đồng ý điều khoản</label>\n</form>", css: "", js: "" },
      check: String.raw`
        const radios = T.$$("input[type=radio][name=gioiTinh]");
        if (radios.length < 2) return {pass:false, msg:"Cần 2 radio cùng name=\"gioiTinh\"."};
        const vals = radios.map(r => r.value);
        if (!vals.includes("nam") || !vals.includes("nu")) return {pass:false, msg:"Giá trị 2 radio là 'nam' và 'nu'."};
        const cb = T.$("input[type=checkbox]");
        if (!cb) return {pass:false, msg:"Chưa có checkbox."};
        for (const i of [...radios, cb]) {
          if (!i.id) return {pass:false, msg:"Mỗi input cần có id."};
          if (!T.$("label[for='" + i.id + "']")) return {pass:false, msg:"Thiếu <label for=\"" + i.id + "\">."};
        }
        return {pass:true, msg:"Hay lắm! Bấm vào chữ của label cũng chọn được ô – tiện hơn hẳn trên điện thoại."};`
    },
    {
      title: "Select & textarea", level: 3,
      task: "Tạo form liên hệ gồm:\n• `<select id=\"chuDe\">` với **ít nhất 3** `<option>`.\n• `<textarea id=\"noiDung\">` có `rows=\"4\"`.\n• Mỗi trường có `<label for>` tương ứng và một `<button type=\"submit\">`.",
      starter: { html: "<form>\n  \n</form>\n", css: "", js: "" },
      hint: "<select id=\"chuDe\"><option>Hỏi đáp</option>...</select>\n<textarea id=\"noiDung\" rows=\"4\"></textarea>",
      solution: { html: "<form>\n  <label for=\"chuDe\">Chủ đề</label>\n  <select id=\"chuDe\" name=\"chuDe\">\n    <option value=\"hoi\">Hỏi đáp</option>\n    <option value=\"gopy\">Góp ý</option>\n    <option value=\"khac\">Khác</option>\n  </select>\n  <br>\n  <label for=\"noiDung\">Nội dung</label>\n  <textarea id=\"noiDung\" name=\"noiDung\" rows=\"4\"></textarea>\n  <button type=\"submit\">Gửi</button>\n</form>", css: "", js: "" },
      check: String.raw`
        const s = T.$("select#chuDe"), t = T.$("textarea#noiDung");
        if (!s) return {pass:false, msg:"Cần <select id=\"chuDe\">."};
        if (s.options.length < 3) return {pass:false, msg:"<select> cần ít nhất 3 <option>."};
        if (!t) return {pass:false, msg:"Cần <textarea id=\"noiDung\">."};
        if (t.getAttribute("rows") !== "4") return {pass:false, msg:"<textarea> cần rows=\"4\"."};
        for (const id of ["chuDe", "noiDung"]) if (!T.$("label[for=" + id + "]")) return {pass:false, msg:"Thiếu <label for=\"" + id + "\">."};
        if (!T.$("form button[type=submit]")) return {pass:false, msg:"Cần <button type=\"submit\"> trong form."};
        return {pass:true, msg:"Form liên hệ hoàn chỉnh!"};`
    },
    {
      title: "Bố cục trang ngữ nghĩa", level: 4,
      task: "Dựng khung trang bằng thẻ ngữ nghĩa:\n• `<header>` chứa `<nav>`.\n• `<main>` chứa **ít nhất 2** `<article>`, mỗi article có `<h2>`.\n• `<footer>` có ký hiệu bản quyền `©`.",
      starter: { html: "", css: "", js: "" },
      hint: "Không dùng <div> cho mọi thứ! header > nav, main > article > h2, footer > p.",
      solution: { html: "<header>\n  <nav><a href=\"#\">Trang chủ</a> | <a href=\"#blog\">Blog</a></nav>\n</header>\n<main>\n  <article>\n    <h2>Học HTML</h2>\n    <p>HTML là bộ khung của web.</p>\n  </article>\n  <article>\n    <h2>Học CSS</h2>\n    <p>CSS làm web đẹp hơn.</p>\n  </article>\n</main>\n<footer>\n  <p>© 2026 Doãn Quảng</p>\n</footer>", css: "", js: "" },
      check: String.raw`
        if (!T.$("header nav")) return {pass:false, msg:"Cần <header> chứa <nav>."};
        const arts = T.$$("main article");
        if (arts.length < 2) return {pass:false, msg:"<main> cần ít nhất 2 <article>."};
        if (arts.some(a => !a.querySelector("h2"))) return {pass:false, msg:"Mỗi <article> cần một <h2>."};
        const f = T.$("footer");
        if (!f || !f.textContent.includes("©")) return {pass:false, msg:"<footer> cần có ký hiệu ©."};
        return {pass:true, msg:"Đây chính là bộ khung của hầu hết các trang blog/tin tức!"};`
    }
  ];

  /* ===================== CSS ===================== */
  P["css-intro"] = [
    {
      title: "Selector theo tên thẻ", level: 1,
      task: "Viết CSS để **mọi** thẻ `<p>` có màu chữ xanh dương `blue`.",
      starter: { html: "<h1>Tiêu đề</h1>\n<p>Đoạn văn thứ nhất.</p>\n<p>Đoạn văn thứ hai.</p>", css: "/* Viết CSS ở đây */\n", js: "" },
      hint: "p { color: blue; }",
      solution: { html: "<h1>Tiêu đề</h1>\n<p>Đoạn văn thứ nhất.</p>\n<p>Đoạn văn thứ hai.</p>", css: "p {\n  color: blue;\n}", js: "" },
      check: String.raw`
        const ps = T.$$("p");
        if (ps.some(p => T.css(p, "color") !== "rgb(0, 0, 255)")) return {pass:false, msg:"Tất cả <p> phải có color: blue."};
        if (T.css(T.$("h1"), "color") === "rgb(0, 0, 255)") return {pass:false, msg:"Chỉ đổi màu thẻ p thôi, h1 giữ nguyên nhé."};
        return {pass:true, msg:"Chuẩn! Selector theo tên thẻ áp dụng cho mọi thẻ cùng loại."};`
    },
    {
      title: "Selector id", level: 2,
      task: "Cho phần tử `#logo` có nền vàng `yellow` và chữ đậm `font-weight: bold`.",
      starter: { html: "<div id=\"logo\">Front-end Academy</div>\n<p>Chào mừng bạn!</p>", css: "", js: "" },
      hint: "Selector id bắt đầu bằng dấu #: #logo { ... }",
      solution: { html: "<div id=\"logo\">Front-end Academy</div>\n<p>Chào mừng bạn!</p>", css: "#logo {\n  background: yellow;\n  font-weight: bold;\n}", js: "" },
      check: String.raw`
        const el = T.$("#logo");
        if (T.css(el, "background-color") !== "rgb(255, 255, 0)") return {pass:false, msg:"#logo cần nền yellow."};
        if (+T.css(el, "font-weight") < 700) return {pass:false, msg:"#logo cần font-weight: bold."};
        return {pass:true, msg:"Đúng! Nhớ: id là duy nhất trên trang, class thì dùng lại được nhiều lần."};`
    },
    {
      title: "Selector con cháu & nhóm", level: 3,
      task: "• Chỉ những link **nằm trong** `.menu` có màu `green` (link ngoài menu giữ màu mặc định).\n• `h1` **và** `h2` được căn giữa (`text-align: center`) bằng **một** quy tắc gộp nhóm.",
      starter: { html: "<h1>Trang chủ</h1>\n<div class=\"menu\">\n  <a href=\"#\">Giới thiệu</a>\n  <a href=\"#\">Liên hệ</a>\n</div>\n<h2>Tin mới</h2>\n<a class=\"out\" href=\"#\">Link ngoài menu</a>", css: "", js: "" },
      hint: "Con cháu: .menu a { } — có dấu cách. Gộp nhóm: h1, h2 { } — có dấu phẩy.",
      solution: { html: "<h1>Trang chủ</h1>\n<div class=\"menu\">\n  <a href=\"#\">Giới thiệu</a>\n  <a href=\"#\">Liên hệ</a>\n</div>\n<h2>Tin mới</h2>\n<a class=\"out\" href=\"#\">Link ngoài menu</a>", css: ".menu a {\n  color: green;\n}\nh1, h2 {\n  text-align: center;\n}", js: "" },
      check: CSSR + String.raw`
        if (T.$$(".menu a").some(a => T.css(a, "color") !== "rgb(0, 128, 0)")) return {pass:false, msg:"Link trong .menu phải màu green."};
        if (T.css(T.$(".out"), "color") === "rgb(0, 128, 0)") return {pass:false, msg:"Link ngoài menu không được đổi màu – hãy dùng selector .menu a."};
        if (T.css(T.$("h1"), "text-align") !== "center" || T.css(T.$("h2"), "text-align") !== "center") return {pass:false, msg:"h1 và h2 cần text-align: center."};
        if (!ALL.some(x => /h1\s*,\s*h2|h2\s*,\s*h1/.test(x.sel))) return {pass:false, msg:"Hãy gộp nhóm bằng một quy tắc 'h1, h2 { }'."};
        return {pass:true, msg:"Xuất sắc! Dấu cách = con cháu, dấu phẩy = gộp nhóm."};`
    },
    {
      title: "Màu HEX, RGB & RGBA", level: 4,
      task: "Trang trí thẻ `.card`:\n• Nền màu HEX `#1e293b`, chữ trắng `#fff`.\n• `.card .title` màu vàng `rgb(250, 204, 21)`.\n• `.highlight` nền vàng trong suốt 50%: `rgba(250, 204, 21, 0.5)`.",
      starter: { html: "<div class=\"card\">\n  <h2 class=\"title\">Thẻ sản phẩm</h2>\n  <p>Giá chỉ <span class=\"highlight\">99.000đ</span></p>\n</div>", css: ".card { padding: 16px; border-radius: 12px; }\n", js: "" },
      hint: "#1e293b = rgb(30, 41, 59). Kênh thứ 4 của rgba là độ trong suốt (0 → 1).",
      solution: { html: "<div class=\"card\">\n  <h2 class=\"title\">Thẻ sản phẩm</h2>\n  <p>Giá chỉ <span class=\"highlight\">99.000đ</span></p>\n</div>", css: ".card {\n  padding: 16px;\n  border-radius: 12px;\n  background: #1e293b;\n  color: #fff;\n}\n.card .title {\n  color: rgb(250, 204, 21);\n}\n.highlight {\n  background: rgba(250, 204, 21, 0.5);\n}", js: "" },
      check: String.raw`
        const c = T.$(".card");
        if (T.css(c, "background-color") !== "rgb(30, 41, 59)") return {pass:false, msg:".card cần nền #1e293b."};
        if (T.css(c.querySelector("p"), "color") !== "rgb(255, 255, 255)") return {pass:false, msg:".card cần chữ trắng #fff."};
        if (T.css(T.$(".title"), "color") !== "rgb(250, 204, 21)") return {pass:false, msg:".card .title cần màu rgb(250, 204, 21)."};
        if (T.css(T.$(".highlight"), "background-color") !== "rgba(250, 204, 21, 0.5)") return {pass:false, msg:".highlight cần nền rgba(250, 204, 21, 0.5)."};
        return {pass:true, msg:"Bạn đã làm chủ 3 cách viết màu phổ biến nhất trong CSS!"};`
    }
  ];

  P["css-box"] = [
    {
      title: "Kích thước & margin", level: 1,
      task: "Cho `.box`: `width` **200px**, `height` **100px** và `margin` **20px**.",
      starter: { html: "<div class=\"box\">Hộp</div>", css: ".box { background: #bbf7d0; }\n", js: "" },
      hint: ".box { width: 200px; height: 100px; margin: 20px; }",
      solution: { html: "<div class=\"box\">Hộp</div>", css: ".box {\n  background: #bbf7d0;\n  width: 200px;\n  height: 100px;\n  margin: 20px;\n}", js: "" },
      check: String.raw`
        const b = T.$(".box");
        if (T.css(b, "width") !== "200px" || T.css(b, "height") !== "100px") return {pass:false, msg:"Cần width 200px và height 100px."};
        if (["top", "right", "bottom", "left"].some(s => T.css(b, "margin-" + s) !== "20px")) return {pass:false, msg:"Cần margin 20px cho cả 4 phía."};
        return {pass:true, msg:"Đúng rồi! margin là khoảng cách bên ngoài viền."};`
    },
    {
      title: "box-sizing: border-box", level: 2,
      task: "`.box` có `width: 300px`, `padding: 20px` và viền `5px solid`. Hãy dùng `box-sizing` sao cho **tổng chiều rộng hiển thị** của hộp vẫn đúng **300px**.",
      starter: { html: "<div class=\"box\">Tổng chiều rộng phải là 300px</div>", css: ".box {\n  width: 300px;\n  padding: 20px;\n  border: 5px solid #16a34a;\n}", js: "" },
      hint: "Mặc định (content-box) chiều rộng = 300 + 20×2 + 5×2 = 350px. Thêm box-sizing: border-box;",
      solution: { html: "<div class=\"box\">Tổng chiều rộng phải là 300px</div>", css: ".box {\n  width: 300px;\n  padding: 20px;\n  border: 5px solid #16a34a;\n  box-sizing: border-box;\n}", js: "" },
      check: String.raw`
        const b = T.$(".box");
        if (T.css(b, "padding-left") !== "20px" || T.css(b, "border-left-width") !== "5px") return {pass:false, msg:"Giữ nguyên padding 20px và border 5px."};
        if (b.offsetWidth !== 300) return {pass:false, msg:"Chiều rộng hiển thị đang là " + b.offsetWidth + "px, cần 300px."};
        return {pass:true, msg:"Chuẩn! Hầu hết dự án đặt * { box-sizing: border-box; } ngay từ đầu."};`
    },
    {
      title: "Căn giữa khối bằng margin auto", level: 3,
      task: "Cho `.container` rộng **400px** và **căn giữa theo chiều ngang** trang bằng `margin` (trái = phải tự động).",
      starter: { html: "<div class=\"container\">Nội dung nằm giữa trang</div>", css: ".container { background: #fef9c3; padding: 12px; }\n", js: "" },
      hint: "margin: 0 auto; → trên/dưới 0, trái/phải tự chia đều. Khối phải có width thì mới căn giữa được.",
      solution: { html: "<div class=\"container\">Nội dung nằm giữa trang</div>", css: ".container {\n  background: #fef9c3;\n  padding: 12px;\n  width: 400px;\n  margin: 0 auto;\n}", js: "" },
      check: String.raw`
        const c = T.$(".container");
        if (T.css(c, "width") !== "400px") return {pass:false, msg:"Cần width: 400px."};
        const ml = parseFloat(T.css(c, "margin-left")), mr = parseFloat(T.css(c, "margin-right"));
        if (!(ml > 0) || Math.abs(ml - mr) > 1) return {pass:false, msg:"Margin trái và phải phải bằng nhau và lớn hơn 0 – dùng margin: 0 auto."};
        return {pass:true, msg:"Đây là cách căn giữa kinh điển cho khung trang web!"};`
    },
    {
      title: "Thẻ trích dẫn có viền một bên", level: 4,
      task: "Trang trí `.quote`:\n• Chỉ có **viền trái** `6px solid` (các phía khác **không** có viền).\n• `padding` trên/dưới **24px**, trái/phải **16px** (viết gọn 1 dòng).\n• Bo góc `8px` và có đổ bóng `box-shadow`.",
      starter: { html: "<blockquote class=\"quote\">Học, học nữa, học mãi.</blockquote>", css: ".quote { background: #f0fdf4; margin: 20px; }\n", js: "" },
      hint: "border-left: 6px solid #16a34a; padding: 24px 16px; (2 giá trị = trên/dưới, trái/phải)",
      solution: { html: "<blockquote class=\"quote\">Học, học nữa, học mãi.</blockquote>", css: ".quote {\n  background: #f0fdf4;\n  margin: 20px;\n  border-left: 6px solid #16a34a;\n  padding: 24px 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}", js: "" },
      check: String.raw`
        const q = T.$(".quote");
        if (T.css(q, "border-left-width") !== "6px" || T.css(q, "border-left-style") !== "solid") return {pass:false, msg:"Cần border-left: 6px solid."};
        if (["top", "right", "bottom"].some(s => T.css(q, "border-" + s + "-width") !== "0px")) return {pass:false, msg:"Chỉ viền trái thôi – các phía khác không có viền."};
        if (T.css(q, "padding-top") !== "24px" || T.css(q, "padding-bottom") !== "24px" || T.css(q, "padding-left") !== "16px" || T.css(q, "padding-right") !== "16px") return {pass:false, msg:"Cần padding: 24px 16px."};
        if (T.css(q, "border-top-left-radius") !== "8px") return {pass:false, msg:"Cần border-radius: 8px."};
        if (T.css(q, "box-shadow") === "none") return {pass:false, msg:"Thêm box-shadow nhé."};
        return {pass:true, msg:"Đẹp như blog chuyên nghiệp! Bạn đã nắm vững box model."};`
    }
  ];

  P["css-style"] = [
    {
      title: "Kiểu chữ cơ bản", level: 1,
      task: "Cho `.text`: cỡ chữ `1.5rem` (= 24px), chữ đậm `700` và **viết hoa toàn bộ** bằng `text-transform`.",
      starter: { html: "<p class=\"text\">front-end academy</p>", css: "", js: "" },
      hint: "font-size: 1.5rem; font-weight: 700; text-transform: uppercase;",
      solution: { html: "<p class=\"text\">front-end academy</p>", css: ".text {\n  font-size: 1.5rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}", js: "" },
      check: String.raw`
        const t = T.$(".text");
        if (T.css(t, "font-size") !== "24px") return {pass:false, msg:"Cỡ chữ cần 1.5rem (= 24px)."};
        if (+T.css(t, "font-weight") !== 700) return {pass:false, msg:"Cần font-weight: 700."};
        if (T.css(t, "text-transform") !== "uppercase") return {pass:false, msg:"Cần text-transform: uppercase."};
        return {pass:true, msg:"rem tính theo cỡ chữ gốc (16px) – rất tiện để responsive."};`
    },
    {
      title: "Link không gạch chân + hover", level: 2,
      task: "Cho `.link`: **bỏ gạch chân** (`text-decoration: none`), màu `#16a34a`. Viết thêm `.link:hover` có **gạch chân** trở lại.",
      starter: { html: "<a class=\"link\" href=\"#\">Đọc thêm →</a>", css: "", js: "" },
      hint: ".link:hover { text-decoration: underline; }",
      solution: { html: "<a class=\"link\" href=\"#\">Đọc thêm →</a>", css: ".link {\n  color: #16a34a;\n  text-decoration: none;\n}\n.link:hover {\n  text-decoration: underline;\n}", js: "" },
      check: CSSR + String.raw`
        const a = T.$(".link");
        if (T.css(a, "text-decoration-line") !== "none") return {pass:false, msg:".link cần text-decoration: none."};
        if (T.css(a, "color") !== "rgb(22, 163, 74)") return {pass:false, msg:".link cần màu #16a34a."};
        const h = rule(".link:hover");
        if (!h || !/underline/.test(h.style.textDecoration + h.style.textDecorationLine)) return {pass:false, msg:"Cần quy tắc .link:hover có text-decoration: underline."};
        return {pass:true, msg:"Hiệu ứng hover giúp người dùng biết chỗ nào bấm được."};`
    },
    {
      title: "Nút có hiệu ứng mượt", level: 3,
      task: "Cho `.btn` có `transition` kéo dài **0.3s**. Viết `.btn:hover` thay đổi `background` (màu khác) để hiệu ứng chuyển màu mượt mà.",
      starter: { html: "<button class=\"btn\">Đăng ký</button>", css: ".btn {\n  background: #16a34a;\n  color: white;\n  border: 0;\n  padding: 10px 20px;\n  border-radius: 8px;\n}", js: "" },
      hint: "transition: background 0.3s; → mọi thay đổi background diễn ra trong 0.3 giây.",
      solution: { html: "<button class=\"btn\">Đăng ký</button>", css: ".btn {\n  background: #16a34a;\n  color: white;\n  border: 0;\n  padding: 10px 20px;\n  border-radius: 8px;\n  transition: background 0.3s;\n}\n.btn:hover {\n  background: #15803d;\n}", js: "" },
      check: CSSR + String.raw`
        const b = T.$(".btn");
        if (!T.css(b, "transition-duration").split(",").some(d => d.trim() === "0.3s")) return {pass:false, msg:".btn cần transition 0.3s."};
        const h = rule(".btn:hover");
        if (!h || !(h.style.background || h.style.backgroundColor)) return {pass:false, msg:"Cần .btn:hover đổi background."};
        return {pass:true, msg:"Mượt như app thật! transition là 'gia vị' của giao diện hiện đại."};`
    },
    {
      title: "Bảng sọc ngựa vằn – :nth-child", level: 4,
      task: "Với danh sách `.list li`:\n• Các mục **lẻ** (1, 3, 5…) có nền `#f0fdf4` bằng `:nth-child(odd)`.\n• Mọi mục có `letter-spacing: 1px` và `line-height: 1.5` (cỡ chữ đã đặt 20px).",
      starter: { html: "<ul class=\"list\">\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n  <li>Node.js</li>\n</ul>", css: ".list li { font-size: 20px; }\n", js: "" },
      hint: ".list li:nth-child(odd) { background: #f0fdf4; } — line-height 1.5 × 20px = 30px.",
      solution: { html: "<ul class=\"list\">\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n  <li>Node.js</li>\n</ul>", css: ".list li {\n  font-size: 20px;\n  letter-spacing: 1px;\n  line-height: 1.5;\n}\n.list li:nth-child(odd) {\n  background: #f0fdf4;\n}", js: "" },
      check: String.raw`
        const li = T.$$(".list li");
        const bg = el => T.css(el, "background-color");
        if (bg(li[0]) !== "rgb(240, 253, 244)" || bg(li[2]) !== "rgb(240, 253, 244)") return {pass:false, msg:"Mục 1 và 3 cần nền #f0fdf4."};
        if (bg(li[1]) === "rgb(240, 253, 244)" || bg(li[3]) === "rgb(240, 253, 244)") return {pass:false, msg:"Chỉ mục lẻ có nền – dùng :nth-child(odd)."};
        if (T.css(li[0], "letter-spacing") !== "1px") return {pass:false, msg:"Cần letter-spacing: 1px."};
        if (T.css(li[0], "line-height") !== "30px") return {pass:false, msg:"Cần line-height: 1.5 (= 30px với chữ 20px)."};
        return {pass:true, msg:"Pseudo-class :nth-child cực mạnh – dùng nhiều khi làm bảng dữ liệu."};`
    }
  ];

  P["css-animation"] = [
    {
      title: "Xoay 45 độ", level: 1,
      task: "Dùng `transform` xoay `.box` một góc **45deg**.",
      starter: { html: "<div class=\"box\"></div>", css: ".box { width: 80px; height: 80px; background: #22c55e; margin: 40px; }\n", js: "" },
      hint: "transform: rotate(45deg);",
      solution: { html: "<div class=\"box\"></div>", css: ".box {\n  width: 80px;\n  height: 80px;\n  background: #22c55e;\n  margin: 40px;\n  transform: rotate(45deg);\n}", js: "" },
      check: String.raw`
        const m = T.css(T.$(".box"), "transform").match(/matrix\(([^)]+)\)/);
        if (!m) return {pass:false, msg:"Chưa có transform xoay."};
        const [a, b] = m[1].split(",").map(Number);
        if (Math.abs(a - Math.SQRT1_2) > 0.01 || Math.abs(b - Math.SQRT1_2) > 0.01) return {pass:false, msg:"Góc xoay cần đúng 45deg."};
        return {pass:true, msg:"Hình vuông thành hình thoi rồi! 🔷"};`
    },
    {
      title: "Phóng to khi hover", level: 2,
      task: "Khi rê chuột vào `.card`, thẻ **phóng to** bằng `transform: scale(...)`. `.card` cần có `transition` để hiệu ứng mượt.",
      starter: { html: "<div class=\"card\">Rê chuột vào mình</div>", css: ".card { width: 180px; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 12px #0002; margin: 30px; }\n", js: "" },
      hint: ".card { transition: transform .3s; }\n.card:hover { transform: scale(1.1); }",
      solution: { html: "<div class=\"card\">Rê chuột vào mình</div>", css: ".card {\n  width: 180px;\n  padding: 20px;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px #0002;\n  margin: 30px;\n  transition: transform 0.3s;\n}\n.card:hover {\n  transform: scale(1.1);\n}", js: "" },
      check: CSSR + String.raw`
        const h = rule(".card:hover");
        if (!h || !/scale/.test(h.style.transform)) return {pass:false, msg:"Cần .card:hover có transform: scale(...)."};
        if (T.css(T.$(".card"), "transition-duration").split(",").every(d => parseFloat(d) === 0)) return {pass:false, msg:".card cần transition."};
        return {pass:true, msg:"Hiệu ứng 'nổi lên' này có ở gần như mọi trang thương mại điện tử."};`
    },
    {
      title: "Nhịp đập – @keyframes", level: 3,
      task: "Tạo `@keyframes pulse` có **ít nhất 3 mốc** (vd 0%, 50%, 100%) thay đổi `opacity`. Gán cho `.dot`: tên `pulse`, thời lượng **1s**, lặp vô hạn.",
      starter: { html: "<div class=\"dot\"></div>", css: ".dot { width: 40px; height: 40px; border-radius: 50%; background: #ef4444; margin: 30px; }\n", js: "" },
      hint: "@keyframes pulse { 0% { opacity: 1 } 50% { opacity: .2 } 100% { opacity: 1 } }\n.dot { animation: pulse 1s infinite; }",
      solution: { html: "<div class=\"dot\"></div>", css: ".dot {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: #ef4444;\n  margin: 30px;\n  animation: pulse 1s infinite;\n}\n@keyframes pulse {\n  0% { opacity: 1; }\n  50% { opacity: 0.2; }\n  100% { opacity: 1; }\n}", js: "" },
      check: CSSR + String.raw`
        const k = kf("pulse");
        if (!k) return {pass:false, msg:"Chưa có @keyframes pulse."};
        if (k.cssRules.length < 3) return {pass:false, msg:"@keyframes pulse cần ít nhất 3 mốc."};
        if (![...k.cssRules].some(r => r.style.opacity !== "")) return {pass:false, msg:"Các mốc cần thay đổi opacity."};
        const d = T.$(".dot");
        if (T.css(d, "animation-name") !== "pulse") return {pass:false, msg:".dot cần animation-name: pulse."};
        if (T.css(d, "animation-duration") !== "1s") return {pass:false, msg:"Thời lượng cần 1s."};
        if (T.css(d, "animation-iteration-count") !== "infinite") return {pass:false, msg:"Cần lặp infinite."};
        return {pass:true, msg:"Chấm đỏ 'đang ghi hình' của bạn đã nhấp nháy! 🔴"};`
    },
    {
      title: "Vòng xoay loading", level: 4,
      task: "Làm biểu tượng loading `.spinner`:\n• Hình tròn **40×40px** (`border-radius: 50%`), viền 4px; **viền trên** khác màu các viền còn lại.\n• `@keyframes spin` xoay tới `rotate(360deg)`.\n• Gán animation `spin` với tốc độ đều `linear` và lặp vô hạn.",
      starter: { html: "<div class=\"spinner\"></div>", css: "", js: "" },
      hint: "border: 4px solid #e5e7eb; border-top-color: #16a34a; animation: spin 1s linear infinite;\n@keyframes spin { to { transform: rotate(360deg); } }",
      solution: { html: "<div class=\"spinner\"></div>", css: ".spinner {\n  width: 40px;\n  height: 40px;\n  box-sizing: border-box;\n  border: 4px solid #e5e7eb;\n  border-top-color: #16a34a;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}", js: "" },
      check: CSSR + String.raw`
        const s = T.$(".spinner");
        if (s.offsetWidth !== 40 && T.css(s, "width") !== "40px") return {pass:false, msg:"Spinner cần kích thước 40×40px."};
        if (T.css(s, "border-top-left-radius") !== "50%") return {pass:false, msg:"Cần border-radius: 50%."};
        if (T.css(s, "border-top-width") !== "4px") return {pass:false, msg:"Cần viền 4px."};
        if (T.css(s, "border-top-color") === T.css(s, "border-right-color")) return {pass:false, msg:"Viền trên phải khác màu các viền còn lại."};
        const k = kf("spin");
        if (!k || ![...k.cssRules].some(r => /rotate\(360deg\)/.test(r.style.transform))) return {pass:false, msg:"Cần @keyframes spin xoay tới rotate(360deg)."};
        if (T.css(s, "animation-name") !== "spin" || T.css(s, "animation-iteration-count") !== "infinite") return {pass:false, msg:"Gán animation spin lặp infinite cho .spinner."};
        if (T.css(s, "animation-timing-function") !== "linear") return {pass:false, msg:"Dùng linear để xoay đều, không bị giật."};
        return {pass:true, msg:"Spinner chuẩn 'pro' – không cần ảnh GIF nào cả!"};`
    }
  ];

  /* ===================== BỐ CỤC ===================== */
  P["flexbox"] = [
    {
      title: "Căn giữa tuyệt đối", level: 1,
      task: "Dùng Flexbox căn `.item` vào **chính giữa** `.box` (cả ngang lẫn dọc). `.box` cao **200px**.",
      starter: { html: "<div class=\"box\">\n  <div class=\"item\">Giữa</div>\n</div>", css: ".box { background: #f0fdf4; }\n.item { background: #16a34a; color: white; padding: 10px; }\n", js: "" },
      hint: "display: flex; justify-content: center; align-items: center; height: 200px;",
      solution: { html: "<div class=\"box\">\n  <div class=\"item\">Giữa</div>\n</div>", css: ".box {\n  background: #f0fdf4;\n  height: 200px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.item { background: #16a34a; color: white; padding: 10px; }", js: "" },
      check: String.raw`
        const b = T.$(".box"), i = T.$(".item");
        if (T.css(b, "display") !== "flex") return {pass:false, msg:".box cần display: flex."};
        if (T.css(b, "height") !== "200px") return {pass:false, msg:".box cần height: 200px."};
        const rb = b.getBoundingClientRect(), ri = i.getBoundingClientRect();
        const dx = Math.abs((rb.left + rb.right) / 2 - (ri.left + ri.right) / 2), dy = Math.abs((rb.top + rb.bottom) / 2 - (ri.top + ri.bottom) / 2);
        if (dx > 2 || dy > 2) return {pass:false, msg:".item chưa nằm chính giữa (lệch " + Math.round(dx) + "px ngang, " + Math.round(dy) + "px dọc)."};
        return {pass:true, msg:"3 dòng CSS căn giữa mọi thứ – câu hỏi phỏng vấn kinh điển đấy!"};`
    },
    {
      title: "Xuống dòng & khoảng cách", level: 2,
      task: "Cho `.list` dùng Flexbox, cho phép các thẻ **tự xuống dòng** (`flex-wrap: wrap`) và cách nhau `gap: 12px`.",
      starter: { html: "<div class=\"list\">\n  <span class=\"tag\">HTML</span><span class=\"tag\">CSS</span><span class=\"tag\">JavaScript</span>\n  <span class=\"tag\">Flexbox</span><span class=\"tag\">Grid</span><span class=\"tag\">Responsive</span>\n</div>", css: ".list { width: 260px; }\n.tag { background: #dcfce7; padding: 6px 12px; border-radius: 99px; }\n", js: "" },
      hint: "display: flex; flex-wrap: wrap; gap: 12px;",
      solution: { html: "<div class=\"list\">\n  <span class=\"tag\">HTML</span><span class=\"tag\">CSS</span><span class=\"tag\">JavaScript</span>\n  <span class=\"tag\">Flexbox</span><span class=\"tag\">Grid</span><span class=\"tag\">Responsive</span>\n</div>", css: ".list {\n  width: 260px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.tag { background: #dcfce7; padding: 6px 12px; border-radius: 99px; }", js: "" },
      check: String.raw`
        const l = T.$(".list");
        if (T.css(l, "display") !== "flex") return {pass:false, msg:".list cần display: flex."};
        if (T.css(l, "flex-wrap") !== "wrap") return {pass:false, msg:"Cần flex-wrap: wrap."};
        if (T.css(l, "row-gap") !== "12px" || T.css(l, "column-gap") !== "12px") return {pass:false, msg:"Cần gap: 12px."};
        return {pass:true, msg:"Danh sách tag tự xuống dòng gọn gàng!"};`
    },
    {
      title: "Bố cục sidebar + nội dung", level: 3,
      task: "Trong `.layout` (Flexbox): `.sidebar` **cố định 200px**, `.content` **chiếm hết phần còn lại** bằng `flex: 1`.",
      starter: { html: "<div class=\"layout\">\n  <aside class=\"sidebar\">Menu</aside>\n  <main class=\"content\">Nội dung chính</main>\n</div>", css: ".layout { width: 700px; }\n.sidebar { background: #dcfce7; }\n.content { background: #fef9c3; }\n", js: "" },
      hint: ".layout { display: flex; } .sidebar { width: 200px; flex-shrink: 0; } .content { flex: 1; }",
      solution: { html: "<div class=\"layout\">\n  <aside class=\"sidebar\">Menu</aside>\n  <main class=\"content\">Nội dung chính</main>\n</div>", css: ".layout { width: 700px; display: flex; }\n.sidebar { background: #dcfce7; width: 200px; flex-shrink: 0; }\n.content { background: #fef9c3; flex: 1; }", js: "" },
      check: String.raw`
        const l = T.$(".layout"), s = T.$(".sidebar"), c = T.$(".content");
        if (T.css(l, "display") !== "flex") return {pass:false, msg:".layout cần display: flex."};
        if (Math.round(s.getBoundingClientRect().width) !== 200) return {pass:false, msg:".sidebar cần rộng đúng 200px."};
        if (T.css(c, "flex-grow") !== "1") return {pass:false, msg:".content cần flex: 1 (flex-grow: 1)."};
        if (Math.round(c.getBoundingClientRect().width) !== 500) return {pass:false, msg:".content phải chiếm phần còn lại (500px)."};
        return {pass:true, msg:"Đây là bố cục của hầu hết trang quản trị (dashboard)!"};`
    },
    {
      title: "Thanh menu: logo trái – menu phải", level: 4,
      task: "Làm thanh `.nav` bằng Flexbox: `.logo` sát **bên trái**, `.menu` (cũng là flex, các link cách nhau `gap: 16px`) đẩy sát **bên phải** bằng `margin-left: auto`. Mọi thứ căn giữa theo chiều dọc.",
      starter: { html: "<nav class=\"nav\">\n  <div class=\"logo\">🎓 FA</div>\n  <div class=\"menu\">\n    <a href=\"#\">Khoá học</a>\n    <a href=\"#\">Blog</a>\n    <a href=\"#\">Liên hệ</a>\n  </div>\n</nav>", css: ".nav { background: #14532d; color: white; padding: 12px 16px; height: 60px; box-sizing: border-box; }\n.nav a { color: white; }\n", js: "" },
      hint: ".nav { display: flex; align-items: center; } .menu { display: flex; gap: 16px; margin-left: auto; }",
      solution: { html: "<nav class=\"nav\">\n  <div class=\"logo\">🎓 FA</div>\n  <div class=\"menu\">\n    <a href=\"#\">Khoá học</a>\n    <a href=\"#\">Blog</a>\n    <a href=\"#\">Liên hệ</a>\n  </div>\n</nav>", css: ".nav { background: #14532d; color: white; padding: 12px 16px; height: 60px; box-sizing: border-box; display: flex; align-items: center; }\n.nav a { color: white; }\n.menu { display: flex; gap: 16px; margin-left: auto; }", js: "" },
      check: String.raw`
        const n = T.$(".nav"), m = T.$(".menu"), lg = T.$(".logo");
        if (T.css(n, "display") !== "flex" || T.css(m, "display") !== "flex") return {pass:false, msg:"Cả .nav và .menu đều cần display: flex."};
        if (T.css(m, "column-gap") !== "16px") return {pass:false, msg:".menu cần gap: 16px."};
        if (T.css(n, "align-items") !== "center") return {pass:false, msg:".nav cần align-items: center."};
        const rn = n.getBoundingClientRect(), rm = m.getBoundingClientRect(), rl = lg.getBoundingClientRect();
        if (Math.abs(rn.right - 16 - rm.right) > 2) return {pass:false, msg:".menu chưa sát bên phải – thử margin-left: auto."};
        if (Math.abs(rl.left - rn.left - 16) > 2) return {pass:false, msg:".logo phải nằm sát bên trái."};
        return {pass:true, msg:"Navbar chuẩn! margin-left: auto là 'phép thuật' đẩy phần tử trong Flexbox."};`
    }
  ];

  P["grid"] = [
    {
      title: "Lưới 2 cột", level: 1,
      task: "Biến `.grid` thành lưới **2 cột** bằng nhau (`1fr 1fr`).",
      starter: { html: "<div class=\"grid\">\n  <div>1</div><div>2</div><div>3</div><div>4</div>\n</div>", css: ".grid div { background: #dcfce7; padding: 20px; }\n", js: "" },
      hint: "display: grid; grid-template-columns: 1fr 1fr;",
      solution: { html: "<div class=\"grid\">\n  <div>1</div><div>2</div><div>3</div><div>4</div>\n</div>", css: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}\n.grid div { background: #dcfce7; padding: 20px; }", js: "" },
      check: String.raw`
        const g = T.$(".grid");
        if (T.css(g, "display") !== "grid") return {pass:false, msg:".grid cần display: grid."};
        const cols = T.css(g, "grid-template-columns").split(" ");
        if (cols.length !== 2 || Math.abs(parseFloat(cols[0]) - parseFloat(cols[1])) > 1) return {pass:false, msg:"Cần đúng 2 cột bằng nhau."};
        return {pass:true, msg:"fr = phần (fraction) của khoảng trống còn lại."};`
    },
    {
      title: "Lưới tự co giãn – auto-fit", level: 2,
      task: "Cho `.grid` dùng `repeat(auto-fit, minmax(150px, 1fr))` để **tự tính số cột** theo độ rộng màn hình, cách nhau `gap: 16px`.",
      starter: { html: "<div class=\"grid\">\n  <div>A</div><div>B</div><div>C</div><div>D</div><div>E</div><div>F</div>\n</div>", css: ".grid div { background: #fef9c3; padding: 20px; text-align: center; }\n", js: "" },
      hint: "grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); — mỗi cột tối thiểu 150px, dư thì giãn ra.",
      solution: { html: "<div class=\"grid\">\n  <div>A</div><div>B</div><div>C</div><div>D</div><div>E</div><div>F</div>\n</div>", css: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 16px;\n}\n.grid div { background: #fef9c3; padding: 20px; text-align: center; }", js: "" },
      check: CSSR + String.raw`
        const r = rule(".grid");
        if (!r || T.css(T.$(".grid"), "display") !== "grid") return {pass:false, msg:".grid cần display: grid."};
        const v = r.style.gridTemplateColumns.replace(/\s+/g, "");
        if (!/repeat\(auto-(fit|fill),minmax\(150px,1fr\)\)/.test(v)) return {pass:false, msg:"Cần grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))."};
        if (T.css(T.$(".grid"), "column-gap") !== "16px") return {pass:false, msg:"Cần gap: 16px."};
        return {pass:true, msg:"Responsive mà không cần media query – một dòng CSS 'thần thánh'!"};`
    },
    {
      title: "Ô nổi bật chiếm 2 cột", level: 3,
      task: "Lưới `.grid` có **3 cột** bằng nhau. Cho ô `.featured` **chiếm 2 cột** bằng `grid-column: span 2`.",
      starter: { html: "<div class=\"grid\">\n  <div class=\"featured\">⭐ Nổi bật</div>\n  <div>2</div><div>3</div><div>4</div><div>5</div>\n</div>", css: ".grid { gap: 10px; }\n.grid div { background: #dcfce7; padding: 20px; }\n.featured { background: #facc15 !important; }\n", js: "" },
      hint: ".grid { display: grid; grid-template-columns: repeat(3, 1fr); } .featured { grid-column: span 2; }",
      solution: { html: "<div class=\"grid\">\n  <div class=\"featured\">⭐ Nổi bật</div>\n  <div>2</div><div>3</div><div>4</div><div>5</div>\n</div>", css: ".grid { gap: 10px; display: grid; grid-template-columns: repeat(3, 1fr); }\n.grid div { background: #dcfce7; padding: 20px; }\n.featured { background: #facc15 !important; grid-column: span 2; }", js: "" },
      check: String.raw`
        const g = T.$(".grid");
        if (T.css(g, "display") !== "grid" || T.css(g, "grid-template-columns").split(" ").length !== 3) return {pass:false, msg:".grid cần là lưới 3 cột."};
        const f = T.$(".featured").getBoundingClientRect().width, o = g.children[1].getBoundingClientRect().width;
        if (Math.abs(f - (2 * o + 10)) > 2) return {pass:false, msg:".featured cần chiếm đúng 2 cột (grid-column: span 2)."};
        return {pass:true, msg:"Bố cục kiểu 'tạp chí' bắt đầu từ span như thế này!"};`
    },
    {
      title: "Bố cục trang với grid-template-areas", level: 4,
      task: "Dùng `grid-template-areas` cho `.page` (2 cột: `200px 1fr`):\n• Hàng 1: `header` chiếm **cả 2 cột**.\n• Hàng 2: `sidebar` | `main`.\n• Hàng 3: `footer` chiếm **cả 2 cột**.\nGán `grid-area` cho từng phần tử.",
      starter: { html: "<div class=\"page\">\n  <header>Header</header>\n  <aside>Sidebar</aside>\n  <main>Main</main>\n  <footer>Footer</footer>\n</div>", css: ".page > * { padding: 16px; background: #dcfce7; }\n.page { gap: 8px; }\n", js: "" },
      hint: "grid-template-areas: \"header header\" \"sidebar main\" \"footer footer\"; rồi header { grid-area: header; } …",
      solution: { html: "<div class=\"page\">\n  <header>Header</header>\n  <aside>Sidebar</aside>\n  <main>Main</main>\n  <footer>Footer</footer>\n</div>", css: ".page > * { padding: 16px; background: #dcfce7; }\n.page {\n  gap: 8px;\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas:\n    \"header header\"\n    \"sidebar main\"\n    \"footer footer\";\n}\nheader { grid-area: header; }\naside { grid-area: sidebar; }\nmain { grid-area: main; }\nfooter { grid-area: footer; }", js: "" },
      check: String.raw`
        const p = T.$(".page");
        if (T.css(p, "display") !== "grid") return {pass:false, msg:".page cần display: grid."};
        if (T.css(p, "grid-template-areas") === "none") return {pass:false, msg:"Cần khai báo grid-template-areas."};
        const r = s => T.$(s).getBoundingClientRect(), pr = p.getBoundingClientRect();
        const h = r("header"), a = r("aside"), m = r("main"), f = r("footer");
        if (Math.abs(h.width - pr.width) > 2 || Math.abs(f.width - pr.width) > 2) return {pass:false, msg:"header và footer phải chiếm cả 2 cột."};
        if (Math.round(a.width) !== 200) return {pass:false, msg:"sidebar cần rộng 200px (cột 1)."};
        if (!(a.top > h.bottom - 1 && Math.abs(a.top - m.top) < 2 && m.left > a.right - 1)) return {pass:false, msg:"Hàng 2 phải là sidebar bên trái, main bên phải."};
        if (!(f.top >= m.bottom - 1)) return {pass:false, msg:"footer phải ở hàng cuối."};
        return {pass:true, msg:"Bạn vừa 'vẽ' bố cục trang bằng chữ – sức mạnh thật sự của CSS Grid!"};`
    }
  ];

  P["responsive"] = [
    {
      title: "Ảnh co giãn", level: 1,
      task: "Làm cho mọi `img` **không bao giờ tràn** khỏi khung: `max-width: 100%` và `height: auto`.",
      starter: { html: "<div style=\"width:220px; border:2px dashed #16a34a\">\n  <img src=\"https://picsum.photos/600/300\" width=\"600\" height=\"300\" alt=\"Ảnh lớn\">\n</div>", css: "", js: "" },
      hint: "img { max-width: 100%; height: auto; }",
      solution: { html: "<div style=\"width:220px; border:2px dashed #16a34a\">\n  <img src=\"https://picsum.photos/600/300\" width=\"600\" height=\"300\" alt=\"Ảnh lớn\">\n</div>", css: "img {\n  max-width: 100%;\n  height: auto;\n}", js: "" },
      check: String.raw`
        const i = T.$("img");
        if (T.css(i, "max-width") !== "100%") return {pass:false, msg:"img cần max-width: 100%."};
        if (i.getBoundingClientRect().width > 221) return {pass:false, msg:"Ảnh vẫn đang tràn khung."};
        if (Math.abs(i.getBoundingClientRect().height - 110) > 2) return {pass:false, msg:"Thêm height: auto để ảnh giữ đúng tỉ lệ."};
        return {pass:true, msg:"Quy tắc CSS đầu tiên của mọi trang responsive!"};`
    },
    {
      title: "Media query min-width", level: 2,
      task: "Theo hướng **mobile-first**: mặc định `.container` rộng 100%. Viết `@media (min-width: 768px)` để `.container` có `max-width: 720px` và căn giữa (`margin: 0 auto`).",
      starter: { html: "<div class=\"container\">Nội dung trang</div>", css: ".container { width: 100%; background: #f0fdf4; }\n", js: "" },
      hint: "@media (min-width: 768px) { .container { max-width: 720px; margin: 0 auto; } }",
      solution: { html: "<div class=\"container\">Nội dung trang</div>", css: ".container { width: 100%; background: #f0fdf4; }\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 720px;\n    margin: 0 auto;\n  }\n}", js: "" },
      check: CSSR + String.raw`
        const r = rule(".container", "min-width: 768px");
        if (!r) return {pass:false, msg:"Cần quy tắc .container bên trong @media (min-width: 768px)."};
        if (r.style.maxWidth !== "720px") return {pass:false, msg:"Trong media query, .container cần max-width: 720px."};
        if (r.style.marginLeft !== "auto" || r.style.marginRight !== "auto") return {pass:false, msg:"Thêm margin: 0 auto để căn giữa."};
        return {pass:true, msg:"Mobile-first: viết cho màn nhỏ trước, rồi 'nâng cấp' cho màn lớn."};`
    },
    {
      title: "Lưới 1 → 2 → 3 cột", level: 3,
      task: "`.cards` là grid:\n• Mặc định **1 cột**.\n• Từ `min-width: 600px` → **2 cột**.\n• Từ `min-width: 900px` → **3 cột**.",
      starter: { html: "<div class=\"cards\">\n  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>\n</div>", css: ".cards { display: grid; gap: 12px; }\n.cards div { background: #dcfce7; padding: 24px; }\n", js: "" },
      hint: ".cards { grid-template-columns: 1fr; }\n@media (min-width: 600px) { .cards { grid-template-columns: repeat(2, 1fr); } }\n@media (min-width: 900px) { … repeat(3, 1fr) … }",
      solution: { html: "<div class=\"cards\">\n  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>\n</div>", css: ".cards { display: grid; gap: 12px; grid-template-columns: 1fr; }\n.cards div { background: #dcfce7; padding: 24px; }\n\n@media (min-width: 600px) {\n  .cards { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}", js: "" },
      check: CSSR + String.raw`
        const n = r => r ? (r.style.gridTemplateColumns.match(/repeat\((\d+)/) || [0, r.style.gridTemplateColumns.trim().split(/\s+/).length])[1] : 0;
        const base = rule(".cards"), m6 = rule(".cards", "600px"), m9 = rule(".cards", "900px");
        if (!base || +n(base) !== 1) return {pass:false, msg:"Mặc định .cards cần grid-template-columns 1 cột (1fr)."};
        if (!m6 || +n(m6) !== 2) return {pass:false, msg:"Trong @media (min-width: 600px) .cards cần 2 cột."};
        if (!m9 || +n(m9) !== 3) return {pass:false, msg:"Trong @media (min-width: 900px) .cards cần 3 cột."};
        return {pass:true, msg:"Kéo thử cửa sổ để thấy lưới tự đổi số cột!"};`
    },
    {
      title: "Chữ co giãn & ẩn sidebar trên mobile", level: 4,
      task: "• `h1` dùng `font-size: clamp(24px, 5vw, 48px)` – chữ tự co giãn theo màn hình.\n• `.hero` cao `50vh`.\n• Trong `@media (max-width: 600px)`: ẩn `.sidebar` (`display: none`) và `.layout` chuyển `flex-direction: column`.",
      starter: { html: "<section class=\"hero\"><h1>Front-end Academy</h1></section>\n<div class=\"layout\">\n  <aside class=\"sidebar\">Sidebar</aside>\n  <main>Nội dung</main>\n</div>", css: ".hero { background: #14532d; color: white; display: grid; place-items: center; }\n.layout { display: flex; gap: 12px; }\n", js: "" },
      hint: "clamp(min, ưu tiên, max). Đơn vị vh = % chiều cao màn hình.",
      solution: { html: "<section class=\"hero\"><h1>Front-end Academy</h1></section>\n<div class=\"layout\">\n  <aside class=\"sidebar\">Sidebar</aside>\n  <main>Nội dung</main>\n</div>", css: ".hero { background: #14532d; color: white; display: grid; place-items: center; height: 50vh; }\nh1 { font-size: clamp(24px, 5vw, 48px); }\n.layout { display: flex; gap: 12px; }\n\n@media (max-width: 600px) {\n  .sidebar { display: none; }\n  .layout { flex-direction: column; }\n}", js: "" },
      check: CSSR + String.raw`
        const h = rule("h1");
        if (!h || !/clamp\(\s*24px\s*,\s*5vw\s*,\s*48px\s*\)/.test(h.style.fontSize)) return {pass:false, msg:"h1 cần font-size: clamp(24px, 5vw, 48px)."};
        const hr = rule(".hero");
        if (!hr || hr.style.height !== "50vh") return {pass:false, msg:".hero cần height: 50vh."};
        const sb = rule(".sidebar", "max-width: 600px"), ly = rule(".layout", "max-width: 600px");
        if (!sb || sb.style.display !== "none") return {pass:false, msg:"Trong @media (max-width: 600px) cần .sidebar { display: none; }."};
        if (!ly || ly.style.flexDirection !== "column") return {pass:false, msg:"Trong @media (max-width: 600px) cần .layout { flex-direction: column; }."};
        return {pass:true, msg:"Giao diện của bạn giờ đã đẹp trên cả điện thoại lẫn màn hình lớn! 📱💻"};`
    }
  ];
})();
