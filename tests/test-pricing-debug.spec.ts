import { test, expect } from '@playwright/test';

test('Debug pricing text on live site', async ({ page }) => {
  console.log('🔍 Debugging pricing text on live site...');
  
  // Test home page pricing
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Get all text content to see what's actually there
  const allText = await page.textContent('body');
  console.log('📄 All page text:', allText);
  
  // Look for any pricing-related text
  const pricingElements = await page.locator('text=399, text=99, text=setup, text=mo').all();
  console.log('💰 Found pricing elements:', pricingElements.length);
  
  for (let i = 0; i < pricingElements.length; i++) {
    const text = await pricingElements[i].textContent();
    console.log(`Pricing element ${i}: "${text}"`);
  }
  
  // Look for the specific text we're looking for
  const specificText = await page.locator('text=No call required').first();
  const isVisible = await specificText.isVisible();
  console.log('🔍 "No call required" text visible:', isVisible);
  
  if (isVisible) {
    const text = await specificText.textContent();
    console.log('📝 "No call required" text content:', text);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'pricing-debug.png' });
  console.log('📸 Screenshot saved as pricing-debug.png');
});
