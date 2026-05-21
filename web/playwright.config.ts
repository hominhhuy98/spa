import { defineConfig, devices } from '@playwright/test';

// Khi test production, set E2E_BASE_URL → không khởi động dev server local
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const IS_PROD = !!process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // tuần tự để tránh conflict dữ liệu
  retries: 1,
  workers: 1,
  reporter: [['html', { outputFolder: 'e2e-report', open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Chỉ khởi động dev server khi test local (không phải production)
  ...(IS_PROD ? {} : {
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  }),
});
