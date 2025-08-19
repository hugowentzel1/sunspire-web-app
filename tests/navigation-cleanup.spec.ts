import { test, expect } from '@playwright/test';

test.describe('Navigation Cleanup Verification', () => {
  test('should have clean navigation without Enterprise/Partners/Support buttons', async ({ page }) => {
    // Test with GreenFuture branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenFuture&primary=%2316A34A');
    
    await page.waitForLoadState('networkidle');
    
    // Check that Enterprise button is NOT visible
    const enterpriseButton = page.locator('text=Enterprise');
    await expect(enterpriseButton).toHaveCount(0);
    
    // Check that Partners button is NOT visible
    const partnersButton = page.locator('text=Partners');
    await expect(partnersButton).toHaveCount(0);
    
    // Check that Support button is NOT visible
    const supportButton = page.locator('text=Support');
    await expect(supportButton).toHaveCount(0);
    
    // Check that main CTA button IS visible
    const mainCTA = page.locator('text=Launch on GreenFuture');
    await expect(mainCTA).toBeVisible();
    
    // Check that only one button exists in navigation
    const navButtons = page.locator('nav button');
    await expect(navButtons).toHaveCount(1);
    
    console.log('✅ Navigation cleanup verification passed - clean interface!');
  });

  test('should work with different company branding', async ({ page }) => {
    // Test with BlueSolar branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=BlueSolar&primary=%233B82F6');
    
    await page.waitForLoadState('networkidle');
    
    // Check that navigation is clean
    const enterpriseButton = page.locator('text=Enterprise');
    await expect(enterpriseButton).toHaveCount(0);
    
    // Check that main CTA button IS visible
    const mainCTA = page.locator('text=Launch on BlueSolar');
    await expect(mainCTA).toBeVisible();
    
    console.log('✅ BlueSolar navigation cleanup verification passed!');
  });
});
