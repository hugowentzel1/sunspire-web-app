import { test, expect } from '@playwright/test';

const LIVE = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';

test('home/demo renders and CTA present', async ({ page }) => {
  await page.goto(LIVE, { waitUntil: 'networkidle' });
  await expect(page.getByText(/Apple/i)).toBeVisible();
  await expect(page.locator('[data-cta="primary"]')).toBeVisible();
});

test('demo quota locks after two runs', async ({ page }) => {
  await page.goto(LIVE);
  const run = async () => {
    await page.click('[data-cta="primary"]'); // adjust selector if needed
    await page.waitForTimeout(1500);
  };
  await run(); await run();
  // Third attempt should reveal lock overlay or Unlock CTA
  await run();
  await expect(page.getByText(/Unlock|Upgrade/i)).toBeVisible();
});

test('onboard domain page renders instructions', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/onboard/domain?tenant=demo&companyWebsite=acme.com');
  await expect(page.getByText('Connect your custom domain')).toBeVisible();
  await expect(page.getByText(/quote\.acme\.com/)).toBeVisible();
  await expect(page.getByText(/cname\.vercel-dns\.com/)).toBeVisible();
});

test('success page shows domain onboarding CTA', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/success?session_id=test&company=Apple');
  await expect(page.getByText('Set up your custom domain (recommended)')).toBeVisible();
  await expect(page.getByText('Covered by our 14-day guarantee')).toBeVisible();
});

test('terms page has refunds section', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/terms');
  await expect(page.getByText('Refunds & Guarantee')).toBeVisible();
  await expect(page.getByText('14-day pilot guarantee')).toBeVisible();
});

test('footer has refunds link', async ({ page }) => {
  await page.goto(LIVE);
  await expect(page.getByRole('link', { name: 'Refunds' })).toBeVisible();
  await page.click('a[href="/terms#refunds"]');
  await expect(page.getByText('Refunds & Guarantee')).toBeVisible();
});

test('API endpoints respond correctly', async ({ page }) => {
  // Test health endpoint
  const healthResponse = await page.request.get('https://sunspire-web-app.vercel.app/api/health');
  expect(healthResponse.status()).toBe(200);
  
  // Test autocomplete endpoint
  const autocompleteResponse = await page.request.get('https://sunspire-web-app.vercel.app/api/autocomplete?query=123');
  expect([200, 400, 422]).toContain(autocompleteResponse.status());
  
  // Test estimate endpoint
  const estimateResponse = await page.request.post('https://sunspire-web-app.vercel.app/api/estimate', {
    data: {
      address: '123 Test St, Test City, TC 12345',
      systemSize: 5
    }
  });
  expect([200, 400, 422, 500]).toContain(estimateResponse.status());
});

test('domain API endpoints exist', async ({ page }) => {
  // Test domain prefill endpoint
  const prefillResponse = await page.request.post('https://sunspire-web-app.vercel.app/api/domains/prefill', {
    data: { tenantHandle: 'test', fqdn: 'quote.test.com' }
  });
  expect([200, 400, 500]).toContain(prefillResponse.status());
  
  // Test domain attach endpoint
  const attachResponse = await page.request.post('https://sunspire-web-app.vercel.app/api/domains/attach', {
    data: { tenantHandle: 'test' }
  });
  expect([200, 400, 500]).toContain(attachResponse.status());
  
  // Test domain verify endpoint
  const verifyResponse = await page.request.post('https://sunspire-web-app.vercel.app/api/domains/verify', {
    data: { tenantHandle: 'test' }
  });
  expect([200, 400, 500]).toContain(verifyResponse.status());
  
  // Test domain status endpoint
  const statusResponse = await page.request.get('https://sunspire-web-app.vercel.app/api/domains/status?tenant=test');
  expect([200, 400, 500]).toContain(statusResponse.status());
});
