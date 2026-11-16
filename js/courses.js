/* =========================================================
   KHOÁ HỌC – nhóm các cấp độ (LEVELS) thành lộ trình lớn
   - Mỗi level có trường course; level cũ trong lessons.js mặc định "fe-basic"
   - Thêm khoá mới: thêm vào COURSES, rồi LEVELS.push({... course: "<id>"})
   ========================================================= */
const COURSES = [
  {
    id: "fe-basic", name: "Front-end Cơ bản", short: "FE Cơ bản", icon: "🧱", color: "#16a34a",
    desc: "Nền tảng làm web: HTML, CSS, Flexbox/Grid, JavaScript, DOM và bất đồng bộ.",
    tags: ["HTML", "CSS", "Responsive", "JavaScript", "DOM"]
  },
  {
    id: "fe-pro", name: "Front-end Nâng cao", short: "FE Nâng cao", icon: "⚛️", color: "#0ea5e9",
    desc: "Làm việc như dev chuyên nghiệp: Git, JavaScript hiện đại, tư duy Component, TypeScript, a11y, hiệu năng và kiểm thử.",
    tags: ["Git", "ES2024", "Component", "TypeScript", "Testing"]
  },
  {
    id: "be-node", name: "Back-end Node.js", short: "Back-end", icon: "🟩", color: "#65a30d",
    desc: "Xây server và REST API bằng Node.js + Express, lưu dữ liệu với SQL, bảo mật bằng bcrypt + JWT và triển khai thực tế.",
    tags: ["Node.js", "Express", "REST API", "SQL", "JWT"]
  }
];
LEVELS.forEach(l => { if (!l.course) l.course = "fe-basic"; });
