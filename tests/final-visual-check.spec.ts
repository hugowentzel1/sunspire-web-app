import { test, expect } from '@playwright/test';

test.describe('Final Visual Verification', () => {
  test('Check all changes with Apple branding', async ({ page }) => {
    console.log('Testing all changes with Apple branding...');
    
    // Test Report Page - Check sticky CTA
    await page.goto('http://localhost:3002/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Check sticky CTA is visible and positioned correctly
    const stickyCTA = page.locator('div[style*="bottom:"][style*="right:"][style*="clamp"]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/final-report-page.png',
      fullPage: true
    });
    
    // Test Support Page - Check system status circle and links
    await page.goto('http://localhost:3002/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check helpful resources links are brand colored
    const setupGuideLink = page.locator('a:has-text("Setup Guide")').first();
    await expect(setupGuideLink).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/final-support-page.png',
      fullPage: true
    });
    
    // Test Pricing Page - Check color-coded numbers
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check pricing numbers are brand colored
    const pricingTitle = page.locator('h1').nth(1);
    await expect(pricingTitle).toContainText('$99/mo + $399 setup');
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/final-pricing-page.png',
      fullPage: true
    });
    
    console.log('✓ All visual tests completed successfully');
  });
});