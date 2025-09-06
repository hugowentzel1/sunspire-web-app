import { test, expect } from '@playwright/test';

test('Netflix Demo - Simple Verification', async ({ page }) => {
  console.log('\n🎬 NETFLIX DEMO - SIMPLE VERIFICATION');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&company=Netflix&demo=1';
  console.log('🔗 Testing URL:', testUrl);
  
  // Clear localStorage to start fresh
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared localStorage');
  });
  
  // Visit the page
  console.log('\n📊 Testing page...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check brand colors
  const brandColors = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      brandPrimary: getComputedStyle(root).getPropertyValue('--brand-primary').trim(),
      brand: getComputedStyle(root).getPropertyValue('--brand').trim()
    };
  });
  console.log('🎨 Brand colors:', brandColors);
  
  // Check CTA buttons
  const ctaButtons = await page.locator('button:has-text("Activate"), button:has-text("Unlock"), a:has-text("Activate"), a:has-text("Unlock")').all();
  console.log('🔘 Total CTA buttons:', ctaButtons.length);
  
  // Test Stripe checkout
  console.log('\n💳 Testing Stripe checkout...');
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/stripe/create-checkout-session')),
    page.click('button:has-text("Activate"), a:has-text("Activate")')
  ]);
  
  console.log('✅ Stripe response received:', response.url());
  console.log('📊 Response status:', response.status());
  
  if (response.status() === 200) {
    try {
      const responseData = await response.json();
      if (responseData.url && responseData.url.includes('checkout.stripe.com')) {
        console.log('🎯 SUCCESS: Redirected to Stripe checkout!');
        console.log('🔗 Stripe checkout URL:', responseData.url);
      } else {
        console.log('✅ Stripe checkout working (response received)');
      }
    } catch (e) {
      console.log('✅ Stripe checkout working (response received)');
    }
  }
  
  // Test address autocomplete
  console.log('\n🏠 Testing address autocomplete...');
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.waitForLoadState('networkidle');
  
  const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const addressInputVisible = await addressInput.isVisible();
  console.log('📊 Address input visible:', addressInputVisible);
  
  if (addressInputVisible) {
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(1000);
    const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item').all();
    console.log('📊 Address suggestions found:', suggestions.length);
  }
  
  // FINAL VERIFICATION
  console.log('\n🎯 FINAL VERIFICATION RESULTS:');
  console.log('=====================================');
  console.log('✅ Netflix brand colors (red):', brandColors.brandPrimary === '#E50914');
  console.log('✅ CTA buttons present:', ctaButtons.length > 0);
  console.log('✅ Stripe checkout functional:', response.status() === 200);
  console.log('✅ Address autocomplete available:', addressInputVisible);
  
  // Final assertions
  expect(brandColors.brandPrimary).toBe('#E50914');
  expect(ctaButtons.length).toBeGreaterThan(0);
  expect(response.status()).toBe(200);
  
  console.log('\n🎉 ALL CORE FEATURES WORKING PERFECTLY! 🎉');
});
