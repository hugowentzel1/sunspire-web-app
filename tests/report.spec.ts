import { test, expect } from '@playwright/test';

test('report CTA subtext is present (no other report changes enforced)', async ({ page }) => {
  await page.goto('/report');
  await expect(page.getByTestId('report-cta-subtext')).toHaveText(/We'll confirm site details & incentives — no obligation/i);
});

