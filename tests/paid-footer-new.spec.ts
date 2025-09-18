import { test, expect } from '@playwright/test';

// Paid (NO demo=1)
const LIVE_PAID = 'http://localhost:3002/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com';

test('Paid: no demo CTAs or CRM chips, footer present', async ({ page }) => {
  await page.goto(LIVE_PAID, { waitUntil: 'networkidle' });

  // no demo-only text
  await expect(page.getByText(/Activate on Your Domain|Unlock Full Report|CRM-ready/i)).toHaveCount(0);

  // footer visible
  await page.locator('[data-paid-footer]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-paid-footer]')).toBeVisible();
  await expect(page.getByText('Privacy Policy')).toBeVisible();
  await expect(page.getByText(/Powered by Sunspire/i)).toBeVisible();

  // cookie bar doesn't overlap (footer still clickable)
  await page.click('text=Privacy Policy'); // should be clickable even if cookie bar present
});

test('Paid report: banner removed', async ({ page }) => {
  const url = LIVE_PAID.replace('/?', '/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=test'); // same params, report page, still paid
  await page.goto(url, { waitUntil: 'networkidle' });
  await expect(page.getByText(/Ready to Launch|Unlock Full Report|Activate on Your Domain/i)).toHaveCount(0);
  await expect(page.locator('[data-paid-footer]')).toBeVisible();
});

test('Paid footer: 3-column layout with company branding', async ({ page }) => {
  await page.goto(LIVE_PAID, { waitUntil: 'networkidle' });

  const footer = page.locator('[data-paid-footer]');
  await expect(footer).toBeVisible();

  // Check 3-column layout exists
  await expect(footer.getByText('SolarPro Energy', { exact: true })).toBeVisible();
  await expect(footer.getByText('Legal')).toBeVisible();
  await expect(footer.getByText('Questions?')).toBeVisible();

  // Check company logo is present
  await expect(footer.locator('img[alt*="SolarPro Energy logo"]')).toBeVisible();

  // Check legal links
  await expect(footer.getByText('Privacy Policy')).toBeVisible();
  await expect(footer.getByText('Terms of Service')).toBeVisible();
  await expect(footer.getByText('Accessibility')).toBeVisible();
  await expect(footer.getByText('Cookies')).toBeVisible();

  // Check contact info
  await expect(footer.getByText('Email SolarPro Energy')).toBeVisible();
  await expect(footer.getByText('+1 (555) 123-4567')).toBeVisible();

  // Check disclaimer box
  await expect(page.locator('[data-disclaimer-box]')).toBeVisible();
  await expect(footer.getByText('Estimates are informational only')).toBeVisible();
  await expect(footer.getByText('Last updated')).toBeVisible();
});

test('Paid footer: accessibility features', async ({ page }) => {
  await page.goto(LIVE_PAID, { waitUntil: 'networkidle' });

  const footer = page.locator('[data-paid-footer]');

  // Check for proper ARIA landmarks
  await expect(footer).toHaveAttribute('role', 'contentinfo');

  // Check that links have proper styling and are clickable
  const privacyLink = footer.getByText('Privacy Policy');
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/privacy');

  // Check external link attributes
  const poweredByLink = footer.getByText('Powered by').getByText('Sunspire');
  await expect(poweredByLink).toHaveAttribute('href', 'https://getsunspire.com');
  await expect(poweredByLink).toHaveAttribute('target', '_blank');
  await expect(poweredByLink).toHaveAttribute('rel', 'noopener');
});
