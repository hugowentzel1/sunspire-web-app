import { test, expect } from '@playwright/test';

test.describe('Core Functionality Tests', () => {
  test('Stripe checkout should work', async ({ page }) => {
    // Test that the Stripe checkout endpoint works
    const response = await page.request.post('/api/stripe/create-checkout-session', {
      data: {
        companyHandle: 'demo',
        plan: 'starter',
        payerEmail: 'test@example.com'
      }
    });
    
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.url).toContain('checkout.stripe.com');
  });

  test('Airtable lead submission should work', async ({ page }) => {
    // Test that lead submission works
    const response = await page.request.post('/api/submit-lead', {
      data: {
        name: 'Test Lead',
        email: 'test@example.com',
        address: '123 Main St',
        tenant: 'demo'
      }
    });
    
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.leadId).toBeDefined();
  });

  test('Google autocomplete API should return client-side message', async ({ page }) => {
    // Test that autocomplete API returns the expected message
    const response = await page.request.get('/api/autocomplete?q=San%20Fra');
    
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.clientSide).toBe(true);
    expect(data.message).toContain('client-side implementation');
  });

  test('Rate limiting should work', async ({ page }) => {
    // Test rate limiting by making multiple requests to the rate-limited route
    const responses = [];
    
    for (let i = 0; i < 25; i++) {
      const response = await page.request.post('/api/leads/upsert', {
        data: {
          email: `rate${i}@test.com`,
          companyHandle: 'demo',
          address: '1 Test St'
        }
      });
      responses.push(response);
    }
    
    // Check that we get rate limited after 20 requests
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('Health endpoint should show all services as OK', async ({ page }) => {
    const response = await page.request.get('/api/health');
    
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.env.STRIPE_PRICE_MONTHLY_99).toBe('!!');
    expect(data.env.STRIPE_PRICE_SETUP_399).toBe('!!');
  });

  test('Outreach redirect should work', async ({ page }) => {
    // Test that the outreach redirect route redirects (either 302 or 200 with redirect)
    const response = await page.request.get('/r/test123');
    
    // The route should either redirect (302) or return home page (200) if token not found
    expect([200, 302]).toContain(response.status());
    
    if (response.status() === 200) {
      // If it returns 200, it should be the home page
      const text = await response.text();
      expect(text).toContain('Sunspire');
    }
  });

  test('Status page should load', async ({ page }) => {
    await page.goto('/status');
    
    // Check that the page loads without errors
    await expect(page.locator('body')).toBeVisible();
    
    // Check for loading text
    const loadingText = page.locator('text=Checking system status');
    await expect(loadingText).toBeVisible();
  });

  test('SEO files should work', async ({ page }) => {
    // Test robots.txt
    const robotsResponse = await page.request.get('/robots.txt');
    expect(robotsResponse.ok()).toBe(true);
    const robotsText = await robotsResponse.text();
    expect(robotsText).toContain('User-Agent: *');
    expect(robotsText).toContain('Disallow: /demo');
    
    // Test sitemap.xml
    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBe(true);
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('<?xml version="1.0"');
    expect(sitemapText).toContain('/status');
  });

  test('Security headers should be present', async ({ page }) => {
    const response = await page.request.get('/');
    
    expect(response.headers()['x-frame-options']).toBe('DENY');
    expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(response.headers()['content-security-policy']).toBeDefined();
    expect(response.headers()['permissions-policy']).toBeDefined();
  });
});
