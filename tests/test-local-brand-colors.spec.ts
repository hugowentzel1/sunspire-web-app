import { test, expect } from '@playwright/test';

test('Test brand colors locally', async ({ page }) => {
  console.log('🏠 Testing brand colors locally...');
  
  // Listen to console logs
  const logs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('useBrandTakeover')) {
      logs.push(msg.text());
    }
  });
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Test Tesla
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📝 Console logs:');
  logs.forEach(log => console.log('  ', log));
  
  // Check localStorage
  const localStorageData = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('📦 localStorage:', localStorageData);
  
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
  
  // Verify Tesla should be red
  expect(cssVars.brand).toBe('#CC0000');
  console.log('✅ Tesla brand color is correct!');
});
