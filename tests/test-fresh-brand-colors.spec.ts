import { test, expect } from '@playwright/test';

test('Test fresh brand colors with cleared localStorage', async ({ page }) => {
  console.log('🧹 Testing fresh brand colors...');
  
  // Clear localStorage first
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Test Tesla - should be red
  console.log('\n🚗 Testing Tesla brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check localStorage after fresh load
  const teslaLocalStorage = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('📦 Tesla localStorage:', teslaLocalStorage);
  
  // Check brand color CSS variable
  const teslaBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Tesla brand color:', teslaBrandColor);
  
  // Clear localStorage again
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Test Apple - should be blue
  console.log('\n🍎 Testing Apple brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const appleLocalStorage = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('📦 Apple localStorage:', appleLocalStorage);
  
  const appleBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Apple brand color:', appleBrandColor);
  
  // Verify colors are different
  expect(teslaBrandColor).toBe('#CC0000');
  expect(appleBrandColor).toBe('#0071E3');
  
  console.log('\n✅ Brand colors are working correctly!');
});
