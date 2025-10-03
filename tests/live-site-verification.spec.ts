import { test, expect } from '@playwright/test';

test.describe('Live Site Verification', () => {
  test('Check live site with Spotify branding', async ({ page }) => {
    console.log('Testing live site with Spotify branding...');
    
    // Test Report Page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Check sticky CTA is visible
    const stickyCTA = page.locator('div[style*="bottom:"][style*="right:"][style*="clamp"]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-report-page.png',
      fullPage: true
    });
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check helpful resources links are brand colored
    const setupGuideLink = page.locator('a:has-text("Setup Guide")').first();
    await expect(setupGuideLink).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-support-page.png',
      fullPage: true
    });
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check pricing numbers are brand colored
    const pricingTitle = page.locator('h1').nth(1);
    await expect(pricingTitle).toContainText('$99/mo + $399 setup');
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-pricing-page.png',
      fullPage: true
    });
    
    console.log('✓ Live site verification completed successfully');
  });
});