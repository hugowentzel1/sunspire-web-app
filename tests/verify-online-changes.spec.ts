import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Verify Online Changes', () => {
  test('Homepage with Apple branding loads correctly', async ({ page }) => {
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`, { waitUntil: 'networkidle' });
    
    // Check Apple branding
    await expect(page.getByText('Apple').first()).toBeVisible();
    await expect(page.getByText('Demo for Apple').first()).toBeVisible();
    
    // Check main CTAs are present
    const ctaButtons = page.locator('button, a').filter({ hasText: /Get Quote|Start|Try|Demo/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test('Refund page is deleted (404)', async ({ page }) => {
    const response = await page.goto(`${LIVE_URL}/refund`);
    expect(response?.status()).toBe(404);
  });

  test('Terms page has refunds section but no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/terms`);
    
    // Check refunds section exists
    await expect(page.getByText('Refunds & Guarantee')).toBeVisible();
    await expect(page.getByText('14-day pilot guarantee')).toBeVisible();
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
  });

  test('Privacy page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/privacy`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('Security page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/security`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.getByText('Security & Compliance')).toBeVisible();
  });

  test('DPA page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/dpa`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.getByText('Data Processing Agreement')).toBeVisible();
  });

  test('Do Not Sell page has no last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/do-not-sell`);
    
    // Check no "last updated" text
    const lastUpdatedText = page.getByText(/Last updated/i);
    await expect(lastUpdatedText).toHaveCount(0);
    
    // Check page loads correctly
    await expect(page.getByText('Do Not Sell My Data')).toBeVisible();
  });

  test('Footer no longer has refunds link', async ({ page }) => {
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    
    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check refunds link is not present
    const refundsLink = page.getByRole('link', { name: 'Refunds' });
    await expect(refundsLink).toHaveCount(0);
    
    // Check other legal links are still present
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
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
    }
  });

  test('Domain onboarding still works', async ({ page }) => {
    await page.goto(`${LIVE_URL}/onboard/domain?tenant=Apple&companyWebsite=apple.com`);
    
    // Verify domain setup elements
    await expect(page.getByText('Connect your custom domain')).toBeVisible();
    await expect(page.getByText('quote.apple.com')).toBeVisible();
    await expect(page.getByText('cname.vercel-dns.com')).toBeVisible();
  });
});
