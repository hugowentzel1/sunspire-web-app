import { test, expect } from '@playwright/test';

test('Debug brand colors', async ({ page }) => {
  console.log('🔍 Debugging brand colors...');
  
  // Test Tesla
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check what's in localStorage
  const localStorageData = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('📦 localStorage data:', localStorageData);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    // @ts-ignore
    return window.__brandState || 'Not found';
  });
  console.log('🎨 Brand state:', brandState);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      brand: getComputedStyle(root).getPropertyValue('--brand').trim(),
      brand2: getComputedStyle(root).getPropertyValue('--brand-2').trim(),
      brandPrimary: getComputedStyle(root).getPropertyValue('--brand-primary').trim(),
    };
  });
  console.log('🎨 CSS variables:', cssVars);
  
  // Check if BrandCSSInjector is working
  const injectorWorking = await page.evaluate(() => {
    const root = document.documentElement;
    const brand = getComputedStyle(root).getPropertyValue('--brand').trim();
    return brand !== '#FF7A00' && brand !== '';
  });
  console.log('🔧 BrandCSSInjector working:', injectorWorking);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-brand-colors.png', fullPage: true });
});