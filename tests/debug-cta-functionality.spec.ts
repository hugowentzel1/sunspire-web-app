import { test, expect } from '@playwright/test';

test('Debug CTA Functionality', async ({ page }) => {
  console.log('🔍 Debugging CTA functionality...');
  
  // Navigate to Tesla report page
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if CTA buttons exist
  const ctaButtons = await page.locator('[data-cta="primary"]').count();
  console.log('🔘 CTA buttons found:', ctaButtons);
  
  // Check if attachCheckoutHandlers is working
  const hasCheckoutHandler = await page.evaluate(() => {
    const buttons = document.querySelectorAll('[data-cta="primary"]');
    return Array.from(buttons).some(btn => (btn as any).__boundCheckout);
  });
  console.log('🔗 Checkout handlers attached:', hasCheckoutHandler);
  
  // Try clicking the first CTA button
  const firstCTA = page.locator('[data-cta="primary"]').first();
  await expect(firstCTA).toBeVisible();
  
  // Listen for network requests
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('/api/stripe/create-checkout-session')
  );
  
  // Click the CTA button
  await firstCTA.click();
  await page.waitForTimeout(2000);
  
  // Check if the request was made
  try {
    const response = await responsePromise;
    console.log('✅ Stripe checkout request made:', response.status());
    
    if (response.ok()) {
      const data = await response.json();
      console.log('✅ Stripe checkout response:', data.url);
      
      // Check if we're redirected to Stripe
      const currentUrl = page.url();
      console.log('🔗 Current URL after CTA click:', currentUrl);
      
      if (currentUrl.includes('checkout.stripe.com')) {
        console.log('✅ Successfully redirected to Stripe');
      } else {
        console.log('⚠️ Not redirected to Stripe, current URL:', currentUrl);
      }
    }
  } catch (error) {
    console.log('❌ No Stripe checkout request made:', error);
  }
  
  // Check console logs for any errors
  const logs = await page.evaluate(() => {
    return (window as any).consoleLogs || [];
  });
  console.log('📝 Console logs:', logs);
});
