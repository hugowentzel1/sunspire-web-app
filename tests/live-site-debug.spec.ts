import { test, expect } from '@playwright/test';

test('Live Site Debug - Fix All Issues', async ({ page }) => {
  console.log('🔧 Debugging live site issues...');
  
  // Test 1: Check Tesla branding and colors
  console.log('\n🔴 Testing Tesla branding details...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check if we're in demo mode
  const demoMode = await page.evaluate(() => {
    return document.querySelector('[data-demo="true"]') !== null;
  });
  console.log('🔍 Demo mode active:', demoMode);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    return (window as any).__BRAND_STATE__ || 'not found';
  });
  console.log('🔍 Brand state:', brandState);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand'),
      brand2: computedStyle.getPropertyValue('--brand-2')
    };
  });
  console.log('🎨 CSS variables:', cssVars);
  
  // Check CTA button styles
  const ctaButton = page.locator('button:has-text("Activate")').first();
  const ctaStyles = await ctaButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      background: styles.background,
      backgroundImage: styles.backgroundImage
    };
  });
  console.log('🔘 CTA button styles:', ctaStyles);
  
  // Test 2: Check address autocomplete
  console.log('\n📍 Testing address autocomplete details...');
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if Google Maps API is loaded
  const googleMapsLoaded = await page.evaluate(() => {
    return typeof (window as any).google !== 'undefined' && 
           typeof (window as any).google.maps !== 'undefined' &&
           typeof (window as any).google.maps.places !== 'undefined';
  });
  console.log('🗺️ Google Maps API loaded:', googleMapsLoaded);
  
  // Check for API key in script tags
  const apiKey = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src*="maps.googleapis.com"]'));
    return scripts.length > 0 ? 'found' : 'not found';
  });
  console.log('🔑 Google Maps API script found:', apiKey);
  
  // Test address input
  const addressInput = page.locator('input[placeholder*="address"]').first();
  await addressInput.click();
  await addressInput.fill('123 Main St');
  await page.waitForTimeout(5000);
  
  // Check for any error messages
  const errorMessages = await page.locator('.text-red-500, .text-red-600, .text-red-700, .bg-red-50, [class*="error"]').count();
  console.log('❌ Error messages found:', errorMessages);
  
  // Check console logs
  const consoleLogs = await page.evaluate(() => {
    return (window as any).consoleLogs || [];
  });
  console.log('📝 Console logs:', consoleLogs);
  
  // Test 3: Check demo limitation
  console.log('\n🔒 Testing demo limitation details...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check localStorage
  const quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Quota in localStorage:', quota);
  
  // Check if quota is being consumed
  const remaining = await page.evaluate(() => {
    const link = window.location.href;
    const map = JSON.parse(localStorage.getItem('demo_quota_v3') || '{}');
    return map[link] || 2;
  });
  console.log('🔢 Remaining quota:', remaining);
  
  // Test 4: Check Stripe checkout
  console.log('\n💳 Testing Stripe checkout details...');
  const ctaButton2 = page.locator('button:has-text("Activate")').first();
  
  // Listen for network requests
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('/api/stripe/create-checkout-session')
  );
  
  await ctaButton2.click();
  await page.waitForTimeout(3000);
  
  try {
    const response = await responsePromise;
    console.log('✅ Stripe checkout request made:', response.status());
    
    if (response.ok()) {
      const data = await response.json();
      console.log('✅ Stripe checkout response:', data);
    } else {
      console.log('❌ Stripe checkout failed:', response.status());
    }
  } catch (error) {
    console.log('❌ No Stripe checkout request made:', error);
  }
  
  // Check for error modals
  const errorModal = page.locator('text=Unable to start checkout');
  const hasErrorModal = await errorModal.isVisible();
  console.log('❌ Error modal visible:', hasErrorModal);
  
  // Take final screenshot
  await page.screenshot({ path: 'live-site-debug.png' });
  console.log('📸 Debug screenshot saved as live-site-debug.png');
  
  console.log('\n🎯 Live site debug complete!');
});
