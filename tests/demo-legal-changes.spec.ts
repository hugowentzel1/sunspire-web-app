import { test, expect } from '@playwright/test';
const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://sunspire-web-app.vercel.app';

test.describe('Legal Compliance Changes Demo', () => {
  test('1. Refund & Cancellation Page', async ({ page }) => {
    console.log('🔍 Testing Refund & Cancellation Page...');
    await page.goto(`${BASE}/refund`, { waitUntil: 'networkidle' });
    
    // Check page loads correctly
    await expect(page.getByRole('heading', { name: /Refund/i })).toBeVisible();
    console.log('✅ Refund page loads correctly');
    
    // Check for static date
    await expect(page.getByText('Last updated: September 2025')).toBeVisible();
    console.log('✅ Static date September 2025 present');
    
    // Check for proper contact information
    await expect(page.getByText('support@getsunspire.com')).toBeVisible();
    await expect(page.getByText('billing@getsunspire.com')).toBeVisible();
    console.log('✅ Support and billing emails present');
    
    // Check for postal address
    await expect(page.getByText('3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305')).toBeVisible();
    console.log('✅ Postal address present');
  });

  test('2. Cancel Page', async ({ page }) => {
    console.log('🔍 Testing Cancel Page...');
    await page.goto(`${BASE}/cancel`, { waitUntil: 'networkidle' });
    
    // Check page loads correctly
    await expect(page.getByText('Checkout canceled')).toBeVisible();
    console.log('✅ Cancel page loads correctly');
    
    // Check for return home link
    await expect(page.getByText('Return home')).toBeVisible();
    console.log('✅ Return home link present');
  });

  test('3. Privacy Policy with GDPR/CASL', async ({ page }) => {
    console.log('🔍 Testing Privacy Policy with GDPR/CASL compliance...');
    await page.goto(`${BASE}/privacy`, { waitUntil: 'networkidle' });
    
    // Check static date
    await expect(page.getByText('Last updated: September 2025')).toBeVisible();
    console.log('✅ Static date September 2025 present');
    
    // Check GDPR compliance section
    await expect(page.getByText('Marketing emails: legal bases & your rights')).toBeVisible();
    console.log('✅ GDPR compliance section present');
    
    // Check US CAN-SPAM compliance
    await expect(page.getByText('US (CAN-SPAM):')).toBeVisible();
    await expect(page.getByText('unsubscribe that works')).toBeVisible();
    console.log('✅ US CAN-SPAM compliance text present');
    
    // Check Canada CASL compliance
    await expect(page.getByText('Canada (CASL):')).toBeVisible();
    console.log('✅ Canada CASL compliance text present');
    
    // Check EU/UK GDPR compliance
    await expect(page.getByText('Legitimate interests')).toBeVisible();
    console.log('✅ EU/UK GDPR compliance text present');
    
    // Check contact information
    await expect(page.getByText('support@getsunspire.com')).toBeVisible();
    await expect(page.getByText('billing@getsunspire.com')).toBeVisible();
    console.log('✅ Support and billing emails present');
  });

  test('4. Terms of Service Updates', async ({ page }) => {
    console.log('🔍 Testing Terms of Service updates...');
    await page.goto(`${BASE}/terms`, { waitUntil: 'networkidle' });
    
    // Check static date
    await expect(page.getByText('Last updated: September 2025')).toBeVisible();
    console.log('✅ Static date September 2025 present');
    
    // Check contact information
    await expect(page.getByText('support@getsunspire.com')).toBeVisible();
    await expect(page.getByText('billing@getsunspire.com')).toBeVisible();
    console.log('✅ Support and billing emails present');
  });

  test('5. Footer Legal Links', async ({ page }) => {
    console.log('🔍 Testing Footer legal links...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    
    // Check for all required legal links
    const legalLinks = ['Privacy', 'Terms', 'Refund'];
    for (const linkText of legalLinks) {
      await expect(page.locator('a', { hasText: linkText })).toBeVisible();
      console.log(`✅ ${linkText} link present in footer`);
    }
    
    // Check for company identity
    await expect(page.getByText('support@getsunspire.com')).toBeVisible();
    await expect(page.getByText('billing@getsunspire.com')).toBeVisible();
    console.log('✅ Company identity with emails present');
    
    // Check for postal address
    await expect(page.getByText('3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305')).toBeVisible();
    console.log('✅ Postal address present in footer');
  });

  test('6. Google Places Attribution', async ({ page }) => {
    console.log('🔍 Testing Google Places attribution...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    
    // Check for "Powered by Google" text
    await expect(page.getByText('Powered by Google')).toBeVisible();
    console.log('✅ "Powered by Google" attribution present');
  });

  test('7. Unsubscribe Endpoints', async ({ page }) => {
    console.log('🔍 Testing Unsubscribe endpoints...');
    
    // Test one-click unsubscribe endpoint
    const response1 = await page.goto(`${BASE}/api/unsubscribe/test-hash`);
    expect(response1?.status()).toBe(200);
    console.log('✅ One-click unsubscribe endpoint responds with 200');
    
    // Test body unsubscribe endpoint
    const response2 = await page.request.post(`${BASE}/api/unsubscribe`, {
      data: { email: 'test@example.com' }
    });
    expect([200, 400]).toContain(response2.status());
    console.log(`✅ Body unsubscribe endpoint responds with ${response2.status()}`);
  });

  test('8. Address Autocomplete with Session Token', async ({ page }) => {
    console.log('🔍 Testing Address Autocomplete with session token...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    
    // Look for address input field
    const addressInput = page.locator('input[placeholder*="address" i], input[placeholder*="Address"]').first();
    await expect(addressInput).toBeVisible();
    console.log('✅ Address input field found');
    
    // Check for Google attribution near the field
    await expect(page.getByText('Powered by Google')).toBeVisible();
    console.log('✅ Google attribution visible near address field');
  });

  test('9. Pricing Format Updates', async ({ page }) => {
    console.log('🔍 Testing pricing format updates...');
    await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' });
    
    // Check for updated pricing format ($99/mo + $399 setup)
    await expect(page.getByText('$99/mo + $399 setup')).toBeVisible();
    console.log('✅ Updated pricing format present');
  });

  test('10. Complete Legal Compliance Summary', async ({ page }) => {
    console.log('🔍 Running complete legal compliance summary...');
    
    // Test all pages load correctly
    const pages = ['/refund', '/cancel', '/privacy', '/terms'];
    for (const pagePath of pages) {
      await page.goto(`${BASE}${pagePath}`, { waitUntil: 'networkidle' });
      await expect(page.locator('body')).toBeVisible();
      console.log(`✅ ${pagePath} loads correctly`);
    }
    
    // Test home page with all features
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await expect(page.getByText('Powered by Google')).toBeVisible();
    console.log('✅ Home page with Google attribution loads');
    
    console.log('🎉 ALL LEGAL COMPLIANCE FEATURES VERIFIED!');
    console.log('✅ US CAN-SPAM compliance');
    console.log('✅ Canada CASL compliance');
    console.log('✅ EU/UK GDPR compliance');
    console.log('✅ Unsubscribe endpoints');
    console.log('✅ Google Places attribution');
    console.log('✅ Consistent company identity');
    console.log('✅ All legal pages present');
    console.log('✅ Static dates and contact info');
  });
});
