import { test, expect } from '@playwright/test';

test.describe('Visual Check Live Site', () => {
  test('Take screenshots of live site', async ({ page }) => {
    console.log('Taking screenshots of live site...');
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-pricing-visual.png',
      fullPage: true
    });
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-partners-visual.png',
      fullPage: true
    });
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-support-visual.png',
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
      path: 'test-results/live-report-visual.png',
      fullPage: true
    });
    
    console.log('✓ All screenshots taken');
  });
});
