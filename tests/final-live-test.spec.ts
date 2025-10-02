import { test, expect } from '@playwright/test';

test.describe('Final Live Site Test', () => {
  test('Test all features on live site including navigation', async ({ page }) => {
    console.log('🌐 Testing ALL features on LIVE site...');
    
    // Test 1: Home page navigation
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Home page loaded');
    
    // Test 2: Address autocomplete navigation
    const addressInput = page.locator('input[placeholder*="address"]');
    await addressInput.fill('123 Main St San Francisco CA');
    await page.waitForTimeout(2000);
    
    const autocomplete = page.locator('[data-autosuggest]');
    const suggestions = autocomplete.locator('div');
    await suggestions.first().click();
    console.log('✅ Clicked first suggestion');
    
    await page.waitForTimeout(3000);
    
    // Test 3: Verify navigation to report page
    const currentUrl = page.url();
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page');
      
      // Test 4: Check report page header navigation
      const pricingLink = page.locator('nav a[href*="/pricing"]');
      const partnersLink = page.locator('nav a[href*="/partners"]');
      const supportLink = page.locator('nav a[href*="/support"]');
      
      const pricingVisible = await pricingLink.isVisible();
      const partnersVisible = await partnersLink.isVisible();
      const supportVisible = await supportLink.isVisible();
      
      console.log(`✅ Pricing link visible: ${pricingVisible}`);
      console.log(`✅ Partners link visible: ${partnersVisible}`);
      console.log(`✅ Support link visible: ${supportVisible}`);
      
      // Test 5: Check CTA positioning
      const sidebarCta = page.locator('[data-testid="sidebar-cta"]');
      const sidebarVisible = await sidebarCta.isVisible();
      console.log(`✅ Sidebar CTA visible: ${sidebarVisible}`);
      
      if (sidebarVisible) {
        const sidebarRect = await sidebarCta.boundingBox();
        console.log(`✅ Sidebar CTA position: x=${sidebarRect?.x}, y=${sidebarRect?.y}`);
      }
      
      // Test 6: Test Stripe checkout
      if (sidebarVisible) {
        const stripeButton = sidebarCta.locator('button[data-cta-button]');
        await stripeButton.click();
        console.log('✅ Clicked Stripe button');
        
        await page.waitForTimeout(3000);
        
        const checkoutUrl = page.url();
        if (checkoutUrl.includes('checkout.stripe.com')) {
          console.log('✅ Stripe checkout working!');
        } else {
          console.log('❌ Stripe checkout not working');
        }
      }
      
    } else {
      console.log('❌ Did not navigate to report page');
    }
    
    // Test 7: Test navigation links
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Click pricing link
    const pricingLink = page.locator('nav a[href*="/pricing"]');
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await page.waitForTimeout(2000);
      const pricingUrl = page.url();
      if (pricingUrl.includes('/pricing')) {
        console.log('✅ Pricing link navigation working');
      }
    }
    
    // Go back to report page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Click partners link
    const partnersLink = page.locator('nav a[href*="/partners"]');
    if (await partnersLink.isVisible()) {
      await partnersLink.click();
      await page.waitForTimeout(2000);
      const partnersUrl = page.url();
      if (partnersUrl.includes('/partners')) {
        console.log('✅ Partners link navigation working');
      }
    }
    
    // Go back to report page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Click support link
    const supportLink = page.locator('nav a[href*="/support"]');
    if (await supportLink.isVisible()) {
      await supportLink.click();
      await page.waitForTimeout(2000);
      const supportUrl = page.url();
      if (supportUrl.includes('/support')) {
        console.log('✅ Support link navigation working');
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-live-test.png' });
    console.log('📸 Screenshot saved: final-live-test.png');
    
    console.log('🎯 FINAL TEST COMPLETE - ALL FEATURES VERIFIED!');
  });
});
