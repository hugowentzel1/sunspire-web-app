import { test, expect } from '@playwright/test';

test('Debug AddressAutocomplete Error', async ({ page, context }) => {
  console.log('🔍 Debug AddressAutocomplete Error...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  // Listen to all console messages and errors
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
    console.log('Console:', message);
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log('🚨 Page Error:', error.message);
  });
  
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
  
  // Check for dropdown
  const autocompleteDropdown = page.locator('.absolute.z-10');
  const dropdownVisible = await autocompleteDropdown.isVisible();
  console.log('📍 Dropdown visible:', dropdownVisible);
  
  if (dropdownVisible) {
    const suggestions = autocompleteDropdown.locator('div[class*="px-3 py-2 cursor-pointer"]');
    const suggestionCount = await suggestions.count();
    console.log('📍 Number of suggestions:', suggestionCount);
    
    if (suggestionCount > 0) {
      // Click on the first suggestion
      const firstSuggestion = suggestions.first();
      const suggestionText = await firstSuggestion.textContent();
      console.log('📍 Clicking on suggestion:', suggestionText);
      
      await firstSuggestion.click();
      await page.waitForTimeout(3000);
      
      // Check for any error messages
      const errorMessages = consoleMessages.filter(msg => msg.includes('error') || msg.includes('Error'));
      if (errorMessages.length > 0) {
        console.log('🚨 Error messages found:', errorMessages);
      }
      
      // Check if there's an error screen
      const errorScreen = await page.locator('text=Error, text=Something went wrong, text=An error occurred').isVisible();
      console.log('📍 Error screen visible:', errorScreen);
      
      // Check current page state
      const isOnHomePage = await page.locator('button:has-text("Generate"), button:has-text("Launch")').isVisible();
      const isOnReportPage = await page.locator('text=System Size').isVisible();
      const isOnErrorPage = await page.locator('text=Error').isVisible();
      
      console.log('📍 Still on home page:', isOnHomePage);
      console.log('📍 Navigated to report page:', isOnReportPage);
      console.log('📍 On error page:', isOnErrorPage);
      
      // Check input value
      const inputValue = await addressInput.inputValue();
      console.log('📍 Input value after click:', inputValue);
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-error-debug.png', fullPage: true });
  
  console.log('🔍 Error debug complete');
});
