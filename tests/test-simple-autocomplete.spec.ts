import { test, expect } from '@playwright/test';

test('Simple AddressAutocomplete Test', async ({ page, context }) => {
  console.log('🔍 Simple AddressAutocomplete Test...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(10000);
  
  // Find address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type in the input
  console.log('📍 Typing "123 Main St, New York"...');
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(5000);
  
  // Check for any dropdown elements
  const dropdowns = await page.$$('.absolute, [class*="dropdown"], [class*="suggestion"]');
  console.log('📍 Total dropdown elements found:', dropdowns.length);
  
  // Check for specific AddressAutocomplete dropdown
  const autocompleteDropdown = page.locator('.absolute.z-10');
  const dropdownVisible = await autocompleteDropdown.isVisible();
  console.log('📍 AddressAutocomplete dropdown visible:', dropdownVisible);
  
  if (dropdownVisible) {
    const suggestions = autocompleteDropdown.locator('div[class*="px-3 py-2 cursor-pointer"]');
    const suggestionCount = await suggestions.count();
    console.log('📍 Number of suggestions:', suggestionCount);
    
    if (suggestionCount > 0) {
      console.log('✅ Dropdown with suggestions is visible');
      
      // Click on the first suggestion
      const firstSuggestion = suggestions.first();
      const suggestionText = await firstSuggestion.textContent();
      console.log('📍 First suggestion:', suggestionText);
      
      await firstSuggestion.click();
      await page.waitForTimeout(2000);
      
      // Check if we're still on home page
      const isOnHomePage = await page.locator('button:has-text("Generate"), button:has-text("Launch")').isVisible();
      const isOnReportPage = await page.locator('text=System Size').isVisible();
      
      console.log('📍 Still on home page:', isOnHomePage);
      console.log('📍 Navigated to report page:', isOnReportPage);
      
      if (isOnHomePage && !isOnReportPage) {
        console.log('✅ SUCCESS: Address filled but stayed on home page');
      } else {
        console.log('❌ FAILED: Unexpected navigation behavior');
      }
    } else {
      console.log('⚠️ Dropdown visible but no suggestions');
    }
  } else {
    console.log('❌ No dropdown visible');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'simple-autocomplete-test.png', fullPage: true });
  
  console.log('🔍 Test complete');
});
