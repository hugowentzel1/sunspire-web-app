import { test, expect } from '@playwright/test';

test.describe('Visual Changes Verification', () => {
  test('Take screenshots to verify all changes', async ({ page }) => {
    console.log('Taking screenshots to verify changes...');
    
    // Test Partners Page - should have company colored earnings text
    await page.goto('http://localhost:3003/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: 'test-results/partners-company-colors.png',
      fullPage: true
    });
    
    // Test Support Page - helpful resources should be company colored
    await page.goto('http://localhost:3003/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: 'test-results/support-helpful-resources.png',
      fullPage: true
    });
    
    // Test Pricing Page - hero text should be grey
    await page.goto('http://localhost:3003/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: 'test-results/pricing-hero-grey.png',
      fullPage: true
    });
    
    console.log('✓ All screenshots taken for verification');
  });
});
