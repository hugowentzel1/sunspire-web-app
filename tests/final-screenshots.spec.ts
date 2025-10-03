import { test, expect } from '@playwright/test';

test.describe('Simple Visual Check', () => {
  test('Take screenshots to verify changes', async ({ page }) => {
    console.log('Taking screenshots to verify all changes...');
    
    // Test Support Page
    await page.goto('http://localhost:3002/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/support-page-final.png',
      fullPage: true
    });
    
    // Test Partners Page
    await page.goto('http://localhost:3002/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/partners-page-final.png',
      fullPage: true
    });
    
    // Test Pricing Page
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-page-final.png',
      fullPage: true
    });
    
    // Test Report Page
    await page.goto('http://localhost:3002/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/report-page-final.png',
      fullPage: true
    });
    
    console.log('✓ All screenshots taken successfully');
  });
});
