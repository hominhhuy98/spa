# Quản lý Nhiệm vụ (Task Backlog) — Website CTCP BV Y Dược Sài Gòn

**Chú thích mức độ ưu tiên:** [🔥 Cao] | [⚡ Trung bình] | [🧊 Thấp]
**Chú thích trạng thái:** ⏳ To-Do | 🚧 In Progress | ✅ Done
**Cập nhật lần cuối:** 14/04/2026

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

## ✅ Giai đoạn 4: Thương hiệu & UX (Tuần 8)

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

## ✅ Giai đoạn 5: Hệ thống Quản lý Nội bộ — Auth & Portal (Tuần 9–10)

### Xác thực & Phân quyền
- [x] ✅ **TASK-501** [🔥] Tích hợp Supabase Auth với 4 role: `admin`, `bac_si`, `nhan_vien`, `customer`.
- [x] ✅ **TASK-502** [🔥] Hệ thống OTP tự xây (bảng `otp_verifications`) cho khách hàng đăng nhập bằng SĐT.
- [x] ✅ **TASK-503** [🔥] Magic link session sau OTP (không dùng Supabase Phone Auth để tránh chi phí SMS).
- [x] ✅ **TASK-504** [🔥] Middleware bảo vệ route theo role — redirect đúng dashboard từng vai trò.
- [x] ✅ **TASK-505** [🔥] Zalo ZNS thông báo xác nhận lịch hẹn cho khách (khi đặt lịch qua form public).

### Admin Dashboard (`/admin`)
- [x] ✅ **TASK-511** [🔥] Dashboard admin: thống kê tổng lịch hẹn theo trạng thái.
- [x] ✅ **TASK-512** [🔥] Quản lý lịch hẹn: danh sách, lọc trạng thái, cập nhật status, phân công nhân sự.
- [x] ✅ **TASK-513** [🔥] Trang chi tiết lịch hẹn admin: xem toàn bộ thông tin + gán nhân sự.
- [x] ✅ **TASK-514** [🔥] Quản lý nhân sự: danh sách, thêm mới (tạo Supabase Auth user + profile).
- [x] ✅ **TASK-515** [⚡] Tra cứu khách hàng theo SĐT + xem toàn bộ lịch sử khám.

### Nhân viên Dashboard (`/nhan-vien`)
- [x] ✅ **TASK-521** [🔥] Dashboard nhân viên: stat cards, lịch hôm nay, lịch phân công (`updated_by`).
- [x] ✅ **TASK-522** [🔥] Walk-in modal: tiếp nhận khách không có hẹn, tạo lịch tức thì.
- [x] ✅ **TASK-523** [🔥] Chi tiết lịch hẹn: cập nhật trạng thái, thêm ghi chú, chọn nhân viên/bác sĩ.
- [x] ✅ **TASK-524** [🔥] Upload ảnh before/after lên Supabase Storage.
- [x] ✅ **TASK-525** [⚡] Nhân viên xem Module Thuốc & Module Điều Trị (read-only).

### Bác sĩ Dashboard (`/bac-si`)
- [x] ✅ **TASK-531** [🔥] Dashboard bác sĩ: tương tự nhân viên, phân quyền riêng.
- [x] ✅ **TASK-532** [🔥] Chi tiết lịch hẹn bác sĩ: đầy đủ quyền chỉnh sửa hồ sơ.
- [x] ✅ **TASK-533** [🔥] Kê đơn thuốc (Module Thuốc): bác sĩ tạo đơn, nhân viên xem.
- [x] ✅ **TASK-534** [🔥] Tạo phác đồ điều trị (Module Điều Trị): số buổi, tiến độ, ngày tiếp theo.

### Customer Portal (`/portal`)
- [x] ✅ **TASK-541** [🔥] Portal khách hàng: đăng nhập SĐT → OTP → magic link session.
- [x] ✅ **TASK-542** [🔥] Tab lịch hẹn: Ngày mai (với banner nhắc nhở), Đang chờ, Hoàn thành.
- [x] ✅ **TASK-543** [⚡] Banner nhắc lịch ngày mai với animation pulse.
- [x] ✅ **TASK-544** [⚡] Nút "Đặt Lịch Mới" từ portal → form đặt lịch.

---

## ✅ Giai đoạn 6: Module Lâm Sàng — Thuốc & Điều Trị (Tuần 11)

- [x] ✅ **TASK-601** [🔥] SQL migration: tạo bảng `prescriptions`, `prescription_items`, `treatment_plans`.
- [x] ✅ **TASK-602** [🔥] API `GET/POST /api/prescriptions` — bác sĩ kê đơn, nhân viên & admin đọc.
- [x] ✅ **TASK-603** [🔥] API `GET/POST/PATCH /api/treatment-plans` — bác sĩ tạo/cập nhật, nhân viên đọc.
- [x] ✅ **TASK-604** [🔥] Component `PrescriptionPanel`: form kê đơn (bác sĩ) + view read-only (nhân viên).
- [x] ✅ **TASK-605** [🔥] Component `TreatmentPlanPanel`: tạo phác đồ, thanh tiến độ buổi, cập nhật ngày tiếp theo.
- [x] ✅ **TASK-606** [🔥] Tích hợp 2 panel vào trang chi tiết lịch hẹn của cả bác sĩ lẫn nhân viên.

> ⚠️ **Lưu ý:** Cần chạy file `web/src/db/migration-modules.sql` trong **Supabase Dashboard → SQL Editor** trước khi dùng 2 module này.

---

## ✅ Giai đoạn 7: Dữ liệu Test & E2E Testing (Tuần 11)

### Dữ liệu test (seed)
- [x] ✅ **TASK-701** [🔥] Tạo tài khoản admin: `huyho.it98@gmail.com` / `ChangeMe@2026`.
- [x] ✅ **TASK-702** [🔥] Tạo tài khoản bác sĩ: `bacsi.test@ydsg.vn` / `BacSi@2026`.
- [x] ✅ **TASK-703** [🔥] Tạo tài khoản nhân viên: `nhanvien.test@ydsg.vn` / `NhanVien@2026`.
- [x] ✅ **TASK-704** [🔥] Seed 4 khách hàng test (SĐT `0901000001–004`) với lịch hẹn đủ trạng thái.
- [x] ✅ **TASK-705** [⚡] OTP test `123456` (hạn 24h) cho tất cả khách hàng.
- [x] ✅ **TASK-706** [⚡] Seed lịch hẹn hôm nay cho nhân viên và phân công `updated_by`.

### E2E Testing với Playwright
- [x] ✅ **TASK-711** [🔥] Cài đặt `@playwright/test` + cấu hình `playwright.config.ts`.
- [x] ✅ **TASK-712** [🔥] `01-public.spec.ts` — 16 test: homepage, dịch vụ, bảng giá, tin tức, form đặt lịch, 404.
- [x] ✅ **TASK-713** [🔥] `02-admin.spec.ts` — 14 test: auth, dashboard, lịch hẹn, nhân sự, khách hàng.
- [x] ✅ **TASK-714** [🔥] `03-nhan-vien.spec.ts` — 17 test: auth, dashboard, walk-in, chi tiết lịch, read-only module.
- [x] ✅ **TASK-715** [🔥] `04-bac-si.spec.ts` — 22 test: auth, kê đơn thuốc, phác đồ điều trị, tiến độ buổi.
- [x] ✅ **TASK-716** [🔥] `05-portal-customer.spec.ts` — 17 test: OTP login, tabs lịch, 4 khách hàng test.

---

## ✅ Giai đoạn 8: Migration Supabase → Firebase & Deploy Production (Tuần 12–13)

### Migration
- [x] ✅ **TASK-801** [🔥] Tạo Firebase project (Auth, Firestore, Storage) trên Google Cloud.
- [x] ✅ **TASK-802** [🔥] Tạo Firebase lib layer: `firebase.ts`, `firebase-admin.ts`, `firebase-session.ts`.
- [x] ✅ **TASK-803** [🔥] Migration Auth: rewrite tất cả login flows (Email/Password, Google OAuth, Zalo OAuth, Phone OTP).
- [x] ✅ **TASK-804** [🔥] Migration Database: chuyển 9 bảng PostgreSQL → Firestore collections (denormalize, subcollections).
- [x] ✅ **TASK-805** [🔥] Migration Storage: chuyển Supabase Storage → Firebase Storage.
- [x] ✅ **TASK-806** [🔥] Rewrite middleware (Edge Runtime compatible): JWT decode + role-based route protection.
- [x] ✅ **TASK-807** [🔥] Rewrite 14 API routes + 11 server components → Firestore queries.
- [x] ✅ **TASK-808** [🔥] Script migrate data: 11 users, 5 profiles, 4 customers, 24 appointments.
- [x] ✅ **TASK-809** [🔥] Xóa hoàn toàn Supabase dependencies (`@supabase/ssr`, `@supabase/supabase-js`).

### Deploy & Domain
- [x] ✅ **TASK-811** [🔥] Tạo Dockerfile multi-stage build + `output: "standalone"`.
- [x] ✅ **TASK-812** [🔥] Deploy lên Google Cloud Run (asia-southeast1) với Cloud Build.
- [x] ✅ **TASK-813** [🔥] Map domain `dalieuyduocsaigon.com` → Cloud Run + SSL tự động.
- [x] ✅ **TASK-814** [🔥] Cấu hình DNS trên Mắt Bão (A records + CNAME).
- [x] ✅ **TASK-815** [🔥] Firebase Auth: thêm authorized domain.
- [x] ✅ **TASK-816** [⚡] Xác thực domain Zalo Developers + cấu hình Callback URL.

---

## ✅ Giai đoạn 9: Liệu Trình CSD/Peel & Admin Backend (Tuần 13–14)

### Liệu trình mới
- [x] ✅ **TASK-901** [🔥] Thiết kế Firestore collection `treatment_services` với 18 quy trình từ PDF.
- [x] ✅ **TASK-902** [🔥] Seed data: 18 quy trình (CSD, Mụn Face/Body, Da nhạy cảm, Chemical Peel).
- [x] ✅ **TASK-903** [🔥] Sửa lỗi theo yêu cầu: chụp hình da lên bước 2, Vasellin + Nước muối cùng bước.
- [x] ✅ **TASK-904** [🔥] Trang dịch vụ public: chỉ hiện tên + đối tượng phù hợp (bỏ quy trình chi tiết).
- [x] ✅ **TASK-905** [🔥] Trang gói dịch vụ: lấy dynamic từ Firestore, chia nhóm theo đối tượng.
- [x] ✅ **TASK-906** [🔥] Form đặt lịch: dropdown dịch vụ dynamic từ Firestore.
- [x] ✅ **TASK-907** [🔥] WalkIn Modal: dropdown dịch vụ dynamic (admin/bác sĩ/nhân viên).

### Admin Backend hoàn thiện
- [x] ✅ **TASK-911** [🔥] Admin CRUD Liệu trình: list, create, edit, delete, toggle active.
- [x] ✅ **TASK-912** [🔥] Admin CRUD Nhân sự: sửa tên/role/password, vô hiệu hóa.
- [x] ✅ **TASK-913** [🔥] API route `PATCH/DELETE /api/admin/staff/[id]`.
- [x] ✅ **TASK-914** [🔥] Nút xác nhận/hủy lịch hẹn nhanh trên danh sách.
- [x] ✅ **TASK-915** [🔥] Auto hủy lịch pending quá ngày khi admin mở trang.
- [x] ✅ **TASK-916** [🔥] Redesign trang chi tiết lịch hẹn admin (timeline ghi chú, radio status, phân công).
- [x] ✅ **TASK-917** [🔥] Admin có quyền thêm ghi chú điều trị (kèm tên + thời gian).

### UI/UX
- [x] ✅ **TASK-921** [⚡] Bỏ chữ "Quốc Tế", giữ "Chuẩn Y Khoa" trên hero banner.
- [x] ✅ **TASK-922** [⚡] Đổi "Chuyên khoa II" → "Chuyên khoa I" toàn bộ website.
- [x] ✅ **TASK-923** [⚡] Icon user SVG thay "KH" khi chưa đăng nhập.
- [x] ✅ **TASK-924** [⚡] Zalo meta tag verification cho domain.
- [x] ✅ **TASK-925** [⚡] Fix Firestore Timestamp serialization cho tất cả server components.

---

## ⏳ Backlog — Chưa thực hiện

### SEO & Performance
- [ ] ⏳ **TASK-801** [🔥] Tích hợp Dynamic Meta tags và Open Graph cho từng trang.
- [ ] ⏳ **TASK-802** [🔥] Schema Markup y khoa (MedicalOrganization, MedicalClinic).
- [ ] ⏳ **TASK-803** [⚡] Tự động tạo `sitemap.xml` và `robots.txt`.
- [ ] ⏳ **TASK-804** [⚡] Tích hợp Google reCAPTCHA v3 chống spam form.

### Tính năng lâm sàng bổ sung
- [ ] ⏳ **TASK-811** [🔥] In / xuất PDF đơn thuốc cho bệnh nhân.
- [ ] ⏳ **TASK-812** [⚡] Thông báo Zalo ZNS nhắc lịch khách hàng 1 ngày trước.
- [ ] ⏳ **TASK-813** [⚡] Gia hạn OTP tự động — hiện OTP hết hạn 24h phải seed lại thủ công.
- [ ] ⏳ **TASK-814** [🧊] Liên kết SĐT khách hàng với tài khoản portal (hiện phải nhập đúng SĐT).
- [ ] ⏳ **TASK-815** [🧊] Khách hàng xem đơn thuốc & phác đồ từ portal.

### Go-Live & Vận hành
- [ ] ⏳ **TASK-821** [🔥] Cross-browser & cross-device testing (Mobile, Tablet, Desktop).
- [ ] ⏳ **TASK-822** [🔥] Kiểm tra bảo mật API: injection, rate limiting.
- [x] ✅ **TASK-823** [⚡] Cấu hình domain, SSL, deploy production. (Done — Cloud Run + dalieuyduocsaigon.com)
- [ ] ⏳ **TASK-824** [⚡] Đào tạo đội ngũ sử dụng hệ thống (admin, bác sĩ, nhân viên).
- [ ] ⏳ **TASK-825** [🧊] Backup & restore chiến lược cho Firestore database.

### Tính năng tương lai
- [ ] 🧊 **TASK-831** Thư viện ảnh Before & After (Masonry grid + Lightbox).
- [ ] 🧊 **TASK-832** Tối ưu hình ảnh tự động (WebP conversion pipeline).
- [ ] 🧊 **TASK-833** Trang bác sĩ/đội ngũ chuyên môn công khai.
- [ ] 🧊 **TASK-834** Mobile menu hamburger responsive.
- [ ] 🧊 **TASK-835** Dashboard thống kê doanh thu / hiệu suất điều trị cho admin.
- [ ] 🧊 **TASK-836** Tích hợp lịch (calendar view) cho bác sĩ/nhân viên thay vì danh sách.
