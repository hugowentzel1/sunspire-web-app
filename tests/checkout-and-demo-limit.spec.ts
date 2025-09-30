import { test, expect } from '@playwright/test';

test.describe('Checkout Flow and Demo Run Limit', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';

  test('Complete checkout flow with quote.yourcompany.com redirect', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA routes to Stripe
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    const responseData = await response?.json();
    expect(responseData.url).toContain('checkout.stripe.com');
    console.log('✅ CTA routes to Stripe checkout');
    
    // Follow the redirect to Stripe checkout
    await page.goto(responseData.url, { waitUntil: 'networkidle' });
    
    // Verify we're on Stripe checkout page
    await expect(page.locator('text=Complete your payment')).toBeVisible({ timeout: 10000 });
    console.log('✅ Successfully redirected to Stripe checkout page');
    
    // Go back to test the activate page (simulate successful payment)
    await page.goto('http://localhost:3000/activate?session_id=cs_test_123', { waitUntil: 'networkidle' });
    
    // Verify activate page shows quote.yourcompany.com setup
    await expect(page.locator('text=Your Solar Tool is Ready!')).toBeVisible();
    await expect(page.locator('text=quote.yourcompany.com')).toBeVisible();
    console.log('✅ Activate page shows quote.yourcompany.com domain setup');
  });

  test('Demo run limit with green/red lock screen', async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    
    // Complete 2 demo runs to exhaust quota
    for (let i = 0; i < 2; i++) {
      console.log(`🔍 Starting demo run ${i + 1}`);
      
      // Fill address and get quote
      const addressInput = page.locator('input[placeholder*="Start typing"]');
      await addressInput.fill(`123 Main St Phoenix, AZ ${i}`);
      
      // Wait for autocomplete and click first suggestion
      const suggestions = page.locator('[data-autosuggest]');
      if (await suggestions.count() > 0) {
        await suggestions.locator('li').first().click();
        await page.waitForURL(/.*\/report/, { timeout: 5000 });
        console.log(`✅ Demo run ${i + 1} completed`);
        
        // Go back for next run
        if (i < 1) {
          await page.goBack({ waitUntil: 'networkidle' });
        }
      } else {
        console.log(`⚠️ No autocomplete suggestions for run ${i + 1}`);
      }
    }
    
    // On the third attempt, should show lock screen
    console.log('🔍 Attempting third run (should trigger lock screen)');
    
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await addressInput.fill('123 Main St Phoenix, AZ 3');
    
    const suggestions = page.locator('[data-autosuggest]');
    if (await suggestions.count() > 0) {
      await suggestions.locator('li').first().click();
      await page.waitForURL(/.*\/report/, { timeout: 5000 });
    }
    
    // Check for lock screen elements
    const lockScreen = page.locator('text=Demo limit reached');
    await expect(lockScreen).toBeVisible({ timeout: 5000 });
    console.log('✅ Lock screen appeared after demo limit');
    
    // Check for green/red comparison
    const redSection = page.locator('text=What You See Now');
    const greenSection = page.locator('text=What You Get Live');
    await expect(redSection).toBeVisible();
    await expect(greenSection).toBeVisible();
    console.log('✅ Green/red comparison sections visible');
    
    // Check for CTA in lock screen
    const lockCTA = page.locator('button[data-cta="primary"]').filter({ hasText: 'Activate on Your Domain' });
    await expect(lockCTA).toBeVisible();
    console.log('✅ Lock screen CTA visible');
  });

  test('Demo quota persistence across page reloads', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    
    // Complete one run
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await addressInput.fill('123 Main St Phoenix, AZ');
    
    const suggestions = page.locator('[data-autosuggest]');
    if (await suggestions.count() > 0) {
      await suggestions.locator('li').first().click();
      await page.waitForURL(/.*\/report/, { timeout: 5000 });
    }
    
    // Check quota in localStorage
    const quota = await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v3') || '{}');
      return map;
    });
    console.log('Quota after first run:', quota);
    
    // Reload page and check quota persists
    await page.reload({ waitUntil: 'networkidle' });
    
    const quotaAfterReload = await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v3') || '{}');
      return map;
    });
    console.log('Quota after reload:', quotaAfterReload);
    
    // Should have consumed one run
    expect(Object.values(quotaAfterReload)[0]).toBe(1);
    console.log('✅ Demo quota persists across page reloads');
  });

  test('Stripe checkout session metadata includes company info', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Intercept the checkout request to verify metadata
    let requestData: any = null;
    page.on('request', request => {
      if (request.url().includes('api/stripe/create-checkout-session')) {
        requestData = JSON.parse(request.postData() || '{}');
      }
    });
    
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    expect(requestData).toBeTruthy();
    expect(requestData.company).toBe('Netflix');
    expect(requestData.plan).toBe('starter');
    console.log('✅ Stripe checkout includes correct company metadata');
  });
});
