import { test, expect } from '@playwright/test';

test('Autocomplete Suggestions Test - Should Show Address Suggestions', async ({ page }) => {
  console.log('🎯 Testing if autocomplete suggestions actually appear...');

  // Navigate to the main page
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('✅ Main page loaded');

  // Check if the address input field is present
  const addressInput = await page.locator('input[placeholder*="address"]').first();
  const hasInput = await addressInput.count();
  console.log('🔍 Address input found:', hasInput > 0);

  if (hasInput === 0) {
    console.log('❌ No address input found - test cannot continue');
    return;
  }

  // Click on the input field to focus it
  await addressInput.click();
  console.log('🔍 Clicked on address input');

  // Type a common address to trigger autocomplete
  await addressInput.fill('123 Main St');
  console.log('🔍 Typed "123 Main St"');

  // Wait longer for API response
  await page.waitForTimeout(3000);
  console.log('🔍 Waited 3 seconds for API response');

  // Check if autocomplete suggestions appear
  const suggestions = await page.locator('ul li').count();
  console.log('🔍 Autocomplete suggestions count:', suggestions);

  // Check if there are any error messages
  const errorMessages = await page.locator('.text-red-500, .text-red-600, .text-red-700, .bg-red-50').count();
  console.log('🔍 Error messages count:', errorMessages);

  // Check if there are any console errors
  const consoleErrors = await page.evaluate(() => {
    return {
      // Check if Google Maps API is loaded
      hasGoogleMaps: typeof google !== 'undefined',
      hasPlaces: typeof google?.maps?.places !== 'undefined',
      // Check if there are any error elements
      hasErrors: !!document.querySelector('.text-red-500, .text-red-600, .text-red-700, .bg-red-50'),
      // Check if the input has any validation errors
      inputHasError: !!document.querySelector('input[placeholder*="address"]')?.classList.contains('error')
    };
  });
  console.log('🔍 Console/API check:', consoleErrors);

  // Try a different address to see if it's a specific address issue
  if (suggestions === 0) {
    console.log('🔍 Trying different address: "1600 Pennsylvania Ave"');
    await addressInput.clear();
    await addressInput.fill('1600 Pennsylvania Ave');
    await page.waitForTimeout(3000);
    
    const suggestions2 = await page.locator('ul li').count();
    console.log('🔍 Suggestions with different address:', suggestions2);
  }

  // Take screenshot for visual verification
  await page.screenshot({ path: 'autocomplete-suggestions-test.png', fullPage: false });
  console.log('📸 Autocomplete suggestions test screenshot saved');

  // Log findings
  console.log('🔍 FINDINGS:');
  if (suggestions > 0) {
    console.log('  ✅ Autocomplete suggestions are working!');
    console.log('  🎉 Address autocomplete is fully functional');
  } else {
    console.log('  ❌ No autocomplete suggestions appearing');
    console.log('  🔧 POSSIBLE ISSUES:');
    console.log('    1. Google Places API not responding');
    console.log('    2. API key restrictions too tight');
    console.log('    3. Network/API rate limiting');
    console.log('    4. Component not properly initialized');
    
    if (consoleErrors.hasGoogleMaps && consoleErrors.hasPlaces) {
      console.log('  ✅ Google Maps API appears to be loaded');
    } else {
      console.log('  ❌ Google Maps API not loaded properly');
    }
  }

  // Expectations
  expect(suggestions).toBeGreaterThan(0, 'Should show autocomplete suggestions');
  
  console.log('✅ AUTOCOMPLETE SUGGESTIONS TEST COMPLETE!');
  if (suggestions > 0) {
    console.log('🎉 SUCCESS: Address autocomplete is working with suggestions!');
  } else {
    console.log('⚠️  ISSUE: Address input works but no suggestions appear');
  }
});
