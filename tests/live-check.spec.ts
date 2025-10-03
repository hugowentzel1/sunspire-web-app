import { test, expect } from '@playwright/test';

test.describe('Live Site Check', () => {
  test('Check live site with Apple branding', async ({ page }) => {
    console.log('Testing live site with Apple branding...');
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-pricing-check.png',
      fullPage: true
    });
    
    // Test Report Page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-report-check.png',
      fullPage: true
    });
    
    console.log('✓ Live site check completed');
  });
});
