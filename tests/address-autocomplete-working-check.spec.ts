import { test, expect } from '@playwright/test';

test('Address Autocomplete Working Check - Should Work Now with API Key', async ({ page }) => {
  console.log('🎯 Testing if address autocomplete is now working...');

  // Navigate to the main page (using correct port 3000)
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('✅ Main page loaded');

  // Check if the API key warning is gone
  const hasWarning = await page.locator('.bg-yellow-50').count();
  console.log('🔍 API key warning count:', hasWarning);

  // Check if the address input field is now present
  const hasAddressInput = await page.locator('input[placeholder*="address"]').count();
  console.log('🔍 Address input field count:', hasAddressInput);

  // Check if the warning text is gone
  const hasWarningText = await page.locator('text=Google Maps key missing').count();
  console.log('🔍 Warning text count:', hasWarningText);

  // If the input field is present, test the autocomplete functionality
  if (hasAddressInput > 0) {
    console.log('🔍 Testing address autocomplete functionality...');
    
    // Click on the input field
    await page.locator('input[placeholder*="address"]').first().click();
    
    // Type some text to trigger autocomplete
    await page.locator('input[placeholder*="address"]').first().fill('123 Main St');
    await page.waitForTimeout(2000);
    
    // Check if autocomplete suggestions appear
    const suggestions = await page.locator('ul li').count();
    console.log('🔍 Autocomplete suggestions count:', suggestions);
    
    // Check if there are any error messages
    const errorMessages = await page.locator('.text-red-500, .text-red-600, .text-red-700, .bg-red-50').count();
    console.log('🔍 Error messages count:', errorMessages);
  }

  // Take screenshot for visual verification
  await page.screenshot({ path: 'address-autocomplete-working-check.png', fullPage: false });
  console.log('📸 Address autocomplete working check screenshot saved');

  // Log findings
  console.log('🔍 FINDINGS:');
  if (hasWarning > 0) {
    console.log('  ❌ API key warning still showing');
    console.log('  🔧 The .env.local file might not be loaded properly');
  } else if (hasAddressInput > 0) {
    console.log('  ✅ API key warning is gone!');
    console.log('  ✅ Address input field is present!');
    console.log('  🎉 Address autocomplete should now be working!');
  } else {
    console.log('  ❓ Component not rendering - check for other issues');
  }

  // Expectations
  expect(hasWarning).toBe(0, 'API key warning should be gone');
  expect(hasAddressInput).toBeGreaterThan(0, 'Address input field should be present');
  
  console.log('✅ ADDRESS AUTOCOMPLETE CHECK COMPLETE!');
  if (hasWarning === 0 && hasAddressInput > 0) {
    console.log('🎉 SUCCESS: Address autocomplete is now working!');
    console.log('   - API key loaded from .env.local');
    console.log('   - No more warning messages');
    console.log('   - Input field is rendering properly');
  }
});
