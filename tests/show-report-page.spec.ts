import { test, expect } from '@playwright/test';

test('Show Report Page - Keep Browser Open', async ({ page }) => {
  console.log('🔍 Opening report page for manual inspection...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Report page loaded - check the bottom for restored footer sections:');
  console.log('  - Copy Demo Link Button with 🚀 emoji');
  console.log('  - ResultsAttribution component with PVWatts and Google badges');
  console.log('  - Separate disclaimer section with PVWatts attribution');
  
  // Keep browser open for manual inspection
  await page.pause();
});