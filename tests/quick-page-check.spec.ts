import { test, expect } from '@playwright/test';

test('Quick Page Check - See What\'s Currently There', async ({ page }) => {
  console.log('🔍 Quick check of what\'s on the main page...');

  // Navigate to the main page
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Main page loaded');

  // Check what elements are present
  const hasAddressInput = await page.locator('input[placeholder*="address"]').count();
  const hasAddressInput2 = await page.locator('input[placeholder*="Address"]').count();
  const hasAddressInput3 = await page.locator('input').count();
  
  console.log('🔍 Input field counts:');
  console.log('  - input[placeholder*="address"]:', hasAddressInput);
  console.log('  - input[placeholder*="Address"]:', hasAddressInput2);
  console.log('  - All inputs:', hasAddressInput3);

  // List all input fields
  const allInputs = await page.locator('input').all();
  console.log('🔍 All input fields found:');
  allInputs.forEach((input, index) => {
    const placeholder = input.getAttribute('placeholder');
    const type = input.getAttribute('type');
    console.log(`  ${index + 1}. type="${type}" placeholder="${placeholder}"`);
  });

  // Check if there are any Google Maps related elements
  const hasGoogleMapsWarning = await page.locator('.bg-yellow-50').count();
  const hasGoogleMapsError = await page.locator('.text-red-500, .text-red-600, .text-red-700').count();
  
  console.log('🔍 Google Maps elements:');
  console.log('  - Warning boxes:', hasGoogleMapsWarning);
  console.log('  - Error messages:', hasGoogleMapsError);

  // Take screenshot
  await page.screenshot({ path: 'quick-page-check.png', fullPage: false });
  console.log('📸 Quick page check screenshot saved');

  console.log('✅ QUICK PAGE CHECK COMPLETE!');
});
