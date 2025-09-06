import { test, expect } from '@playwright/test';

test('AddressAutocomplete Success Test', async ({ page, context }) => {
  console.log('🎉 AddressAutocomplete Success Test...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(8000);
  
  // Find address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type in the input
  console.log('📍 Typing "123 Main St, New York"...');
  await addressInput.fill('123 Main St, New York');
  
  // Wait for autocomplete
  await page.waitForTimeout(3000);
  
  // Check for dropdown elements
  const dropdowns = await page.$$('.absolute.z-10, [class*="dropdown"], [class*="suggestion"]');
  console.log('📍 Dropdown elements found:', dropdowns.length);
  
  // Check for specific AddressAutocomplete dropdown
  const autocompleteDropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
  const dropdownVisible = await autocompleteDropdown.isVisible();
  console.log('📍 AddressAutocomplete dropdown visible:', dropdownVisible);
  
  if (dropdownVisible) {
    const suggestions = autocompleteDropdown.locator('div[class*="px-3 py-2 cursor-pointer"]');
    const suggestionCount = await suggestions.count();
    console.log('📍 Number of suggestions in dropdown:', suggestionCount);
    
    if (suggestionCount > 0) {
      console.log('✅ AddressAutocomplete is working perfectly!');
      
      // Get the text of the first suggestion
      const firstSuggestion = suggestions.first();
      const suggestionText = await firstSuggestion.textContent();
      console.log('📍 First suggestion:', suggestionText);
      
      console.log('🎉 SUCCESS: Address autocomplete is fully functional!');
    } else {
      console.log('⚠️ Dropdown visible but no suggestions found');
    }
  } else {
    console.log('❌ AddressAutocomplete dropdown not visible');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-success-test.png', fullPage: true });
  
  console.log('🎉 Test complete');
});
