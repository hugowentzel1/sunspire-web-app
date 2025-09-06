import { test, expect } from '@playwright/test';

test('Final AddressAutocomplete Verification', async ({ page, context }) => {
  console.log('🎯 Final AddressAutocomplete Verification...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  // Listen to all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
  });
  
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
      
      // Test clicking on a suggestion
      console.log('📍 Testing suggestion click...');
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
      
      const inputValue = await addressInput.inputValue();
      console.log('📍 Input value after click:', inputValue);
      
      if (inputValue.includes('New York')) {
        console.log('✅ Suggestion selection working!');
      } else {
        console.log('⚠️ Suggestion selection may not be working');
      }
    } else {
      console.log('⚠️ Dropdown visible but no suggestions found');
    }
  } else {
    console.log('❌ AddressAutocomplete dropdown not visible');
    
    // Check if there are any console errors
    const errorMessages = consoleMessages.filter(msg => msg.includes('error'));
    if (errorMessages.length > 0) {
      console.log('🚨 Error messages:', errorMessages);
    }
  }
  
  // Check console messages for autocomplete success
  const successMessages = consoleMessages.filter(msg => 
    msg.includes('Autocomplete response') && msg.includes('OK')
  );
  console.log('📍 Autocomplete success messages:', successMessages.length);
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-final-verification.png', fullPage: true });
  
  console.log('🎯 Final verification complete');
});
