import { test, expect } from '@playwright/test';

test('address input is present and accepts text', async ({ page }) => {
  const base = process.env.E2E_BASE_URL || 'http://localhost:3000';
  await page.goto(base);
  const addr = page.getByTestId('address-input'); // set data-testid on your address input if not present
  await expect(addr).toBeVisible();
  await addr.fill('1600 Pennsylvania Ave');
  // If you mock Google Places, you can assert the dropdown; otherwise just ensure no crash.
  await expect(page).toHaveTitle(/sunspire/i);
});
