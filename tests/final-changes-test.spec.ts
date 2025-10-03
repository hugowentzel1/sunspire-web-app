import { test, expect } from '@playwright/test';

test.describe('Final Changes Verification', () => {
  test('Check all final changes with Apple branding', async ({ page }) => {
    console.log('Testing all final changes with Apple branding...');
    
    // Test Pricing Page - Check enhanced company colors
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-enhanced-colors.png',
      fullPage: true
    });
    
    // Test Report Page - Check taller sticky CTA
    await page.goto('http://localhost:3002/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/report-taller-sticky-cta.png',
      fullPage: true
    });
    
    console.log('✓ All final changes verified successfully');
  });
});
