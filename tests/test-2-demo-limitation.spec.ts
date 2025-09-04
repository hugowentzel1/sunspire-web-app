import { test, expect } from '@playwright/test';

test('Test 2-demo limitation system', async ({ page }) => {
  console.log('🔒 Testing 2-demo limitation system...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Test 1: First run should work
  console.log('\n🟢 Test 1: First run should work');
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that we're not seeing the lock overlay
  const lockOverlay = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(lockOverlay).toBe(0);
  console.log('✅ First run: No lock overlay');
  
  // Test 2: Second run should work
  console.log('\n🟡 Test 2: Second run should work');
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that we're still not seeing the lock overlay
  const lockOverlay2 = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(lockOverlay2).toBe(0);
  console.log('✅ Second run: No lock overlay');
  
  // Test 3: Third run should show lock overlay
  console.log('\n🔴 Test 3: Third run should show lock overlay');
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that we're now seeing the lock overlay
  const lockOverlay3 = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(lockOverlay3).toBeGreaterThan(0);
  console.log('✅ Third run: Lock overlay visible');
  
  // Check that the lock overlay contains the expected content
  await expect(page.locator('text=Your Solar Intelligence Tool is now locked')).toBeVisible();
  await expect(page.locator('text=Unlock full access to see complete solar reports')).toBeVisible();
  console.log('✅ Lock overlay content is correct');
  
  console.log('🎉 2-demo limitation system is working correctly!');
});
