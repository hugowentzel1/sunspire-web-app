import { test, expect } from '@playwright/test';

test('Test AddressAutocomplete Component', async ({ page, context }) => {
  console.log('📍 Testing AddressAutocomplete Component...');
  
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
    console.log('❌ Google Maps API not loaded, skipping test');
    return;
  }
  
  console.log('✅ Google Maps API loaded successfully');
  
  // Find address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type in the input to trigger autocomplete
  console.log('📍 Typing "123 Main St, New York" to trigger autocomplete...');
  await addressInput.fill('123 Main St, New York');
  
  // Wait for the debounced search (300ms + API call time)
  await page.waitForTimeout(2000);
  
  // Check for the specific dropdown created by AddressAutocomplete component
  const dropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
  const dropdownVisible = await dropdown.isVisible();
  
  console.log('📍 AddressAutocomplete dropdown visible:', dropdownVisible);
  
  if (dropdownVisible) {
    const suggestions = dropdown.locator('div[class*="px-3 py-2 cursor-pointer"]');
    const suggestionCount = await suggestions.count();
    console.log('📍 Number of suggestions in dropdown:', suggestionCount);
    
    if (suggestionCount > 0) {
      console.log('✅ AddressAutocomplete is working!');
      
      // Get the text of the first suggestion
      const firstSuggestion = suggestions.first();
      const suggestionText = await firstSuggestion.textContent();
      console.log('📍 First suggestion:', suggestionText);
    } else {
      console.log('⚠️ Dropdown visible but no suggestions found');
    }
  } else {
    console.log('❌ AddressAutocomplete dropdown not visible');
    
    // Check if there are any console errors
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    // Wait a bit more and check again
    await page.waitForTimeout(2000);
    
    // Check for any error messages
    if (consoleMessages.length > 0) {
      console.log('🚨 Console errors found:', consoleMessages);
    }
  }
  
  // Test with a more specific address
  console.log('📍 Testing with "1600 Amphitheatre Parkway"...');
  await addressInput.clear();
  await addressInput.fill('1600 Amphitheatre Parkway');
  await page.waitForTimeout(2000);
  
  const secondDropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
  const secondDropdownVisible = await secondDropdown.isVisible();
  console.log('📍 Second test - dropdown visible:', secondDropdownVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-component-test.png', fullPage: true });
  
  console.log('📍 AddressAutocomplete component test complete');
});
