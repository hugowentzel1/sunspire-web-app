import { test, expect } from '@playwright/test';

test.describe('mobile-only sticky CTAs', () => {
  test('demo sticky CTA is MOBILE-ONLY', async ({ page }) => {
    // Desktop: should NOT show sticky demo CTA
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await expect(page.getByTestId('sticky-demo-cta')).toHaveCount(0);

    // Mobile: should show sticky demo CTA
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByTestId('sticky-demo-cta')).toBeVisible();
  });

  test('paid report sticky CTA is MOBILE-ONLY', async ({ page }) => {
    // Desktop: should NOT show sticky report CTA
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/report');
    await expect(page.getByTestId('sticky-report-cta')).toHaveCount(0);

    // Mobile: should show sticky report CTA
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/report');
    await expect(page.getByTestId('sticky-report-cta')).toBeVisible();
  });
});

