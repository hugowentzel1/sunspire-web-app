import { test, expect } from '@playwright/test';

test.describe('Live Site Verification', () => {
  test('Verify changes on live demo site', async ({ page }) => {
    console.log('Testing live site changes...');
    
    // Test Partners Page - should have company colored earnings text
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: 'test-results/live-partners-company-colors.png',
      fullPage: true
    });
    
    // Test Support Page - helpful resources should be company colored
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: 'test-results/live-support-helpful-resources.png',
      fullPage: true
    });
    
    // Test Pricing Page - hero text should be grey
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: 'test-results/live-pricing-hero-grey.png',
      fullPage: true
    });
    
    console.log('✓ Live site screenshots taken');
  });
});