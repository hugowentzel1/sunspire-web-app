import { test, expect } from '@playwright/test';

test('Google Maps Console Check - Look for API Errors', async ({ page }) => {
  console.log('🔍 Checking browser console for Google Maps API errors...');

  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(msg.text());
    console.log('📝 Console:', msg.text());
  });

  // Listen for page errors
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log('❌ Page Error:', error.message);
  });

  // Navigate to the main page
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  console.log('✅ Main page loaded and waited 5 seconds');

  // Check if the address input field is present
  const addressInput = await page.locator('input[placeholder*="address"]').first();
  const hasInput = await addressInput.count();
  console.log('🔍 Address input found:', hasInput > 0);

  if (hasInput > 0) {
    // Click on the input field to focus it
    await addressInput.click();
    console.log('🔍 Clicked on address input');

    // Type a common address to trigger autocomplete
    await addressInput.fill('123 Main St');
    console.log('🔍 Typed "123 Main St"');

    // Wait longer for API response and any console messages
    await page.waitForTimeout(5000);
    console.log('🔍 Waited 5 seconds for API response and console messages');

    // Check if autocomplete suggestions appear
    const suggestions = await page.locator('ul li').count();
    console.log('🔍 Autocomplete suggestions count:', suggestions);
  }

  // Check the page content for any error messages
  const pageContent = await page.content();
  const hasGoogleMapsError = pageContent.includes('Google Maps') && pageContent.includes('error');
  const hasPlacesError = pageContent.includes('Places') && pageContent.includes('error');
  const hasApiError = pageContent.includes('API') && pageContent.includes('error');
  
  console.log('🔍 Page content analysis:');
  console.log('  - Has Google Maps error:', hasGoogleMapsError);
  console.log('  - Has Places error:', hasPlacesError);
  console.log('  - Has API error:', hasApiError);

  // Check if Google Maps API is loaded
  const apiStatus = await page.evaluate(() => {
    return {
      hasGoogleMaps: typeof google !== 'undefined',
      hasPlaces: typeof google?.maps?.places !== 'undefined',
      hasAutocompleteService: typeof google?.maps?.places?.AutocompleteService !== 'undefined',
      hasPlacesService: typeof google?.maps?.places?.PlacesService !== 'undefined',
      // Check if there are any script loading errors
      hasScriptErrors: !!document.querySelector('script[src*="maps.googleapis.com"]'),
      // Check for any error messages in the DOM
      hasErrorMessages: !!document.querySelector('.text-red-500, .text-red-600, .text-red-700, .bg-red-50')
    };
  });
  console.log('🔍 API status check:', apiStatus);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'google-maps-console-check.png', fullPage: false });
  console.log('📸 Google Maps console check screenshot saved');

  // Log all console messages
  console.log('🔍 All console messages:');
  consoleMessages.forEach((msg, index) => {
    console.log(`  ${index + 1}. ${msg}`);
  });

  // Log all page errors
  console.log('🔍 All page errors:');
  pageErrors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });

  // Log findings
  console.log('🔍 FINDINGS:');
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

  // Check for specific error patterns
  const hasLoadError = consoleMessages.some(msg => 
    msg.includes('load failed') || 
    msg.includes('Places load failed') || 
    msg.includes('API key') ||
    msg.includes('referrer')
  );

  if (hasLoadError) {
    console.log('  ❌ Found loading errors in console');
  } else {
    console.log('  ✅ No obvious loading errors in console');
  }

  console.log('✅ GOOGLE MAPS CONSOLE CHECK COMPLETE!');
});
