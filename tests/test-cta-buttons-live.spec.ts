import { test, expect } from '@playwright/test';

test('Test CTA Buttons on Live Site', async ({ page }) => {
  console.log('🔍 Testing CTA buttons on live site...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('🌐 Navigating to live site...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  console.log('🔘 Testing CTA buttons...');
  const ctaButtons = page.locator('[data-cta="primary"]');
  const ctaCount = await ctaButtons.count();
  console.log('📊 CTA button count:', ctaCount);
  
  if (ctaCount > 0) {
    console.log('✅ CTA buttons found');
    
    // Test first CTA button
    const firstCta = ctaButtons.first();
    const ctaText = await firstCta.textContent();
    console.log('📊 First CTA text:', ctaText);
    
    // Check if button has proper styling
    const ctaStyle = await firstCta.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius
      };
    });
    console.log('🎨 CTA button styling:', ctaStyle);
    
    // Test clicking the button
    console.log('🖱️ Testing CTA button click...');
    
    // Listen for navigation events
    const navigationPromise = page.waitForURL('**/checkout**', { timeout: 10000 }).catch(() => null);
    
    await firstCta.click();
    
    // Wait for navigation or error
    const navigationResult = await navigationPromise;
    
    if (navigationResult) {
      console.log('✅ CTA button successfully redirected to Stripe checkout');
      console.log('📊 Current URL:', page.url());
    } else {
      console.log('⚠️ CTA button click did not redirect to Stripe checkout');
      console.log('📊 Current URL:', page.url());
      
      // Check for any error messages
      const errorMessages = await page.locator('text=error, text=Error, text=failed, text=Failed').count();
      console.log('📊 Error messages found:', errorMessages);
    }
  } else {
    console.log('❌ No CTA buttons found');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'cta-buttons-test.png' });
  console.log('📸 Screenshot saved as cta-buttons-test.png');
  
  console.log('🎯 CTA BUTTONS TEST COMPLETE');
});
