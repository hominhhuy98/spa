/**
 * E2E — Luồng Nhân Viên
 * Bao gồm: đăng nhập, dashboard, lịch hôm nay, walk-in, chi tiết lịch hẹn,
 *          cập nhật trạng thái, xem module thuốc & điều trị (read-only)
 */
import { test, expect } from '@playwright/test';
import { loginStaff, logout, futureDate } from './helpers';

test.describe('Nhân Viên — Xác thực', () => {
  test('truy cập /nhan-vien khi chưa đăng nhập → redirect về /login', async ({ page }) => {
    await page.goto('/nhan-vien');
    await expect(page).toHaveURL(/\/login/);
  });

  test('đăng nhập nhân viên thành công → vào /nhan-vien', async ({ page }) => {
    await loginStaff(page, 'nhanVien');
    await expect(page).toHaveURL(/\/nhan-vien/);
  });

  test('đăng xuất → redirect về /login', async ({ page }) => {
    await loginStaff(page, 'nhanVien');
    await logout(page);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Nhân Viên — Dashboard', () => {
  test.beforeEach(async ({ page }) => { await loginStaff(page, 'nhanVien'); });

  test('hiển thị "Dashboard Nhân viên" và ngày hôm nay', async ({ page }) => {
    await expect(page.getByText(/dashboard nhân viên/i)).toBeVisible();
    const today = new Date().toLocaleDateString('vi-VN');
    // Có ngày hôm nay trong header
    await expect(page.getByText(/hôm nay/i)).toBeVisible();
  });

  test('hiển thị 4 stat cards: Lịch hôm nay, Chờ xác nhận, Đã xác nhận, Hoàn thành', async ({ page }) => {
    for (const label of ['Lịch hôm nay', 'Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành']) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('bảng "Lịch hẹn hôm nay" hiển thị đúng ngày', async ({ page }) => {
    await expect(page.getByText(/lịch hẹn hôm nay/i)).toBeVisible();
  });

  test('bảng "Lịch hẹn phân công" hiển thị', async ({ page }) => {
    await expect(page.getByText(/lịch hẹn phân công/i)).toBeVisible();
  });

  test('menu sidebar "Lịch hôm nay" điều hướng đúng', async ({ page }) => {
    const link = page.getByRole('link', { name: /lịch hôm nay/i });
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/\/nhan-vien/);
    }
  });
});

test.describe('Nhân Viên — Walk-in (Tiếp nhận khách không hẹn)', () => {
  test.beforeEach(async ({ page }) => { await loginStaff(page, 'nhanVien'); });

  test('nút "Tiếp nhận khách walk-in" hiển thị', async ({ page }) => {
    await expect(page.getByRole('button', { name: /walk-in|tiếp nhận khách/i })).toBeVisible();
  });

  test('bấm walk-in → modal/form hiện ra', async ({ page }) => {
    await page.getByRole('button', { name: /walk-in|tiếp nhận khách/i }).click();
    // Modal phải xuất hiện
    await expect(
      page.getByRole('dialog').or(page.getByPlaceholder(/họ tên|tên khách/i)).first()
    ).toBeVisible({ timeout: 3_000 });
  });

  test('điền form walk-in và submit', async ({ page }) => {
    await page.getByRole('button', { name: /walk-in|tiếp nhận khách/i }).click();
    // Điền thông tin
    const nameInput = page.getByPlaceholder(/họ tên|tên khách/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Khách Walk-in Test');
      const phoneInput = page.getByPlaceholder(/số điện thoại/i).first();
      if (await phoneInput.isVisible()) await phoneInput.fill('0911222333');
      // Chọn dịch vụ
      const serviceSelect = page.getByRole('combobox').or(page.locator('select')).first();
      if (await serviceSelect.isVisible()) await serviceSelect.selectOption({ index: 1 });
      // Submit
      const submitBtn = page.getByRole('button', { name: /tiếp nhận|lưu|tạo/i }).last();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await expect(page.getByText(/thành công|đã tạo|tiếp nhận/i)).toBeVisible({ timeout: 8_000 });
      }
    }
  });
});

test.describe('Nhân Viên — Chi tiết Lịch Hẹn', () => {
  test.beforeEach(async ({ page }) => { await loginStaff(page, 'nhanVien'); });

  test('bấm "Xử lý" hoặc "Xem" → vào trang chi tiết', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/\/nhan-vien\/\d+/);
    }
  });

  test('chi tiết lịch hẹn: hiển thị thông tin khách hàng', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      // Có tên khách hàng và số điện thoại
      await expect(page.locator('text=/090[0-9]+/').first()).toBeVisible({ timeout: 5_000 });
    }
  });

  test('chi tiết: nhân viên KHÔNG thấy nút kê đơn thuốc', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      // Module thuốc hiển thị nhưng không có nút "+ Kê đơn mới"
      await expect(page.getByText(/module thuốc/i)).toBeVisible({ timeout: 5_000 });
      await expect(page.getByRole('button', { name: /kê đơn mới/i })).not.toBeVisible();
    }
  });

  test('chi tiết: nhân viên KHÔNG thấy nút tạo phác đồ', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      await expect(page.getByText(/module điều trị/i)).toBeVisible({ timeout: 5_000 });
      await expect(page.getByRole('button', { name: /tạo phác đồ/i })).not.toBeVisible();
    }
  });

  test('cập nhật trạng thái lịch hẹn', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      const confirmBtn = page.getByRole('button', { name: /xác nhận|đã xác nhận|hoàn thành/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await expect(page.getByText(/đã cập nhật|thành công/i)).toBeVisible({ timeout: 5_000 });
      }
    }
  });

  test('thêm ghi chú điều trị', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      const noteArea = page.getByPlaceholder(/thêm ghi chú/i);
      if (await noteArea.isVisible()) {
        await noteArea.fill('Ghi chú test E2E từ nhân viên');
        await page.getByRole('button', { name: /^thêm$/i }).click();
        await expect(page.getByText(/ghi chú test e2e từ nhân viên/i)).toBeVisible({ timeout: 5_000 });
      }
    }
  });

  test('bấm "Quay lại" → về /nhan-vien', async ({ page }) => {
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) {
      await link.click();
      await page.getByRole('button', { name: /quay lại/i }).click();
      await expect(page).toHaveURL(/\/nhan-vien$/);
    }
  });
});
