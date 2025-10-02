import { test, expect } from '@playwright/test';

test.describe('Live Manual Check', () => {
  test('Check live site functionality', async ({ page }) => {
    console.log('🌐 Testing LIVE site manually...');
    
    // Go to live demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads
    await expect(page.locator('h1').first()).toBeVisible();
    console.log('✅ Page loaded successfully');
    
    // Check address input
    const addressInput = page.locator('input[placeholder*="address"]');
    await expect(addressInput).toBeVisible();
    console.log('✅ Address input visible');
    
    // Type in address
    await addressInput.fill('123 Main St San Francisco CA');
    await page.waitForTimeout(1000);
    
    // Check if autocomplete appears
    const autocomplete = page.locator('[data-autosuggest]');
    const autocompleteVisible = await autocomplete.isVisible();
    console.log(`Autocomplete visible: ${autocompleteVisible}`);
    
    if (autocompleteVisible) {
      // Click first suggestion
      const firstSuggestion = autocomplete.locator('div').first();
      await firstSuggestion.click();
      console.log('✅ Clicked first suggestion');
      
      // Wait a bit for the form to update
      await page.waitForTimeout(1000);
      
      // Check if generate button is enabled
      const generateButton = page.locator('button[data-cta-button]').filter({ hasText: 'Launch My Branded Tool' });
      const isEnabled = await generateButton.isEnabled();
      console.log(`Generate button enabled: ${isEnabled}`);
      
      if (isEnabled) {
        // Click generate button
        await generateButton.click();
        console.log('✅ Clicked generate button');
        
        // Wait for navigation
        await page.waitForTimeout(3000);
        
        // Check if we're on report page
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/report')) {
          console.log('✅ Successfully navigated to report page');
          
          // Check demo banner
          const demoBanner = page.locator('[data-testid="demo-banner"]');
          const bannerText = await demoBanner.textContent();
          console.log(`Demo banner: ${bannerText}`);
          
          // Check sidebar CTA
          const sidebarCta = page.locator('[data-testid="sidebar-cta"]');
          const sidebarVisible = await sidebarCta.isVisible();
          console.log(`Sidebar CTA visible: ${sidebarVisible}`);
          
          if (sidebarVisible) {
            // Test Stripe checkout
            const stripeButton = sidebarCta.locator('button[data-cta-button]');
            await stripeButton.click();
            console.log('✅ Clicked Stripe button');
            
            // Wait for navigation
            await page.waitForTimeout(3000);
            
            const checkoutUrl = page.url();
            console.log(`Checkout URL: ${checkoutUrl}`);
            
            if (checkoutUrl.includes('checkout.stripe.com')) {
              console.log('✅ Stripe checkout working!');
            } else {
              console.log('❌ Stripe checkout not working');
            }
          }
        } else {
          console.log('❌ Did not navigate to report page');
        }
      } else {
        console.log('❌ Generate button not enabled');
      }
    } else {
      console.log('❌ Autocomplete not visible');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'live-manual-check.png' });
    console.log('📸 Screenshot saved: live-manual-check.png');
  });
});
