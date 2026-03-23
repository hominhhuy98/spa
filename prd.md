# Tài liệu Yêu cầu Sản phẩm (PRD)
**Dự án:** Nền tảng Website/Cổng thông tin Phòng khám Chuyên khoa Da liễu
**Đơn vị chủ quản:** CTCP Bệnh viện Y dược Sài Gòn
**Phiên bản:** 1.0 | **Ngày cập nhật:** 23/03/2026
**Trạng thái:** Đang xem xét (In Review)

---

## 1. Tổng quan dự án (Project Overview)
### 1.1 Mục tiêu (Objectives)
Xây dựng một nền tảng web chuyên nghiệp giúp bệnh nhân tìm kiếm thông tin điều trị da liễu, spa thẩm mỹ. Đồng thời tối ưu hóa quy trình quản lý nội dung của đội ngũ marketing thông qua việc đồng bộ dữ liệu tự động từ hệ thống quản lý công việc (Trello).

### 1.2 Chỉ số đo lường thành công (KPIs & Success Metrics)
*   **Hiệu suất:** Tốc độ tải trang (Page Load Time) dưới 3 giây trên cả thiết bị di động và máy tính.
*   **Vận hành:** Giảm 80% thời gian đăng bài thủ công của đội ngũ nội dung nhờ tự động hóa Trello API.
*   **Tương tác:** Tăng tỷ lệ chuyển đổi (Conversion Rate) đặt lịch khám lên 15% trong quý đầu ra mắt.

### 1.3 Phạm vi dự án (Project Scope)
*   **Trong phạm vi (In-scope):** Website Frontend, CMS Backend (Tích hợp Trello API), Form đặt lịch (gửi email/CRM), Thư viện Media.
*   **Ngoài phạm vi (Out-of-scope):** Thanh toán trực tuyến (Online Payment), Chatbot AI, Cổng thông tin cho bệnh nhân (Patient Portal - đăng nhập xem hồ sơ bệnh án).

## 2. Chân dung người dùng (User Personas)
### 2.1 Bệnh nhân/Khách hàng (End-Users)
*   **Đặc điểm:** Người có nhu cầu điều trị bệnh lý về da hoặc chăm sóc da thẩm mỹ (spa).
*   **Nhu cầu:** Cần thông tin dịch vụ minh bạch, hình ảnh thực tế (Before & After) và chức năng đặt lịch khám tiện lợi.
*   **Nỗi đau (Pain points):** Thường bối rối trước các thông tin y khoa không chính thống trên mạng, quy trình đặt lịch rườm rà.

### 2.2 Quản trị viên (Admin) / Content Creator
*   **Đặc điểm:** Đội ngũ Marketing/Vận hành nội dung của bệnh viện.
*   **Nhu cầu:** Một hệ thống CMS trực quan, tự động hóa các thao tác thủ công để tiết kiệm thời gian.
*   **Nỗi đau (Pain points):** Phải copy-paste nội dung thủ công từ Trello lên website, dễ sai sót và mất thời gian.

## 3. Yêu cầu tính năng chi tiết (Functional Requirements)

### Epic 1: Trang Thông tin Y khoa & Dịch vụ Da liễu
*   **Mô tả:** Nơi hiển thị các dịch vụ khám chữa bệnh, spa và các bài viết kiến thức.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   Cấu trúc phân mục rõ ràng giữa "Bệnh lý Da liễu" và "Chăm sóc Thẩm mỹ (Spa)".
    *   Hệ thống CMS phải bắt buộc nhập trường thông tin "Nguồn trích dẫn y khoa" (ví dụ: Bộ Y tế, WHO) đối với các bài kiến thức để củng cố uy tín.

### Epic 2: Đồng bộ nội dung tự động từ Trello (Trello API Integration)
*   **Mô tả:** Hệ thống tự động lấy dữ liệu từ bảng Trello nội bộ để chuyển hóa thành bài viết trên website.
    *   **Link Trello Board:** [https://trello.com/b/r9bm8SjI/ydsg](https://trello.com/b/r9bm8SjI/ydsg)
*   **Luồng hoạt động (User Flow):**
    1. Hệ thống kết nối trực tiếp với Trello thông qua Webhook.
    2. Khi có thẻ (card) mới được di chuyển vào cột "SPA", hệ thống sẽ trigger.
    3. Bộ lọc kiểm tra: Chỉ thu thập các thẻ có chứa file đính kèm là hình ảnh (những bài viết đã có hình mới được đăng).
    4. Mapping dữ liệu: Tiêu đề card -> Tiêu đề bài viết; Mô tả (Description) -> Nội dung HTML; Hình ảnh đính kèm -> Ảnh minh họa/ảnh bìa.
    5. Dữ liệu được đẩy về CMS dưới dạng "Bản nháp" (Draft) chờ Admin duyệt hoặc tự động xuất bản (Publish) tùy cấu hình.
*   **Tiêu chí nghiệm thu:** Đồng bộ thành công 99% các thẻ hợp lệ trong vòng 1 phút kể từ khi có sự kiện trên Trello.

### Epic 3: Thư viện Hình ảnh (Media Gallery)
*   **Mô tả:** Nơi lưu trữ và hiển thị các hình ảnh chuyên nghiệp, hình chụp studio quảng cáo hoặc hình ảnh trước/sau (Before & After).
*   **Tiêu chí nghiệm thu:**
    *   Hỗ trợ xem ảnh dưới dạng Grid/Masonry và Lightbox.
    *   Hình ảnh tự động nén/tối ưu định dạng (ví dụ: WebP) khi tải lên CMS để đảm bảo tốc độ tải trang nhanh nhưng không làm mất chi tiết da.

### Epic 4: Đặt lịch khám trực tuyến
*   **Mô tả:** Biểu mẫu cho phép bệnh nhân để lại thông tin đặt lịch tư vấn hoặc khám bệnh.
*   **Tiêu chí nghiệm thu:**
    *   Form thu thập: Họ tên, Số điện thoại, Dịch vụ quan tâm, Thời gian dự kiến, Ghi chú.
    *   Gửi thông báo trực tiếp về email hoặc hệ thống CRM nội bộ của bệnh viện ngay khi có lượt đăng ký mới (độ trễ < 10s).

## 4. Yêu cầu phi chức năng (Non-Functional Requirements)
*   **Giao diện (UI/UX):** Thiết kế tối giản, sạch sẽ, mang tông màu nhận diện thương hiệu của CTCP Bệnh viện Y dược Sài Gòn. Hình ảnh hiển thị chân thực và mang tính chuyên môn y khoa cao. Responsive 100% trên thiết bị di động.
*   **Hiệu suất (Performance):** Nền tảng cần load dưới 3 giây, đạt điểm Google PageSpeed Insights >= 85 cho cả Mobile và Desktop.
*   **Bảo mật (Security):** Tuân thủ các nguyên tắc bảo mật thông tin cá nhân (GDPR/PDPA cơ bản). Dữ liệu form đặt lịch phải được mã hóa truyền tải qua SSL/TLS (HTTPS). Chống tấn công Spam Form (Google reCAPTCHA v3).
*   **SEO (Search Engine Optimization):** Cấu trúc URL thân thiện, tự động tạo Sitemap, hỗ trợ Meta tags tùy chỉnh, Schema Markup cho bài viết y khoa và dịch vụ y tế.

## 5. Kiến trúc Công nghệ dự kiến (Tech Stack Suggestion)
*   **Frontend:** Next.js (React) hoặc Nuxt.js (Vue) để hỗ trợ SSR/SSG tốt cho SEO. Styling với Tailwind CSS.
*   **Backend & CMS:** Strapi (Headless CMS) hoặc WordPress (REST API) / Laravel tùy thuộc vào ngân sách và độ phức tạp mở rộng.
*   **Database:** PostgreSQL hoặc MySQL.
*   **Infrastructure:** AWS, Vercel (Frontend), Docker.
*   **Tích hợp:** Trello REST API & Webhooks.

## 6. Giai đoạn triển khai (Phát triển)
*   **Giai đoạn 1 (Tuần 1-3):** Xây dựng khung giao diện website, thiết lập database, CMS cơ bản và hệ thống đăng bài thủ công.
*   **Giai đoạn 2 (Tuần 4-5):** Lập trình backend kết nối API với Trello, viết mã logic để quét cột "Spa", lọc hình ảnh và đẩy dữ liệu về CMS (Webhook/Cronjob).
*   **Giai đoạn 3 (Tuần 6-7):** Tích hợp Form đặt lịch, thiết lập Media Gallery, tối ưu hóa hình ảnh.
*   **Giai đoạn 4 (Tuần 8):** UAT (Kiểm thử người dùng cuối), Tối ưu hóa SEO, Tối ưu Performance, Kiểm tra bảo mật và Triển khai (Go-live).