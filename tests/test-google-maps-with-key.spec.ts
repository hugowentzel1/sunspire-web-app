import { test, expect } from '@playwright/test';

test('Test Google Maps API with Valid Key', async ({ page }) => {
  console.log('🗺️ Testing Google Maps API with valid key...');
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check for Google Maps API errors
  const apiErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().toLowerCase().includes('google')) {
      apiErrors.push(msg.text());
    }
  });
  
  // Check for API key warnings
  const apiWarnings: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'warn' && msg.text().toLowerCase().includes('api key')) {
      apiWarnings.push(msg.text());
    }
  });
  
  // Wait for Google Maps API to load
  await page.waitForTimeout(5000);
  
  // Check if Google Maps API is loaded
  const googleMapsStatus = await page.evaluate(() => {
    const hasGoogle = typeof window.google !== 'undefined';
    const hasMaps = hasGoogle && typeof window.google.maps !== 'undefined';
    const hasPlaces = hasMaps && typeof window.google.maps.places !== 'undefined';
    
    return {
      hasGoogle,
      hasMaps,
      hasPlaces,
      googleObject: hasGoogle ? Object.keys(window.google) : []
    };
  });
  
  console.log('🗺️ Google Maps API Status:', googleMapsStatus);
  console.log('❌ API Errors:', apiErrors);
  console.log('⚠️ API Warnings:', apiWarnings);
  
  // Test address input with autocomplete
  const addressInput = page.locator('input[placeholder*="address"]').first();
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(3000);
  
  // Check for autocomplete suggestions
  const suggestionSelectors = [
    '[data-testid="suggestion"]',
    '.suggestion',
    '[role="option"]',
    '.autocomplete-suggestion',
    '.address-suggestion',
    '[class*="suggestion"]',
    '[class*="autocomplete"]',
    '[class*="dropdown"]',
    '[class*="list"]'
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
  console.log('📍 Autocomplete working:', suggestionsFound);
  
  // Test with a more specific address
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
  
  // Take screenshot
  await page.screenshot({ path: 'google-maps-with-key-test.png', fullPage: true });
  
  if (googleMapsStatus.hasPlaces && suggestionsFound) {
    console.log('✅ Google Maps Places API is working with autocomplete!');
  } else if (googleMapsStatus.hasPlaces && !suggestionsFound) {
    console.log('⚠️ Google Maps API loaded but autocomplete not working');
  } else {
    console.log('❌ Google Maps API not loaded properly');
  }
  
  console.log('🗺️ Google Maps API test complete');
});
