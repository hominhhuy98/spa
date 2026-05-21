# E2E Testing — CTCP BV Y Dược Sài Gòn

Bộ test end-to-end dùng Playwright, tập trung vào **bảo mật** và **chức năng production**.

## Cấu trúc

| File | Nội dung |
|------|----------|
| `01-public.spec.ts` | Trang công khai (homepage, dịch vụ, bảng giá, tin tức) |
| `02-admin.spec.ts` | Dashboard admin (legacy) |
| `03-nhan-vien.spec.ts` | Dashboard nhân viên (legacy) |
| `04-bac-si.spec.ts` | Dashboard bác sĩ (legacy) |
| `05-portal-customer.spec.ts` | Customer portal (legacy) |
| **`06-security.spec.ts`** | **🔒 Bảo mật: RBAC, API auth, session, input validation** |
| **`07-rbac.spec.ts`** | **🔐 Phân quyền theo role + chống privilege escalation** |

## Chạy test

### Test bảo mật trên LOCAL (không cần tài khoản)
```bash
npm run dev          # terminal 1
npm run test:security  # terminal 2
```
Bộ `06-security.spec.ts` kiểm tra rằng truy cập trái phép **bị từ chối** — không cần credentials.

### Test bảo mật trên PRODUCTION
```powershell
# PowerShell
$env:E2E_BASE_URL="https://dalieuyduocsaigon.com"; npx playwright test 06-security.spec.ts
```
```bash
# Bash
E2E_BASE_URL=https://dalieuyduocsaigon.com npx playwright test 06-security.spec.ts
```
> Khi set `E2E_BASE_URL`, config sẽ KHÔNG khởi động dev server local.

### Test RBAC (cần tài khoản hợp lệ)
Set credentials qua env trước khi chạy:
```powershell
$env:E2E_ADMIN_EMAIL="huyho.it98@gmail.com"
$env:E2E_ADMIN_PASS="Admin@123"
$env:E2E_BACSI_EMAIL="..."
$env:E2E_BACSI_PASS="..."
$env:E2E_NHANVIEN_EMAIL="..."
$env:E2E_NHANVIEN_PASS="..."
npx playwright test 07-rbac.spec.ts
```

## Phạm vi kiểm tra bảo mật

### `06-security.spec.ts` (39 test — không cần login)
- **Route Protection**: tất cả `/admin`, `/bac-si`, `/nhan-vien`, `/portal` redirect login khi chưa đăng nhập
- **API Authorization**: mọi API admin/clinical trả `401/403` khi không có session
- **Session Cookie**:
  - Token Firebase giả → không tạo được session
  - JWT bịa đặt → middleware vẫn chặn
- **Input Validation**:
  - Đặt lịch ngày quá khứ → `422`
  - Thiếu trường bắt buộc → `400`
  - Mật khẩu < 6 ký tự → từ chối
  - XSS payload → không crash server (React tự escape)
- **Public**: 11 trang công khai tải `200`, route lạ trả `404`

### `07-rbac.spec.ts` (cần login)
- Admin truy cập đủ menu, nhưng KHÔNG vào được `/portal`
- Bác sĩ KHÔNG vào `/admin` hay `/nhan-vien`
- Nhân viên KHÔNG vào `/admin`, KHÔNG kê được đơn thuốc (chỉ bác sĩ)
- **Privilege escalation**: nhân viên/bác sĩ gọi API admin → `403`

## Lưu ý bảo mật quan trọng
1. **Service account key** (`FIREBASE_SERVICE_ACCOUNT_KEY`) chỉ lưu trên Cloud Run env/Secret Manager — KHÔNG commit.
2. **Middleware** chỉ decode JWT (Edge Runtime), verify đầy đủ ở server components/API routes.
3. **Custom claims** (`role`) là nguồn phân quyền duy nhất — không tin client.
4. Tất cả API admin/clinical đều check `getServerUser()` + role trước khi xử lý.
