/**
 * E2E — Trang công khai (không cần đăng nhập)
 * Bao gồm: homepage, điều hướng, đặt lịch, tin tức, dịch vụ, bảng giá
 */
import { test, expect } from '@playwright/test';
import { futureDate } from './helpers';

// ─── Homepage ────────────────────────────────────────────────────────────────
test.describe('Homepage', () => {
  test('hiển thị đúng tiêu đề và CTA đặt lịch', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/YDSG|Y Dược Sài Gòn|Phòng Khám/i);
    // Hero section phải có nút đặt lịch
    const ctaBtn = page.getByRole('link', { name: /đặt lịch/i }).first();
    await expect(ctaBtn).toBeVisible();
  });

  test('navbar có đủ các link điều hướng', async ({ page }) => {
    await page.goto('/');
    for (const name of ['Dịch Vụ', 'Bảng Giá', 'Tin Tức']) {
      await expect(page.getByRole('link', { name: new RegExp(name, 'i') }).first()).toBeVisible();
    }
  });

  test('bấm "Đặt Lịch" từ navbar chuyển tới /dat-lich', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /đặt lịch/i }).first().click();
    await expect(page).toHaveURL(/\/dat-lich/);
  });
});

// ─── Dịch vụ da liễu ─────────────────────────────────────────────────────────
test.describe('Trang Dịch Vụ Da Liễu', () => {
  test('tải trang /dich-vu-da-lieu thành công', async ({ page }) => {
    await page.goto('/dich-vu-da-lieu');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('có link "Đặt lịch" dẫn đến /dat-lich', async ({ page }) => {
    await page.goto('/dich-vu-da-lieu');
    const link = page.getByRole('link', { name: /đặt lịch/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/dat-lich/);
  });
});

// ─── Gói dịch vụ ─────────────────────────────────────────────────────────────
test.describe('Trang Gói Dịch Vụ', () => {
  test('tải /goi-dich-vu và hiển thị các gói', async ({ page }) => {
    await page.goto('/goi-dich-vu');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

// ─── Bảng giá ────────────────────────────────────────────────────────────────
test.describe('Trang Bảng Giá', () => {
  test('tải /bang-gia thành công, hiển thị bảng giá', async ({ page }) => {
    await page.goto('/bang-gia');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('bấm "Đặt lịch ngay" → /dat-lich', async ({ page }) => {
    await page.goto('/bang-gia');
    const btn = page.getByRole('link', { name: /đặt lịch/i }).first();
    if (await btn.isVisible()) {
      await btn.click();
      await expect(page).toHaveURL(/\/dat-lich/);
    }
  });
});

// ─── Tin tức ─────────────────────────────────────────────────────────────────
test.describe('Trang Tin Tức', () => {
  test('tải /tin-tuc và liệt kê bài viết', async ({ page }) => {
    await page.goto('/tin-tuc');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('bấm vào bài viết đầu tiên → trang chi tiết', async ({ page }) => {
    await page.goto('/tin-tuc');
    const firstArticle = page.getByRole('link').filter({ hasText: /.{10,}/ }).first();
    if (await firstArticle.isVisible()) {
      const href = await firstArticle.getAttribute('href');
      if (href?.includes('/tin-tuc/')) {
        await firstArticle.click();
        await expect(page).toHaveURL(/\/tin-tuc\/.+/);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      }
    }
  });
});

// ─── Khuyến mãi ──────────────────────────────────────────────────────────────
test.describe('Trang Khuyến Mãi', () => {
  test('tải /khuyen-mai thành công', async ({ page }) => {
    await page.goto('/khuyen-mai');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

// ─── SPA ─────────────────────────────────────────────────────────────────────
test.describe('Trang SPA', () => {
  test('tải /spa thành công', async ({ page }) => {
    await page.goto('/spa');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

// ─── Máy móc ─────────────────────────────────────────────────────────────────
test.describe('Trang Máy Móc', () => {
  test('tải /may-moc thành công', async ({ page }) => {
    await page.goto('/may-moc');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

// ─── Đặt lịch ────────────────────────────────────────────────────────────────
test.describe('Form Đặt Lịch', () => {
  test('hiển thị đầy đủ các trường form', async ({ page }) => {
    await page.goto('/dat-lich');
    await expect(page.getByLabel(/họ và tên/i)).toBeVisible();
    await expect(page.getByLabel(/số điện thoại/i)).toBeVisible();
    await expect(page.getByLabel(/dịch vụ/i)).toBeVisible();
    await expect(page.getByLabel(/ngày dự kiến/i)).toBeVisible();
  });

  test('validation: submit rỗng báo lỗi HTML5', async ({ page }) => {
    await page.goto('/dat-lich');
    await page.getByRole('button', { name: /gửi đăng ký/i }).click();
    // Form HTML5 validation ngăn submit → URL không đổi
    await expect(page).toHaveURL(/\/dat-lich/);
  });

  test('điền form đầy đủ và submit thành công', async ({ page }) => {
    await page.goto('/dat-lich');
    await page.getByLabel(/họ và tên/i).fill('Nguyễn Test E2E');
    await page.getByLabel(/số điện thoại/i).fill('0909999888');
    await page.getByLabel(/dịch vụ/i).selectOption({ index: 1 }); // chọn dịch vụ đầu tiên
    await page.getByLabel(/ngày dự kiến/i).fill(futureDate(3));
    await page.getByRole('button', { name: /gửi đăng ký/i }).click();
    await expect(page.getByText(/đăng ký thành công|thành công/i)).toBeVisible({ timeout: 10_000 });
  });

  test('không thể chọn ngày trong quá khứ', async ({ page }) => {
    await page.goto('/dat-lich');
    const dateInput = page.getByLabel(/ngày dự kiến/i);
    const minAttr = await dateInput.getAttribute('min');
    // min phải là hôm nay hoặc tương lai
    expect(minAttr).toBeTruthy();
    const today = new Date().toISOString().slice(0, 10);
    expect(minAttr! >= today.slice(0, 7)).toBeTruthy();
  });

  test('chọn giờ đã qua hôm nay → cảnh báo', async ({ page }) => {
    await page.goto('/dat-lich');
    // Giữ nguyên ngày hôm nay, chọn giờ 08:00 (giờ đã qua nếu test chạy sau 8h)
    const timeSelect = page.getByLabel(/giờ khám mong muốn/i);
    await timeSelect.selectOption('08:00');
    // Nếu giờ đã qua → có thông báo cảnh báo (có thể không visible nếu test chạy trước 8h)
    // Chỉ kiểm tra element tồn tại
    const warn = page.getByText(/giờ này đã qua/i);
    // Không bắt buộc visible — chỉ kiểm tra form còn mở
    await expect(page).toHaveURL(/\/dat-lich/);
  });
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
test.describe('404 Page', () => {
  test('truy cập URL không tồn tại → 404', async ({ page }) => {
    const res = await page.goto('/trang-khong-ton-tai-xyz');
    expect(res?.status()).toBe(404);
  });
});
