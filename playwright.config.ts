// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || '3000';
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',                 // adjust if needed
  timeout: 60_000,                    // hard stop (prevents 10+ min hangs)
  expect: { timeout: 10_000 },
  reporter: [['list']],
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: BASE_URL,
    headless: true,
    trace: 'on-first-retry',
  },

  // webServer: {
  //   command: process.env.CI ? 'npm run start' : 'npm run dev',
  //   url: BASE_URL,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,                 // fail if server not ready in 2m
  // },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
