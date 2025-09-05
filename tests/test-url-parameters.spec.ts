import { test, expect } from '@playwright/test';

test('Test URL Parameters on Home Page', async ({ page }) => {
  console.log('🔍 Testing URL parameters on home page...');
  
  // Add cache busting parameter
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&cb=' + Date.now();
  
  // Clear ALL localStorage and sessionStorage
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  console.log('🔍 Loading Tesla report page...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click "New Analysis" button
  console.log('🔍 Clicking New Analysis button...');
  await page.click('text=New Analysis');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check URL parameters on home page
  const urlInfo = await page.evaluate(() => {
    const url = new URL(window.location.href);
    const params = {};
    for (const [key, value] of url.searchParams.entries()) {
      params[key] = value;
    }
    return {
      href: window.location.href,
      params: params,
      hasPrimary: url.searchParams.has('primary'),
      primaryValue: url.searchParams.get('primary')
    };
  });
  console.log('📊 Home page URL info:', urlInfo);
  
  // Check what useBrandColors is doing
  const brandColorsInfo = await page.evaluate(() => {
    const sp = new URLSearchParams(window.location.search);
    const primary = sp.get('primary');
    const a = primary && /^%23?[0-9a-fA-F]{6}$/.test(primary) ? decodeURIComponent(primary) : null;
    return {
      primary: primary,
      decoded: a,
      willApply: !!a
    };
  });
  console.log('📊 useBrandColors info:', brandColorsInfo);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand')
    };
  });
  console.log('🎨 CSS Variables:', cssVars);
  
  console.log('🎯 URL parameters test complete');
});
