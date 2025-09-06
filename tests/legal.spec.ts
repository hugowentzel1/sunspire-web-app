import { test, expect } from '@playwright/test';
const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://sunspire-web-app.vercel.app';

test('Refund page exists', async ({ page }) => {
  await page.goto(`${BASE}/refund`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /Refund/i })).toBeVisible();
});

test('Cancel page exists', async ({ page }) => {
  await page.goto(`${BASE}/cancel`, { waitUntil: 'networkidle' });
  await expect(page.getByText(/Checkout canceled/i)).toBeVisible();
});

test('Footer has Privacy, Terms, Refund', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  for (const t of ['Privacy', 'Terms', 'Refund']) {
    await expect(page.locator('a', { hasText: t })).toBeVisible();
  }
});

test('Privacy shows GDPR + CASL essentials', async ({ page }) => {
  await page.goto(`${BASE}/privacy`, { waitUntil: 'networkidle' });
  await expect(page.getByText(/Legitimate interests/i)).toBeVisible();
  await expect(page.getByText(/CASL/i)).toBeVisible();
  await expect(page.getByText(/unsubscribe that works/i)).toBeVisible();
  await expect(page.getByText(/postal/i)).toBeVisible();
});

test('Powered by Google visible near address field', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await expect(page.getByText(/Powered by Google/i)).toBeVisible();
});

test('Unsubscribe endpoints respond correctly', async ({ page }) => {
  // Test one-click unsubscribe endpoint
  const response1 = await page.goto(`${BASE}/api/unsubscribe/test-hash`);
  expect(response1?.status()).toBe(200);
  
  // Test body unsubscribe endpoint (may return 400 if Airtable not configured)
  const response2 = await page.request.post(`${BASE}/api/unsubscribe`, {
    data: { email: 'test@example.com' }
  });
  expect([200, 400]).toContain(response2.status());
});

test('Footer shows consistent company identity', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  
  // Check for support and billing emails
  await expect(page.getByText('support@getsunspire.com')).toBeVisible();
  await expect(page.getByText('billing@getsunspire.com')).toBeVisible();
  
  // Check for postal address
  await expect(page.getByText('3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305')).toBeVisible();
});
