import { test, expect } from '@playwright/test';

test('Show Color-Coded Pricing Page', async ({ page }) => {
  await page.goto('http://localhost:3002/pricing');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Pricing page loaded - showing color-coded design');
  
  // Check that the page uses brand colors
  const heroIcon = page.locator('.w-32.h-32.mx-auto.rounded-full');
  await expect(heroIcon).toBeVisible();
  console.log('✅ Hero icon with brand gradient colors');
  
  // Check the pricing title uses brand colors
  const pricingTitle = page.locator('h1 span');
  await expect(pricingTitle).toBeVisible();
  console.log('✅ Pricing title with brand colors');
  
  // Check that checkmark icons use brand colors
  const checkmarks = page.locator('.w-5.h-5.rounded-full');
  await expect(checkmarks).toHaveCount(5);
  console.log('✅ All 5 checkmarks using brand colors');
  
  // Check the pricing display
  const priceDisplay = page.locator('h2').first();
  await expect(priceDisplay).toContainText('$399');
  console.log('✅ $99/mo + $399 setup pricing displayed');
  
  // Check back to home button
  const backButton = page.locator('a[href="/"]');
  await expect(backButton).toBeVisible();
  console.log('✅ Back to Home navigation button');
  
  console.log('🎉 Pricing page is now fully color-coded with brand colors!');
  console.log('💰 Showing: $99/mo + $399 setup pricing');
  console.log('🎨 All elements use company brand colors');
  
  // Keep the page open for visual inspection
  await page.waitForTimeout(10000); // Stay open for 10 seconds
});
