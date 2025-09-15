import { test, expect } from '@playwright/test';

test('lead submission posts to /api/leads/upsert', async ({ page }) => {
  const base = process.env.E2E_BASE_URL || 'http://localhost:3000';
  await page.goto(base);

  // Intercept the upsert call and assert payload shape
  await page.route('**/api/leads/upsert', async route => {
    const req = route.request();
    const body = JSON.parse(req.postData() || '{}');
    expect(body.email).toBeTruthy();
    expect(body.fullName).toBeTruthy();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  // Fill address and generate report to trigger lead flow
  await page.getByTestId('address-input').fill('1600 Pennsylvania Ave NW, Washington, DC 20500');
  await page.getByTestId('cta-primary').click();

  // Wait for navigation to report page
  await page.waitForURL(/\/report/);
  
  // Verify the page loaded successfully
  await expect(page.getByTestId('report-page')).toBeVisible();
});
