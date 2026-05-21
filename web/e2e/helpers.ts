import { Page, APIRequestContext, expect } from '@playwright/test';

// Target URL: dùng E2E_BASE_URL để chạy trên production, mặc định local
export const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

// ─── Tài khoản test ───────────────────────────────────────────────────────────
// Lưu ý: cập nhật theo tài khoản thực tế trên Firebase Auth trước khi chạy.
export const ACCOUNTS = {
  admin:    { email: process.env.E2E_ADMIN_EMAIL    || 'huyho.it98@gmail.com', password: process.env.E2E_ADMIN_PASS    || 'Admin@123' },
  bacSi:    { email: process.env.E2E_BACSI_EMAIL    || 'bacsi.test@ydsg.vn',   password: process.env.E2E_BACSI_PASS    || 'BacSi@2026' },
  nhanVien: { email: process.env.E2E_NHANVIEN_EMAIL || 'nhanvien.test@ydsg.vn', password: process.env.E2E_NHANVIEN_PASS || 'NhanVien@2026' },
};

// ─── Các route được bảo vệ theo role ────────────────────────────────────────────
export const PROTECTED_ROUTES = {
  admin:     ['/admin', '/admin/lich-hen', '/admin/nhan-su', '/admin/lieu-trinh', '/admin/khach-hang'],
  bacSi:     ['/bac-si'],
  nhanVien:  ['/nhan-vien'],
  customer:  ['/portal'],
};

// ─── Các API endpoint nhạy cảm (cần auth) ────────────────────────────────────────
export const ADMIN_APIS = [
  { method: 'GET',  path: '/api/admin/staff' },
  { method: 'GET',  path: '/api/admin/treatment-services' },
  { method: 'GET',  path: '/api/admin/customers/unlinked-zalo' },
  { method: 'GET',  path: '/api/admin/customers/history?phone=0901000001' },
];

// ─── Login helpers (Firebase email/password) ─────────────────────────────────────

/** Đăng nhập Admin qua /admin/login (chỉ email/password) */
export async function loginAdmin(page: Page) {
  await page.goto('/admin/login/');
  await page.getByLabel(/email/i).fill(ACCOUNTS.admin.email);
  await page.getByLabel(/mật khẩu/i).fill(ACCOUNTS.admin.password);
  await page.getByRole('button', { name: /đăng nhập/i }).click();
  await page.waitForURL(/\/admin/, { timeout: 15000 });
}

/** Đăng nhập staff (bác sĩ / nhân viên) qua /login */
export async function loginStaff(page: Page, role: 'bacSi' | 'nhanVien') {
  const acc = ACCOUNTS[role];
  await page.goto('/login/');
  await page.getByLabel(/email/i).fill(acc.email);
  await page.getByLabel(/mật khẩu/i).fill(acc.password);
  await page.getByRole('button', { name: /^đăng nhập$/i }).click();
  await page.waitForURL(/\/(bac-si|nhan-vien)/, { timeout: 15000 });
}

/** Đăng xuất chung */
export async function logout(page: Page) {
  await page.getByRole('button', { name: /đăng xuất/i }).first().click();
}

/** Ngày tương lai (YYYY-MM-DD) */
export function futureDate(daysFromNow = 5) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

/** Ngày quá khứ (YYYY-MM-DD) */
export function pastDate(daysAgo = 5) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/** Gọi API không có session cookie → kỳ vọng bị từ chối */
export async function expectUnauthorized(request: APIRequestContext, method: string, path: string, body?: object) {
  const res = await request.fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    data: body ? JSON.stringify(body) : undefined,
  });
  // Cho phép 401 hoặc 403 (Unauthorized / Forbidden)
  expect([401, 403]).toContain(res.status());
  return res;
}
