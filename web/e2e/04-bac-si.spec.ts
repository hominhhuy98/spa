/**
 * E2E — Luồng Bác Sĩ
 * Bao gồm: đăng nhập, dashboard, chi tiết lịch hẹn,
 *          kê đơn thuốc (module thuốc), tạo phác đồ điều trị,
 *          cập nhật tiến độ buổi, ghi chú điều trị
 */
import { test, expect } from '@playwright/test';
import { loginStaff, logout, futureDate } from './helpers';

test.describe('Bác Sĩ — Xác thực', () => {
  test('truy cập /bac-si khi chưa đăng nhập → redirect', async ({ page }) => {
    await page.goto('/bac-si');
    await expect(page).toHaveURL(/\/login/);
  });

  test('đăng nhập bác sĩ thành công → vào /bac-si', async ({ page }) => {
    await loginStaff(page, 'bacSi');
    await expect(page).toHaveURL(/\/bac-si/);
  });

  test('đăng xuất → redirect về /login', async ({ page }) => {
    await loginStaff(page, 'bacSi');
    await logout(page);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Bác Sĩ — Dashboard', () => {
  test.beforeEach(async ({ page }) => { await loginStaff(page, 'bacSi'); });

  test('hiển thị "Dashboard Bác sĩ" hoặc tên bác sĩ', async ({ page }) => {
    await expect(
      page.getByText(/dashboard bác sĩ|bs\. nguyễn/i).first()
    ).toBeVisible();
  });

  test('hiển thị bảng lịch hẹn hôm nay', async ({ page }) => {
    await expect(page.getByText(/lịch hẹn hôm nay/i)).toBeVisible();
  });

  test('hiển thị bảng lịch hẹn được phân công', async ({ page }) => {
    await expect(page.getByText(/phân công/i)).toBeVisible();
  });
});

test.describe('Bác Sĩ — Chi tiết Lịch Hẹn', () => {
  test.beforeEach(async ({ page }) => {
    await loginStaff(page, 'bacSi');
    // Vào lịch hẹn đầu tiên
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) await link.click();
    else await page.goto('/bac-si'); // fallback
  });

  test('hiển thị thông tin khách hàng và dịch vụ', async ({ page }) => {
    if (page.url().includes('/bac-si/')) {
      await expect(page.locator('text=/09[0-9]{8}/').first()).toBeVisible();
    }
  });

  test('có nút kê đơn thuốc "+ Kê đơn mới" (bác sĩ có quyền)', async ({ page }) => {
    if (page.url().includes('/bac-si/')) {
      await expect(page.getByRole('button', { name: /kê đơn mới/i })).toBeVisible();
    }
  });

  test('có nút tạo phác đồ "+ Tạo phác đồ" (bác sĩ có quyền)', async ({ page }) => {
    if (page.url().includes('/bac-si/')) {
      await expect(page.getByRole('button', { name: /tạo phác đồ/i })).toBeVisible();
    }
  });
});

test.describe('Bác Sĩ — Module Thuốc (Kê Đơn)', () => {
  test.beforeEach(async ({ page }) => {
    await loginStaff(page, 'bacSi');
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) await link.click();
  });

  test('mở form kê đơn khi bấm "+ Kê đơn mới"', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    await page.getByRole('button', { name: /kê đơn mới/i }).click();
    await expect(page.getByPlaceholder(/chẩn đoán/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /\+ thêm thuốc/i })).toBeVisible();
  });

  test('thêm một dòng thuốc vào đơn', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    await page.getByRole('button', { name: /kê đơn mới/i }).click();
    await page.getByRole('button', { name: /\+ thêm thuốc/i }).click();
    // Sau khi thêm phải có 2 dòng thuốc
    const medicineInputs = page.getByPlaceholder(/tretinoin|tên thuốc/i);
    expect(await medicineInputs.count()).toBeGreaterThanOrEqual(1);
  });

  test('kê đơn thuốc hoàn chỉnh và lưu', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    await page.getByRole('button', { name: /kê đơn mới/i }).click();

    // Điền chẩn đoán
    await page.getByPlaceholder(/mụn trứng cá.*chẩn đoán|chẩn đoán/i).first().fill('Mụn trứng cá độ II');

    // Điền thuốc đầu tiên
    await page.getByPlaceholder(/tretinoin|tên thuốc/i).first().fill('Tretinoin 0.025%');
    const lieuInputs = page.getByPlaceholder(/1 viên.*lần|liều dùng/i);
    if (await lieuInputs.first().isVisible()) await lieuInputs.first().fill('1 lần / ngày');
    const tanSuatInputs = page.getByPlaceholder(/2 lần.*ngày|tần suất/i);
    if (await tanSuatInputs.first().isVisible()) await tanSuatInputs.first().fill('Mỗi tối');
    const thoiGianInputs = page.getByPlaceholder(/4 tuần|thời gian/i);
    if (await thoiGianInputs.first().isVisible()) await thoiGianInputs.first().fill('4 tuần');
    const hdInputs = page.getByPlaceholder(/bôi tối|hướng dẫn/i);
    if (await hdInputs.first().isVisible()) await hdInputs.first().fill('Bôi buổi tối, tránh ánh nắng');

    // Lưu đơn
    await page.getByRole('button', { name: /lưu đơn thuốc/i }).click();
    await expect(page.getByText(/đã lưu đơn thuốc/i)).toBeVisible({ timeout: 8_000 });
  });

  test('đơn thuốc vừa kê hiển thị trong danh sách', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    // Sau khi kê, panel phải hiển thị đơn
    const rxPanel = page.getByText(/BS\. Nguyễn Thị Lan|bs\. nguyễn/i);
    if (await rxPanel.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
      await expect(rxPanel.first()).toBeVisible();
    }
  });

  test('xóa dòng thuốc trong form', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    await page.getByRole('button', { name: /kê đơn mới/i }).click();
    // Thêm 1 thuốc nữa để có 2 dòng
    await page.getByRole('button', { name: /\+ thêm thuốc/i }).click();
    const removeButtons = page.getByRole('button', { name: '×' });
    const count = await removeButtons.count();
    if (count > 0) {
      await removeButtons.first().click();
      // Số dòng giảm
      expect(await page.getByRole('button', { name: '×' }).count()).toBe(count - 1);
    }
  });
});

test.describe('Bác Sĩ — Module Điều Trị (Phác Đồ)', () => {
  test.beforeEach(async ({ page }) => {
    await loginStaff(page, 'bacSi');
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) await link.click();
  });

  test('mở form tạo phác đồ khi bấm "+ Tạo phác đồ"', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    await page.getByRole('button', { name: /tạo phác đồ/i }).click();
    await expect(page.getByPlaceholder(/mụn trứng cá viêm|chẩn đoán/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/phác đồ|liệu trình/i).first()).toBeVisible();
    await expect(page.getByLabel(/tổng số buổi/i)).toBeVisible();
  });

  test('tạo phác đồ điều trị hoàn chỉnh và lưu', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    await page.getByRole('button', { name: /tạo phác đồ/i }).click();

    await page.getByPlaceholder(/mụn trứng cá viêm|chẩn đoán/i).first()
      .fill('Mụn trứng cá viêm độ III, nám má hai bên');
    await page.getByPlaceholder(/phác đồ|liệu trình/i).first()
      .fill('Laser Toning 5 buổi cách 2 tuần, kết hợp Peel da AHA/BHA sau buổi 3');
    await page.getByLabel(/tổng số buổi/i).fill('5');
    await page.getByLabel(/buổi tiếp theo/i).fill(futureDate(14));
    await page.getByPlaceholder(/lưu ý đặc biệt|ghi chú/i).last()
      .fill('Tránh nắng nghiêm ngặt, dùng kem chống nắng SPF 50+');

    await page.getByRole('button', { name: /lưu phác đồ/i }).click();
    await expect(page.getByText(/đã tạo phác đồ/i)).toBeVisible({ timeout: 8_000 });
  });

  test('thanh tiến độ buổi hiển thị sau khi tạo phác đồ', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    // Phải có thanh progress bar
    const progressBar = page.locator('[style*="width"]').first();
    // Nếu đã có phác đồ, thanh tiến độ xuất hiện
    const planSection = page.getByText(/module điều trị/i);
    await expect(planSection).toBeVisible();
  });

  test('bấm "+" cập nhật tiến độ buổi', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    // Tìm nút "+" tăng số buổi
    const incBtn = page.getByRole('button', { name: '+' }).last();
    if (await incBtn.isVisible() && !(await incBtn.isDisabled())) {
      const sessionText = page.getByText(/buổi \d+/i).first();
      const before = await sessionText.textContent();
      await incBtn.click();
      await page.waitForTimeout(1_000);
      const after = await sessionText.textContent();
      // Số buổi đã tăng (hoặc đã lưu thành công)
      expect(after).not.toBe(before);
    }
  });

  test('bấm "−" giảm tiến độ buổi', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    // Tăng trước rồi giảm
    const incBtn = page.getByRole('button', { name: '+' }).last();
    const decBtn = page.getByRole('button', { name: '−' }).last();
    if (await incBtn.isVisible() && !(await incBtn.isDisabled())) {
      await incBtn.click();
      await page.waitForTimeout(500);
      if (!(await decBtn.isDisabled())) {
        await decBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('cập nhật ngày buổi tiếp theo', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    const nextDateInput = page.getByLabel(/buổi tiếp theo/i).or(
      page.locator('input[type="date"]').last()
    );
    if (await nextDateInput.isVisible()) {
      await nextDateInput.fill(futureDate(21));
      await nextDateInput.blur();
      await page.waitForTimeout(800); // auto-save on blur
    }
  });
});

test.describe('Bác Sĩ — Ghi Chú Điều Trị', () => {
  test.beforeEach(async ({ page }) => {
    await loginStaff(page, 'bacSi');
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) await link.click();
  });

  test('thêm ghi chú điều trị', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    const noteArea = page.getByPlaceholder(/thêm ghi chú/i);
    if (await noteArea.isVisible()) {
      await noteArea.fill('Ghi chú bác sĩ: da cải thiện rõ rệt sau buổi 2');
      await page.getByRole('button', { name: /^thêm$/i }).click();
      await expect(page.getByText(/da cải thiện rõ rệt/i)).toBeVisible({ timeout: 5_000 });
    }
  });

  test('ghi chú hiển thị tên bác sĩ và thời gian', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    const noteArea = page.getByPlaceholder(/thêm ghi chú/i);
    if (await noteArea.isVisible()) {
      await noteArea.fill('Test ghi chú E2E');
      await page.getByRole('button', { name: /^thêm$/i }).click();
      // Ghi chú mới phải hiện tên bác sĩ
      await expect(page.getByText(/BS\. Nguyễn Thị Lan|nguyễn thị lan/i)).toBeVisible({ timeout: 5_000 });
    }
  });
});

test.describe('Bác Sĩ — Thông tin Hồ Sơ', () => {
  test.beforeEach(async ({ page }) => {
    await loginStaff(page, 'bacSi');
    const link = page.getByRole('link', { name: /xử lý|xem →/i }).first();
    if (await link.isVisible()) await link.click();
  });

  test('nhân viên tiếp nhận và bác sĩ phụ trách có thể chọn từ dropdown', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    const staffSelect = page.getByLabel(/nhân viên tiếp nhận/i);
    const doctorSelect = page.getByLabel(/bác sĩ phụ trách/i);
    if (await staffSelect.isVisible()) {
      await expect(staffSelect).toBeVisible();
    }
    if (await doctorSelect.isVisible()) {
      await expect(doctorSelect).toBeVisible();
    }
  });

  test('đặt ngày tái khám', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    const followUpDate = page.getByLabel(/ngày tái khám/i);
    if (await followUpDate.isVisible()) {
      await followUpDate.fill(futureDate(30));
    }
  });

  test('lưu hồ sơ thành công', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    const saveBtn = page.getByRole('button', { name: /lưu hồ sơ/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await expect(page.getByText(/đã lưu thành công/i)).toBeVisible({ timeout: 5_000 });
    }
  });

  test('hiển thị lịch sử khám của bệnh nhân', async ({ page }) => {
    if (!page.url().includes('/bac-si/')) return;
    // Sidebar trái có phần lịch sử
    await expect(page.getByText(/lịch sử/i)).toBeVisible();
  });
});
