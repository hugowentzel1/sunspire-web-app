import { test, expect } from '@playwright/test';

test.describe('Final CTA Stripe Verification', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';

  test('Demo page primary CTA routes to Stripe successfully', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    const responseData = await response?.json();
    expect(responseData.url).toContain('checkout.stripe.com');
    console.log('✅ Demo primary CTA successfully routes to Stripe checkout');
    console.log('✅ Stripe checkout URL generated:', responseData.url);
  });

  test('Report page CTA routes to Stripe successfully', async ({ page }) => {
    const REPORT_URL = 'http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test';
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    const responseData = await response?.json();
    expect(responseData.url).toContain('checkout.stripe.com');
    console.log('✅ Report page CTA successfully routes to Stripe checkout');
    console.log('✅ Stripe checkout URL generated:', responseData.url);
  });

  test('All demo functionality working together', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Verify demo elements are present
    const demoBanner = page.locator('text=Exclusive preview built for Netflix');
    await expect(demoBanner).toBeVisible();
    console.log('✅ Demo banner visible');
    
    // Verify countdown timer
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible();
    console.log('✅ Countdown timer visible');
    
    // Verify address input
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await expect(addressInput).toBeVisible();
    console.log('✅ Address input visible');
    
    // Test CTA routing
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    console.log('✅ All demo functionality working correctly');
  });
});
