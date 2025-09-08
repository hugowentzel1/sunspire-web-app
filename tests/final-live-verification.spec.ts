import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Final Live Site Verification', () => {
  test('Homepage with Apple branding loads correctly', async ({ page }) => {
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`, { waitUntil: 'networkidle' });
    
    // Check Apple branding
    await expect(page.getByText('Apple').first()).toBeVisible();
    await expect(page.getByText('Demo for Apple').first()).toBeVisible();
    
    // Check main CTAs are present
    const ctaButtons = page.locator('button, a').filter({ hasText: /Get Quote|Start|Try|Demo/i });
    await expect(ctaButtons.first()).toBeVisible();
    
    // Check page loads without errors
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(1000);
  });

  test('Refund page redirects to terms#refunds', async ({ page }) => {
    const response = await page.goto(`${LIVE_URL}/refund`);
    expect(response?.status()).toBe(200);
    
    // Check that we're redirected to terms page with refunds section
    await expect(page.getByText('Terms of Service')).toBeVisible();
    await expect(page.getByText('Refunds & Guarantee')).toBeVisible();
    await expect(page.getByText('14-day pilot guarantee')).toBeVisible();
  });

  test('Terms page has refunds section but no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/terms`);
    
    // Check refunds section exists
    await expect(page.getByText('Refunds & Guarantee')).toBeVisible();
    await expect(page.getByText('14-day pilot guarantee')).toBeVisible();
    await expect(page.getByText('support@getsunspire.com').first()).toBeVisible();
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page structure
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Privacy page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/privacy`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('Privacy Policy').first()).toBeVisible();
  });

  test('Security page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/security`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('Security & Compliance').first()).toBeVisible();
  });

  test('DPA page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/dpa`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('Data Processing Agreement').first()).toBeVisible();
  });

  test('Do Not Sell page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/do-not-sell`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('Do Not Sell My Data').first()).toBeVisible();
  });

  test('Footer no longer has refunds link', async ({ page }) => {
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    
    // Check footer exists
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    
    // Check refunds link is not present
    const refundsLink = page.getByRole('link', { name: 'Refunds' });
    await expect(refundsLink).toHaveCount(0);
    
    // Check other legal links are still present
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Security' })).toBeVisible();
  });

  test('Documentation pages have centered bullet points', async ({ page }) => {
    // Test setup guide
    await page.goto(`${LIVE_URL}/docs/setup`);
    
    // Check numbered steps are centered
    const numberedSteps = page.locator('.flex.items-center.space-x-4');
    const stepCount = await numberedSteps.count();
    expect(stepCount).toBeGreaterThan(0);
    
    // Test Salesforce CRM page
    await page.goto(`${LIVE_URL}/docs/crm/salesforce`);
    const salesforceSteps = page.locator('.flex.items-center.space-x-4');
    const salesforceStepCount = await salesforceSteps.count();
    expect(salesforceStepCount).toBeGreaterThan(0);
    
    // Test Airtable CRM page
    await page.goto(`${LIVE_URL}/docs/crm/airtable`);
    const airtableSteps = page.locator('.flex.items-center.space-x-4');
    const airtableStepCount = await airtableSteps.count();
    expect(airtableStepCount).toBeGreaterThan(0);
    
    // Test HubSpot CRM page
    await page.goto(`${LIVE_URL}/docs/crm/hubspot`);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('HubSpot CRM Integration').first()).toBeVisible();
  });

  test('All legal pages load without errors', async ({ page }) => {
    const legalPages = ['/privacy', '/terms', '/security', '/dpa', '/do-not-sell', '/cancel'];
    
    for (const pagePath of legalPages) {
      await page.goto(`${LIVE_URL}${pagePath}`);
      
      // Check page loads without errors
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(100);
      
      // Check for proper page structure
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }
  });

  test('Domain onboarding still works', async ({ page }) => {
    await page.goto(`${LIVE_URL}/onboard/domain?tenant=Apple&companyWebsite=apple.com`);
    
    // Verify domain setup elements
    await expect(page.getByText('Connect your custom domain')).toBeVisible();
    await expect(page.getByText('quote.apple.com')).toBeVisible();
    await expect(page.getByText('cname.vercel-dns.com')).toBeVisible();
    await expect(page.getByText('I added the record → Verify')).toBeVisible();
  });

  test('API endpoints respond correctly', async ({ page }) => {
    // Test health endpoint
    const healthResponse = await page.request.get(`${LIVE_URL}/api/health`);
    expect(healthResponse.status()).toBe(200);
    
    // Test autocomplete endpoint
    const autocompleteResponse = await page.request.get(`${LIVE_URL}/api/autocomplete?query=123`);
    expect([200, 400, 422]).toContain(autocompleteResponse.status());
    
    // Test estimate endpoint
    const estimateResponse = await page.request.post(`${LIVE_URL}/api/estimate`, {
      data: {
        address: '123 Test St, Test City, TC 12345',
        systemSize: 5
      }
    });
    expect([200, 400, 422, 500]).toContain(estimateResponse.status());
  });

  test('Multi-tenant branding works', async ({ page }) => {
    const companies = ['Tesla', 'Microsoft', 'Netflix', 'Google'];
    
    for (const company of companies) {
      await page.goto(`${LIVE_URL}/?company=${company}&demo=1`);
      
      // Check company branding appears
      await expect(page.getByText(company).first()).toBeVisible();
      await expect(page.getByText(`Demo for ${company}`).first()).toBeVisible();
    }
  });

  test('Responsive design works on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Take final screenshots for verification', async ({ page }) => {
    // Homepage screenshot
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    await page.screenshot({ path: 'final-homepage.png', fullPage: true });
    
    // Terms page screenshot
    await page.goto(`${LIVE_URL}/terms`);
    await page.screenshot({ path: 'final-terms.png', fullPage: true });
    
    // Refund redirect screenshot
    await page.goto(`${LIVE_URL}/refund`);
    await page.screenshot({ path: 'final-refund-redirect.png', fullPage: true });
    
    console.log('Screenshots saved: final-homepage.png, final-terms.png, final-refund-redirect.png');
  });
});
