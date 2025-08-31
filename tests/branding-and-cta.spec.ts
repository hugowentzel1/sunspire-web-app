import { test, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('banner shows company logo and brand color', async ({ page }) => {
  await page.goto(`${base}/?company=Meta&brandColor=%231877F2&token=tok-1`);
  // logo visible (img or monogram)
  const maybeLogo = page.getByAltText(/meta logo/i);
  await expect(maybeLogo).toBeVisible({ timeout: 5000 });
  const brand = await page.evaluate(
    () => getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()
  );
  expect(brand.toLowerCase()).toBe('#1877f2');
});

test('report page shows company logo', async ({ page }) => {
  await page.goto(`${base}/report?company=Meta&brandColor=%231877F2`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // Check the prominent center logo (96x96px) - specifically the large one
  const centerLogo = page.locator('img[alt*="Meta logo"][width="96"][height="96"]');
  await expect(centerLogo).toBeVisible({ timeout: 5000 });
});

test('report page visual verification', async ({ page }) => {
  await page.goto(`${base}/report?company=Meta&brandColor=%231877F2`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot to show the visual result
  await page.screenshot({ path: 'test-results/report-page-meta-logo.png', fullPage: true });
  
  console.log('✅ Report page screenshot saved! Check test-results/report-page-meta-logo.png');
});

test('pricing uses brand color and matches snapshot', async ({ page }) => {
  await page.goto(`${base}/pricing?company=Meta&brandColor=%231877F2`);
  expect(await page.screenshot()).toMatchSnapshot('pricing-meta.png', { maxDiffPixelRatio: 0.03 });
});

test('CTA posts and yields Stripe checkout URL', async ({ page }) => {
  await page.goto(`${base}/?company=Meta&brandColor=%231877F2&token=tok-2&utm_source=email&utm_campaign=wave1`);
  const cta = page.getByRole('button', { name: /get started|start now|buy|upgrade/i }).first();
  await cta.click();
  await page.waitForURL(/https:\/\/checkout\.stripe\.com\/c\//, { timeout: 15000 });
});
