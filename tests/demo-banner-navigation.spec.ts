import { test, expect } from '@playwright/test';

test.describe('Demo Banner and Navigation Tests', () => {
  const demoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
  const paidUrl = 'https://sunspire-web-app.vercel.app/paid?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com';

  test('Demo banner shows on main pages but not legal pages', async ({ page }) => {
    // Test main page - should have demo banner
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that demo banner is present on main page
    const demoBanner = page.locator('text=Exclusive preview built for Apple');
    await expect(demoBanner).toBeVisible();
    
    // Test pricing page - should have demo banner
    await page.goto(`${demoUrl}&page=pricing`);
    await page.waitForLoadState('networkidle');
    
    // Navigate to pricing page using nav link
    await page.goto(demoUrl);
    await page.click('text=Pricing');
    await page.waitForLoadState('networkidle');
    
    // Check that demo banner is present on pricing page
    const pricingBanner = page.locator('text=Exclusive preview built for Apple');
    await expect(pricingBanner).toBeVisible();
    
    // Test privacy page - should NOT have demo banner
    await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that demo banner is NOT present on privacy page
    const privacyBanner = page.locator('text=Exclusive preview built for Apple');
    await expect(privacyBanner).not.toBeVisible();
    
    // Test terms page - should NOT have demo banner
    await page.goto('https://sunspire-web-app.vercel.app/terms?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that demo banner is NOT present on terms page
    const termsBanner = page.locator('text=Exclusive preview built for Apple');
    await expect(termsBanner).not.toBeVisible();
  });

  test('Navigation preserves URL parameters correctly', async ({ page }) => {
    // Start on demo page
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
    // Click on company logo/name to go home
    await page.click('text=Apple');
    await page.waitForLoadState('networkidle');
    
    // Verify URL still has demo parameters
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
    
    // Navigate to pricing
    await page.click('text=Pricing');
    await page.waitForLoadState('networkidle');
    
    // Verify URL still has demo parameters
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
    expect(page.url()).toContain('/pricing');
    
    // Navigate to partners
    await page.click('text=Partners');
    await page.waitForLoadState('networkidle');
    
    // Verify URL still has demo parameters
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
    expect(page.url()).toContain('/partners');
    
    // Navigate to support
    await page.click('text=Support');
    await page.waitForLoadState('networkidle');
    
    // Verify URL still has demo parameters
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
    expect(page.url()).toContain('/support');
  });

  test('Demo link removed from footer on all pages', async ({ page }) => {
    // Test main page footer
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that demo link is NOT in footer
    const footerDemoLink = page.locator('footer a[href="/demo"]');
    await expect(footerDemoLink).not.toBeVisible();
    
    // Test pricing page footer
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that demo link is NOT in footer
    const pricingFooterDemoLink = page.locator('footer a[href="/demo"]');
    await expect(pricingFooterDemoLink).not.toBeVisible();
    
    // Test privacy page footer
    await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that demo link is NOT in footer
    const privacyFooterDemoLink = page.locator('footer a[href="/demo"]');
    await expect(privacyFooterDemoLink).not.toBeVisible();
  });

  test('Paid version works correctly with logo in footer', async ({ page }) => {
    await page.goto(paidUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that company name appears in footer
    const companyName = page.locator('text=SolarPro Energy');
    await expect(companyName).toBeVisible();
    
    // Check that logo appears in footer
    const logo = page.locator('footer img[alt="SolarPro Energy logo"]');
    await expect(logo).toBeVisible();
  });
});
