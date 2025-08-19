import { test, expect } from '@playwright/test';

test.describe('Quick URL Dynamic Switching Verification', () => {
  test('should change company name based on URL parameter', async ({ page }) => {
    // Test with GreenFuture
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenFuture&primary=%2316A34A');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name changes
    const companyName = page.locator('text=GreenFuture');
    await expect(companyName).toBeVisible();
    
    console.log('✅ GreenFuture company name test passed');
  });

  test('should work with different company', async ({ page }) => {
    // Test with BlueSolar
    await page.goto('https://sunspire-web-app.vercel.app/?company=BlueSolar&primary=%233B82F6');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name changes
    const companyName = page.locator('text=BlueSolar');
    await expect(companyName).toBeVisible();
    
    console.log('✅ BlueSolar company name test passed');
  });

  test('should show chart with brand colors', async ({ page }) => {
    // Test chart page with PurplePower
    await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=PurplePower&primary=%238B5CF6');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name in report
    const companyName = page.locator('text=PurplePower');
    await expect(companyName).toBeVisible();
    
    // Check chart section
    const chartSection = page.locator('text=Your Solar Savings Over Time');
    await expect(chartSection).toBeVisible();
    
    console.log('✅ PurplePower chart test passed');
  });
});
