import { test, expect } from '@playwright/test';

test.describe('Live Comprehensive Test', () => {
  test('Test all features on live site', async ({ page }) => {
    console.log('🌐 Testing ALL features on LIVE site...');
    
    // Go to live demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test 1: Page loads
    await expect(page.locator('h1').first()).toBeVisible();
    console.log('✅ Page loaded successfully');
    
    // Test 2: Address input visible
    const addressInput = page.locator('input[placeholder*="address"]');
    await expect(addressInput).toBeVisible();
    console.log('✅ Address input visible');
    
    // Test 3: Type address and check autocomplete
    await addressInput.fill('123 Main St San Francisco CA');
    await page.waitForTimeout(2000);
    
    const autocomplete = page.locator('[data-autosuggest]');
    const autocompleteVisible = await autocomplete.isVisible();
    console.log(`Autocomplete visible: ${autocompleteVisible}`);
    
    if (autocompleteVisible) {
      const suggestions = autocomplete.locator('div');
      const suggestionCount = await suggestions.count();
      console.log(`Suggestions found: ${suggestionCount}`);
      
      if (suggestionCount > 0) {
        await suggestions.first().click();
        console.log('✅ Clicked first suggestion');
        
        await page.waitForTimeout(2000);
        
        // Test 4: Launch button appears
        const launchButton = page.locator('button').filter({ hasText: 'Launch on Netflix' });
        const launchVisible = await launchButton.isVisible();
        console.log(`Launch button visible: ${launchVisible}`);
        
        if (launchVisible) {
          // Test 5: Launch button click (this might not work due to JS error)
          await launchButton.click();
          console.log('✅ Clicked launch button');
          
          await page.waitForTimeout(3000);
          
          const currentUrl = page.url();
          if (currentUrl.includes('/report')) {
            console.log('✅ Successfully navigated to report page');
            
            // Test 6: Report page features
            const demoBanner = page.locator('[data-testid="demo-banner"]');
            const bannerText = await demoBanner.textContent();
            console.log(`Demo banner: ${bannerText}`);
            
            const sidebarCta = page.locator('[data-testid="sidebar-cta"]');
            const sidebarVisible = await sidebarCta.isVisible();
            console.log(`Sidebar CTA visible: ${sidebarVisible}`);
            
            if (sidebarVisible) {
              // Test 7: Stripe checkout
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
            console.log('❌ Did not navigate to report page (likely due to JS error)');
          }
        }
      }
    }
    
    // Test 8: Check footer consistency
    const footer = page.locator('footer');
    const footerVisible = await footer.isVisible();
    console.log(`Footer visible: ${footerVisible}`);
    
    if (footerVisible) {
      const quickLinks = footer.locator('text=Quick Links');
      const quickLinksVisible = await quickLinks.isVisible();
      console.log(`Quick Links visible: ${quickLinksVisible}`);
      
      const poweredBy = footer.locator('text=Powered by Sunspire');
      const poweredByVisible = await poweredBy.isVisible();
      console.log(`Powered by Sunspire visible: ${poweredByVisible}`);
    }
    
    // Test 9: Check pricing page
    await page.goto('https://sunspire-web-app.vercel.app/pricing');
    await page.waitForLoadState('networkidle');
    
    const pricingTitle = page.locator('h1').first();
    const pricingTitleVisible = await pricingTitle.isVisible();
    console.log(`Pricing page loaded: ${pricingTitleVisible}`);
    
    // Test 10: Check support page
    await page.goto('https://sunspire-web-app.vercel.app/support');
    await page.waitForLoadState('networkidle');
    
    const supportTitle = page.locator('h1').first();
    const supportTitleVisible = await supportTitle.isVisible();
    console.log(`Support page loaded: ${supportTitleVisible}`);
    
    // Test 11: Check partners page
    await page.goto('https://sunspire-web-app.vercel.app/partners');
    await page.waitForLoadState('networkidle');
    
    const partnersTitle = page.locator('h1').first();
    const partnersTitleVisible = await partnersTitle.isVisible();
    console.log(`Partners page loaded: ${partnersTitleVisible}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'live-comprehensive-test.png' });
    console.log('📸 Screenshot saved: live-comprehensive-test.png');
    
    console.log('🎯 COMPREHENSIVE TEST COMPLETE');
  });
});
