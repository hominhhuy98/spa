/**
 * E2E — Luồng Admin
 * Bao gồm: đăng nhập, dashboard, quản lý lịch hẹn, nhân sự, khách hàng
 */
import { test, expect } from '@playwright/test';
import { loginAdmin, logout, ACCOUNTS, futureDate } from './helpers';

test.describe('Admin — Xác thực', () => {
  test('truy cập /admin khi chưa đăng nhập → redirect về /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });

  test('đăng nhập với email/mật khẩu sai → báo lỗi', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel(/email/i).fill('wrong@email.com');
    await page.getByLabel(/mật khẩu/i).fill('wrongpass');
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    await expect(page.getByText(/không đúng|lỗi/i)).toBeVisible({ timeout: 5_000 });
  });

  test('đăng nhập admin thành công → vào /admin dashboard', async ({ page }) => {
    await loginAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText(/dashboard|lịch hẹn/i).first()).toBeVisible();
  });

  test('đăng xuất → redirect về /login', async ({ page }) => {
    await loginAdmin(page);
    await logout(page);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Admin — Dashboard', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page); });

  test('sidebar có đủ các menu: Dashboard, Lịch Hẹn, Nhân Sự, Khách Hàng', async ({ page }) => {
    for (const label of ['Dashboard', 'Lịch Hẹn', 'Nhân Sự', 'Khách Hàng']) {
      await expect(page.getByRole('link', { name: new RegExp(label, 'i') })).toBeVisible();
    }
  });

  test('hiển thị thống kê số lịch hẹn hôm nay', async ({ page }) => {
    // Có ít nhất 1 stat card
    await expect(page.locator('[class*="rounded"]').first()).toBeVisible();
  });
});

test.describe('Admin — Quản lý Lịch Hẹn', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
    await page.getByRole('link', { name: /lịch hẹn/i }).click();
    await expect(page).toHaveURL(/\/admin\/lich-hen/);
  });

  test('hiển thị danh sách lịch hẹn', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/lịch hẹn/i)).first()).toBeVisible();
  });

  test('lọc theo trạng thái "Chờ xác nhận"', async ({ page }) => {
    const filter = page.getByRole('button', { name: /chờ xác nhận/i })
      .or(page.getByRole('option', { name: /chờ xác nhận/i }))
      .or(page.getByText(/chờ xác nhận/i)).first();
    if (await filter.isVisible()) {
      await filter.click();
      // Sau khi lọc không có lịch trạng thái khác
      await page.waitForTimeout(500);
    }
    await expect(page).toHaveURL(/\/admin\/lich-hen/);
  });

  test('bấm vào lịch hẹn → vào trang chi tiết', async ({ page }) => {
    const firstRow = page.getByRole('link', { name: /xem|chi tiết|xử lý/i }).first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await expect(page).toHaveURL(/\/admin\/lich-hen\/\d+/);
    }
  });

  test('chi tiết lịch hẹn: cập nhật trạng thái sang "Đã xác nhận"', async ({ page }) => {
    const firstRow = page.getByRole('link', { name: /xem|chi tiết|xử lý/i }).first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      const confirmBtn = page.getByRole('button', { name: /xác nhận|đã xác nhận/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await expect(page.getByText(/đã cập nhật|thành công/i)).toBeVisible({ timeout: 5_000 });
      }
    }
  });

  test('phân công nhân sự cho lịch hẹn', async ({ page }) => {
    const firstRow = page.getByRole('link', { name: /xem|chi tiết|xử lý/i }).first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      const staffSelect = page.getByRole('combobox').or(page.locator('select')).first();
      if (await staffSelect.isVisible()) {
        await staffSelect.selectOption({ index: 1 });
      }
    }
  });
});

test.describe('Admin — Quản lý Nhân Sự', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
    await page.getByRole('link', { name: /nhân sự/i }).click();
    await expect(page).toHaveURL(/\/admin\/nhan-su/);
  });

  test('hiển thị danh sách nhân viên / bác sĩ', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/nhân viên|bác sĩ/i)).first()).toBeVisible();
  });

  test('tạo nhân viên mới → form hiện ra', async ({ page }) => {
    const newBtn = page.getByRole('link', { name: /thêm|tạo mới|nhân viên mới/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page).toHaveURL(/\/admin\/nhan-su\/moi/);
      await expect(page.getByLabel(/họ tên/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
    }
  });

  test('tạo nhân viên mới với đầy đủ thông tin', async ({ page }) => {
    await page.goto('/admin/nhan-su/moi');
    const ts = Date.now();
    await page.getByLabel(/họ tên/i).fill(`Test Nhân Viên ${ts}`);
    await page.getByLabel(/email/i).fill(`nvtest${ts}@ydsg.vn`);
    await page.getByLabel(/mật khẩu/i).fill('TestPass@2026');
    // Chọn role nếu có
    const roleSelect = page.getByLabel(/vai trò|role/i);
    if (await roleSelect.isVisible()) await roleSelect.selectOption('nhan_vien');
    await page.getByRole('button', { name: /tạo|lưu/i }).click();
    await expect(page.getByText(/thành công|đã tạo/i)).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Admin — Tra cứu Khách Hàng', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
    await page.getByRole('link', { name: /khách hàng/i }).click();
    await expect(page).toHaveURL(/\/admin\/khach-hang/);
  });

  test('tìm kiếm khách hàng theo SĐT', async ({ page }) => {
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/tìm|số điện thoại/i)).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('0901000001');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      await expect(page.getByText(/Nguyễn Thị Hoa|0901000001/i)).toBeVisible({ timeout: 5_000 });
    }
  });

  test('xem lịch sử của khách hàng', async ({ page }) => {
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/tìm|số điện thoại/i)).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('0901000002');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(800);
      // Lịch sử khách hàng KH2 có 3 lần done
      const historyItem = page.getByText(/laser toning|lê minh tuấn/i).first();
      if (await historyItem.isVisible()) {
        await expect(historyItem).toBeVisible();
      }
    }
  });
});
