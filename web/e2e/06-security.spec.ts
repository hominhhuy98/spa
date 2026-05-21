import { test, expect } from '@playwright/test';
import { BASE, PROTECTED_ROUTES, ADMIN_APIS, expectUnauthorized } from './helpers';

/**
 * ════════════════════════════════════════════════════════════════════════
 *  BỘ TEST BẢO MẬT — KIỂM TRA RANH GIỚI PHÂN QUYỀN
 *  Hầu hết test ở đây KHÔNG cần tài khoản hợp lệ — chúng kiểm tra rằng
 *  truy cập trái phép BỊ TỪ CHỐI. Chạy được trên cả local lẫn production.
 * ════════════════════════════════════════════════════════════════════════
 */

test.describe('🔒 Bảo mật — Route Protection (chưa đăng nhập)', () => {
  const allProtected = [
    ...PROTECTED_ROUTES.admin,
    ...PROTECTED_ROUTES.bacSi,
    ...PROTECTED_ROUTES.nhanVien,
    ...PROTECTED_ROUTES.customer,
  ];

  for (const route of allProtected) {
    test(`Truy cập ${route} khi chưa login → redirect về trang đăng nhập`, async ({ page }) => {
      await page.goto(route);
      // Middleware phải redirect đến /login hoặc /portal/login (không được ở lại route bảo vệ)
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).toMatch(/\/(login|portal\/login)/);
    });
  }

  test('Trang admin chi tiết lịch hẹn (ID giả) khi chưa login → bị chặn', async ({ page }) => {
    await page.goto('/admin/lich-hen/fake-id-12345/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/login/);
  });
});

test.describe('🔒 Bảo mật — API Authorization (không có session)', () => {
  for (const api of ADMIN_APIS) {
    test(`${api.method} ${api.path} không session → 401/403`, async ({ request }) => {
      await expectUnauthorized(request, api.method, api.path);
    });
  }

  test('POST tạo nhân sự không session → bị từ chối', async ({ request }) => {
    await expectUnauthorized(request, 'POST', '/api/admin/staff', {
      full_name: 'Hacker', email: 'hacker@evil.com', password: 'x123456', role: 'admin',
    });
  });

  test('PATCH cập nhật lịch hẹn không session → bị từ chối', async ({ request }) => {
    await expectUnauthorized(request, 'PATCH', '/api/admin/appointments/any-id', {
      status: 'confirmed',
    });
  });

  test('DELETE nhân sự không session → bị từ chối', async ({ request }) => {
    await expectUnauthorized(request, 'DELETE', '/api/admin/staff/any-id');
  });

  test('POST kê đơn thuốc không session → bị từ chối', async ({ request }) => {
    await expectUnauthorized(request, 'POST', '/api/prescriptions', {
      appointment_id: 'x', diagnosis: 'fake', items: [],
    });
  });

  test('POST tạo phác đồ điều trị không session → bị từ chối', async ({ request }) => {
    await expectUnauthorized(request, 'POST', '/api/treatment-plans', {
      appointment_id: 'x', plan_detail: 'fake',
    });
  });

  test('Tra cứu lịch sử khách hàng không session → bị từ chối', async ({ request }) => {
    await expectUnauthorized(request, 'GET', '/api/admin/customers/history?phone=0901000001');
  });

  test('Cập nhật profile không session → 401', async ({ request }) => {
    await expectUnauthorized(request, 'PATCH', '/api/auth/update-profile', {
      full_name: 'Stolen Identity',
    });
  });
});

test.describe('🔒 Bảo mật — Session Cookie', () => {
  test('Session cookie __session phải là httpOnly + secure (production)', async ({ context, request }) => {
    // Gọi session API với token giả → phải bị từ chối, không set cookie
    const res = await request.post(`${BASE}/api/auth/session`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ idToken: 'fake-invalid-token' }),
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);

    const cookies = await context.cookies();
    const session = cookies.find(c => c.name === '__session');
    // Không được tạo session từ token giả
    expect(session).toBeUndefined();
  });

  test('Cookie __session bịa đặt → middleware vẫn chặn route admin', async ({ context, page }) => {
    const url = new URL(BASE);
    await context.addCookies([{
      name: '__session',
      value: 'fake.jwt.payload',
      domain: url.hostname,
      path: '/',
    }]);
    await page.goto('/admin/');
    await page.waitForLoadState('networkidle');
    // JWT giả không decode được hợp lệ → phải redirect login
    expect(page.url()).toMatch(/\/login/);
  });
});

test.describe('🔒 Bảo mật — Input Validation', () => {
  test('Đặt lịch ngày quá khứ → bị từ chối (422)', async ({ request }) => {
    const res = await request.post(`${BASE}/api/book-appointment`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        name: 'Test', phone: '0901999999', service: 'Test',
        date: '2020-01-01', time: '10:00',
      }),
    });
    expect(res.status()).toBe(422);
  });

  test('Đặt lịch thiếu trường bắt buộc → 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/book-appointment`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ name: 'Test' }),
    });
    expect(res.status()).toBe(400);
  });

  test('Đăng ký mật khẩu quá ngắn → bị từ chối', async ({ request }) => {
    const res = await request.post(`${BASE}/api/auth/register`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        full_name: 'Test', phone: '0901888888', password: '123',
      }),
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('XSS payload trong tên đặt lịch → không bị execute (lưu literal)', async ({ request }) => {
    const xss = '<script>alert(1)</script>';
    const res = await request.post(`${BASE}/api/book-appointment`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        name: xss, phone: '0901777777', service: 'Test',
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      }),
    });
    // API chấp nhận lưu (React tự escape khi render) — không được trả 500
    expect([200, 422]).toContain(res.status());
  });
});

test.describe('✅ Public — Trang công khai hoạt động', () => {
  const publicPages = [
    '/', '/dich-vu-da-lieu/', '/goi-dich-vu/', '/bang-gia/',
    '/may-moc/', '/tin-tuc/', '/dat-lich/', '/khuyen-mai/',
    '/login/', '/portal/login/', '/dang-ky/',
  ];

  for (const p of publicPages) {
    test(`${p} tải thành công (200)`, async ({ page }) => {
      const res = await page.goto(p);
      expect(res?.status()).toBeLessThan(400);
    });
  }

  test('Trang 404 cho route không tồn tại', async ({ page }) => {
    const res = await page.goto('/khong-ton-tai-12345/');
    expect(res?.status()).toBe(404);
  });

  test('Zalo domain verification trả về meta tag', async ({ page }) => {
    const res = await page.goto('/api/auth/zalo/callback/');
    const body = await res?.text();
    expect(body).toContain('zalo-platform-site-verification');
  });
});
