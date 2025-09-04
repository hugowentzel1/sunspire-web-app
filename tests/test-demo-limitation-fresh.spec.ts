import { test, expect } from '@playwright/test';

test('Test demo limitation system with fresh URLs', async ({ page }) => {
  console.log('🔒 Testing demo limitation system with fresh URLs...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Test 1: First run should work
  console.log('\n🟢 Test 1: First run should work');
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&test=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the report is visible (not locked)
  const reportContent = await page.locator('div[data-demo="true"]').count();
  const lockOverlay = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(reportContent).toBeGreaterThan(0);
  expect(lockOverlay).toBe(0);
  console.log('✅ First run: Report is visible, no lock overlay');
  
  // Check localStorage to see remaining runs
  const localStorageAfterFirst = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 localStorage after first run:', localStorageAfterFirst);
  
  // Test 2: Second run should work
  console.log('\n🟡 Test 2: Second run should work');
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&test=2');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the report is still visible
  const reportContent2 = await page.locator('div[data-demo="true"]').count();
  const lockOverlay2 = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(reportContent2).toBeGreaterThan(0);
  expect(lockOverlay2).toBe(0);
  console.log('✅ Second run: Report is visible, no lock overlay');
  
  // Check localStorage to see remaining runs
  const localStorageAfterSecond = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 localStorage after second run:', localStorageAfterSecond);
  
  // Test 3: Third run should be locked
  console.log('\n🔴 Test 3: Third run should be locked');
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&test=3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the lock overlay is visible
  const lockOverlay3 = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(lockOverlay3).toBeGreaterThan(0);
  console.log('✅ Third run: Lock overlay is visible');
  
  // Check that the report content is not visible
  const reportContent3 = await page.locator('div[data-demo="true"]').count();
  expect(reportContent3).toBe(0);
  console.log('✅ Third run: Report content is hidden');
  
  // Check localStorage to see remaining runs
  const localStorageAfterThird = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 localStorage after third run:', localStorageAfterThird);
  
  console.log('\n🎉 Demo limitation system is working correctly!');
});
