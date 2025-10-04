import { test, expect } from '@playwright/test';

test.describe('Visual Check Live Site Changes', () => {
  test('Take screenshots to verify changes', async ({ page }) => {
    console.log('Taking screenshots to verify changes...');
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-partners-final.png',
      fullPage: true
    });
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-support-final.png',
      fullPage: true
    });
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-pricing-final.png',
      fullPage: true
    });
    
    // Test Report Page - Sticky CTA
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Apple&demo=1');
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
    
    console.log('✓ All screenshots taken');
  });
});