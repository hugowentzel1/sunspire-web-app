import { test, expect } from '@playwright/test';

test('Test Netflix CTA Buttons - Stripe Checkout', async ({ page }) => {
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1';
  
  console.log('🔍 Testing Netflix CTA buttons for Stripe checkout...');
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Find and test "Unlock Full Report" buttons
  const unlockButtons = await page.locator('text=Unlock Full Report').all();
  console.log('🔘 Found Unlock Full Report buttons:', unlockButtons.length);
  
  for (let i = 0; i < Math.min(unlockButtons.length, 3); i++) {
    try {
      const button = unlockButtons[i];
      const isVisible = await button.isVisible();
      
      if (isVisible) {
        console.log(`🔍 Testing Unlock button ${i + 1}...`);
        
        // Set up response listener
        const responsePromise = page.waitForResponse(response => 
          response.url().includes('stripe') || response.url().includes('checkout'), 
          { timeout: 10000 }
        ).catch(() => null);
        
        // Click the button
        await button.click();
        
        // Wait for response
        const response = await responsePromise;
        
        if (response) {
          console.log(`✅ Unlock button ${i + 1} redirected to: ${response.url()}`);
          console.log(`📊 Response status: ${response.status()}`);
          
          // Check if it's a Stripe checkout URL
          if (response.url().includes('checkout.stripe.com')) {
            console.log('🎯 SUCCESS: Redirected to Stripe checkout!');
            return; // Success, exit test
          }
        } else {
          console.log(`❌ Unlock button ${i + 1} did not redirect to Stripe`);
        }
        
        // Go back for next test
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    } catch (error) {
      console.log(`❌ Error testing Unlock button ${i + 1}:`, error.message);
    }
  }
  
  // Test "Activate" buttons
  const activateButtons = await page.locator('text=Activate').all();
  console.log('🔘 Found Activate buttons:', activateButtons.length);
  
  for (let i = 0; i < Math.min(activateButtons.length, 2); i++) {
    try {
      const button = activateButtons[i];
      const isVisible = await button.isVisible();
      
      if (isVisible) {
        console.log(`🔍 Testing Activate button ${i + 1}...`);
        
        // Set up response listener
        const responsePromise = page.waitForResponse(response => 
          response.url().includes('stripe') || response.url().includes('checkout'), 
          { timeout: 10000 }
        ).catch(() => null);
        
        // Click the button
        await button.click();
        
        // Wait for response
        const response = await responsePromise;
        
        if (response) {
          console.log(`✅ Activate button ${i + 1} redirected to: ${response.url()}`);
          console.log(`📊 Response status: ${response.status()}`);
          
          // Check if it's a Stripe checkout URL
          if (response.url().includes('checkout.stripe.com')) {
            console.log('🎯 SUCCESS: Redirected to Stripe checkout!');
            return; // Success, exit test
          }
        } else {
          console.log(`❌ Activate button ${i + 1} did not redirect to Stripe`);
        }
        
        // Go back for next test
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    } catch (error) {
      console.log(`❌ Error testing Activate button ${i + 1}:`, error.message);
    }
  }
  
  // If we get here, no button worked
  console.log('❌ No CTA buttons successfully redirected to Stripe checkout');
  expect(false).toBe(true); // Fail the test
});
