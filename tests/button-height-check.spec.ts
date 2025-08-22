import { test, expect } from '@playwright/test';

test('Check CTA Button Heights', async ({ page }) => {
  console.log('🔍 Checking CTA button heights...');
  
  // Navigate to Apple demo page
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Look for both CTA buttons
  const activateButton = page.locator('button:has-text("Activate Your White-Label Demo")').first();
  const sampleButton = page.locator('button:has-text("Request Sample Report")').first();
  
  if (await activateButton.count() > 0 && await sampleButton.count() > 0) {
    console.log('✅ Both buttons found');
    
    // Get button dimensions
    const activateBox = await activateButton.boundingBox();
    const sampleBox = await sampleButton.boundingBox();
    
    if (activateBox && sampleBox) {
      console.log('📏 Button Dimensions:');
      console.log(`  "Activate Your White-Label Demo":`);
      console.log(`    Width: ${activateBox.width}px`);
      console.log(`    Height: ${activateBox.height}px`);
      console.log(`    Padding: ${await activateButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
      })}`);
      
      console.log(`  "Request Sample Report":`);
      console.log(`    Width: ${sampleBox.width}px`);
      console.log(`    Height: ${sampleBox.height}px`);
      console.log(`    Padding: ${await sampleButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
      })}`);
      
      // Check if heights are the same
      const heightDiff = Math.abs(activateBox.height - sampleBox.height);
      if (heightDiff < 2) { // Allow 2px tolerance for rounding
        console.log('✅ Button heights are the same!');
        console.log(`   Height difference: ${heightDiff}px (within tolerance)`);
      } else {
        console.log('❌ Button heights are different!');
        console.log(`   Height difference: ${heightDiff}px`);
      }
      
      // Take screenshot for visual verification
      await page.screenshot({ path: 'button-heights-comparison.png' });
      console.log('📸 Button heights screenshot saved');
      
    } else {
      console.log('❌ Could not get button dimensions');
    }
  } else {
    console.log('❌ One or both buttons not found');
    console.log(`  Activate button: ${await activateButton.count()}`);
    console.log(`  Sample button: ${await sampleButton.count()}`);
  }
});
