import { test, expect } from '@playwright/test';

test('Test AddressAutocomplete Fills Input Only', async ({ page, context }) => {
  console.log('🔍 Testing AddressAutocomplete Fills Input Only...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(8000);
  
  // Find address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type in the input to trigger autocomplete
  console.log('📍 Typing "123 Main St, New York"...');
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(3000);
  
  // Check for dropdown
  const autocompleteDropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
  const dropdownVisible = await autocompleteDropdown.isVisible();
  console.log('📍 Dropdown visible:', dropdownVisible);
  
  if (dropdownVisible) {
    const suggestions = autocompleteDropdown.locator('div[class*="px-3 py-2 cursor-pointer"]');
    const suggestionCount = await suggestions.count();
    console.log('📍 Number of suggestions:', suggestionCount);
    
    if (suggestionCount > 0) {
      // Get the first suggestion text
      const firstSuggestion = suggestions.first();
      const suggestionText = await firstSuggestion.textContent();
      console.log('📍 First suggestion:', suggestionText);
      
      // Click on the first suggestion
      console.log('📍 Clicking on first suggestion...');
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
      
      // Check if we're still on the home page (not navigated to report)
      const isOnHomePage = await page.locator('button:has-text("Generate"), button:has-text("Launch")').isVisible();
      const isOnReportPage = await page.locator('text=System Size').isVisible();
      
      console.log('📍 Still on home page:', isOnHomePage);
      console.log('📍 Navigated to report page:', isOnReportPage);
      
      // Check if the input field was filled
      const inputValue = await addressInput.inputValue();
      console.log('📍 Input value after click:', inputValue);
      
      if (isOnHomePage && !isOnReportPage && inputValue.includes('New York')) {
        console.log('✅ SUCCESS: Address filled but stayed on home page');
        console.log('✅ User must click Generate button to proceed');
      } else if (isOnReportPage) {
        console.log('❌ FAILED: Automatically navigated to report page');
      } else {
        console.log('❌ FAILED: Address not filled or unexpected behavior');
      }
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-fill-only-test.png', fullPage: true });
  
  console.log('🔍 Test complete');
});
