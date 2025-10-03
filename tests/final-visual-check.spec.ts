import { test, expect } from '@playwright/test';

test.describe('Visual Verification of All Changes', () => {
  test('Take screenshots to verify all changes', async ({ page }) => {
    console.log('Taking screenshots to verify all changes...');
    
    // Test Partners Page
    await page.goto('http://localhost:3002/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/partners-final-check.png',
      fullPage: true
    });
    
    // Test Pricing Page
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-final-check.png',
      fullPage: true
    });
    
    // Test Support Page
    await page.goto('http://localhost:3002/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/support-final-check.png',
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
      path: 'test-results/report-final-check.png',
      fullPage: true
    });
    
    console.log('✓ All screenshots taken successfully');
  });
});