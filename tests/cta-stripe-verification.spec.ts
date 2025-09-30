import { test, expect } from '@playwright/test';

test.describe('CTA Stripe Checkout Verification', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';
  const PAID_URL = 'http://localhost:3000/paid?company=Apple&brandColor=%23FF0000';

  test('Demo page CTAs route to Stripe', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA
    const [request1] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response1 = await request1.response();
    expect(response1?.status()).toBe(200);
    console.log('✅ Demo primary CTA routes to Stripe');
    
    // Go back and test secondary CTA
    await page.goBack({ waitUntil: 'networkidle' });
    
    const [request2] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta-button]').first().click(),
    ]);
    
    const response2 = await request2.response();
    expect(response2?.status()).toBe(200);
    console.log('✅ Demo secondary CTA routes to Stripe');
  });

  test('Paid page CTAs route to Stripe', async ({ page }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    console.log('✅ Paid page CTA routes to Stripe');
  });

  test('Report page CTAs route to Stripe', async ({ page }) => {
    const REPORT_URL = 'http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test';
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    console.log('✅ Report page CTA routes to Stripe');
  });

  test('Stripe checkout session creation', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Intercept the checkout request to verify data
    page.on('request', request => {
      if (request.url().includes('api/stripe/create-checkout-session')) {
        console.log('🔍 Stripe checkout request data:', request.postData());
      }
    });
    
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    const responseData = await response?.json();
    
    expect(response?.status()).toBe(200);
    expect(responseData.url).toContain('checkout.stripe.com');
    console.log('✅ Stripe checkout URL generated:', responseData.url);
  });
});
