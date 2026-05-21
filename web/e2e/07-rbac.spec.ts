import { test, expect } from '@playwright/test';
import { loginAdmin, loginStaff, PROTECTED_ROUTES } from './helpers';

/**
 * ════════════════════════════════════════════════════════════════════════
 *  BỘ TEST PHÂN QUYỀN THEO ROLE (RBAC)
 *  Cần tài khoản hợp lệ — set qua biến môi trường E2E_*_EMAIL / E2E_*_PASS.
 *  Bỏ qua nếu không có credentials (để CI không fail).
 * ════════════════════════════════════════════════════════════════════════
 */

const hasAdminCreds = !!process.env.E2E_ADMIN_EMAIL || true; // mặc định dùng tài khoản trong helpers

test.describe('🔐 RBAC — Admin', () => {
  test.skip(!hasAdminCreds, 'Chưa cấu hình tài khoản admin');

  test('Admin đăng nhập thành công + truy cập đủ menu', async ({ page }) => {
    await loginAdmin(page);
    expect(page.url()).toMatch(/\/admin/);

    // Kiểm tra các trang admin tải được
    for (const route of PROTECTED_ROUTES.admin) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(route.replace(/\/$/, ''));
      // Không bị đá về login
      expect(page.url()).not.toMatch(/\/login/);
    }
  });

  test('Admin KHÔNG được vào /portal (dành cho customer) → redirect dashboard', async ({ page }) => {
    await loginAdmin(page);
    await page.goto('/portal/');
    await page.waitForLoadState('networkidle');
    // Staff vào portal phải bị đá về dashboard của họ
    expect(page.url()).toMatch(/\/admin/);
  });

  test('Admin có thể thêm ghi chú điều trị (full quyền)', async ({ page }) => {
    await loginAdmin(page);
    await page.goto('/admin/lich-hen/');
    await page.waitForLoadState('networkidle');
    // Click chi tiết lịch hẹn đầu tiên (nếu có)
    const detailLink = page.getByRole('link', { name: /chi tiết/i }).first();
    if (await detailLink.count() > 0) {
      await detailLink.click();
      await page.waitForLoadState('networkidle');
      // Form thêm ghi chú phải tồn tại
      await expect(page.getByPlaceholder(/ghi chú điều trị/i)).toBeVisible();
    }
  });
});

test.describe('🔐 RBAC — Bác sĩ', () => {
  test('Bác sĩ đăng nhập → vào /bac-si, KHÔNG vào được /admin', async ({ page }) => {
    await loginStaff(page, 'bacSi');
    expect(page.url()).toMatch(/\/bac-si/);

    // Thử truy cập admin → bị chặn
    await page.goto('/admin/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/(unauthorized|login|bac-si)/);
    expect(page.url()).not.toMatch(/\/admin$/);
  });

  test('Bác sĩ KHÔNG vào được /nhan-vien của role khác', async ({ page }) => {
    await loginStaff(page, 'bacSi');
    await page.goto('/nhan-vien/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/(unauthorized|login|bac-si)/);
  });
});

test.describe('🔐 RBAC — Nhân viên', () => {
  test('Nhân viên đăng nhập → vào /nhan-vien, KHÔNG vào được /admin', async ({ page }) => {
    await loginStaff(page, 'nhanVien');
    expect(page.url()).toMatch(/\/nhan-vien/);

    await page.goto('/admin/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/(unauthorized|login|nhan-vien)/);
    expect(page.url()).not.toMatch(/\/admin$/);
  });

  test('Nhân viên KHÔNG kê được đơn thuốc (chỉ bác sĩ)', async ({ page, request }) => {
    await loginStaff(page, 'nhanVien');
    // Lấy session cookie của nhân viên
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === '__session');
    expect(sessionCookie).toBeDefined();

    // Gọi API kê đơn với session nhân viên → phải bị 403 (chỉ bac_si)
    const res = await request.post('/api/prescriptions', {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `__session=${sessionCookie!.value}`,
      },
      data: JSON.stringify({ appointment_id: 'test', diagnosis: 'x', items: [] }),
    });
    expect(res.status()).toBe(403);
  });
});

test.describe('🔐 RBAC — Privilege Escalation', () => {
  test('Nhân viên KHÔNG gọi được API admin (tạo staff)', async ({ page, request }) => {
    await loginStaff(page, 'nhanVien');
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === '__session');

    const res = await request.post('/api/admin/staff', {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `__session=${sessionCookie!.value}`,
      },
      data: JSON.stringify({
        full_name: 'Escalated', email: 'evil@test.com', password: 'x123456', role: 'admin',
      }),
    });
    expect(res.status()).toBe(403);
  });

  test('Bác sĩ KHÔNG xóa được nhân sự (chỉ admin)', async ({ page, request }) => {
    await loginStaff(page, 'bacSi');
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === '__session');

    const res = await request.fetch('/api/admin/staff/any-id', {
      method: 'DELETE',
      headers: { 'Cookie': `__session=${sessionCookie!.value}` },
    });
    expect(res.status()).toBe(403);
  });
});
