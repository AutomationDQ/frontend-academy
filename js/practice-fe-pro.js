/* =========================================================
   BÀI LUYỆN TẬP THÊM – Khoá 2: Front-end Nâng cao
   Bài trắc nghiệm luyện tập: { type: "quiz", questions: [{ q, code?, options, answer, explain }] }
   ========================================================= */
window.PRACTICE = window.PRACTICE || {};
(function () {
  const P = window.PRACTICE;
  const J = js => ({ html: "", css: "", js });
  const D = (html, js, css) => ({ html, css: css || "", js });
  const EQ = String.raw`const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);`;
  const throwsMsg = String.raw`const nem = fn => { try { fn(); return null; } catch (e) { return e; } };`;

  /* ===================== CÔNG CỤ ===================== */
  P["git-basics"] = [
    {
      type: "quiz", title: "Tình huống Git hằng ngày", level: 1,
      task: "5 tình huống thực tế khi làm việc với Git – chọn lệnh đúng.",
      hint: "add = chọn file, commit = lưu ảnh chụp, push = đẩy lên GitHub, pull = kéo về.",
      questions: [
        { q: "Bạn vừa sửa `style.css` và muốn đưa **chỉ file này** vào staging. Lệnh nào?", options: ["`git commit style.css`", "`git add style.css`", "`git push style.css`", "`git stage --all`"], answer: 1, explain: "`git add <file>` đưa file vào staging area để chuẩn bị commit." },
        { q: "Muốn xem những file nào đã thay đổi nhưng chưa commit?", options: ["`git log`", "`git diff --stat HEAD~5`", "`git status`", "`git show`"], answer: 2, explain: "`git status` liệt kê file đã sửa, đã staged và file mới chưa theo dõi." },
        { q: "Đồng nghiệp vừa push code mới lên `main`. Bạn muốn cập nhật về máy?", options: ["`git pull`", "`git push`", "`git clone` lại từ đầu", "`git commit --update`"], answer: 0, explain: "`git pull` = `git fetch` + `git merge`: tải thay đổi mới và gộp vào nhánh hiện tại." },
        { q: "Bạn lỡ tạo file `.env` chứa API key. Cách đúng để Git **không bao giờ** theo dõi file này?", options: ["Đổi tên thành `env.txt`", "Thêm `.env` vào file `.gitignore`", "Commit rồi xoá sau", "Đặt file trong thư mục ẩn"], answer: 1, explain: "`.gitignore` liệt kê các file/thư mục Git bỏ qua. Nếu đã lỡ commit thì phải đổi key vì lịch sử vẫn còn." },
        { q: "Lệnh nào xem **lịch sử commit** gọn trên một dòng mỗi commit?", options: ["`git status -s`", "`git history`", "`git log --oneline`", "`git branch -v`"], answer: 2, explain: "`git log --oneline` hiển thị mã băm rút gọn + thông điệp của từng commit." }
      ]
    },
    {
      title: "Kiểm tra commit message (Conventional Commits)", level: 3,
      task: "Nhiều team dùng chuẩn **Conventional Commits**: `<loại>(<phạm vi>): <mô tả>` – phạm vi không bắt buộc.\nViết `loaiCommit(msg)` trả về **loại** (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`) nếu message hợp lệ, ngược lại trả về `null`.\nHợp lệ: `\"feat: thêm trang đăng nhập\"`, `\"fix(form): sửa lỗi email\"`. Không hợp lệ: `\"update\"`, `\"feat:thiếu dấu cách\"`, `\"abc: xyz\"`, `\"fix: \"` (mô tả rỗng).",
      starter: J("function loaiCommit(msg) {\n  \n}\n\nconsole.log(loaiCommit(\"feat: thêm trang đăng nhập\")); // \"feat\"\nconsole.log(loaiCommit(\"update\"));                     // null\n"),
      hint: "Dùng regex: /^(feat|fix|docs|style|refactor|test|chore)(\\([\\w-]+\\))?: \\S.*$/ rồi lấy nhóm số 1 từ msg.match(...).",
      solution: J("function loaiCommit(msg) {\n  const m = msg.match(/^(feat|fix|docs|style|refactor|test|chore)(\\([\\w-]+\\))?: \\S.*$/);\n  return m ? m[1] : null;\n}\n\nconsole.log(loaiCommit(\"feat: thêm trang đăng nhập\")); // \"feat\"\nconsole.log(loaiCommit(\"update\"));                     // null"),
      check: String.raw`
        if (typeof loaiCommit !== "function") return {pass:false, msg:"Chưa có hàm loaiCommit."};
        const cases = [["feat: thêm trang đăng nhập", "feat"], ["fix(form): sửa lỗi email", "fix"], ["docs: cập nhật README", "docs"], ["chore(deps): nâng cấp vite", "chore"],
          ["update", null], ["feat:thiếu dấu cách", null], ["abc: xyz", null], ["fix: ", null], ["Feat: viết hoa", null], ["refactor(): rỗng", null]];
        for (const [m, kq] of cases) if (loaiCommit(m) !== kq) return {pass:false, msg:"loaiCommit(\"" + m + "\") phải là " + JSON.stringify(kq) + " (đang: " + JSON.stringify(loaiCommit(m)) + ")."};
        return {pass:true, msg:"Commit chuẩn giúp tự động tạo CHANGELOG và đánh số phiên bản!"};`
    },
    {
      type: "quiz", title: "Nhánh, merge & xung đột", level: 2,
      task: "5 câu hỏi về branch, merge, conflict và Pull Request.",
      hint: "Branch = dòng phát triển riêng. Conflict xảy ra khi 2 nhánh cùng sửa một chỗ.",
      questions: [
        { q: "Lệnh nào **tạo nhánh mới** `dang-nhap` và **chuyển sang** nó ngay?", options: ["`git branch dang-nhap`", "`git switch -c dang-nhap`", "`git merge dang-nhap`", "`git checkout main`"], answer: 1, explain: "`git switch -c` (hoặc `git checkout -b`) vừa tạo vừa chuyển nhánh. `git branch x` chỉ tạo, không chuyển." },
        { q: "Khi merge xuất hiện đoạn sau trong file. Đây là gì?", code: "<<<<<<< HEAD\n<h1>Xin chào</h1>\n=======\n<h1>Hello</h1>\n>>>>>>> tieng-anh", options: ["Lỗi cú pháp HTML", "Merge conflict – cần chọn/gộp nội dung rồi xoá các dấu <<< === >>>", "Git tự động gộp thành công", "Comment của Git"], answer: 1, explain: "Hai nhánh sửa cùng một dòng → conflict. Bạn sửa tay, xoá dấu đánh dấu, rồi `git add` + `git commit`." },
        { q: "Pull Request (PR) trên GitHub dùng để làm gì?", options: ["Kéo code từ GitHub về máy", "Đề nghị gộp một nhánh vào nhánh khác để mọi người review", "Xoá nhánh cũ", "Tạo bản sao repo"], answer: 1, explain: "PR là nơi thảo luận, review code và chạy kiểm tra tự động trước khi merge." },
        { q: "Bạn đang sửa dở nhưng cần chuyển nhánh gấp mà chưa muốn commit. Lệnh nào cất tạm thay đổi?", options: ["`git stash`", "`git reset --hard`", "`git clean -fd`", "`git revert`"], answer: 0, explain: "`git stash` cất tạm thay đổi; quay lại thì `git stash pop`. `reset --hard` sẽ XOÁ mất thay đổi!" },
        { q: "Commit sai đã được push lên `main` dùng chung. Cách **an toàn** để huỷ tác dụng của nó?", options: ["`git push --force` sau khi xoá commit", "`git revert <mã-commit>`", "Xoá repo tạo lại", "`git reset --hard HEAD~1` rồi push"], answer: 1, explain: "`git revert` tạo commit mới đảo ngược thay đổi – không viết lại lịch sử, không làm hỏng máy đồng nghiệp." }
      ]
    }
  ];

  P["npm-modules"] = [
    {
      type: "quiz", title: "package.json & Semantic Versioning", level: 1,
      task: "5 câu hỏi về npm, package.json và cách đánh số phiên bản.",
      hint: "Phiên bản MAJOR.MINOR.PATCH. ^ cho phép tăng MINOR + PATCH, ~ chỉ cho phép tăng PATCH.",
      questions: [
        { q: "Phiên bản `2.5.1` – con số `5` gọi là gì?", options: ["MAJOR", "MINOR", "PATCH", "BUILD"], answer: 1, explain: "MAJOR.MINOR.PATCH → 2 là MAJOR (thay đổi phá vỡ tương thích), 5 là MINOR (tính năng mới), 1 là PATCH (sửa lỗi)." },
        { q: "Trong package.json có `\"vite\": \"^5.2.0\"`. Phiên bản nào **được phép** cài?", options: ["`6.0.0`", "`5.9.3`", "`5.1.9`", "`4.9.9`"], answer: 1, explain: "`^5.2.0` = từ 5.2.0 đến dưới 6.0.0. Không được lên MAJOR 6, không được thấp hơn 5.2.0." },
        { q: "Thư viện chỉ dùng khi phát triển (vd công cụ test) nên cài bằng lệnh nào?", options: ["`npm install vitest`", "`npm install -D vitest`", "`npm install -g vitest`", "`npm run vitest`"], answer: 1, explain: "`-D` (--save-dev) đưa vào devDependencies – không cần khi chạy production." },
        { q: "Vì sao **không** commit thư mục `node_modules` lên Git?", options: ["Vì Git không đọc được file .js", "Vì rất nặng và có thể tạo lại bằng `npm install` từ package.json + package-lock.json", "Vì chứa mật khẩu", "Vì GitHub cấm"], answer: 1, explain: "node_modules có thể chứa hàng chục nghìn file; package-lock.json đảm bảo cài lại đúng phiên bản." },
        { q: "Trong `\"scripts\": { \"dev\": \"vite\" }`, chạy script này thế nào?", options: ["`npm dev`", "`node dev`", "`npm run dev`", "`vite run dev`"], answer: 2, explain: "Script tuỳ chỉnh chạy bằng `npm run <tên>` (riêng start/test có thể gọi tắt `npm start`, `npm test`)." }
      ]
    },
    {
      title: "So sánh hai phiên bản", level: 3,
      task: "Viết `soSanhPhienBan(a, b)` so sánh 2 phiên bản dạng `\"x.y.z\"`: trả về `1` nếu a mới hơn, `-1` nếu a cũ hơn, `0` nếu bằng nhau.\n⚠️ So sánh **theo số**, không theo chuỗi: `\"1.10.0\"` mới hơn `\"1.9.3\"`.",
      starter: J("function soSanhPhienBan(a, b) {\n  \n}\n\nconsole.log(soSanhPhienBan(\"1.10.0\", \"1.9.3\")); // 1\n"),
      hint: "const x = a.split(\".\").map(Number), y = b.split(\".\").map(Number); so từng phần từ trái qua phải.",
      solution: J("function soSanhPhienBan(a, b) {\n  const x = a.split(\".\").map(Number);\n  const y = b.split(\".\").map(Number);\n  for (let i = 0; i < 3; i++) {\n    if (x[i] > y[i]) return 1;\n    if (x[i] < y[i]) return -1;\n  }\n  return 0;\n}\n\nconsole.log(soSanhPhienBan(\"1.10.0\", \"1.9.3\")); // 1"),
      check: String.raw`
        if (typeof soSanhPhienBan !== "function") return {pass:false, msg:"Chưa có hàm soSanhPhienBan."};
        const cases = [["1.10.0", "1.9.3", 1], ["1.9.3", "1.10.0", -1], ["2.0.0", "2.0.0", 0], ["2.0.0", "1.99.99", 1], ["0.0.9", "0.0.10", -1], ["3.1.4", "3.1.2", 1]];
        for (const [a, b, kq] of cases) if (soSanhPhienBan(a, b) !== kq) return {pass:false, msg:"soSanhPhienBan(\"" + a + "\", \"" + b + "\") phải là " + kq + " (đang: " + soSanhPhienBan(a, b) + ")."};
        return {pass:true, msg:"npm dùng đúng logic này để quyết định có cần cập nhật thư viện hay không."};`
    },
    {
      title: "Phiên bản có thoả ^ và ~ không?", level: 4,
      task: "Viết `thoaMan(range, ver)` trả về `true`/`false`:\n• `\"1.2.3\"` (không ký hiệu) → phải **bằng đúng**.\n• `\"~1.2.3\"` → cùng MAJOR và MINOR, PATCH **≥ 3**.\n• `\"^1.2.3\"` → cùng MAJOR và phiên bản **≥ 1.2.3**.\n(Bỏ qua trường hợp đặc biệt của MAJOR = 0.)",
      starter: J("function thoaMan(range, ver) {\n  \n}\n"),
      hint: "Tách ký hiệu đầu: const kh = range[0]; const goc = kh === \"^\" || kh === \"~\" ? range.slice(1) : range; rồi so sánh từng phần số.",
      solution: J("function thoaMan(range, ver) {\n  const kh = range[0];\n  const goc = (kh === \"^\" || kh === \"~\" ? range.slice(1) : range).split(\".\").map(Number);\n  const v = ver.split(\".\").map(Number);\n  const lonHonBang = v[0] > goc[0] || (v[0] === goc[0] && (v[1] > goc[1] || (v[1] === goc[1] && v[2] >= goc[2])));\n  if (kh === \"^\") return v[0] === goc[0] && lonHonBang;\n  if (kh === \"~\") return v[0] === goc[0] && v[1] === goc[1] && v[2] >= goc[2];\n  return v.join(\".\") === goc.join(\".\");\n}"),
      check: String.raw`
        if (typeof thoaMan !== "function") return {pass:false, msg:"Chưa có hàm thoaMan."};
        const cases = [["1.2.3", "1.2.3", true], ["1.2.3", "1.2.4", false], ["~1.2.3", "1.2.9", true], ["~1.2.3", "1.3.0", false], ["~1.2.3", "1.2.2", false],
          ["^1.2.3", "1.9.0", true], ["^1.2.3", "1.2.3", true], ["^1.2.3", "2.0.0", false], ["^1.2.3", "1.2.2", false], ["^1.2.3", "1.1.9", false], ["^5.0.0", "5.10.2", true]];
        for (const [r, v, kq] of cases) if (thoaMan(r, v) !== kq) return {pass:false, msg:"thoaMan(\"" + r + "\", \"" + v + "\") phải là " + kq + "."};
        return {pass:true, msg:"Bạn vừa tự viết lại một phần lõi của npm! 📦"};`
    }
  ];

  P["devtools-debug"] = [
    {
      title: "Sửa hàm tính điểm trung bình", level: 2,
      task: "Hàm `diemTrungBinh(ds)` có **2 lỗi** (vòng lặp chạy quá 1 phần tử, cộng chuỗi thay vì số). Sửa để `diemTrungBinh([\"8\", \"9\", \"7\"])` → `8` (số). Mảng rỗng → `0`.",
      starter: J("function diemTrungBinh(ds) {\n  let tong = 0;\n  for (let i = 0; i <= ds.length; i++) {\n    tong = tong + ds[i];\n  }\n  return tong / ds.length;\n}\n\nconsole.log(diemTrungBinh([\"8\", \"9\", \"7\"])); // mong đợi 8\n"),
      hint: "Đặt breakpoint hoặc console.log(i, ds[i], tong) trong vòng lặp. i < ds.length; Number(ds[i]); và xử lý mảng rỗng (0/0 = NaN).",
      solution: J("function diemTrungBinh(ds) {\n  if (ds.length === 0) return 0;\n  let tong = 0;\n  for (let i = 0; i < ds.length; i++) {\n    tong = tong + Number(ds[i]);\n  }\n  return tong / ds.length;\n}\n\nconsole.log(diemTrungBinh([\"8\", \"9\", \"7\"])); // 8"),
      check: String.raw`
        if (typeof diemTrungBinh !== "function") return {pass:false, msg:"Không tìm thấy hàm diemTrungBinh."};
        const r = diemTrungBinh(["8", "9", "7"]);
        if (r !== 8) return {pass:false, msg:"diemTrungBinh([\"8\",\"9\",\"7\"]) phải là số 8 (đang: " + JSON.stringify(r) + ")."};
        if (diemTrungBinh([10, 5]) !== 7.5) return {pass:false, msg:"diemTrungBinh([10, 5]) phải là 7.5."};
        if (diemTrungBinh([]) !== 0) return {pass:false, msg:"Mảng rỗng phải trả về 0 (không phải NaN)."};
        return {pass:true, msg:"Debug xong! Lỗi 'lệch 1' (off-by-one) và cộng chuỗi là hai lỗi kinh điển."};`
    },
    {
      title: "Quên await", level: 3,
      task: "`chaoNguoiDung()` in ra `Xin chào, [object Promise]` thay vì tên. Hãy sửa để hàm trả về `\"Xin chào, Quảng\"`.",
      starter: J("function layTen() {\n  return new Promise(r => setTimeout(() => r(\"Quảng\"), 50));\n}\n\nasync function chaoNguoiDung() {\n  const ten = layTen();\n  return \"Xin chào, \" + ten;\n}\n\nchaoNguoiDung().then(console.log);\n"),
      hint: "layTen() trả về Promise, cần chờ kết quả: const ten = await layTen();",
      solution: J("function layTen() {\n  return new Promise(r => setTimeout(() => r(\"Quảng\"), 50));\n}\n\nasync function chaoNguoiDung() {\n  const ten = await layTen();\n  return \"Xin chào, \" + ten;\n}\n\nchaoNguoiDung().then(console.log);"),
      check: String.raw`
        if (typeof chaoNguoiDung !== "function") return {pass:false, msg:"Không tìm thấy hàm chaoNguoiDung."};
        const r = await chaoNguoiDung();
        if (r !== "Xin chào, Quảng") return {pass:false, msg:"Kết quả đang là: \"" + r + "\" – thiếu await?"};
        return {pass:true, msg:"Thấy [object Promise] → gần như chắc chắn là quên await!"};`
    },
    {
      title: "Tìm sản phẩm theo id", level: 3,
      task: "`timSanPham(ds, id)` luôn trả về sản phẩm đầu tiên. Lý do: dùng `=` (gán) thay vì so sánh, và `id` nhận từ URL là **chuỗi**. Sửa để `timSanPham(ds, \"2\")` trả về sản phẩm id 2; không có thì trả về `null`.",
      starter: J("const ds = [\n  { id: 1, ten: \"Bút\" },\n  { id: 2, ten: \"Vở\" },\n  { id: 3, ten: \"Thước\" }\n];\n\nfunction timSanPham(ds, id) {\n  for (const sp of ds) {\n    if (sp.id = id) return sp;\n  }\n}\n\nconsole.log(timSanPham(ds, \"2\")); // mong đợi { id: 2, ten: \"Vở\" }\n"),
      hint: "Dùng === và đổi id sang số: sp.id === Number(id). Cuối hàm return null. Hoặc: return ds.find(sp => sp.id === Number(id)) ?? null;",
      solution: J("const ds = [\n  { id: 1, ten: \"Bút\" },\n  { id: 2, ten: \"Vở\" },\n  { id: 3, ten: \"Thước\" }\n];\n\nfunction timSanPham(ds, id) {\n  return ds.find(sp => sp.id === Number(id)) ?? null;\n}\n\nconsole.log(timSanPham(ds, \"2\"));"),
      check: String.raw`
        if (typeof timSanPham !== "function") return {pass:false, msg:"Không tìm thấy hàm timSanPham."};
        const data = [{ id: 1, ten: "Bút" }, { id: 2, ten: "Vở" }, { id: 3, ten: "Thước" }];
        const r = timSanPham(data, "2");
        if (!r || r.ten !== "Vở") return {pass:false, msg:"timSanPham(ds, \"2\") phải trả về sản phẩm 'Vở'."};
        if (data[0].id !== 1) return {pass:false, msg:"Hàm đang SỬA dữ liệu gốc (dấu = là phép gán!)."};
        if (timSanPham(data, 3).ten !== "Thước") return {pass:false, msg:"Truyền số 3 cũng phải tìm được."};
        if (timSanPham(data, "9") !== null) return {pass:false, msg:"Không tìm thấy phải trả về null."};
        return {pass:true, msg:"Bật ESLint sẽ cảnh báo ngay lỗi 'gán trong điều kiện' này."};`
    }
  ];

  /* ===================== JS HIỆN ĐẠI ===================== */
  P["js-destructuring"] = [
    {
      title: "Bóc tách object & mảng", level: 1,
      task: "Dùng **destructuring** (không dùng `nguoi.ten`…):\n• Lấy `ten` và `thanhPho` (nằm trong `diaChi`) từ `nguoi`.\n• Lấy phần tử **đầu** vào `dau` và phần tử **thứ ba** vào `thuBa` từ `mau` (bỏ qua phần tử thứ hai).",
      starter: J("const nguoi = { ten: \"Quảng\", tuoi: 23, diaChi: { thanhPho: \"Hà Nội\" } };\nconst mau = [\"đỏ\", \"xanh\", \"vàng\", \"tím\"];\n\n// const { ... } = nguoi;\n// const [ ... ] = mau;\n"),
      hint: "const { ten, diaChi: { thanhPho } } = nguoi;\nconst [dau, , thuBa] = mau;",
      solution: J("const nguoi = { ten: \"Quảng\", tuoi: 23, diaChi: { thanhPho: \"Hà Nội\" } };\nconst mau = [\"đỏ\", \"xanh\", \"vàng\", \"tím\"];\n\nconst { ten, diaChi: { thanhPho } } = nguoi;\nconst [dau, , thuBa] = mau;\nconsole.log(ten, thanhPho, dau, thuBa);"),
      check: String.raw`
        if (typeof ten === "undefined" || ten !== "Quảng") return {pass:false, msg:"Biến ten phải là 'Quảng'."};
        if (typeof thanhPho === "undefined" || thanhPho !== "Hà Nội") return {pass:false, msg:"Biến thanhPho phải là 'Hà Nội'."};
        if (typeof dau === "undefined" || dau !== "đỏ" || typeof thuBa === "undefined" || thuBa !== "vàng") return {pass:false, msg:"dau phải là 'đỏ', thuBa phải là 'vàng'."};
        if (/nguoi\.|mau\[/.test(T.src)) return {pass:false, msg:"Hãy dùng destructuring thay vì nguoi.xxx hay mau[i]."};
        return {pass:true, msg:"Destructuring giúp code ngắn và dễ đọc hơn hẳn."};`
    },
    {
      title: "Spread – không sửa dữ liệu gốc", level: 2,
      task: "Viết 2 hàm **không làm thay đổi** đối số:\n• `themMon(gio, mon)` → mảng **mới** có thêm `mon` ở cuối.\n• `capNhat(obj, thayDoi)` → object **mới** gộp `obj` với `thayDoi` (thayDoi ghi đè).",
      starter: J("function themMon(gio, mon) {\n  \n}\n\nfunction capNhat(obj, thayDoi) {\n  \n}\n"),
      hint: "return [...gio, mon];  và  return { ...obj, ...thayDoi };",
      solution: J("function themMon(gio, mon) {\n  return [...gio, mon];\n}\n\nfunction capNhat(obj, thayDoi) {\n  return { ...obj, ...thayDoi };\n}"),
      check: EQ + String.raw`
        if (typeof themMon !== "function" || typeof capNhat !== "function") return {pass:false, msg:"Cần 2 hàm themMon và capNhat."};
        const g = ["Bút"]; const g2 = themMon(g, "Vở");
        if (!eq(g2, ["Bút", "Vở"])) return {pass:false, msg:"themMon([\"Bút\"], \"Vở\") phải là [\"Bút\", \"Vở\"]."};
        if (g.length !== 1 || g2 === g) return {pass:false, msg:"themMon không được sửa mảng gốc (đừng dùng push)."};
        const o = { ten: "An", tuoi: 20 }; const o2 = capNhat(o, { tuoi: 21, lop: "12A" });
        if (!eq(o2, { ten: "An", tuoi: 21, lop: "12A" })) return {pass:false, msg:"capNhat chưa gộp đúng: " + JSON.stringify(o2)};
        if (o.tuoi !== 20 || o2 === o) return {pass:false, msg:"capNhat không được sửa object gốc."};
        return {pass:true, msg:"Bất biến (immutable) là nguyên tắc cốt lõi của React/Redux."};`
    },
    {
      title: "Rest, optional chaining & ??", level: 3,
      task: "• `layEmail(user)` trả về `user.lienHe.email` nếu có, **an toàn** khi `user`/`lienHe` không tồn tại; thiếu thì trả về `\"Chưa có email\"`. Dùng `?.` và `??`.\n• `tong(...cacSo)` nhận số lượng tham số tuỳ ý, trả về tổng (không có tham số → `0`).",
      starter: J("function layEmail(user) {\n  \n}\n\nfunction tong(...cacSo) {\n  \n}\n"),
      hint: "return user?.lienHe?.email ?? \"Chưa có email\";\nreturn cacSo.reduce((t, x) => t + x, 0);",
      solution: J("function layEmail(user) {\n  return user?.lienHe?.email ?? \"Chưa có email\";\n}\n\nfunction tong(...cacSo) {\n  return cacSo.reduce((t, x) => t + x, 0);\n}"),
      check: String.raw`
        if (typeof layEmail !== "function" || typeof tong !== "function") return {pass:false, msg:"Cần 2 hàm layEmail và tong."};
        if (!/\?\./.test(T.src) || !/\?\?/.test(T.src)) return {pass:false, msg:"Hãy dùng ?. và ??."};
        try {
          if (layEmail({ lienHe: { email: "a@b.com" } }) !== "a@b.com") return {pass:false, msg:"Có email thì trả về email."};
          if (layEmail({}) !== "Chưa có email" || layEmail(null) !== "Chưa có email" || layEmail(undefined) !== "Chưa có email") return {pass:false, msg:"Thiếu dữ liệu phải trả về 'Chưa có email'."};
          if (layEmail({ lienHe: { email: "" } }) !== "") return {pass:false, msg:"Email rỗng \"\" vẫn là giá trị (?? chỉ thay null/undefined)."};
        } catch (e) { return {pass:false, msg:"layEmail bị lỗi khi thiếu dữ liệu: " + e.message}; }
        if (tong(1, 2, 3) !== 6 || tong() !== 0 || tong(10) !== 10) return {pass:false, msg:"tong(1,2,3) = 6, tong() = 0, tong(10) = 10."};
        return {pass:true, msg:"Hết cảnh 'Cannot read properties of undefined'! 🎉"};`
    }
  ];

  P["js-classes"] = [
    {
      title: "Class hình chữ nhật", level: 1,
      task: "Tạo `class HinhChuNhat` với `constructor(dai, rong)` và 2 phương thức `dienTich()`, `chuVi()`.",
      starter: J("class HinhChuNhat {\n  \n}\n\nconst h = new HinhChuNhat(4, 3);\nconsole.log(h.dienTich(), h.chuVi()); // 12 14\n"),
      hint: "constructor(dai, rong) { this.dai = dai; this.rong = rong; } dienTich() { return this.dai * this.rong; }",
      solution: J("class HinhChuNhat {\n  constructor(dai, rong) {\n    this.dai = dai;\n    this.rong = rong;\n  }\n  dienTich() {\n    return this.dai * this.rong;\n  }\n  chuVi() {\n    return 2 * (this.dai + this.rong);\n  }\n}\n\nconst h = new HinhChuNhat(4, 3);\nconsole.log(h.dienTich(), h.chuVi()); // 12 14"),
      check: String.raw`
        if (typeof HinhChuNhat !== "function") return {pass:false, msg:"Chưa có class HinhChuNhat."};
        const h = new HinhChuNhat(4, 3), k = new HinhChuNhat(10, 0.5);
        if (h.dienTich() !== 12 || h.chuVi() !== 14) return {pass:false, msg:"HinhChuNhat(4, 3): diện tích 12, chu vi 14."};
        if (k.dienTich() !== 5 || k.chuVi() !== 21) return {pass:false, msg:"HinhChuNhat(10, 0.5): diện tích 5, chu vi 21."};
        return {pass:true, msg:"Class = bản thiết kế, mỗi new tạo ra một 'sản phẩm' riêng."};`
    },
    {
      title: "Kế thừa với extends & super", level: 2,
      task: "• `class DongVat`: `constructor(ten)`, phương thức `gioiThieu()` trả về `\"Tôi là <ten>\"`.\n• `class Cho extends DongVat`: `keu()` trả về `\"<ten>: Gâu gâu!\"` và **ghi đè** `gioiThieu()` thành `\"Tôi là <ten>, một chú chó\"` (gọi lại bản gốc bằng `super.gioiThieu()`).",
      starter: J("class DongVat {\n  \n}\n\nclass Cho extends DongVat {\n  \n}\n"),
      hint: "gioiThieu() { return super.gioiThieu() + \", một chú chó\"; }",
      solution: J("class DongVat {\n  constructor(ten) {\n    this.ten = ten;\n  }\n  gioiThieu() {\n    return \"Tôi là \" + this.ten;\n  }\n}\n\nclass Cho extends DongVat {\n  keu() {\n    return this.ten + \": Gâu gâu!\";\n  }\n  gioiThieu() {\n    return super.gioiThieu() + \", một chú chó\";\n  }\n}\n\nconsole.log(new Cho(\"Milu\").gioiThieu());"),
      check: String.raw`
        if (typeof DongVat !== "function" || typeof Cho !== "function") return {pass:false, msg:"Cần 2 class DongVat và Cho."};
        const d = new DongVat("Mèo"), c = new Cho("Milu");
        if (!(c instanceof DongVat)) return {pass:false, msg:"Cho phải extends DongVat."};
        if (d.gioiThieu() !== "Tôi là Mèo") return {pass:false, msg:"DongVat.gioiThieu() phải là 'Tôi là <ten>'."};
        if (c.keu() !== "Milu: Gâu gâu!") return {pass:false, msg:"Cho.keu() phải là 'Milu: Gâu gâu!'."};
        if (c.gioiThieu() !== "Tôi là Milu, một chú chó") return {pass:false, msg:"Cho.gioiThieu() phải là 'Tôi là Milu, một chú chó'."};
        if (!/super\.gioiThieu\(\)/.test(T.src)) return {pass:false, msg:"Hãy gọi lại bản gốc bằng super.gioiThieu()."};
        return {pass:true, msg:"Kế thừa giúp tái sử dụng code – nhưng đừng lạm dụng nhé!"};`
    },
    {
      title: "Getter, setter & static", level: 3,
      task: "Tạo `class NhietDo`:\n• Lưu nhiệt độ C trong trường private `#c` (`constructor(c)`).\n• `get f` trả về độ F (`c × 1.8 + 32`); `set f(giaTri)` cập nhật lại `#c`.\n• `static tuF(f)` tạo đối tượng NhietDo mới từ độ F.",
      starter: J("class NhietDo {\n  #c;\n  \n}\n"),
      hint: "get f() { return this.#c * 1.8 + 32; }  set f(v) { this.#c = (v - 32) / 1.8; }  static tuF(f) { const t = new NhietDo(0); t.f = f; return t; }  — thêm get c() để đọc độ C.",
      solution: J("class NhietDo {\n  #c;\n  constructor(c) {\n    this.#c = c;\n  }\n  get c() {\n    return this.#c;\n  }\n  get f() {\n    return this.#c * 1.8 + 32;\n  }\n  set f(giaTri) {\n    this.#c = (giaTri - 32) / 1.8;\n  }\n  static tuF(f) {\n    const t = new NhietDo(0);\n    t.f = f;\n    return t;\n  }\n}\n\nconsole.log(new NhietDo(100).f); // 212"),
      check: String.raw`
        if (typeof NhietDo !== "function") return {pass:false, msg:"Chưa có class NhietDo."};
        const t = new NhietDo(100);
        if (t.f !== 212) return {pass:false, msg:"new NhietDo(100).f phải là 212."};
        if ("c" in t && Object.keys(t).includes("c")) return {pass:false, msg:"Lưu độ C trong trường private #c, không phải this.c."};
        t.f = 32;
        if (Math.abs(t.f - 32) > 1e-9) return {pass:false, msg:"Sau khi gán f = 32 thì đọc lại f phải là 32."};
        if (typeof NhietDo.tuF !== "function") return {pass:false, msg:"Thiếu static tuF(f)."};
        const u = NhietDo.tuF(212);
        if (!(u instanceof NhietDo) || Math.abs(u.f - 212) > 1e-9) return {pass:false, msg:"NhietDo.tuF(212) phải tạo đối tượng có f = 212."};
        if (!/#c/.test(T.src)) return {pass:false, msg:"Hãy dùng trường private #c."};
        return {pass:true, msg:"Getter/setter cho phép 'tính toán khi đọc' mà vẫn dùng như thuộc tính."};`
    }
  ];

  P["js-errors-fetch"] = [
    {
      title: "throw, try/catch/finally", level: 1,
      task: "• `chia(a, b)` ném `new Error(\"Không thể chia cho 0\")` khi `b === 0`, ngược lại trả về `a / b`.\n• `chiaAnToan(a, b)` gọi `chia`; lỗi thì trả về **thông điệp lỗi** (chuỗi) thay vì làm crash.",
      starter: J("function chia(a, b) {\n  \n}\n\nfunction chiaAnToan(a, b) {\n  \n}\n"),
      hint: "try { return chia(a, b); } catch (e) { return e.message; }",
      solution: J("function chia(a, b) {\n  if (b === 0) throw new Error(\"Không thể chia cho 0\");\n  return a / b;\n}\n\nfunction chiaAnToan(a, b) {\n  try {\n    return chia(a, b);\n  } catch (e) {\n    return e.message;\n  } finally {\n    console.log(\"Đã thử chia\", a, \"cho\", b);\n  }\n}"),
      check: throwsMsg + String.raw`
        if (typeof chia !== "function" || typeof chiaAnToan !== "function") return {pass:false, msg:"Cần 2 hàm chia và chiaAnToan."};
        if (chia(10, 4) !== 2.5) return {pass:false, msg:"chia(10, 4) phải là 2.5."};
        const e = nem(() => chia(1, 0));
        if (!(e instanceof Error) || e.message !== "Không thể chia cho 0") return {pass:false, msg:"chia(1, 0) phải throw Error('Không thể chia cho 0')."};
        let r; try { r = chiaAnToan(1, 0); } catch (x) { return {pass:false, msg:"chiaAnToan không được để lỗi lọt ra ngoài."}; }
        if (r !== "Không thể chia cho 0") return {pass:false, msg:"chiaAnToan(1, 0) phải trả về thông điệp lỗi."};
        if (chiaAnToan(9, 3) !== 3) return {pass:false, msg:"chiaAnToan(9, 3) phải là 3."};
        return {pass:true, msg:"Ném lỗi ở nơi phát hiện, bắt lỗi ở nơi xử lý được."};`
    },
    {
      title: "Lớp lỗi tuỳ chỉnh", level: 2,
      task: "• Tạo `class LoiDuLieu extends Error` có `constructor(truong, message)`: gọi `super(message)`, lưu `this.truong`, đặt `this.name = \"LoiDuLieu\"`.\n• `kiemTraTuoi(t)`: không phải số nguyên hoặc ngoài 1–120 → ném `new LoiDuLieu(\"tuoi\", \"Tuổi không hợp lệ\")`; hợp lệ → trả về `true`.",
      starter: J("class LoiDuLieu extends Error {\n  \n}\n\nfunction kiemTraTuoi(t) {\n  \n}\n"),
      hint: "if (!Number.isInteger(t) || t < 1 || t > 120) throw new LoiDuLieu(\"tuoi\", \"Tuổi không hợp lệ\");",
      solution: J("class LoiDuLieu extends Error {\n  constructor(truong, message) {\n    super(message);\n    this.truong = truong;\n    this.name = \"LoiDuLieu\";\n  }\n}\n\nfunction kiemTraTuoi(t) {\n  if (!Number.isInteger(t) || t < 1 || t > 120) throw new LoiDuLieu(\"tuoi\", \"Tuổi không hợp lệ\");\n  return true;\n}"),
      check: throwsMsg + String.raw`
        if (typeof LoiDuLieu !== "function" || typeof kiemTraTuoi !== "function") return {pass:false, msg:"Cần class LoiDuLieu và hàm kiemTraTuoi."};
        if (kiemTraTuoi(23) !== true) return {pass:false, msg:"kiemTraTuoi(23) phải trả về true."};
        for (const t of [0, 121, 20.5, "20"]) {
          const e = nem(() => kiemTraTuoi(t));
          if (!(e instanceof LoiDuLieu)) return {pass:false, msg:"kiemTraTuoi(" + JSON.stringify(t) + ") phải ném LoiDuLieu."};
          if (!(e instanceof Error) || e.name !== "LoiDuLieu" || e.truong !== "tuoi" || e.message !== "Tuổi không hợp lệ") return {pass:false, msg:"Lỗi cần name 'LoiDuLieu', truong 'tuoi', message 'Tuổi không hợp lệ'."};
        }
        return {pass:true, msg:"Lỗi tuỳ chỉnh giúp phân biệt 'lỗi người dùng nhập sai' với 'lỗi hệ thống'."};`
    },
    {
      title: "Giới hạn thời gian chờ (timeout)", level: 3,
      task: "Viết `voiTimeout(promise, ms)` trả về Promise:\n• Nếu `promise` xong **trước** `ms` → trả kết quả của nó.\n• Nếu quá `ms` → reject với `new Error(\"Hết thời gian\")`.\nGợi ý: `Promise.race`.",
      starter: J("function voiTimeout(promise, ms) {\n  \n}\n"),
      hint: "const hen = new Promise((_, reject) => setTimeout(() => reject(new Error(\"Hết thời gian\")), ms));\nreturn Promise.race([promise, hen]);",
      solution: J("function voiTimeout(promise, ms) {\n  const hetGio = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error(\"Hết thời gian\")), ms)\n  );\n  return Promise.race([promise, hetGio]);\n}\n\n// Dùng thật: voiTimeout(fetch(url), 5000)"),
      check: String.raw`
        if (typeof voiTimeout !== "function") return {pass:false, msg:"Chưa có hàm voiTimeout."};
        const cham = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));
        const r1 = await voiTimeout(cham("nhanh", 30), 200);
        if (r1 !== "nhanh") return {pass:false, msg:"Promise xong trước thời hạn phải trả về kết quả của nó."};
        const t0 = performance.now();
        try { await voiTimeout(cham("chậm", 1000), 80); return {pass:false, msg:"Quá thời hạn phải reject."}; }
        catch (e) {
          if (!e || e.message !== "Hết thời gian") return {pass:false, msg:"Lỗi phải có message 'Hết thời gian'."};
          if (performance.now() - t0 > 400) return {pass:false, msg:"Phải reject ngay khi hết ms, không chờ promise gốc."};
        }
        return {pass:true, msg:"Không request nào được phép treo vô hạn – UX tốt hơn hẳn!"};`
    }
  ];

  P["typescript-basics"] = [
    {
      type: "quiz", title: "Kiểu dữ liệu & interface", level: 1,
      task: "Đọc code TypeScript và chọn đáp án đúng.",
      hint: "TypeScript kiểm tra kiểu lúc biên dịch – khi chạy, nó chỉ là JavaScript.",
      questions: [
        { q: "Dòng nào báo lỗi khi biên dịch?", code: "let tuoi: number = 23;\ntuoi = \"hai mươi ba\";", options: ["Dòng 1", "Dòng 2", "Không dòng nào", "Cả hai dòng"], answer: 1, explain: "tuoi có kiểu number, gán chuỗi sẽ lỗi: Type 'string' is not assignable to type 'number'." },
        { q: "Dấu `?` trong `email?: string` nghĩa là gì?", code: "interface User {\n  ten: string;\n  email?: string;\n}", options: ["email bắt buộc", "email không bắt buộc (có thể undefined)", "email là chuỗi rỗng", "email chỉ đọc"], answer: 1, explain: "`?` đánh dấu thuộc tính tuỳ chọn – kiểu thực tế là `string | undefined`." },
        { q: "Kiểu của `ketQua` là gì?", code: "function cong(a: number, b: number) {\n  return a + b;\n}\nconst ketQua = cong(2, 3);", options: ["any", "string", "number", "unknown"], answer: 2, explain: "TS tự suy luận (type inference): number + number trả về number." },
        { q: "`type TrangThai = \"cho\" | \"xong\" | \"huy\"` – gán giá trị nào sẽ **lỗi**?", options: ["`\"cho\"`", "`\"xong\"`", "`\"dang-lam\"`", "`\"huy\"`"], answer: 2, explain: "Union của các chuỗi cố định (literal types) – chỉ 3 giá trị đó hợp lệ." },
        { q: "Hàm generic này trả về kiểu gì khi gọi `dauTien([\"a\", \"b\"])`?", code: "function dauTien<T>(arr: T[]): T | undefined {\n  return arr[0];\n}", options: ["`any`", "`string | undefined`", "`string[]`", "`T`"], answer: 1, explain: "T được suy ra là string, nên kiểu trả về là string | undefined." }
      ]
    },
    {
      title: "Type guard bằng JavaScript", level: 3,
      task: "TypeScript chỉ kiểm tra lúc biên dịch – dữ liệu từ API vẫn cần kiểm tra lúc chạy. Viết `laSanPham(x)` trả về `true` khi `x` khớp interface:\n`{ id: number; ten: string; gia: number /* ≥ 0 */; tags?: string[] }`\nngược lại `false` (kể cả khi `x` là `null`).",
      starter: J("// interface SanPham { id: number; ten: string; gia: number; tags?: string[] }\nfunction laSanPham(x) {\n  \n}\n"),
      hint: "typeof x === \"object\" && x !== null && typeof x.id === \"number\" && … && (x.tags === undefined || (Array.isArray(x.tags) && x.tags.every(t => typeof t === \"string\")))",
      solution: J("// interface SanPham { id: number; ten: string; gia: number; tags?: string[] }\nfunction laSanPham(x) {\n  return typeof x === \"object\" && x !== null &&\n    typeof x.id === \"number\" &&\n    typeof x.ten === \"string\" &&\n    typeof x.gia === \"number\" && x.gia >= 0 &&\n    (x.tags === undefined || (Array.isArray(x.tags) && x.tags.every(t => typeof t === \"string\")));\n}"),
      check: String.raw`
        if (typeof laSanPham !== "function") return {pass:false, msg:"Chưa có hàm laSanPham."};
        const dung = [{ id: 1, ten: "Bút", gia: 5000 }, { id: 2, ten: "Vở", gia: 0, tags: ["học tập"] }];
        const sai = [null, undefined, "abc", { id: "1", ten: "Bút", gia: 5 }, { id: 1, gia: 5 }, { id: 1, ten: "Bút", gia: -1 }, { id: 1, ten: "Bút", gia: "5" }, { id: 1, ten: "B", gia: 1, tags: "x" }, { id: 1, ten: "B", gia: 1, tags: [1, 2] }];
        for (const x of dung) if (laSanPham(x) !== true) return {pass:false, msg:"Phải trả về true cho " + JSON.stringify(x)};
        for (const x of sai) if (laSanPham(x) !== false) return {pass:false, msg:"Phải trả về false cho " + JSON.stringify(x)};
        return {pass:true, msg:"Trong TS, hàm này viết là: function laSanPham(x: unknown): x is SanPham – gọi là type guard."};`
    },
    {
      type: "quiz", title: "Đọc lỗi của trình biên dịch TS", level: 2,
      task: "Mỗi đoạn code sau gây lỗi gì? Chọn đáp án đúng.",
      hint: "Đọc kỹ thông điệp lỗi – TS thường nói rất rõ kiểu mong đợi và kiểu nhận được.",
      questions: [
        { q: "Code sau báo lỗi gì?", code: "interface User { ten: string; tuoi: number }\nconst u: User = { ten: \"An\" };", options: ["Không lỗi", "Property 'tuoi' is missing", "Cannot find name 'User'", "Type 'string' is not assignable"], answer: 1, explain: "Object thiếu thuộc tính bắt buộc tuoi." },
        { q: "Vì sao dòng 2 báo lỗi `Object is possibly 'undefined'`?", code: "const nut = document.querySelector<HTMLButtonElement>(\"#nut\");\nnut.addEventListener(\"click\", () => {});", options: ["Sai tên sự kiện", "querySelector có thể trả về null – cần kiểm tra hoặc dùng nut?.", "Thiếu import", "Arrow function không hợp lệ"], answer: 1, explain: "Kiểu trả về là HTMLButtonElement | null. Dùng `nut?.addEventListener` hoặc `if (nut)`." },
        { q: "Sửa lỗi sau thế nào cho đúng nhất?", code: "function inHoa(s: string) { return s.toUpperCase(); }\ninHoa(123);", options: ["Đổi kiểu tham số thành any", "Truyền chuỗi: inHoa(\"123\") hoặc inHoa(String(123))", "Xoá kiểu string", "Thêm // @ts-ignore"], answer: 1, explain: "Lỗi đang bảo vệ bạn! Dùng any hay @ts-ignore là che giấu bug." },
        { q: "`const mau = [\"đỏ\", \"xanh\"] as const;` – kiểu của `mau` là?", options: ["`string[]`", "`readonly [\"đỏ\", \"xanh\"]`", "`any[]`", "`[string, string]`"], answer: 1, explain: "`as const` biến mảng thành tuple chỉ đọc với các giá trị literal cụ thể." },
        { q: "Lệnh nào kiểm tra kiểu toàn dự án mà **không** xuất file .js?", options: ["`tsc --noEmit`", "`node index.ts`", "`npm run build --check`", "`tsc --watch --js`"], answer: 0, explain: "`tsc --noEmit` chỉ kiểm tra lỗi kiểu – hay dùng trong CI cùng Vite (Vite không kiểm tra kiểu)." }
      ]
    }
  ];

  /* ===================== TƯ DUY COMPONENT ===================== */
  P["component-thinking"] = [
    {
      title: "Component nút bấm", level: 1,
      task: "Viết component `NutBam({ nhan, loai = \"primary\" })` trả về chuỗi HTML:\n`<button class=\"btn btn-<loai>\"><nhan></button>`.\nRender 2 nút vào `#app`: một nút *Lưu* (mặc định) và một nút *Xoá* loại `danger`.",
      starter: D("<div id=\"app\"></div>", "function NutBam({ nhan, loai = \"primary\" }) {\n  \n}\n\n// document.querySelector(\"#app\").innerHTML = ...\n", ".btn{padding:8px 14px;border:0;border-radius:8px;color:#fff;margin:4px}.btn-primary{background:#16a34a}.btn-danger{background:#dc2626}"),
      hint: "return `<button class=\"btn btn-${loai}\">${nhan}</button>`;",
      solution: D("<div id=\"app\"></div>", "function NutBam({ nhan, loai = \"primary\" }) {\n  return `<button class=\"btn btn-${loai}\">${nhan}</button>`;\n}\n\ndocument.querySelector(\"#app\").innerHTML =\n  NutBam({ nhan: \"Lưu\" }) + NutBam({ nhan: \"Xoá\", loai: \"danger\" });", ".btn{padding:8px 14px;border:0;border-radius:8px;color:#fff;margin:4px}.btn-primary{background:#16a34a}.btn-danger{background:#dc2626}"),
      check: String.raw`
        if (typeof NutBam !== "function") return {pass:false, msg:"Chưa có component NutBam."};
        if (NutBam({ nhan: "OK" }).replace(/\s+/g, " ").trim() !== '<button class="btn btn-primary">OK</button>') return {pass:false, msg:"NutBam({ nhan: \"OK\" }) phải trả về <button class=\"btn btn-primary\">OK</button>"};
        if (!/class="btn btn-danger"/.test(NutBam({ nhan: "X", loai: "danger" }))) return {pass:false, msg:"loai = \"danger\" → class btn btn-danger."};
        const b = T.$$("#app button").map(x => x.className + "|" + x.textContent.trim());
        if (!b.includes("btn btn-primary|Lưu") || !b.includes("btn btn-danger|Xoá")) return {pass:false, msg:"#app cần nút 'Lưu' (primary) và 'Xoá' (danger)."};
        return {pass:true, msg:"Một component, dùng lại vô số lần với props khác nhau."};`
    },
    {
      title: "Component lồng nhau", level: 2,
      task: "• `MucTodo({ ten, xong })` → `<li>` chứa tên; nếu `xong` thì `<li class=\"done\">`.\n• `DanhSachTodo(ds)` → `<ul class=\"todos\">` chứa các `MucTodo`.\nRender `DanhSachTodo(todos)` vào `#app`.",
      starter: D("<div id=\"app\"></div>", "const todos = [\n  { ten: \"Học HTML\", xong: true },\n  { ten: \"Học CSS\", xong: true },\n  { ten: \"Học React\", xong: false }\n];\n\nfunction MucTodo({ ten, xong }) {\n  \n}\n\nfunction DanhSachTodo(ds) {\n  \n}\n", ".done{text-decoration:line-through;color:#94a3b8}"),
      hint: "return `<ul class=\"todos\">${ds.map(MucTodo).join(\"\")}</ul>`; — nhớ .join(\"\") để bỏ dấu phẩy.",
      solution: D("<div id=\"app\"></div>", "const todos = [\n  { ten: \"Học HTML\", xong: true },\n  { ten: \"Học CSS\", xong: true },\n  { ten: \"Học React\", xong: false }\n];\n\nfunction MucTodo({ ten, xong }) {\n  return `<li${xong ? ' class=\"done\"' : \"\"}>${ten}</li>`;\n}\n\nfunction DanhSachTodo(ds) {\n  return `<ul class=\"todos\">${ds.map(MucTodo).join(\"\")}</ul>`;\n}\n\ndocument.querySelector(\"#app\").innerHTML = DanhSachTodo(todos);", ".done{text-decoration:line-through;color:#94a3b8}"),
      check: String.raw`
        if (typeof MucTodo !== "function" || typeof DanhSachTodo !== "function") return {pass:false, msg:"Cần 2 component MucTodo và DanhSachTodo."};
        const lis = T.$$("#app ul.todos > li");
        if (lis.length !== 3) return {pass:false, msg:"#app cần ul.todos với 3 li."};
        if (/,/.test(T.$("#app ul").textContent)) return {pass:false, msg:"Có dấu phẩy thừa – nhớ .join(\"\") sau map."};
        if (lis.map(li => li.classList.contains("done")).join() !== "true,true,false") return {pass:false, msg:"Chỉ các việc xong mới có class done."};
        const tmp = document.createElement("div"); tmp.innerHTML = DanhSachTodo([{ ten: "A", xong: false }]);
        if (tmp.querySelectorAll("ul.todos li").length !== 1) return {pass:false, msg:"DanhSachTodo phải dùng được với mảng bất kỳ."};
        return {pass:true, msg:"Component lớn được ghép từ component nhỏ – đúng tinh thần React!"};`
    },
    {
      title: "Chống XSS khi render props", level: 4,
      task: "Bình luận do người dùng nhập có thể chứa mã độc như `<img src=x onerror=alert(1)>`. Viết:\n• `escapeHTML(s)` đổi `& < > \" '` thành `&amp; &lt; &gt; &quot; &#39;`.\n• `TheBinhLuan({ ten, noiDung })` → `<div class=\"bl\"><b>ten</b><p>noiDung</p></div>` với ten, noiDung **đã được escape**.",
      starter: D("<div id=\"app\"></div>", "function escapeHTML(s) {\n  \n}\n\nfunction TheBinhLuan({ ten, noiDung }) {\n  \n}\n\ndocument.querySelector(\"#app\").innerHTML = TheBinhLuan({ ten: \"Hacker\", noiDung: \"<img src=x onerror=alert(1)>\" });\n"),
      hint: "Thay & TRƯỚC TIÊN: String(s).replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\")…",
      solution: D("<div id=\"app\"></div>", "function escapeHTML(s) {\n  return String(s)\n    .replace(/&/g, \"&amp;\")\n    .replace(/</g, \"&lt;\")\n    .replace(/>/g, \"&gt;\")\n    .replace(/\"/g, \"&quot;\")\n    .replace(/'/g, \"&#39;\");\n}\n\nfunction TheBinhLuan({ ten, noiDung }) {\n  return `<div class=\"bl\"><b>${escapeHTML(ten)}</b><p>${escapeHTML(noiDung)}</p></div>`;\n}\n\ndocument.querySelector(\"#app\").innerHTML = TheBinhLuan({ ten: \"Hacker\", noiDung: \"<img src=x onerror=alert(1)>\" });"),
      check: String.raw`
        if (typeof escapeHTML !== "function" || typeof TheBinhLuan !== "function") return {pass:false, msg:"Cần escapeHTML và TheBinhLuan."};
        if (escapeHTML("<a href=\"x\">'&'</a>") !== "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;") return {pass:false, msg:"escapeHTML chưa đúng – nhớ thay & trước tiên. Kết quả đang: " + escapeHTML("<a href=\"x\">'&'</a>")};
        if (T.$("#app img")) return {pass:false, msg:"Thẻ <img> độc hại vẫn được render! Hãy escape noiDung."};
        const p = T.$("#app .bl p"), b = T.$("#app .bl b");
        if (!p || p.textContent !== "<img src=x onerror=alert(1)>" || !b || b.textContent !== "Hacker") return {pass:false, msg:"Bình luận phải hiển thị đúng nguyên văn dưới dạng chữ."};
        const tmp = document.createElement("div"); tmp.innerHTML = TheBinhLuan({ ten: "<i>x</i>", noiDung: "ok" });
        if (tmp.querySelector("i")) return {pass:false, msg:"ten cũng phải được escape."};
        return {pass:true, msg:"Bạn vừa chặn một lỗ hổng XSS! React tự escape cho bạn – nhưng giờ bạn hiểu vì sao."};`
    }
  ];

  P["state-render"] = [
    {
      title: "Ẩn/hiện panel theo state", level: 2,
      task: "Dùng mô hình state:\n• `let state = { mo: false }`, `setState(moi)` gộp state rồi gọi `render()`.\n• `render()` vẽ vào `#app`: một `<button id=\"nut\">` ghi `Mở` (khi đóng) / `Đóng` (khi mở), và **chỉ khi mở** có thêm `<div id=\"panel\">Nội dung</div>`.\n• Bấm nút → `setState({ mo: !state.mo })`.",
      starter: D("<div id=\"app\"></div>", "let state = { mo: false };\n\nfunction setState(moi) {\n  \n}\n\nfunction render() {\n  \n}\n\nrender();\n"),
      hint: "Vì #app vẽ lại mỗi lần, hãy gắn listener trên #app (event delegation): app.addEventListener(\"click\", e => { if (e.target.id === \"nut\") setState({ mo: !state.mo }); });",
      solution: D("<div id=\"app\"></div>", "let state = { mo: false };\nconst app = document.querySelector(\"#app\");\n\nfunction setState(moi) {\n  state = { ...state, ...moi };\n  render();\n}\n\nfunction render() {\n  app.innerHTML = `\n    <button id=\"nut\">${state.mo ? \"Đóng\" : \"Mở\"}</button>\n    ${state.mo ? '<div id=\"panel\">Nội dung</div>' : \"\"}\n  `;\n}\n\napp.addEventListener(\"click\", e => {\n  if (e.target.id === \"nut\") setState({ mo: !state.mo });\n});\n\nrender();"),
      check: String.raw`
        if (typeof setState !== "function" || typeof render !== "function") return {pass:false, msg:"Cần setState và render."};
        if (!T.$("#nut") || T.$("#nut").textContent.trim() !== "Mở" || T.$("#panel")) return {pass:false, msg:"Ban đầu: nút 'Mở' và chưa có #panel."};
        T.click(T.$("#nut"));
        if (!T.$("#panel") || T.$("#nut").textContent.trim() !== "Đóng") return {pass:false, msg:"Bấm lần 1: hiện #panel và nút đổi thành 'Đóng'."};
        if (state.mo !== true) return {pass:false, msg:"state.mo phải là true sau khi bấm."};
        T.click(T.$("#nut"));
        if (T.$("#panel") || T.$("#nut").textContent.trim() !== "Mở") return {pass:false, msg:"Bấm lần 2: ẩn #panel, nút về 'Mở'."};
        return {pass:true, msg:"UI = f(state). Đổi state → giao diện tự đúng theo."};`
    },
    {
      title: "Todo theo state bất biến", level: 3,
      task: "• `state = { todos: [] }`.\n• `themTodo(ten)`: bỏ qua nếu ten rỗng (sau trim); ngược lại `setState({ todos: [...state.todos, ten] })` – **không dùng push**.\n• `render()` vẽ `<ul id=\"ds\">` với mỗi todo là một `<li>`, và `<p id=\"dem\">` ghi `<n> việc`.\n• Form `#form` + ô `#o`: submit thì gọi `themTodo` và xoá ô.",
      starter: D("<form id=\"form\"><input id=\"o\" placeholder=\"Việc cần làm\"><button>Thêm</button></form>\n<div id=\"app\"></div>", "let state = { todos: [] };\n\nfunction setState(moi) {\n  state = { ...state, ...moi };\n  render();\n}\n\nfunction themTodo(ten) {\n  \n}\n\nfunction render() {\n  \n}\n\nrender();\n"),
      hint: "render: app.innerHTML = `<ul id=\"ds\">${state.todos.map(t => `<li>${t}</li>`).join(\"\")}</ul><p id=\"dem\">${state.todos.length} việc</p>`;",
      solution: D("<form id=\"form\"><input id=\"o\" placeholder=\"Việc cần làm\"><button>Thêm</button></form>\n<div id=\"app\"></div>", "let state = { todos: [] };\nconst app = document.querySelector(\"#app\");\n\nfunction setState(moi) {\n  state = { ...state, ...moi };\n  render();\n}\n\nfunction themTodo(ten) {\n  ten = ten.trim();\n  if (!ten) return;\n  setState({ todos: [...state.todos, ten] });\n}\n\nfunction render() {\n  app.innerHTML = `\n    <ul id=\"ds\">${state.todos.map(t => `<li>${t}</li>`).join(\"\")}</ul>\n    <p id=\"dem\">${state.todos.length} việc</p>`;\n}\n\ndocument.querySelector(\"#form\").addEventListener(\"submit\", e => {\n  e.preventDefault();\n  const o = document.querySelector(\"#o\");\n  themTodo(o.value);\n  o.value = \"\";\n});\n\nrender();"),
      check: String.raw`
        if (typeof themTodo !== "function") return {pass:false, msg:"Chưa có themTodo."};
        if (!T.$("#ds") || T.$("#dem").textContent.trim() !== "0 việc") return {pass:false, msg:"Ban đầu cần #ds rỗng và #dem = '0 việc'."};
        if (/\.push\(/.test(T.src)) return {pass:false, msg:"Không dùng push – tạo mảng mới bằng spread."};
        const cu = state.todos;
        themTodo("Học state");
        if (state.todos === cu) return {pass:false, msg:"state.todos phải là mảng MỚI sau mỗi lần thêm."};
        themTodo("   ");
        const o = T.$("#o"); o.value = "Viết test";
        T.$("#form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        const lis = T.$$("#ds li").map(li => li.textContent.trim());
        if (lis.join("|") !== "Học state|Viết test") return {pass:false, msg:"Danh sách phải là: Học state, Viết test (bỏ qua việc rỗng). Đang: " + lis.join(", ")};
        if (T.$("#dem").textContent.trim() !== "2 việc") return {pass:false, msg:"#dem phải là '2 việc'."};
        if (o.value !== "") return {pass:false, msg:"Thêm xong phải xoá trống ô nhập."};
        return {pass:true, msg:"Mảng mới mỗi lần → dễ so sánh, dễ undo, dễ debug!"};`
    },
    {
      title: "Bộ lọc todo", level: 4,
      task: "`state = { todos: [...], boLoc: \"tat-ca\" }` với mỗi todo `{ id, ten, xong }`. Viết:\n• `toggleTodo(id)` – đảo `xong` của todo đó (bất biến, dùng `map`).\n• `setBoLoc(loai)` – `\"tat-ca\"` | `\"xong\"` | `\"chua\"`.\n• `render()` vẽ vào `#app` danh sách `<li data-id=\"<id>\">` **theo bộ lọc**, li đã xong có class `done`.",
      starter: D("<div id=\"app\"></div>", "let state = {\n  boLoc: \"tat-ca\",\n  todos: [\n    { id: 1, ten: \"Học HTML\", xong: true },\n    { id: 2, ten: \"Học CSS\", xong: false },\n    { id: 3, ten: \"Học JS\", xong: false }\n  ]\n};\n\nfunction setState(moi) {\n  state = { ...state, ...moi };\n  render();\n}\n\nfunction toggleTodo(id) {\n  \n}\n\nfunction setBoLoc(loai) {\n  \n}\n\nfunction render() {\n  \n}\n\nrender();\n", ".done{text-decoration:line-through}"),
      hint: "toggle: setState({ todos: state.todos.map(t => t.id === id ? { ...t, xong: !t.xong } : t) });\nlọc: state.todos.filter(t => state.boLoc === \"tat-ca\" || (state.boLoc === \"xong\") === t.xong)",
      solution: D("<div id=\"app\"></div>", "let state = {\n  boLoc: \"tat-ca\",\n  todos: [\n    { id: 1, ten: \"Học HTML\", xong: true },\n    { id: 2, ten: \"Học CSS\", xong: false },\n    { id: 3, ten: \"Học JS\", xong: false }\n  ]\n};\n\nfunction setState(moi) {\n  state = { ...state, ...moi };\n  render();\n}\n\nfunction toggleTodo(id) {\n  setState({ todos: state.todos.map(t => t.id === id ? { ...t, xong: !t.xong } : t) });\n}\n\nfunction setBoLoc(loai) {\n  setState({ boLoc: loai });\n}\n\nfunction render() {\n  const hienThi = state.todos.filter(t =>\n    state.boLoc === \"tat-ca\" || (state.boLoc === \"xong\" ? t.xong : !t.xong));\n  document.querySelector(\"#app\").innerHTML = `<ul>${hienThi\n    .map(t => `<li data-id=\"${t.id}\" class=\"${t.xong ? \"done\" : \"\"}\">${t.ten}</li>`)\n    .join(\"\")}</ul>`;\n}\n\nrender();", ".done{text-decoration:line-through}"),
      check: String.raw`
        if (typeof toggleTodo !== "function" || typeof setBoLoc !== "function") return {pass:false, msg:"Cần toggleTodo và setBoLoc."};
        const ids = () => T.$$("#app li").map(li => li.dataset.id).join();
        if (ids() !== "1,2,3") return {pass:false, msg:"Bộ lọc 'tat-ca' phải hiện cả 3 li có data-id."};
        if (!T.$("#app li[data-id='1']").classList.contains("done")) return {pass:false, msg:"Todo đã xong cần class done."};
        const cu = state.todos, cu2 = state.todos[1];
        toggleTodo(2);
        if (state.todos === cu || cu2.xong !== false) return {pass:false, msg:"toggleTodo phải tạo mảng/object mới, không sửa trực tiếp."};
        if (!state.todos[1].xong) return {pass:false, msg:"toggleTodo(2) phải đảo xong của todo 2."};
        setBoLoc("xong");
        if (ids() !== "1,2") return {pass:false, msg:"Bộ lọc 'xong' phải hiện todo 1, 2 (đang: " + ids() + ")."};
        setBoLoc("chua");
        if (ids() !== "3") return {pass:false, msg:"Bộ lọc 'chua' phải chỉ hiện todo 3."};
        toggleTodo(3);
        if (ids() !== "") return {pass:false, msg:"Sau khi xong todo 3, bộ lọc 'chua' phải rỗng."};
        return {pass:true, msg:"Đây chính là ví dụ TodoMVC kinh điển mà mọi framework đều dùng để demo!"};`
    }
  ];

  P["web-components"] = [
    {
      title: "Thẻ <hello-world>", level: 2,
      task: "Tạo custom element `<hello-world>`: trong `connectedCallback` hiển thị `Xin chào, <name>!` với `name` lấy từ thuộc tính (thiếu thì dùng `bạn`).",
      starter: D("<hello-world name=\"Quảng\"></hello-world>\n<hello-world></hello-world>", "class HelloWorld extends HTMLElement {\n  \n}\n\n// customElements.define(\"hello-world\", HelloWorld);\n"),
      hint: "connectedCallback() { const ten = this.getAttribute(\"name\") || \"bạn\"; this.textContent = `Xin chào, ${ten}!`; }",
      solution: D("<hello-world name=\"Quảng\"></hello-world>\n<hello-world></hello-world>", "class HelloWorld extends HTMLElement {\n  connectedCallback() {\n    const ten = this.getAttribute(\"name\") || \"bạn\";\n    this.textContent = `Xin chào, ${ten}!`;\n  }\n}\n\ncustomElements.define(\"hello-world\", HelloWorld);"),
      check: String.raw`
        if (!customElements.get("hello-world")) return {pass:false, msg:"Chưa đăng ký customElements.define(\"hello-world\", ...)."};
        const els = T.$$("hello-world").map(e => e.textContent.trim());
        if (els[0] !== "Xin chào, Quảng!") return {pass:false, msg:"Thẻ có name=\"Quảng\" phải hiện 'Xin chào, Quảng!'."};
        if (els[1] !== "Xin chào, bạn!") return {pass:false, msg:"Thẻ không có name phải hiện 'Xin chào, bạn!'."};
        const moi = document.createElement("hello-world"); moi.setAttribute("name", "An"); document.body.appendChild(moi);
        if (moi.textContent.trim() !== "Xin chào, An!") return {pass:false, msg:"Thẻ tạo bằng JS cũng phải hoạt động."};
        return {pass:true, msg:"Bạn vừa 'phát minh' một thẻ HTML mới! 🎉"};`
    },
    {
      title: "Bộ đếm <dem-so>", level: 3,
      task: "Tạo `<dem-so start=\"5\">`: hiển thị `<span class=\"so\">` (giá trị bắt đầu từ thuộc tính `start`, mặc định 0) và `<button class=\"tang\">+1</button>`. Bấm nút thì số **của chính thẻ đó** tăng 1 (các thẻ độc lập nhau).",
      starter: D("<dem-so start=\"5\"></dem-so>\n<dem-so></dem-so>", "class DemSo extends HTMLElement {\n  connectedCallback() {\n    \n  }\n}\n\ncustomElements.define(\"dem-so\", DemSo);\n", "dem-so{display:inline-flex;gap:8px;align-items:center;border:1px solid #ccc;padding:6px 10px;border-radius:8px;margin:4px}"),
      hint: "this.dem = Number(this.getAttribute(\"start\") || 0); this.innerHTML = ...; this.querySelector(\".tang\").addEventListener(\"click\", () => { this.dem++; this.querySelector(\".so\").textContent = this.dem; });",
      solution: D("<dem-so start=\"5\"></dem-so>\n<dem-so></dem-so>", "class DemSo extends HTMLElement {\n  connectedCallback() {\n    this.dem = Number(this.getAttribute(\"start\") || 0);\n    this.innerHTML = `<span class=\"so\">${this.dem}</span> <button class=\"tang\">+1</button>`;\n    this.querySelector(\".tang\").addEventListener(\"click\", () => {\n      this.dem++;\n      this.querySelector(\".so\").textContent = this.dem;\n    });\n  }\n}\n\ncustomElements.define(\"dem-so\", DemSo);", "dem-so{display:inline-flex;gap:8px;align-items:center;border:1px solid #ccc;padding:6px 10px;border-radius:8px;margin:4px}"),
      check: String.raw`
        const [a, b] = T.$$("dem-so");
        const so = el => el.querySelector(".so") && el.querySelector(".so").textContent.trim();
        if (so(a) !== "5" || so(b) !== "0") return {pass:false, msg:"Ban đầu: thẻ 1 hiện 5, thẻ 2 hiện 0."};
        T.click(a.querySelector(".tang")); T.click(a.querySelector(".tang"));
        if (so(a) !== "7") return {pass:false, msg:"Bấm 2 lần ở thẻ 1 → 7."};
        if (so(b) !== "0") return {pass:false, msg:"Thẻ 2 phải độc lập, vẫn là 0."};
        T.click(b.querySelector(".tang"));
        if (so(b) !== "1") return {pass:false, msg:"Bấm thẻ 2 → 1."};
        return {pass:true, msg:"Mỗi instance có state riêng – giống hệt component trong React."};`
    },
    {
      title: "Phản ứng khi thuộc tính đổi", level: 4,
      task: "Tạo `<o-mau color=\"red\">` hiển thị `<div class=\"o\">` có **nền** bằng màu trong `color` và chữ là tên màu. Khi đổi thuộc tính `color` bằng `setAttribute`, giao diện **tự cập nhật** (dùng `static get observedAttributes()` + `attributeChangedCallback`).",
      starter: D("<o-mau color=\"red\"></o-mau>", "class OMau extends HTMLElement {\n  \n}\n\ncustomElements.define(\"o-mau\", OMau);\n\n// Thử: setTimeout(() => document.querySelector(\"o-mau\").setAttribute(\"color\", \"green\"), 1000);\n", ".o{width:120px;padding:20px;color:#fff;text-align:center;border-radius:10px}"),
      hint: "static get observedAttributes() { return [\"color\"]; }\nattributeChangedCallback() { this.render(); }  connectedCallback() { this.render(); }\nrender() { const c = this.getAttribute(\"color\") || \"gray\"; this.innerHTML = `<div class=\"o\" style=\"background:${c}\">${c}</div>`; }",
      solution: D("<o-mau color=\"red\"></o-mau>", "class OMau extends HTMLElement {\n  static get observedAttributes() {\n    return [\"color\"];\n  }\n  connectedCallback() {\n    this.render();\n  }\n  attributeChangedCallback() {\n    this.render();\n  }\n  render() {\n    const c = this.getAttribute(\"color\") || \"gray\";\n    this.innerHTML = `<div class=\"o\" style=\"background:${c}\">${c}</div>`;\n  }\n}\n\ncustomElements.define(\"o-mau\", OMau);\n\nsetTimeout(() => document.querySelector(\"o-mau\").setAttribute(\"color\", \"green\"), 1000);", ".o{width:120px;padding:20px;color:#fff;text-align:center;border-radius:10px}"),
      check: String.raw`
        const el = T.$("o-mau");
        const o = () => el.querySelector(".o");
        if (!o() || T.css(o(), "background-color") !== "rgb(255, 0, 0)" || o().textContent.trim() !== "red") return {pass:false, msg:"Ban đầu .o phải nền đỏ và ghi 'red'."};
        el.setAttribute("color", "blue");
        if (!o() || T.css(o(), "background-color") !== "rgb(0, 0, 255)" || o().textContent.trim() !== "blue") return {pass:false, msg:"Đổi color=\"blue\" thì .o phải tự cập nhật (observedAttributes + attributeChangedCallback)."};
        return {pass:true, msg:"Thuộc tính đổi → tự render lại: phản ứng (reactive) giống props trong framework."};`
    }
  ];

  /* ===================== CHẤT LƯỢNG & HIỆU NĂNG ===================== */
  P["accessibility"] = [
    {
      title: "Dùng đúng thẻ <button>", level: 1,
      task: "Hai \"nút\" đang làm bằng `<div onclick>` – không bấm được bằng bàn phím, trình đọc màn hình không biết là nút. Hãy đổi thành `<button>` thật (giữ nguyên `id` và chữ). Ảnh logo cần `alt` mô tả.",
      starter: D("<img src=\"https://picsum.photos/80\" class=\"logo\">\n<div id=\"luu\" class=\"btn\" onclick=\"alert('Đã lưu')\">Lưu</div>\n<div id=\"huy\" class=\"btn\" onclick=\"alert('Đã huỷ')\">Huỷ</div>", "", ".btn{display:inline-block;padding:8px 14px;background:#16a34a;color:#fff;border:0;border-radius:8px;cursor:pointer}"),
      hint: "<button id=\"luu\" class=\"btn\" type=\"button\">Lưu</button>",
      solution: D("<img src=\"https://picsum.photos/80\" class=\"logo\" alt=\"Logo Front-end Academy\">\n<button id=\"luu\" class=\"btn\" type=\"button\" onclick=\"alert('Đã lưu')\">Lưu</button>\n<button id=\"huy\" class=\"btn\" type=\"button\" onclick=\"alert('Đã huỷ')\">Huỷ</button>", "", ".btn{display:inline-block;padding:8px 14px;background:#16a34a;color:#fff;border:0;border-radius:8px;cursor:pointer}"),
      check: String.raw`
        for (const [id, chu] of [["luu", "Lưu"], ["huy", "Huỷ"]]) {
          const el = T.$("#" + id);
          if (!el || el.tagName !== "BUTTON") return {pass:false, msg:"#" + id + " phải là thẻ <button>."};
          if (el.textContent.trim() !== chu) return {pass:false, msg:"Giữ nguyên chữ '" + chu + "'."};
        }
        if (T.$("div[onclick]")) return {pass:false, msg:"Vẫn còn <div onclick>."};
        if (!(T.$(".logo").getAttribute("alt") || "").trim()) return {pass:false, msg:"Ảnh logo cần alt mô tả."};
        return {pass:true, msg:"<button> có sẵn: focus bằng Tab, bấm bằng Enter/Space, được đọc là 'nút'."};`
    },
    {
      title: "Nút chỉ có biểu tượng", level: 2,
      task: "Các nút `🔍`, `✖`, `☰` chỉ có emoji – trình đọc màn hình sẽ đọc rất khó hiểu. Thêm `aria-label` mô tả cho **mọi** nút trong `.toolbar` (vd *Tìm kiếm*, *Đóng*, *Mở menu*). Thêm `lang=\"vi\"` vào thẻ `<html>` bằng JS: `document.documentElement.lang = \"vi\"`.",
      starter: D("<div class=\"toolbar\">\n  <button class=\"search\">🔍</button>\n  <button class=\"close\">✖</button>\n  <button class=\"menu\">☰</button>\n</div>", ""),
      hint: "<button class=\"search\" aria-label=\"Tìm kiếm\">🔍</button>",
      solution: D("<div class=\"toolbar\">\n  <button class=\"search\" aria-label=\"Tìm kiếm\">🔍</button>\n  <button class=\"close\" aria-label=\"Đóng\">✖</button>\n  <button class=\"menu\" aria-label=\"Mở menu\">☰</button>\n</div>", "document.documentElement.lang = \"vi\";"),
      check: String.raw`
        const btns = T.$$(".toolbar button");
        if (btns.length !== 3) return {pass:false, msg:"Giữ nguyên 3 nút trong .toolbar."};
        const thieu = btns.find(b => (b.getAttribute("aria-label") || "").trim().length < 3);
        if (thieu) return {pass:false, msg:"Nút '" + thieu.textContent.trim() + "' cần aria-label mô tả (ít nhất 3 ký tự)."};
        if (new Set(btns.map(b => b.getAttribute("aria-label"))).size !== 3) return {pass:false, msg:"Mỗi nút cần aria-label khác nhau."};
        if (document.documentElement.lang !== "vi") return {pass:false, msg:"Đặt document.documentElement.lang = \"vi\"."};
        return {pass:true, msg:"lang=\"vi\" giúp trình đọc màn hình phát âm tiếng Việt đúng giọng."};`
    },
    {
      title: "Hộp thoại (modal) dễ tiếp cận", level: 4,
      task: "Hoàn thiện modal `#modal`:\n• Thêm `role=\"dialog\"`, `aria-modal=\"true\"` và `aria-labelledby` trỏ tới `id` của tiêu đề `<h2>`.\n• Nút đóng `#dong` có `aria-label=\"Đóng hộp thoại\"`.\n• Bấm `#mo` → bỏ thuộc tính `hidden` của modal và **đưa focus** vào `#dong`.\n• Nhấn **Escape** (`e.key === \"Escape\"`) hoặc bấm `#dong` → ẩn modal và **trả focus** về `#mo`.",
      starter: D("<button id=\"mo\">Mở thông báo</button>\n<div id=\"modal\" hidden>\n  <h2>Thông báo</h2>\n  <p>Bạn đã hoàn thành bài học!</p>\n  <button id=\"dong\">✖</button>\n</div>", "", "#modal{border:2px solid #16a34a;padding:16px;border-radius:12px;max-width:300px}"),
      hint: "<div id=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"tieuDe\" hidden><h2 id=\"tieuDe\">…\nJS: modal.hidden = false; dong.focus();  document.addEventListener(\"keydown\", e => { if (e.key === \"Escape\" && !modal.hidden) dongModal(); });",
      solution: D("<button id=\"mo\">Mở thông báo</button>\n<div id=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"tieuDe\" hidden>\n  <h2 id=\"tieuDe\">Thông báo</h2>\n  <p>Bạn đã hoàn thành bài học!</p>\n  <button id=\"dong\" aria-label=\"Đóng hộp thoại\">✖</button>\n</div>", "const modal = document.querySelector(\"#modal\");\nconst mo = document.querySelector(\"#mo\");\nconst dong = document.querySelector(\"#dong\");\n\nfunction moModal() {\n  modal.hidden = false;\n  dong.focus();\n}\nfunction dongModal() {\n  modal.hidden = true;\n  mo.focus();\n}\n\nmo.addEventListener(\"click\", moModal);\ndong.addEventListener(\"click\", dongModal);\ndocument.addEventListener(\"keydown\", e => {\n  if (e.key === \"Escape\" && !modal.hidden) dongModal();\n});", "#modal{border:2px solid #16a34a;padding:16px;border-radius:12px;max-width:300px}"),
      check: String.raw`
        const m = T.$("#modal"), mo = T.$("#mo"), dong = T.$("#dong");
        if (m.getAttribute("role") !== "dialog" || m.getAttribute("aria-modal") !== "true") return {pass:false, msg:"#modal cần role=\"dialog\" và aria-modal=\"true\"."};
        const lb = m.getAttribute("aria-labelledby"), h2 = m.querySelector("h2");
        if (!lb || !h2 || h2.id !== lb) return {pass:false, msg:"aria-labelledby phải trỏ đúng id của <h2>."};
        if (dong.getAttribute("aria-label") !== "Đóng hộp thoại") return {pass:false, msg:"#dong cần aria-label=\"Đóng hộp thoại\"."};
        if (!m.hidden) return {pass:false, msg:"Ban đầu modal phải ẩn (hidden)."};
        T.click(mo);
        if (m.hidden) return {pass:false, msg:"Bấm #mo phải hiện modal."};
        if (document.activeElement !== dong) return {pass:false, msg:"Mở modal xong phải focus vào #dong."};
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        if (!m.hidden) return {pass:false, msg:"Nhấn Escape phải đóng modal."};
        if (document.activeElement !== mo) return {pass:false, msg:"Đóng modal phải trả focus về #mo."};
        T.click(mo); T.click(dong);
        if (!m.hidden || document.activeElement !== mo) return {pass:false, msg:"Bấm #dong cũng phải đóng modal và trả focus về #mo."};
        return {pass:true, msg:"Modal chuẩn WAI-ARIA – người dùng bàn phím và trình đọc màn hình đều dùng được! ♿"};`
    }
  ];

  P["performance-debounce"] = [
    {
      title: "Ảnh lazy-load không 'giật' trang", level: 1,
      task: "Tối ưu 3 ảnh trong `.gallery`: thêm `loading=\"lazy\"` (chỉ tải khi sắp cuộn tới), khai báo `width` và `height` (tránh layout shift – CLS), và `alt` mô tả cho mỗi ảnh.",
      starter: D("<div class=\"gallery\">\n  <img src=\"https://picsum.photos/id/10/400/300\">\n  <img src=\"https://picsum.photos/id/20/400/300\">\n  <img src=\"https://picsum.photos/id/30/400/300\">\n</div>", ""),
      hint: "<img src=\"...\" loading=\"lazy\" width=\"400\" height=\"300\" alt=\"Rừng thông\">",
      solution: D("<div class=\"gallery\">\n  <img src=\"https://picsum.photos/id/10/400/300\" loading=\"lazy\" width=\"400\" height=\"300\" alt=\"Rừng cây\">\n  <img src=\"https://picsum.photos/id/20/400/300\" loading=\"lazy\" width=\"400\" height=\"300\" alt=\"Bàn làm việc\">\n  <img src=\"https://picsum.photos/id/30/400/300\" loading=\"lazy\" width=\"400\" height=\"300\" alt=\"Cốc cà phê\">\n</div>", ""),
      check: String.raw`
        const imgs = T.$$(".gallery img");
        if (imgs.length !== 3) return {pass:false, msg:"Giữ nguyên 3 ảnh."};
        for (const [i, im] of imgs.entries()) {
          if (im.getAttribute("loading") !== "lazy") return {pass:false, msg:"Ảnh " + (i + 1) + " cần loading=\"lazy\"."};
          if (!(+im.getAttribute("width") > 0) || !(+im.getAttribute("height") > 0)) return {pass:false, msg:"Ảnh " + (i + 1) + " cần width và height."};
          if (!(im.getAttribute("alt") || "").trim()) return {pass:false, msg:"Ảnh " + (i + 1) + " cần alt."};
        }
        return {pass:true, msg:"Một thuộc tính HTML mà tiết kiệm hàng MB dữ liệu cho người dùng di động!"};`
    },
    {
      title: "Tự viết throttle", level: 3,
      task: "Viết `throttle(fn, ms)` trả về hàm mới: lần gọi **đầu tiên chạy ngay**, sau đó **bỏ qua** mọi lần gọi trong vòng `ms` mili-giây kế tiếp. Truyền đúng tham số cho `fn`.\n(Dùng cho sự kiện scroll/resize – khác debounce là chạy đều đặn chứ không chờ ngừng.)",
      starter: J("function throttle(fn, ms) {\n  \n}\n\nconst log = throttle(x => console.log(\"Chạy với\", x), 300);\nlog(1); log(2); log(3); // chỉ in \"Chạy với 1\"\n"),
      hint: "let cuoi = 0; return (...args) => { const bayGio = Date.now(); if (bayGio - cuoi >= ms) { cuoi = bayGio; fn(...args); } };",
      solution: J("function throttle(fn, ms) {\n  let lanCuoi = 0;\n  return (...args) => {\n    const bayGio = Date.now();\n    if (bayGio - lanCuoi >= ms) {\n      lanCuoi = bayGio;\n      fn(...args);\n    }\n  };\n}\n\nconst log = throttle(x => console.log(\"Chạy với\", x), 300);\nlog(1); log(2); log(3); // chỉ in \"Chạy với 1\""),
      check: String.raw`
        if (typeof throttle !== "function") return {pass:false, msg:"Chưa có hàm throttle."};
        const goi = [];
        const t = throttle((a, b) => goi.push([a, b]), 150);
        t(1, "a"); t(2, "b"); t(3, "c");
        if (goi.length !== 1) return {pass:false, msg:"Gọi 3 lần liên tiếp chỉ được chạy 1 lần (đang " + goi.length + ")."};
        if (goi[0][0] !== 1 || goi[0][1] !== "a") return {pass:false, msg:"Lần đầu phải chạy NGAY với đúng tham số (1, \"a\")."};
        await T.sleep(60); t(4);
        if (goi.length !== 1) return {pass:false, msg:"Trong 150ms vẫn phải bỏ qua."};
        await T.sleep(130); t(5, "e");
        if (goi.length !== 2 || goi[1][0] !== 5) return {pass:false, msg:"Sau 150ms phải chạy lại được."};
        return {pass:true, msg:"throttle + debounce = bộ đôi tối ưu sự kiện quan trọng nhất của front-end."};`
    },
    {
      title: "Ghi nhớ kết quả (memoize)", level: 3,
      task: "Viết `ghiNho(fn)` trả về hàm mới **lưu cache** kết quả theo tham số: gọi lại với cùng tham số thì trả kết quả cũ, **không** chạy lại `fn`. (Dùng `Map`, khoá là `JSON.stringify(args)`.)",
      starter: J("function ghiNho(fn) {\n  \n}\n\nconst tinhLau = ghiNho(n => { console.log(\"Đang tính...\"); return n * n; });\ntinhLau(9); tinhLau(9); // chỉ in \"Đang tính...\" 1 lần\n"),
      hint: "const cache = new Map(); return (...args) => { const k = JSON.stringify(args); if (!cache.has(k)) cache.set(k, fn(...args)); return cache.get(k); };",
      solution: J("function ghiNho(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const khoa = JSON.stringify(args);\n    if (!cache.has(khoa)) cache.set(khoa, fn(...args));\n    return cache.get(khoa);\n  };\n}\n\nconst tinhLau = ghiNho(n => { console.log(\"Đang tính...\"); return n * n; });\ntinhLau(9); tinhLau(9);"),
      check: String.raw`
        if (typeof ghiNho !== "function") return {pass:false, msg:"Chưa có hàm ghiNho."};
        let dem = 0;
        const cong = ghiNho((a, b) => { dem++; return a + b; });
        if (cong(2, 3) !== 5 || cong(2, 3) !== 5) return {pass:false, msg:"Kết quả phải đúng: cong(2, 3) = 5."};
        if (dem !== 1) return {pass:false, msg:"Cùng tham số phải dùng cache, fn chỉ chạy 1 lần (đang " + dem + ")."};
        if (cong(3, 2) !== 5 || dem !== 2) return {pass:false, msg:"Tham số khác (3, 2) phải tính lại."};
        let dem0 = 0; const f0 = ghiNho(() => { dem0++; return 0; }); f0(); f0();
        if (dem0 !== 1) return {pass:false, msg:"Kết quả là 0 (falsy) cũng phải được cache – dùng cache.has thay vì if (cache.get(k))."};
        return {pass:true, msg:"Memoization là nền tảng của useMemo trong React."};`
    }
  ];

  P["testing-basics"] = [
    {
      title: "Thêm matcher toEqual", level: 2,
      task: "Mini framework chỉ có `toBe` (so sánh `===`) nên `expect([1, 2]).toBe([1, 2])` luôn **sai**. Hãy thêm `toEqual(b)` so sánh **sâu** (gợi ý: so `JSON.stringify`) – sai thì `throw new Error(...)`. Viết thêm 1 test dùng `toEqual`.",
      starter: J("function expect(a) {\n  return {\n    toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); },\n    // toEqual(b) { ... }\n  };\n}\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\n"),
      hint: "toEqual(b) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Mong đợi ' + JSON.stringify(b) + ' nhưng nhận ' + JSON.stringify(a)); }",
      solution: J("function expect(a) {\n  return {\n    toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); },\n    toEqual(b) {\n      if (JSON.stringify(a) !== JSON.stringify(b))\n        throw new Error('Mong đợi ' + JSON.stringify(b) + ' nhưng nhận ' + JSON.stringify(a));\n    }\n  };\n}\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\ntest('map nhân đôi', () => expect([1, 2].map(x => x * 2)).toEqual([2, 4]));"),
      check: throwsMsg + String.raw`
        if (typeof expect !== "function") return {pass:false, msg:"Không tìm thấy expect."};
        const m = expect([1, { a: 2 }]);
        if (typeof m.toEqual !== "function") return {pass:false, msg:"expect(...) chưa có toEqual."};
        if (nem(() => expect([1, { a: 2 }]).toEqual([1, { a: 2 }]))) return {pass:false, msg:"toEqual với 2 giá trị giống nhau không được throw."};
        if (!(nem(() => expect([1, 2]).toEqual([2, 1])) instanceof Error)) return {pass:false, msg:"toEqual với 2 giá trị khác nhau phải throw Error."};
        if (!(nem(() => expect({ a: 1 }).toEqual({ a: 2 })) instanceof Error)) return {pass:false, msg:"toEqual({a:1}, {a:2}) phải throw."};
        if (!/\.toEqual\(/.test(T.src.split("toEqual(b)").slice(1).join(""))) return {pass:false, msg:"Viết thêm ít nhất 1 test dùng toEqual."};
        if (!T.logs.some(l => l.startsWith("✅"))) return {pass:false, msg:"Test của bạn chưa chạy qua (chưa thấy ✅)."};
        return {pass:true, msg:"Đây chính là toEqual trong Jest/Vitest (bản thật xử lý thêm nhiều trường hợp)."};`
    },
    {
      title: "TDD: test có trước, code có sau", level: 3,
      task: "Các test cho `kiemTraMatKhau(mk)` đã viết sẵn và **đang đỏ ❌**. Hãy viết hàm để **tất cả xanh ✅**. Hàm trả về **mảng lỗi** (rỗng nếu hợp lệ):\n• `\"Ít nhất 8 ký tự\"` · `\"Cần chữ hoa\"` · `\"Cần chữ số\"` (theo đúng thứ tự này).",
      starter: J("function expect(a) { return { toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); }, toEqual(b) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Mong đợi ' + JSON.stringify(b) + ' nhưng nhận ' + JSON.stringify(a)); } }; }\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nfunction kiemTraMatKhau(mk) {\n  return [];\n}\n\ntest('mật khẩu tốt', () => expect(kiemTraMatKhau('Abcdefg1')).toEqual([]));\ntest('quá ngắn', () => expect(kiemTraMatKhau('Ab1')).toEqual(['Ít nhất 8 ký tự']));\ntest('thiếu chữ hoa', () => expect(kiemTraMatKhau('abcdefg1')).toEqual(['Cần chữ hoa']));\ntest('thiếu số', () => expect(kiemTraMatKhau('Abcdefgh')).toEqual(['Cần chữ số']));\ntest('sai tất cả', () => expect(kiemTraMatKhau('abc')).toEqual(['Ít nhất 8 ký tự', 'Cần chữ hoa', 'Cần chữ số']));\n"),
      hint: "const loi = []; if (mk.length < 8) loi.push(...); if (!/[A-Z]/.test(mk)) loi.push(...); if (!/[0-9]/.test(mk)) loi.push(...); return loi;",
      solution: J("function expect(a) { return { toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); }, toEqual(b) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Mong đợi ' + JSON.stringify(b) + ' nhưng nhận ' + JSON.stringify(a)); } }; }\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nfunction kiemTraMatKhau(mk) {\n  const loi = [];\n  if (mk.length < 8) loi.push('Ít nhất 8 ký tự');\n  if (!/[A-Z]/.test(mk)) loi.push('Cần chữ hoa');\n  if (!/[0-9]/.test(mk)) loi.push('Cần chữ số');\n  return loi;\n}\n\ntest('mật khẩu tốt', () => expect(kiemTraMatKhau('Abcdefg1')).toEqual([]));\ntest('quá ngắn', () => expect(kiemTraMatKhau('Ab1')).toEqual(['Ít nhất 8 ký tự']));\ntest('thiếu chữ hoa', () => expect(kiemTraMatKhau('abcdefg1')).toEqual(['Cần chữ hoa']));\ntest('thiếu số', () => expect(kiemTraMatKhau('Abcdefgh')).toEqual(['Cần chữ số']));\ntest('sai tất cả', () => expect(kiemTraMatKhau('abc')).toEqual(['Ít nhất 8 ký tự', 'Cần chữ hoa', 'Cần chữ số']));"),
      check: EQ + String.raw`
        if (typeof kiemTraMatKhau !== "function") return {pass:false, msg:"Không tìm thấy kiemTraMatKhau."};
        if (T.logs.some(l => l.startsWith("❌"))) return {pass:false, msg:"Vẫn còn test đỏ: " + T.logs.find(l => l.startsWith("❌"))};
        if (T.logs.filter(l => l.startsWith("✅")).length < 5) return {pass:false, msg:"Cần cả 5 test xanh – đừng xoá test nhé!"};
        const an = [["Matkhau2026", []], ["MATKHAU1", []], ["short", ["Ít nhất 8 ký tự", "Cần chữ hoa", "Cần chữ số"]], ["12345678", ["Cần chữ hoa"]]];
        for (const [mk, kq] of an) if (!eq(kiemTraMatKhau(mk), kq)) return {pass:false, msg:"Test ẩn: kiemTraMatKhau('" + mk + "') phải là " + JSON.stringify(kq)};
        return {pass:true, msg:"Red → Green → Refactor: vòng lặp TDD bạn vừa trải nghiệm!"};`
    },
    {
      title: "Bắt bug bằng test biên", level: 4,
      task: "`tinhGiamGia(gia, phanTram)` trả về giá sau giảm, **làm tròn** đến đồng. Hàm hiện có bug.\n1) Viết **ít nhất 4 test** gồm các trường hợp biên: giảm 0%, giảm 100%, giảm 15% của 99000 (= 84150), và `phanTram` > 100 hoặc < 0 phải **throw**.\n2) Sửa hàm để mọi test xanh.\nGợi ý: thêm matcher `toThrow()` – gọi hàm, nếu **không** lỗi thì throw.",
      starter: J("function expect(a) {\n  return {\n    toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); },\n    // toThrow() { ... }  (a là một hàm)\n  };\n}\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nfunction tinhGiamGia(gia, phanTram) {\n  return gia - gia * phanTram;\n}\n\n// Viết test ở đây\n"),
      hint: "Bug: phải chia 100 và làm tròn: Math.round(gia * (100 - phanTram) / 100). Kiểm tra if (phanTram < 0 || phanTram > 100) throw new Error(...).\ntoThrow() { try { a(); } catch (e) { return; } throw new Error('Mong đợi hàm ném lỗi'); }\nTest: expect(() => tinhGiamGia(100, 150)).toThrow();",
      solution: J("function expect(a) {\n  return {\n    toBe(b) { if (a !== b) throw new Error('Mong đợi ' + b + ' nhưng nhận ' + a); },\n    toThrow() {\n      try { a(); } catch (e) { return; }\n      throw new Error('Mong đợi hàm ném lỗi');\n    }\n  };\n}\nfunction test(ten, fn) { try { fn(); console.log('✅', ten); } catch (e) { console.log('❌', ten, '→', e.message); } }\n\nfunction tinhGiamGia(gia, phanTram) {\n  if (phanTram < 0 || phanTram > 100) throw new Error('Phần trăm phải từ 0 đến 100');\n  return Math.round(gia * (100 - phanTram) / 100);\n}\n\ntest('giảm 0%', () => expect(tinhGiamGia(50000, 0)).toBe(50000));\ntest('giảm 100%', () => expect(tinhGiamGia(50000, 100)).toBe(0));\ntest('giảm 15% của 99000', () => expect(tinhGiamGia(99000, 15)).toBe(84150));\ntest('quá 100% thì lỗi', () => expect(() => tinhGiamGia(100, 150)).toThrow());\ntest('âm thì lỗi', () => expect(() => tinhGiamGia(100, -5)).toThrow());"),
      check: throwsMsg + String.raw`
        if (typeof tinhGiamGia !== "function") return {pass:false, msg:"Không tìm thấy tinhGiamGia."};
        const xanh = T.logs.filter(l => l.startsWith("✅")).length;
        if (T.logs.some(l => l.startsWith("❌"))) return {pass:false, msg:"Còn test đỏ: " + T.logs.find(l => l.startsWith("❌"))};
        if (xanh < 4) return {pass:false, msg:"Cần ít nhất 4 test xanh (đang " + xanh + ")."};
        if (!/toThrow\(\)/.test(T.src.split("// Viết test").pop() || T.src)) return {pass:false, msg:"Cần ít nhất 1 test dùng toThrow() cho phanTram không hợp lệ."};
        const cases = [[50000, 0, 50000], [50000, 100, 0], [99000, 15, 84150], [33333, 33, 22333], [10, 50, 5]];
        for (const [g, p, kq] of cases) { let r; try { r = tinhGiamGia(g, p); } catch (e) { return {pass:false, msg:"tinhGiamGia(" + g + ", " + p + ") không được throw."}; } if (r !== kq) return {pass:false, msg:"Test ẩn: tinhGiamGia(" + g + ", " + p + ") phải là " + kq + " (đang " + r + ")."}; }
        if (!nem(() => tinhGiamGia(100, 101)) || !nem(() => tinhGiamGia(100, -1))) return {pass:false, msg:"phanTram ngoài 0–100 phải throw."};
        return {pass:true, msg:"Test biên (0, 100, ngoài khoảng) bắt được phần lớn bug thực tế!"};`
    }
  ];
})();
