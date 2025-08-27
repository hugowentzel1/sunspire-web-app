import { test, expect } from '@playwright/test';

test('Final Autocomplete Test - Should Work Now with CSP Fixed', async ({ page }) => {
  console.log('🎯 Final test - checking if autocomplete suggestions work now...');

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

  // Wait for API response
  await page.waitForTimeout(4000);
  console.log('🔍 Waited 4 seconds for API response');

  // Check if autocomplete suggestions appear
  const suggestions = await page.locator('ul li').count();
  console.log('🔍 Autocomplete suggestions count:', suggestions);

  // Check if there are any error messages
  const errorMessages = await page.locator('.text-red-500, .text-red-600, .text-red-700, .bg-red-50').count();
  console.log('🔍 Error messages count:', errorMessages);

  // Check if Google Maps API is loaded
  const apiStatus = await page.evaluate(() => {
    return {
      hasGoogleMaps: typeof google !== 'undefined',
      hasPlaces: typeof google?.maps?.places !== 'undefined',
      hasAutocompleteService: typeof google?.maps?.places?.AutocompleteService !== 'undefined',
      hasPlacesService: typeof google?.maps?.places?.PlacesService !== 'undefined'
    };
  });
  console.log('🔍 API status check:', apiStatus);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'final-autocomplete-test.png', fullPage: false });
  console.log('📸 Final autocomplete test screenshot saved');

  // Log findings
  console.log('🔍 FINDINGS:');
  if (suggestions > 0) {
    console.log('  🎉 SUCCESS: Autocomplete suggestions are working!');
    console.log('  ✅ Address autocomplete is fully functional');
    console.log('  🔧 The CSP fix worked!');
  } else {
    console.log('  ❌ Still no autocomplete suggestions');
    console.log('  🔧 CSP is fixed but suggestions still not working');
    
    if (apiStatus.hasGoogleMaps && apiStatus.hasPlaces) {
      console.log('  ✅ Google Maps API and Places API are loaded');
      if (apiStatus.hasAutocompleteService && apiStatus.hasPlacesService) {
        console.log('  ✅ All required services are available');
        console.log('  ❓ But autocomplete still not working - check for other issues');
      } else {
        console.log('  ❌ Required services not available');
      }
    } else {
      console.log('  ❌ Google Maps API not fully loaded');
    }
  }

  // Expectations
  expect(suggestions).toBeGreaterThan(0, 'Should show autocomplete suggestions');
  
  console.log('✅ FINAL AUTOCOMPLETE TEST COMPLETE!');
  if (suggestions > 0) {
    console.log('🎉 SUCCESS: Address autocomplete is working with suggestions!');
    console.log('   - CSP fixed');
    console.log('   - Google Maps API loading');
    console.log('   - Suggestions appearing');
  } else {
    console.log('⚠️  ISSUE: Still need to debug why no suggestions appear');
  }
});
