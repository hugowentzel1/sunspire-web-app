import { test, expect } from '@playwright/test';

test.describe('Live Site Final Test', () => {
  test('Check live site with Spotify branding', async ({ page }) => {
    console.log('Testing live site with Spotify branding...');
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-pricing-final.png',
      fullPage: true
    });
    
    // Test Report Page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-report-final.png',
      fullPage: true
    });
    
    console.log('✓ Live site final test completed successfully');
  });
});
