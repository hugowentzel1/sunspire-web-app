import { test, expect } from '@playwright/test';

test.describe('Test Address Input', () => {
  test('Test address input functionality', async ({ page }) => {
    console.log('🌐 Testing address input on LIVE site...');
    
    // Go to live demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
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
        await page.waitForTimeout(2000);
        
        // Check if any button text changed
        const allButtons = page.locator('button');
        const buttonCount = await allButtons.count();
        console.log(`Total buttons after selection: ${buttonCount}`);
        
        for (let i = 0; i < buttonCount; i++) {
          const button = allButtons.nth(i);
          const text = await button.textContent();
          if (text && text.includes('Launch')) {
            console.log(`Found Launch button: "${text}"`);
          }
        }
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-address-input.png' });
    console.log('📸 Screenshot saved: test-address-input.png');
  });
});
