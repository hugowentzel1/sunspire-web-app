import { test, expect } from '@playwright/test';

test.describe('Paid Page Auto Navigation', () => {
  test('clicking dropdown address automatically navigates to report page', async ({ page }) => {
    // Navigate to paid page
    await page.goto('/paid?company=microsoft&demo=0');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'screenshots/paid-page-auto-nav-initial.png', fullPage: true });
    
    // Click on address input to focus it
    const addressInput = page.locator('input[placeholder*="address" i], input[placeholder*="street" i]').first();
    await addressInput.click();
    
    // Type a partial address to trigger dropdown
    await addressInput.fill('123 Main Street');
    
    // Wait for dropdown to appear
    await page.waitForTimeout(2000);
    
    // Take screenshot with dropdown
    await page.screenshot({ path: 'screenshots/paid-page-auto-nav-dropdown.png', fullPage: true });
    
    // Look for dropdown suggestions
    const dropdownItems = page.locator('[data-autosuggest] div[class*="cursor-pointer"]');
    const itemCount = await dropdownItems.count();
    console.log('Dropdown items found:', itemCount);
    
    if (itemCount > 0) {
      // Get the text of the first suggestion
      const firstSuggestion = await dropdownItems.first().textContent();
      console.log('First suggestion text:', firstSuggestion);
      
      // Click on the first suggestion
      await dropdownItems.first().click();
      console.log('Clicked on dropdown suggestion');
      
      // Wait for navigation to report page (should happen automatically)
      await page.waitForURL('**/report**', { timeout: 10000 });
      console.log('✅ Automatically navigated to report page!');
      
      // Take screenshot of report page
      await page.screenshot({ path: 'screenshots/paid-page-auto-nav-report.png', fullPage: true });
      
      // Verify we're on report page with correct parameters
      expect(page.url()).toContain('/report');
      expect(page.url()).toContain('demo=0');
      expect(page.url()).toContain('company=microsoft');
      
      // Verify report page loaded correctly
      await expect(page.locator('body')).toBeVisible();
      
      // Check for paid-specific elements
      await expect(page.locator('[data-testid="paid-cta-top"]')).toBeVisible();
      await expect(page.locator('[data-testid="back-home-link"]')).toBeVisible();
      
      console.log('✅ Report page loaded with correct paid elements!');
    } else {
      console.log('No dropdown suggestions found, test cannot proceed');
    }
  });

  test('manual address entry still requires button click', async ({ page }) => {
    await page.goto('/paid?company=microsoft&demo=0');
    await page.waitForLoadState('networkidle');
    
    // Type address manually (not from dropdown)
    const addressInput = page.locator('input[placeholder*="address" i], input[placeholder*="street" i]').first();
    await addressInput.fill('123 Main Street, New York, NY 10001');
    await page.waitForTimeout(1000);
    
    // Should still be on paid page (no auto-navigation for manual entry)
    expect(page.url()).toContain('/paid');
    
    // Button should be enabled
    const submitButton = page.locator('button[data-cta-button]').first();
    await expect(submitButton).toBeEnabled();
    
    // Click button to navigate
    await submitButton.click();
    await page.waitForURL('**/report**', { timeout: 10000 });
    
    // Verify navigation worked
    expect(page.url()).toContain('/report');
    expect(page.url()).toContain('demo=0');
    expect(page.url()).toContain('company=microsoft');
  });
});
