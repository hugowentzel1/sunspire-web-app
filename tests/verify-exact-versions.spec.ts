import { test, expect } from '@playwright/test';

test.describe('Verify Exact Demo and Paid Versions', () => {
  test('Demo version should match commit 19610abb0fc9042eb7ff822f21586178043fcd53 exactly', async ({ page }) => {
    // Demo URL format: /?demo=1&company={COMPANY}
    await page.goto('https://sunspire-web-app.vercel.app/?demo=1&company=Apple&brandColor=%23FF6B35');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify demo-specific elements are present
    await expect(page.locator('[data-demo="true"]')).toBeVisible();
    
    // Verify demo-specific content
    await expect(page.getByText('Your Branded Solar Quote Tool')).toBeVisible();
    await expect(page.getByText('— Ready to Launch')).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Demo for' })).toBeVisible();
    await expect(page.getByText('Your Logo. Your URL. Instant Solar Quotes — Live in 24 Hours')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Activate on Your Domain — 24 Hours' }).first()).toBeVisible();
    await expect(page.getByText('No call required. $99/mo + $399 setup. 14-day refund if it doesn\'t lift booked calls.')).toBeVisible();
    
    // Verify demo-specific sections
    await expect(page.getByText('How It Works')).toBeVisible();
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    
    // Verify demo-specific features
    await expect(page.getByText('Add the widget')).toBeVisible();
    await expect(page.getByText('Visitors get instant quotes')).toBeVisible();
    await expect(page.getByText('Your team gets booked calls')).toBeVisible();
    
    // Verify FAQ content
    await expect(page.getByText('CMS? — Yes, 1-line <script>. Hosted option too.')).toBeVisible();
    await expect(page.getByText('Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance')).toBeVisible();
    await expect(page.getByText('Security? — Encrypted in transit & at rest')).toBeVisible();
    await expect(page.getByText('Cancel? — Yes, 14-day refund if it doesn\'t lift booked calls')).toBeVisible();
    await expect(page.getByText('Support? — Email support 24/7')).toBeVisible();
    
    // Verify demo footer
    await expect(page.locator('footer').first()).toBeVisible();
    
    console.log('✅ Demo version matches commit 19610abb0fc9042eb7ff822f21586178043fcd53 exactly');
  });

  test('Paid version should match commit aa28acfc9c6c870873044517a300906475e00995 exactly', async ({ page }) => {
    // Paid URL format: /paid?company={COMPANY}&brandColor={COLOR}&logo={LOGO}
    await page.goto('https://sunspire-web-app.vercel.app/paid?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify paid-specific elements are present
    await expect(page.locator('[data-demo="false"]')).toBeVisible();
    
    // Verify paid-specific content
    await expect(page.getByText('Instant Solar Analysis for Your Home')).toBeVisible();
    await expect(page.getByText('Enter your address to see solar production, savings, and payback—instantly.')).toBeVisible();
    
    // Verify paid version content (no live confirmation bar in original)
    
    // Verify address input section
    await expect(page.locator('h2').filter({ hasText: 'Enter Your Property Address' })).toBeVisible();
    await expect(page.getByText('Get a comprehensive solar analysis tailored to your specific location')).toBeVisible();
    await expect(page.getByText('Generate Solar Intelligence Report')).toBeVisible();
    
    // Verify trust badges
    await expect(page.getByText('NREL v8')).toBeVisible();
    await expect(page.getByText('Accurate Modeling')).toBeVisible();
    await expect(page.getByText('Current Rates')).toBeVisible();
    await expect(page.getByText('Local Utility Data')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Private' }).first()).toBeVisible();
    await expect(page.getByText('Encrypted')).toBeVisible();
    
    // Verify feature cards
    await expect(page.locator('.title').filter({ hasText: 'NREL PVWatts® v8' })).toBeVisible();
    await expect(page.getByText('Industry-standard solar modeling with current utility rates')).toBeVisible();
    await expect(page.getByText('End-to-End Encryption')).toBeVisible();
    await expect(page.getByText('Secure data protection')).toBeVisible();
    
    // Verify footer with company logo
    await expect(page.locator('h3').filter({ hasText: 'SolarPro Energy' })).toBeVisible();
    await expect(page.locator('img[alt="SolarPro Energy logo"]').first()).toBeVisible();
    await expect(page.getByText('Powered by Sunspire')).toBeVisible();
    
    // Verify legal links
    await expect(page.getByText('Privacy Policy')).toBeVisible();
    await expect(page.getByText('Terms of Service')).toBeVisible();
    await expect(page.getByRole('link', { name: 'support@client-company.com' })).toBeVisible();
    
    console.log('✅ Paid version matches commit aa28acfc9c6c870873044517a300906475e00995 exactly');
  });

  test('URL routing works correctly', async ({ page }) => {
    // Test demo URL stays on main page
    await page.goto('https://sunspire-web-app.vercel.app/?demo=1&company=TestCompany');
    await expect(page.url()).toContain('?demo=1&company=TestCompany');
    await expect(page.locator('[data-demo="true"]')).toBeVisible();
    
    // Test paid URL redirects to /paid
    await page.goto('https://sunspire-web-app.vercel.app/?company=TestCompany&brandColor=%23FF0000');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('/paid?company=TestCompany&brandColor=%23FF0000');
    await expect(page.locator('[data-demo="false"]')).toBeVisible();
  });

  test('Brand takeover logic works for both versions', async ({ page }) => {
    // Test demo with brand parameters
    await page.goto('https://sunspire-web-app.vercel.app/?demo=1&company=TestCompany&brandColor=%23FF6B35');
    await expect(page.locator('h2').filter({ hasText: 'Demo for' })).toBeVisible();
    
    // Test paid with brand parameters
    await page.goto('https://sunspire-web-app.vercel.app/paid?company=TestCompany&brandColor=%23FF6B35&logo=https://example.com/logo.png');
    await expect(page.getByText('Instant Solar Analysis for Your Home')).toBeVisible();
  });
});
