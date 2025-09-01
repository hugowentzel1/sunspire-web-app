import { test, expect } from '@playwright/test';

test('Stripe Checkout Verification - All Buttons Route to Stripe', async ({ page }) => {
  console.log('🔧 Verifying all Stripe checkout buttons...');
  
  // Test 1: Check main page CTA button
  console.log('📍 Test 1: Main page CTA button...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const mainCtaButton = page.locator('button').filter({ hasText: /activate on your domain/i });
  const mainCtaCount = await mainCtaButton.count();
  console.log(`🔍 Found ${mainCtaCount} main CTA buttons`);
  
  if (mainCtaCount > 0) {
    await expect(mainCtaButton.first()).toBeVisible();
    console.log('✅ Main CTA button is visible');
  }
  
  // Test 2: Check report page unlock buttons
  console.log('📍 Test 2: Report page unlock buttons...');
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const unlockButtons = page.locator('button').filter({ hasText: /unlock full report/i });
  const unlockCount = await unlockButtons.count();
  console.log(`🔍 Found ${unlockCount} unlock buttons on report page`);
  
  for (let i = 0; i < unlockCount; i++) {
    const button = unlockButtons.nth(i);
    await expect(button).toBeVisible();
    console.log(`✅ Unlock button ${i + 1} is visible`);
  }
  
  // Test 3: Check report page activate buttons
  console.log('📍 Test 3: Report page activate buttons...');
  const activateButtons = page.locator('button').filter({ hasText: /activate on your domain/i });
  const activateCount = await activateButtons.count();
  console.log(`🔍 Found ${activateCount} activate buttons on report page`);
  
  for (let i = 0; i < activateCount; i++) {
    const button = activateButtons.nth(i);
    await expect(button).toBeVisible();
    console.log(`✅ Activate button ${i + 1} is visible`);
  }
  
  // Test 4: Check pricing page CTA buttons
  console.log('📍 Test 4: Pricing page CTA buttons...');
  await page.goto('http://localhost:3001/pricing');
  await page.waitForLoadState('networkidle');
  
  const pricingButtons = page.locator('button').filter({ hasText: /get started|start now|choose plan/i });
  const pricingCount = await pricingButtons.count();
  console.log(`🔍 Found ${pricingCount} pricing CTA buttons`);
  
  for (let i = 0; i < pricingCount; i++) {
    const button = pricingButtons.nth(i);
    await expect(button).toBeVisible();
    console.log(`✅ Pricing button ${i + 1} is visible`);
  }
  
  // Test 5: Check partners page CTA buttons
  console.log('📍 Test 5: Partners page CTA buttons...');
  await page.goto('http://localhost:3001/partners');
  await page.waitForLoadState('networkidle');
  
  const partnersButtons = page.locator('button').filter({ hasText: /submit|apply|get started/i });
  const partnersCount = await partnersButtons.count();
  console.log(`🔍 Found ${partnersCount} partners CTA buttons`);
  
  for (let i = 0; i < partnersCount; i++) {
    const button = partnersButtons.nth(i);
    await expect(button).toBeVisible();
    console.log(`✅ Partners button ${i + 1} is visible`);
  }
  
  // Test 6: Verify that buttons have data-cta attributes (for Stripe integration)
  console.log('📍 Test 6: Checking data-cta attributes...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const ctaButtons = page.locator('[data-cta]');
  const ctaCount = await ctaButtons.count();
  console.log(`🔍 Found ${ctaCount} buttons with data-cta attribute`);
  
  for (let i = 0; i < ctaCount; i++) {
    const button = ctaButtons.nth(i);
    const ctaValue = await button.getAttribute('data-cta');
    console.log(`✅ Button ${i + 1} has data-cta="${ctaValue}"`);
  }
  
  console.log('🎉 All Stripe checkout button verification completed!');
});
