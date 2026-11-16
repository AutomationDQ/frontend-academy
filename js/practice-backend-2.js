/* =========================================================
   BÀI LUYỆN TẬP THÊM – Khoá 3 (phần 2): SQL, Bảo mật, Triển khai
   ========================================================= */
window.PRACTICE = window.PRACTICE || {};
(function () {
  const P = window.PRACTICE;
  const J = js => ({ js });
  const SRV = String.raw`if (!T.server()) return {pass:false, msg:"Server chưa chạy – kiểm tra app.listen(3000) và lỗi ở Terminal."};`;
  const EQ = String.raw`const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);`;
  const DB_SP = "const Database = require(\"better-sqlite3\");\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT, price INTEGER, stock INTEGER);\n  INSERT INTO products (name, category, price, stock) VALUES\n    ('Bàn phím cơ', 'phu-kien', 890000, 5), ('Chuột không dây', 'phu-kien', 250000, 0),\n    ('Màn hình 24 inch', 'man-hinh', 3200000, 2), ('Tai nghe', 'am-thanh', 650000, 10),\n    ('Loa bluetooth', 'am-thanh', 1200000, 0), ('Màn hình 27 inch', 'man-hinh', 5400000, 1);\n`);\n";

  /* ===================== SQL ===================== */
  P["sql-basics"] = [
    {
      title: "Tạo bảng & thêm dữ liệu", level: 1,
      task: "1) Tạo bảng `todos` gồm `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `title` (TEXT NOT NULL), `done` (INTEGER, mặc định 0).\n2) Dùng **prepared statement** `INSERT ... VALUES (?, ?)` thêm 3 việc: *Học SQL* (done 1), *Học JOIN* (0), *Làm dự án* (0).\n3) In ra `console.table` toàn bộ bảng.",
      starter: J("const Database = require(\"better-sqlite3\");\nconst db = new Database(\":memory:\");\n\n"),
      hint: "db.exec(\"CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER DEFAULT 0)\");\nconst them = db.prepare(\"INSERT INTO todos (title, done) VALUES (?, ?)\"); them.run(\"Học SQL\", 1);",
      solution: J("const Database = require(\"better-sqlite3\");\nconst db = new Database(\":memory:\");\n\ndb.exec(\"CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER DEFAULT 0)\");\n\nconst them = db.prepare(\"INSERT INTO todos (title, done) VALUES (?, ?)\");\nthem.run(\"Học SQL\", 1);\nthem.run(\"Học JOIN\", 0);\nthem.run(\"Làm dự án\", 0);\n\nconsole.table(db.prepare(\"SELECT * FROM todos\").all());"),
      check: String.raw`
        const db = T.db();
        if (!db) return {pass:false, msg:"Chưa tạo database."};
        let rows; try { rows = db.prepare("SELECT * FROM todos ORDER BY id").all(); } catch (e) { return {pass:false, msg:"Chưa có bảng todos: " + e.message}; }
        if (rows.length !== 3) return {pass:false, msg:"Bảng todos cần đúng 3 dòng (đang " + rows.length + ")."};
        if (rows.map(r => r.title).join("|") !== "Học SQL|Học JOIN|Làm dự án" || rows.map(r => r.done).join() !== "1,0,0") return {pass:false, msg:"Dữ liệu chưa đúng title/done theo đề."};
        if (rows.map(r => r.id).join() !== "1,2,3") return {pass:false, msg:"id phải tự tăng 1, 2, 3."};
        const r = db.prepare("INSERT INTO todos (title) VALUES (?)").run("Kiểm tra mặc định");
        if (db.prepare("SELECT done FROM todos WHERE id = ?").get(r.lastInsertRowid).done !== 0) return {pass:false, msg:"Cột done cần DEFAULT 0."};
        if (!/VALUES\s*\(\s*\?\s*,\s*\?\s*\)/i.test(T.src)) return {pass:false, msg:"Hãy dùng prepared statement với dấu ?."};
        return {pass:true, msg:"Bảng đầu tiên của bạn! DEFAULT giúp không phải truyền mọi cột."};`
    },
    {
      title: "Lọc theo khoảng giá", level: 2,
      task: "Bảng `products` đã có 6 sản phẩm. Viết `sanPhamTrongKhoang(min, max)` trả về các sản phẩm có `price` **từ min đến max** (bao gồm 2 đầu), sắp xếp **giá tăng dần**, chỉ lấy cột `name, price`.",
      starter: J(DB_SP + "\nfunction sanPhamTrongKhoang(min, max) {\n  \n}\n\nconsole.table(sanPhamTrongKhoang(500000, 1500000));\n"),
      hint: "db.prepare(\"SELECT name, price FROM products WHERE price BETWEEN ? AND ? ORDER BY price ASC\").all(min, max)",
      solution: J(DB_SP + "\nfunction sanPhamTrongKhoang(min, max) {\n  return db.prepare(\"SELECT name, price FROM products WHERE price BETWEEN ? AND ? ORDER BY price ASC\").all(min, max);\n}\n\nconsole.table(sanPhamTrongKhoang(500000, 1500000));"),
      check: EQ + String.raw`
        if (typeof sanPhamTrongKhoang !== "function") return {pass:false, msg:"Chưa có hàm sanPhamTrongKhoang."};
        const r = sanPhamTrongKhoang(500000, 1500000);
        if (!eq(r, [{ name: "Tai nghe", price: 650000 }, { name: "Bàn phím cơ", price: 890000 }, { name: "Loa bluetooth", price: 1200000 }])) return {pass:false, msg:"Kết quả (500000–1500000) chưa đúng – chỉ lấy name, price, sắp giá tăng dần: " + JSON.stringify(r)};
        if (!eq(sanPhamTrongKhoang(250000, 250000), [{ name: "Chuột không dây", price: 250000 }])) return {pass:false, msg:"Phải bao gồm cả 2 đầu khoảng (>= và <=)."};
        if (!eq(sanPhamTrongKhoang(1, 2), [])) return {pass:false, msg:"Không có sản phẩm → []."};
        return {pass:true, msg:"WHERE + ORDER BY: 80% câu SQL bạn viết hằng ngày là như vậy."};`
    },
    {
      title: "Thống kê: COUNT, SUM, AVG, GROUP BY", level: 3,
      task: "Viết 2 hàm trên bảng `products`:\n• `thongKe()` → `{ soLuong, tongTonKho, giaCaoNhat }` (dùng `COUNT(*)`, `SUM(stock)`, `MAX(price)` với bí danh `AS`).\n• `demTheoLoai()` → mảng `{ category, so }` – số sản phẩm mỗi loại, sắp theo `category` A→Z (dùng `GROUP BY`).",
      starter: J(DB_SP + "\nfunction thongKe() {\n  \n}\n\nfunction demTheoLoai() {\n  \n}\n"),
      hint: "SELECT COUNT(*) AS soLuong, SUM(stock) AS tongTonKho, MAX(price) AS giaCaoNhat FROM products  → .get()\nSELECT category, COUNT(*) AS so FROM products GROUP BY category ORDER BY category → .all()",
      solution: J(DB_SP + "\nfunction thongKe() {\n  return db.prepare(\"SELECT COUNT(*) AS soLuong, SUM(stock) AS tongTonKho, MAX(price) AS giaCaoNhat FROM products\").get();\n}\n\nfunction demTheoLoai() {\n  return db.prepare(\"SELECT category, COUNT(*) AS so FROM products GROUP BY category ORDER BY category\").all();\n}\n\nconsole.log(thongKe());\nconsole.table(demTheoLoai());"),
      check: EQ + String.raw`
        if (typeof thongKe !== "function" || typeof demTheoLoai !== "function") return {pass:false, msg:"Cần 2 hàm thongKe và demTheoLoai."};
        const t = thongKe();
        if (!t || t.soLuong !== 6 || t.tongTonKho !== 18 || t.giaCaoNhat !== 5400000) return {pass:false, msg:"thongKe() phải là { soLuong: 6, tongTonKho: 18, giaCaoNhat: 5400000 } – đang: " + JSON.stringify(t)};
        const d = demTheoLoai();
        if (!eq(d, [{ category: "am-thanh", so: 2 }, { category: "man-hinh", so: 2 }, { category: "phu-kien", so: 2 }])) return {pass:false, msg:"demTheoLoai() chưa đúng: " + JSON.stringify(d)};
        if (!/GROUP BY/i.test(T.src)) return {pass:false, msg:"Hãy dùng GROUP BY để database tự đếm."};
        return {pass:true, msg:"Để database tính toán nhanh hơn nhiều so với kéo hết dữ liệu về JS rồi đếm."};`
    }
  ];

  P["sql-crud"] = [
    {
      title: "UPDATE & DELETE có điều kiện", level: 2,
      task: "Viết trên bảng `products`:\n• `doiGia(id, giaMoi)` – UPDATE giá, trả về **số dòng bị ảnh hưởng** (`changes`).\n• `xoaHetHang()` – DELETE mọi sản phẩm có `stock = 0`, trả về số dòng đã xoá.",
      starter: J(DB_SP + "\nfunction doiGia(id, giaMoi) {\n  \n}\n\nfunction xoaHetHang() {\n  \n}\n"),
      hint: "return db.prepare(\"UPDATE products SET price = ? WHERE id = ?\").run(giaMoi, id).changes;\n⚠️ Luôn có WHERE khi UPDATE/DELETE!",
      solution: J(DB_SP + "\nfunction doiGia(id, giaMoi) {\n  return db.prepare(\"UPDATE products SET price = ? WHERE id = ?\").run(giaMoi, id).changes;\n}\n\nfunction xoaHetHang() {\n  return db.prepare(\"DELETE FROM products WHERE stock = 0\").run().changes;\n}\n\nconsole.log(\"Đã đổi:\", doiGia(1, 799000));\nconsole.log(\"Đã xoá:\", xoaHetHang());"),
      check: String.raw`
        if (typeof doiGia !== "function" || typeof xoaHetHang !== "function") return {pass:false, msg:"Cần 2 hàm doiGia và xoaHetHang."};
        const db = T.db();
        db.exec("DELETE FROM products"); db.exec("INSERT INTO products (name, price, stock) VALUES ('A', 100, 0), ('B', 200, 3), ('C', 300, 0)");
        const ids = db.prepare("SELECT id FROM products ORDER BY id").all().map(r => r.id);
        if (doiGia(ids[1], 250) !== 1) return {pass:false, msg:"doiGia trên id tồn tại phải trả về 1."};
        if (db.prepare("SELECT price FROM products WHERE id = ?").get(ids[1]).price !== 250) return {pass:false, msg:"Giá chưa được cập nhật."};
        if (db.prepare("SELECT price FROM products WHERE id = ?").get(ids[0]).price !== 100) return {pass:false, msg:"Chỉ sản phẩm có id đó bị đổi giá (thiếu WHERE?)."};
        if (doiGia(99999, 1) !== 0) return {pass:false, msg:"id không tồn tại → 0 dòng."};
        if (xoaHetHang() !== 2) return {pass:false, msg:"Phải xoá đúng 2 sản phẩm hết hàng."};
        const con = db.prepare("SELECT name FROM products").all().map(r => r.name).join();
        if (con !== "B") return {pass:false, msg:"Sau khi xoá chỉ còn sản phẩm B (đang: " + con + ")."};
        return {pass:true, msg:"changes cho biết thao tác có thật sự tác động gì không – dùng để trả 404."};`
    },
    {
      title: "Phân trang với LIMIT/OFFSET", level: 3,
      task: "Viết `layTrang(trang, kichThuoc)` trả về `{ data, tong, soTrang }`:\n• `data`: sản phẩm của trang đó, sắp theo `id` (dùng `LIMIT ? OFFSET ?`).\n• `tong`: tổng số sản phẩm; `soTrang`: `Math.ceil(tong / kichThuoc)`.",
      starter: J(DB_SP + "\nfunction layTrang(trang, kichThuoc) {\n  \n}\n"),
      hint: "OFFSET = (trang - 1) * kichThuoc. Đếm: db.prepare(\"SELECT COUNT(*) AS n FROM products\").get().n",
      solution: J(DB_SP + "\nfunction layTrang(trang, kichThuoc) {\n  const data = db.prepare(\"SELECT * FROM products ORDER BY id LIMIT ? OFFSET ?\").all(kichThuoc, (trang - 1) * kichThuoc);\n  const tong = db.prepare(\"SELECT COUNT(*) AS n FROM products\").get().n;\n  return { data, tong, soTrang: Math.ceil(tong / kichThuoc) };\n}\n\nconsole.log(layTrang(2, 4));"),
      check: String.raw`
        if (typeof layTrang !== "function") return {pass:false, msg:"Chưa có hàm layTrang."};
        let r = layTrang(1, 4);
        if (!r || r.tong !== 6 || r.soTrang !== 2 || !Array.isArray(r.data) || r.data.map(x => x.id).join() !== "1,2,3,4") return {pass:false, msg:"layTrang(1, 4) → data id 1–4, tong 6, soTrang 2. Đang: " + JSON.stringify(r && { ids: (r.data || []).map(x => x.id), tong: r.tong, soTrang: r.soTrang })};
        r = layTrang(2, 4);
        if (r.data.map(x => x.id).join() !== "5,6") return {pass:false, msg:"layTrang(2, 4) → id 5, 6."};
        r = layTrang(3, 2);
        if (r.data.map(x => x.id).join() !== "5,6" || r.soTrang !== 3) return {pass:false, msg:"layTrang(3, 2) → id 5, 6, soTrang 3."};
        if (layTrang(9, 4).data.length !== 0) return {pass:false, msg:"Trang vượt quá → data rỗng."};
        if (!/LIMIT\s*\?\s*OFFSET\s*\?/i.test(T.src)) return {pass:false, msg:"Dùng LIMIT ? OFFSET ? (tham số hoá)."};
        return {pass:true, msg:"Không bao giờ trả hết 1 triệu dòng – luôn phân trang!"};`
    },
    {
      title: "Tìm kiếm động nhiều điều kiện", level: 4,
      task: "Viết `timKiem({ tuKhoa, loai, giaToiDa })` – **mọi tham số đều tuỳ chọn**:\n• `tuKhoa`: tên chứa từ khoá (`LIKE`).\n• `loai`: đúng `category`.\n• `giaToiDa`: `price <= giaToiDa`.\nGhép câu WHERE **động** bằng mảng điều kiện + mảng tham số (`?`) – không nối giá trị vào chuỗi SQL. Sắp theo `price` tăng dần, trả về mảng `name`.",
      starter: J(DB_SP + "\nfunction timKiem({ tuKhoa, loai, giaToiDa } = {}) {\n  const dieuKien = [], thamSo = [];\n  \n}\n"),
      hint: "if (tuKhoa) { dieuKien.push(\"name LIKE ?\"); thamSo.push(\"%\" + tuKhoa + \"%\"); } … const where = dieuKien.length ? \" WHERE \" + dieuKien.join(\" AND \") : \"\";",
      solution: J(DB_SP + "\nfunction timKiem({ tuKhoa, loai, giaToiDa } = {}) {\n  const dieuKien = [], thamSo = [];\n  if (tuKhoa) { dieuKien.push(\"name LIKE ?\"); thamSo.push(\"%\" + tuKhoa + \"%\"); }\n  if (loai) { dieuKien.push(\"category = ?\"); thamSo.push(loai); }\n  if (giaToiDa !== undefined) { dieuKien.push(\"price <= ?\"); thamSo.push(giaToiDa); }\n  const where = dieuKien.length ? \" WHERE \" + dieuKien.join(\" AND \") : \"\";\n  return db.prepare(\"SELECT name FROM products\" + where + \" ORDER BY price\").all(...thamSo).map(r => r.name);\n}\n\nconsole.log(timKiem({ tuKhoa: \"Màn hình\", giaToiDa: 4000000 }));"),
      check: EQ + String.raw`
        if (typeof timKiem !== "function") return {pass:false, msg:"Chưa có hàm timKiem."};
        const cases = [
          [{}, ["Chuột không dây", "Tai nghe", "Bàn phím cơ", "Loa bluetooth", "Màn hình 24 inch", "Màn hình 27 inch"]],
          [{ tuKhoa: "Màn hình" }, ["Màn hình 24 inch", "Màn hình 27 inch"]],
          [{ loai: "am-thanh" }, ["Tai nghe", "Loa bluetooth"]],
          [{ giaToiDa: 650000 }, ["Chuột không dây", "Tai nghe"]],
          [{ tuKhoa: "Màn hình", giaToiDa: 4000000 }, ["Màn hình 24 inch"]],
          [{ loai: "phu-kien", tuKhoa: "phím" }, ["Bàn phím cơ"]]
        ];
        for (const [q, kq] of cases) { const r = timKiem(q); if (!eq(r, kq)) return {pass:false, msg:"timKiem(" + JSON.stringify(q) + ") phải là " + JSON.stringify(kq) + " – đang " + JSON.stringify(r)}; }
        if (/(=|LIKE|<|>)\s*'?%?["'\x60]\s*\+\s*(tuKhoa|loai|giaToiDa)\b|\$\{\s*(tuKhoa|loai|giaToiDa)/i.test(T.src)) return {pass:false, msg:"Không nối giá trị người dùng vào chuỗi SQL – dùng dấu ? và mảng thamSo."};
        return {pass:true, msg:"Query builder (Knex, Prisma…) bên trong cũng làm đúng như vậy!"};`
    }
  ];

  const DB_LIB = "const Database = require(\"better-sqlite3\");\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);\n  CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));\n  INSERT INTO authors (name) VALUES ('Nguyễn Nhật Ánh'), ('Tô Hoài'), ('Nam Cao'), ('Xuân Quỳnh');\n  INSERT INTO books (title, author_id) VALUES ('Mắt biếc', 1), ('Kính vạn hoa', 1), ('Tôi thấy hoa vàng trên cỏ xanh', 1), ('Dế Mèn phiêu lưu ký', 2), ('Chí Phèo', 3);\n`);\n";
  const DB_SCHOOL = "const Database = require(\"better-sqlite3\");\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);\n  CREATE TABLE courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL);\n  CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER);\n  INSERT INTO students (name) VALUES ('An'), ('Bình'), ('Chi');\n  INSERT INTO courses (title) VALUES ('HTML'), ('CSS'), ('JavaScript'), ('Node.js');\n  INSERT INTO enrollments (student_id, course_id) VALUES (1, 1), (1, 3), (2, 1), (2, 2), (2, 4);\n`);\n";

  P["sql-relations"] = [
    {
      title: "LEFT JOIN – đếm cả tác giả chưa có sách", level: 2,
      task: "Viết `soSachMoiTacGia()` trả về mảng `{ name, soSach }` cho **mọi** tác giả – kể cả người chưa có sách (soSach = 0) – sắp theo `soSach` giảm dần rồi `name` A→Z.\nDùng `LEFT JOIN` + `GROUP BY` + `COUNT(books.id)`.",
      starter: J(DB_LIB + "\nfunction soSachMoiTacGia() {\n  \n}\n"),
      hint: "SELECT authors.name AS name, COUNT(books.id) AS soSach FROM authors LEFT JOIN books ON books.author_id = authors.id GROUP BY authors.id ORDER BY soSach DESC, name ASC\nINNER JOIN sẽ làm mất Xuân Quỳnh (chưa có sách)!",
      solution: J(DB_LIB + "\nfunction soSachMoiTacGia() {\n  return db.prepare(`\n    SELECT authors.name AS name, COUNT(books.id) AS soSach\n    FROM authors\n    LEFT JOIN books ON books.author_id = authors.id\n    GROUP BY authors.id\n    ORDER BY soSach DESC, name ASC\n  `).all();\n}\n\nconsole.table(soSachMoiTacGia());"),
      check: EQ + String.raw`
        if (typeof soSachMoiTacGia !== "function") return {pass:false, msg:"Chưa có hàm soSachMoiTacGia."};
        const r = soSachMoiTacGia();
        const want = [{ name: "Nguyễn Nhật Ánh", soSach: 3 }, { name: "Nam Cao", soSach: 1 }, { name: "Tô Hoài", soSach: 1 }, { name: "Xuân Quỳnh", soSach: 0 }];
        if (!eq(r, want)) return {pass:false, msg:"Kết quả chưa đúng: " + JSON.stringify(r) + (Array.isArray(r) && r.length === 3 ? " – thiếu tác giả chưa có sách, dùng LEFT JOIN." : "")};
        if (!/LEFT\s+JOIN/i.test(T.src)) return {pass:false, msg:"Hãy dùng LEFT JOIN."};
        return {pass:true, msg:"INNER JOIN = chỉ phần giao; LEFT JOIN = giữ mọi dòng bảng bên trái."};`
    },
    {
      title: "Quan hệ nhiều – nhiều", level: 3,
      task: "Học sinh – khoá học là quan hệ **nhiều–nhiều** qua bảng trung gian `enrollments`. Viết:\n• `khoaHocCua(studentId)` → mảng tên khoá (`title`) học sinh đó đăng ký, sắp A→Z.\n• `hocSinhCua(courseId)` → mảng tên học sinh của khoá đó, sắp A→Z.",
      starter: J(DB_SCHOOL + "\nfunction khoaHocCua(studentId) {\n  \n}\n\nfunction hocSinhCua(courseId) {\n  \n}\n"),
      hint: "SELECT c.title FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = ? ORDER BY c.title  → .all(id).map(r => r.title)",
      solution: J(DB_SCHOOL + "\nfunction khoaHocCua(studentId) {\n  return db.prepare(`\n    SELECT courses.title AS title FROM enrollments\n    JOIN courses ON courses.id = enrollments.course_id\n    WHERE enrollments.student_id = ?\n    ORDER BY courses.title\n  `).all(studentId).map(r => r.title);\n}\n\nfunction hocSinhCua(courseId) {\n  return db.prepare(`\n    SELECT students.name AS name FROM enrollments\n    JOIN students ON students.id = enrollments.student_id\n    WHERE enrollments.course_id = ?\n    ORDER BY students.name\n  `).all(courseId).map(r => r.name);\n}\n\nconsole.log(khoaHocCua(2), hocSinhCua(1));"),
      check: EQ + String.raw`
        if (typeof khoaHocCua !== "function" || typeof hocSinhCua !== "function") return {pass:false, msg:"Cần 2 hàm khoaHocCua và hocSinhCua."};
        const cases = [[khoaHocCua, 1, ["HTML", "JavaScript"]], [khoaHocCua, 2, ["CSS", "HTML", "Node.js"]], [khoaHocCua, 3, []], [hocSinhCua, 1, ["An", "Bình"]], [hocSinhCua, 4, ["Bình"]], [hocSinhCua, 3, ["An"]]];
        for (const [f, id, kq] of cases) { const r = f(id); if (!eq(r, kq)) return {pass:false, msg:f.name + "(" + id + ") phải là " + JSON.stringify(kq) + " – đang " + JSON.stringify(r)}; }
        return {pass:true, msg:"Bảng trung gian là chìa khoá của quan hệ nhiều–nhiều (tags, vai trò, đơn hàng–sản phẩm…)."};`
    },
    {
      title: "Đăng ký khoá học không trùng", level: 3,
      task: "Viết `dangKy(studentId, courseId)`:\n• Học sinh hoặc khoá học **không tồn tại** → trả về `\"khong-ton-tai\"`.\n• **Đã đăng ký** rồi → `\"da-dang-ky\"`.\n• Ngược lại INSERT vào `enrollments` và trả về `\"ok\"`.",
      starter: J(DB_SCHOOL + "\nfunction dangKy(studentId, courseId) {\n  \n}\n"),
      hint: "db.prepare(\"SELECT id FROM students WHERE id = ?\").get(studentId) trả undefined nếu không có. Kiểm tra trùng: SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?",
      solution: J(DB_SCHOOL + "\nfunction dangKy(studentId, courseId) {\n  const hs = db.prepare(\"SELECT id FROM students WHERE id = ?\").get(studentId);\n  const kh = db.prepare(\"SELECT id FROM courses WHERE id = ?\").get(courseId);\n  if (!hs || !kh) return \"khong-ton-tai\";\n  const daCo = db.prepare(\"SELECT student_id FROM enrollments WHERE student_id = ? AND course_id = ?\").get(studentId, courseId);\n  if (daCo) return \"da-dang-ky\";\n  db.prepare(\"INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)\").run(studentId, courseId);\n  return \"ok\";\n}\n\nconsole.log(dangKy(3, 2));"),
      check: String.raw`
        if (typeof dangKy !== "function") return {pass:false, msg:"Chưa có hàm dangKy."};
        const db = T.db();
        const dem = () => db.prepare("SELECT COUNT(*) AS n FROM enrollments").get().n;
        const n0 = dem();
        if (dangKy(1, 1) !== "da-dang-ky" || dem() !== n0) return {pass:false, msg:"An (1) đã học HTML (1) → 'da-dang-ky' và không thêm dòng."};
        if (dangKy(9, 1) !== "khong-ton-tai" || dangKy(1, 99) !== "khong-ton-tai") return {pass:false, msg:"Học sinh/khoá học không tồn tại → 'khong-ton-tai'."};
        if (dem() !== n0) return {pass:false, msg:"Không được thêm dòng khi dữ liệu không hợp lệ."};
        const kqMoi = dangKy(1, 4);
        if (kqMoi !== "ok" && !(kqMoi === "da-dang-ky" && n0 === 6)) return {pass:false, msg:"An đăng ký Node.js (4) → 'ok'."};
        if (!db.prepare("SELECT * FROM enrollments WHERE student_id = 1 AND course_id = 4").get()) return {pass:false, msg:"Chưa thêm dòng vào enrollments."};
        if (dangKy(1, 4) !== "da-dang-ky") return {pass:false, msg:"Đăng ký lần 2 → 'da-dang-ky'."};
        return {pass:true, msg:"Kiểm tra trước khi ghi giúp dữ liệu luôn sạch. (Database thật còn có UNIQUE(student_id, course_id)!)"};`
    }
  ];

  const API_DB = "const express = require(\"express\");\nconst Database = require(\"better-sqlite3\");\nconst app = express();\napp.use(express.json());\n\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL);\n  INSERT INTO products (name, price) VALUES ('Bàn phím', 890000), ('Chuột', 250000), ('Màn hình', 3200000);\n`);\n";

  P["api-database"] = [
    {
      title: "API đọc dữ liệu từ SQLite", level: 2,
      requests: [{ method: "GET", url: "/api/products" }, { method: "GET", url: "/api/products?maxPrice=1000000" }, { method: "GET", url: "/api/products/3" }, { method: "GET", url: "/api/products/99" }],
      task: "• `GET /api/products` → mảng sản phẩm sắp theo `id`; hỗ trợ `?maxPrice=` (giá ≤ maxPrice).\n• `GET /api/products/:id` → 200 | **404** `{ error: \"Không tìm thấy\" }`.\nMọi truy vấn dùng prepared statement.",
      starter: J(API_DB + "\n\napp.listen(3000);\n"),
      hint: "const max = req.query.maxPrice; const rows = max ? db.prepare(\"SELECT * FROM products WHERE price <= ? ORDER BY id\").all(Number(max)) : db.prepare(\"SELECT * FROM products ORDER BY id\").all();",
      solution: J(API_DB + "\napp.get(\"/api/products\", (req, res) => {\n  const max = req.query.maxPrice;\n  const rows = max !== undefined\n    ? db.prepare(\"SELECT * FROM products WHERE price <= ? ORDER BY id\").all(Number(max))\n    : db.prepare(\"SELECT * FROM products ORDER BY id\").all();\n  res.json(rows);\n});\n\napp.get(\"/api/products/:id\", (req, res) => {\n  const p = db.prepare(\"SELECT * FROM products WHERE id = ?\").get(Number(req.params.id));\n  if (!p) return res.status(404).json({ error: \"Không tìm thấy\" });\n  res.json(p);\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("GET", "/api/products");
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.map(p => p.id).join() !== "1,2,3") return {pass:false, msg:"GET /api/products → 3 sản phẩm id 1, 2, 3."};
        r = await T.request("GET", "/api/products?maxPrice=1000000");
        if (!Array.isArray(r.body) || r.body.map(p => p.name).join() !== "Bàn phím,Chuột") return {pass:false, msg:"?maxPrice=1000000 → Bàn phím, Chuột."};
        T.db().prepare("INSERT INTO products (name, price) VALUES (?, ?)").run("Webcam", 500000);
        r = await T.request("GET", "/api/products?maxPrice=500000");
        if (r.body.map(p => p.name).join() !== "Chuột,Webcam") return {pass:false, msg:"API phải đọc trực tiếp từ database (thêm Webcam vào DB thì API thấy ngay)."};
        r = await T.request("GET", "/api/products/3");
        if (r.status !== 200 || !r.body || r.body.name !== "Màn hình") return {pass:false, msg:"GET /api/products/3 → Màn hình."};
        r = await T.request("GET", "/api/products/99");
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy") return {pass:false, msg:"Không có → 404 { error: 'Không tìm thấy' }."};
        return {pass:true, msg:"Dữ liệu giờ sống trong database, không mất khi đổi route nữa."};`
    },
    {
      title: "Thêm & xoá bằng SQL", level: 3,
      requests: [{ method: "POST", url: "/api/products", body: { name: "Webcam", price: 500000 } }, { method: "POST", url: "/api/products", body: { name: "", price: -1 }, label: "/api/products (sai)" }, { method: "DELETE", url: "/api/products/1" }, { method: "DELETE", url: "/api/products/99" }],
      task: "• `POST /api/products` `{ name, price }`: name rỗng hoặc price không phải số nguyên dương → **400**; hợp lệ → **201** sản phẩm vừa tạo (đọc lại từ DB bằng `lastInsertRowid`).\n• `DELETE /api/products/:id` → **204**; không có → **404** (dựa vào `changes`).",
      starter: J(API_DB + "\n\napp.listen(3000);\n"),
      hint: "const info = db.prepare(\"INSERT INTO products (name, price) VALUES (?, ?)\").run(name, price); const p = db.prepare(\"SELECT * FROM products WHERE id = ?\").get(info.lastInsertRowid);",
      solution: J(API_DB + "\napp.post(\"/api/products\", (req, res) => {\n  const name = String(req.body.name || \"\").trim();\n  const { price } = req.body;\n  if (!name || !Number.isInteger(price) || price <= 0) return res.status(400).json({ error: \"Dữ liệu không hợp lệ\" });\n  const info = db.prepare(\"INSERT INTO products (name, price) VALUES (?, ?)\").run(name, price);\n  res.status(201).json(db.prepare(\"SELECT * FROM products WHERE id = ?\").get(info.lastInsertRowid));\n});\n\napp.delete(\"/api/products/:id\", (req, res) => {\n  const info = db.prepare(\"DELETE FROM products WHERE id = ?\").run(Number(req.params.id));\n  if (info.changes === 0) return res.status(404).json({ error: \"Không tìm thấy\" });\n  res.sendStatus(204);\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const db = T.db();
        let r = await T.request("POST", "/api/products", { body: { name: "Webcam", price: 500000 } });
        if (r.status !== 201 || !r.body || r.body.id !== 4 || r.body.name !== "Webcam" || r.body.price !== 500000) return {pass:false, msg:"POST hợp lệ → 201 { id: 4, name: 'Webcam', price: 500000 } (đang " + r.status + " " + r.text + ")."};
        if (!db.prepare("SELECT * FROM products WHERE id = 4").get()) return {pass:false, msg:"Sản phẩm chưa được lưu vào database."};
        for (const b of [{ name: "", price: 100 }, { name: "A", price: -1 }, { name: "A", price: "100" }, { name: "A", price: 1.5 }, {}]) {
          r = await T.request("POST", "/api/products", { body: b });
          if (r.status !== 400) return {pass:false, msg:"Body " + JSON.stringify(b) + " phải trả 400."};
        }
        if (db.prepare("SELECT COUNT(*) AS n FROM products").get().n !== 4) return {pass:false, msg:"Request lỗi không được ghi vào DB."};
        r = await T.request("DELETE", "/api/products/1");
        if (r.status !== 204) return {pass:false, msg:"DELETE thành công → 204."};
        if (db.prepare("SELECT * FROM products WHERE id = 1").get()) return {pass:false, msg:"Sản phẩm 1 vẫn còn trong DB."};
        r = await T.request("DELETE", "/api/products/1");
        if (r.status !== 404) return {pass:false, msg:"Xoá lần 2 (đã không còn) → 404."};
        return {pass:true, msg:"lastInsertRowid và changes – hai giá trị bạn sẽ dùng mãi với SQL."};`
    },
    {
      title: "PATCH động với danh sách trắng", level: 4,
      requests: [{ method: "PATCH", url: "/api/products/2", body: { price: 199000 } }, { method: "PATCH", url: "/api/products/2", body: { name: "Chuột gaming", price: 450000 } }, { method: "PATCH", url: "/api/products/2", body: { id: 99, hack: "x" }, label: "/api/products/2 (trường lạ)" }],
      task: "`PATCH /api/products/:id` chỉ cập nhật các trường **được phép** (`name`, `price`) có trong body:\n• Ghép `SET` động: `UPDATE products SET name = ?, price = ? WHERE id = ?` – **tên cột chỉ lấy từ danh sách trắng**, giá trị luôn qua `?`.\n• Không có trường hợp lệ nào → **400** `{ error: \"Không có trường nào để cập nhật\" }`.\n• id không tồn tại → **404**. Thành công → 200 sản phẩm sau cập nhật.",
      starter: J(API_DB + "\nconst DUOC_SUA = [\"name\", \"price\"];\n\n\napp.listen(3000);\n"),
      hint: "const truong = DUOC_SUA.filter(k => req.body[k] !== undefined); const set = truong.map(k => k + \" = ?\").join(\", \"); db.prepare(`UPDATE products SET ${set} WHERE id = ?`).run(...truong.map(k => req.body[k]), id);",
      solution: J(API_DB + "\nconst DUOC_SUA = [\"name\", \"price\"];\n\napp.patch(\"/api/products/:id\", (req, res) => {\n  const id = Number(req.params.id);\n  const truong = DUOC_SUA.filter(k => req.body[k] !== undefined);\n  if (!truong.length) return res.status(400).json({ error: \"Không có trường nào để cập nhật\" });\n  const set = truong.map(k => k + \" = ?\").join(\", \");\n  const info = db.prepare(\"UPDATE products SET \" + set + \" WHERE id = ?\").run(...truong.map(k => req.body[k]), id);\n  if (info.changes === 0) return res.status(404).json({ error: \"Không tìm thấy\" });\n  res.json(db.prepare(\"SELECT * FROM products WHERE id = ?\").get(id));\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("PATCH", "/api/products/2", { body: { price: 199000 } });
        if (r.status !== 200 || !r.body || r.body.price !== 199000 || r.body.name !== "Chuột") return {pass:false, msg:"PATCH { price } → chỉ đổi giá, giữ name 'Chuột' (đang " + r.status + " " + r.text + ")."};
        r = await T.request("PATCH", "/api/products/2", { body: { name: "Chuột gaming", price: 450000 } });
        if (!r.body || r.body.name !== "Chuột gaming" || r.body.price !== 450000) return {pass:false, msg:"PATCH cả name và price phải đổi cả hai."};
        r = await T.request("PATCH", "/api/products/2", { body: { id: 99, hack: "DROP TABLE" } });
        if (r.status !== 400 || !r.body || r.body.error !== "Không có trường nào để cập nhật") return {pass:false, msg:"Body chỉ có trường lạ → 400 { error: 'Không có trường nào để cập nhật' }."};
        if (!T.db().prepare("SELECT * FROM products WHERE id = 2").get()) return {pass:false, msg:"Không được để client đổi id!"};
        r = await T.request("PATCH", "/api/products/2", { body: { "price = 0, name": "x" } });
        if (r.status !== 400) return {pass:false, msg:"Tên trường lạ (kể cả chứa SQL) phải bị loại – chỉ nhận cột trong DUOC_SUA."};
        r = await T.request("PATCH", "/api/products/99", { body: { price: 1 } });
        if (r.status !== 404) return {pass:false, msg:"id không tồn tại → 404."};
        return {pass:true, msg:"Danh sách trắng (whitelist) chặn cả mass-assignment lẫn SQL injection qua tên cột."};`
    }
  ];

  /* ===================== BẢO MẬT & XÁC THỰC ===================== */
  P["password-hashing"] = [
    {
      title: "Băm & kiểm tra mật khẩu", level: 1,
      task: "Viết 2 hàm **async** dùng `bcryptjs` và xuất bằng `module.exports = { bamMatKhau, kiemTraMatKhau }`:\n• `bamMatKhau(mk)` → chuỗi hash (cost **10**).\n• `kiemTraMatKhau(mk, hash)` → `true`/`false`.",
      starter: J("const bcrypt = require(\"bcryptjs\");\n\nasync function bamMatKhau(mk) {\n  \n}\n\nasync function kiemTraMatKhau(mk, hash) {\n  \n}\n\nmodule.exports = { bamMatKhau, kiemTraMatKhau };\n"),
      hint: "return bcrypt.hash(mk, 10);  /  return bcrypt.compare(mk, hash);",
      solution: J("const bcrypt = require(\"bcryptjs\");\n\nasync function bamMatKhau(mk) {\n  return bcrypt.hash(mk, 10);\n}\n\nasync function kiemTraMatKhau(mk, hash) {\n  return bcrypt.compare(mk, hash);\n}\n\nmodule.exports = { bamMatKhau, kiemTraMatKhau };\n\nbamMatKhau(\"matkhau123\").then(h => console.log(\"Hash:\", h));"),
      check: String.raw`
        const m = T.exports();
        if (!m || typeof m.bamMatKhau !== "function" || typeof m.kiemTraMatKhau !== "function") return {pass:false, msg:"Cần module.exports = { bamMatKhau, kiemTraMatKhau }."};
        const h1 = await m.bamMatKhau("matkhau123"), h2 = await m.bamMatKhau("matkhau123");
        if (typeof h1 !== "string" || !/^\$2[aby]\$10\$/.test(h1)) return {pass:false, msg:"Hash phải là chuỗi bcrypt với cost 10 (bắt đầu bằng $2a$10$ hoặc $2b$10$)."};
        if (h1 === h2) return {pass:false, msg:"Mỗi lần băm phải ra hash khác nhau (do salt ngẫu nhiên)."};
        if (await m.kiemTraMatKhau("matkhau123", h1) !== true) return {pass:false, msg:"Mật khẩu đúng → true."};
        if (await m.kiemTraMatKhau("MatKhau123", h1) !== false) return {pass:false, msg:"Mật khẩu sai → false."};
        return {pass:true, msg:"Cùng mật khẩu nhưng hash khác nhau – đó là sức mạnh của salt."};`
    },
    {
      title: "Không bao giờ lộ hash", level: 2,
      requests: [{ method: "POST", url: "/api/register", body: { email: "quang@gmail.com", password: "abc12345" } }, { method: "GET", url: "/api/users" }],
      task: "• `POST /api/register` `{ email, password }` → băm mật khẩu, lưu `{ id, email, passwordHash }`, trả **201** `{ id, email }`.\n• `GET /api/users` → danh sách `{ id, email }`.\n⚠️ Không response nào được chứa `password` hay `passwordHash`.",
      starter: J("const express = require(\"express\");\nconst bcrypt = require(\"bcryptjs\");\nconst app = express();\napp.use(express.json());\n\nconst users = [];\n\n\napp.listen(3000);\n"),
      hint: "Viết hàm anToan = ({ id, email }) => ({ id, email }); và luôn trả về users.map(anToan).",
      solution: J("const express = require(\"express\");\nconst bcrypt = require(\"bcryptjs\");\nconst app = express();\napp.use(express.json());\n\nconst users = [];\nconst anToan = ({ id, email }) => ({ id, email });\n\napp.post(\"/api/register\", async (req, res) => {\n  const { email, password } = req.body;\n  const user = { id: users.length + 1, email, passwordHash: await bcrypt.hash(password, 10) };\n  users.push(user);\n  res.status(201).json(anToan(user));\n});\n\napp.get(\"/api/users\", (req, res) => res.json(users.map(anToan)));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        let r = await T.request("POST", "/api/register", { body: { email: "quang@gmail.com", password: "abc12345" } });
        if (r.status !== 201 || !r.body || r.body.email !== "quang@gmail.com" || typeof r.body.id !== "number") return {pass:false, msg:"Đăng ký → 201 { id, email }."};
        if (/abc12345|passwordHash|"password"|\$2[aby]\$/.test(r.text)) return {pass:false, msg:"Response đăng ký đang lộ mật khẩu/hash!"};
        await T.request("POST", "/api/register", { body: { email: "an@gmail.com", password: "xyz98765" } });
        r = await T.request("GET", "/api/users");
        if (!Array.isArray(r.body) || r.body.length !== 2) return {pass:false, msg:"GET /api/users → 2 user."};
        if (/passwordHash|password|\$2[aby]\$/.test(r.text)) return {pass:false, msg:"GET /api/users đang lộ hash!"};
        if (!/bcrypt\.hash/.test(T.src)) return {pass:false, msg:"Phải băm mật khẩu bằng bcrypt.hash trước khi lưu."};
        return {pass:true, msg:"Hash bị lộ vẫn có thể bị dò (brute-force) – đừng bao giờ gửi nó ra ngoài."};`
    },
    {
      title: "Đổi mật khẩu", level: 3,
      requests: [{ method: "POST", url: "/api/change-password", body: { email: "quang@gmail.com", oldPassword: "123456", newPassword: "moi-an-toan" } }, { method: "POST", url: "/api/login", body: { email: "quang@gmail.com", password: "moi-an-toan" } }],
      task: "User `quang@gmail.com` (mật khẩu `123456`) đã có sẵn. Viết:\n• `POST /api/login` `{ email, password }` → 200 `{ ok: true }` | **401** `{ error: \"Sai email hoặc mật khẩu\" }`.\n• `POST /api/change-password` `{ email, oldPassword, newPassword }`: sai mật khẩu cũ → **401**; mật khẩu mới < 6 ký tự → **400**; thành công → 200 `{ ok: true }` và **lưu hash mới**.",
      starter: J("const express = require(\"express\");\nconst bcrypt = require(\"bcryptjs\");\nconst app = express();\napp.use(express.json());\n\nconst users = [{ id: 1, email: \"quang@gmail.com\", passwordHash: bcrypt.hashSync(\"123456\", 8) }];\n\n\napp.listen(3000);\n"),
      hint: "Viết async function xacThuc(email, password) trả về user nếu đúng, null nếu sai – dùng chung cho cả 2 route.",
      solution: J("const express = require(\"express\");\nconst bcrypt = require(\"bcryptjs\");\nconst app = express();\napp.use(express.json());\n\nconst users = [{ id: 1, email: \"quang@gmail.com\", passwordHash: bcrypt.hashSync(\"123456\", 8) }];\n\nasync function xacThuc(email, password) {\n  const user = users.find(u => u.email === email);\n  if (!user || !(await bcrypt.compare(String(password || \"\"), user.passwordHash))) return null;\n  return user;\n}\n\napp.post(\"/api/login\", async (req, res) => {\n  const user = await xacThuc(req.body.email, req.body.password);\n  if (!user) return res.status(401).json({ error: \"Sai email hoặc mật khẩu\" });\n  res.json({ ok: true });\n});\n\napp.post(\"/api/change-password\", async (req, res) => {\n  const { email, oldPassword, newPassword } = req.body;\n  const user = await xacThuc(email, oldPassword);\n  if (!user) return res.status(401).json({ error: \"Sai email hoặc mật khẩu\" });\n  if (typeof newPassword !== \"string\" || newPassword.length < 6) return res.status(400).json({ error: \"Mật khẩu mới phải có ít nhất 6 ký tự\" });\n  user.passwordHash = await bcrypt.hash(newPassword, 8);\n  res.json({ ok: true });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const login = pw => T.request("POST", "/api/login", { body: { email: "quang@gmail.com", password: pw } });
        let r = await login("123456");
        if (r.status !== 200 || !r.body || r.body.ok !== true) return {pass:false, msg:"Đăng nhập đúng → 200 { ok: true }."};
        r = await login("sai");
        if (r.status !== 401 || !r.body || r.body.error !== "Sai email hoặc mật khẩu") return {pass:false, msg:"Sai mật khẩu → 401 { error: 'Sai email hoặc mật khẩu' }."};
        const doi = b => T.request("POST", "/api/change-password", { body: Object.assign({ email: "quang@gmail.com" }, b) });
        r = await doi({ oldPassword: "sai-roi", newPassword: "moi-an-toan" });
        if (r.status !== 401) return {pass:false, msg:"Sai mật khẩu cũ → 401."};
        r = await doi({ oldPassword: "123456", newPassword: "123" });
        if (r.status !== 400) return {pass:false, msg:"Mật khẩu mới < 6 ký tự → 400."};
        r = await doi({ oldPassword: "123456", newPassword: "moi-an-toan" });
        if (r.status !== 200 || !r.body || r.body.ok !== true) return {pass:false, msg:"Đổi mật khẩu hợp lệ → 200 { ok: true }."};
        if ((await login("moi-an-toan")).status !== 200) return {pass:false, msg:"Sau khi đổi, mật khẩu mới phải đăng nhập được."};
        if ((await login("123456")).status !== 401) return {pass:false, msg:"Sau khi đổi, mật khẩu cũ phải bị từ chối."};
        return {pass:true, msg:"Luôn yêu cầu mật khẩu cũ khi đổi – chặn kẻ chiếm được phiên đăng nhập."};`
    }
  ];

  const JWT_ENV = { JWT_SECRET: "bi-mat-luyen-tap-jwt" };
  P["jwt-auth"] = [
    {
      title: "Tạo & đọc token", level: 2, env: JWT_ENV,
      task: "Xuất `module.exports = { taoToken, docToken }`:\n• `taoToken(user)` ký payload `{ id, email }` (chỉ 2 trường này) bằng `process.env.JWT_SECRET`, hết hạn sau `\"1h\"`.\n• `docToken(token)` → payload nếu hợp lệ, `null` nếu sai chữ ký/hết hạn/hỏng (không được throw).",
      starter: J("const jwt = require(\"jsonwebtoken\");\n\nfunction taoToken(user) {\n  \n}\n\nfunction docToken(token) {\n  \n}\n\nmodule.exports = { taoToken, docToken };\n"),
      hint: "jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: \"1h\" });\ntry { return jwt.verify(token, process.env.JWT_SECRET); } catch (e) { return null; }",
      solution: J("const jwt = require(\"jsonwebtoken\");\n\nfunction taoToken(user) {\n  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: \"1h\" });\n}\n\nfunction docToken(token) {\n  try {\n    return jwt.verify(token, process.env.JWT_SECRET);\n  } catch (e) {\n    return null;\n  }\n}\n\nmodule.exports = { taoToken, docToken };"),
      check: String.raw`
        const m = T.exports(), jwt = require("jsonwebtoken");
        if (!m || typeof m.taoToken !== "function" || typeof m.docToken !== "function") return {pass:false, msg:"Cần module.exports = { taoToken, docToken }."};
        if (/bi-mat-luyen-tap-jwt/.test(T.src)) return {pass:false, msg:"Không gõ cứng secret – dùng process.env.JWT_SECRET."};
        const t = m.taoToken({ id: 7, email: "a@b.com", passwordHash: "$2a$10$xyz", role: "user" });
        let p; try { p = jwt.verify(t, "bi-mat-luyen-tap-jwt"); } catch (e) { return {pass:false, msg:"Token phải được ký bằng process.env.JWT_SECRET."}; }
        if (p.id !== 7 || p.email !== "a@b.com") return {pass:false, msg:"Payload cần id và email."};
        if ("passwordHash" in p || "role" in p) return {pass:false, msg:"Chỉ đưa id, email vào payload – JWT ai cũng giải mã đọc được!"};
        if (!p.exp || Math.abs(p.exp - p.iat - 3600) > 5) return {pass:false, msg:"Token cần hết hạn sau 1h (expiresIn: \"1h\")."};
        const d = m.docToken(t);
        if (!d || d.id !== 7) return {pass:false, msg:"docToken(token hợp lệ) phải trả về payload."};
        for (const sai of [jwt.sign({ id: 1 }, "secret-khac"), "abc.def.ghi", "", jwt.sign({ id: 1 }, "bi-mat-luyen-tap-jwt", { expiresIn: -10 })]) {
          let r; try { r = m.docToken(sai); } catch (e) { return {pass:false, msg:"docToken không được throw – hãy try/catch."}; }
          if (r !== null) return {pass:false, msg:"Token sai/hết hạn phải trả về null."};
        }
        return {pass:true, msg:"Ký bằng secret của server → không ai giả mạo được token."};`
    },
    {
      title: "Route /api/me được bảo vệ", level: 3, env: JWT_ENV,
      requests: [{ method: "GET", url: "/api/me" }, { method: "GET", url: "/api/me", headers: { Authorization: "Bearer token-gia" }, label: "/api/me (token giả)" }],
      task: "Viết middleware `canDangNhap`:\n• Đọc header `Authorization: Bearer <token>`; thiếu → **401** `{ error: \"Thiếu token\" }`.\n• Token sai/hết hạn → **401** `{ error: \"Token không hợp lệ\" }`.\n• Hợp lệ → gắn `req.user = payload` rồi `next()`.\n`GET /api/me` → `{ id, email }` từ `req.user`.",
      starter: J("const express = require(\"express\");\nconst jwt = require(\"jsonwebtoken\");\nconst app = express();\n\nfunction canDangNhap(req, res, next) {\n  \n}\n\n\napp.listen(3000);\n"),
      hint: "const [loai, token] = (req.get(\"authorization\") || \"\").split(\" \"); if (loai !== \"Bearer\" || !token) return res.status(401)…; try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); } catch { … }",
      solution: J("const express = require(\"express\");\nconst jwt = require(\"jsonwebtoken\");\nconst app = express();\n\nfunction canDangNhap(req, res, next) {\n  const [loai, token] = (req.get(\"authorization\") || \"\").split(\" \");\n  if (loai !== \"Bearer\" || !token) return res.status(401).json({ error: \"Thiếu token\" });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch (e) {\n    res.status(401).json({ error: \"Token không hợp lệ\" });\n  }\n}\n\napp.get(\"/api/me\", canDangNhap, (req, res) => {\n  res.json({ id: req.user.id, email: req.user.email });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const jwt = require("jsonwebtoken"), S = "bi-mat-luyen-tap-jwt";
        const me = h => T.request("GET", "/api/me", h ? { headers: { Authorization: h } } : {});
        let r = await me();
        if (r.status !== 401 || !r.body || r.body.error !== "Thiếu token") return {pass:false, msg:"Không có header → 401 { error: 'Thiếu token' }."};
        r = await me("Bearer abc.def.ghi");
        if (r.status !== 401 || !r.body || r.body.error !== "Token không hợp lệ") return {pass:false, msg:"Token hỏng → 401 { error: 'Token không hợp lệ' }."};
        r = await me("Bearer " + jwt.sign({ id: 1, email: "x@y.z" }, "secret-cua-ke-gian"));
        if (r.status !== 401) return {pass:false, msg:"Token ký bằng secret khác phải bị từ chối."};
        r = await me("Bearer " + jwt.sign({ id: 1, email: "x@y.z" }, S, { expiresIn: -5 }));
        if (r.status !== 401) return {pass:false, msg:"Token hết hạn phải bị từ chối."};
        r = await me("Bearer " + jwt.sign({ id: 5, email: "quang@gmail.com" }, S, { expiresIn: "1h" }));
        if (r.status !== 200 || !r.body || r.body.id !== 5 || r.body.email !== "quang@gmail.com") return {pass:false, msg:"Token hợp lệ → 200 { id: 5, email: 'quang@gmail.com' }."};
        r = await me(jwt.sign({ id: 5 }, S));
        if (r.status !== 401) return {pass:false, msg:"Thiếu chữ 'Bearer ' → 401."};
        return {pass:true, msg:"Middleware xác thực – thứ bảo vệ mọi API cần đăng nhập."};`
    },
    {
      title: "Phân quyền admin & token hết hạn", level: 3, env: JWT_ENV,
      requests: [{ method: "GET", url: "/api/admin/stats" }],
      task: "Hoàn thiện:\n• `canDangNhap`: token **hết hạn** (`err.name === \"TokenExpiredError\"`) → 401 `{ error: \"Token hết hạn\" }`; lỗi khác → 401 `{ error: \"Token không hợp lệ\" }`; thiếu → 401 `{ error: \"Thiếu token\" }`.\n• `chiAdmin`: `req.user.role !== \"admin\"` → **403** `{ error: \"Chỉ dành cho admin\" }`.\n• `GET /api/admin/stats` (cần cả 2 middleware) → `{ users: 42 }`.",
      starter: J("const express = require(\"express\");\nconst jwt = require(\"jsonwebtoken\");\nconst app = express();\n\nfunction canDangNhap(req, res, next) {\n  \n}\n\nfunction chiAdmin(req, res, next) {\n  \n}\n\n\napp.listen(3000);\n"),
      hint: "catch (e) { const msg = e.name === \"TokenExpiredError\" ? \"Token hết hạn\" : \"Token không hợp lệ\"; return res.status(401).json({ error: msg }); }\napp.get(\"/api/admin/stats\", canDangNhap, chiAdmin, handler)",
      solution: J("const express = require(\"express\");\nconst jwt = require(\"jsonwebtoken\");\nconst app = express();\n\nfunction canDangNhap(req, res, next) {\n  const [loai, token] = (req.get(\"authorization\") || \"\").split(\" \");\n  if (loai !== \"Bearer\" || !token) return res.status(401).json({ error: \"Thiếu token\" });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch (e) {\n    const msg = e.name === \"TokenExpiredError\" ? \"Token hết hạn\" : \"Token không hợp lệ\";\n    res.status(401).json({ error: msg });\n  }\n}\n\nfunction chiAdmin(req, res, next) {\n  if (req.user.role !== \"admin\") return res.status(403).json({ error: \"Chỉ dành cho admin\" });\n  next();\n}\n\napp.get(\"/api/admin/stats\", canDangNhap, chiAdmin, (req, res) => res.json({ users: 42 }));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const jwt = require("jsonwebtoken"), S = "bi-mat-luyen-tap-jwt";
        const get = tk => T.request("GET", "/api/admin/stats", tk ? { headers: { Authorization: "Bearer " + tk } } : {});
        let r = await get();
        if (r.status !== 401 || !r.body || r.body.error !== "Thiếu token") return {pass:false, msg:"Không có token → 401 'Thiếu token'."};
        r = await get(jwt.sign({ id: 1, role: "admin" }, S, { expiresIn: -10 }));
        if (r.status !== 401 || !r.body || r.body.error !== "Token hết hạn") return {pass:false, msg:"Token hết hạn → 401 { error: 'Token hết hạn' } (đang " + r.text + ")."};
        r = await get(jwt.sign({ id: 1, role: "admin" }, "sai"));
        if (r.status !== 401 || !r.body || r.body.error !== "Token không hợp lệ") return {pass:false, msg:"Sai chữ ký → 401 'Token không hợp lệ'."};
        r = await get(jwt.sign({ id: 2, role: "user" }, S));
        if (r.status !== 403 || !r.body || r.body.error !== "Chỉ dành cho admin") return {pass:false, msg:"Role user → 403 { error: 'Chỉ dành cho admin' }."};
        r = await get(jwt.sign({ id: 1, role: "admin" }, S, { expiresIn: "1h" }));
        if (r.status !== 200 || !r.body || r.body.users !== 42) return {pass:false, msg:"Admin hợp lệ → 200 { users: 42 }."};
        return {pass:true, msg:"Thông báo 'Token hết hạn' riêng giúp front-end biết cần gọi refresh token."};`
    }
  ];

  P["api-security"] = [
    {
      title: "Vá lỗ hổng SQL injection", level: 2,
      requests: [{ method: "GET", url: "/api/users?email=an@gmail.com" }, { method: "GET", url: "/api/users?email=' OR '1'='1", label: "/api/users (tấn công)" }],
      task: "Route `/api/users?email=` đang **nối chuỗi** vào SQL – kẻ xấu gửi `' OR '1'='1` là lấy được toàn bộ user. Sửa sang **prepared statement** (`?`) để:\n• Email đúng → 200 mảng 1 user `{ id, email }`.\n• Chuỗi tấn công → 200 **mảng rỗng**.",
      starter: J("const express = require(\"express\");\nconst Database = require(\"better-sqlite3\");\nconst app = express();\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, role TEXT);\n  INSERT INTO users (email, role) VALUES ('an@gmail.com', 'user'), ('admin@shop.vn', 'admin'), ('binh@gmail.com', 'user');\n`);\n\napp.get(\"/api/users\", (req, res) => {\n  const sql = \"SELECT id, email FROM users WHERE email = '\" + req.query.email + \"'\";\n  res.json(db.prepare(sql).all());\n});\n\napp.listen(3000);\n"),
      hint: "db.prepare(\"SELECT id, email FROM users WHERE email = ?\").all(req.query.email)",
      solution: J("const express = require(\"express\");\nconst Database = require(\"better-sqlite3\");\nconst app = express();\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, role TEXT);\n  INSERT INTO users (email, role) VALUES ('an@gmail.com', 'user'), ('admin@shop.vn', 'admin'), ('binh@gmail.com', 'user');\n`);\n\napp.get(\"/api/users\", (req, res) => {\n  res.json(db.prepare(\"SELECT id, email FROM users WHERE email = ?\").all(String(req.query.email || \"\")));\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        if (/["']\s*\+\s*req\.(query|params|body)|\$\{\s*req\.(query|params|body)/.test(T.src)) return {pass:false, msg:"Vẫn còn nối giá trị req.* vào chuỗi SQL."};
        let r = await T.request("GET", "/api/users?email=an@gmail.com");
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.length !== 1 || r.body[0].email !== "an@gmail.com") return {pass:false, msg:"Email đúng → mảng 1 user an@gmail.com."};
        r = await T.request("GET", "/api/users?email=" + encodeURIComponent("' OR '1'='1"));
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.length !== 0) return {pass:false, msg:"Chuỗi tấn công phải trả về [] (đang " + r.status + " " + r.text + ")."};
        return {pass:true, msg:"Dấu ? khiến dữ liệu luôn là DỮ LIỆU, không bao giờ thành lệnh SQL."};`
    },
    {
      title: "CORS chỉ cho phép tên miền tin cậy", level: 2,
      requests: [{ method: "GET", url: "/api/data", headers: { Origin: "https://automationdq.github.io" }, label: "/api/data (origin tin cậy)" }, { method: "GET", url: "/api/data", headers: { Origin: "https://evil.com" }, label: "/api/data (origin lạ)" }],
      task: "Dùng gói `cors` với **danh sách trắng** `[\"https://automationdq.github.io\", \"http://localhost:5173\"]`:\n• Origin trong danh sách → response có `Access-Control-Allow-Origin` đúng bằng origin đó.\n• Origin lạ → **không** có header này.\nTắt header lộ công nghệ: `app.disable(\"x-powered-by\")`. `GET /api/data` → `{ ok: true }`.",
      starter: J("const express = require(\"express\");\nconst cors = require(\"cors\");\nconst app = express();\n\n\napp.get(\"/api/data\", (req, res) => res.json({ ok: true }));\n\napp.listen(3000);\n"),
      hint: "app.use(cors({ origin: [\"https://automationdq.github.io\", \"http://localhost:5173\"] })); — KHÔNG dùng cors() trống (mở cho mọi nơi).",
      solution: J("const express = require(\"express\");\nconst cors = require(\"cors\");\nconst app = express();\n\napp.disable(\"x-powered-by\");\napp.use(cors({ origin: [\"https://automationdq.github.io\", \"http://localhost:5173\"] }));\n\napp.get(\"/api/data\", (req, res) => res.json({ ok: true }));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const g = o => T.request("GET", "/api/data", { headers: { Origin: o } });
        for (const o of ["https://automationdq.github.io", "http://localhost:5173"]) {
          const r = await g(o);
          if (r.status !== 200 || r.headers["access-control-allow-origin"] !== o) return {pass:false, msg:"Origin " + o + " phải được phép (Access-Control-Allow-Origin: " + o + ")."};
        }
        let r = await g("https://evil.com");
        if (r.headers["access-control-allow-origin"]) return {pass:false, msg:"Origin lạ không được có Access-Control-Allow-Origin (đang: " + r.headers["access-control-allow-origin"] + ")."};
        if (r.headers["x-powered-by"]) return {pass:false, msg:"Tắt header x-powered-by bằng app.disable(\"x-powered-by\")."};
        return {pass:true, msg:"CORS '*' cho API có đăng nhập là mời kẻ gian vào nhà!"};`
    },
    {
      title: "Tự viết rate limiter", level: 3,
      requests: [{ method: "POST", url: "/api/login" }],
      task: "Viết middleware `gioiHan(toiDa, cuaSoMs)`: đếm số request **theo IP** (`req.ip`) trong khung thời gian `cuaSoMs`; vượt `toiDa` → **429** `{ error: \"Quá nhiều yêu cầu\" }` kèm header `Retry-After` (số **giây** còn lại, làm tròn lên). Hết khung thì đếm lại từ đầu.\nÁp dụng `gioiHan(5, 1000)` cho `POST /api/login` (trả `{ ok: true }`).",
      starter: J("const express = require(\"express\");\nconst app = express();\n\nfunction gioiHan(toiDa, cuaSoMs) {\n  const bang = new Map(); // ip → { dem, batDau }\n  return (req, res, next) => {\n    \n  };\n}\n\n\napp.listen(3000);\n"),
      hint: "let b = bang.get(req.ip); if (!b || Date.now() - b.batDau >= cuaSoMs) { b = { dem: 0, batDau: Date.now() }; bang.set(req.ip, b); } b.dem++; if (b.dem > toiDa) { res.set(\"Retry-After\", Math.ceil((b.batDau + cuaSoMs - Date.now()) / 1000)); return res.status(429).json(...); }",
      solution: J("const express = require(\"express\");\nconst app = express();\n\nfunction gioiHan(toiDa, cuaSoMs) {\n  const bang = new Map(); // ip → { dem, batDau }\n  return (req, res, next) => {\n    const now = Date.now();\n    let b = bang.get(req.ip);\n    if (!b || now - b.batDau >= cuaSoMs) {\n      b = { dem: 0, batDau: now };\n      bang.set(req.ip, b);\n    }\n    b.dem++;\n    if (b.dem > toiDa) {\n      res.set(\"Retry-After\", String(Math.ceil((b.batDau + cuaSoMs - now) / 1000)));\n      return res.status(429).json({ error: \"Quá nhiều yêu cầu\" });\n    }\n    next();\n  };\n}\n\napp.post(\"/api/login\", gioiHan(5, 1000), (req, res) => res.json({ ok: true }));\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const st = [];
        for (let i = 0; i < 7; i++) st.push((await T.request("POST", "/api/login")).status);
        if (st.slice(0, 5).some(s => s !== 200)) return {pass:false, msg:"5 request đầu phải được phép (200). Đang: " + st.join(",")};
        if (st[5] !== 429 || st[6] !== 429) return {pass:false, msg:"Request thứ 6, 7 phải bị chặn 429. Đang: " + st.join(",")};
        let r = await T.request("POST", "/api/login");
        if (!r.body || r.body.error !== "Quá nhiều yêu cầu") return {pass:false, msg:"429 cần body { error: 'Quá nhiều yêu cầu' }."};
        if (!/^\d+$/.test(String(r.headers["retry-after"])) || +r.headers["retry-after"] < 1) return {pass:false, msg:"Cần header Retry-After là số giây (≥ 1)."};
        await T.sleep(1050);
        r = await T.request("POST", "/api/login");
        if (r.status !== 200) return {pass:false, msg:"Hết khung 1 giây phải được đếm lại từ đầu (200)."};
        if (typeof gioiHan(1, 1) !== "function") return {pass:false, msg:"gioiHan(...) phải trả về middleware."};
        return {pass:true, msg:"Rate limit chặn dò mật khẩu (brute-force) – bắt buộc cho route đăng nhập."};`
    }
  ];

  /* ===================== TRIỂN KHAI ===================== */
  P["env-config"] = [
    {
      title: "Đọc & ép kiểu biến môi trường", level: 1, env: { PORT: "8080", DEBUG: "true", MAX_UPLOAD_MB: "25" },
      task: "Tạo và xuất `module.exports = config` với:\n• `port`: **số** từ `PORT` (mặc định 3000).\n• `debug`: **boolean** – `true` chỉ khi `DEBUG === \"true\"`.\n• `maxUploadMb`: số từ `MAX_UPLOAD_MB` (mặc định 10).\n• `env`: `NODE_ENV` hoặc `\"development\"`.",
      starter: J("const config = {\n  \n};\n\nmodule.exports = config;\n"),
      hint: "Biến môi trường LUÔN là chuỗi: \"false\" vẫn là truthy! port: Number(process.env.PORT) || 3000, debug: process.env.DEBUG === \"true\"",
      solution: J("const config = {\n  port: Number(process.env.PORT) || 3000,\n  debug: process.env.DEBUG === \"true\",\n  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 10,\n  env: process.env.NODE_ENV || \"development\"\n};\n\nmodule.exports = config;\nconsole.log(config);"),
      check: String.raw`
        const c = T.exports();
        if (!c || typeof c !== "object") return {pass:false, msg:"Cần module.exports = config."};
        if (c.port !== 8080) return {pass:false, msg:"port phải là SỐ 8080 (đang " + JSON.stringify(c.port) + ")."};
        if (c.debug !== true) return {pass:false, msg:"debug phải là boolean true."};
        if (c.maxUploadMb !== 25) return {pass:false, msg:"maxUploadMb phải là số 25."};
        if (c.env !== "development") return {pass:false, msg:"NODE_ENV chưa đặt → env = 'development'."};
        if (/8080|"25"|= 25/.test(T.src)) return {pass:false, msg:"Đọc từ process.env, không gõ cứng giá trị."};
        return {pass:true, msg:"Ép kiểu ở MỘT chỗ (config) – phần còn lại của app dùng giá trị sạch."};`
    },
    {
      title: "Kiểm tra biến bắt buộc khi khởi động", level: 2, env: { DATABASE_URL: "file:./app.db" },
      task: "Viết `thieuBien(env, batBuoc)` trả về **mảng tên biến** trong `batBuoc` bị thiếu hoặc rỗng trong `env`.\nKhi khởi động: kiểm tra `[\"DATABASE_URL\", \"JWT_SECRET\"]` với `process.env`; nếu thiếu thì `console.error(\"Thiếu biến môi trường: <tên, cách nhau dấu phẩy>\")` rồi `process.exit(1)`.\nXuất `module.exports = { thieuBien }`.",
      starter: J("function thieuBien(env, batBuoc) {\n  \n}\n\nmodule.exports = { thieuBien };\n"),
      hint: "return batBuoc.filter(ten => !env[ten] || !String(env[ten]).trim()); — fail fast: thà không chạy còn hơn chạy với cấu hình sai.",
      solution: J("function thieuBien(env, batBuoc) {\n  return batBuoc.filter(ten => !env[ten] || !String(env[ten]).trim());\n}\n\nmodule.exports = { thieuBien };\n\nconst thieu = thieuBien(process.env, [\"DATABASE_URL\", \"JWT_SECRET\"]);\nif (thieu.length) {\n  console.error(\"Thiếu biến môi trường: \" + thieu.join(\", \"));\n  process.exit(1);\n}"),
      check: String.raw`
        const m = T.exports();
        if (!m || typeof m.thieuBien !== "function") return {pass:false, msg:"Cần module.exports = { thieuBien }."};
        const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        if (!eq(m.thieuBien({ A: "1", B: "2" }, ["A", "B"]), [])) return {pass:false, msg:"Đủ biến → []."};
        if (!eq(m.thieuBien({ A: "1", B: "  " }, ["A", "B", "C"]), ["B", "C"])) return {pass:false, msg:"Biến rỗng/chỉ khoảng trắng cũng tính là thiếu → ['B', 'C']."};
        if (!/process\.exit\(\s*1\s*\)/.test(T.src)) return {pass:false, msg:"Thiếu biến thì phải gọi process.exit(1)."};
        if (!T.logs.includes("[process.exit(1)]")) return {pass:false, msg:"Môi trường đang thiếu JWT_SECRET – app phải dừng bằng process.exit(1)."};
        return {pass:true, msg:"'Fail fast': phát hiện cấu hình sai ngay lúc deploy, không phải lúc khách hàng đang dùng."};`
    },
    {
      title: "Endpoint health check cho deploy", level: 3, env: { PORT: "8080", NODE_ENV: "production" },
      files: { "package.json": "{\n  \"name\": \"fa-api\",\n  \"version\": \"2.3.1\",\n  \"scripts\": { \"start\": \"node server.js\" }\n}\n" },
      requests: [{ method: "GET", url: "/health" }],
      task: "Nền tảng cloud (Render, Railway…) gọi `/health` để biết app còn sống. Viết:\n• `GET /health` → 200 `{ status: \"ok\", env, version, uptime }` – `env` từ `NODE_ENV`, `version` đọc từ `package.json` (fs + JSON.parse), `uptime` là **số** giây từ `process.uptime()`.\n• Server listen trên **`process.env.PORT`** (số), in `Đang chạy ở cổng <port>`.",
      starter: J("const express = require(\"express\");\nconst fs = require(\"fs\");\nconst app = express();\n\n\n"),
      hint: "const pkg = JSON.parse(fs.readFileSync(\"package.json\", \"utf8\")); const port = Number(process.env.PORT) || 3000; app.listen(port, () => console.log(...));",
      solution: J("const express = require(\"express\");\nconst fs = require(\"fs\");\nconst app = express();\n\nconst pkg = JSON.parse(fs.readFileSync(\"package.json\", \"utf8\"));\nconst port = Number(process.env.PORT) || 3000;\n\napp.get(\"/health\", (req, res) => {\n  res.json({\n    status: \"ok\",\n    env: process.env.NODE_ENV || \"development\",\n    version: pkg.version,\n    uptime: process.uptime()\n  });\n});\n\napp.listen(port, () => console.log(\"Đang chạy ở cổng \" + port));"),
      check: SRV + String.raw`
        await T.sleep(30);
        if (!T.logs.includes("Đang chạy ở cổng 8080")) return {pass:false, msg:"Phải listen trên process.env.PORT (8080) và in 'Đang chạy ở cổng 8080'."};
        if (/2\.3\.1|8080/.test(T.src)) return {pass:false, msg:"Không gõ cứng version/port – đọc từ package.json và process.env."};
        const r = await T.request("GET", "/health");
        if (r.status !== 200 || !r.body) return {pass:false, msg:"GET /health phải trả 200."};
        if (r.body.status !== "ok" || r.body.env !== "production" || r.body.version !== "2.3.1") return {pass:false, msg:"Body cần { status: 'ok', env: 'production', version: '2.3.1', uptime } – đang " + r.text};
        if (typeof r.body.uptime !== "number") return {pass:false, msg:"uptime phải là số (process.uptime())."};
        return {pass:true, msg:"Có /health, nền tảng cloud sẽ tự khởi động lại app khi nó 'chết'."};`
    }
  ];

  const BLOG_DB = "const express = require(\"express\");\nconst Database = require(\"better-sqlite3\");\nconst app = express();\napp.use(express.json());\n\nconst db = new Database(\":memory:\");\ndb.exec(`\n  CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT, created_at INTEGER);\n  INSERT INTO posts (title, content, created_at) VALUES\n    ('Học HTML từ con số 0', 'Thẻ và thuộc tính', 1), ('CSS Flexbox dễ hiểu', 'Bố cục một chiều', 2),\n    ('JavaScript bất đồng bộ', 'Promise và async', 3), ('Node.js cho người mới', 'Chạy JS trên server', 4),\n    ('Express trong 10 phút', 'Route và middleware', 5);\n`);\n";

  P["final-blog-api"] = [
    {
      title: "Tạo slug cho bài viết", level: 2,
      task: "URL đẹp dùng **slug**: `\"Học Node.js cơ bản!\"` → `\"hoc-nodejs-co-ban\"`. Viết và xuất `module.exports = { taoSlug }`:\n• Chữ thường, bỏ dấu tiếng Việt (kể cả `đ` → `d`).\n• Ký tự không phải chữ/số bị bỏ; khoảng trắng/gạch nối liên tiếp → **một** dấu `-`; không có `-` ở đầu/cuối.",
      starter: J("function taoSlug(tieuDe) {\n  \n}\n\nmodule.exports = { taoSlug };\n"),
      hint: "s.toLowerCase().normalize(\"NFD\").replace(/[\\u0300-\\u036f]/g, \"\").replace(/đ/g, \"d\").replace(/[^a-z0-9\\s-]/g, \"\").trim().replace(/[\\s-]+/g, \"-\")",
      solution: J("function taoSlug(tieuDe) {\n  return tieuDe\n    .toLowerCase()\n    .normalize(\"NFD\").replace(/[\\u0300-\\u036f]/g, \"\")\n    .replace(/đ/g, \"d\")\n    .replace(/[^a-z0-9\\s-]/g, \"\")\n    .trim()\n    .replace(/[\\s-]+/g, \"-\")\n    .replace(/^-+|-+$/g, \"\");\n}\n\nmodule.exports = { taoSlug };\nconsole.log(taoSlug(\"Học Node.js cơ bản!\"));"),
      check: String.raw`
        const m = T.exports();
        if (!m || typeof m.taoSlug !== "function") return {pass:false, msg:"Cần module.exports = { taoSlug }."};
        const cases = [["Học Node.js cơ bản!", "hoc-nodejs-co-ban"], ["Đường đến thành công", "duong-den-thanh-cong"], ["  Xin   chào -- thế giới  ", "xin-chao-the-gioi"], ["REST API (phần 2)", "rest-api-phan-2"], ["Tiếng Việt: ỹ ữ ặ ế", "tieng-viet-y-u-a-e"], ["-- C# & C++ --", "c-c"]];
        for (const [t, kq] of cases) { const r = m.taoSlug(t); if (r !== kq) return {pass:false, msg:"taoSlug(\"" + t + "\") phải là '" + kq + "' (đang '" + r + "')."}; }
        return {pass:true, msg:"Slug đẹp giúp URL dễ đọc và tốt cho SEO."};`
    },
    {
      title: "Tìm kiếm & phân trang bài viết", level: 3,
      requests: [{ method: "GET", url: "/api/posts" }, { method: "GET", url: "/api/posts?q=js&page=1&limit=2" }, { method: "GET", url: "/api/posts?page=2&limit=2" }],
      task: "`GET /api/posts?q=&page=&limit=` (đọc từ SQLite):\n• `q`: tìm trong `title` **hoặc** `content` (LIKE, không phân biệt hoa thường).\n• Sắp **mới nhất trước** (`created_at DESC`); mặc định `page=1`, `limit=3`; `limit` tối đa **10**.\n• Trả `{ data, page, limit, total }` – `total` là tổng số bài **khớp** q.",
      starter: J(BLOG_DB + "\n\napp.listen(3000);\n"),
      hint: "const where = q ? \" WHERE title LIKE ? OR content LIKE ?\" : \"\"; const ps = q ? [\"%\" + q + \"%\", \"%\" + q + \"%\"] : []; … LIMIT ? OFFSET ?  — Math.min(10, …) cho limit.",
      solution: J(BLOG_DB + "\napp.get(\"/api/posts\", (req, res) => {\n  const q = String(req.query.q || \"\").trim();\n  const page = Math.max(1, Number(req.query.page) || 1);\n  const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 3));\n  const where = q ? \" WHERE title LIKE ? OR content LIKE ?\" : \"\";\n  const ps = q ? [\"%\" + q + \"%\", \"%\" + q + \"%\"] : [];\n  const total = db.prepare(\"SELECT COUNT(*) AS n FROM posts\" + where).get(...ps).n;\n  const data = db.prepare(\"SELECT * FROM posts\" + where + \" ORDER BY created_at DESC LIMIT ? OFFSET ?\").all(...ps, limit, (page - 1) * limit);\n  res.json({ data, page, limit, total });\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const g = q => T.request("GET", "/api/posts" + q);
        let r = await g("");
        if (r.status !== 200 || !r.body || !Array.isArray(r.body.data)) return {pass:false, msg:"GET /api/posts → { data, page, limit, total }."};
        if (r.body.page !== 1 || r.body.limit !== 3 || r.body.total !== 5 || r.body.data.map(p => p.id).join() !== "5,4,3") return {pass:false, msg:"Mặc định: page 1, limit 3, total 5, data id 5,4,3 (mới nhất trước). Đang: " + JSON.stringify({ ids: r.body.data.map(p => p.id), page: r.body.page, limit: r.body.limit, total: r.body.total })};
        r = await g("?page=2&limit=2");
        if (r.body.data.map(p => p.id).join() !== "3,2") return {pass:false, msg:"page=2&limit=2 → id 3, 2."};
        r = await g("?q=javascript");
        if (r.body.total !== 1 || r.body.data[0].id !== 3) return {pass:false, msg:"q=javascript (không phân biệt hoa thường) → 1 bài id 3."};
        r = await g("?q=" + encodeURIComponent("middleware"));
        if (r.body.total !== 1 || r.body.data[0].id !== 5) return {pass:false, msg:"q tìm cả trong content: 'middleware' → bài id 5."};
        r = await g("?limit=500");
        if (r.body.limit !== 10) return {pass:false, msg:"limit tối đa 10 (chặn client tải quá nhiều)."};
        return {pass:true, msg:"Tìm kiếm + phân trang + giới hạn limit: bộ ba của mọi API danh sách."};`
    },
    {
      title: "Bình luận cần đăng nhập", level: 4, env: { JWT_SECRET: "blog-secret-luyen-tap" },
      requests: [{ method: "GET", url: "/api/posts/1/comments" }, { method: "POST", url: "/api/posts/1/comments", body: { content: "Hay!" }, label: "/api/posts/1/comments (chưa đăng nhập)" }],
      task: "Bảng `users` và `comments(id, post_id, user_id, content)` đã có. Hoàn thiện:\n• `POST /api/posts/:id/comments` cần JWT (`Bearer`, payload `{ id, email }`): thiếu/sai token → **401**; bài không tồn tại → **404**; `content` rỗng → **400**; thành công → **201** `{ id, post_id, user_id, content }` với `user_id` lấy **từ token** (không tin body).\n• `GET /api/posts/:id/comments` (công khai) → mảng `{ id, content, email }` – email người viết lấy bằng **JOIN** với `users`, sắp theo `id`.",
      starter: J(BLOG_DB.replace("app.use(express.json());\n", "app.use(express.json());\nconst jwt = require(\"jsonwebtoken\");\n").replace("    ('Express trong 10 phút', 'Route và middleware', 5);\n", "    ('Express trong 10 phút', 'Route và middleware', 5);\n  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT);\n  INSERT INTO users (email) VALUES ('quang@gmail.com'), ('an@gmail.com');\n  CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, user_id INTEGER, content TEXT);\n") + "\nfunction canDangNhap(req, res, next) {\n  \n}\n\n\napp.listen(3000);\n"),
      hint: "SELECT comments.id AS id, comments.content AS content, users.email AS email FROM comments JOIN users ON users.id = comments.user_id WHERE comments.post_id = ? ORDER BY comments.id",
      solution: J(BLOG_DB.replace("app.use(express.json());\n", "app.use(express.json());\nconst jwt = require(\"jsonwebtoken\");\n").replace("    ('Express trong 10 phút', 'Route và middleware', 5);\n", "    ('Express trong 10 phút', 'Route và middleware', 5);\n  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT);\n  INSERT INTO users (email) VALUES ('quang@gmail.com'), ('an@gmail.com');\n  CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, user_id INTEGER, content TEXT);\n") + "\nfunction canDangNhap(req, res, next) {\n  const [loai, token] = (req.get(\"authorization\") || \"\").split(\" \");\n  if (loai !== \"Bearer\" || !token) return res.status(401).json({ error: \"Cần đăng nhập\" });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch (e) {\n    res.status(401).json({ error: \"Token không hợp lệ\" });\n  }\n}\n\nfunction timBai(req, res, next) {\n  req.post = db.prepare(\"SELECT id FROM posts WHERE id = ?\").get(Number(req.params.id));\n  if (!req.post) return res.status(404).json({ error: \"Không tìm thấy bài viết\" });\n  next();\n}\n\napp.get(\"/api/posts/:id/comments\", timBai, (req, res) => {\n  res.json(db.prepare(`\n    SELECT comments.id AS id, comments.content AS content, users.email AS email\n    FROM comments JOIN users ON users.id = comments.user_id\n    WHERE comments.post_id = ? ORDER BY comments.id\n  `).all(req.post.id));\n});\n\napp.post(\"/api/posts/:id/comments\", canDangNhap, timBai, (req, res) => {\n  const content = String(req.body.content || \"\").trim();\n  if (!content) return res.status(400).json({ error: \"Nội dung không được để trống\" });\n  const info = db.prepare(\"INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)\").run(req.post.id, req.user.id, content);\n  res.status(201).json(db.prepare(\"SELECT * FROM comments WHERE id = ?\").get(info.lastInsertRowid));\n});\n\napp.listen(3000);"),
      check: SRV + String.raw`
        const jwt = require("jsonwebtoken"), S = "blog-secret-luyen-tap";
        const tk = (id, email) => "Bearer " + jwt.sign({ id, email }, S, { expiresIn: "1h" });
        const post = (id, body, auth) => T.request("POST", "/api/posts/" + id + "/comments", { body, headers: auth ? { Authorization: auth } : {} });
        let r = await post(1, { content: "Hay!" });
        if (r.status !== 401) return {pass:false, msg:"Chưa đăng nhập → 401 (đang " + r.status + ")."};
        r = await post(1, { content: "Hay!" }, "Bearer " + jwt.sign({ id: 1 }, "sai"));
        if (r.status !== 401) return {pass:false, msg:"Token sai chữ ký → 401."};
        r = await post(99, { content: "Hay!" }, tk(1, "quang@gmail.com"));
        if (r.status !== 404) return {pass:false, msg:"Bài không tồn tại → 404."};
        r = await post(1, { content: "   " }, tk(1, "quang@gmail.com"));
        if (r.status !== 400) return {pass:false, msg:"content rỗng → 400."};
        r = await post(1, { content: "Bài viết rất hay!", user_id: 2 }, tk(1, "quang@gmail.com"));
        if (r.status !== 201 || !r.body || r.body.post_id !== 1 || r.body.content !== "Bài viết rất hay!") return {pass:false, msg:"Bình luận hợp lệ → 201 { id, post_id: 1, user_id, content } (đang " + r.status + " " + r.text + ")."};
        if (r.body.user_id !== 1) return {pass:false, msg:"user_id phải lấy từ token (1), KHÔNG lấy từ body (2)!"};
        await post(1, { content: "Cảm ơn bạn" }, tk(2, "an@gmail.com"));
        r = await T.request("GET", "/api/posts/1/comments");
        const want = '[{"id":1,"content":"Bài viết rất hay!","email":"quang@gmail.com"},{"id":2,"content":"Cảm ơn bạn","email":"an@gmail.com"}]';
        if (r.status !== 200 || JSON.stringify(r.body) !== want) return {pass:false, msg:"GET comments → [{ id, content, email }] theo id. Đang: " + r.text};
        r = await T.request("GET", "/api/posts/2/comments");
        if (!Array.isArray(r.body) || r.body.length !== 0) return {pass:false, msg:"Bài 2 chưa có bình luận → []."};
        if ((await T.request("GET", "/api/posts/99/comments")).status !== 404) return {pass:false, msg:"GET bình luận của bài không tồn tại → 404."};
        return {pass:true, msg:"Hoàn thành Blog API: xác thực + phân quyền theo dữ liệu + JOIN. Bạn đã là back-end dev! 🏆"};`
    }
  ];
})();
