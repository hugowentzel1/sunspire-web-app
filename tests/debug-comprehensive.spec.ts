import { test, expect } from '@playwright/test';

test('Debug comprehensive verification', async ({ page }) => {
  console.log('🔍 Debugging comprehensive verification...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Navigate to Tesla page
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&test=tesla');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check what's on the page
  const pageContent = await page.textContent('body');
  console.log('📄 Page content preview:', pageContent?.substring(0, 1000));
  
  // Check for Tesla text
  const teslaText = await page.locator('text=Tesla').count();
  console.log('🚗 Tesla text elements:', teslaText);
  
  // Check for demo elements
  const demoElements = await page.locator('[data-demo]').count();
  console.log('🎯 Demo elements:', demoElements);
  
  // Check for lock overlay
  const lockOverlay = await page.locator('div[style*="position: fixed"]').count();
  console.log('🔒 Lock overlay elements:', lockOverlay);
  
  // Check localStorage
  const localStorageData = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 localStorage data:', localStorageData);
  
  // Check brand color
  const brandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Brand color:', brandColor);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-comprehensive.png', fullPage: true });
});
