import { test, expect } from '@playwright/test';

test('Debug quota system', async ({ page }) => {
  console.log('🔍 Debugging quota system...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Navigate to report page
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check localStorage
  const quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Quota in localStorage:', quota);
  
  // Check if lock overlay is visible
  const lockOverlay = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  console.log('🔒 Lock overlay count:', lockOverlay);
  
  // Check if we can see any text about locking
  const lockText = await page.locator('text=locked').count();
  console.log('🔒 Lock text count:', lockText);
  
  // Check page content
  const bodyText = await page.textContent('body');
  console.log('📄 Page contains "locked":', bodyText?.includes('locked'));
  console.log('📄 Page contains "quota":', bodyText?.includes('quota'));
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-quota.png' });
  console.log('📸 Screenshot saved as debug-quota.png');
});
