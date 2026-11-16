/* =========================================================
   KHOÁ BACK-END NODE.JS – phần 2: SQL, Bảo mật, Triển khai
   (LEVELS đã khai báo trong lessons-backend.js)
   ========================================================= */
LESSONS.push(
  /* ===================== CẤP 3: SQL ===================== */
  {
    id: "sql-basics", level: "be-db", icon: "🗄️", title: "SQL cơ bản: bảng, CREATE, INSERT, SELECT", duration: 25, runtime: "node",
    summary: "Cơ sở dữ liệu quan hệ lưu dữ liệu thành bảng. SQL là ngôn ngữ để tạo bảng, thêm và truy vấn dữ liệu.",
    content: [
      { h: "Vì sao cần database?" },
      { p: "Lưu dữ liệu trong biến thì mất khi server tắt; lưu file JSON thì chậm và dễ hỏng khi nhiều người ghi cùng lúc. **Cơ sở dữ liệu (database)** lưu bền vững, truy vấn nhanh, đảm bảo toàn vẹn dữ liệu. Phổ biến: **SQLite** (một file, rất nhẹ), **PostgreSQL**, **MySQL**." },
      { h: "Bảng – dòng – cột" },
      { code: "Bảng books\n┌────┬──────────────────────┬──────────────────┬──────┐\n│ id │ title                │ author           │ year │  ← cột (column)\n├────┼──────────────────────┼──────────────────┼──────┤\n│ 1  │ Dế Mèn phiêu lưu ký  │ Tô Hoài          │ 1941 │  ← dòng (row)\n│ 2  │ Số đỏ                │ Vũ Trọng Phụng   │ 1936 │\n└────┴──────────────────────┴──────────────────┴──────┘", lang: "http" },
      { h: "Tạo bảng và thêm dữ liệu" },
      { code: "CREATE TABLE IF NOT EXISTS books (\n  id     INTEGER PRIMARY KEY AUTOINCREMENT,   -- khoá chính, tự tăng\n  title  TEXT NOT NULL,                       -- bắt buộc\n  author TEXT,\n  year   INTEGER\n);\n\nINSERT INTO books (title, author, year) VALUES ('Dế Mèn phiêu lưu ký', 'Tô Hoài', 1941);", lang: "sql" },
      { h: "Truy vấn với SELECT" },
      { code: "SELECT * FROM books;                                  -- mọi cột\nSELECT title, year FROM books WHERE year > 1940;      -- lọc\nSELECT title FROM books ORDER BY year DESC LIMIT 3;   -- sắp xếp + giới hạn\nSELECT COUNT(*) AS tongSo FROM books;                 -- đếm", lang: "sql" },
      { h: "Dùng SQLite trong Node với better-sqlite3" },
      { code: "const Database = require('better-sqlite3');\nconst db = new Database('app.db');          // ':memory:' = chỉ trong RAM\n\ndb.exec(`CREATE TABLE IF NOT EXISTS books (...)`);   // chạy SQL không cần kết quả\n\nconst them = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)');\nconst kq = them.run('Số đỏ', 'Vũ Trọng Phụng', 1936);\nconsole.log(kq.lastInsertRowid);            // id vừa tạo\n\ndb.prepare('SELECT * FROM books WHERE id = ?').get(1);         // 1 dòng | undefined\ndb.prepare('SELECT * FROM books WHERE year > ?').all(1940);    // mảng dòng" },
      { warn: "Luôn truyền giá trị qua dấu `?` (prepared statement), **không** nối chuỗi vào câu SQL. Lý do bảo mật sẽ học ở bài *Bảo mật API*." },
      { tip: "App có sẵn **SQLite mô phỏng** hỗ trợ: CREATE/DROP TABLE, INSERT, SELECT (WHERE, ORDER BY, LIMIT/OFFSET, LIKE, IN, BETWEEN, JOIN, GROUP BY, COUNT/SUM/AVG/MIN/MAX), UPDATE, DELETE." }
    ],
    example: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\n\ndb.exec(`\n  CREATE TABLE products (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    ten TEXT NOT NULL,\n    gia INTEGER\n  );\n`);\n\nconst them = db.prepare('INSERT INTO products (ten, gia) VALUES (?, ?)');\nthem.run('Bút bi', 5000);\nthem.run('Vở 200 trang', 18000);\nconst kq = them.run('Balo', 350000);\nconsole.log('id vừa thêm:', kq.lastInsertRowid);\n\nconsole.table(db.prepare('SELECT * FROM products').all());\nconsole.log('Dưới 20k:', db.prepare('SELECT ten, gia FROM products WHERE gia < ? ORDER BY gia').all(20000));\nconsole.log(db.prepare('SELECT COUNT(*) AS soLuong, MAX(gia) AS datNhat FROM products').get());\n" },
    exercise: {
      task: "1) Tạo bảng `books` gồm: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `title` (TEXT NOT NULL), `author` (TEXT), `year` (INTEGER).\n2) Thêm 4 cuốn sách trong mảng `sach` (dùng prepared statement với `?`).\n3) Viết hàm `sachSauNam(nam)` trả về mảng `{ title, year }` của các sách có `year > nam`, sắp xếp `year` tăng dần.",
      starter: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\n\nconst sach = [\n  ['Dế Mèn phiêu lưu ký', 'Tô Hoài', 1941],\n  ['Số đỏ', 'Vũ Trọng Phụng', 1936],\n  ['Nỗi buồn chiến tranh', 'Bảo Ninh', 1987],\n  ['Mắt biếc', 'Nguyễn Nhật Ánh', 1990]\n];\n\n// 1) CREATE TABLE books ...\n\n// 2) INSERT 4 cuốn sách\n\n// 3) Hàm truy vấn\nfunction sachSauNam(nam) {\n  \n}\n\nconsole.log(sachSauNam(1940));\n" },
      hint: "const them = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)'); sach.forEach(s => them.run(...s)); — truy vấn: db.prepare('SELECT title, year FROM books WHERE year > ? ORDER BY year').all(nam)",
      solution: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\n\nconst sach = [\n  ['Dế Mèn phiêu lưu ký', 'Tô Hoài', 1941],\n  ['Số đỏ', 'Vũ Trọng Phụng', 1936],\n  ['Nỗi buồn chiến tranh', 'Bảo Ninh', 1987],\n  ['Mắt biếc', 'Nguyễn Nhật Ánh', 1990]\n];\n\ndb.exec(`\n  CREATE TABLE IF NOT EXISTS books (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    title TEXT NOT NULL,\n    author TEXT,\n    year INTEGER\n  )\n`);\n\nconst them = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)');\nsach.forEach(s => them.run(...s));\n\nfunction sachSauNam(nam) {\n  return db.prepare('SELECT title, year FROM books WHERE year > ? ORDER BY year').all(nam);\n}\n\nconsole.log(sachSauNam(1940));\n" },
      check: `
        const db = T.db();
        if (!db) return {pass:false, msg:"Chưa tạo database (new Database(':memory:'))."};
        let rows;
        try { rows = db.prepare("SELECT * FROM books ORDER BY id").all(); } catch (e) { return {pass:false, msg:"Chưa có bảng books: " + e.message}; }
        if (rows.length !== 4) return {pass:false, msg:"Bảng books phải có 4 cuốn sách, đang có " + rows.length + "."};
        const cols = Object.keys(rows[0]).join(",");
        if (cols !== "id,title,author,year") return {pass:false, msg:"Bảng cần đúng 4 cột id, title, author, year (đang: " + cols + ")."};
        if (rows[0].id !== 1 || rows[3].id !== 4) return {pass:false, msg:"id phải tự tăng 1, 2, 3, 4 (INTEGER PRIMARY KEY AUTOINCREMENT)."};
        let threw = false; try { db.prepare("INSERT INTO books (author) VALUES (?)").run("x"); } catch (e) { threw = true; }
        if (!threw) return {pass:false, msg:"Cột title phải NOT NULL."};
        if (typeof sachSauNam !== "function") return {pass:false, msg:"Không tìm thấy hàm sachSauNam."};
        const r = sachSauNam(1940);
        if (!Array.isArray(r) || JSON.stringify(r) !== JSON.stringify([{title:"Dế Mèn phiêu lưu ký",year:1941},{title:"Nỗi buồn chiến tranh",year:1987},{title:"Mắt biếc",year:1990}])) return {pass:false, msg:"sachSauNam(1940) phải trả [{title, year}] của 3 cuốn, xếp year tăng dần. Đang ra: " + JSON.stringify(r)};
        if (sachSauNam(2000).length !== 0) return {pass:false, msg:"sachSauNam(2000) phải trả mảng rỗng."};
        if (!/\\?/.test(T.src) || /\\$\\{\\s*nam\\s*\\}/.test(T.src)) return {pass:false, msg:"Dùng dấu ? và truyền tham số vào .all(nam) – không nối chuỗi vào SQL."};
        return {pass:true, msg:"Database đầu tiên của bạn đã có dữ liệu! 🗄️"};`
    }
  },
  {
    id: "sql-crud", level: "be-db", icon: "✏️", title: "SQL: UPDATE, DELETE, tìm kiếm & phân trang", duration: 25, runtime: "node",
    summary: "Sửa và xoá dữ liệu an toàn với WHERE, tìm kiếm bằng LIKE, phân trang với LIMIT/OFFSET và thống kê bằng hàm tổng hợp.",
    content: [
      { h: "UPDATE và DELETE – nhớ WHERE!" },
      { code: "UPDATE students SET diem = 9.5 WHERE id = 3;\nDELETE FROM students WHERE id = 7;\n\n-- ☠️ Quên WHERE = sửa/xoá TOÀN BỘ bảng\nDELETE FROM students;", lang: "sql" },
      { code: "const kq = db.prepare('UPDATE students SET diem = ? WHERE id = ?').run(9.5, 3);\nconsole.log(kq.changes);   // số dòng bị ảnh hưởng: 0 nghĩa là không tìm thấy id" },
      { h: "Tìm kiếm với LIKE" },
      { code: "SELECT * FROM students WHERE ten LIKE '%an%';   -- chứa 'an' (không phân biệt hoa thường với chữ Latin)\nSELECT * FROM students WHERE ten LIKE 'Ng%';    -- bắt đầu bằng 'Ng'", lang: "sql" },
      { code: "// % đặt vào GIÁ TRỊ tham số, không viết vào câu SQL\ndb.prepare('SELECT * FROM students WHERE ten LIKE ?').all('%' + tuKhoa + '%');" },
      { h: "Phân trang với LIMIT / OFFSET" },
      { code: "-- trang 1: 10 dòng đầu, trang 2: bỏ qua 10, lấy 10 tiếp…\nSELECT * FROM students ORDER BY id LIMIT 10 OFFSET 0;   -- trang 1\nSELECT * FROM students ORDER BY id LIMIT 10 OFFSET 10;  -- trang 2\n-- OFFSET = (trang - 1) * soMoiTrang", lang: "sql" },
      { h: "Hàm tổng hợp và nhóm" },
      { code: "SELECT COUNT(*) AS soLuong, AVG(diem) AS diemTB, MAX(diem) AS caoNhat FROM students;\nSELECT lop, COUNT(*) AS siSo FROM students GROUP BY lop ORDER BY siSo DESC;\nSELECT ROUND(AVG(diem), 2) AS diemTB FROM students;   -- làm tròn 2 chữ số", lang: "sql" },
      { tip: "Luôn có `ORDER BY` khi phân trang – không có nó, database không đảm bảo thứ tự các dòng giữa hai lần truy vấn." }
    ],
    example: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`CREATE TABLE sp (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT, loai TEXT, gia INTEGER);\n  INSERT INTO sp (ten, loai, gia) VALUES\n  ('Bút bi', 'van-phong-pham', 5000), ('Bút chì', 'van-phong-pham', 3000),\n  ('Tai nghe', 'dien-tu', 590000), ('Chuột', 'dien-tu', 250000), ('Thước', 'van-phong-pham', 7000);`);\n\nconsole.log('Tìm \"bút\":', db.prepare('SELECT ten FROM sp WHERE ten LIKE ?').all('%bút%'));\nconsole.log('Trang 2 (2/trang):', db.prepare('SELECT id, ten FROM sp ORDER BY id LIMIT ? OFFSET ?').all(2, 2));\nconsole.log('Tăng giá điện tử 10%:', db.prepare(\"UPDATE sp SET gia = gia * 1.1 WHERE loai = 'dien-tu'\").run());\nconsole.table(db.prepare('SELECT loai, COUNT(*) AS soSP, AVG(gia) AS giaTB FROM sp GROUP BY loai').all());\nconsole.log('Xoá:', db.prepare('DELETE FROM sp WHERE gia < ?').run(5000));\n" },
    exercise: {
      task: "Bảng `students(id, ten, lop, diem)` đã có 8 học sinh. Viết các hàm (dùng prepared statement):\n• `timKiem(tuKhoa)` – học sinh có tên chứa từ khoá, xếp theo `ten` A→Z.\n• `phanTrang(trang, soMoiTrang)` – lấy đúng trang theo `id` tăng dần.\n• `capNhatDiem(id, diem)` – trả về số dòng thay đổi (`changes`).\n• `xoaHocSinh(id)` – trả về số dòng đã xoá.\n• `thongKe()` – trả `{ soLuong, diemTB }` với diemTB làm tròn 2 chữ số.",
      starter: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE students (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT NOT NULL, lop TEXT, diem REAL);\n  INSERT INTO students (ten, lop, diem) VALUES\n    ('Nguyễn An', '12A1', 8.5), ('Trần Bình', '12A1', 7.0), ('Lê Chi', '12A2', 9.0),\n    ('Phạm Dũng', '12A2', 6.5), ('Hoàng Em', '12A1', 8.0), ('Vũ Giang', '12A3', 7.5),\n    ('Đỗ Hà', '12A3', 9.5), ('Bùi Khánh', '12A2', 5.5);\n`);\n\nfunction timKiem(tuKhoa) {\n  \n}\n\nfunction phanTrang(trang, soMoiTrang) {\n  \n}\n\nfunction capNhatDiem(id, diem) {\n  \n}\n\nfunction xoaHocSinh(id) {\n  \n}\n\nfunction thongKe() {\n  \n}\n\nconsole.log(timKiem('an'));\n" },
      hint: "phanTrang: .all(soMoiTrang, (trang - 1) * soMoiTrang) với 'SELECT * FROM students ORDER BY id LIMIT ? OFFSET ?'. thongKe: 'SELECT COUNT(*) AS soLuong, ROUND(AVG(diem), 2) AS diemTB FROM students' rồi .get()",
      solution: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE students (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT NOT NULL, lop TEXT, diem REAL);\n  INSERT INTO students (ten, lop, diem) VALUES\n    ('Nguyễn An', '12A1', 8.5), ('Trần Bình', '12A1', 7.0), ('Lê Chi', '12A2', 9.0),\n    ('Phạm Dũng', '12A2', 6.5), ('Hoàng Em', '12A1', 8.0), ('Vũ Giang', '12A3', 7.5),\n    ('Đỗ Hà', '12A3', 9.5), ('Bùi Khánh', '12A2', 5.5);\n`);\n\nfunction timKiem(tuKhoa) {\n  return db.prepare('SELECT * FROM students WHERE ten LIKE ? ORDER BY ten').all('%' + tuKhoa + '%');\n}\n\nfunction phanTrang(trang, soMoiTrang) {\n  return db.prepare('SELECT * FROM students ORDER BY id LIMIT ? OFFSET ?').all(soMoiTrang, (trang - 1) * soMoiTrang);\n}\n\nfunction capNhatDiem(id, diem) {\n  return db.prepare('UPDATE students SET diem = ? WHERE id = ?').run(diem, id).changes;\n}\n\nfunction xoaHocSinh(id) {\n  return db.prepare('DELETE FROM students WHERE id = ?').run(id).changes;\n}\n\nfunction thongKe() {\n  return db.prepare('SELECT COUNT(*) AS soLuong, ROUND(AVG(diem), 2) AS diemTB FROM students').get();\n}\n\nconsole.log(timKiem('an'));\nconsole.log(thongKe());\n" },
      check: `
        for (const f of ["timKiem", "phanTrang", "capNhatDiem", "xoaHocSinh", "thongKe"]) if (typeof window[f] !== "function") return {pass:false, msg:"Thiếu hàm " + f + "."};
        const db = T.db();
        const names = a => (a || []).map(x => x.ten).join(" | ");
        const tk = timKiem("an");
        if (names(tk) !== "Nguyễn An | Vũ Giang") return {pass:false, msg:"timKiem('an') phải trả \\"Nguyễn An | Vũ Giang\\" (LIKE '%an%', ORDER BY ten) – đang ra: " + names(tk)};
        if (names(timKiem("Chi")) !== "Lê Chi") return {pass:false, msg:"timKiem('Chi') phải trả đúng Lê Chi."};
        const p2 = phanTrang(2, 3);
        if (!Array.isArray(p2) || p2.map(x => x.id).join(",") !== "4,5,6") return {pass:false, msg:"phanTrang(2, 3) phải trả học sinh id 4, 5, 6 (đang: " + (Array.isArray(p2) ? p2.map(x => x.id).join(",") : p2) + ")."};
        if (phanTrang(3, 3).length !== 2) return {pass:false, msg:"phanTrang(3, 3) – trang cuối – phải có 2 học sinh."};
        if (capNhatDiem(2, 10) !== 1) return {pass:false, msg:"capNhatDiem(2, 10) phải trả 1 (số dòng thay đổi)."};
        if (db.prepare("SELECT diem FROM students WHERE id = 2").get().diem !== 10) return {pass:false, msg:"Điểm của id 2 chưa được cập nhật thành 10."};
        if (capNhatDiem(999, 5) !== 0) return {pass:false, msg:"capNhatDiem với id không tồn tại phải trả 0."};
        if (xoaHocSinh(8) !== 1 || xoaHocSinh(8) !== 0) return {pass:false, msg:"xoaHocSinh(8) lần đầu trả 1, lần hai trả 0."};
        const t = thongKe();
        const exp = db.prepare("SELECT COUNT(*) AS c, AVG(diem) AS a FROM students").get();
        if (!t || t.soLuong !== 7 || Math.abs(t.diemTB - Math.round(exp.a * 100) / 100) > 0.001) return {pass:false, msg:"thongKe() phải trả { soLuong: 7, diemTB: " + (Math.round(exp.a * 100) / 100) + " } sau khi đã sửa/xoá. Đang: " + JSON.stringify(t)};
        if (String(t.diemTB).split(".")[1] && String(t.diemTB).split(".")[1].length > 2) return {pass:false, msg:"diemTB cần làm tròn 2 chữ số (ROUND(AVG(diem), 2))."};
        return {pass:true, msg:"Thao tác dữ liệu thuần thục! ✏️"};`
    }
  },
  {
    id: "sql-relations", level: "be-db", icon: "🔗", title: "Quan hệ giữa các bảng & JOIN", duration: 25, runtime: "node",
    summary: "Tách dữ liệu thành nhiều bảng liên kết bằng khoá ngoại, rồi ghép lại khi truy vấn bằng JOIN và LEFT JOIN.",
    content: [
      { h: "Vì sao phải tách bảng?" },
      { p: "Nếu mỗi cuốn sách đều ghi lại tên, quê quán, năm sinh của tác giả → dữ liệu **lặp lại**, sửa một chỗ phải sửa trăm chỗ. Giải pháp: bảng `authors` riêng, bảng `books` chỉ lưu **khoá ngoại** `author_id` trỏ tới tác giả." },
      { code: "CREATE TABLE authors (\n  id   INTEGER PRIMARY KEY AUTOINCREMENT,\n  name TEXT NOT NULL\n);\nCREATE TABLE books (\n  id        INTEGER PRIMARY KEY AUTOINCREMENT,\n  title     TEXT NOT NULL,\n  author_id INTEGER REFERENCES authors(id)   -- khoá ngoại (foreign key)\n);", lang: "sql" },
      { h: "Các kiểu quan hệ" },
      { list: [
        "**1 – n (một – nhiều)**: một tác giả có nhiều sách; một user có nhiều đơn hàng. Khoá ngoại đặt ở bảng \"nhiều\".",
        "**n – n (nhiều – nhiều)**: sinh viên ↔ môn học. Cần **bảng trung gian** `enrollments(student_id, course_id)`.",
        "**1 – 1**: user ↔ hồ sơ chi tiết (ít gặp hơn)."
      ] },
      { h: "INNER JOIN – chỉ lấy dòng khớp ở cả hai bảng" },
      { code: "SELECT b.title, a.name AS author\nFROM books b\nJOIN authors a ON a.id = b.author_id      -- b, a là bí danh (alias)\nORDER BY b.title;", lang: "sql" },
      { h: "LEFT JOIN – giữ mọi dòng của bảng bên trái" },
      { code: "-- Đếm số sách của MỖI tác giả, kể cả tác giả chưa có sách (số 0)\nSELECT a.name, COUNT(b.id) AS soSach\nFROM authors a\nLEFT JOIN books b ON b.author_id = a.id\nGROUP BY a.id\nORDER BY soSach DESC, a.name;", lang: "sql" },
      { tip: "`COUNT(b.id)` đếm số dòng mà `b.id` khác NULL – vì vậy tác giả không có sách được đếm là 0. Còn `COUNT(*)` sẽ ra 1 (đếm luôn dòng NULL)." }
    ],
    example: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT);\n  CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), tong INTEGER);\n  INSERT INTO users (ten) VALUES ('An'), ('Bình'), ('Chi');\n  INSERT INTO orders (user_id, tong) VALUES (1, 150000), (1, 320000), (2, 90000);\n`);\n\nconsole.log('INNER JOIN:');\nconsole.table(db.prepare('SELECT u.ten, o.tong FROM orders o JOIN users u ON u.id = o.user_id').all());\n\nconsole.log('LEFT JOIN + GROUP BY:');\nconsole.table(db.prepare(`\n  SELECT u.ten, COUNT(o.id) AS soDon, COALESCE(SUM(o.tong), 0) AS tongTien\n  FROM users u LEFT JOIN orders o ON o.user_id = u.id\n  GROUP BY u.id ORDER BY tongTien DESC\n`).all());\n" },
    exercise: {
      task: "Đã có bảng `authors` và `books` (khoá ngoại `author_id`). Viết 2 hàm:\n• `sachKemTacGia()` → mảng `{ title, author }` (author là tên tác giả) dùng **JOIN**, sắp xếp theo `title` A→Z.\n• `demSachTheoTacGia()` → mảng `{ name, soSach }` cho **mọi** tác giả (kể cả 0 sách) dùng **LEFT JOIN + GROUP BY**, sắp xếp `soSach` giảm dần rồi `name` A→Z.",
      starter: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);\n  CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));\n  INSERT INTO authors (name) VALUES ('Nguyễn Nhật Ánh'), ('Tô Hoài'), ('Nam Cao'), ('Xuân Diệu');\n  INSERT INTO books (title, author_id) VALUES\n    ('Mắt biếc', 1), ('Cho tôi xin một vé đi tuổi thơ', 1), ('Tôi thấy hoa vàng trên cỏ xanh', 1),\n    ('Dế Mèn phiêu lưu ký', 2), ('Vợ chồng A Phủ', 2), ('Chí Phèo', 3);\n`);\n\nfunction sachKemTacGia() {\n  \n}\n\nfunction demSachTheoTacGia() {\n  \n}\n\nconsole.table(demSachTheoTacGia());\n" },
      hint: "SELECT b.title, a.name AS author FROM books b JOIN authors a ON a.id = b.author_id ORDER BY b.title — SELECT a.name, COUNT(b.id) AS soSach FROM authors a LEFT JOIN books b ON b.author_id = a.id GROUP BY a.id ORDER BY soSach DESC, a.name",
      solution: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);\n  CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));\n  INSERT INTO authors (name) VALUES ('Nguyễn Nhật Ánh'), ('Tô Hoài'), ('Nam Cao'), ('Xuân Diệu');\n  INSERT INTO books (title, author_id) VALUES\n    ('Mắt biếc', 1), ('Cho tôi xin một vé đi tuổi thơ', 1), ('Tôi thấy hoa vàng trên cỏ xanh', 1),\n    ('Dế Mèn phiêu lưu ký', 2), ('Vợ chồng A Phủ', 2), ('Chí Phèo', 3);\n`);\n\nfunction sachKemTacGia() {\n  return db.prepare(`\n    SELECT b.title, a.name AS author\n    FROM books b\n    JOIN authors a ON a.id = b.author_id\n    ORDER BY b.title\n  `).all();\n}\n\nfunction demSachTheoTacGia() {\n  return db.prepare(`\n    SELECT a.name, COUNT(b.id) AS soSach\n    FROM authors a\n    LEFT JOIN books b ON b.author_id = a.id\n    GROUP BY a.id\n    ORDER BY soSach DESC, a.name\n  `).all();\n}\n\nconsole.table(demSachTheoTacGia());\n" },
      check: `
        if (typeof sachKemTacGia !== "function" || typeof demSachTheoTacGia !== "function") return {pass:false, msg:"Cần 2 hàm sachKemTacGia và demSachTheoTacGia."};
        const a = sachKemTacGia();
        if (!Array.isArray(a) || a.length !== 6) return {pass:false, msg:"sachKemTacGia() phải trả 6 dòng (mỗi sách một dòng)."};
        if (Object.keys(a[0]).join(",") !== "title,author") return {pass:false, msg:"Mỗi dòng chỉ gồm { title, author } (dùng a.name AS author)."};
        const titles = a.map(x => x.title), sorted = titles.slice().sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        if (titles.join("|") !== sorted.join("|")) return {pass:false, msg:"Cần sắp xếp theo title (ORDER BY b.title)."};
        const cp = a.find(x => x.title === "Chí Phèo");
        if (!cp || cp.author !== "Nam Cao") return {pass:false, msg:"\\"Chí Phèo\\" phải đi kèm tác giả Nam Cao – kiểm tra điều kiện ON."};
        const d = demSachTheoTacGia();
        const s = JSON.stringify(d);
        const exp = JSON.stringify([{name:"Nguyễn Nhật Ánh",soSach:3},{name:"Tô Hoài",soSach:2},{name:"Nam Cao",soSach:1},{name:"Xuân Diệu",soSach:0}]);
        if (s !== exp) {
          if (Array.isArray(d) && d.length === 3) return {pass:false, msg:"Thiếu tác giả có 0 sách (Xuân Diệu) – dùng LEFT JOIN và COUNT(b.id)."};
          if (Array.isArray(d) && d.some(x => x.name === "Xuân Diệu" && x.soSach === 1)) return {pass:false, msg:"Xuân Diệu đang được đếm 1 sách – hãy dùng COUNT(b.id) thay vì COUNT(*)."};
          return {pass:false, msg:"demSachTheoTacGia() phải trả " + exp + " – đang ra " + s};
        }
        return {pass:true, msg:"JOIN dữ liệu nhiều bảng như chuyên gia! 🔗"};`
    }
  },
  {
    id: "api-database", level: "be-db", icon: "🧩", title: "Kết nối API với database", duration: 28, runtime: "node", exampleRequests: [{ method: "GET", url: "/api/contacts" }, { method: "GET", url: "/api/contacts?q=an" }, { method: "POST", url: "/api/contacts", body: { ten: "Chi", sdt: "0903" } }],
    requests: [
      { method: "GET", url: "/api/notes" }, { method: "POST", url: "/api/notes", body: { title: "Học SQL", content: "JOIN và GROUP BY" } },
      { method: "GET", url: "/api/notes/1" }, { method: "PUT", url: "/api/notes/1", body: { title: "Đã học SQL", content: "Xong!" } },
      { method: "DELETE", url: "/api/notes/1" }
    ],
    summary: "Ghép Express với SQLite: mỗi route REST thực hiện một câu SQL tương ứng, dữ liệu được lưu bền vững trong database.",
    content: [
      { h: "Mỗi route ↔ một câu SQL" },
      { code: "GET    /api/notes      →  SELECT * FROM notes ORDER BY id DESC\nGET    /api/notes/:id  →  SELECT * FROM notes WHERE id = ?\nPOST   /api/notes      →  INSERT INTO notes (title, content) VALUES (?, ?)\nPUT    /api/notes/:id  →  UPDATE notes SET title = ?, content = ? WHERE id = ?\nDELETE /api/notes/:id  →  DELETE FROM notes WHERE id = ?", lang: "http" },
      { h: "Khởi tạo database khi server chạy" },
      { code: "const Database = require('better-sqlite3');\nconst db = new Database('notes.db');\ndb.exec(`\n  CREATE TABLE IF NOT EXISTS notes (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    title TEXT NOT NULL,\n    content TEXT DEFAULT '',\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  )\n`);\n\n// Chuẩn bị câu lệnh một lần, dùng nhiều lần – nhanh hơn\nconst stmt = {\n  all: db.prepare('SELECT * FROM notes ORDER BY id DESC'),\n  get: db.prepare('SELECT * FROM notes WHERE id = ?'),\n  insert: db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)')\n};" },
      { h: "POST trả về dòng vừa tạo" },
      { code: "app.post('/api/notes', (req, res) => {\n  const { title, content = '' } = req.body;\n  if (!title) return res.status(400).json({ error: 'Thiếu title' });\n  const { lastInsertRowid } = stmt.insert.run(title, content);\n  res.status(201).json(stmt.get.get(lastInsertRowid));\n});" },
      { h: "Dùng changes để biết có tìm thấy hay không" },
      { code: "const { changes } = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);\nif (changes === 0) return res.status(404).json({ error: 'Không tìm thấy' });\nres.sendStatus(204);" },
      { h: "Transaction – tất cả hoặc không gì cả" },
      { code: "const chuyenTien = db.transaction((tu, den, soTien) => {\n  db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(soTien, tu);\n  db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(soTien, den);\n});\nchuyenTien(1, 2, 500000);   // lỗi giữa chừng → tự hoàn tác cả hai lệnh" },
      { tip: "Ở môi trường thật, database nằm trên ổ đĩa nên dữ liệu còn nguyên khi server khởi động lại. Trong app mô phỏng, database được tạo mới mỗi lần chạy lại code." }
    ],
    example: { js: "const express = require('express');\nconst Database = require('better-sqlite3');\nconst app = express();\napp.use(express.json());\n\nconst db = new Database(':memory:');\ndb.exec(`CREATE TABLE contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT NOT NULL, sdt TEXT);\n  INSERT INTO contacts (ten, sdt) VALUES ('An', '0901'), ('Bình', '0902');`);\n\napp.get('/api/contacts', (req, res) => {\n  const q = req.query.q || '';\n  res.json(db.prepare('SELECT * FROM contacts WHERE ten LIKE ? ORDER BY ten').all('%' + q + '%'));\n});\n\napp.post('/api/contacts', (req, res) => {\n  const r = db.prepare('INSERT INTO contacts (ten, sdt) VALUES (?, ?)').run(req.body.ten, req.body.sdt);\n  console.log('Đã thêm id', r.lastInsertRowid);\n  res.status(201).json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(r.lastInsertRowid));\n});\n\napp.listen(3000, () => console.log('Thử GET /api/contacts?q=an'));\n" },
    exercise: {
      task: "Xây API ghi chú `/api/notes` lưu trong SQLite. Bảng `notes(id, title, content, created_at)` đã tạo sẵn.\n• `GET /api/notes` → mảng ghi chú, **mới nhất trước** (id giảm dần).\n• `GET /api/notes/:id` → 200 | 404.\n• `POST /api/notes` `{ title, content }` → thiếu title: **400**; thành công: **201** + dòng vừa tạo (đọc lại từ DB).\n• `PUT /api/notes/:id` `{ title, content }` → cập nhật, trả 200 + dòng mới | 404 (dùng `changes`).\n• `DELETE /api/notes/:id` → **204** | 404.\nLỗi 404 trả `{ \"error\": \"Không tìm thấy\" }`.",
      starter: { js: "const express = require('express');\nconst Database = require('better-sqlite3');\nconst app = express();\napp.use(express.json());\n\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE IF NOT EXISTS notes (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    title TEXT NOT NULL,\n    content TEXT DEFAULT '',\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  )\n`);\n\n// Viết 5 route ở đây\n\napp.listen(3000);\n" },
      hint: "const layNote = id => db.prepare('SELECT * FROM notes WHERE id = ?').get(id); — PUT: const { changes } = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?').run(title, content ?? '', req.params.id);",
      solution: { js: "const express = require('express');\nconst Database = require('better-sqlite3');\nconst app = express();\napp.use(express.json());\n\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE IF NOT EXISTS notes (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    title TEXT NOT NULL,\n    content TEXT DEFAULT '',\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  )\n`);\n\nconst layNote = id => db.prepare('SELECT * FROM notes WHERE id = ?').get(id);\nconst khongThay = res => res.status(404).json({ error: 'Không tìm thấy' });\n\napp.get('/api/notes', (req, res) => {\n  res.json(db.prepare('SELECT * FROM notes ORDER BY id DESC').all());\n});\n\napp.get('/api/notes/:id', (req, res) => {\n  const note = layNote(req.params.id);\n  if (!note) return khongThay(res);\n  res.json(note);\n});\n\napp.post('/api/notes', (req, res) => {\n  const { title, content = '' } = req.body;\n  if (!title) return res.status(400).json({ error: 'Thiếu title' });\n  const { lastInsertRowid } = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);\n  res.status(201).json(layNote(lastInsertRowid));\n});\n\napp.put('/api/notes/:id', (req, res) => {\n  const { title, content = '' } = req.body;\n  if (!title) return res.status(400).json({ error: 'Thiếu title' });\n  const { changes } = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?').run(title, content, req.params.id);\n  if (changes === 0) return khongThay(res);\n  res.json(layNote(req.params.id));\n});\n\napp.delete('/api/notes/:id', (req, res) => {\n  const { changes } = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);\n  if (changes === 0) return khongThay(res);\n  res.sendStatus(204);\n});\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        const db = T.db();
        let r = await T.request("POST", "/api/notes", { body: { title: "Ghi chú 1", content: "Nội dung 1" } });
        if (r.status !== 201 || !r.body || r.body.title !== "Ghi chú 1" || typeof r.body.id !== "number") return {pass:false, msg:"POST /api/notes phải trả 201 + ghi chú vừa tạo (đang " + r.status + ")."};
        if (!r.body.created_at) return {pass:false, msg:"Response POST nên là dòng đọc lại từ DB (có created_at)."};
        const id1 = r.body.id;
        r = await T.request("POST", "/api/notes", { body: { title: "Ghi chú 2" } });
        const id2 = r.body && r.body.id;
        if (r.status !== 201 || r.body.content !== "") return {pass:false, msg:"Thiếu content thì mặc định là chuỗi rỗng."};
        if ((await T.request("POST", "/api/notes", { body: { content: "x" } })).status !== 400) return {pass:false, msg:"Thiếu title phải trả 400."};
        if (db.prepare("SELECT COUNT(*) AS c FROM notes").get().c !== 2) return {pass:false, msg:"Dữ liệu phải được lưu vào bảng notes trong database."};
        r = await T.request("GET", "/api/notes");
        if (!Array.isArray(r.body) || r.body.length !== 2 || r.body[0].id !== id2) return {pass:false, msg:"GET /api/notes phải trả 2 ghi chú, mới nhất trước (ORDER BY id DESC)."};
        r = await T.request("GET", "/api/notes/" + id1);
        if (r.status !== 200 || r.body.title !== "Ghi chú 1") return {pass:false, msg:"GET /api/notes/:id chưa đúng."};
        r = await T.request("PUT", "/api/notes/" + id1, { body: { title: "Đã sửa", content: "Mới" } });
        if (r.status !== 200 || !r.body || r.body.title !== "Đã sửa" || r.body.content !== "Mới") return {pass:false, msg:"PUT phải cập nhật và trả về dòng mới."};
        if (db.prepare("SELECT title FROM notes WHERE id = ?").get(id1).title !== "Đã sửa") return {pass:false, msg:"PUT chưa cập nhật vào database."};
        r = await T.request("PUT", "/api/notes/999", { body: { title: "x" } });
        if (r.status !== 404 || !r.body || r.body.error !== "Không tìm thấy") return {pass:false, msg:"PUT id không tồn tại → 404 { error: \\"Không tìm thấy\\" }."};
        r = await T.request("DELETE", "/api/notes/" + id1);
        if (r.status !== 204) return {pass:false, msg:"DELETE phải trả 204."};
        if ((await T.request("DELETE", "/api/notes/" + id1)).status !== 404) return {pass:false, msg:"Xoá lần hai phải trả 404."};
        if ((await T.request("GET", "/api/notes/" + id1)).status !== 404) return {pass:false, msg:"Ghi chú đã xoá phải trả 404."};
        if (db.prepare("SELECT COUNT(*) AS c FROM notes").get().c !== 1) return {pass:false, msg:"Sau khi xoá, bảng notes phải còn 1 dòng."};
        return {pass:true, msg:"API có database thật sự – back-end hoàn chỉnh đầu tiên! 🧩"};`
    }
  },

  /* ===================== CẤP 4: BẢO MẬT ===================== */
  {
    id: "password-hashing", level: "be-auth", icon: "🔑", title: "Đăng ký & đăng nhập: băm mật khẩu với bcrypt", duration: 25, runtime: "node", exampleRequests: [],
    requests: [
      { method: "POST", url: "/api/register", body: { email: "quang@example.com", password: "matkhau123" } },
      { method: "POST", url: "/api/login", body: { email: "quang@example.com", password: "matkhau123" } },
      { method: "POST", url: "/api/login", body: { email: "quang@example.com", password: "sai" }, label: "/api/login (sai mật khẩu)" },
      { method: "GET", url: "/api/debug/users", label: "/api/debug/users (xem DB)" }
    ],
    summary: "Không bao giờ lưu mật khẩu gốc. Băm (hash) bằng bcrypt khi đăng ký và so khớp hash khi đăng nhập.",
    content: [
      { h: "Vì sao không lưu mật khẩu gốc?" },
      { p: "Database có thể bị lộ (hack, nhân viên xấu, backup rơi rớt). Nếu lưu mật khẩu gốc, kẻ xấu đăng nhập được ngay – và người dùng thường dùng **cùng mật khẩu cho nhiều web**. Vì vậy ta chỉ lưu **hash**: chuỗi được biến đổi một chiều, không thể dịch ngược." },
      { h: "Hash ≠ mã hoá" },
      { list: [
        "**Mã hoá (encryption)**: hai chiều, có khoá là giải mã được → không dùng cho mật khẩu.",
        "**Hash**: một chiều. Đăng nhập = băm mật khẩu vừa nhập rồi so với hash đã lưu.",
        "**Salt**: chuỗi ngẫu nhiên trộn vào mật khẩu → hai người cùng mật khẩu vẫn có hash khác nhau.",
        "**bcrypt** cố tình *chậm* (tham số *cost/rounds*) để kẻ tấn công không thử được hàng tỷ mật khẩu mỗi giây."
      ] },
      { code: "const bcrypt = require('bcryptjs');   // npm install bcryptjs\n\n// Đăng ký\nconst hash = await bcrypt.hash('matkhau123', 10);   // 10 = cost\n// → '$2b$10$N9qo8uLOickgx2ZMRZoMye...' (60 ký tự, đã gồm salt)\n\n// Đăng nhập\nconst dung = await bcrypt.compare('matkhau123', hash);   // true / false" },
      { h: "Luồng đăng ký – đăng nhập an toàn" },
      { list: [
        "Kiểm tra dữ liệu (email hợp lệ, mật khẩu đủ dài).",
        "Email đã tồn tại → **409 Conflict**.",
        "Lưu `passwordHash`, **không bao giờ** trả hash/mật khẩu trong response.",
        "Đăng nhập sai → trả **cùng một thông báo** \"Email hoặc mật khẩu không đúng\" cho cả hai trường hợp (sai email / sai mật khẩu) để kẻ xấu không dò được email nào đã đăng ký."
      ] },
      { warn: "Không tự chế thuật toán, không dùng MD5/SHA-1/SHA-256 trần cho mật khẩu – chúng quá nhanh. Dùng **bcrypt** hoặc **argon2**." }
    ],
    example: { js: "const bcrypt = require('bcryptjs');\n\nasync function demo() {\n  const mk = 'matkhau123';\n  const h1 = await bcrypt.hash(mk, 10);\n  const h2 = await bcrypt.hash(mk, 10);\n  console.log('Hash 1:', h1);\n  console.log('Hash 2:', h2);\n  console.log('Hai hash khác nhau nhờ salt ngẫu nhiên:', h1 !== h2);\n  console.log('So khớp đúng:', await bcrypt.compare(mk, h1));\n  console.log('So khớp sai:', await bcrypt.compare('MatKhau123', h1));\n  console.log('Cost:', bcrypt.getRounds(h1));\n}\ndemo();\n" },
    exercise: {
      task: "Hoàn thiện 2 route (lưu user vào mảng `users` dạng `{ id, email, passwordHash }`):\n• `POST /api/register` `{ email, password }`: mật khẩu < 6 ký tự → **400**; email đã tồn tại → **409**; thành công → băm bằng `bcrypt.hash(password, 10)`, lưu, trả **201** `{ id, email }` (**không** trả hash).\n• `POST /api/login` `{ email, password }`: sai email hoặc sai mật khẩu → **401** `{ \"error\": \"Email hoặc mật khẩu không đúng\" }`; đúng → **200** `{ \"message\": \"Đăng nhập thành công\" }`.",
      starter: { js: "const express = require('express');\nconst bcrypt = require('bcryptjs');\nconst app = express();\napp.use(express.json());\n\nconst users = [];   // { id, email, passwordHash }\nlet nextId = 1;\n\napp.post('/api/register', async (req, res) => {\n  \n});\n\napp.post('/api/login', async (req, res) => {\n  \n});\n\n// Route xem dữ liệu (chỉ để học – KHÔNG làm vậy ở production)\napp.get('/api/debug/users', (req, res) => res.json(users));\n\napp.listen(3000);\n" },
      hint: "register: if (users.some(u => u.email === email)) return res.status(409)...; const passwordHash = await bcrypt.hash(password, 10); login: const user = users.find(...); if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401)...",
      solution: { js: "const express = require('express');\nconst bcrypt = require('bcryptjs');\nconst app = express();\napp.use(express.json());\n\nconst users = [];   // { id, email, passwordHash }\nlet nextId = 1;\n\napp.post('/api/register', async (req, res) => {\n  const { email, password } = req.body;\n  if (!email || typeof password !== 'string' || password.length < 6) {\n    return res.status(400).json({ error: 'Email bắt buộc, mật khẩu tối thiểu 6 ký tự' });\n  }\n  if (users.some(u => u.email === email)) {\n    return res.status(409).json({ error: 'Email đã được đăng ký' });\n  }\n  const passwordHash = await bcrypt.hash(password, 10);\n  const user = { id: nextId++, email, passwordHash };\n  users.push(user);\n  res.status(201).json({ id: user.id, email: user.email });\n});\n\napp.post('/api/login', async (req, res) => {\n  const { email, password } = req.body;\n  const user = users.find(u => u.email === email);\n  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {\n    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });\n  }\n  res.json({ message: 'Đăng nhập thành công' });\n});\n\napp.get('/api/debug/users', (req, res) => res.json(users));\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        let r = await T.request("POST", "/api/register", { body: { email: "a@x.com", password: "123" } });
        if (r.status !== 400) return {pass:false, msg:"Mật khẩu dưới 6 ký tự phải trả 400 (đang " + r.status + ")."};
        r = await T.request("POST", "/api/register", { body: { email: "a@x.com", password: "matkhau123" } });
        if (r.status !== 201 || !r.body || r.body.email !== "a@x.com" || typeof r.body.id !== "number") return {pass:false, msg:"Đăng ký hợp lệ phải trả 201 { id, email }."};
        if (r.text.includes("$2") || "passwordHash" in r.body || "password" in r.body) return {pass:false, msg:"Response đăng ký không được chứa mật khẩu hay hash!"};
        if (typeof users === "undefined" || !Array.isArray(users) || !users.length) return {pass:false, msg:"Cần lưu user vào mảng users."};
        const u = users.find(x => x.email === "a@x.com");
        if (!u || typeof u.passwordHash !== "string") return {pass:false, msg:"User lưu trong mảng cần trường passwordHash."};
        if (u.passwordHash === "matkhau123" || !u.passwordHash.startsWith("$2")) return {pass:false, msg:"passwordHash phải là chuỗi bcrypt (bắt đầu bằng $2...), không phải mật khẩu gốc."};
        if (JSON.stringify(users).includes("matkhau123")) return {pass:false, msg:"Không được lưu mật khẩu gốc ở bất kỳ đâu."};
        r = await T.request("POST", "/api/register", { body: { email: "a@x.com", password: "khac123456" } });
        if (r.status !== 409) return {pass:false, msg:"Email trùng phải trả 409 Conflict."};
        r = await T.request("POST", "/api/login", { body: { email: "a@x.com", password: "matkhau123" } });
        if (r.status !== 200 || !r.body || r.body.message !== "Đăng nhập thành công") return {pass:false, msg:"Đăng nhập đúng phải trả 200 { message: \\"Đăng nhập thành công\\" }."};
        r = await T.request("POST", "/api/login", { body: { email: "a@x.com", password: "sai-mat-khau" } });
        const r2 = await T.request("POST", "/api/login", { body: { email: "khong-co@x.com", password: "matkhau123" } });
        if (r.status !== 401 || r2.status !== 401) return {pass:false, msg:"Sai mật khẩu hoặc sai email đều phải trả 401."};
        if (!r.body || !r2.body || r.body.error !== "Email hoặc mật khẩu không đúng" || r2.body.error !== r.body.error) return {pass:false, msg:"Hai trường hợp phải trả CÙNG thông báo \\"Email hoặc mật khẩu không đúng\\"."};
        return {pass:true, msg:"Mật khẩu người dùng đã được bảo vệ đúng chuẩn! 🔑"};`
    }
  },
  {
    id: "jwt-auth", level: "be-auth", icon: "🎫", title: "Xác thực bằng JWT & phân quyền", duration: 28, runtime: "node", exampleRequests: [],
    env: { JWT_SECRET: "doi-chuoi-nay-o-production-3f9a" },
    requests: [
      { method: "POST", url: "/api/login", body: { email: "an@example.com", password: "123456" }, label: "/api/login (user)" },
      { method: "POST", url: "/api/login", body: { email: "admin@example.com", password: "admin123" }, label: "/api/login (admin)" },
      { method: "GET", url: "/api/profile", label: "/api/profile (chưa có token)" },
      { method: "GET", url: "/api/profile", headers: { Authorization: "Bearer <dán token vào đây>" }, label: "/api/profile (có token)" }
    ],
    summary: "Sau khi đăng nhập, server cấp một JWT có chữ ký. Client gửi kèm token ở mỗi request; middleware xác thực và phân quyền.",
    content: [
      { h: "HTTP không nhớ bạn là ai" },
      { p: "Mỗi request độc lập. Sau khi đăng nhập, server cần cách nhận ra bạn ở các request sau. Hai cách phổ biến: **session + cookie** (server lưu phiên) và **JWT** (token tự chứa thông tin, server chỉ cần kiểm tra chữ ký)." },
      { h: "Cấu trúc JWT" },
      { code: "eyJhbGciOiJIUzI1NiJ9 . eyJpZCI6MSwicm9sZSI6ImFkbWluIn0 . 4fK2x...\n      header           .            payload               . signature\n{\"alg\":\"HS256\"}           {\"id\":1,\"role\":\"admin\",\"exp\":...}    HMAC(header.payload, SECRET)", lang: "http" },
      { warn: "Payload chỉ được **mã hoá base64**, ai cũng đọc được (thử dán vào jwt.io). **Không** để mật khẩu hay thông tin nhạy cảm trong JWT. Chữ ký chỉ đảm bảo *không ai sửa được* nội dung." },
      { h: "Cấp và kiểm tra token" },
      { code: "const jwt = require('jsonwebtoken');\nconst SECRET = process.env.JWT_SECRET;\n\n// Khi đăng nhập thành công\nconst token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });\nres.json({ token });\n\n// Middleware xác thực\nfunction xacThuc(req, res, next) {\n  const header = req.headers.authorization || '';      // 'Bearer eyJ...'\n  const token = header.startsWith('Bearer ') ? header.slice(7) : null;\n  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });\n  try {\n    req.user = jwt.verify(token, SECRET);               // sai chữ ký / hết hạn → throw\n    next();\n  } catch (e) {\n    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });\n  }\n}" },
      { h: "Phân quyền (authorization)" },
      { code: "const chiAdmin = (req, res, next) =>\n  req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Không có quyền' });\n\napp.get('/api/admin/stats', xacThuc, chiAdmin, (req, res) => { /* ... */ });" },
      { tip: "Phía front-end: lưu token rồi gửi `fetch(url, { headers: { Authorization: 'Bearer ' + token } })`. Bảo mật hơn: server đặt token vào cookie `httpOnly` để JavaScript độc hại không đọc được." },
      { tip: "Thử trong API Tester: đăng nhập → copy giá trị `token` → chọn yêu cầu mẫu *(có token)* → thay `<dán token vào đây>` trong ô Header bằng token vừa copy → bấm Gửi." }
    ],
    example: { js: "const jwt = require('jsonwebtoken');\nconst SECRET = process.env.JWT_SECRET;\n\nconst token = jwt.sign({ id: 7, ten: 'Quảng', role: 'admin' }, SECRET, { expiresIn: '15m' });\nconsole.log('Token:', token);\n\nconst [h, p] = token.split('.');\nconsole.log('Header:', Buffer.from(h, 'base64url').toString());\nconsole.log('Payload (ai cũng đọc được!):', Buffer.from(p, 'base64url').toString());\n\nconsole.log('verify đúng secret:', jwt.verify(token, SECRET));\ntry {\n  jwt.verify(token, 'secret-sai');\n} catch (e) {\n  console.log('verify sai secret →', e.name + ':', e.message);\n}\n\nconst suaPayload = token.split('.');\nsuaPayload[1] = Buffer.from(JSON.stringify({ id: 7, role: 'superadmin' })).toString('base64url');\ntry { jwt.verify(suaPayload.join('.'), SECRET); } catch (e) { console.log('Sửa payload →', e.message); }\n" },
    exercise: {
      task: "Có sẵn 2 user (mật khẩu đã băm). Hoàn thiện:\n• `POST /api/login` → đúng: **200** `{ token }` với payload `{ id, email, role }`, ký bằng `process.env.JWT_SECRET`, `expiresIn: '1h'`; sai → **401**.\n• Middleware `xacThuc`: đọc header `Authorization: Bearer <token>`, `jwt.verify` → gán `req.user`; thiếu/sai token → **401**.\n• `GET /api/profile` (cần đăng nhập) → `{ id, email, role }` của người đang đăng nhập.\n• Middleware `chiAdmin` → không phải admin: **403**.\n• `GET /api/admin/stats` (đăng nhập + admin) → `{ \"totalUsers\": 2 }`.",
      starter: { js: "const express = require('express');\nconst bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');\nconst app = express();\napp.use(express.json());\n\nconst users = [\n  { id: 1, email: 'an@example.com', role: 'user', passwordHash: bcrypt.hashSync('123456', 10) },\n  { id: 2, email: 'admin@example.com', role: 'admin', passwordHash: bcrypt.hashSync('admin123', 10) }\n];\n\napp.post('/api/login', async (req, res) => {\n  \n});\n\nfunction xacThuc(req, res, next) {\n  \n}\n\nfunction chiAdmin(req, res, next) {\n  \n}\n\n// GET /api/profile\n\n// GET /api/admin/stats\n\napp.listen(3000);\n" },
      hint: "const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); — profile: const { id, email, role } = req.user; res.json({ id, email, role });",
      solution: { js: "const express = require('express');\nconst bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');\nconst app = express();\napp.use(express.json());\n\nconst users = [\n  { id: 1, email: 'an@example.com', role: 'user', passwordHash: bcrypt.hashSync('123456', 10) },\n  { id: 2, email: 'admin@example.com', role: 'admin', passwordHash: bcrypt.hashSync('admin123', 10) }\n];\nconst SECRET = process.env.JWT_SECRET;\n\napp.post('/api/login', async (req, res) => {\n  const { email, password } = req.body;\n  const user = users.find(u => u.email === email);\n  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {\n    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });\n  }\n  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '1h' });\n  res.json({ token });\n});\n\nfunction xacThuc(req, res, next) {\n  const header = req.headers.authorization || '';\n  const token = header.startsWith('Bearer ') ? header.slice(7) : null;\n  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch (e) {\n    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });\n  }\n}\n\nfunction chiAdmin(req, res, next) {\n  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Không có quyền' });\n  next();\n}\n\napp.get('/api/profile', xacThuc, (req, res) => {\n  const { id, email, role } = req.user;\n  res.json({ id, email, role });\n});\n\napp.get('/api/admin/stats', xacThuc, chiAdmin, (req, res) => {\n  res.json({ totalUsers: users.length });\n});\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        const jwt = require("jsonwebtoken");
        let r = await T.request("POST", "/api/login", { body: { email: "an@example.com", password: "sai" } });
        if (r.status !== 401) return {pass:false, msg:"Sai mật khẩu phải trả 401."};
        r = await T.request("POST", "/api/login", { body: { email: "an@example.com", password: "123456" } });
        if (r.status !== 200 || !r.body || typeof r.body.token !== "string") return {pass:false, msg:"Đăng nhập đúng phải trả 200 { token }."};
        const userToken = r.body.token;
        let payload; try { payload = jwt.verify(userToken, process.env.JWT_SECRET); } catch (e) { return {pass:false, msg:"Token phải được ký bằng process.env.JWT_SECRET (" + e.message + ")."}; }
        if (payload.id !== 1 || payload.email !== "an@example.com" || payload.role !== "user") return {pass:false, msg:"Payload token cần { id, email, role }."};
        if (!payload.exp || payload.exp - payload.iat !== 3600) return {pass:false, msg:"Token cần expiresIn: '1h'."};
        if ("passwordHash" in payload) return {pass:false, msg:"Không đưa passwordHash vào JWT!"};
        r = await T.request("GET", "/api/profile");
        if (r.status !== 401) return {pass:false, msg:"/api/profile không có token phải trả 401 (đang " + r.status + ")."};
        r = await T.request("GET", "/api/profile", { headers: { Authorization: "Bearer abc.def.ghi" } });
        if (r.status !== 401) return {pass:false, msg:"Token giả phải trả 401."};
        const fake = jwt.sign({ id: 2, email: "admin@example.com", role: "admin" }, "secret-cua-hacker");
        if ((await T.request("GET", "/api/admin/stats", { headers: { Authorization: "Bearer " + fake } })).status !== 401) return {pass:false, msg:"Token ký bằng secret khác phải bị từ chối (401)."};
        r = await T.request("GET", "/api/profile", { headers: { Authorization: "Bearer " + userToken } });
        if (r.status !== 200 || !r.body || r.body.email !== "an@example.com" || r.body.role !== "user" || r.body.id !== 1) return {pass:false, msg:"/api/profile với token hợp lệ phải trả { id, email, role }."};
        r = await T.request("GET", "/api/admin/stats", { headers: { Authorization: "Bearer " + userToken } });
        if (r.status !== 403) return {pass:false, msg:"User thường vào /api/admin/stats phải nhận 403 (đang " + r.status + ")."};
        const a = await T.request("POST", "/api/login", { body: { email: "admin@example.com", password: "admin123" } });
        r = await T.request("GET", "/api/admin/stats", { headers: { Authorization: "Bearer " + (a.body && a.body.token) } });
        if (r.status !== 200 || !r.body || r.body.totalUsers !== 2) return {pass:false, msg:"Admin vào /api/admin/stats phải nhận { totalUsers: 2 }."};
        return {pass:true, msg:"Hệ thống đăng nhập + phân quyền hoạt động hoàn hảo! 🎫"};`
    }
  },
  {
    id: "api-security", level: "be-auth", icon: "🛡️", title: "Bảo mật API: SQL injection, CORS, rate limit", duration: 28, runtime: "node", exampleRequests: [],
    requests: [
      { method: "GET", url: "/api/products/search?q=bút", label: "/search?q=bút" },
      { method: "GET", url: "/api/products/search?q=' OR '1'='1", label: "/search (tấn công SQL injection)" },
      { method: "GET", url: "/api/ping" }
    ],
    summary: "Những lỗ hổng phổ biến nhất của back-end và cách chặn: SQL injection, CORS, giới hạn tần suất request và header bảo mật.",
    content: [
      { h: "1. SQL injection – lỗ hổng kinh điển" },
      { p: "Khi bạn **nối chuỗi** dữ liệu người dùng vào câu SQL, kẻ tấn công có thể chèn thêm lệnh SQL của họ:" },
      { code: "// ❌ NGUY HIỂM\nconst sql = `SELECT * FROM products WHERE ten LIKE '%${q}%'`;\n// q = \"' OR '1'='1\"  →  ... WHERE ten LIKE '%' OR '1'='1%'  → trả về TẤT CẢ\n// q = \"'; DROP TABLE users; --\" → có thể xoá cả bảng!\n\n// ✅ AN TOÀN: prepared statement – dữ liệu không bao giờ bị hiểu là lệnh SQL\ndb.prepare('SELECT * FROM products WHERE ten LIKE ?').all('%' + q + '%');" },
      { h: "2. CORS – ai được gọi API từ trình duyệt?" },
      { p: "Mặc định trình duyệt **chặn** trang web ở tên miền A gọi API ở tên miền B (chính sách *same-origin*). Server B phải trả header `Access-Control-Allow-Origin` để cho phép. Chỉ mở cho đúng tên miền front-end của bạn, đừng mở `*` cho API có đăng nhập." },
      { code: "const cors = require('cors');\napp.use(cors({ origin: 'https://automationdq.github.io' }));" },
      { h: "3. Rate limiting – chống spam và dò mật khẩu" },
      { code: "// Tự viết: tối đa 5 request / phút / IP\nconst luot = new Map();   // ip -> { count, start }\nfunction gioiHan(req, res, next) {\n  const now = Date.now();\n  const e = luot.get(req.ip) || { count: 0, start: now };\n  if (now - e.start > 60000) { e.count = 0; e.start = now; }\n  e.count++;\n  luot.set(req.ip, e);\n  if (e.count > 5) {\n    res.set('Retry-After', String(Math.ceil((e.start + 60000 - now) / 1000)));\n    return res.status(429).json({ error: 'Quá nhiều yêu cầu, thử lại sau' });\n  }\n  next();\n}\n// Thực tế dùng thư viện express-rate-limit (và Redis khi có nhiều server)" },
      { h: "4. Header bảo mật" },
      { code: "app.disable('x-powered-by');   // không quảng cáo server dùng Express\napp.use((req, res, next) => {\n  res.set('X-Content-Type-Options', 'nosniff');   // không đoán kiểu file\n  res.set('X-Frame-Options', 'DENY');             // chống nhúng trang vào iframe (clickjacking)\n  next();\n});\n// Thực tế: npm install helmet → app.use(helmet())" },
      { h: "Checklist bảo mật tối thiểu" },
      { list: [
        "Luôn dùng prepared statement / ORM, không nối chuỗi SQL.",
        "Validate mọi input; giới hạn kích thước body: `express.json({ limit: '100kb' })`.",
        "Băm mật khẩu (bcrypt), dùng HTTPS, bí mật để trong biến môi trường.",
        "CORS đúng tên miền, rate limit cho route đăng nhập/đăng ký.",
        "Không trả chi tiết lỗi 500 cho client; cập nhật thư viện thường xuyên (`npm audit`)."
      ] }
    ],
    example: { js: "const Database = require('better-sqlite3');\nconst db = new Database(':memory:');\ndb.exec(`CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, role TEXT);\n  INSERT INTO users VALUES (1, 'an@x.com', 'user'), (2, 'admin@x.com', 'admin');`);\n\nconst dauVaoXau = \"x' OR '1'='1\";\n\nconst sqlNoiChuoi = \"SELECT * FROM users WHERE email = '\" + dauVaoXau + \"'\";\nconsole.log('Câu SQL nối chuỗi:', sqlNoiChuoi);\nconsole.log('❌ Kết quả (lộ hết user):', db.prepare(sqlNoiChuoi).all());\n\nconsole.log('✅ Prepared statement:', db.prepare('SELECT * FROM users WHERE email = ?').all(dauVaoXau));\n" },
    exercise: {
      task: "Server này có nhiều lỗ hổng. Hãy sửa:\n1) Route `/api/products/search` đang **nối chuỗi** SQL → đổi sang prepared statement với `?`.\n2) Tắt header `x-powered-by` và thêm 2 header: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` cho mọi response.\n3) Bật CORS chỉ cho origin `https://automationdq.github.io`.\n4) Middleware giới hạn **tối đa 5 request/phút/IP** cho mọi route `/api` – request thứ 6 trả **429** kèm header `Retry-After`.",
      starter: { js: "const express = require('express');\nconst cors = require('cors');\nconst Database = require('better-sqlite3');\nconst app = express();\n\nconst db = new Database(':memory:');\ndb.exec(`CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT, gia INTEGER);\n  INSERT INTO products (ten, gia) VALUES ('Bút bi', 5000), ('Bút chì', 3000), ('Vở', 12000), ('Balo', 350000);`);\n\n// TODO 2: header bảo mật + tắt x-powered-by\n\n// TODO 3: CORS\n\n// TODO 4: rate limit 5 request / phút / IP cho /api\n\napp.get('/api/products/search', (req, res) => {\n  const q = req.query.q || '';\n  // TODO 1: lỗ hổng SQL injection!\n  const rows = db.prepare(`SELECT * FROM products WHERE ten LIKE '%${q}%'`).all();\n  res.json(rows);\n});\n\napp.get('/api/ping', (req, res) => res.json({ ok: true }));\n\napp.listen(3000);\n" },
      hint: "app.disable('x-powered-by'); app.use(cors({ origin: 'https://automationdq.github.io' })); app.use('/api', gioiHan); — search: db.prepare('SELECT * FROM products WHERE ten LIKE ?').all('%' + q + '%')",
      solution: { js: "const express = require('express');\nconst cors = require('cors');\nconst Database = require('better-sqlite3');\nconst app = express();\n\nconst db = new Database(':memory:');\ndb.exec(`CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, ten TEXT, gia INTEGER);\n  INSERT INTO products (ten, gia) VALUES ('Bút bi', 5000), ('Bút chì', 3000), ('Vở', 12000), ('Balo', 350000);`);\n\n// 2) Header bảo mật\napp.disable('x-powered-by');\napp.use((req, res, next) => {\n  res.set('X-Content-Type-Options', 'nosniff');\n  res.set('X-Frame-Options', 'DENY');\n  next();\n});\n\n// 3) CORS đúng tên miền\napp.use(cors({ origin: 'https://automationdq.github.io' }));\n\n// 4) Rate limit\nconst GIOI_HAN = 5, CUA_SO = 60 * 1000;\nconst luot = new Map();\nfunction gioiHanTocDo(req, res, next) {\n  const now = Date.now();\n  const e = luot.get(req.ip) || { count: 0, start: now };\n  if (now - e.start > CUA_SO) { e.count = 0; e.start = now; }\n  e.count++;\n  luot.set(req.ip, e);\n  if (e.count > GIOI_HAN) {\n    res.set('Retry-After', String(Math.ceil((e.start + CUA_SO - now) / 1000)));\n    return res.status(429).json({ error: 'Quá nhiều yêu cầu, thử lại sau' });\n  }\n  next();\n}\napp.use('/api', gioiHanTocDo);\n\n// 1) Prepared statement\napp.get('/api/products/search', (req, res) => {\n  const q = req.query.q || '';\n  const rows = db.prepare('SELECT * FROM products WHERE ten LIKE ?').all('%' + q + '%');\n  res.json(rows);\n});\n\napp.get('/api/ping', (req, res) => res.json({ ok: true }));\n\napp.listen(3000);\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy (xem Terminal có lỗi không)."};
        if (/prepare\\(\\s*\`[^\`]*\\$\\{/.test(T.src) || /prepare\\([^)]*['"]\\s*\\+\\s*q/.test(T.src)) return {pass:false, msg:"Vẫn còn nối chuỗi/biến vào câu SQL trong prepare(...). Dùng dấu ? và truyền giá trị vào .all()."};
        let r = await T.request("GET", "/api/products/search?q=" + encodeURIComponent("bút"), { headers: { Origin: "https://automationdq.github.io" } });
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.length !== 2) return {pass:false, msg:"Tìm \\"bút\\" phải trả 2 sản phẩm (đang " + r.status + ": " + r.text + ")."};
        if ("x-powered-by" in r.headers) return {pass:false, msg:"Header x-powered-by vẫn còn – dùng app.disable('x-powered-by')."};
        if (r.headers["x-content-type-options"] !== "nosniff" || r.headers["x-frame-options"] !== "DENY") return {pass:false, msg:"Thiếu header X-Content-Type-Options: nosniff hoặc X-Frame-Options: DENY."};
        if (r.headers["access-control-allow-origin"] !== "https://automationdq.github.io") return {pass:false, msg:"Access-Control-Allow-Origin phải đúng là https://automationdq.github.io (đang: " + r.headers["access-control-allow-origin"] + ")."};
        r = await T.request("GET", "/api/products/search?q=" + encodeURIComponent("' OR '1'='1"));
        if (r.status !== 200 || !Array.isArray(r.body) || r.body.length !== 0) return {pass:false, msg:"Chuỗi tấn công ' OR '1'='1 phải trả mảng rỗng – SQL injection chưa được chặn!"};
        for (let i = 0; i < 3; i++) { r = await T.request("GET", "/api/ping"); if (r.status !== 200) return {pass:false, msg:"Request thứ " + (i + 3) + " trong phút phải vẫn thành công (giới hạn là 5)."}; }
        r = await T.request("GET", "/api/ping");
        if (r.status !== 429) return {pass:false, msg:"Request thứ 6 trong 1 phút phải trả 429 (đang " + r.status + ")."};
        if (!r.headers["retry-after"] || isNaN(+r.headers["retry-after"])) return {pass:false, msg:"Response 429 cần header Retry-After (số giây)."};
        return {pass:true, msg:"API đã được gia cố 4 lớp bảo vệ! 🛡️"};`
    }
  },

  /* ===================== CẤP 5: TRIỂN KHAI ===================== */
  {
    id: "env-config", level: "be-deploy", icon: "⚙️", title: "Biến môi trường, cấu hình & deploy lên cloud", duration: 25, runtime: "node", exampleRequests: [],
    files: { ".env": "# Cấu hình môi trường – KHÔNG commit file này lên Git\nPORT=8080\nNODE_ENV=production\nJWT_SECRET=chuoi-bi-mat-rat-dai-va-ngau-nhien\nDATABASE_URL=file:./data/app.db\n" },
    requests: [{ method: "GET", url: "/health" }, { method: "GET", url: "/api/config", label: "/api/config (thử xem có lộ bí mật?)" }],
    summary: "Tách cấu hình khỏi code bằng biến môi trường, tổ chức dự án gọn gàng, thêm health check và đưa API lên cloud.",
    content: [
      { h: "12-Factor App: cấu hình nằm ngoài code" },
      { p: "Cổng, chuỗi kết nối database, khoá bí mật… **khác nhau** giữa máy bạn, server test và production. Đặt chúng trong **biến môi trường** – code giữ nguyên, chỉ đổi cấu hình. Khi phát triển, dùng file `.env` + thư viện **dotenv**." },
      { code: "# .env  (thêm vào .gitignore!)\nPORT=8080\nNODE_ENV=production\nJWT_SECRET=chuoi-bi-mat-rat-dai\n\n# .env.example  (commit file này – chỉ có tên biến, không có giá trị thật)\nPORT=\nJWT_SECRET=", lang: "bash" },
      { code: "require('dotenv').config();      // nạp .env vào process.env (đặt ở dòng đầu tiên)\n\nconst config = {\n  port: Number(process.env.PORT) || 3000,\n  env: process.env.NODE_ENV || 'development',\n  jwtSecret: process.env.JWT_SECRET\n};\nif (!config.jwtSecret) throw new Error('Thiếu biến môi trường JWT_SECRET');   // fail fast" },
      { tip: "Node 20.6+ có sẵn cờ `node --env-file=.env server.js`, không cần cài dotenv." },
      { h: "Cấu trúc dự án khi code lớn dần" },
      { code: "src/\n├── config.js          # đọc biến môi trường\n├── app.js             # tạo app Express, gắn middleware + routes\n├── server.js          # app.listen(...)\n├── routes/            # định nghĩa URL → controller\n├── controllers/       # nhận req, trả res\n├── services/          # logic nghiệp vụ\n├── db/                # kết nối & truy vấn database\n└── middlewares/       # auth, error handler, rate limit…", lang: "bash" },
      { h: "Health check & logging" },
      { code: "app.get('/health', (req, res) => {\n  res.json({ status: 'ok', env: config.env, uptime: process.uptime() });\n});\n// Nền tảng cloud gọi /health định kỳ; không trả 200 → tự khởi động lại server." },
      { h: "Deploy lên cloud (Render / Railway / Fly.io)" },
      { list: [
        "Đẩy code lên **GitHub** (nhớ `.gitignore` có `node_modules` và `.env`).",
        "Tạo *Web Service* mới trên nền tảng, kết nối repo.",
        "Build command: `npm install` · Start command: `npm start` (`node src/server.js`).",
        "Khai báo biến môi trường (`JWT_SECRET`, `DATABASE_URL`…) trong trang cài đặt – **không** đưa lên Git.",
        "Server phải lắng nghe `process.env.PORT` vì nền tảng tự cấp cổng.",
        "Database production nên dùng dịch vụ riêng (PostgreSQL managed) thay vì file SQLite trên server tạm."
      ] },
      { warn: "Đừng bao giờ tạo route trả về `process.env` hay giá trị bí mật – kể cả để \"debug tạm\"." }
    ],
    example: { js: "require('dotenv').config();\nconsole.log('Các file:', require('fs').readdirSync('.'));\nconsole.log('PORT =', process.env.PORT);\nconsole.log('NODE_ENV =', process.env.NODE_ENV);\nconsole.log('JWT_SECRET đã có?', Boolean(process.env.JWT_SECRET));\nconsole.log('Biến không tồn tại =', process.env.KHONG_CO);\n\nconst port = Number(process.env.PORT) || 3000;\nconsole.log('Server sẽ chạy cổng', port, '(kiểu ' + typeof port + ')');\n" },
    exercise: {
      task: "File `.env` đã có sẵn. Hãy:\n1) Nạp `.env` bằng `require('dotenv').config()`.\n2) Tạo object `config` = `{ port, env, jwtSecret }` với `port` là **số** (mặc định 3000), `env` mặc định `\"development\"`.\n3) Viết hàm `kiemTraCauHinh(cfg)` **ném lỗi** nếu thiếu `cfg.jwtSecret`; gọi nó với `config`.\n4) `GET /health` → `{ status: \"ok\", env, uptime }`.\n5) `GET /api/config` → chỉ trả `{ env, port }` – **không lộ** JWT_SECRET.\n6) `app.listen(config.port)`.",
      starter: { js: "const express = require('express');\n// 1) nạp .env\n\nconst app = express();\n\n// 2) config\nconst config = {\n  \n};\n\n// 3) kiểm tra cấu hình\nfunction kiemTraCauHinh(cfg) {\n  \n}\nkiemTraCauHinh(config);\n\n// 4) /health\n\n// 5) /api/config\n\n// 6) listen\n" },
      hint: "port: Number(process.env.PORT) || 3000, env: process.env.NODE_ENV || 'development', jwtSecret: process.env.JWT_SECRET — if (!cfg.jwtSecret) throw new Error('Thiếu JWT_SECRET');",
      solution: { js: "const express = require('express');\nrequire('dotenv').config();\n\nconst app = express();\n\nconst config = {\n  port: Number(process.env.PORT) || 3000,\n  env: process.env.NODE_ENV || 'development',\n  jwtSecret: process.env.JWT_SECRET\n};\n\nfunction kiemTraCauHinh(cfg) {\n  if (!cfg.jwtSecret) throw new Error('Thiếu biến môi trường JWT_SECRET');\n}\nkiemTraCauHinh(config);\n\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok', env: config.env, uptime: process.uptime() });\n});\n\napp.get('/api/config', (req, res) => {\n  res.json({ env: config.env, port: config.port });\n});\n\napp.listen(config.port, () => console.log(`[${config.env}] Server chạy cổng ${config.port}`));\n" },
      check: `
        if (typeof config === "undefined") return {pass:false, msg:"Chưa có object config."};
        if (process.env.PORT !== "8080") return {pass:false, msg:"Chưa nạp file .env – thêm require('dotenv').config() ở đầu file."};
        if (config.port !== 8080) return {pass:false, msg:"config.port phải là SỐ 8080 (đang " + JSON.stringify(config.port) + ") – dùng Number(process.env.PORT)."};
        if (config.env !== "production") return {pass:false, msg:"config.env phải lấy từ NODE_ENV (production)."};
        if (config.jwtSecret !== process.env.JWT_SECRET) return {pass:false, msg:"config.jwtSecret phải lấy từ process.env.JWT_SECRET."};
        if (typeof kiemTraCauHinh !== "function") return {pass:false, msg:"Thiếu hàm kiemTraCauHinh."};
        let threw = false; try { kiemTraCauHinh({ port: 1, env: "x" }); } catch (e) { threw = true; }
        if (!threw) return {pass:false, msg:"kiemTraCauHinh phải throw Error khi thiếu jwtSecret."};
        try { kiemTraCauHinh(config); } catch (e) { return {pass:false, msg:"kiemTraCauHinh không được lỗi khi đủ cấu hình."}; }
        if (!__node.server || __node.server.port !== 8080) return {pass:false, msg:"Server phải lắng nghe config.port (8080)."};
        let r = await T.request("GET", "/health");
        if (r.status !== 200 || !r.body || r.body.status !== "ok" || r.body.env !== "production" || typeof r.body.uptime !== "number") return {pass:false, msg:"GET /health phải trả { status: \\"ok\\", env: \\"production\\", uptime: <số> }."};
        r = await T.request("GET", "/api/config");
        if (r.status !== 200 || !r.body || r.body.env !== "production" || r.body.port !== 8080) return {pass:false, msg:"GET /api/config phải trả { env, port }."};
        if (r.text.includes(process.env.JWT_SECRET) || "jwtSecret" in r.body) return {pass:false, msg:"/api/config đang LỘ JWT_SECRET! Chỉ trả env và port."};
        return {pass:true, msg:"Cấu hình chuẩn production – sẵn sàng deploy! ⚙️"};`
    }
  },
  {
    id: "final-blog-api", level: "be-deploy", icon: "🏆", title: "Dự án cuối: Blog API full-stack", duration: 45, runtime: "node", exampleRequests: [{ method: "GET", url: "/" }],
    env: { JWT_SECRET: "blog-secret-key-2026" },
    requests: [
      { method: "POST", url: "/api/register", body: { email: "quang@example.com", password: "matkhau123" } },
      { method: "POST", url: "/api/login", body: { email: "quang@example.com", password: "matkhau123" } },
      { method: "POST", url: "/api/posts", body: { title: "Bài viết đầu tiên", content: "Xin chào!" }, headers: { Authorization: "Bearer <token>" }, label: "/api/posts (tạo – cần token)" },
      { method: "GET", url: "/api/posts?page=1&limit=5" }
    ],
    summary: "Tổng hợp cả khoá: Express + SQLite + bcrypt + JWT + validation + phân quyền theo chủ sở hữu + phân trang.",
    content: [
      { h: "Mục tiêu" },
      { p: "Xây back-end cho một blog: người dùng **đăng ký/đăng nhập**, **viết – sửa – xoá bài** của chính mình, ai cũng **xem danh sách** (có phân trang, kèm email tác giả). Đây là khung sườn của hầu hết ứng dụng web thực tế." },
      { h: "Thiết kế database" },
      { code: "users(id, email UNIQUE, password_hash, created_at)\nposts(id, user_id → users.id, title, content, created_at)", lang: "http" },
      { h: "Thiết kế API" },
      { code: "POST   /api/register        {email, password}        → 201 {id, email} | 400 | 409\nPOST   /api/login           {email, password}        → 200 {token}     | 401\nGET    /api/posts?page&limit                         → 200 {data, page, limit, total}\nPOST   /api/posts      🔒   {title, content}         → 201 post        | 400 | 401\nPUT    /api/posts/:id  🔒👤 {title, content}         → 200 post        | 403 | 404\nDELETE /api/posts/:id  🔒👤                          → 204             | 403 | 404\n\n🔒 cần token   👤 chỉ tác giả của bài", lang: "http" },
      { h: "Phân quyền theo chủ sở hữu" },
      { code: "const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);\nif (!post) return res.status(404).json({ error: 'Không tìm thấy bài viết' });\nif (post.user_id !== req.user.id) return res.status(403).json({ error: 'Bạn không phải tác giả' });" },
      { h: "Phân trang trả kèm thông tin" },
      { code: "const page = Math.max(1, parseInt(req.query.page) || 1);\nconst limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));\nconst data = db.prepare(`SELECT p.id, p.title, p.content, p.created_at, u.email AS author\n  FROM posts p JOIN users u ON u.id = p.user_id\n  ORDER BY p.id DESC LIMIT ? OFFSET ?`).all(limit, (page - 1) * limit);\nconst { total } = db.prepare('SELECT COUNT(*) AS total FROM posts').get();\nres.json({ data, page, limit, total });" },
      { tip: "Hoàn thành bài này, bạn có thể ghép với front-end (khoá 1 & 2): dùng `fetch` gọi API, lưu token, hiển thị danh sách bài viết… là có ngay một ứng dụng full-stack!" }
    ],
    example: { js: "// Gợi ý cấu trúc – xem phần Bài tập để làm hoàn chỉnh\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\nconst routes = [\n  'POST   /api/register',\n  'POST   /api/login',\n  'GET    /api/posts?page=1&limit=10',\n  'POST   /api/posts        (cần token)',\n  'PUT    /api/posts/:id    (cần token + là tác giả)',\n  'DELETE /api/posts/:id    (cần token + là tác giả)'\n];\napp.get('/', (req, res) => res.json({ name: 'Blog API', routes }));\napp.listen(3000, () => console.log('📝 Blog API – bấm Gửi GET / để xem danh sách route'));\n" },
    exercise: {
      task: "Hoàn thiện Blog API theo thiết kế ở phần bài học (database đã tạo sẵn):\n• `POST /api/register` – email hợp lệ & mật khẩu ≥ 6 ký tự (400), email trùng (409), băm bcrypt, trả **201** `{ id, email }`.\n• `POST /api/login` – trả `{ token }` (payload `{ id, email }`, hết hạn 1h) | 401.\n• `GET /api/posts?page=&limit=` – mới nhất trước, mỗi bài có `author` (email), trả `{ data, page, limit, total }` (mặc định page 1, limit 10).\n• `POST /api/posts` 🔒 – thiếu title → 400; tạo xong **201** + bài viết.\n• `PUT /api/posts/:id` 🔒👤 và `DELETE /api/posts/:id` 🔒👤 – không tồn tại 404, không phải tác giả **403**, xoá thành công **204**.",
      starter: { js: "const express = require('express');\nconst Database = require('better-sqlite3');\nconst bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');\n\nconst app = express();\napp.use(express.json());\nconst SECRET = process.env.JWT_SECRET;\n\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    email TEXT UNIQUE NOT NULL,\n    password_hash TEXT NOT NULL,\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  );\n  CREATE TABLE posts (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    user_id INTEGER NOT NULL REFERENCES users(id),\n    title TEXT NOT NULL,\n    content TEXT DEFAULT '',\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  );\n`);\n\n// Middleware xác thực\nfunction xacThuc(req, res, next) {\n  \n}\n\n// POST /api/register\n\n// POST /api/login\n\n// GET /api/posts\n\n// POST /api/posts (xacThuc)\n\n// PUT /api/posts/:id (xacThuc + kiểm tra tác giả)\n\n// DELETE /api/posts/:id (xacThuc + kiểm tra tác giả)\n\n// Middleware lỗi\napp.use((err, req, res, next) => {\n  console.error(err.message);\n  res.status(err.status || 500).json({ error: err.status ? err.message : 'Lỗi máy chủ' });\n});\n\napp.listen(3000, () => console.log('📝 Blog API sẵn sàng'));\n" },
      hint: "Viết hàm layBaiCuaToi(req, res) dùng chung cho PUT/DELETE: tìm bài → 404; post.user_id !== req.user.id → 403. Danh sách: JOIN users để lấy u.email AS author, ORDER BY p.id DESC LIMIT ? OFFSET ?.",
      solution: { js: "const express = require('express');\nconst Database = require('better-sqlite3');\nconst bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');\n\nconst app = express();\napp.use(express.json());\nconst SECRET = process.env.JWT_SECRET;\n\nconst db = new Database(':memory:');\ndb.exec(`\n  CREATE TABLE users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    email TEXT UNIQUE NOT NULL,\n    password_hash TEXT NOT NULL,\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  );\n  CREATE TABLE posts (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    user_id INTEGER NOT NULL REFERENCES users(id),\n    title TEXT NOT NULL,\n    content TEXT DEFAULT '',\n    created_at TEXT DEFAULT CURRENT_TIMESTAMP\n  );\n`);\n\nconst EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nconst layPost = id => db.prepare(`\n  SELECT p.id, p.user_id, p.title, p.content, p.created_at, u.email AS author\n  FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?`).get(id);\n\nfunction xacThuc(req, res, next) {\n  const header = req.headers.authorization || '';\n  const token = header.startsWith('Bearer ') ? header.slice(7) : null;\n  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch (e) {\n    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });\n  }\n}\n\nfunction layBaiCuaToi(req, res) {\n  const post = layPost(req.params.id);\n  if (!post) { res.status(404).json({ error: 'Không tìm thấy bài viết' }); return null; }\n  if (post.user_id !== req.user.id) { res.status(403).json({ error: 'Bạn không phải tác giả' }); return null; }\n  return post;\n}\n\napp.post('/api/register', async (req, res) => {\n  const { email, password } = req.body;\n  if (!EMAIL_RE.test(email || '') || typeof password !== 'string' || password.length < 6) {\n    return res.status(400).json({ error: 'Email không hợp lệ hoặc mật khẩu dưới 6 ký tự' });\n  }\n  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {\n    return res.status(409).json({ error: 'Email đã được đăng ký' });\n  }\n  const hash = await bcrypt.hash(password, 10);\n  const { lastInsertRowid } = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);\n  res.status(201).json({ id: lastInsertRowid, email });\n});\n\napp.post('/api/login', async (req, res) => {\n  const { email, password } = req.body;\n  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);\n  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {\n    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });\n  }\n  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });\n  res.json({ token });\n});\n\napp.get('/api/posts', (req, res) => {\n  const page = Math.max(1, parseInt(req.query.page) || 1);\n  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));\n  const data = db.prepare(`\n    SELECT p.id, p.title, p.content, p.created_at, u.email AS author\n    FROM posts p JOIN users u ON u.id = p.user_id\n    ORDER BY p.id DESC LIMIT ? OFFSET ?`).all(limit, (page - 1) * limit);\n  const { total } = db.prepare('SELECT COUNT(*) AS total FROM posts').get();\n  res.json({ data, page, limit, total });\n});\n\napp.post('/api/posts', xacThuc, (req, res) => {\n  const { title, content = '' } = req.body;\n  if (!title || !String(title).trim()) return res.status(400).json({ error: 'Thiếu title' });\n  const { lastInsertRowid } = db.prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)').run(req.user.id, String(title).trim(), content);\n  res.status(201).json(layPost(lastInsertRowid));\n});\n\napp.put('/api/posts/:id', xacThuc, (req, res) => {\n  const post = layBaiCuaToi(req, res);\n  if (!post) return;\n  const { title = post.title, content = post.content } = req.body;\n  if (!String(title).trim()) return res.status(400).json({ error: 'Thiếu title' });\n  db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?').run(title, content, post.id);\n  res.json(layPost(post.id));\n});\n\napp.delete('/api/posts/:id', xacThuc, (req, res) => {\n  const post = layBaiCuaToi(req, res);\n  if (!post) return;\n  db.prepare('DELETE FROM posts WHERE id = ?').run(post.id);\n  res.sendStatus(204);\n});\n\napp.use((err, req, res, next) => {\n  console.error(err.message);\n  res.status(err.status || 500).json({ error: err.status ? err.message : 'Lỗi máy chủ' });\n});\n\napp.listen(3000, () => console.log('📝 Blog API sẵn sàng'));\n" },
      check: `
        if (!T.server()) return {pass:false, msg:"Server chưa chạy."};
        const db = T.db(); const jwt = require("jsonwebtoken");
        const auth = t => ({ Authorization: "Bearer " + t });
        let r = await T.request("POST", "/api/register", { body: { email: "khong-hop-le", password: "matkhau123" } });
        if (r.status !== 400) return {pass:false, msg:"Đăng ký với email sai định dạng phải trả 400."};
        if ((await T.request("POST", "/api/register", { body: { email: "a@blog.vn", password: "123" } })).status !== 400) return {pass:false, msg:"Mật khẩu dưới 6 ký tự phải trả 400."};
        r = await T.request("POST", "/api/register", { body: { email: "a@blog.vn", password: "matkhau123" } });
        if (r.status !== 201 || !r.body || r.body.email !== "a@blog.vn") return {pass:false, msg:"Đăng ký hợp lệ → 201 { id, email } (đang " + r.status + ": " + r.text + ")."};
        if (/\\$2/.test(r.text)) return {pass:false, msg:"Không trả hash mật khẩu trong response."};
        const row = db.prepare("SELECT * FROM users WHERE email = ?").get("a@blog.vn");
        if (!row || !String(row.password_hash).startsWith("$2")) return {pass:false, msg:"Cần lưu user vào bảng users với password_hash là chuỗi bcrypt."};
        if ((await T.request("POST", "/api/register", { body: { email: "a@blog.vn", password: "matkhau123" } })).status !== 409) return {pass:false, msg:"Email trùng phải trả 409."};
        await T.request("POST", "/api/register", { body: { email: "b@blog.vn", password: "matkhau456" } });
        if ((await T.request("POST", "/api/login", { body: { email: "a@blog.vn", password: "sai" } })).status !== 401) return {pass:false, msg:"Đăng nhập sai phải trả 401."};
        const la = await T.request("POST", "/api/login", { body: { email: "a@blog.vn", password: "matkhau123" } });
        const lb = await T.request("POST", "/api/login", { body: { email: "b@blog.vn", password: "matkhau456" } });
        if (!la.body || !la.body.token || !lb.body || !lb.body.token) return {pass:false, msg:"Đăng nhập đúng phải trả { token }."};
        let pl; try { pl = jwt.verify(la.body.token, process.env.JWT_SECRET); } catch (e) { return {pass:false, msg:"Token phải ký bằng process.env.JWT_SECRET."}; }
        if (pl.email !== "a@blog.vn" || typeof pl.id !== "number" || pl.exp - pl.iat !== 3600) return {pass:false, msg:"Payload token cần { id, email } và hết hạn sau 1h."};
        const A = la.body.token, B = lb.body.token;
        if ((await T.request("POST", "/api/posts", { body: { title: "Không token" } })).status !== 401) return {pass:false, msg:"Tạo bài khi chưa đăng nhập phải trả 401."};
        if ((await T.request("POST", "/api/posts", { body: { content: "x" }, headers: auth(A) })).status !== 400) return {pass:false, msg:"Tạo bài thiếu title phải trả 400."};
        const ids = [];
        for (let i = 1; i <= 3; i++) {
          r = await T.request("POST", "/api/posts", { body: { title: "Bài " + i, content: "Nội dung " + i }, headers: auth(i === 3 ? B : A) });
          if (r.status !== 201 || !r.body || r.body.title !== "Bài " + i || typeof r.body.id !== "number") return {pass:false, msg:"POST /api/posts phải trả 201 + bài viết (đang " + r.status + ": " + r.text + ")."};
          ids.push(r.body.id);
        }
        r = await T.request("GET", "/api/posts?page=1&limit=2");
        if (r.status !== 200 || !r.body || !Array.isArray(r.body.data)) return {pass:false, msg:"GET /api/posts phải trả { data, page, limit, total }."};
        if (r.body.total !== 3 || r.body.page !== 1 || r.body.limit !== 2 || r.body.data.length !== 2) return {pass:false, msg:"Phân trang chưa đúng: page=1&limit=2 phải trả 2 bài, total 3 (đang " + JSON.stringify({ page: r.body.page, limit: r.body.limit, total: r.body.total, n: r.body.data.length }) + ")."};
        if (r.body.data[0].title !== "Bài 3" || r.body.data[0].author !== "b@blog.vn") return {pass:false, msg:"Bài mới nhất phải đứng đầu và có author là email tác giả (JOIN users)."};
        const p2 = await T.request("GET", "/api/posts?page=2&limit=2");
        if (!p2.body || !Array.isArray(p2.body.data) || p2.body.data.length !== 1 || p2.body.data[0].title !== "Bài 1") return {pass:false, msg:"Trang 2 (limit 2) phải chỉ có \\"Bài 1\\"."};
        const def = await T.request("GET", "/api/posts");
        if (!def.body || def.body.page !== 1 || def.body.limit !== 10) return {pass:false, msg:"Không truyền query thì mặc định page 1, limit 10."};
        if ((await T.request("PUT", "/api/posts/" + ids[0], { body: { title: "Hack" }, headers: auth(B) })).status !== 403) return {pass:false, msg:"Sửa bài của người khác phải trả 403."};
        r = await T.request("PUT", "/api/posts/" + ids[0], { body: { title: "Bài 1 (đã sửa)" }, headers: auth(A) });
        if (r.status !== 200 || !r.body || r.body.title !== "Bài 1 (đã sửa)") return {pass:false, msg:"Tác giả sửa bài phải trả 200 + bài đã sửa."};
        if ((await T.request("PUT", "/api/posts/999", { body: { title: "x" }, headers: auth(A) })).status !== 404) return {pass:false, msg:"Sửa bài không tồn tại phải trả 404."};
        if ((await T.request("DELETE", "/api/posts/" + ids[1], { headers: auth(B) })).status !== 403) return {pass:false, msg:"Xoá bài của người khác phải trả 403."};
        if ((await T.request("DELETE", "/api/posts/" + ids[1])).status !== 401) return {pass:false, msg:"Xoá khi chưa đăng nhập phải trả 401."};
        if ((await T.request("DELETE", "/api/posts/" + ids[1], { headers: auth(A) })).status !== 204) return {pass:false, msg:"Tác giả xoá bài phải trả 204."};
        if (db.prepare("SELECT COUNT(*) AS c FROM posts").get().c !== 2) return {pass:false, msg:"Sau khi xoá, bảng posts phải còn 2 bài."};
        return {pass:true, msg:"🎓 Chúc mừng! Bạn đã tự xây một Blog API hoàn chỉnh – chính thức là Back-end Developer!"};`
    }
  }
);
