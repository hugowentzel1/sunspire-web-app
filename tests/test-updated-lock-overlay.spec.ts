import { test, expect } from '@playwright/test';

test('Test updated LockOverlay - single CTA button and no duplicate text', async ({ page }) => {
  console.log('🔍 Testing updated LockOverlay...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.clear());
  
  // Exhaust demo quota to trigger lock overlay
  for (let i = 0; i < 3; i++) {
    await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  }
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked');
  await expect(lockOverlay).toBeVisible();
  console.log('✅ Lock overlay visible');
  
  // Check that there's only one CTA button
  const ctaButtons = page.locator('button:has-text("Activate")');
  const buttonCount = await ctaButtons.count();
  console.log('🔘 CTA button count:', buttonCount);
  expect(buttonCount).toBe(1);
  console.log('✅ Only one CTA button present');
  
  // Check that there's no "Launch Your Solar Tool" button
  const launchButton = page.locator('button:has-text("Launch Your Solar Tool")');
  const launchButtonCount = await launchButton.count();
  console.log('🚀 Launch button count:', launchButtonCount);
  expect(launchButtonCount).toBe(0);
  console.log('✅ No "Launch Your Solar Tool" button');
  
  // Check that pricing text appears only once
  const pricingText = page.locator('text=Most tools cost $2,500+/mo');
  const pricingCount = await pricingText.count();
  console.log('💰 Pricing text count:', pricingCount);
  expect(pricingCount).toBe(1);
  console.log('✅ Pricing text appears only once');
  
  // Test CTA button functionality
  console.log('🔘 Testing CTA button click...');
  
  const ctaButton = ctaButtons.first();
  await expect(ctaButton).toBeVisible();
  
  // Listen for Stripe requests
  const stripeRequests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('stripe')) {
      stripeRequests.push(request.url());
    }
  });
  
  // Click the CTA button
  await ctaButton.click();
  
  // Wait for any redirects
  await page.waitForTimeout(3000);
  
  // Check if we were redirected to Stripe
  const currentUrl = page.url();
  console.log('🔗 Current URL:', currentUrl);
  
  if (currentUrl.includes('checkout.stripe.com')) {
    console.log('✅ Successfully redirected to Stripe checkout!');
  } else {
    console.log('❌ Not redirected to Stripe checkout');
  }
  
  // Check if Stripe API was called
  if (stripeRequests.length > 0) {
    console.log('✅ Stripe API called successfully');
  } else {
    console.log('❌ No Stripe requests made');
  }
  
  console.log('🎉 Updated LockOverlay test complete!');
});
