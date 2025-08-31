import { test, expect } from '@playwright/test';

test.describe('CTA Checkout Functionality', () => {
  test('Main CTA button should redirect to Stripe checkout', async ({ page }) => {
    // Test with a simple company parameter
    await page.goto('http://localhost:3000?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
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
    await mainCTA.click();
    
    // Verify it redirects to Stripe checkout
    await expect(page).toHaveURL('https://checkout.stripe.com/test');
  });
  
  test('Report page unlock buttons should redirect to Stripe checkout', async ({ page }) => {
    // Navigate to report page
    await page.goto('http://localhost:3000/report?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Mock Stripe API
    await page.route('**/api/stripe/create-checkout-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/test'
        })
      });
    });
    
    // Test all UnlockButton CTAs
    const unlockButtons = page.locator('button:has-text("Unlock Full Report")');
    await expect(unlockButtons).toHaveCount(4);
    
    // Click the first unlock button
    await unlockButtons.first().click();
    
    // Verify redirect to Stripe
    await expect(page).toHaveURL('https://checkout.stripe.com/test');
  });
  
  test('Report page main CTA should redirect to Stripe checkout', async ({ page }) => {
    // Navigate to report page
    await page.goto('http://localhost:3000/report?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Mock Stripe API
    await page.route('**/api/stripe/create-checkout-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/test'
        })
      });
    });
    
    // Test the main CTA button in the bottom section
    const mainCTA = page.locator('button:has-text("Unlock Full Report - $99/mo + $399")');
    await expect(mainCTA).toBeVisible();
    await mainCTA.click();
    
    // Verify redirect to Stripe
    await expect(page).toHaveURL('https://checkout.stripe.com/test');
  });
  
  test('Error handling for checkout failures', async ({ page }) => {
    // Test with simple company
    await page.goto('http://localhost:3000?company=TestCompany&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
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
    await mainCTA.click();
    
    // Verify error alert is shown
    const alertPromise = page.waitForEvent('dialog');
    const dialog = await alertPromise;
    expect(dialog.message()).toContain('Unable to start checkout');
    await dialog.accept();
  });
});
