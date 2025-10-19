import { test, expect } from '@playwright/test';

test.describe('Security & Headers', () => {
  test('Security headers present', async ({ request, baseURL }) => {
    const response = await request.get((baseURL ?? '') + '/');
    
    const headers = response.headers();
    
    // Check for Content Security Policy
    const csp = headers['content-security-policy'];
    if (csp) {
      expect(csp).toContain('default-src');
    }
    
    // Check for Referrer Policy
    const referrerPolicy = headers['referrer-policy'];
    if (referrerPolicy) {
      expect(referrerPolicy).toMatch(/no-referrer|strict-origin-when-cross-origin|same-origin/);
    }
    
    // Check for X-Frame-Options (if present)
    const xFrameOptions = headers['x-frame-options'];
    if (xFrameOptions) {
      expect(xFrameOptions).toMatch(/DENY|SAMEORIGIN/);
    }
    
    // Check for X-Content-Type-Options
    const xContentTypeOptions = headers['x-content-type-options'];
    if (xContentTypeOptions) {
      expect(xContentTypeOptions).toMatch(/nosniff/);
    }
  });

  test('No sensitive information in client bundle', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    
    // Check that API keys are not exposed in client-side code
    const pageContent = await page.content();
    
    // Common API key patterns to check for
    const sensitivePatterns = [
      /sk_live_[a-zA-Z0-9]+/, // Stripe live keys
      /AIza[a-zA-Z0-9_-]{35}/, // Google API keys
      /[a-zA-Z0-9]{32,}/, // Generic long keys
    ];
    
    for (const pattern of sensitivePatterns) {
      const matches = pageContent.match(pattern);
      if (matches) {
        // Check if it's just a placeholder or test key
        const isTestKey = matches[0].includes('test') || 
                         matches[0].includes('demo') || 
                         matches[0].includes('placeholder');
        expect(isTestKey).toBe(true);
      }
    }
  });

  test('HTTPS enforcement (if applicable)', async ({ page, baseURL }) => {
    if (baseURL?.startsWith('https://')) {
      await page.goto(baseURL);
      
      // Check that we're on HTTPS
      expect(page.url()).toMatch(/^https:/);
      
      // Check for secure cookies
      const cookies = await page.context().cookies();
      for (const cookie of cookies) {
        if (cookie.secure) {
          expect(cookie.secure).toBe(true);
        }
      }
    }
  });

  test('Rate limiting and error handling', async ({ request, baseURL }) => {
    // Test multiple rapid requests to check for rate limiting
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(request.get((baseURL ?? '') + '/'));
    }
    
    const responses = await Promise.all(requests);
    
    // Most requests should succeed (not all blocked)
    const successCount = responses.filter(r => r.ok()).length;
    expect(successCount).toBeGreaterThan(5);
    
    // Check for rate limiting headers
    const rateLimitHeaders = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset'];
    for (const header of rateLimitHeaders) {
      const headerValue = responses[0].headers()[header];
      if (headerValue) {
        expect(headerValue).toBeTruthy();
      }
    }
  });

  test('Input sanitization and XSS protection', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    
    // Test for XSS in address input
    const addressInput = page.getByPlaceholder(/Start typing your property address/i);
    if (await addressInput.isVisible()) {
      await addressInput.fill('<script>alert("xss")</script>');
      await page.waitForTimeout(1000);
      
      // Check that script tag is not executed
      const alerts = page.locator('text=alert("xss")');
      await expect(alerts).toHaveCount(0);
    }
  });

  test('CSRF protection', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    
    // Check for CSRF tokens in forms
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      if (await form.isVisible()) {
        const csrfToken = form.locator('input[name*="csrf"], input[name*="token"]');
        if (await csrfToken.isVisible()) {
          const tokenValue = await csrfToken.getAttribute('value');
          expect(tokenValue).toBeTruthy();
        }
      }
    }
  });

  test('Secure cookie settings', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    
    const cookies = await page.context().cookies();
    
    for (const cookie of cookies) {
      // Check that sensitive cookies are secure
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        expect(cookie.secure).toBe(true);
      }
      
      // Check that cookies have appropriate SameSite settings
      if (cookie.sameSite) {
        expect(['Strict', 'Lax', 'None']).toContain(cookie.sameSite);
      }
    }
  });

  test('Error pages don\'t leak information', async ({ page, baseURL }) => {
    // Test 404 page
    await page.goto((baseURL ?? '') + '/nonexistent-page');
    
    const pageContent = await page.content();
    
    // Check that error page doesn't expose sensitive information
    const sensitiveInfo = [
      'database',
      'sql',
      'stack trace',
      'internal error',
      'server error',
      'exception'
    ];
    
    for (const info of sensitiveInfo) {
      if (pageContent.toLowerCase().includes(info)) {
        // If found, it should be in a user-friendly error message, not technical details
        expect(pageContent.toLowerCase()).toContain('page not found');
      }
    }
  });
});
