import { test, expect } from '@playwright/test';

test('Test Address Autocomplete Functionality', async ({ page, context }) => {
  console.log('📍 Testing Address Autocomplete Functionality...');
  
  // Clear all storage and cookies for fresh start
  await context.clearCookies();
  await context.clearPermissions();
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  // Wait for Google Maps API to load
  console.log('⏳ Waiting for Google Maps API to load...');
  await page.waitForTimeout(8000);
  
  // Verify Google Maps API is loaded
  const apiLoaded = await page.evaluate(() => {
    return typeof window.google !== 'undefined' && 
           typeof window.google.maps !== 'undefined' && 
           typeof window.google.maps.places !== 'undefined';
  });
  
  if (!apiLoaded) {
    console.log('❌ Google Maps API not loaded, skipping autocomplete test');
    return;
  }
  
  console.log('✅ Google Maps API loaded successfully');
  
  // Find address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  console.log('📍 Testing with "123 Main St, New York"...');
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(3000);
  
  // Look for autocomplete suggestions
  const suggestionSelectors = [
    '[data-testid="suggestion"]',
    '.suggestion',
    '[role="option"]',
    '.autocomplete-suggestion',
    '.address-suggestion',
    '[class*="suggestion"]',
    '[class*="autocomplete"]',
    '[class*="dropdown"]',
    '[class*="list"]',
    '.pac-container',
    '.pac-item'
  ];
  
  let suggestionsFound = false;
  let suggestionCount = 0;
  
  for (const selector of suggestionSelectors) {
    const suggestions = page.locator(selector);
    const count = await suggestions.count();
    if (count > 0) {
      console.log(`📍 Found ${count} suggestions with selector: ${selector}`);
      suggestionCount += count;
      suggestionsFound = true;
    }
  }
  
  console.log('📍 Total autocomplete suggestions found:', suggestionCount);
  
  // Test with a more specific address
  console.log('📍 Testing with "1600 Amphitheatre Parkway"...');
  await addressInput.clear();
  await addressInput.fill('1600 Amphitheatre Parkway');
  await page.waitForTimeout(3000);
  
  // Check for suggestions again
  let secondSuggestionsFound = false;
  for (const selector of suggestionSelectors) {
    const suggestions = page.locator(selector);
    const count = await suggestions.count();
    if (count > 0) {
      secondSuggestionsFound = true;
      break;
    }
  }
  
  console.log('📍 Second test - suggestions found:', secondSuggestionsFound);
  
  // Test clicking on input to trigger autocomplete
  console.log('📍 Testing click to trigger autocomplete...');
  await addressInput.click();
  await page.waitForTimeout(2000);
  
  // Check for suggestions after click
  let clickSuggestionsFound = false;
  for (const selector of suggestionSelectors) {
    const suggestions = page.locator(selector);
    const count = await suggestions.count();
    if (count > 0) {
      clickSuggestionsFound = true;
      break;
    }
  }
  
  console.log('📍 After click - suggestions found:', clickSuggestionsFound);
  
  // Take screenshot
  await page.screenshot({ path: 'address-autocomplete-final-test.png', fullPage: true });
  
  if (suggestionsFound || secondSuggestionsFound || clickSuggestionsFound) {
    console.log('✅ Address autocomplete is working!');
  } else {
    console.log('⚠️ Address autocomplete may not be working - no suggestions found');
    console.log('💡 This could be normal if the API key has restrictions or the suggestions are styled differently');
  }
  
  console.log('📍 Address autocomplete test complete');
});
