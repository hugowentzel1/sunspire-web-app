import { test, expect } from '@playwright/test';

test('Test Netflix Stripe Debug - Check Redirect', async ({ page }) => {
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1';
  
  console.log('🔍 Testing Netflix Stripe redirect for debugging...');
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Find first "Unlock Full Report" button
  const unlockButton = await page.locator('text=Unlock Full Report').first();
  const isVisible = await unlockButton.isVisible();
  
  if (isVisible) {
    console.log('🔍 Clicking Unlock Full Report button...');
    
    // Set up response listener
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('stripe') || response.url().includes('checkout'), 
      { timeout: 10000 }
    ).catch(() => null);
    
    // Click the button
    await unlockButton.click();
    
    // Wait for response
    const response = await responsePromise;
    
    if (response) {
      console.log(`✅ Button redirected to: ${response.url()}`);
      console.log(`📊 Response status: ${response.status()}`);
      
      // Get response body for debugging
      try {
        const responseBody = await response.text();
        console.log(`📊 Response body: ${responseBody.substring(0, 500)}...`);
      } catch (e) {
        console.log('❌ Could not read response body');
      }
      
      // Check current URL after redirect
      const currentUrl = page.url();
      console.log(`📊 Current URL after redirect: ${currentUrl}`);
      
      // Check if we're on Stripe checkout
      if (currentUrl.includes('checkout.stripe.com')) {
        console.log('🎯 SUCCESS: On Stripe checkout page!');
      } else if (currentUrl.includes('sunspire-web-app.vercel.app')) {
        console.log('⚠️ Still on Sunspire domain - checking for error messages...');
        
        // Look for error messages
        const errorMessages = await page.locator('text=error, text=Error, text=500, text=Internal Server Error').all();
        console.log(`📊 Error messages found: ${errorMessages.length}`);
        
        for (let i = 0; i < errorMessages.length; i++) {
          const text = await errorMessages[i].textContent();
          console.log(`📊 Error ${i + 1}: ${text}`);
        }
        
        // Check page title
        const title = await page.title();
        console.log(`📊 Page title: ${title}`);
        
        // Check for any visible text that might indicate an error
        const bodyText = await page.locator('body').textContent();
        if (bodyText.includes('500') || bodyText.includes('error') || bodyText.includes('Error')) {
          console.log('❌ Error detected in page content');
        } else {
          console.log('✅ No obvious errors in page content');
        }
      }
    } else {
      console.log('❌ No redirect response received');
    }
  } else {
    console.log('❌ Unlock Full Report button not visible');
  }
  
  // Wait a bit to see the final state
  await page.waitForTimeout(2000);
  
  console.log('🎯 Debug complete');
});
