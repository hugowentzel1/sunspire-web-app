import { test, expect } from '@playwright/test';

test.describe('Quick Navigation Check', () => {
  test('navigation should work across all pages', async ({ page }) => {
    // Start on main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenSolar&primary=%2316A34A');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Main page loaded');
    
    // Check navigation is visible
    await expect(page.locator('nav a[href="/pricing"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="/partners"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="/support"]').first()).toBeVisible();
    
    console.log('✅ Navigation visible on main page');
    
    // Click Pricing
    await page.click('nav a[href="/pricing"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/pricing/);
    await expect(page.locator('text=Simple, Transparent Pricing')).toBeVisible();
    
    console.log('✅ Pricing page loaded with navigation');
    
    // Click Partners
    await page.click('nav a[href="/partners"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/partners/);
    await expect(page.locator('text=Partner with Sunspire')).toBeVisible();
    
    console.log('✅ Partners page loaded with navigation');
    
    // Click Support
    await page.click('nav a[href="/support"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/support/);
    await expect(page.locator('text=Support Center')).toBeVisible();
    
    console.log('✅ Support page loaded with navigation');
    
    // Go back to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenSolar&primary=%2316A34A');
    await page.waitForLoadState('networkidle');
    
    // Check all three feature cards are visible
    await expect(page.locator('text=Advanced Analytics')).toBeVisible();
    await expect(page.locator('text=Premium Network')).toBeVisible();
    await expect(page.locator('text=Enterprise Security')).toBeVisible();
    
    console.log('✅ All three feature cards visible');
    
    console.log('🎉 Navigation working perfectly across all pages!');
  });
});
