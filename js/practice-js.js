/* =========================================================
   BÀI LUYỆN TẬP THÊM – Khoá 1: JavaScript, DOM & JS nâng cao
   (cấu trúc giống practice-html-css.js)
   ========================================================= */
window.PRACTICE = window.PRACTICE || {};
(function () {
  const P = window.PRACTICE;
  const J = js => ({ html: "", css: "", js });           // bài chỉ có JS
  const D = (html, js, css) => ({ html, css: css || "", js }); // bài có HTML + JS
  // so sánh sâu 2 giá trị (dùng trong check)
  const EQ = String.raw`const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);`;

  /* ===================== JS CƠ BẢN ===================== */
  P["js-variables"] = [
    {
      title: "const, let và console.log", level: 1,
      task: "Khai báo `const ten` (chuỗi – tên bạn) và `let tuoi` (số). Dùng `console.log` in ra một dòng có chứa **cả tên và tuổi**.",
      starter: J("// Khai báo biến và in ra\n"),
      hint: "const ten = \"Quảng\";\nlet tuoi = 23;\nconsole.log(\"Tên:\", ten, \"- tuổi:\", tuoi);",
      solution: J("const ten = \"Quảng\";\nlet tuoi = 23;\nconsole.log(\"Tên: \" + ten + \", tuổi: \" + tuoi);"),
      check: String.raw`
        if (typeof ten !== "string" || !ten.trim()) return {pass:false, msg:"Cần biến ten kiểu chuỗi (string)."};
        if (typeof tuoi !== "number") return {pass:false, msg:"Cần biến tuoi kiểu số (number) – không đặt trong dấu nháy."};
        if (!T.logs.some(l => l.includes(ten) && l.includes(String(tuoi)))) return {pass:false, msg:"console.log cần in ra cả tên và tuổi."};
        if (!/const\s+ten/.test(T.src) || !/let\s+tuoi/.test(T.src)) return {pass:false, msg:"Dùng đúng const cho ten và let cho tuoi."};
        return {pass:true, msg:"Tốt! const cho giá trị không đổi, let cho giá trị có thể thay đổi."};`
    },
    {
      title: "Template string", level: 2,
      task: "Cho sẵn `namHienTai = 2026`. Khai báo `hoTen` và `namSinh`, tính `tuoi = namHienTai - namSinh`, rồi in đúng câu:\n`Xin chào <hoTen>, bạn <tuoi> tuổi` bằng **template string** (dấu backtick).",
      starter: J("const namHienTai = 2026;\n\n"),
      hint: "console.log(`Xin chào ${hoTen}, bạn ${tuoi} tuổi`);",
      solution: J("const namHienTai = 2026;\nconst hoTen = \"Doãn Quảng\";\nconst namSinh = 2003;\nconst tuoi = namHienTai - namSinh;\nconsole.log(`Xin chào ${hoTen}, bạn ${tuoi} tuổi`);"),
      check: String.raw`
        if (typeof hoTen !== "string" || typeof namSinh !== "number") return {pass:false, msg:"Cần biến hoTen (chuỗi) và namSinh (số)."};
        if (typeof tuoi === "undefined" || tuoi !== 2026 - namSinh) return {pass:false, msg:"tuoi phải bằng namHienTai - namSinh."};
        if (!T.logs.includes("Xin chào " + hoTen + ", bạn " + tuoi + " tuổi")) return {pass:false, msg:"Câu in ra chưa đúng mẫu: Xin chào <hoTen>, bạn <tuoi> tuổi"};
        if (!T.src.includes("$" + "{")) return {pass:false, msg:"Hãy dùng template string với cú pháp $" + "{...}."};
        return {pass:true, msg:"Template string giúp ghép chuỗi gọn gàng hơn dấu + rất nhiều."};`
    },
    {
      title: "Khám phá typeof", level: 3,
      task: "Khai báo 5 biến: `soNguyen` (number), `chuoi` (string), `dung` (boolean), `rong` (giá trị `null`) và `chuaGan` (khai báo bằng `let`, **không gán giá trị**). In `typeof` của từng biến.\nĐiều bất ngờ: `typeof null` cho ra gì?",
      starter: J("// 5 biến, 5 kiểu dữ liệu\n"),
      hint: "let chuaGan; → undefined. console.log(typeof rong) sẽ in \"object\" – đây là một lỗi lịch sử của JavaScript!",
      solution: J("const soNguyen = 42;\nconst chuoi = \"xin chào\";\nconst dung = true;\nconst rong = null;\nlet chuaGan;\n\nconsole.log(typeof soNguyen);\nconsole.log(typeof chuoi);\nconsole.log(typeof dung);\nconsole.log(typeof rong);   // \"object\" 😮\nconsole.log(typeof chuaGan);"),
      check: String.raw`
        const ok = typeof soNguyen === "number" && typeof chuoi === "string" && typeof dung === "boolean";
        if (!ok) return {pass:false, msg:"Kiểm tra lại soNguyen (number), chuoi (string), dung (boolean)."};
        if (rong !== null) return {pass:false, msg:"rong phải bằng null."};
        if (!/let\s+chuaGan\s*;/.test(T.src) || chuaGan !== undefined) return {pass:false, msg:"Khai báo let chuaGan; mà không gán giá trị."};
        for (const t of ["number", "string", "boolean", "object", "undefined"]) if (!T.logs.includes(t)) return {pass:false, msg:"Chưa thấy in ra '" + t + "' – nhớ console.log(typeof ...) cho từng biến."};
        return {pass:true, msg:"Đúng! typeof null === \"object\" là 'bug' tồn tại từ năm 1995 đến nay."};`
    },
    {
      title: "Hoán đổi & ép kiểu", level: 4,
      task: "1) Có `let a = 3` và `let b = 8`. Viết code **hoán đổi** để cuối cùng `a = 8`, `b = 3` (không gõ trực tiếp `a = 8`).\n2) Có `const x = \"10\"`, `const y = \"5\"` (chuỗi). Tạo `const tong` là **số 15** (không phải chuỗi \"105\").",
      starter: J("let a = 3;\nlet b = 8;\n// 1) Hoán đổi a và b\n\nconst x = \"10\";\nconst y = \"5\";\n// 2) tong = 15\n"),
      hint: "Hoán đổi: let tam = a; a = b; b = tam; (hoặc [a, b] = [b, a];). Ép kiểu: Number(x) + Number(y).",
      solution: J("let a = 3;\nlet b = 8;\n[a, b] = [b, a];\n\nconst x = \"10\";\nconst y = \"5\";\nconst tong = Number(x) + Number(y);\nconsole.log(a, b, tong);"),
      check: String.raw`
        if (a !== 8 || b !== 3) return {pass:false, msg:"Sau khi hoán đổi cần a = 8, b = 3 (đang a = " + a + ", b = " + b + ")."};
        if (/a\s*=\s*8\b/.test(T.src) || /b\s*=\s*3\b/.test(T.src.replace("let a = 3", ""))) return {pass:false, msg:"Đừng gán thẳng số – hãy hoán đổi bằng biến tạm hoặc destructuring."};
        if (typeof tong === "undefined") return {pass:false, msg:"Chưa có biến tong."};
        if (tong === "105") return {pass:false, msg:"\"10\" + \"5\" = \"105\" vì là chuỗi – hãy đổi sang số trước."};
        if (tong !== 15) return {pass:false, msg:"tong phải là số 15."};
        return {pass:true, msg:"Hai kỹ năng nhỏ nhưng dùng hàng ngày khi xử lý dữ liệu từ form!"};`
    }
  ];

  P["js-conditions"] = [
    {
      title: "Số chẵn hay lẻ", level: 1,
      task: "Viết hàm `laSoChan(n)` trả về `true` nếu `n` chẵn, ngược lại `false`.",
      starter: J("function laSoChan(n) {\n  // dùng toán tử % (chia lấy dư)\n}\n"),
      hint: "return n % 2 === 0;",
      solution: J("function laSoChan(n) {\n  return n % 2 === 0;\n}"),
      check: String.raw`
        if (typeof laSoChan !== "function") return {pass:false, msg:"Chưa có hàm laSoChan."};
        const cases = [[4, true], [7, false], [0, true], [-3, false], [100, true]];
        for (const [n, kq] of cases) if (laSoChan(n) !== kq) return {pass:false, msg:"laSoChan(" + n + ") phải trả về " + kq + "."};
        return {pass:true, msg:"Toán tử % rất hay dùng: chẵn/lẻ, xen kẽ màu, chia trang…"};`
    },
    {
      title: "Phân loại độ tuổi", level: 2,
      task: "Viết `phanLoai(tuoi)`:\n• tuổi âm → `\"Không hợp lệ\"`\n• dưới 13 → `\"Trẻ em\"`\n• từ 13 đến dưới 18 → `\"Thiếu niên\"`\n• từ 18 trở lên → `\"Người lớn\"`",
      starter: J("function phanLoai(tuoi) {\n  \n}\n"),
      hint: "Kiểm tra trường hợp đặc biệt (âm) trước, rồi if / else if theo thứ tự tăng dần.",
      solution: J("function phanLoai(tuoi) {\n  if (tuoi < 0) return \"Không hợp lệ\";\n  if (tuoi < 13) return \"Trẻ em\";\n  if (tuoi < 18) return \"Thiếu niên\";\n  return \"Người lớn\";\n}"),
      check: String.raw`
        if (typeof phanLoai !== "function") return {pass:false, msg:"Chưa có hàm phanLoai."};
        const cases = [[-1, "Không hợp lệ"], [0, "Trẻ em"], [12, "Trẻ em"], [13, "Thiếu niên"], [17, "Thiếu niên"], [18, "Người lớn"], [60, "Người lớn"]];
        for (const [t, kq] of cases) if (phanLoai(t) !== kq) return {pass:false, msg:"phanLoai(" + t + ") phải là \"" + kq + "\" (đang: " + phanLoai(t) + ")."};
        return {pass:true, msg:"Chuẩn! Luôn kiểm tra các giá trị biên: 12, 13, 17, 18."};`
    },
    {
      title: "Tên thứ trong tuần – switch", level: 3,
      task: "Viết `tenThu(n)` dùng **switch**: `0` → `\"Chủ nhật\"`, `1` → `\"Thứ hai\"`, … `6` → `\"Thứ bảy\"`; số khác → `\"Không hợp lệ\"`. (Giống `new Date().getDay()`)",
      starter: J("function tenThu(n) {\n  switch (n) {\n    \n  }\n}\n"),
      hint: "case 0: return \"Chủ nhật\"; case 1: return \"Thứ hai\"; … default: return \"Không hợp lệ\";",
      solution: J("function tenThu(n) {\n  switch (n) {\n    case 0: return \"Chủ nhật\";\n    case 1: return \"Thứ hai\";\n    case 2: return \"Thứ ba\";\n    case 3: return \"Thứ tư\";\n    case 4: return \"Thứ năm\";\n    case 5: return \"Thứ sáu\";\n    case 6: return \"Thứ bảy\";\n    default: return \"Không hợp lệ\";\n  }\n}\nconsole.log(\"Hôm nay là\", tenThu(new Date().getDay()));"),
      check: String.raw`
        if (typeof tenThu !== "function") return {pass:false, msg:"Chưa có hàm tenThu."};
        if (!/switch\s*\(/.test(T.src)) return {pass:false, msg:"Bài này yêu cầu dùng switch."};
        const ds = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        for (let i = 0; i < 7; i++) if (tenThu(i) !== ds[i]) return {pass:false, msg:"tenThu(" + i + ") phải là \"" + ds[i] + "\"."};
        if (tenThu(7) !== "Không hợp lệ" || tenThu(-1) !== "Không hợp lệ") return {pass:false, msg:"Số ngoài 0–6 phải trả về \"Không hợp lệ\" (dùng default)."};
        return {pass:true, msg:"switch gọn hơn chuỗi if/else khi so sánh một giá trị với nhiều trường hợp."};`
    },
    {
      title: "Năm nhuận", level: 4,
      task: "Viết `laNamNhuan(nam)`: năm nhuận khi **chia hết cho 4 nhưng không chia hết cho 100**, **hoặc** chia hết cho 400. Dùng toán tử logic `&&`, `||`.",
      starter: J("function laNamNhuan(nam) {\n  \n}\n"),
      hint: "return (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;",
      solution: J("function laNamNhuan(nam) {\n  return (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;\n}"),
      check: String.raw`
        if (typeof laNamNhuan !== "function") return {pass:false, msg:"Chưa có hàm laNamNhuan."};
        const cases = [[2024, true], [2026, false], [1900, false], [2000, true], [2100, false], [1600, true]];
        for (const [y, kq] of cases) if (laNamNhuan(y) !== kq) return {pass:false, msg:"laNamNhuan(" + y + ") phải là " + kq + "."};
        return {pass:true, msg:"Thử thách logic hoàn thành! 1900 không nhuận nhưng 2000 thì có đấy."};`
    }
  ];

  P["js-loops"] = [
    {
      title: "Đếm từ 1 đến 5", level: 1,
      task: "Dùng vòng lặp `for` in ra lần lượt các số **1, 2, 3, 4, 5** (mỗi số một lần `console.log`).",
      starter: J("// vòng lặp for\n"),
      hint: "for (let i = 1; i <= 5; i++) { console.log(i); }",
      solution: J("for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}"),
      check: String.raw`
        if (!/for\s*\(/.test(T.src)) return {pass:false, msg:"Hãy dùng vòng lặp for."};
        if (T.logs.join(",") !== "1,2,3,4,5") return {pass:false, msg:"Cần in đúng 1, 2, 3, 4, 5 (đang in: " + T.logs.join(", ") + ")."};
        return {pass:true, msg:"Vòng lặp đầu tiên của bạn! 🔁"};`
    },
    {
      title: "Tìm số lớn nhất", level: 2,
      task: "Viết `timMax(arr)` trả về số lớn nhất trong mảng bằng vòng lặp (mảng rỗng → `null`).\nVí dụ `timMax([3, 9, 2])` → `9`, `timMax([-5, -2])` → `-2`.",
      starter: J("function timMax(arr) {\n  \n}\n"),
      hint: "Bắt đầu với max = arr[0] (không phải 0 – vì mảng có thể toàn số âm), duyệt và cập nhật khi gặp số lớn hơn.",
      solution: J("function timMax(arr) {\n  if (arr.length === 0) return null;\n  let max = arr[0];\n  for (const so of arr) {\n    if (so > max) max = so;\n  }\n  return max;\n}"),
      check: String.raw`
        if (typeof timMax !== "function") return {pass:false, msg:"Chưa có hàm timMax."};
        if (timMax([3, 9, 2]) !== 9) return {pass:false, msg:"timMax([3, 9, 2]) phải là 9."};
        if (timMax([-5, -2, -9]) !== -2) return {pass:false, msg:"timMax([-5, -2, -9]) phải là -2 (đừng khởi tạo max = 0)."};
        if (timMax([7]) !== 7) return {pass:false, msg:"timMax([7]) phải là 7."};
        if (timMax([]) !== null) return {pass:false, msg:"Mảng rỗng phải trả về null."};
        return {pass:true, msg:"Thuật toán tìm cực đại – nền tảng của rất nhiều bài toán khác."};`
    },
    {
      title: "Đếm nguyên âm", level: 3,
      task: "Viết `demNguyenAm(chuoi)` đếm số nguyên âm `a, e, i, o, u` (không phân biệt hoa thường).\nVí dụ `demNguyenAm(\"Hello World\")` → `3`.",
      starter: J("function demNguyenAm(chuoi) {\n  \n}\n"),
      hint: "Duyệt từng ký tự: for (const kt of chuoi.toLowerCase()) { if (\"aeiou\".includes(kt)) dem++; }",
      solution: J("function demNguyenAm(chuoi) {\n  let dem = 0;\n  for (const kt of chuoi.toLowerCase()) {\n    if (\"aeiou\".includes(kt)) dem++;\n  }\n  return dem;\n}"),
      check: String.raw`
        if (typeof demNguyenAm !== "function") return {pass:false, msg:"Chưa có hàm demNguyenAm."};
        const cases = [["Hello World", 3], ["JAVASCRIPT", 3], ["xyz", 0], ["", 0], ["AEIOUaeiou", 10]];
        for (const [s, kq] of cases) if (demNguyenAm(s) !== kq) return {pass:false, msg:"demNguyenAm(\"" + s + "\") phải là " + kq + "."};
        return {pass:true, msg:"for...of duyệt chuỗi từng ký tự rất tiện!"};`
    },
    {
      title: "Bảng cửu chương", level: 4,
      task: "Viết `bangCuuChuong(n)` trả về **mảng 10 chuỗi** dạng `\"n x i = kết quả\"` với i từ 1 đến 10.\nVí dụ phần tử đầu của `bangCuuChuong(3)` là `\"3 x 1 = 3\"`, phần tử cuối là `\"3 x 10 = 30\"`.",
      starter: J("function bangCuuChuong(n) {\n  const ketQua = [];\n  \n  return ketQua;\n}\n"),
      hint: "for (let i = 1; i <= 10; i++) ketQua.push(n + \" x \" + i + \" = \" + n * i);",
      solution: J("function bangCuuChuong(n) {\n  const ketQua = [];\n  for (let i = 1; i <= 10; i++) {\n    ketQua.push(`${n} x ${i} = ${n * i}`);\n  }\n  return ketQua;\n}\nconsole.log(bangCuuChuong(7).join(\"\\n\"));"),
      check: String.raw`
        if (typeof bangCuuChuong !== "function") return {pass:false, msg:"Chưa có hàm bangCuuChuong."};
        for (const n of [3, 9]) {
          const r = bangCuuChuong(n);
          if (!Array.isArray(r) || r.length !== 10) return {pass:false, msg:"Phải trả về mảng đúng 10 phần tử."};
          for (let i = 1; i <= 10; i++) if (r[i - 1] !== n + " x " + i + " = " + n * i) return {pass:false, msg:"Phần tử thứ " + i + " của bảng " + n + " phải là \"" + n + " x " + i + " = " + n * i + "\" (đang: \"" + r[i - 1] + "\")."};
        }
        return {pass:true, msg:"Bảng cửu chương tự động – trẻ con nhà bạn sẽ thích đấy! 😄"};`
    }
  ];

  P["js-functions"] = [
    {
      title: "Hàm bình phương", level: 1,
      task: "Viết hàm `binhPhuong(x)` trả về x nhân x. Ví dụ `binhPhuong(4)` → `16`.",
      starter: J("function binhPhuong(x) {\n  \n}\n"),
      hint: "return x * x;  (hoặc x ** 2)",
      solution: J("function binhPhuong(x) {\n  return x * x;\n}"),
      check: String.raw`
        if (typeof binhPhuong !== "function") return {pass:false, msg:"Chưa có hàm binhPhuong."};
        for (const [x, kq] of [[4, 16], [0, 0], [-3, 9], [1.5, 2.25]]) if (binhPhuong(x) !== kq) return {pass:false, msg:"binhPhuong(" + x + ") phải là " + kq + " – nhớ dùng return."};
        return {pass:true, msg:"Hàm nhận đầu vào, trả đầu ra – như một cỗ máy nhỏ."};`
    },
    {
      title: "Tham số mặc định", level: 2,
      task: "Viết **arrow function** `chao(ten = \"bạn\")` trả về chuỗi `\"Xin chào, <ten>!\"`.\n`chao(\"An\")` → `\"Xin chào, An!\"` · `chao()` → `\"Xin chào, bạn!\"`.",
      starter: J("const chao = // viết arrow function ở đây\n"),
      hint: "const chao = (ten = \"bạn\") => `Xin chào, ${ten}!`;",
      solution: J("const chao = (ten = \"bạn\") => `Xin chào, ${ten}!`;"),
      check: String.raw`
        if (typeof chao !== "function") return {pass:false, msg:"Chưa có hàm chao."};
        if (!/=>/.test(T.src)) return {pass:false, msg:"Hãy viết bằng arrow function (=>)."};
        if (chao("An") !== "Xin chào, An!") return {pass:false, msg:"chao(\"An\") phải là \"Xin chào, An!\"."};
        if (chao() !== "Xin chào, bạn!") return {pass:false, msg:"chao() phải dùng giá trị mặc định \"bạn\"."};
        return {pass:true, msg:"Tham số mặc định giúp hàm 'chịu được' khi người gọi quên truyền đối số."};`
    },
    {
      title: "Phương thức của object & this", level: 3,
      task: "Tạo object `sinhVien` có `ten`, mảng `diem` và phương thức `diemTrungBinh()` trả về trung bình cộng của `this.diem` (mảng rỗng → `0`).",
      starter: J("const sinhVien = {\n  ten: \"An\",\n  diem: [8, 9, 7],\n  // diemTrungBinh() { ... }\n};\n"),
      hint: "diemTrungBinh() { if (!this.diem.length) return 0; let t = 0; for (const d of this.diem) t += d; return t / this.diem.length; }",
      solution: J("const sinhVien = {\n  ten: \"An\",\n  diem: [8, 9, 7],\n  diemTrungBinh() {\n    if (this.diem.length === 0) return 0;\n    let tong = 0;\n    for (const d of this.diem) tong += d;\n    return tong / this.diem.length;\n  }\n};\nconsole.log(sinhVien.ten, sinhVien.diemTrungBinh());"),
      check: String.raw`
        if (typeof sinhVien !== "object" || typeof sinhVien.diemTrungBinh !== "function") return {pass:false, msg:"sinhVien cần có phương thức diemTrungBinh()."};
        if (Math.abs(sinhVien.diemTrungBinh() - 8) > 1e-9) return {pass:false, msg:"Với [8, 9, 7] trung bình phải là 8."};
        sinhVien.diem = [10, 5];
        if (sinhVien.diemTrungBinh() !== 7.5) return {pass:false, msg:"Phải tính theo this.diem (đổi thành [10, 5] → 7.5)."};
        sinhVien.diem = [];
        if (sinhVien.diemTrungBinh() !== 0) return {pass:false, msg:"Mảng điểm rỗng phải trả về 0."};
        return {pass:true, msg:"this trỏ tới chính object đang gọi phương thức."};`
    },
    {
      title: "Đếm tần suất từ", level: 4,
      task: "Viết `demTu(cau)` trả về **object** đếm số lần xuất hiện của mỗi từ (chuyển về chữ thường, tách theo khoảng trắng).\nVí dụ `demTu(\"Học JS học CSS\")` → `{ học: 2, js: 1, css: 1 }`.",
      starter: J("function demTu(cau) {\n  const ketQua = {};\n  \n  return ketQua;\n}\n"),
      hint: "cau.toLowerCase().split(\" \") → mảng từ. ketQua[tu] = (ketQua[tu] || 0) + 1;  Bỏ qua chuỗi rỗng khi có nhiều dấu cách.",
      solution: J("function demTu(cau) {\n  const ketQua = {};\n  for (const tu of cau.toLowerCase().split(\" \")) {\n    if (!tu) continue;\n    ketQua[tu] = (ketQua[tu] || 0) + 1;\n  }\n  return ketQua;\n}\nconsole.log(demTu(\"Học JS học CSS\"));"),
      check: EQ + String.raw`
        if (typeof demTu !== "function") return {pass:false, msg:"Chưa có hàm demTu."};
        const sort = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
        if (!eq(sort(demTu("Học JS học CSS")), sort({ "học": 2, js: 1, css: 1 }))) return {pass:false, msg:"demTu(\"Học JS học CSS\") chưa đúng: " + JSON.stringify(demTu("Học JS học CSS"))};
        if (!eq(sort(demTu("a  b a")), { a: 2, b: 1 })) return {pass:false, msg:"Nhiều dấu cách liền nhau không được tính là một 'từ' rỗng."};
        if (!eq(demTu(""), {})) return {pass:false, msg:"Chuỗi rỗng phải trả về {}."};
        return {pass:true, msg:"Đây là thuật toán 'word count' – nền tảng của công cụ tìm kiếm!"};`
    }
  ];

  /* ===================== DOM & SỰ KIỆN ===================== */
  P["dom-select"] = [
    {
      title: "Đổi nội dung", level: 1,
      task: "Dùng `querySelector` đổi nội dung thẻ `#msg` thành `Xin chào DOM`.",
      starter: D("<p id=\"msg\">Nội dung cũ</p>", "// chọn #msg và đổi textContent\n"),
      hint: "document.querySelector(\"#msg\").textContent = \"Xin chào DOM\";",
      solution: D("<p id=\"msg\">Nội dung cũ</p>", "document.querySelector(\"#msg\").textContent = \"Xin chào DOM\";"),
      check: String.raw`
        if (T.$("#msg").textContent.trim() !== "Xin chào DOM") return {pass:false, msg:"#msg cần có nội dung 'Xin chào DOM'."};
        if (/Xin chào DOM/.test(T.html)) return {pass:false, msg:"Đổi bằng JavaScript, không sửa trực tiếp HTML nhé."};
        return {pass:true, msg:"Bạn vừa điều khiển trang web bằng JavaScript!"};`
    },
    {
      title: "Chọn nhiều phần tử", level: 2,
      task: "Dùng `querySelectorAll` thêm class `active` cho **tất cả** phần tử `.item`.",
      starter: D("<ul>\n  <li class=\"item\">HTML</li>\n  <li class=\"item\">CSS</li>\n  <li class=\"item\">JS</li>\n</ul>", "", ".active { color: #16a34a; font-weight: bold; }"),
      hint: "document.querySelectorAll(\".item\").forEach(el => el.classList.add(\"active\"));",
      solution: D("<ul>\n  <li class=\"item\">HTML</li>\n  <li class=\"item\">CSS</li>\n  <li class=\"item\">JS</li>\n</ul>", "document.querySelectorAll(\".item\").forEach(el => {\n  el.classList.add(\"active\");\n});", ".active { color: #16a34a; font-weight: bold; }"),
      check: String.raw`
        const items = T.$$(".item");
        if (!items.every(el => el.classList.contains("active"))) return {pass:false, msg:"Tất cả .item cần có class active."};
        if (/class="item active"/.test(T.html)) return {pass:false, msg:"Hãy thêm class bằng JavaScript (classList.add)."};
        return {pass:true, msg:"classList.add/remove/toggle là cách chuẩn để đổi giao diện bằng JS."};`
    },
    {
      title: "Đổi thuộc tính", level: 3,
      task: "Bằng JavaScript:\n• Đổi `src` của `#avatar` thành `https://i.pravatar.cc/120` và `alt` thành `Ảnh đại diện`.\n• Đổi `href` của `#web` thành `https://github.com`.",
      starter: D("<img id=\"avatar\" src=\"\" alt=\"\">\n<a id=\"web\" href=\"#\">Trang cá nhân</a>", ""),
      hint: "el.setAttribute(\"src\", \"...\") hoặc el.src = \"...\"; el.alt = \"...\"; link.href = \"...\";",
      solution: D("<img id=\"avatar\" src=\"\" alt=\"\">\n<a id=\"web\" href=\"#\">Trang cá nhân</a>", "const img = document.querySelector(\"#avatar\");\nimg.src = \"https://i.pravatar.cc/120\";\nimg.alt = \"Ảnh đại diện\";\n\ndocument.querySelector(\"#web\").href = \"https://github.com\";"),
      check: String.raw`
        const img = T.$("#avatar"), a = T.$("#web");
        if (img.getAttribute("src") !== "https://i.pravatar.cc/120") return {pass:false, msg:"src của #avatar chưa đúng."};
        if (img.getAttribute("alt") !== "Ảnh đại diện") return {pass:false, msg:"alt của #avatar phải là 'Ảnh đại diện'."};
        if (!/^https:\/\/github\.com\/?$/.test(a.getAttribute("href"))) return {pass:false, msg:"href của #web phải là https://github.com."};
        return {pass:true, msg:"Chuẩn! Thuộc tính HTML đều đọc/ghi được bằng JS."};`
    },
    {
      title: "Đếm & đánh dấu danh sách", level: 4,
      task: "Với danh sách `#list`:\n• Ghi vào `#total` đúng câu `Tổng: <số mục> mục`.\n• Các `li` có class `hot` đổi **màu chữ đỏ** (`style.color = \"red\"`).\n• Mục **cuối cùng** in đậm (`fontWeight = \"bold\"`).",
      starter: D("<ul id=\"list\">\n  <li>HTML</li>\n  <li class=\"hot\">JavaScript</li>\n  <li>CSS</li>\n  <li class=\"hot\">React</li>\n  <li>Node.js</li>\n</ul>\n<p id=\"total\"></p>", ""),
      hint: "const list = document.querySelector(\"#list\"); list.children.length; list.querySelectorAll(\".hot\"); list.lastElementChild",
      solution: D("<ul id=\"list\">\n  <li>HTML</li>\n  <li class=\"hot\">JavaScript</li>\n  <li>CSS</li>\n  <li class=\"hot\">React</li>\n  <li>Node.js</li>\n</ul>\n<p id=\"total\"></p>", "const list = document.querySelector(\"#list\");\ndocument.querySelector(\"#total\").textContent = `Tổng: ${list.children.length} mục`;\nlist.querySelectorAll(\".hot\").forEach(li => li.style.color = \"red\");\nlist.lastElementChild.style.fontWeight = \"bold\";"),
      check: String.raw`
        const lis = T.$$("#list li");
        if (T.$("#total").textContent.trim() !== "Tổng: " + lis.length + " mục") return {pass:false, msg:"#total phải là 'Tổng: " + lis.length + " mục'."};
        if (lis.some(li => li.classList.contains("hot") !== (T.css(li, "color") === "rgb(255, 0, 0)"))) return {pass:false, msg:"Chỉ các li.hot có màu đỏ."};
        if (+T.css(lis[lis.length - 1], "font-weight") < 700) return {pass:false, msg:"Mục cuối cùng cần in đậm."};
        if (+T.css(lis[0], "font-weight") >= 700) return {pass:false, msg:"Chỉ mục cuối in đậm thôi."};
        return {pass:true, msg:"Bạn đã duyệt cây DOM như một dev thực thụ!"};`
    }
  ];

  P["dom-events"] = [
    {
      title: "Bấm nút hiện thông báo", level: 1,
      task: "Khi bấm `#btn`, đổi nội dung `#msg` thành `Đã bấm!`.",
      starter: D("<button id=\"btn\">Bấm mình</button>\n<p id=\"msg\"></p>", ""),
      hint: "document.querySelector(\"#btn\").addEventListener(\"click\", () => { ... });",
      solution: D("<button id=\"btn\">Bấm mình</button>\n<p id=\"msg\"></p>", "document.querySelector(\"#btn\").addEventListener(\"click\", () => {\n  document.querySelector(\"#msg\").textContent = \"Đã bấm!\";\n});"),
      check: String.raw`
        if (T.$("#msg").textContent.trim()) return {pass:false, msg:"Khi chưa bấm, #msg phải trống."};
        T.click(T.$("#btn"));
        if (T.$("#msg").textContent.trim() !== "Đã bấm!") return {pass:false, msg:"Sau khi bấm, #msg phải là 'Đã bấm!'."};
        return {pass:true, msg:"addEventListener – trái tim của mọi trang web tương tác."};`
    },
    {
      title: "Xem trước khi gõ – sự kiện input", level: 2,
      task: "Mỗi khi gõ vào ô `#name`, `#preview` hiển thị ngay `Xin chào, <nội dung ô>`.",
      starter: D("<input id=\"name\" placeholder=\"Nhập tên\">\n<p id=\"preview\">Xin chào, </p>", ""),
      hint: "input.addEventListener(\"input\", () => preview.textContent = \"Xin chào, \" + input.value);",
      solution: D("<input id=\"name\" placeholder=\"Nhập tên\">\n<p id=\"preview\">Xin chào, </p>", "const input = document.querySelector(\"#name\");\nconst preview = document.querySelector(\"#preview\");\ninput.addEventListener(\"input\", () => {\n  preview.textContent = \"Xin chào, \" + input.value;\n});"),
      check: String.raw`
        const i = T.$("#name");
        for (const v of ["Quảng", "An Bình"]) {
          i.value = v; i.dispatchEvent(new Event("input", { bubbles: true }));
          if (T.$("#preview").textContent !== "Xin chào, " + v) return {pass:false, msg:"Gõ '" + v + "' thì #preview phải là 'Xin chào, " + v + "'."};
        }
        return {pass:true, msg:"Sự kiện input chạy mỗi khi giá trị thay đổi – dùng cho ô tìm kiếm trực tiếp."};`
    },
    {
      title: "Bật/tắt chế độ tối", level: 3,
      task: "Bấm `#toggle` sẽ **bật/tắt** class `dark` trên `body`. Nút hiển thị `☀️ Sáng` khi đang tối và `🌙 Tối` khi đang sáng.",
      starter: D("<button id=\"toggle\">🌙 Tối</button>\n<p>Bấm nút để đổi giao diện.</p>", "", "body.dark { background: #0f172a; color: #e2e8f0; }"),
      hint: "const toi = document.body.classList.toggle(\"dark\"); // toggle trả về true nếu vừa thêm\nbtn.textContent = toi ? \"☀️ Sáng\" : \"🌙 Tối\";",
      solution: D("<button id=\"toggle\">🌙 Tối</button>\n<p>Bấm nút để đổi giao diện.</p>", "const btn = document.querySelector(\"#toggle\");\nbtn.addEventListener(\"click\", () => {\n  const toi = document.body.classList.toggle(\"dark\");\n  btn.textContent = toi ? \"☀️ Sáng\" : \"🌙 Tối\";\n});", "body.dark { background: #0f172a; color: #e2e8f0; }"),
      check: String.raw`
        const b = T.$("#toggle");
        T.click(b);
        if (!document.body.classList.contains("dark")) return {pass:false, msg:"Bấm lần 1: body phải có class dark."};
        if (b.textContent.trim() !== "☀️ Sáng") return {pass:false, msg:"Đang tối thì nút ghi '☀️ Sáng'."};
        T.click(b);
        if (document.body.classList.contains("dark")) return {pass:false, msg:"Bấm lần 2: phải bỏ class dark."};
        if (b.textContent.trim() !== "🌙 Tối") return {pass:false, msg:"Đang sáng thì nút ghi '🌙 Tối'."};
        return {pass:true, msg:"Dark mode – tính năng mà người dùng nào cũng thích! 🌗"};`
    },
    {
      title: "Kiểm tra form trước khi gửi", level: 4,
      task: "Xử lý sự kiện `submit` của `#form`:\n• Luôn chặn tải lại trang bằng `e.preventDefault()`.\n• Nếu `#email` không chứa `@` → `#error` hiện `Email không hợp lệ`, `#ok` để trống.\n• Hợp lệ → `#error` trống, `#ok` hiện `Đăng ký thành công`.",
      starter: D("<form id=\"form\">\n  <input id=\"email\" type=\"text\" placeholder=\"Email\">\n  <button>Đăng ký</button>\n</form>\n<p id=\"error\" style=\"color:red\"></p>\n<p id=\"ok\" style=\"color:green\"></p>", ""),
      hint: "form.addEventListener(\"submit\", e => { e.preventDefault(); const email = ...value.trim(); if (!email.includes(\"@\")) { ... } else { ... } });",
      solution: D("<form id=\"form\">\n  <input id=\"email\" type=\"text\" placeholder=\"Email\">\n  <button>Đăng ký</button>\n</form>\n<p id=\"error\" style=\"color:red\"></p>\n<p id=\"ok\" style=\"color:green\"></p>", "const form = document.querySelector(\"#form\");\nconst err = document.querySelector(\"#error\");\nconst ok = document.querySelector(\"#ok\");\n\nform.addEventListener(\"submit\", e => {\n  e.preventDefault();\n  const email = document.querySelector(\"#email\").value.trim();\n  if (!email.includes(\"@\")) {\n    err.textContent = \"Email không hợp lệ\";\n    ok.textContent = \"\";\n  } else {\n    err.textContent = \"\";\n    ok.textContent = \"Đăng ký thành công\";\n  }\n});"),
      check: String.raw`
        const f = T.$("#form"), em = T.$("#email");
        const gui = v => { em.value = v; const ev = new Event("submit", { bubbles: true, cancelable: true }); f.dispatchEvent(ev); return ev.defaultPrevented; };
        if (!gui("sai-email")) return {pass:false, msg:"Chưa gọi e.preventDefault() – trang sẽ bị tải lại."};
        if (T.$("#error").textContent.trim() !== "Email không hợp lệ" || T.$("#ok").textContent.trim()) return {pass:false, msg:"Email sai: #error = 'Email không hợp lệ', #ok để trống."};
        gui("quang@gmail.com");
        if (T.$("#error").textContent.trim() || T.$("#ok").textContent.trim() !== "Đăng ký thành công") return {pass:false, msg:"Email đúng: #error trống, #ok = 'Đăng ký thành công'."};
        gui("abc");
        if (T.$("#ok").textContent.trim()) return {pass:false, msg:"Gửi lại email sai thì phải xoá thông báo thành công cũ."};
        return {pass:true, msg:"Validate phía client giúp người dùng sửa lỗi ngay, không phải chờ server."};`
    }
  ];

  P["dom-create"] = [
    {
      title: "Tạo đoạn văn bằng JS", level: 1,
      task: "Dùng `document.createElement` tạo một `<p>` có chữ `Mình được tạo bằng JS` rồi gắn vào `#box`.",
      starter: D("<div id=\"box\"></div>", ""),
      hint: "const p = document.createElement(\"p\"); p.textContent = \"...\"; document.querySelector(\"#box\").appendChild(p);",
      solution: D("<div id=\"box\"></div>", "const p = document.createElement(\"p\");\np.textContent = \"Mình được tạo bằng JS\";\ndocument.querySelector(\"#box\").appendChild(p);"),
      check: String.raw`
        if (!/createElement/.test(T.src)) return {pass:false, msg:"Hãy dùng document.createElement."};
        const p = T.$("#box p");
        if (!p || p.textContent.trim() !== "Mình được tạo bằng JS") return {pass:false, msg:"Trong #box cần một <p> có chữ 'Mình được tạo bằng JS'."};
        return {pass:true, msg:"createElement + appendChild: cách an toàn để thêm nội dung động."};`
    },
    {
      title: "Hiển thị mảng thành danh sách", level: 2,
      task: "Cho sẵn mảng `traiCay`. Với mỗi phần tử, tạo một `<li>` và thêm vào `#list`.",
      starter: D("<ul id=\"list\"></ul>", "const traiCay = [\"Xoài\", \"Sầu riêng\", \"Măng cụt\", \"Chôm chôm\"];\n\n"),
      hint: "traiCay.forEach(ten => { const li = document.createElement(\"li\"); li.textContent = ten; list.appendChild(li); });",
      solution: D("<ul id=\"list\"></ul>", "const traiCay = [\"Xoài\", \"Sầu riêng\", \"Măng cụt\", \"Chôm chôm\"];\nconst list = document.querySelector(\"#list\");\n\ntraiCay.forEach(ten => {\n  const li = document.createElement(\"li\");\n  li.textContent = ten;\n  list.appendChild(li);\n});"),
      check: String.raw`
        const lis = T.$$("#list li").map(li => li.textContent.trim());
        if (lis.length !== traiCay.length) return {pass:false, msg:"#list cần " + traiCay.length + " <li> (đang có " + lis.length + ")."};
        if (lis.join() !== traiCay.join()) return {pass:false, msg:"Nội dung và thứ tự các <li> phải khớp mảng traiCay."};
        return {pass:true, msg:"Dữ liệu → giao diện: đây chính là việc React/Vue làm hằng ngày."};`
    },
    {
      title: "Nút xoá từng mục", level: 3,
      task: "Mỗi `li` trong `#list` có một nút `.del`. Bấm nút nào thì **xoá đúng `li` chứa nút đó**.",
      starter: D("<ul id=\"list\">\n  <li>Học HTML <button class=\"del\">✖</button></li>\n  <li>Học CSS <button class=\"del\">✖</button></li>\n  <li>Học JS <button class=\"del\">✖</button></li>\n</ul>", ""),
      hint: "Cách 1: querySelectorAll(\".del\").forEach(b => b.addEventListener(\"click\", () => b.parentElement.remove()));\nCách 2 (event delegation): lắng nghe trên #list, kiểm tra e.target.classList.contains(\"del\").",
      solution: D("<ul id=\"list\">\n  <li>Học HTML <button class=\"del\">✖</button></li>\n  <li>Học CSS <button class=\"del\">✖</button></li>\n  <li>Học JS <button class=\"del\">✖</button></li>\n</ul>", "// Event delegation: 1 listener cho cả danh sách\ndocument.querySelector(\"#list\").addEventListener(\"click\", e => {\n  if (e.target.classList.contains(\"del\")) {\n    e.target.closest(\"li\").remove();\n  }\n});"),
      check: String.raw`
        const btns = T.$$("#list .del");
        T.click(btns[1]);
        let lis = T.$$("#list li").map(li => li.firstChild.textContent.trim());
        if (lis.length !== 2 || lis.includes("Học CSS")) return {pass:false, msg:"Bấm ✖ ở 'Học CSS' phải xoá đúng mục đó."};
        T.click(T.$$("#list .del")[0]);
        lis = T.$$("#list li").map(li => li.firstChild.textContent.trim());
        if (lis.join() !== "Học JS") return {pass:false, msg:"Sau khi xoá thêm 'Học HTML', chỉ còn 'Học JS'."};
        return {pass:true, msg:"Gợi ý: event delegation vẫn chạy với cả những li được thêm sau này!"};`
    },
    {
      title: "Bảng giỏ hàng từ dữ liệu", level: 4,
      task: "Cho mảng `gioHang` gồm `{ ten, gia, soLuong }`. Với mỗi món, thêm một `<tr>` vào `#tbody` gồm **3 ô**: tên, số lượng, thành tiền (`gia × soLuong`). Cuối cùng `#tong` ghi `Tổng: <tổng tiền>` (số, không định dạng).",
      starter: D("<table border=\"1\">\n  <thead><tr><th>Món</th><th>SL</th><th>Thành tiền</th></tr></thead>\n  <tbody id=\"tbody\"></tbody>\n</table>\n<p id=\"tong\"></p>", "const gioHang = [\n  { ten: \"Cà phê\", gia: 25000, soLuong: 2 },\n  { ten: \"Bánh mì\", gia: 20000, soLuong: 3 },\n  { ten: \"Trà sữa\", gia: 35000, soLuong: 1 }\n];\n\n"),
      hint: "Tạo tr, mỗi ô là createElement(\"td\"). Cộng dồn tong += sp.gia * sp.soLuong trong cùng vòng lặp.",
      solution: D("<table border=\"1\">\n  <thead><tr><th>Món</th><th>SL</th><th>Thành tiền</th></tr></thead>\n  <tbody id=\"tbody\"></tbody>\n</table>\n<p id=\"tong\"></p>", "const gioHang = [\n  { ten: \"Cà phê\", gia: 25000, soLuong: 2 },\n  { ten: \"Bánh mì\", gia: 20000, soLuong: 3 },\n  { ten: \"Trà sữa\", gia: 35000, soLuong: 1 }\n];\n\nconst tbody = document.querySelector(\"#tbody\");\nlet tong = 0;\nfor (const sp of gioHang) {\n  const thanhTien = sp.gia * sp.soLuong;\n  tong += thanhTien;\n  const tr = document.createElement(\"tr\");\n  for (const giaTri of [sp.ten, sp.soLuong, thanhTien]) {\n    const td = document.createElement(\"td\");\n    td.textContent = giaTri;\n    tr.appendChild(td);\n  }\n  tbody.appendChild(tr);\n}\ndocument.querySelector(\"#tong\").textContent = \"Tổng: \" + tong;"),
      check: String.raw`
        const rows = T.$$("#tbody tr");
        if (rows.length !== gioHang.length) return {pass:false, msg:"#tbody cần " + gioHang.length + " hàng."};
        for (let i = 0; i < rows.length; i++) {
          const c = [...rows[i].querySelectorAll("td")].map(td => td.textContent.trim()), sp = gioHang[i];
          if (c.length !== 3) return {pass:false, msg:"Mỗi hàng cần đúng 3 ô <td>."};
          if (c[0] !== sp.ten || c[1] !== String(sp.soLuong) || c[2] !== String(sp.gia * sp.soLuong)) return {pass:false, msg:"Hàng " + (i + 1) + " phải là: " + sp.ten + " | " + sp.soLuong + " | " + sp.gia * sp.soLuong};
        }
        const tong = gioHang.reduce((t, s) => t + s.gia * s.soLuong, 0);
        if (T.$("#tong").textContent.trim() !== "Tổng: " + tong) return {pass:false, msg:"#tong phải là 'Tổng: " + tong + "'."};
        return {pass:true, msg:"Bạn vừa làm phần hiển thị giỏ hàng của một trang bán hàng! 🛒"};`
    }
  ];

  /* ===================== JS NÂNG CAO ===================== */
  P["js-array-methods"] = [
    {
      title: "map – nhân đôi", level: 1,
      task: "Viết arrow function `nhanDoi` nhận mảng số, trả về mảng mới với mỗi phần tử **gấp đôi**, dùng `map`.",
      starter: J("const nhanDoi = \n"),
      hint: "const nhanDoi = arr => arr.map(x => x * 2);",
      solution: J("const nhanDoi = arr => arr.map(x => x * 2);"),
      check: EQ + String.raw`
        if (typeof nhanDoi !== "function") return {pass:false, msg:"Chưa có hàm nhanDoi."};
        if (!/\.map\(/.test(T.src)) return {pass:false, msg:"Hãy dùng map."};
        const a = [1, 2, 3];
        if (!eq(nhanDoi(a), [2, 4, 6])) return {pass:false, msg:"nhanDoi([1, 2, 3]) phải là [2, 4, 6]."};
        if (!eq(a, [1, 2, 3])) return {pass:false, msg:"Không được sửa mảng gốc – map trả về mảng mới."};
        if (!eq(nhanDoi([]), [])) return {pass:false, msg:"Mảng rỗng → []."};
        return {pass:true, msg:"map: biến đổi từng phần tử, giữ nguyên số lượng."};`
    },
    {
      title: "filter + map – sản phẩm giá rẻ", level: 2,
      task: "Viết `tenSanPhamRe(ds)` trả về **mảng tên** của các sản phẩm có `gia` **dưới 100000**, dùng `filter` rồi `map`.",
      starter: J("const sanPham = [\n  { ten: \"Bút\", gia: 15000 },\n  { ten: \"Balo\", gia: 350000 },\n  { ten: \"Sổ tay\", gia: 45000 },\n  { ten: \"Tai nghe\", gia: 120000 }\n];\n\nconst tenSanPhamRe = ds => \n"),
      hint: "ds.filter(sp => sp.gia < 100000).map(sp => sp.ten)",
      solution: J("const sanPham = [\n  { ten: \"Bút\", gia: 15000 },\n  { ten: \"Balo\", gia: 350000 },\n  { ten: \"Sổ tay\", gia: 45000 },\n  { ten: \"Tai nghe\", gia: 120000 }\n];\n\nconst tenSanPhamRe = ds => ds.filter(sp => sp.gia < 100000).map(sp => sp.ten);\nconsole.log(tenSanPhamRe(sanPham));"),
      check: EQ + String.raw`
        if (typeof tenSanPhamRe !== "function") return {pass:false, msg:"Chưa có hàm tenSanPhamRe."};
        if (!/\.filter\(/.test(T.src) || !/\.map\(/.test(T.src)) return {pass:false, msg:"Hãy dùng filter và map."};
        if (!eq(tenSanPhamRe(sanPham), ["Bút", "Sổ tay"])) return {pass:false, msg:"Kết quả với mảng mẫu phải là [\"Bút\", \"Sổ tay\"]."};
        if (!eq(tenSanPhamRe([{ ten: "A", gia: 100000 }, { ten: "B", gia: 99999 }]), ["B"])) return {pass:false, msg:"Giá đúng 100000 không tính là 'dưới 100000'."};
        return {pass:true, msg:"Chuỗi filter → map đọc như một câu tiếng Việt: lọc rồi lấy tên."};`
    },
    {
      title: "reduce – tổng tiền giỏ hàng", level: 3,
      task: "Viết `tongTien(gioHang)` dùng `reduce` tính tổng `gia × soLuong` của mọi món (giỏ rỗng → `0`).",
      starter: J("const tongTien = gioHang => \n"),
      hint: "gioHang.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0) — đừng quên giá trị khởi tạo 0.",
      solution: J("const tongTien = gioHang => gioHang.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0);\n\nconsole.log(tongTien([{ gia: 20000, soLuong: 2 }, { gia: 5000, soLuong: 1 }]));"),
      check: String.raw`
        if (typeof tongTien !== "function") return {pass:false, msg:"Chưa có hàm tongTien."};
        if (!/\.reduce\(/.test(T.src)) return {pass:false, msg:"Hãy dùng reduce."};
        if (tongTien([{ gia: 20000, soLuong: 2 }, { gia: 5000, soLuong: 3 }]) !== 55000) return {pass:false, msg:"Với 20000×2 + 5000×3 phải ra 55000."};
        if (tongTien([]) !== 0) return {pass:false, msg:"Giỏ rỗng phải trả về 0 (nhớ giá trị khởi tạo của reduce)."};
        return {pass:true, msg:"reduce 'gom' cả mảng về một giá trị duy nhất."};`
    },
    {
      title: "Nhóm học sinh theo lớp", level: 4,
      task: "Viết `nhomTheoLop(ds)` dùng `reduce` trả về object dạng `{ \"<lớp>\": [tên, …] }`, tên trong mỗi lớp **sắp xếp A→Z** (dùng `localeCompare`).\nVí dụ: `[{ten:\"Bình\",lop:\"A1\"},{ten:\"An\",lop:\"A1\"},{ten:\"Chi\",lop:\"A2\"}]` → `{ A1: [\"An\",\"Bình\"], A2: [\"Chi\"] }`.",
      starter: J("function nhomTheoLop(ds) {\n  \n}\n"),
      hint: "const kq = ds.reduce((nhom, hs) => { (nhom[hs.lop] ||= []).push(hs.ten); return nhom; }, {});\nrồi Object.values(kq).forEach(arr => arr.sort((a, b) => a.localeCompare(b)));",
      solution: J("function nhomTheoLop(ds) {\n  const nhom = ds.reduce((kq, hs) => {\n    if (!kq[hs.lop]) kq[hs.lop] = [];\n    kq[hs.lop].push(hs.ten);\n    return kq;\n  }, {});\n  for (const lop in nhom) nhom[lop].sort((a, b) => a.localeCompare(b, \"vi\"));\n  return nhom;\n}\n\nconsole.log(nhomTheoLop([{ ten: \"Bình\", lop: \"A1\" }, { ten: \"An\", lop: \"A1\" }, { ten: \"Chi\", lop: \"A2\" }]));"),
      check: EQ + String.raw`
        if (typeof nhomTheoLop !== "function") return {pass:false, msg:"Chưa có hàm nhomTheoLop."};
        if (!/\.reduce\(/.test(T.src)) return {pass:false, msg:"Hãy dùng reduce."};
        const r = nhomTheoLop([{ ten: "Bình", lop: "A1" }, { ten: "An", lop: "A1" }, { ten: "Chi", lop: "A2" }, { ten: "Dũng", lop: "A2" }, { ten: "Anh", lop: "A2" }]);
        if (!r || !eq(r.A1, ["An", "Bình"]) || !eq(r.A2, ["Anh", "Chi", "Dũng"])) return {pass:false, msg:"Kết quả chưa đúng: " + JSON.stringify(r)};
        if (!eq(nhomTheoLop([]), {})) return {pass:false, msg:"Mảng rỗng → {}."};
        return {pass:true, msg:"Group by – thao tác cực kỳ phổ biến khi làm báo cáo, thống kê!"};`
    }
  ];

  P["js-async"] = [
    {
      title: "Hẹn giờ với setTimeout", level: 1,
      task: "Dùng `setTimeout` để in ra `Xong!` sau **200ms** (không in ngay lập tức).",
      starter: J("console.log(\"Bắt đầu\");\n// in \"Xong!\" sau 200ms\n"),
      hint: "setTimeout(() => console.log(\"Xong!\"), 200);",
      solution: J("console.log(\"Bắt đầu\");\nsetTimeout(() => {\n  console.log(\"Xong!\");\n}, 200);"),
      check: String.raw`
        if (T.logs.includes("Xong!")) return {pass:false, msg:"'Xong!' bị in ngay – cần chờ 200ms bằng setTimeout."};
        await T.sleep(300);
        if (!T.logs.includes("Xong!")) return {pass:false, msg:"Sau 200ms chưa thấy in 'Xong!'."};
        return {pass:true, msg:"JS không đứng chờ – nó hẹn giờ rồi làm việc khác trước."};`
    },
    {
      title: "Tự viết hàm chờ (sleep)", level: 2,
      task: "Viết `doi(ms)` trả về **Promise** hoàn thành sau `ms` mili-giây. Sau đó có thể dùng `await doi(500)`.",
      starter: J("function doi(ms) {\n  // return new Promise(...)\n}\n"),
      hint: "return new Promise(resolve => setTimeout(resolve, ms));",
      solution: J("function doi(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\n(async () => {\n  console.log(\"Chờ 1 giây...\");\n  await doi(1000);\n  console.log(\"Xong!\");\n})();"),
      check: String.raw`
        if (typeof doi !== "function") return {pass:false, msg:"Chưa có hàm doi."};
        const p = doi(120);
        if (!p || typeof p.then !== "function") return {pass:false, msg:"doi(ms) phải trả về một Promise."};
        const t0 = performance.now(); await p; const dt = performance.now() - t0;
        if (dt < 100) return {pass:false, msg:"Promise hoàn thành quá sớm (" + Math.round(dt) + "ms) – phải chờ đủ ms."};
        if (dt > 400) return {pass:false, msg:"Chờ quá lâu (" + Math.round(dt) + "ms)."};
        return {pass:true, msg:"Hàm 'sleep' này bạn sẽ dùng lại rất nhiều lần!"};`
    },
    {
      title: "Chạy song song với Promise.all", level: 3,
      task: "Có sẵn 2 hàm giả lập API: `layUser()` và `layDonHang()` (mỗi hàm mất 150ms). Viết `async function taiTrang()` gọi **song song** cả hai bằng `Promise.all`, trả về `{ user, donHang }`. Tổng thời gian phải **dưới 250ms**.",
      starter: J("const layUser = () => new Promise(r => setTimeout(() => r({ ten: \"Quảng\" }), 150));\nconst layDonHang = () => new Promise(r => setTimeout(() => r([{ id: 1 }, { id: 2 }]), 150));\n\nasync function taiTrang() {\n  // gọi tuần tự sẽ mất 300ms – hãy chạy song song\n}\n"),
      hint: "const [user, donHang] = await Promise.all([layUser(), layDonHang()]); return { user, donHang };",
      solution: J("const layUser = () => new Promise(r => setTimeout(() => r({ ten: \"Quảng\" }), 150));\nconst layDonHang = () => new Promise(r => setTimeout(() => r([{ id: 1 }, { id: 2 }]), 150));\n\nasync function taiTrang() {\n  const [user, donHang] = await Promise.all([layUser(), layDonHang()]);\n  return { user, donHang };\n}\n\ntaiTrang().then(kq => console.log(kq));"),
      check: String.raw`
        if (typeof taiTrang !== "function") return {pass:false, msg:"Chưa có hàm taiTrang."};
        const t0 = performance.now(); const r = await taiTrang(); const dt = performance.now() - t0;
        if (!r || !r.user || r.user.ten !== "Quảng" || !Array.isArray(r.donHang) || r.donHang.length !== 2) return {pass:false, msg:"Phải trả về { user, donHang } đúng dữ liệu."};
        if (dt >= 250) return {pass:false, msg:"Mất " + Math.round(dt) + "ms – đang chạy tuần tự. Dùng Promise.all để chạy song song."};
        return {pass:true, msg:"Nhanh gấp đôi! Promise.all là bí kíp tăng tốc khi gọi nhiều API."};`
    },
    {
      title: "Tự động thử lại khi lỗi (retry)", level: 4,
      task: "Viết `async function thuLai(fn, soLan)`: gọi `await fn()`; nếu lỗi thì **thử lại**, tối đa `soLan` lần. Thành công → trả về kết quả. Hết lượt vẫn lỗi → `throw` lỗi của **lần cuối**.",
      starter: J("async function thuLai(fn, soLan) {\n  \n}\n"),
      hint: "let loiCuoi; for (let i = 0; i < soLan; i++) { try { return await fn(); } catch (e) { loiCuoi = e; } } throw loiCuoi;",
      solution: J("async function thuLai(fn, soLan) {\n  let loiCuoi;\n  for (let lan = 1; lan <= soLan; lan++) {\n    try {\n      return await fn();\n    } catch (e) {\n      loiCuoi = e;\n      console.log(`Lần ${lan} lỗi: ${e.message}`);\n    }\n  }\n  throw loiCuoi;\n}"),
      check: String.raw`
        if (typeof thuLai !== "function") return {pass:false, msg:"Chưa có hàm thuLai."};
        let dem = 0;
        const loi2Lan = async () => { dem++; if (dem < 3) throw new Error("Lỗi " + dem); return "OK"; };
        let r; try { r = await thuLai(loi2Lan, 5); } catch (e) { return {pass:false, msg:"Hàm lỗi 2 lần rồi thành công – với 5 lượt phải trả về 'OK'."}; }
        if (r !== "OK" || dem !== 3) return {pass:false, msg:"Phải dừng ngay khi thành công (gọi đúng 3 lần, đang " + dem + ")."};
        dem = 0;
        const luonLoi = async () => { dem++; throw new Error("Hỏng lần " + dem); };
        try { await thuLai(luonLoi, 3); return {pass:false, msg:"Hết lượt vẫn lỗi thì phải throw."}; }
        catch (e) {
          if (dem !== 3) return {pass:false, msg:"Phải thử đúng 3 lần (đang " + dem + ")."};
          if (!e || e.message !== "Hỏng lần 3") return {pass:false, msg:"Phải ném ra lỗi của lần cuối cùng."};
        }
        return {pass:true, msg:"Retry giúp app 'chịu đựng' mạng chập chờn – kỹ thuật dùng trong mọi hệ thống lớn."};`
    }
  ];

  P["js-json-storage"] = [
    {
      title: "Object → chuỗi JSON", level: 1,
      task: "Cho `const sv = { ten: \"An\", tuoi: 20 }`. Tạo `const chuoi` là chuỗi JSON của `sv` và in ra.",
      starter: J("const sv = { ten: \"An\", tuoi: 20 };\n"),
      hint: "const chuoi = JSON.stringify(sv);",
      solution: J("const sv = { ten: \"An\", tuoi: 20 };\nconst chuoi = JSON.stringify(sv);\nconsole.log(chuoi);"),
      check: String.raw`
        if (typeof chuoi !== "string") return {pass:false, msg:"chuoi phải là kiểu string (dùng JSON.stringify)."};
        if (chuoi !== '{"ten":"An","tuoi":20}') return {pass:false, msg:"chuoi chưa đúng JSON của sv."};
        if (!T.logs.includes(chuoi)) return {pass:false, msg:"Hãy console.log(chuoi)."};
        return {pass:true, msg:"JSON là 'ngôn ngữ chung' để gửi dữ liệu giữa front-end và back-end."};`
    },
    {
      title: "Đọc JSON an toàn", level: 2,
      task: "Viết `docJSON(s)` trả về object khi `s` là JSON hợp lệ, trả về `null` nếu chuỗi **sai định dạng** (không được làm crash chương trình).",
      starter: J("function docJSON(s) {\n  \n}\n"),
      hint: "try { return JSON.parse(s); } catch (e) { return null; }",
      solution: J("function docJSON(s) {\n  try {\n    return JSON.parse(s);\n  } catch (e) {\n    return null;\n  }\n}"),
      check: String.raw`
        if (typeof docJSON !== "function") return {pass:false, msg:"Chưa có hàm docJSON."};
        const o = docJSON('{"a":1,"b":[2,3]}');
        if (!o || o.a !== 1 || o.b[1] !== 3) return {pass:false, msg:"JSON hợp lệ phải trả về object tương ứng."};
        let r; try { r = docJSON("{sai json"); } catch (e) { return {pass:false, msg:"JSON sai làm hàm bị lỗi – bọc JSON.parse trong try/catch."}; }
        if (r !== null) return {pass:false, msg:"JSON sai phải trả về null."};
        return {pass:true, msg:"Luôn phòng thủ khi đọc dữ liệu từ bên ngoài!"};`
    },
    {
      title: "Lưu cài đặt vào localStorage", level: 3,
      task: "Viết 2 hàm:\n• `luuCaiDat(obj)` – lưu `obj` vào localStorage với khoá `caiDat` (dạng JSON).\n• `docCaiDat()` – đọc lại object; nếu **chưa có** thì trả về mặc định `{ theme: \"light\" }`.",
      starter: J("function luuCaiDat(obj) {\n  \n}\n\nfunction docCaiDat() {\n  \n}\n"),
      hint: "localStorage.setItem(\"caiDat\", JSON.stringify(obj));\nconst s = localStorage.getItem(\"caiDat\"); return s ? JSON.parse(s) : { theme: \"light\" };",
      solution: J("function luuCaiDat(obj) {\n  localStorage.setItem(\"caiDat\", JSON.stringify(obj));\n}\n\nfunction docCaiDat() {\n  const s = localStorage.getItem(\"caiDat\");\n  return s ? JSON.parse(s) : { theme: \"light\" };\n}"),
      check: EQ + String.raw`
        if (typeof luuCaiDat !== "function" || typeof docCaiDat !== "function") return {pass:false, msg:"Cần 2 hàm luuCaiDat và docCaiDat."};
        localStorage.removeItem("caiDat");
        if (!eq(docCaiDat(), { theme: "light" })) return {pass:false, msg:"Chưa có dữ liệu → docCaiDat() trả về { theme: \"light\" }."};
        luuCaiDat({ theme: "dark", fontSize: 18 });
        if (localStorage.getItem("caiDat") !== '{"theme":"dark","fontSize":18}') return {pass:false, msg:"luuCaiDat phải lưu chuỗi JSON vào khoá 'caiDat'."};
        if (!eq(docCaiDat(), { theme: "dark", fontSize: 18 })) return {pass:false, msg:"docCaiDat() phải trả về đúng object đã lưu."};
        localStorage.removeItem("caiDat");
        return {pass:true, msg:"Giờ app của bạn đã 'nhớ' được cài đặt sau khi tải lại trang."};`
    },
    {
      title: "Bộ đếm lượt truy cập", level: 4,
      task: "Viết `tangLuot()`: đọc số lượt từ localStorage khoá `luotTruyCap` (chưa có = 0), **cộng 1**, lưu lại, cập nhật `#dem` thành `Bạn đã ghé <n> lần` và trả về `n` (kiểu số). Gọi `tangLuot()` ngay khi trang tải.",
      starter: D("<p id=\"dem\"></p>", "function tangLuot() {\n  \n}\n\ntangLuot();\n"),
      hint: "const n = Number(localStorage.getItem(\"luotTruyCap\") || 0) + 1; — localStorage chỉ lưu chuỗi, nhớ đổi sang số!",
      solution: D("<p id=\"dem\"></p>", "function tangLuot() {\n  const n = Number(localStorage.getItem(\"luotTruyCap\") || 0) + 1;\n  localStorage.setItem(\"luotTruyCap\", n);\n  document.querySelector(\"#dem\").textContent = `Bạn đã ghé ${n} lần`;\n  return n;\n}\n\ntangLuot();"),
      check: String.raw`
        if (typeof tangLuot !== "function") return {pass:false, msg:"Chưa có hàm tangLuot."};
        if (!/^Bạn đã ghé \d+ lần$/.test(T.$("#dem").textContent.trim())) return {pass:false, msg:"Khi tải trang, #dem phải hiện 'Bạn đã ghé <n> lần'."};
        localStorage.setItem("luotTruyCap", "5");
        const n = tangLuot();
        if (n !== 6) return {pass:false, msg:"Đang có 5 lượt → tangLuot() phải trả về số 6 (đang: " + JSON.stringify(n) + ")."};
        if (localStorage.getItem("luotTruyCap") !== "6") return {pass:false, msg:"Phải lưu lại giá trị mới vào localStorage."};
        if (T.$("#dem").textContent.trim() !== "Bạn đã ghé 6 lần") return {pass:false, msg:"#dem phải cập nhật thành 'Bạn đã ghé 6 lần'."};
        localStorage.removeItem("luotTruyCap");
        if (tangLuot() !== 1) return {pass:false, msg:"Chưa có dữ liệu thì lần đầu phải là 1."};
        return {pass:true, msg:"Bấm ▶ Chạy vài lần để thấy số lượt tăng dần!"};`
    }
  ];

  P["final-project"] = [
    {
      title: "Hàm tạo màu ngẫu nhiên", level: 1,
      task: "Viết `mauNgauNhien()` trả về chuỗi màu dạng `#RRGGBB` (6 ký tự hex) **ngẫu nhiên**.",
      starter: J("function mauNgauNhien() {\n  \n}\n"),
      hint: "\"#\" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, \"0\")",
      solution: J("function mauNgauNhien() {\n  const so = Math.floor(Math.random() * 0x1000000);\n  return \"#\" + so.toString(16).padStart(6, \"0\");\n}\nconsole.log(mauNgauNhien());"),
      check: String.raw`
        if (typeof mauNgauNhien !== "function") return {pass:false, msg:"Chưa có hàm mauNgauNhien."};
        const ds = Array.from({ length: 30 }, () => mauNgauNhien());
        const sai = ds.find(m => !/^#[0-9a-fA-F]{6}$/.test(m));
        if (sai !== undefined) return {pass:false, msg:"Màu phải đúng dạng #RRGGBB (đang có: " + sai + ") – nhớ padStart(6, \"0\")."};
        if (new Set(ds).size < 20) return {pass:false, msg:"Màu chưa đủ ngẫu nhiên."};
        return {pass:true, msg:"16.777.216 màu có thể xuất hiện! 🎨"};`
    },
    {
      title: "Đổi HEX sang RGB", level: 2,
      task: "Viết `hexToRgb(hex)` đổi `\"#ff8800\"` → `\"rgb(255, 136, 0)\"` (chấp nhận cả chữ hoa).",
      starter: J("function hexToRgb(hex) {\n  \n}\n"),
      hint: "parseInt(hex.slice(1, 3), 16) → kênh đỏ; slice(3, 5) → xanh lá; slice(5, 7) → xanh dương.",
      solution: J("function hexToRgb(hex) {\n  const r = parseInt(hex.slice(1, 3), 16);\n  const g = parseInt(hex.slice(3, 5), 16);\n  const b = parseInt(hex.slice(5, 7), 16);\n  return `rgb(${r}, ${g}, ${b})`;\n}\nconsole.log(hexToRgb(\"#16a34a\"));"),
      check: String.raw`
        if (typeof hexToRgb !== "function") return {pass:false, msg:"Chưa có hàm hexToRgb."};
        const cases = [["#ff8800", "rgb(255, 136, 0)"], ["#000000", "rgb(0, 0, 0)"], ["#FFFFFF", "rgb(255, 255, 255)"], ["#16a34a", "rgb(22, 163, 74)"]];
        for (const [h, kq] of cases) if (hexToRgb(h) !== kq) return {pass:false, msg:"hexToRgb(\"" + h + "\") phải là \"" + kq + "\" (đang: " + hexToRgb(h) + ")."};
        return {pass:true, msg:"parseInt(..., 16) đổi hệ 16 sang hệ 10 – kiến thức dùng cả trong lập trình PLC đấy!"};`
    },
    {
      title: "Lịch sử 5 màu gần nhất", level: 3,
      task: "Mỗi lần bấm `#btn`: đổi nền `body` sang màu mới, `#code` hiện mã màu, và **thêm màu đó lên đầu** danh sách `#history` (mỗi màu một `<li>`). Danh sách chỉ giữ **5 màu mới nhất**.",
      starter: D("<button id=\"btn\">🎨 Đổi màu</button>\n<h2 id=\"code\">#ffffff</h2>\n<ul id=\"history\"></ul>", "function mauNgauNhien() {\n  return \"#\" + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, \"0\");\n}\n\n"),
      hint: "history.prepend(li) thêm lên đầu; while (history.children.length > 5) history.lastElementChild.remove();",
      solution: D("<button id=\"btn\">🎨 Đổi màu</button>\n<h2 id=\"code\">#ffffff</h2>\n<ul id=\"history\"></ul>", "function mauNgauNhien() {\n  return \"#\" + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, \"0\");\n}\n\nconst history = document.querySelector(\"#history\");\ndocument.querySelector(\"#btn\").addEventListener(\"click\", () => {\n  const mau = mauNgauNhien();\n  document.body.style.background = mau;\n  document.querySelector(\"#code\").textContent = mau;\n  const li = document.createElement(\"li\");\n  li.textContent = mau;\n  history.prepend(li);\n  while (history.children.length > 5) history.lastElementChild.remove();\n});"),
      check: String.raw`
        const btn = T.$("#btn"), seen = [];
        for (let i = 0; i < 7; i++) { T.click(btn); seen.unshift(T.$("#code").textContent.trim()); }
        if (!/^#[0-9a-f]{6}$/i.test(seen[0])) return {pass:false, msg:"#code phải hiện mã màu #RRGGBB."};
        const lis = T.$$("#history li").map(li => li.textContent.trim());
        if (lis.length !== 5) return {pass:false, msg:"Sau 7 lần bấm, #history chỉ giữ 5 màu (đang có " + lis.length + ")."};
        if (lis.join() !== seen.slice(0, 5).join()) return {pass:false, msg:"Thứ tự sai: màu mới nhất phải ở trên cùng."};
        const tmp = document.createElement("div"); tmp.style.background = seen[0]; document.body.appendChild(tmp);
        const ok = T.css(document.body, "background-color") === T.css(tmp, "background-color"); tmp.remove();
        if (!ok) return {pass:false, msg:"Nền body phải là màu mới nhất."};
        return {pass:true, msg:"Thêm tính năng lịch sử – app của bạn ngày càng 'xịn'!"};`
    },
    {
      title: "Chữ tự tương phản + phím tắt", level: 4,
      task: "1) Viết `mauChu(hex)` trả về `\"#000\"` nếu màu nền **sáng** (độ sáng `0.299·R + 0.587·G + 0.114·B` **lớn hơn 150**), ngược lại `\"#fff\"`.\n2) Hàm `doiMau()` đổi nền body + `#code` + màu chữ của `#code` theo `mauChu`.\n3) Bấm `#btn` **hoặc** nhấn phím **Space** (`e.code === \"Space\"`) đều gọi `doiMau()`.",
      starter: D("<button id=\"btn\">🎨 Đổi màu (hoặc nhấn Space)</button>\n<h2 id=\"code\">#ffffff</h2>", "function mauNgauNhien() {\n  return \"#\" + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, \"0\");\n}\n\nfunction mauChu(hex) {\n  \n}\n\nfunction doiMau() {\n  \n}\n"),
      hint: "const r = parseInt(hex.slice(1,3),16)…; const sang = 0.299*r + 0.587*g + 0.114*b;\ndocument.addEventListener(\"keydown\", e => { if (e.code === \"Space\") { e.preventDefault(); doiMau(); } });",
      solution: D("<button id=\"btn\">🎨 Đổi màu (hoặc nhấn Space)</button>\n<h2 id=\"code\">#ffffff</h2>", "function mauNgauNhien() {\n  return \"#\" + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, \"0\");\n}\n\nfunction mauChu(hex) {\n  const r = parseInt(hex.slice(1, 3), 16);\n  const g = parseInt(hex.slice(3, 5), 16);\n  const b = parseInt(hex.slice(5, 7), 16);\n  const doSang = 0.299 * r + 0.587 * g + 0.114 * b;\n  return doSang > 150 ? \"#000\" : \"#fff\";\n}\n\nfunction doiMau() {\n  const mau = mauNgauNhien();\n  const code = document.querySelector(\"#code\");\n  document.body.style.background = mau;\n  code.textContent = mau;\n  code.style.color = mauChu(mau);\n}\n\ndocument.querySelector(\"#btn\").addEventListener(\"click\", doiMau);\ndocument.addEventListener(\"keydown\", e => {\n  if (e.code === \"Space\") {\n    e.preventDefault();\n    doiMau();\n  }\n});"),
      check: String.raw`
        if (typeof mauChu !== "function" || typeof doiMau !== "function") return {pass:false, msg:"Cần 2 hàm mauChu và doiMau."};
        const cases = [["#ffffff", "#000"], ["#000000", "#fff"], ["#facc15", "#000"], ["#1e3a8a", "#fff"], ["#16a34a", "#fff"]];
        for (const [h, kq] of cases) if (mauChu(h) !== kq) return {pass:false, msg:"mauChu(\"" + h + "\") phải là \"" + kq + "\"."};
        const code = T.$("#code");
        T.click(T.$("#btn"));
        const c1 = code.textContent.trim();
        if (!/^#[0-9a-f]{6}$/i.test(c1)) return {pass:false, msg:"Bấm #btn phải đổi màu và hiện mã ở #code."};
        const want = mauChu(c1) === "#000" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
        if (T.css(code, "color") !== want) return {pass:false, msg:"Màu chữ #code phải theo mauChu(màu nền)."};
        let doi = false;
        for (let i = 0; i < 3 && !doi; i++) { document.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", key: " ", bubbles: true })); doi = code.textContent.trim() !== c1; }
        if (!doi) return {pass:false, msg:"Nhấn phím Space cũng phải đổi màu."};
        return {pass:true, msg:"Tốt nghiệp dự án cuối! Chữ luôn dễ đọc trên mọi nền – đây là tư duy accessibility. 🏆"};`
    }
  ];
})();
