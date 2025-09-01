import { test, expect } from '@playwright/test';

test.describe('Debug Generate Button', () => {
  test('Debug generate button click', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Find the address input field
    const addressInput = page.locator('input[placeholder*="property address"]');
    const generateButton = page.locator('button:has-text("Generate Solar Intelligence Report")');
    
    await expect(addressInput).toBeVisible();
    await expect(generateButton).toBeVisible();

    // Enter an address
    await addressInput.fill('123 Main St, New York, NY 10001');
    
    // Check if button is enabled
    await expect(generateButton).not.toBeDisabled();
    
    // Listen for console logs
    page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
    
    // Click the generate button
    console.log('Clicking generate button...');
    await generateButton.click();
    
    // Wait a moment and check current URL
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);
    
    // Check if we're still on the same page
    if (currentUrl.includes('localhost:3000') && !currentUrl.includes('/report')) {
      console.log('❌ Button click did not navigate to report page');
      
      // Check if there are any error messages on the page
      const errorMessages = page.locator('.error, .alert, [role="alert"]');
      const hasErrors = await errorMessages.count();
      if (hasErrors > 0) {
        console.log('Found error messages:', await errorMessages.allTextContents());
      }
      
      // Check if button is still there
      const buttonStillThere = await generateButton.isVisible();
      console.log('Button still visible:', buttonStillThere);
      
    } else {
      console.log('✅ Successfully navigated to report page');
    }
  });
});
