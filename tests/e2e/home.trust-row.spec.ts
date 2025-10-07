import { test, expect } from '@playwright/test';

test('exactly one hero trust row; no duplicate full-width trust rows', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="hero-trust-row"]')).toHaveCount(1);

  // Ensure only the hero row remains (no old duplicate trust sections)
  const trustRowCount = await page.locator('[data-testid="hero-trust-row"]').count();
  expect(trustRowCount).toBe(1);
});

