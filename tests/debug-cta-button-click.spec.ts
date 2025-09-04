import { test, expect } from '@playwright/test';

test('Debug CTA button click in LockOverlay', async ({ page }) => {
  console.log('🔍 Debugging CTA button click...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.clear());
  
  // Navigate to demo page and exhaust quota
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Navigate away and back to trigger second run
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Navigate away and back to trigger third run (should show lock overlay)
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked');
  await expect(lockOverlay).toBeVisible();
  
  // Listen for console logs
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Listen for network requests
  const requests: string[] = [];
  page.on('request', request => {
    requests.push(`${request.method()} ${request.url()}`);
  });
  
  // Listen for page navigation
  const navigations: string[] = [];
  page.on('response', response => {
    if (response.url().includes('checkout.stripe.com')) {
      navigations.push(`Redirected to: ${response.url()}`);
    }
  });
  
  // Find and click the CTA button
  const ctaButton = page.locator('button:has-text("Activate")').first();
  await expect(ctaButton).toBeVisible();
  
  console.log('🖱️ Clicking CTA button...');
  
  // Click the button and wait for any response
  const [response] = await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/stripe/create-checkout-session')
    ).catch(() => null),
    ctaButton.click()
  ]);
  
  // Wait a moment for any async operations
  await page.waitForTimeout(3000);
  
  console.log('📝 Console logs:', consoleLogs);
  console.log('🌐 Network requests:', requests);
  console.log('🔗 Navigations:', navigations);
  
  if (response) {
    console.log('✅ Stripe API responded');
    const responseData = await response.json();
    console.log('📦 Response data:', responseData);
  } else {
    console.log('❌ No response from Stripe API');
  }
  
  // Check current URL
  const currentUrl = page.url();
  console.log('🔗 Current URL:', currentUrl);
  
  // Check if we were redirected
  if (currentUrl.includes('checkout.stripe.com')) {
    console.log('✅ Successfully redirected to Stripe!');
  } else {
    console.log('❌ Not redirected to Stripe');
  }
});
