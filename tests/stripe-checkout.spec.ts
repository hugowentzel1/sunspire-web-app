import { test, expect } from '@playwright/test';

test.describe('Stripe checkout flow', () => {
  test('Demo unlock → Stripe test → success → unlock content', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click unlock button
    const unlockButton = page.getByRole('button', { name: /Unlock Full Report/i }).first();
    await expect(unlockButton).toBeVisible();
    await unlockButton.click();

    // Should redirect to Stripe checkout or paywall
    await page.waitForTimeout(2000);
    
    // Check if we're on a Stripe checkout page or paywall
    const isStripeCheckout = page.url().includes('checkout.stripe.com') || page.url().includes('stripe');
    const isPaywall = page.url().includes('checkout') || page.url().includes('pricing') || page.url().includes('paywall');
    
    if (isStripeCheckout) {
      // Fill out Stripe test card
      await page.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
      await page.getByPlaceholder('MM / YY').fill('12 / 34');
      await page.getByPlaceholder('CVC').fill('123');
      await page.getByRole('button', { name: /Pay|Subscribe|Complete/i }).click();
      
      // Wait for payment processing
      await page.waitForTimeout(5000);
      
      // Should redirect back to report
      await expect(page).toHaveURL(/report/);
      
      // Check that content is no longer blurred
      await expect(page.locator('.blur-sm, .blur-md, .blur-lg')).toHaveCount(0);
      
    } else if (isPaywall) {
      // If it's a custom paywall, check that it has the expected elements
      await expect(page.locator('h1, h2, h3')).toBeVisible();
      await expect(page.getByText(/pricing|plan|subscription/i)).toBeVisible();
      
    } else {
      // If neither Stripe nor paywall, the unlock button might have different behavior
      // Just verify we're not on the same page with blur still present
      const stillBlurred = await page.locator('.blur-sm, .blur-md, .blur-lg').isVisible();
      expect(stillBlurred).toBe(false);
    }
  });

  test('Payment form validation', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&demo=1`);
    
    const unlockButton = page.getByRole('button', { name: /Unlock Full Report/i }).first();
    await unlockButton.click();
    
    await page.waitForTimeout(2000);
    
    // If we're on a payment form, test validation
    const cardInput = page.getByPlaceholder('Card number');
    if (await cardInput.isVisible()) {
      // Test invalid card number
      await cardInput.fill('1234 1234 1234 1234');
      await page.getByRole('button', { name: /Pay|Subscribe|Complete/i }).click();
      
      // Should show error
      await expect(page.locator('.error, .alert-error, [data-testid*="error"]')).toBeVisible();
    }
  });

  test('Address context preserved through payment flow', async ({ page, baseURL }) => {
    const testAddress = '123 W Peachtree St NW, Atlanta, GA 30309, USA';
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddress)}&demo=1`);
    
    const unlockButton = page.getByRole('button', { name: /Unlock Full Report/i }).first();
    await unlockButton.click();
    
    await page.waitForTimeout(2000);
    
    // Check that address is preserved in URL or form
    const currentUrl = page.url();
    expect(currentUrl).toContain(encodeURIComponent('Peachtree'));
  });
});
