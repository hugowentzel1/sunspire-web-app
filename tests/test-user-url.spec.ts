import { test, expect } from '@playwright/test';

test('Test User Provided URL - Check Why Demo Features Not Working', async ({ page }) => {
  console.log('🔍 Testing the exact URL provided by user...');
  
  // Test the exact URL the user provided
  const userUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo';
  console.log('🌐 Testing URL:', userUrl);
  
  await page.goto(userUrl);
  await page.waitForLoadState('networkidle');
  
  // Check what parameters are detected
  const urlParams = await page.evaluate(() => {
    const url = new URL(window.location.href);
    return {
      company: url.searchParams.get('company'),
      demo: url.searchParams.get('demo'),
      address: url.searchParams.get('address'),
      lat: url.searchParams.get('lat'),
      lng: url.searchParams.get('lng'),
      placeId: url.searchParams.get('placeId')
    };
  });
  
  console.log('📋 URL Parameters detected:', urlParams);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('brandTakeover');
    return stored ? JSON.parse(stored) : null;
  });
  
  console.log('🎨 Brand takeover state:', brandState);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand')
    };
  });
  
  console.log('🎨 CSS variables:', cssVars);
  
  // Check if CTA buttons exist and their colors
  const ctaButtons = await page.locator('[data-cta="primary"]').all();
  console.log('🔘 CTA buttons found:', ctaButtons.length);
  
  if (ctaButtons.length > 0) {
    const ctaColor = await ctaButtons[0].evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });
    console.log('🔘 CTA button color:', ctaColor);
  }
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('[data-testid="lock-overlay"], .lock-overlay, [class*="lock"]').first();
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  console.log('\n🎯 DIAGNOSIS:');
  if (!urlParams.company) {
    console.log('❌ Missing company parameter - this is why branding is not working');
  }
  if (!urlParams.demo) {
    console.log('❌ Missing demo parameter - this is why demo features are not working');
  }
  
  console.log('\n✅ CORRECT URLS TO TEST:');
  console.log('Tesla: https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  console.log('Apple: https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  console.log('Netflix: https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1');
  
  // Take screenshot
  await page.screenshot({ path: 'test-user-url.png', fullPage: true });
  console.log('📸 Screenshot saved');
});
