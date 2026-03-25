# Tài liệu Yêu cầu Sản phẩm (PRD)
**Dự án:** Website Chuyên Khoa Da Liễu — CTCP Bệnh Viện Y Dược Sài Gòn
**Đơn vị chủ quản:** CTCP Bệnh Viện Y Dược Sài Gòn
**Phiên bản:** 2.0 | **Ngày cập nhật:** 25/03/2026
**Trạng thái:** Đang triển khai — Sprint 4 (In Progress)

---

## 1. Tổng quan dự án (Project Overview)

### 1.1 Mục tiêu (Objectives)
Xây dựng nền tảng web chuyên nghiệp cho Phòng Khám Chuyên Khoa Da Liễu trực thuộc CTCP Bệnh Viện Y Dược Sài Gòn, giúp bệnh nhân tìm hiểu dịch vụ, đặt lịch khám và nâng cao nhận diện thương hiệu y khoa. Tự động hóa quy trình quản lý nội dung qua Trello API.

### 1.2 Chỉ số đo lường thành công (KPIs)
- **Hiệu suất:** Tốc độ tải trang < 3 giây trên mobile và desktop.
- **Vận hành:** Giảm 80% thời gian đăng bài thủ công nhờ đồng bộ Trello API.
- **Tương tác:** Tăng tỷ lệ chuyển đổi đặt lịch khám 15% trong quý đầu ra mắt.

### 1.3 Phạm vi dự án
- **Trong phạm vi:** Website Frontend (Next.js static export), Form đặt lịch, Tích hợp Trello Webhook, Bảng giá dịch vụ, Kiến thức y khoa, Khuyến mãi.
- **Ngoài phạm vi:** Thanh toán trực tuyến, Chatbot AI, Cổng thông tin bệnh nhân (Patient Portal).

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

### 2.3 Typography
- **Heading/Body:** Be Vietnam Pro (Vietnamese subset, 400–900)
- **Accent/Serif:** Playfair Display (latin, italic/normal, 400–700)

---

## 3. Cấu trúc trang (Site Map)

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

---

## 4. Yêu cầu tính năng (Functional Requirements)

### Epic 1: Trang Chủ & Dịch Vụ Da Liễu
- Hero banner với CTA đặt lịch và xem bảng giá.
- Section "Phác Đồ Điều Trị" 6 bệnh lý: Mụn, Nám, Viêm Da, Vảy Nến, Rụng Tóc, Sẹo — có ICD code và link chi tiết.
- Banner khuyến mãi khách hàng mới (GIẢM 30K/50K/100K).
- Nguồn trích dẫn: **Hội Da Liễu Việt Nam, Bộ Y Tế Việt Nam** (không dùng tổ chức quốc tế).

### Epic 2: Liệu Trình (Gói Dịch Vụ)
- 7 danh mục: Chăm Sóc Da, Mụn Face, Mụn Body, Da Nhạy Cảm, Chăm Sóc Toàn Diện, Peel Da Face, Peel Da Body.
- 17 gói chi tiết với danh sách bước thực hiện, mức độ, ghi chú.
- Nút "Đặt Lịch Gói Này" truyền tên gói qua URL param `?dich-vu=` sang trang đặt lịch.

### Epic 3: Bảng Giá
- **Bảng giá lẻ:** Lấy mụn, Oxy Jet, Chiếu ánh sáng, Đắp mặt nạ, Điện di, DDM, Peel da, IPL, Lăn kim nông.
- **Combo lấy nhân mụn:** 4 gói (660K–1.380K) với badge giảm giá.
- **Ngừa mụn định kỳ:** 3 gói card (660K / 1.200K / 1.750K).
- **Trẻ hóa & giảm thâm:** 4 gói (620K–1.650K).
- **Trị mụn body:** Bảng combo 1–4 vùng da.

### Epic 4: Đặt Lịch Khám
- Form: Họ tên, SĐT, Dịch vụ quan tâm (dropdown có optgroup), Ngày dự kiến, Ghi chú.
- Dropdown pre-select từ URL param `?dich-vu=TenGoi` khi đến từ trang Liệu Trình.
- Sidebar: Thông tin liên hệ, Lưu ý khi đến khám (CCCD, sản phẩm, trẻ em), Chính sách hủy hẹn, Hotline.
- Bản đồ Google Maps embed (không API key).
- API endpoint `/api/book-appointment` gửi thông báo qua email/CRM.

### Epic 5: Đồng bộ Trello API
- Webhook receiver tại `/api/trello-webhook`.
- Lọc card từ cột "SPA" có đính kèm hình ảnh.
- Mapping: Tiêu đề → title, Description → Markdown content, Attachment → ảnh bìa.
- Board: [https://trello.com/b/r9bm8SjI/ydsg](https://trello.com/b/r9bm8SjI/ydsg)

### Epic 6: Kiến Thức Da Liễu
- 9 bài viết tĩnh với tag phân loại màu sắc.
- Trang chi tiết render Markdown, hiển thị nguồn trích dẫn y khoa Việt Nam.
- Tất cả nguồn: Hội Da Liễu Việt Nam, Bộ Y Tế, Cục Quản Lý Dược, BV Y Dược Sài Gòn.

---

## 5. Yêu cầu phi chức năng (Non-Functional)
- **UI/UX:** Thiết kế y khoa chuyên nghiệp, màu từ logo (xanh y tế + vàng đồng). Responsive 100%.
- **Performance:** Load < 3 giây, PageSpeed >= 85 (mobile & desktop).
- **SEO:** URL thân thiện, meta tags tùy chỉnh, cấu trúc heading rõ ràng.
- **Bảo mật:** HTTPS, không lưu dữ liệu nhạy cảm phía client, form validation.
- **Nội dung:** Không đề cập tổ chức quốc tế (AAD, EADV, WHO, FDA) trừ trang Thiết Bị.

---

## 6. Kiến trúc Công nghệ (Tech Stack thực tế)

| Thành phần | Công nghệ |
|-----------|-----------|
| Framework | Next.js 16 App Router, `output: 'export'` (static) |
| Styling | TailwindCSS v4, custom `@theme` variables |
| Font | Be Vietnam Pro + Playfair Display (Google Fonts) |
| Data | Static TSX files (không CMS riêng) |
| API | Next.js Route Handlers (booking, Trello webhook) |
| Maps | Google Maps iframe embed |
| Design tool | Pencil MCP extension (`.pen` files) |
| Hosting | Static export — compatible với Nginx/Vercel/GitHub Pages |

---

## 7. Giai đoạn triển khai

| Giai đoạn | Nội dung | Trạng thái |
|-----------|----------|------------|
| **Giai đoạn 1** (Tuần 1–3) | Khởi tạo Next.js, cấu hình TailwindCSS, layout, homepage, navigation | ✅ Hoàn thành |
| **Giai đoạn 2** (Tuần 4–5) | Tích hợp Trello webhook, form đặt lịch, trang dịch vụ da liễu, kiến thức | ✅ Hoàn thành |
| **Giai đoạn 3** (Tuần 6–7) | Trang liệu trình, bảng giá, khuyến mãi, bản đồ, Markdown renderer | ✅ Hoàn thành |
| **Giai đoạn 4** (Tuần 8) | Nhận diện thương hiệu (màu logo), thiết kế Pencil, pre-select booking, SEO, Go-live | 🚧 Đang làm |
