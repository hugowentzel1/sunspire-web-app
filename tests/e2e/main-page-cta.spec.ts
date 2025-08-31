import { test, expect } from '@playwright/test';

test.describe('Main Page CTA Functionality', () => {
  test('Main CTA button should redirect to Stripe checkout', async ({ page }) => {
    // Test with a simple company parameter
    await page.goto('http://localhost:3000?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Enter an address to enable the button
    const addressInput = page.locator('input[placeholder*="address"]');
    await addressInput.fill('123 Main St, New York, NY');
    
    // Wait a moment for the input to process
    await page.waitForTimeout(1000);
    
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
    
    // Click the main CTA button
    const mainCTA = page.locator('[data-cta-button]');
    await expect(mainCTA).toBeVisible();
    await expect(mainCTA).toBeEnabled();
    await mainCTA.click();
    
    // Verify it redirects to Stripe checkout
    await expect(page).toHaveURL('https://checkout.stripe.com/test');
  });
  
  test('Error handling for checkout failures', async ({ page }) => {
    // Test with simple company
    await page.goto('http://localhost:3000?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Enter an address to enable the button
    const addressInput = page.locator('input[placeholder*="address"]');
    await addressInput.fill('123 Main St, New York, NY');
    
    // Wait a moment for the input to process
    await page.waitForTimeout(1000);
    
    // Mock Stripe API to return error
    await page.route('**/api/stripe/create-checkout-session', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Checkout failed'
        })
      });
    });
    
    // Click main CTA button
    const mainCTA = page.locator('[data-cta-button]');
    await expect(mainCTA).toBeVisible();
    await expect(mainCTA).toBeEnabled();
    await mainCTA.click();
    
    // Verify error alert is shown
    const alertPromise = page.waitForEvent('dialog');
    const dialog = await alertPromise;
    expect(dialog.message()).toContain('Unable to start checkout');
    await dialog.accept();
  });
  
  test('CTA button should show loading state', async ({ page }) => {
    // Test with simple company
    await page.goto('http://localhost:3000?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Enter an address to enable the button
    const addressInput = page.locator('input[placeholder*="address"]');
    await addressInput.fill('123 Main St, New York, NY');
    
    // Wait a moment for the input to process
    await page.waitForTimeout(1000);
    
    // Mock Stripe API to delay response
    await page.route('**/api/stripe/create-checkout-session', async route => {
      // Add a delay to simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/test'
        })
      });
    });
    
    // Click main CTA button
    const mainCTA = page.locator('[data-cta-button]');
    await expect(mainCTA).toBeVisible();
    await expect(mainCTA).toBeEnabled();
    await mainCTA.click();
    
    // Verify button shows loading state
    await expect(page.locator('text=Loading...')).toBeVisible();
  });
});
