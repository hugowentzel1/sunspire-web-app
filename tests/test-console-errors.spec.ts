import { test, expect } from '@playwright/test';

test.describe('Test Console Errors', () => {
  test('Check for console errors on live site', async ({ page }) => {
    console.log('🌐 Checking console errors on LIVE site...');
    
    const consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`❌ Console error: ${msg.text()}`);
      }
    });
    
    // Go to live demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find address input and type address
    const addressInput = page.locator('input[placeholder*="address"]');
    await addressInput.fill('123 Main St San Francisco CA');
    await page.waitForTimeout(2000);
    
    // Click first autocomplete suggestion
    const autocomplete = page.locator('[data-autosuggest]');
    const suggestions = autocomplete.locator('div');
    await suggestions.first().click();
    console.log('✅ Clicked first suggestion');
    
    // Wait for form to update
    await page.waitForTimeout(2000);
    
    // Find and click launch button
    const launchButton = page.locator('button').filter({ hasText: 'Launch on Netflix' });
    await launchButton.click();
    console.log('✅ Clicked launch button');
    
    // Wait for any potential errors
    await page.waitForTimeout(3000);
    
    console.log(`Total console errors: ${consoleErrors.length}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-console-errors.png' });
    console.log('📸 Screenshot saved: test-console-errors.png');
  });
});
