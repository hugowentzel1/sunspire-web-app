import { test, expect } from '@playwright/test';

test.describe('URL Parameter Consistency', () => {
  const demoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
  const paidUrl = 'https://sunspire-web-app.vercel.app/?company=SolarPro&brandColor=%23FF6B35&logo=https%3A//logo.clearbit.com/solarpro.com';

  test('Demo version preserves URL parameters across all pages', async ({ page }) => {
    // Test main page
    await page.goto(demoUrl);
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to pricing
    await page.click('a[href*="/pricing"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to partners
    await page.click('a[href*="/partners"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to support
    await page.click('a[href*="/support"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to privacy
    await page.click('a[href*="/privacy"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test back to home from privacy
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to terms
    await page.click('a[href*="/terms"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test back to home from terms
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to security
    await page.click('a[href*="/security"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test back to home from security
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to DPA
    await page.click('a[href*="/dpa"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test back to home from DPA
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test navigation to do-not-sell
    await page.click('a[href*="/do-not-sell"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
    
    // Test back to home from do-not-sell
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=Apple.*demo=1/);
  });

  test('Paid version preserves URL parameters across all pages', async ({ page }) => {
    // Test main page
    await page.goto(paidUrl);
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to pricing
    await page.click('a[href*="/pricing"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to partners
    await page.click('a[href*="/partners"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to support
    await page.click('a[href*="/support"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to privacy
    await page.click('a[href*="/privacy"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test back to home from privacy
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to terms
    await page.click('a[href*="/terms"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test back to home from terms
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to security
    await page.click('a[href*="/security"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test back to home from security
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to DPA
    await page.click('a[href*="/dpa"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test back to home from DPA
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test navigation to do-not-sell
    await page.click('a[href*="/do-not-sell"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
    
    // Test back to home from do-not-sell
    await page.click('a[href*="/"]');
    await expect(page).toHaveURL(/company=SolarPro.*brandColor.*logo/);
  });

  test('Demo version shows correct company name in footer across all pages', async ({ page }) => {
    const pages = ['/pricing', '/partners', '/support', '/privacy', '/terms', '/security', '/dpa', '/do-not-sell'];
    
    for (const pagePath of pages) {
      await page.goto(`${demoUrl}${pagePath}`);
      
      // Check that footer shows "Demo for Apple" (not "Sunspire")
      const footerText = await page.textContent('footer');
      expect(footerText).toContain('Demo for Apple');
    }
  });

  test('Paid version shows correct company name in footer across all pages', async ({ page }) => {
    const pages = ['/pricing', '/partners', '/support', '/privacy', '/terms', '/security', '/dpa', '/do-not-sell'];
    
    for (const pagePath of pages) {
      await page.goto(`${paidUrl}${pagePath}`);
      
      // Check that footer shows "Solar Intelligence Platform" (not "Demo for SolarPro")
      const footerText = await page.textContent('footer');
      expect(footerText).toContain('Solar Intelligence Platform');
      expect(footerText).not.toContain('Demo for');
    }
  });

  test('Demo version shows demo banner on main pages but not legal pages', async ({ page }) => {
    // Test main pages - should show demo banner
    const mainPages = ['/', '/pricing', '/partners', '/support'];
    
    for (const pagePath of mainPages) {
      await page.goto(`${demoUrl}${pagePath}`);
      
      // Check for demo banner
      const demoBanner = page.locator('text=Exclusive preview built for Apple');
      await expect(demoBanner).toBeVisible();
    }
    
    // Test legal pages - should NOT show demo banner
    const legalPages = ['/privacy', '/terms', '/security', '/dpa', '/do-not-sell'];
    
    for (const pagePath of legalPages) {
      await page.goto(`${demoUrl}${pagePath}`);
      
      // Check that demo banner is NOT visible
      const demoBanner = page.locator('text=Exclusive preview built for Apple');
      await expect(demoBanner).not.toBeVisible();
    }
  });

  test('Paid version never shows demo banner', async ({ page }) => {
    const allPages = ['/', '/pricing', '/partners', '/support', '/privacy', '/terms', '/security', '/dpa', '/do-not-sell'];
    
    for (const pagePath of allPages) {
      await page.goto(`${paidUrl}${pagePath}`);
      
      // Check that demo banner is NOT visible
      const demoBanner = page.locator('text=Exclusive preview built for');
      await expect(demoBanner).not.toBeVisible();
    }
  });
});
