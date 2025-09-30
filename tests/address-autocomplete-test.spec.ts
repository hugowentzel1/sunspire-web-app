import { test, expect } from '@playwright/test';

test.describe('Address Autocomplete Test', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';

  test('Address autocomplete works correctly', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Type in address input
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await addressInput.fill('123 Main St Phoenix');
    
    // Wait for autocomplete suggestions to appear
    const suggestions = page.locator('[data-autosuggest]');
    await expect(suggestions).toBeVisible({ timeout: 10000 });
    console.log('✅ Autocomplete suggestions appeared');
    
    // Check if suggestions contain expected text
    const firstSuggestion = suggestions.locator('div').first();
    await expect(firstSuggestion).toBeVisible();
    console.log('✅ First suggestion visible');
    
    // Click on first suggestion
    await firstSuggestion.click();
    console.log('✅ Clicked on first suggestion');
    
    // Click the generate button to navigate to report page
    const generateButton = page.locator('button[data-cta-button]').filter({ hasText: 'Launch My Branded Tool' });
    await generateButton.click();
    console.log('✅ Clicked generate button');
    
    // Should navigate to report page
    await page.waitForURL(/.*\/report/, { timeout: 10000 });
    console.log('✅ Navigated to report page');
    
    // Verify report page loaded
    await expect(page.locator('h1')).toBeVisible();
    console.log('✅ Report page loaded successfully');
  });

  test('Address autocomplete with different cities', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    const testAddresses = [
      '123 Main St San Diego',
      '456 Oak Ave Los Angeles',
      '789 Pine St Miami'
    ];
    
    for (const address of testAddresses) {
      console.log(`Testing address: ${address}`);
      
      const addressInput = page.locator('input[placeholder*="Start typing"]');
      await addressInput.clear();
      await addressInput.fill(address);
      
      // Wait for autocomplete suggestions
      const suggestions = page.locator('[data-autosuggest]');
      await expect(suggestions).toBeVisible({ timeout: 10000 });
      
      // Click first suggestion
      const firstSuggestion = suggestions.locator('div').first();
      await firstSuggestion.click();
      
      // Click the generate button to navigate to report page
      const generateButton = page.locator('button[data-cta-button]').filter({ hasText: 'Launch My Branded Tool' });
      await generateButton.click();
      
      // Should navigate to report page
      await page.waitForURL(/.*\/report/, { timeout: 10000 });
      console.log(`✅ Successfully processed: ${address}`);
      
      // Go back for next test
      await page.goBack({ waitUntil: 'networkidle' });
    }
  });
});
