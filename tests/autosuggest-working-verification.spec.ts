import { test, expect } from '@playwright/test';

test('Autosuggest Working Verification - Check if Google Maps API is Working', async ({ page }) => {
  console.log('🔧 Verifying if autosuggest is actually working...');
  
  // Test 1: Check main page autosuggest
  console.log('📍 Test 1: Main page autosuggest...');
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const mainAddressInput = page.locator('input[placeholder*="address"]').first();
  await expect(mainAddressInput).toBeVisible();
  console.log('✅ Main page address input found');
  
  // Type in the address input
  await mainAddressInput.click();
  await mainAddressInput.fill('123 Main St');
  await page.waitForTimeout(3000);
  
  // Check for autosuggest suggestions
  const mainSuggestions = page.locator('ul li');
  const mainSuggestionCount = await mainSuggestions.count();
  console.log(`🔍 Main page found ${mainSuggestionCount} autosuggest suggestions`);
  
  if (mainSuggestionCount > 0) {
    console.log('✅ Main page autosuggest is working!');
  } else {
    console.log('❌ Main page autosuggest is not working');
  }
  
  // Test 2: Check report page autosuggest
  console.log('📍 Test 2: Report page autosuggest...');
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const reportAddressInput = page.locator('input[placeholder*="property address"]');
  await expect(reportAddressInput).toBeVisible();
  console.log('✅ Report page address input found');
  
  // Type in the address input
  await reportAddressInput.click();
  await reportAddressInput.fill('456 Oak Ave');
  await page.waitForTimeout(3000);
  
  // Check for autosuggest suggestions
  const reportSuggestions = page.locator('ul li');
  const reportSuggestionCount = await reportSuggestions.count();
  console.log(`🔍 Report page found ${reportSuggestionCount} autosuggest suggestions`);
  
  if (reportSuggestionCount > 0) {
    console.log('✅ Report page autosuggest is working!');
  } else {
    console.log('❌ Report page autosuggest is not working');
  }
  
  // Test 3: Check if the "unavailable" message is still showing
  console.log('📍 Test 3: Checking "unavailable" message...');
  const unavailableMessage = page.locator('p:has-text("Address autocomplete temporarily unavailable")');
  const hasUnavailableMessage = await unavailableMessage.count();
  console.log(`🔍 "Unavailable" message found: ${hasUnavailableMessage > 0}`);
  
  if (hasUnavailableMessage > 0) {
    console.log('⚠️ "Address autocomplete temporarily unavailable" message is still showing');
  } else {
    console.log('✅ "Unavailable" message is not showing');
  }
  
  // Test 4: Check Google Maps API status
  console.log('📍 Test 4: Checking Google Maps API status...');
  const apiStatus = await page.evaluate(() => {
    return {
      hasGoogleMaps: typeof google !== 'undefined',
      hasPlaces: typeof google?.maps?.places !== 'undefined',
      hasAutocompleteService: typeof google?.maps?.places?.AutocompleteService !== 'undefined',
      hasPlacesService: typeof google?.maps?.places?.PlacesService !== 'undefined'
    };
  });
  console.log('🔍 Google Maps API status:', apiStatus);
  
  if (apiStatus.hasGoogleMaps && apiStatus.hasPlaces) {
    console.log('✅ Google Maps API is loaded');
  } else {
    console.log('❌ Google Maps API is not loaded');
  }
  
  console.log('🎉 Autosuggest verification completed!');
});
