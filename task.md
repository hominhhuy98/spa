# Quản lý Nhiệm vụ (Task Backlog) — Website CTCP BV Y Dược Sài Gòn

**Chú thích mức độ ưu tiên:** [🔥 Cao] | [⚡ Trung bình] | [🧊 Thấp]
**Chú thích trạng thái:** ⏳ To-Do | 🚧 In Progress | ✅ Done
**Cập nhật lần cuối:** 25/03/2026

---

## ✅ Giai đoạn 1: Khởi tạo & Infrastructure (Tuần 1–3)

- [x] ✅ **TASK-101** [🔥] Thiết lập kho mã nguồn GitHub, cấu hình Next.js 16 App Router.
- [x] ✅ **TASK-102** [🔥] Cài đặt TailwindCSS v4 với custom `@theme` variables.
- [x] ✅ **TASK-103** [🔥] Cấu hình Google Fonts: Be Vietnam Pro + Playfair Display.
- [x] ✅ **TASK-104** [🔥] Thiết lập `output: 'export'` cho static site generation.
- [x] ✅ **TASK-111** [🔥] Xây dựng layout toàn trang: Topbar, Navbar sticky, Footer responsive.
- [x] ✅ **TASK-112** [🔥] Lập trình Trang Chủ: Hero banner, Phác Đồ Điều Trị 6 bệnh lý, Stats, CTA.
- [x] ✅ **TASK-113** [🔥] Xây dựng trang `/dich-vu-da-lieu` với ICD badge và nguồn Bộ Y Tế VN.
- [x] ✅ **TASK-114** [⚡] Xây dựng trang `/may-moc` (Thiết Bị Y Tế).

---

## ✅ Giai đoạn 2: API & Tính năng cốt lõi (Tuần 4–5)

- [x] ✅ **TASK-201** [🔥] Tạo API endpoint `/api/trello-webhook` nhận payload Trello.
- [x] ✅ **TASK-202** [🔥] Logic lọc card từ cột "SPA" có đính kèm hình ảnh.
- [x] ✅ **TASK-203** [🔥] Mapping data: title, Markdown description, attachment image.
- [x] ✅ **TASK-204** [🔥] Tạo API endpoint `/api/book-appointment` gửi thông báo đặt lịch.
- [x] ✅ **TASK-205** [🔥] Xây dựng form đặt lịch `/dat-lich` với validation đầy đủ.
- [x] ✅ **TASK-206** [🔥] Sidebar đặt lịch: thông tin liên hệ, lưu ý khám, chính sách hủy, hotline.
- [x] ✅ **TASK-207** [⚡] Nhúng Google Maps iframe (không cần API key).

---

## ✅ Giai đoạn 3: Nội dung & Mở rộng (Tuần 6–7)

- [x] ✅ **TASK-301** [🔥] Xây dựng trang `/tin-tuc` danh sách 9 bài viết kiến thức da liễu.
- [x] ✅ **TASK-302** [🔥] Xây dựng trang `/tin-tuc/[id]` chi tiết bài viết với Markdown renderer.
- [x] ✅ **TASK-303** [🔥] Xóa toàn bộ tham chiếu tổ chức quốc tế (AAD, EADV, WHO, FDA, NICE) ngoài trang may-moc.
- [x] ✅ **TASK-304** [🔥] Xây dựng trang `/goi-dich-vu` — 7 danh mục, 17 gói liệu trình.
- [x] ✅ **TASK-305** [🔥] Xây dựng trang `/bang-gia` — bảng giá đầy đủ (lẻ + combo + body).
- [x] ✅ **TASK-306** [⚡] Xây dựng trang `/khuyen-mai` — ưu đãi khách hàng mới 3 mức.
- [x] ✅ **TASK-307** [⚡] Thêm banner khuyến mãi vào homepage (GIẢM 30K–100K).
- [x] ✅ **TASK-308** [⚡] Xóa trang `/phan-tich-lan-da` và nav link.

---

## ✅ Giai đoạn 4: Thương hiệu & UX (Tuần 8 — Đang hoàn thiện)

- [x] ✅ **TASK-401** [🔥] Cập nhật brand name: "BV Y Dược Sài Gòn" → "CTCP BỆNH VIỆN Y DƯỢC SÀI GÒN".
- [x] ✅ **TASK-402** [🔥] Cập nhật màu theo logo: Primary `#1A8DC4` (xanh y tế) + Secondary `#C8A040` (vàng đồng).
- [x] ✅ **TASK-403** [🔥] Thiết kế header Pencil: topbar xanh đậm, brand CTCP, nút CTA vàng đồng.
- [x] ✅ **TASK-404** [🔥] Thiết kế Color Palette + Hero section trong Pencil extension.
- [x] ✅ **TASK-405** [🔥] Thiết kế Phác Đồ Điều Trị section trong Pencil (6 card, border-l-4, ICD badge).
- [x] ✅ **TASK-406** [⚡] Đổi nav "Gói Spa" → "Liệu Trình" (chuyên nghiệp hơn cho da liễu).
- [x] ✅ **TASK-407** [⚡] Thêm "Bảng Giá" vào navigation.
- [x] ✅ **TASK-408** [🔥] Pre-select dropdown dịch vụ khi đặt lịch từ trang Liệu Trình (`?dich-vu=`).
- [x] ✅ **TASK-409** [⚡] Thêm tất cả gói spa vào SERVICES dropdown trang đặt lịch.
- [x] ✅ **TASK-410** [⚡] Subtitle header: "Da Liễu & Spa" → "Chuyên Khoa Da Liễu".

---

## ⏳ Backlog — Chưa thực hiện

### SEO & Performance
- [ ] ⏳ **TASK-501** [🔥] Tích hợp Dynamic Meta tags và Open Graph cho từng trang.
- [ ] ⏳ **TASK-502** [🔥] Schema Markup y khoa (MedicalOrganization, MedicalClinic).
- [ ] ⏳ **TASK-503** [⚡] Tự động tạo `sitemap.xml` và `robots.txt`.
- [ ] ⏳ **TASK-504** [⚡] Tích hợp Google reCAPTCHA v3 chống spam form.

### Testing & Go-Live
- [ ] ⏳ **TASK-511** [🔥] Cross-browser & cross-device testing (Mobile, Tablet, Desktop).
- [ ] ⏳ **TASK-512** [🔥] Kiểm tra bảo mật API: injection, rate limiting.
- [ ] ⏳ **TASK-513** [⚡] Cấu hình domain, SSL, deploy production.
- [ ] ⏳ **TASK-514** [⚡] Đào tạo đội ngũ content sử dụng Trello → website flow.

### Tính năng tương lai
- [ ] 🧊 **TASK-521** Thư viện ảnh Before & After (Masonry grid + Lightbox).
- [ ] 🧊 **TASK-522** Tối ưu hình ảnh tự động (WebP conversion pipeline).
- [ ] 🧊 **TASK-523** Trang bác sĩ/đội ngũ chuyên môn.
- [ ] 🧊 **TASK-524** Mobile menu hamburger responsive.
