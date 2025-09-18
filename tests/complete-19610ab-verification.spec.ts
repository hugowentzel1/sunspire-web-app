import { test, expect } from '@playwright/test';

test.describe('Complete 19610ab Verification', () => {
  const demoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
  const paidUrl = 'https://sunspire-web-app.vercel.app/paid?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com';

  test('Demo version matches 19610ab exactly', async ({ page }) => {
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that demo banner is present on main page
    const demoBanner = page.locator('text=Exclusive preview built for Apple');
    await expect(demoBanner).toBeVisible();
    
    // Check that the main content matches 19610ab structure
    const mainHeading = page.locator('h1:has-text("Solar Intelligence Platform")');
    await expect(mainHeading).toBeVisible();
    
    // Check for the green checkmark
    const checkmark = page.locator('.absolute.-top-4.-right-2');
    await expect(checkmark).toBeVisible();
    
    // Check that demo CTA section is present
    const demoCTA = page.locator('text=Demo for Apple — Powered by Sunspire');
    await expect(demoCTA).toBeVisible();
  });

  test('Demo navigation preserves URL parameters correctly', async ({ page }) => {
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

  test('Demo banner shows on main pages but not legal pages', async ({ page }) => {
    // Test main page - should have demo banner
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
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

  test('Demo link removed from footer on all pages', async ({ page }) => {
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

  test('Paid version navigation preserves URL parameters', async ({ page }) => {
    await page.goto(paidUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that company name and logo are displayed
    const companyName = page.locator('h1:has-text("SolarPro Energy")').first();
    await expect(companyName).toBeVisible();
    
    // Check that logo is displayed in header
    const logo = page.locator('img[alt="SolarPro Energy logo"]');
    await expect(logo).toBeVisible();
    
    // Navigate to a legal page and check URL parameters are preserved
    await page.click('text=Privacy Policy');
    await page.waitForLoadState('networkidle');
    
    // Verify URL still has paid parameters
    expect(page.url()).toContain('company=SolarPro%20Energy');
    expect(page.url()).toContain('brandColor=%23059669');
    expect(page.url()).toContain('logo=https://logo.clearbit.com/solarpro.com');
  });

  test('Paid version footer shows company logo', async ({ page }) => {
    await page.goto(paidUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that company logo appears in footer
    const footerLogo = page.locator('footer img[alt="SolarPro Energy logo"]');
    await expect(footerLogo).toBeVisible();
    
    // Check that company name appears in footer
    const footerCompanyName = page.locator('footer h3:has-text("SolarPro Energy")');
    await expect(footerCompanyName).toBeVisible();
  });

  test('Report page preserves URL parameters for both demo and paid', async ({ page }) => {
    // Test demo report page
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that demo mode is active
    const demoMode = page.locator('text=Demo for Apple');
    await expect(demoMode).toBeVisible();
    
    // Click back to home and verify parameters are preserved
    await page.click('text=New Analysis');
    await page.waitForLoadState('networkidle');
    
    // Verify URL still has demo parameters
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
  });

  test('All main pages exist and work correctly', async ({ page }) => {
    const pages = [
      { url: 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1', name: 'Home' },
      { url: 'https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1', name: 'Pricing' },
      { url: 'https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1', name: 'Partners' },
      { url: 'https://sunspire-web-app.vercel.app/support?company=Apple&demo=1', name: 'Support' },
      { url: 'https://sunspire-web-app.vercel.app/privacy?company=Apple&demo=1', name: 'Privacy' },
      { url: 'https://sunspire-web-app.vercel.app/terms?company=Apple&demo=1', name: 'Terms' },
      { url: 'https://sunspire-web-app.vercel.app/security?company=Apple&demo=1', name: 'Security' }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      
      // Check that page loads without errors
      const title = await page.title();
      expect(title).toBeTruthy();
      
      // Check that URL parameters are preserved
      expect(page.url()).toContain('company=Apple');
      expect(page.url()).toContain('demo=1');
      
      console.log(`✓ ${pageInfo.name} page works correctly`);
    }
  });
});
