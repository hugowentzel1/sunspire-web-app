import { test, expect } from '@playwright/test';

test('Debug quota after runs', async ({ page }) => {
  console.log('🔍 Debugging quota after runs...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // First run
  console.log('\n🟢 First run');
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  let quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Quota after first run:', quota);
  
  // Second run
  console.log('\n🟡 Second run');
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Quota after second run:', quota);
  
  // Third run
  console.log('\n🔴 Third run');
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Quota after third run:', quota);
  
  // Check if lock overlay is visible
  const lockOverlay = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  console.log('🔒 Lock overlay count:', lockOverlay);
  
  // Check page content
  const bodyText = await page.textContent('body');
  console.log('📄 Page contains "locked":', bodyText?.includes('locked'));
  console.log('📄 Page contains "quota":', bodyText?.includes('quota'));
});
