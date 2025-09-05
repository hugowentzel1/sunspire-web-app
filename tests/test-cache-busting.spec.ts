import { test, expect } from '@playwright/test';

test('Test with Cache Busting', async ({ page }) => {
  console.log('🔍 Testing with cache busting...');
  
  // Add cache busting parameter
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&cb=' + Date.now();
  
  // Clear ALL localStorage and sessionStorage
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  console.log('🔍 Loading Tesla report page with cache busting...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check brand state on report page
  const reportBrandState = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand'),
      localStorage: localStorage.getItem('sunspire-brand-takeover')
    };
  });
  console.log('📊 Report page brand state:', reportBrandState);
  
  // Check if the stored brand state has the correct Tesla red
  if (reportBrandState.localStorage) {
    const parsed = JSON.parse(reportBrandState.localStorage);
    console.log('📊 Stored primary color:', parsed.primary);
    console.log('📊 Expected Tesla red: #CC0000');
    console.log('📊 Color match:', parsed.primary === '#CC0000' ? '✅' : '❌');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'cache-busting-test.png' });
  
  console.log('🎯 Cache busting test complete');
});
