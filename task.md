# Quản lý Nhiệm vụ (Task Backlog) - Dự án Website Phòng khám Da liễu & Spa

Tài liệu này quản lý các tác vụ phát triển chi tiết, được tổ chức theo phương pháp Agile/Scrum. Dựa trên PRD phiên bản 1.0.

**Chú thích mức độ ưu tiên:** [🔥 Cao] | [⚡ Trung bình] | [🧊 Thấp]
**Chú thích trạng thái:** ⏳ To-Do | 🚧 In Progress | ✅ Done

---

## 🎯 Giai đoạn 1: Khởi tạo, Giao diện & CMS Cơ bản (Tuần 1 - 3)

### Epic: Thiết lập Hệ thống & Infrastructure
- [x] ✅ **TASK-101:** [🔥 Cao] Thiết lập kho mã nguồn (GitHub/GitLab), quy trình CI/CD cơ bản. `[Backend/Frontend]`
- [ ] ⏳ **TASK-102:** [🔥 Cao] Thiết lập môi trường server (Dev, Staging), cấu hình domain và SSL. `[DevOps]`
- [x] ✅ **TASK-103:** [🔥 Cao] Cài đặt & cấu hình Headless CMS / Framework Backend và Database (Next.js Framework). `[Backend]`

### Epic: UI/UX & Frontend Development
- [x] ✅ **TASK-111:** [🔥 Cao] Thiết kế Wireframe & Mockup giao diện toàn trang trên Figma (bám sát Brand Guideline - Sử dụng ảnh/logo có sẵn từ Assets). `[Designer]`
- [x] ✅ **TASK-112:** [🔥 Cao] Lập trình giao diện Trang chủ (Hero banner, Dịch vụ nổi bật, Bác sĩ). `[Frontend]`
- [x] ✅ **TASK-113:** [⚡ Trung bình] Xây dựng cấu trúc layout và Navigation (Menu, Footer). `[Frontend]`
- [ ] 🚧 **TASK-114:** [🔥 Cao] Lập trình giao diện trang Chi tiết Dịch vụ & Bài viết Kiến thức y khoa. `[Frontend]`

### Epic: CMS Customization
- [ ] ⏳ **TASK-121:** [🔥 Cao] Định nghĩa Database Schema & Collection cho "Bài viết", "Dịch vụ", "Chuyên mục". `[Backend]`
- [ ] ⏳ **TASK-122:** [🔥 Cao] Thêm trường dữ liệu (Custom Fields): "Nguồn trích dẫn y khoa" (Bắt buộc). `[Backend]`

---

## 🎯 Giai đoạn 2: Tích hợp API Trello (Tuần 4 - 5)

### Epic: Trello API & Tự động hóa
- [ ] ⏳ **TASK-201:** [🔥 Cao] Tạo Trello Developer App, lấy API Key/Token và thiết lập Webhook URL (Board: https://trello.com/b/r9bm8SjI/ydsg). `[Backend]`
- [ ] ⏳ **TASK-202:** [🔥 Cao] Viết API Endpoint (Webhook Receiver) trên Backend để nhận payload từ Trello. `[Backend]`
- [ ] ⏳ **TASK-203:** [🔥 Cao] Viết logic xử lý: Lọc dữ liệu từ cột "SPA" -> Bỏ qua card không có hình ảnh (Chỉ những bài có hình mới được đăng). `[Backend]`
- [ ] ⏳ **TASK-204:** [🔥 Cao] Mapping Data: Tiêu đề, Mô tả (Parse Markdown to HTML), Tải & lưu hình ảnh đính kèm. `[Backend]`
- [ ] ⏳ **TASK-205:** [⚡ Trung bình] Tạo logic lưu bài viết vào CMS dưới trạng thái "Draft" (Bản nháp). `[Backend]`
- [ ] ⏳ **TASK-206:** [⚡ Trung bình] Viết Unit Test cho luồng đồng bộ Trello. `[QA/Backend]`

---

## 🎯 Giai đoạn 3: Tính năng mở rộng & Media (Tuần 6 - 7)

### Epic: Đặt lịch khám
- [ ] ⏳ **TASK-301:** [🔥 Cao] Thiết kế & lập trình component Form Đặt lịch trên Frontend (Validation đầy đủ). `[Frontend]`
- [ ] ⏳ **TASK-302:** [🔥 Cao] Viết API tiếp nhận thông tin đặt lịch trên Backend. `[Backend]`
- [ ] ⏳ **TASK-303:** [🔥 Cao] Tích hợp gửi email thông báo tự động (SMTP/SendGrid) tới Admin/CRM. `[Backend]`
- [ ] ⏳ **TASK-304:** [⚡ Trung bình] Tích hợp Google reCAPTCHA v3 để chống spam form. `[Frontend/Backend]`

### Epic: Thư viện Hình ảnh (Media Gallery)
- [ ] ⏳ **TASK-311:** [⚡ Trung bình] Xây dựng giao diện Thư viện ảnh (Masonry grid, Lightbox). `[Frontend]`
- [ ] ⏳ **TASK-312:** [🔥 Cao] Cấu hình pipeline tự động tối ưu hóa hình ảnh tải lên (Convert sang WebP, resize thumbnail). `[Backend]`

---

## 🎯 Giai đoạn 4: Kiểm thử, Tối ưu & Go-Live (Tuần 8)

### Epic: Tối ưu Performance & SEO
- [ ] ⏳ **TASK-401:** [🔥 Cao] Tối ưu hóa chỉ số Core Web Vitals (Lazy load ảnh, minify CSS/JS). `[Frontend]`
- [ ] ⏳ **TASK-402:** [🔥 Cao] Tích hợp Dynamic Meta tags, Open Graph, Schema Markup Y khoa. `[Frontend]`
- [ ] ⏳ **TASK-403:** [⚡ Trung bình] Thiết lập tự động tạo file sitemap.xml và robots.txt. `[Backend/Frontend]`

### Epic: Kiểm thử (Testing) & Triển khai
- [ ] ⏳ **TASK-411:** [🔥 Cao] Cross-browser & Cross-device testing (Mobile, Tablet, PC). `[QA]`
- [ ] ⏳ **TASK-412:** [🔥 Cao] Penetration testing cơ bản, kiểm tra bảo mật API và SQL Injection. `[QA]`
- [ ] ⏳ **TASK-413:** [🔥 Cao] Đào tạo sử dụng CMS cho đội ngũ Content/Marketing. `[Project Manager]`
- [ ] ⏳ **TASK-414:** [🔥 Cao] Release Production, chuyển hướng Domain, bàn giao dự án. `[DevOps]`
