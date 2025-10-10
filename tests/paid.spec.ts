import { test, expect } from '@playwright/test';

test('paid address page renders minimal form', async ({ page }) => {
  await page.goto('/paid');
  await expect(page.getByTestId('paid-address-input')).toBeVisible();
  await expect(page.getByTestId('paid-generate-btn')).toHaveText(/Generate Solar Estimate/i);
});

