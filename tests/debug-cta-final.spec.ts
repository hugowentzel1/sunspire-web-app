import { test, expect } from '@playwright/test';

test('Debug CTA button click - final test', async ({ page }) => {
  console.log('🔍 Final CTA button debug...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.clear());
  
  // Navigate to demo page and exhaust quota quickly
  for (let i = 0; i < 3; i++) {
    await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked');
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  if (!isLockVisible) {
    console.log('❌ Lock overlay not visible');
    return;
  }
  
  // Find the CTA button by text content
  const ctaButton = page.locator('button').filter({ hasText: 'Launch Your Solar Tool' });
  const isButtonVisible = await ctaButton.isVisible();
  console.log('🔘 CTA button visible:', isButtonVisible);
  
  if (!isButtonVisible) {
    console.log('❌ CTA button not found');
    return;
  }
  
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
  
  console.log('🖱️ Clicking CTA button...');
  
  // Click the button and wait for any response
  const [response] = await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/stripe/create-checkout-session')
    ).catch(() => null),
    ctaButton.click()
  ]);
  
  // Wait for any async operations
  await page.waitForTimeout(2000);
  
  console.log('📝 Console logs:', consoleLogs);
  console.log('🌐 Network requests:', requests);
  
  if (response) {
    console.log('✅ Stripe API responded');
    const responseData = await response.json();
    console.log('📦 Response data:', responseData);
    
    if (responseData.url) {
      console.log('✅ Got Stripe checkout URL:', responseData.url);
    }
  } else {
    console.log('❌ No response from Stripe API');
  }
  
  const currentUrl = page.url();
  console.log('🔗 Current URL after click:', currentUrl);
  
  if (currentUrl.includes('checkout.stripe.com')) {
    console.log('✅ Successfully redirected to Stripe!');
  } else {
    console.log('❌ Not redirected to Stripe');
  }
});
