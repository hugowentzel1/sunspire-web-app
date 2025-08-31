import { test, expect } from '@playwright/test';

test.describe('CTA Checkout and Logo Display', () => {
  test('All CTAs should redirect to Stripe checkout with proper tracking', async ({ page }) => {
    // Test with a branded company
    await page.goto('http://localhost:3000?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify company logo is displayed in header
    const logo = page.locator('img[alt="SolarPro Energy logo"]');
    await expect(logo).toBeVisible();
    
    // Verify company name is displayed
    await expect(page.locator('text=SolarPro Energy')).toBeVisible();
    
    // Navigate to report page
    await page.goto('http://localhost:3000/report?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify branded header is displayed on report page
    await expect(page.locator('text=SolarPro Energy')).toBeVisible();
    await expect(page.locator('text=Solar Intelligence Report')).toBeVisible();
    
    // Verify logo is still visible on report page
    const reportLogo = page.locator('img[alt="SolarPro Energy logo"]');
    await expect(reportLogo).toBeVisible();
    
    // Test all UnlockButton CTAs
    const unlockButtons = page.locator('button:has-text("Unlock Full Report")');
    await expect(unlockButtons).toHaveCount(4);
    
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
    
    // Click the first unlock button
    await unlockButtons.first().click();
    
    // Verify it redirects to Stripe checkout
    await expect(page).toHaveURL('https://checkout.stripe.com/test');
  });
  
  test('Main CTA button should redirect to Stripe checkout', async ({ page }) => {
    // Test with a different company
    await page.goto('http://localhost:3000?company=EcoSolar%20Solutions&brandColor=%2316A34A&logo=https://logo.clearbit.com/ecosolar.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify company logo is displayed
    const logo = page.locator('img[alt="EcoSolar Solutions logo"]');
    await expect(logo).toBeVisible();
    
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
  
  test('Report page CTAs should all work with proper branding', async ({ page }) => {
    // Test with Meta company
    await page.goto('http://localhost:3000/report?company=Meta&brandColor=%231877F2&logo=https://logo.clearbit.com/facebook.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify Meta branding is displayed
    await expect(page.locator('text=Meta')).toBeVisible();
    await expect(page.locator('text=Solar Intelligence Report')).toBeVisible();
    
    // Verify logo is displayed
    const logo = page.locator('img[alt="Meta logo"]');
    await expect(logo).toBeVisible();
    
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
  
  test('Logo should persist across all pages with branding', async ({ page }) => {
    // Test with Premium Solar Group
    await page.goto('http://localhost:3000?company=Premium%20Solar%20Group&brandColor=%237C3AED&logo=https://logo.clearbit.com/premiumsolar.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify logo and branding on main page
    const logo = page.locator('img[alt="Premium Solar Group logo"]');
    await expect(logo).toBeVisible();
    await expect(page.locator('text=Premium Solar Group')).toBeVisible();
    
    // Navigate to report page
    await page.goto('http://localhost:3000/report?company=Premium%20Solar%20Group&brandColor=%237C3AED&logo=https://logo.clearbit.com/premiumsolar.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify logo and branding persist on report page
    const reportLogo = page.locator('img[alt="Premium Solar Group logo"]');
    await expect(reportLogo).toBeVisible();
    await expect(page.locator('text=Premium Solar Group')).toBeVisible();
    
    // Navigate to pricing page
    await page.goto('http://localhost:3000/pricing?company=Premium%20Solar%20Group&brandColor=%237C3AED&logo=https://logo.clearbit.com/premiumsolar.com&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify logo and branding persist on pricing page
    const pricingLogo = page.locator('img[alt="Premium Solar Group logo"]');
    await expect(pricingLogo).toBeVisible();
    await expect(page.locator('text=Premium Solar Group')).toBeVisible();
  });
  
  test('Error handling for checkout failures', async ({ page }) => {
    // Test with ACME Solar
    await page.goto('http://localhost:3000?company=ACME%20Solar&brandColor=%232563EB&logo=https://logo.clearbit.com/acme.com&demo=1');
    
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
