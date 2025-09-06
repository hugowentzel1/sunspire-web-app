import { test, expect } from '@playwright/test';

test('Test Address Autocomplete Functionality', async ({ page }) => {
  console.log('📍 Testing address autocomplete functionality...');
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  
  // Test 1: Basic input functionality
  console.log('📍 Testing basic input functionality...');
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(2000);
  
  const inputValue = await addressInput.inputValue();
  console.log('📍 Input value:', inputValue);
  expect(inputValue).toContain('123 Main St');
  
  // Test 2: Check for autocomplete suggestions
  console.log('📍 Testing for autocomplete suggestions...');
  
  // Clear input and type a partial address
  await addressInput.clear();
  await addressInput.fill('123 Main');
  await page.waitForTimeout(3000); // Wait longer for suggestions to load
  
  // Check for various possible suggestion selectors
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
  
  console.log('📍 Total suggestions found:', suggestionCount);
  console.log('📍 Suggestions working:', suggestionsFound);
  
  // Test 3: Try different address formats
  console.log('📍 Testing different address formats...');
  
  const testAddresses = [
    '1600 Amphitheatre Parkway, Mountain View',
    '1 Infinite Loop, Cupertino',
    '350 5th Ave, New York',
    '1 Hacker Way, Menlo Park'
  ];
  
  for (const address of testAddresses) {
    console.log(`📍 Testing address: ${address}`);
    await addressInput.clear();
    await addressInput.fill(address);
    await page.waitForTimeout(2000);
    
    const currentValue = await addressInput.inputValue();
    console.log(`📍 Input value after typing: ${currentValue}`);
  }
  
  // Test 4: Check for Google Maps API integration
  console.log('📍 Checking for Google Maps API integration...');
  
  // Check if Google Maps API is loaded
  const googleMapsLoaded = await page.evaluate(() => {
    return typeof window.google !== 'undefined' && 
           typeof window.google.maps !== 'undefined' &&
           typeof window.google.maps.places !== 'undefined';
  });
  
  console.log('📍 Google Maps API loaded:', googleMapsLoaded);
  
  // Check for any console errors related to Google Maps
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().toLowerCase().includes('google')) {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.waitForTimeout(2000);
  console.log('📍 Google Maps related errors:', consoleErrors);
  
  // Test 5: Check if there are any loading indicators
  console.log('📍 Checking for loading indicators...');
  
  const loadingSelectors = [
    '[class*="loading"]',
    '[class*="spinner"]',
    '[class*="loader"]',
    '.loading',
    '.spinner'
  ];
  
  let loadingFound = false;
  for (const selector of loadingSelectors) {
    const loading = page.locator(selector);
    const count = await loading.count();
    if (count > 0) {
      console.log(`📍 Found ${count} loading indicators with selector: ${selector}`);
      loadingFound = true;
    }
  }
  
  console.log('📍 Loading indicators found:', loadingFound);
  
  // Take screenshot
  await page.screenshot({ path: 'address-autocomplete-test.png', fullPage: true });
  
  console.log('📍 Address autocomplete test complete');
  console.log('✅ Input functionality working');
  console.log(`📍 Autocomplete suggestions: ${suggestionsFound ? 'Working' : 'Not working'}`);
  console.log(`📍 Google Maps API: ${googleMapsLoaded ? 'Loaded' : 'Not loaded'}`);
  console.log(`📍 Console errors: ${consoleErrors.length > 0 ? consoleErrors.join(', ') : 'None'}`);
});
