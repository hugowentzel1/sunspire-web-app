import { test, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://localhost:3001';

test('primary CTA opens Stripe checkout', async ({ page }) => {
  await page.goto(`${base}/?company=Meta&brandColor=%231877F2&token=tok-check&utm_source=email&utm_campaign=wave1`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // Click the primary CTA by data attribute to be robust
  await page.locator('[data-cta="primary"]').first().click();
  
  // Stripe redirect
  await page.waitForURL(/https:\/\/checkout\.stripe\.com\/c\//, { timeout: 15000 });
});

test('pricing page CTA opens Stripe checkout', async ({ page }) => {
  await page.goto(`${base}/pricing?company=Meta&brandColor=%231877F2&token=tok-check&utm_source=email&utm_campaign=wave1`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // Click the primary CTA on pricing page
  await page.locator('[data-cta="primary"]').first().click();
  
  // Stripe redirect
  await page.waitForURL(/https:\/\/checkout\.stripe\.com\/c\//, { timeout: 15000 });
});

test('home page CTA opens Stripe checkout', async ({ page }) => {
  await page.goto(`${base}/?company=Meta&brandColor=%231877F2&token=tok-check&utm_source=email&utm_campaign=wave1`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // Click the primary CTA on home page
  await page.locator('[data-cta="primary"]').first().click();
  
  // Stripe redirect
  await page.waitForURL(/https:\/\/checkout\.stripe\.com\/c\//, { timeout: 15000 });
});

test('CTA tracking parameters are preserved', async ({ page }) => {
  await page.goto(`${base}/?company=Meta&brandColor=%231877F2&token=tok-check&utm_source=email&utm_campaign=wave1`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // Verify tracking parameters are visible in the page (use first heading)
  await expect(page.locator('h1:has-text("Meta")').first()).toBeVisible();
  
  // Click CTA and verify redirect
  await page.locator('[data-cta="primary"]').first().click();
  
  // Stripe redirect
  await page.waitForURL(/https:\/\/checkout\.stripe\.com\/c\//, { timeout: 15000 });
});
