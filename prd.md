# Tài liệu Yêu cầu Sản phẩm (PRD)
**Dự án:** Website & Hệ thống Quản lý Nội bộ — CTCP Bệnh Viện Y Dược Sài Gòn
**Đơn vị chủ quản:** CTCP Bệnh Viện Y Dược Sài Gòn
**Phiên bản:** 5.1 | **Ngày cập nhật:** 08/05/2026
**Trạng thái:** Production — Hoàn thiện Customer Portal + Admin Backend

---

## 1. Tổng quan dự án (Project Overview)

### 1.1 Mục tiêu (Objectives)
Xây dựng nền tảng tích hợp gồm:
1. **Website công khai** chuyên nghiệp cho Phòng Khám Da Liễu — giúp bệnh nhân tìm hiểu dịch vụ, đặt lịch khám, nâng cao thương hiệu y khoa.
2. **Hệ thống quản lý nội bộ** (Internal Management System) cho Admin, Bác sĩ và Nhân viên — quản lý lịch hẹn, hồ sơ bệnh nhân, đơn thuốc, phác đồ điều trị.
3. **Customer Portal** — khách hàng tự xem và quản lý lịch hẹn của mình qua SĐT + OTP.

### 1.2 Chỉ số đo lường thành công (KPIs)
- **Hiệu suất web:** Tốc độ tải trang < 3 giây trên mobile và desktop.
- **Vận hành:** Giảm 80% thời gian quản lý lịch hẹn thủ công.
- **Tương tác:** Tăng tỷ lệ chuyển đổi đặt lịch khám 15% trong quý đầu ra mắt.
- **Lâm sàng:** 100% lịch hẹn có hồ sơ đầy đủ (nhân viên, bác sĩ, đơn thuốc, phác đồ).

### 1.3 Phạm vi dự án (cập nhật v3.0)
- **Trong phạm vi:**
  - Website Frontend (Next.js static export)
  - Form đặt lịch công khai + thông báo Zalo ZNS
  - Tích hợp Trello Webhook (nội dung SPA)
  - Hệ thống auth 4 role (Supabase)
  - Admin dashboard (lịch hẹn, nhân sự, khách hàng)
  - Staff dashboard: Nhân viên + Bác sĩ
  - Module Thuốc (kê đơn) + Module Điều Trị (phác đồ)
  - Customer Portal (OTP login, xem lịch)
  - E2E Testing (Playwright, ~86 test cases)
- **Ngoài phạm vi hiện tại:**
  - Thanh toán trực tuyến
  - Chatbot AI
  - Khách hàng xem đơn thuốc/phác đồ từ portal (roadmap)
  - In PDF đơn thuốc (roadmap)

---

## 2. Nhận diện thương hiệu (Brand Identity)

### 2.1 Tên thương hiệu
- **Tên đầy đủ:** CTCP BỆNH VIỆN Y DƯỢC SÀI GÒN
- **Chuyên khoa:** Chuyên Khoa Da Liễu
- **Địa chỉ:** 405-407 Đỗ Xuân Hợp, Phước Long, TP.HCM
- **Hotline:** 028 6285 2727 — 028 6285 2929
- **Giờ hoạt động:** T2–CN: 8:00–11:30 / 13:30–17:00

### 2.2 Bảng màu (từ logo)
| Token | Hex | Sử dụng |
|-------|-----|---------|
| `primary` | `#1A8DC4` | Màu xanh y tế — vòng ngoài logo, navbar, buttons chính |
| `primary-dark` | `#0D6FA3` | Xanh đậm — topbar, tiêu đề |
| `secondary` | `#C8A040` | Vàng đồng — trái tim logo, nút CTA nổi bật, nhãn phụ |
| `secondary-light` | `#E8C060` | Vàng nhạt |
| `secondary-dark` | `#A07830` | Vàng đậm — hover state |
| Internal UI | `#2C5F5D` | Xanh rêu — màu accent hệ thống nội bộ (staff/admin) |

### 2.3 Typography
- **Heading/Body:** Be Vietnam Pro (Vietnamese subset, 400–900)
- **Accent/Serif:** Playfair Display (latin, italic/normal, 400–700)

---

## 3. Cấu trúc trang (Site Map)

### 3.1 Website công khai
| Route | Tên trang | Trạng thái |
|-------|-----------|------------|
| `/` | Trang Chủ | ✅ Hoàn thành |
| `/goi-dich-vu` | Liệu Trình (Gói dịch vụ Spa) | ✅ Hoàn thành |
| `/bang-gia` | Bảng Giá dịch vụ | ✅ Hoàn thành |
| `/may-moc` | Thiết Bị Y tế | ✅ Hoàn thành |
| `/tin-tuc` | Kiến Thức Da Liễu | ✅ Hoàn thành |
| `/tin-tuc/[id]` | Chi tiết bài viết | ✅ Hoàn thành |
| `/dat-lich` | Đặt Lịch Khám | ✅ Hoàn thành |
| `/khuyen-mai` | Ưu Đãi Khách Hàng Mới | ✅ Hoàn thành |
| `/dich-vu-da-lieu` | Điều Trị Da Liễu (ẩn khỏi nav) | ✅ Hoàn thành |

**Navigation (header):** Trang Chủ · Liệu Trình · Bảng Giá · Thiết Bị · Kiến Thức · [Đặt Lịch Khám]

### 3.2 Hệ thống nội bộ (Staff & Admin)
| Route | Vai trò | Trạng thái |
|-------|---------|------------|
| `/login` | Bác sĩ / Nhân viên | ✅ Hoàn thành |
| `/admin/login` | Admin | ✅ Hoàn thành |
| `/admin` | Admin Dashboard | ✅ Hoàn thành |
| `/admin/lich-hen` | Quản lý lịch hẹn | ✅ Hoàn thành |
| `/admin/lich-hen/[id]` | Chi tiết lịch hẹn (admin) | ✅ Hoàn thành |
| `/admin/nhan-su` | Quản lý nhân sự | ✅ Hoàn thành |
| `/admin/nhan-su/moi` | Thêm nhân viên/bác sĩ | ✅ Hoàn thành |
| `/admin/khach-hang` | Tra cứu khách hàng | ✅ Hoàn thành |
| `/nhan-vien` | Dashboard nhân viên | ✅ Hoàn thành |
| `/nhan-vien/[id]` | Chi tiết lịch (nhân viên) | ✅ Hoàn thành |
| `/bac-si` | Dashboard bác sĩ | ✅ Hoàn thành |
| `/bac-si/[id]` | Chi tiết lịch (bác sĩ) | ✅ Hoàn thành |

### 3.3 Customer Portal
| Route | Mô tả | Trạng thái |
|-------|-------|------------|
| `/portal/login` | Đăng nhập SĐT + OTP | ✅ Hoàn thành |
| `/portal` | Xem lịch hẹn (3 tabs) | ✅ Hoàn thành |

---

## 4. Yêu cầu tính năng (Functional Requirements)

### Epic 1–6: Website công khai *(đã hoàn thành — xem PRD v2.0)*

### Epic 7: Hệ thống Auth & Phân quyền
- 4 role: `admin`, `bac_si`, `nhan_vien`, `customer`.
- Lưu role trong `app_metadata` của Supabase Auth (không thể giả mạo từ client).
- Khách hàng đăng nhập bằng SĐT → OTP tự build (bảng `otp_verifications`) → magic link session.
- Middleware Next.js kiểm tra session + redirect đúng dashboard theo role.
- Email giả cho customer auth: `customer_{phone}@portal.ydsg.vn`.

### Epic 8: Admin Dashboard
- Thống kê tổng lịch hẹn hôm nay theo trạng thái.
- Danh sách lịch hẹn: lọc theo trạng thái, phân trang.
- Chi tiết lịch hẹn: cập nhật status (pending → confirmed → done/cancelled), gán nhân sự.
- Quản lý nhân sự: tạo tài khoản auth + profile cùng lúc qua API.
- Tra cứu khách hàng theo SĐT: toàn bộ lịch sử khám theo thời gian.

### Epic 9: Staff Dashboard (Nhân viên & Bác sĩ)
- Dashboard hiển thị lịch hôm nay (theo `date`) + lịch phân công (theo `updated_by`).
- Walk-in: tiếp nhận khách không hẹn, tạo lịch tức thì với trạng thái `confirmed`.
- Chi tiết lịch hẹn:
  - Cập nhật trạng thái theo flow: pending → confirmed → done/cancelled.
  - Chọn nhân viên tiếp nhận + bác sĩ phụ trách (từ dropdown profile).
  - Ngày tái khám + ghi chú tái khám.
  - Upload ảnh before/after lên Supabase Storage.
  - Thêm ghi chú điều trị (bảng `treatment_notes`).
- **Bác sĩ có thêm quyền:** Kê đơn thuốc, Tạo/cập nhật phác đồ điều trị.
- **Nhân viên:** chỉ xem (read-only) đơn thuốc và phác đồ.

### Epic 10: Module Thuốc (Kê Đơn)
- Bác sĩ tạo đơn thuốc gắn với `appointment_id`.
- Mỗi đơn có: chẩn đoán, ghi chú, danh sách thuốc.
- Mỗi dòng thuốc có: tên, liều dùng, tần suất, thời gian, hướng dẫn, thứ tự.
- Nhân viên và admin xem được đơn thuốc (read-only).
- Lưu trong bảng `prescriptions` + `prescription_items`.

### Epic 11: Module Điều Trị (Phác Đồ)
- Bác sĩ tạo phác đồ gắn với `appointment_id`.
- Phác đồ có: chẩn đoán, nội dung phác đồ, tổng số buổi, số buổi đã thực hiện, ngày buổi tiếp theo, ghi chú.
- Thanh tiến độ (progress bar) hiển thị % hoàn thành.
- Bác sĩ cập nhật số buổi bằng nút +/− (auto-save).
- Ngày buổi tiếp theo chỉnh sửa inline (auto-save on blur).
- Nhân viên xem read-only.
- Lưu trong bảng `treatment_plans`.

### Epic 12: Customer Portal
- Đăng nhập bằng SĐT → nhập OTP 6 số → tự động tạo session Supabase.
- 3 tab lịch hẹn: **Ngày mai** (banner nhắc nhở + pulse animation), **Đang chờ**, **Hoàn thành**.
- Banner nhắc lịch ngày mai hiển thị tên dịch vụ, giờ, địa chỉ.
- Nút "Đặt Lịch Mới" → form đặt lịch công khai.

---

## 5. Yêu cầu phi chức năng (Non-Functional)
- **UI/UX:** Thiết kế y khoa chuyên nghiệp, màu từ logo (xanh y tế + vàng đồng). Responsive 100%.
- **Performance:** Load < 3 giây, PageSpeed >= 85 (mobile & desktop).
- **SEO:** URL thân thiện, meta tags tùy chỉnh, cấu trúc heading rõ ràng.
- **Bảo mật:**
  - HTTPS, không lưu dữ liệu nhạy cảm phía client.
  - Role kiểm tra tại server (`app_metadata` — không thể giả mạo từ browser).
  - Service Role Key chỉ dùng phía server (không expose ra client).
  - OTP hết hạn sau 24h, đánh dấu `used=true` sau khi xác thực.
- **Nội dung:** Không đề cập tổ chức quốc tế (AAD, EADV, WHO, FDA) trừ trang Thiết Bị.

---

## 6. Kiến trúc Công nghệ (Tech Stack thực tế)

| Thành phần | Công nghệ |
|-----------|-----------|
| Framework | Next.js 16 App Router, `output: 'export'` (static cho public) |
| Styling | TailwindCSS v4, custom `@theme` variables |
| Font | Be Vietnam Pro + Playfair Display (Google Fonts) |
| Backend/Auth | Supabase (PostgreSQL + Auth + Storage) |
| Auth flow | Supabase Auth: email/password (staff) + magic link (customer) |
| OTP | Tự build: bảng `otp_verifications`, không dùng Supabase Phone Auth |
| Notification | Zalo ZNS (thông báo lịch hẹn) + Nodemailer (email fallback) |
| API | Next.js Route Handlers (booking, auth, admin, portal) |
| Maps | Google Maps iframe embed (không API key) |
| Design tool | Pencil MCP extension (`.pen` files) |
| Testing | Playwright (E2E, ~86 test cases) |
| Hosting | Static export — compatible với Nginx/Vercel/GitHub Pages |

---

## 7. Database Schema (Supabase)

| Bảng | Mô tả |
|------|-------|
| `appointments` | Lịch hẹn: name, phone, service, date, time, status, notes, updated_by |
| `profiles` | Hồ sơ nhân viên/bác sĩ: id (= auth.uid), role, full_name, email |
| `treatment_notes` | Ghi chú điều trị tự do (nhiều ghi chú / lịch hẹn) |
| `appointment_assignments` | Phân công nhân sự cho lịch hẹn (appointment_id, staff_id) |
| `otp_verifications` | OTP xác thực khách hàng: phone, otp_code, expires_at, used |
| `customers` | Danh sách SĐT khách hàng đã đăng ký portal |
| `prescriptions` | Đơn thuốc: appointment_id, prescribed_by, diagnosis, notes |
| `prescription_items` | Dòng thuốc: medicine_name, dosage, frequency, duration, instructions |
| `treatment_plans` | Phác đồ điều trị: sessions_total, sessions_done, next_session_date |

---

## 8. Tài khoản Test (Môi trường Dev)

| Role | Email / SĐT | Password / OTP | Đăng nhập tại |
|------|------------|----------------|---------------|
| Admin | huyho.it98@gmail.com | ChangeMe@2026 | `/admin/login` |
| Bác sĩ | bacsi.test@ydsg.vn | BacSi@2026 | `/login` |
| Nhân viên | nhanvien.test@ydsg.vn | NhanVien@2026 | `/login` |
| Khách hàng 1 | 0901000001 | OTP: 123456 | `/portal/login` |
| Khách hàng 2 | 0901000002 | OTP: 123456 | `/portal/login` |
| Khách hàng 3 | 0901000003 | OTP: 123456 | `/portal/login` |
| Khách hàng 4 | 0901000004 | OTP: 123456 | `/portal/login` |

> ⚠️ OTP test `123456` có hạn 24h. Nếu hết hạn, chạy lại script seed hoặc insert thủ công vào bảng `otp_verifications`.

---

## 9. Lưu ý Quan trọng (Critical Notes)

### Trước khi chạy Module Thuốc & Điều Trị
Phải chạy SQL migration trong **Supabase Dashboard → SQL Editor**:
```
web/src/db/migration-modules.sql
```

### Cấu hình biến môi trường (`web/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      ← Chỉ dùng phía server, không expose
ZALO_OA_ACCESS_TOKEN=...
ZALO_APP_ID=...
ZALO_APP_SECRET=...
ZALO_TEMPLATE_ID=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Chạy E2E Test
```bash
cd web
npm test              # chạy toàn bộ (tự khởi động dev server)
npm run test:ui       # giao diện interactive
npm run test:headed   # hiện browser
npm run test:report   # xem HTML report
```

### Luồng OTP (không dùng Supabase Phone Auth)
1. Khách nhập SĐT → `/api/auth/request-otp` → insert vào `otp_verifications`
2. Khách nhập OTP → `/api/auth/verify-otp` → kiểm tra DB → tạo user auth (email giả) → trả magic link token
3. Client dùng token để đổi lấy session Supabase → redirect `/portal`

### Phân quyền (Role-Based Access Control)
| Hành động | Admin | Bác sĩ | Nhân viên | Khách hàng |
|-----------|-------|--------|-----------|------------|
| Xem danh sách lịch hẹn | ✅ | ✅ (của mình) | ✅ (của mình) | ✅ (của mình) |
| Cập nhật trạng thái | ✅ | ✅ | ✅ | ❌ |
| Kê đơn thuốc | ❌ | ✅ | ❌ | ❌ |
| Tạo phác đồ điều trị | ❌ | ✅ | ❌ | ❌ |
| Xem đơn thuốc / phác đồ | ✅ | ✅ | ✅ | ❌ (roadmap) |
| Tạo tài khoản nhân sự | ✅ | ❌ | ❌ | ❌ |
| Tra cứu toàn bộ khách hàng | ✅ | ❌ | ❌ | ❌ |

---

## 10. Giai đoạn triển khai (cập nhật)

| Giai đoạn | Nội dung | Trạng thái |
|-----------|----------|------------|
| **Giai đoạn 1** (Tuần 1–3) | Khởi tạo Next.js, TailwindCSS, layout, homepage | ✅ Hoàn thành |
| **Giai đoạn 2** (Tuần 4–5) | Trello webhook, form đặt lịch, dịch vụ da liễu | ✅ Hoàn thành |
| **Giai đoạn 3** (Tuần 6–7) | Liệu trình, bảng giá, khuyến mãi, Markdown | ✅ Hoàn thành |
| **Giai đoạn 4** (Tuần 8) | Nhận diện thương hiệu, màu logo, Pencil design | ✅ Hoàn thành |
| **Giai đoạn 5** (Tuần 9–10) | Auth 4 role, Admin/Staff/Doctor/Portal dashboard | ✅ Hoàn thành |
| **Giai đoạn 6** (Tuần 11) | Module Thuốc + Module Điều Trị (bảng DB riêng) | ✅ Hoàn thành |
| **Giai đoạn 7** (Tuần 11) | Seed data test + E2E Testing Playwright (~86 tests) | ✅ Hoàn thành |
| **Giai đoạn 8** (Tuần 12+) | SEO, bảo mật API, domain/SSL, go-live, đào tạo | ⏳ Chưa bắt đầu |
