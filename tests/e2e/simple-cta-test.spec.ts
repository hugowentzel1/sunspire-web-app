import { test, expect } from '@playwright/test';

test.describe('Simple CTA Test', () => {
  test('CTA button should exist and be clickable when enabled', async ({ page }) => {
    // Test with a simple company parameter
    await page.goto('http://localhost:3001?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the CTA button exists
    const mainCTA = page.locator('[data-cta-button]');
    await expect(mainCTA).toBeVisible();
    
    // Check if the button text is correct
    await expect(mainCTA).toContainText('Launch Tool');
    
    // Mock the fetch call to Stripe API
    await page.route('**/api/stripe/create-checkout-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/test'
        })
      });
    });
    
    // Click the button (it should be enabled for demo mode)
    await mainCTA.click();
    
    // Verify it redirects to Stripe checkout
    await expect(page).toHaveURL('https://checkout.stripe.com/test');
  });
  
  test('Page should show company branding', async ({ page }) => {
    // Test with a company that has a logo
    await page.goto('http://localhost:3001?company=SolarPro%20Energy&brandColor=%23059669&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if company name is displayed somewhere on the page
    await expect(page.locator('text=SolarPro Energy')).toBeVisible();
    
    // Check if the CTA button exists
    const mainCTA = page.locator('[data-cta-button]');
    await expect(mainCTA).toBeVisible();
  });
});
