import { test, expect } from '@playwright/test';

test.describe('Test Local Address', () => {
  test('Test address autocomplete locally', async ({ page }) => {
    console.log('🌐 Testing address autocomplete locally...');
    
    // Go to local demo site
    await page.goto('http://localhost:3000/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find address input
    const addressInput = page.locator('input[placeholder*="address"]');
    await expect(addressInput).toBeVisible();
    console.log('✅ Address input visible');
    
    // Type in address
    await addressInput.fill('123 Main St San Francisco CA');
    await page.waitForTimeout(2000);
    
    // Check if autocomplete appears
    const autocomplete = page.locator('[data-autosuggest]');
    const autocompleteVisible = await autocomplete.isVisible();
    console.log(`Autocomplete visible: ${autocompleteVisible}`);
    
    if (autocompleteVisible) {
      // Get all suggestions
      const suggestions = autocomplete.locator('div');
      const suggestionCount = await suggestions.count();
      console.log(`Suggestions found: ${suggestionCount}`);
      
      for (let i = 0; i < suggestionCount; i++) {
        const suggestion = suggestions.nth(i);
        const text = await suggestion.textContent();
        console.log(`Suggestion ${i}: "${text}"`);
      }
      
      // Click first suggestion
      if (suggestionCount > 0) {
        await suggestions.first().click();
        console.log('✅ Clicked first suggestion');
        
        // Wait for form to update
        await page.waitForTimeout(3000);
        
        // Check current URL
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/report')) {
          console.log('✅ Successfully navigated to report page');
        } else {
          console.log('❌ Did not navigate to report page');
        }
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-local-address.png' });
    console.log('📸 Screenshot saved: test-local-address.png');
  });
});
