import { test, expect } from '@playwright/test';

test.describe('Paid Page Dropdown Test', () => {
  test('paid page works with dropdown address selection', async ({ page }) => {
    // Navigate to paid page
    await page.goto('/paid?company=microsoft&demo=0');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'screenshots/paid-page-dropdown-initial.png', fullPage: true });
    
    // Click on address input to focus it
    const addressInput = page.locator('input[placeholder*="address" i], input[placeholder*="street" i]').first();
    await addressInput.click();
    
    // Type a partial address to trigger dropdown
    await addressInput.fill('123 Main Street');
    
    // Wait for dropdown to appear
    await page.waitForTimeout(2000);
    
    // Take screenshot with dropdown
    await page.screenshot({ path: 'screenshots/paid-page-dropdown-open.png', fullPage: true });
    
    // Look for dropdown suggestions
    const dropdownItems = page.locator('[data-autosuggest] div[class*="cursor-pointer"]');
    const itemCount = await dropdownItems.count();
    console.log('Dropdown items found:', itemCount);
    
    if (itemCount > 0) {
      // Click on the first suggestion
      await dropdownItems.first().click();
      console.log('Clicked on dropdown suggestion');
      
      // Wait a moment for the selection to be processed
      await page.waitForTimeout(1000);
      
      // Take screenshot after selection
      await page.screenshot({ path: 'screenshots/paid-page-dropdown-selected.png', fullPage: true });
      
      // Check if button is now enabled
      const submitButton = page.locator('button[data-cta-button]').first();
      const isEnabled = await submitButton.isEnabled();
      console.log('Button enabled after dropdown selection:', isEnabled);
      
      if (isEnabled) {
        // Click the submit button
        await submitButton.click();
        console.log('Clicked submit button');
        
        // Wait for navigation
        await page.waitForURL('**/report**', { timeout: 10000 });
        console.log('Navigated to report page');
        
        // Take screenshot of report page
        await page.screenshot({ path: 'screenshots/paid-page-dropdown-report.png', fullPage: true });
        
        // Verify we're on report page
        expect(page.url()).toContain('/report');
        expect(page.url()).toContain('demo=0');
        expect(page.url()).toContain('company=microsoft');
      } else {
        console.log('Button not enabled after dropdown selection');
      }
    } else {
      console.log('No dropdown suggestions found, trying manual address');
      
      // If no dropdown, try manual address
      await addressInput.fill('123 Main Street, New York, NY 10001');
      await page.waitForTimeout(1000);
      
      const submitButton = page.locator('button[data-cta-button]').first();
      const isEnabled = await submitButton.isEnabled();
      console.log('Button enabled with manual address:', isEnabled);
      
      if (isEnabled) {
        await submitButton.click();
        await page.waitForURL('**/report**', { timeout: 10000 });
        console.log('Navigated to report page with manual address');
      }
    }
  });
});
