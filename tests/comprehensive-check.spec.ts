import { test, expect } from '@playwright/test';

test.describe('Comprehensive Site Check', () => {
  test('should have complete functionality across all pages', async ({ page }) => {
    console.log('🚀 Starting comprehensive site check...');
    
    // 1. Check main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenSolar&primary=%2316A34A');
    await page.waitForLoadState('networkidle');
    
    // Check navigation (should be single, not duplicate)
    const pricingLinks = page.locator('text=Pricing');
    const partnersLinks = page.locator('text=Partners');
    const supportLinks = page.locator('text=Support');
    
    await expect(pricingLinks).toHaveCount(1);
    await expect(partnersLinks).toHaveCount(1);
    await expect(supportLinks).toHaveCount(1);
    
    console.log('✅ Main page: Single navigation (no duplicates)');
    
    // Check all three feature cards
    await expect(page.locator('text=Advanced Analytics')).toBeVisible();
    await expect(page.locator('text=Premium Network')).toBeVisible();
    await expect(page.locator('text=Enterprise Security')).toBeVisible();
    
    console.log('✅ Main page: All three feature cards visible');
    
    // 2. Check pricing page
    await page.click('text=Pricing');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/pricing/);
    
    // Check pricing content
    await expect(page.locator('text=Simple, Transparent Pricing')).toBeVisible();
    await expect(page.locator('text=$399')).toBeVisible();
    await expect(page.locator('text=$99')).toBeVisible();
    
    // Check navigation still visible (single instance)
    await expect(pricingLinks).toHaveCount(1);
    await expect(partnersLinks).toHaveCount(1);
    await expect(supportLinks).toHaveCount(1);
    
    console.log('✅ Pricing page: Content and single navigation');
    
    // 3. Check partners page
    await page.click('text=Partners');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/partners/);
    
    // Check partners content
    await expect(page.locator('text=Partner with Sunspire')).toBeVisible();
    await expect(page.locator('text=30% recurring commission')).toBeVisible();
    
    // Check navigation still visible (single instance)
    await expect(pricingLinks).toHaveCount(1);
    await expect(partnersLinks).toHaveCount(1);
    await expect(supportLinks).toHaveCount(1);
    
    console.log('✅ Partners page: Content and single navigation');
    
    // 4. Check support page
    await page.click('text=Support');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/support/);
    
    // Check support content
    await expect(page.locator('text=Support Center')).toBeVisible();
    await expect(page.locator('text=Create Support Ticket')).toBeVisible();
    
    // Check navigation still visible (single instance)
    await expect(pricingLinks).toHaveCount(1);
    await expect(partnersLinks).toHaveCount(1);
    await expect(supportLinks).toHaveCount(1);
    
    console.log('✅ Support page: Content and single navigation');
    
    // 5. Check demo result page
    await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=GreenSolar&primary=%2316A34A');
    await page.waitForLoadState('networkidle');
    
    // Check demo content
    await expect(page.locator('text=Solar Intelligence Report')).toBeVisible();
    
    // Check navigation still visible (single instance)
    await expect(pricingLinks).toHaveCount(1);
    await expect(partnersLinks).toHaveCount(1);
    await expect(supportLinks).toHaveCount(1);
    
    console.log('✅ Demo result page: Content and single navigation');
    
    // 6. Check report page
    await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
    await page.waitForLoadState('networkidle');
    
    // Check report content
    await expect(page.locator('text=Solar Intelligence Report')).toBeVisible();
    
    // Check navigation still visible (single instance)
    await expect(pricingLinks).toHaveCount(1);
    await expect(partnersLinks).toHaveCount(1);
    await expect(supportLinks).toHaveCount(1);
    
    console.log('✅ Report page: Content and single navigation');
    
    // 7. Test navigation from any page
    await page.click('text=Pricing');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/pricing/);
    
    await page.click('text=Partners');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/partners/);
    
    await page.click('text=Support');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/support/);
    
    console.log('✅ Navigation working perfectly from any page');
    
    console.log('🎉 COMPREHENSIVE CHECK COMPLETE! All functionality working perfectly!');
  });
});
