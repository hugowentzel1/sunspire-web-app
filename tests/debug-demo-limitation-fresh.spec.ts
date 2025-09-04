import { test, expect } from '@playwright/test';

test('Debug demo limitation system fresh', async ({ page }) => {
  console.log('🔍 Debugging demo limitation system fresh...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Navigate to demo page
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&test=fresh');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check what's on the page
  const pageContent = await page.textContent('body');
  console.log('📄 Page content preview:', pageContent?.substring(0, 500));
  
  // Check for demo-related elements
  const demoElements = await page.locator('[data-demo]').count();
  console.log('🎯 Elements with data-demo attribute:', demoElements);
  
  // Check for lock overlay
  const lockOverlay = await page.locator('div[style*="position: fixed"]').count();
  console.log('🔒 Lock overlay elements:', lockOverlay);
  
  // Check localStorage
  const localStorageData = await page.evaluate(() => {
    return {
      demo_quota_v3: localStorage.getItem('demo_quota_v3'),
      sunspire_brand_takeover: localStorage.getItem('sunspire-brand-takeover')
    };
  });
  console.log('📦 localStorage data:', localStorageData);
  
  // Check if there are any error messages
  const errorElements = await page.locator('text=error').count();
  console.log('❌ Error elements:', errorElements);
  
  // Check if the page is loading
  const loadingElements = await page.locator('text=Loading').count();
  console.log('⏳ Loading elements:', loadingElements);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-demo-limitation-fresh.png', fullPage: true });
});
