import { test, expect } from '@playwright/test';

const PAID_URL = process.env.PAID_URL ?? 'https://sunspire-web-app.vercel.app/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com';

test('Paid: clean UI with no demo/CRM copy', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });

  // 1) No demo artifacts
  for (const re of [/Private demo/i, /Activate on Your Domain/i, /Unlock Full Report/i, /Preview:\s*\d+\s*runs left/i]) {
    await expect(page.getByText(re).first()).toHaveCount(0);
  }

  // 2) No CRM marketing badges
  for (const re of [/CRM Ready/i, /CRM Integration/i, /24\/7 Support/i]) {
    await expect(page.getByText(re).first()).toHaveCount(0);
  }

  // 3) Hero logo visible (chip or img)
  await expect(page.locator('img[alt*="logo" i], [data-hero-logo]')).toBeVisible();

  // 4) KPI cards exist
  const kpis = page.locator('[data-kpi], .kpi');
  await expect(kpis).toHaveCountGreaterThan(2);

  // 5) Sticky bar appears on scroll with correct actions
  await page.mouse.wheel(0, 1500);
  const sticky = page.locator('[data-sticky-bar]');
  await expect(sticky).toBeVisible();
  await expect(sticky.getByRole('link', { name: /Book a Consultation/i })).toBeVisible();
  await expect(sticky.getByRole('button', { name: /Email PDF/i })).toBeVisible();

  // 6) Data sources & disclaimer
  await expect(page.getByText(/Data Sources/i)).toBeVisible();
  await expect(page.getByText(/Informational only.*not a binding quote/i)).toBeVisible();
});

test('Paid: hero shows company branding and correct headline', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });

  // Check for correct headline for paid experience
  await expect(page.getByText('Instant Solar Analysis for Your Home')).toBeVisible();
  
  // Check for correct subheadline
  await expect(page.getByText('Enter your address to see projected production, ROI, and payback in seconds.')).toBeVisible();
  
  // Check that company logo is visible
  await expect(page.locator('[data-hero-logo]')).toBeVisible();
});

test('Paid: no internal/ops copy visible', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });

  // Should not show internal messaging
  await expect(page.getByText(/Live for.*Leads now save to your CRM/i)).toHaveCount(0);
  await expect(page.getByText(/Powered by Sunspire/i)).toHaveCount(0);
  
  // Should not show demo-specific messaging
  await expect(page.getByText(/Your Branded Solar Quote Tool/i)).toHaveCount(0);
  await expect(page.getByText(/Go live in 24 hours/i)).toHaveCount(0);
});

test('Paid: address form has proper attributes', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });

  // Check address input has proper attributes
  const addressInput = page.locator('input[type="text"]').first();
  await expect(addressInput).toHaveAttribute('autocomplete', 'street-address');
  
  // Check for Google attribution
  await expect(page.getByText(/Powered by Google/i)).toBeVisible();
});

test('Paid: sticky bar functionality', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });

  // Initially sticky bar should not be visible
  await expect(page.locator('[data-sticky-bar]')).not.toBeVisible();

  // Scroll down to trigger sticky bar
  await page.mouse.wheel(0, 1500);
  await expect(page.locator('[data-sticky-bar]')).toBeVisible();

  // Test consultation button click
  const consultBtn = page.getByRole('button', { name: /Book Consultation/i });
  await expect(consultBtn).toBeVisible();
  
  // Test email PDF button
  const emailBtn = page.getByRole('button', { name: /Email PDF/i });
  await expect(emailBtn).toBeVisible();
  
  // Click email button to test functionality
  await emailBtn.click();
  
  // Should show success message or handle the click
  // (The actual implementation shows a temporary success message)
  await page.waitForTimeout(1000);
});
