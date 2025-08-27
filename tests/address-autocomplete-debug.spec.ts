import { test, expect } from '@playwright/test';

test('Address Autocomplete Debug - Diagnose Why It\'s Not Working', async ({ page }) => {
  console.log('🔍 Debugging address autocomplete since API key is present...');

  // Navigate to the main page
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('✅ Main page loaded');

  // Check if the address input field is present and functional
  const addressInput = await page.locator('input[placeholder*="address"]').count();
  console.log('🔍 Address input field count:', addressInput);

  // Check if there are any console errors
  const consoleErrors = await page.evaluate(() => {
    return {
      // Check if the warning element exists
      hasWarning: !!document.querySelector('.bg-yellow-50'),
      hasWarningText: !!document.querySelector('text=Google Maps key missing'),
      // Check if Google Maps API is loaded
      hasGoogleMaps: typeof google !== 'undefined',
      hasPlaces: typeof google?.maps?.places !== 'undefined',
      // Check if the component is rendering properly
      hasAddressAutocomplete: !!document.querySelector('input[placeholder*="address"]'),
      // Check for any error messages
      hasErrorMessages: !!document.querySelector('.text-red-500, .text-red-600, .text-red-700')
    };
  });
  console.log('🔍 Component state check:', consoleErrors);

  // Try to interact with the address input
  if (addressInput > 0) {
    console.log('🔍 Attempting to interact with address input...');
    
    // Click on the input field
    await page.locator('input[placeholder*="address"]').first().click();
    
    // Type some text to trigger autocomplete
    await page.locator('input[placeholder*="address"]').first().fill('123 Main St');
    await page.waitForTimeout(1000);
    
    // Check if autocomplete suggestions appear
    const suggestions = await page.locator('ul li').count();
    console.log('🔍 Autocomplete suggestions count:', suggestions);
    
    // Check if there are any error messages visible
    const errorMessages = await page.locator('.text-red-500, .text-red-600, .text-red-700, .bg-red-50').count();
    console.log('🔍 Error messages count:', errorMessages);
  }

  // Check the page source for any error messages
  const pageContent = await page.content();
  const hasGoogleMapsError = pageContent.includes('Google Maps') && pageContent.includes('error');
  const hasPlacesError = pageContent.includes('Places') && pageContent.includes('error');
  const hasApiError = pageContent.includes('API') && pageContent.includes('error');
  
  console.log('🔍 Page content analysis:');
  console.log('  - Has Google Maps error:', hasGoogleMapsError);
  console.log('  - Has Places error:', hasPlacesError);
  console.log('  - Has API error:', hasApiError);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'address-autocomplete-debug.png', fullPage: false });
  console.log('📸 Address autocomplete debug screenshot saved');

  // Log findings
  console.log('🔍 DEBUG FINDINGS:');
  if (consoleErrors.hasWarning) {
    console.log('  ❌ Component shows warning (API key issue)');
  } else if (consoleErrors.hasAddressAutocomplete) {
    console.log('  ✅ Address input field is present');
    if (consoleErrors.hasGoogleMaps && consoleErrors.hasPlaces) {
      console.log('  ✅ Google Maps API appears to be loaded');
    } else {
      console.log('  ❌ Google Maps API not loaded properly');
    }
  } else {
    console.log('  ❌ Address input field not found');
  }

  // Basic expectations
  expect(addressInput).toBeGreaterThan(0, 'Address input field should be present');
  
  if (consoleErrors.hasWarning) {
    console.log('⚠️  WARNING: Component shows API key warning despite key being present');
    console.log('   - Check if API key has correct permissions');
    console.log('   - Verify Places API is enabled in Google Cloud Console');
    console.log('   - Check if API key has billing enabled');
  }
});
