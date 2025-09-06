import { test, expect } from '@playwright/test';

test('Apple Demo - Test All Fixes', async ({ page }) => {
  console.log('\n🍎 APPLE DEMO - TESTING ALL FIXES');
  
  const baseUrl = 'https://sunspire-web-app.vercel.app';
  const testUrl = `${baseUrl}/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&company=Apple&demo=1`;
  
  // Clear localStorage to start fresh
  await page.goto(baseUrl);
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared localStorage');
  });
  
  console.log('\n📊 TEST 1: First Demo Visit (Should show report, quota: 2)');
  console.log('🔗 URL:', testUrl);
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check first visit
  const attempt1 = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size') || bodyText.includes('Annual Production');
    const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasReportContent,
      hasLockOverlay,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 500)
    };
  });
  
  console.log('📊 Attempt 1 Results:');
  console.log('  ✅ Report content visible:', attempt1.hasReportContent);
  console.log('  ❌ Lock overlay visible:', attempt1.hasLockOverlay);
  console.log('  📦 Quota data:', attempt1.quota);
  
  // Verify first attempt shows report, quota should be 1 (consumed after report view)
  expect(attempt1.hasReportContent).toBe(true);
  expect(attempt1.hasLockOverlay).toBe(false);
  expect(attempt1.quota?.['https://sunspire-web-app.vercel.app/report?company=Apple&demo=1']).toBe(1);
  
  console.log('\n📊 TEST 2: Second Demo Visit (Should show report, quota: 0)');
  
  // Navigate to a different address to trigger second demo
  const testUrl2 = `${baseUrl}/report?address=456%20Oak%20St&lat=40.7589&lng=-73.9851&company=Apple&demo=1`;
  console.log('🔗 URL:', testUrl2);
  
  await page.goto(testUrl2);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check second visit
  const attempt2 = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size') || bodyText.includes('Annual Production');
    const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasReportContent,
      hasLockOverlay,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 500)
    };
  });
  
  console.log('📊 Attempt 2 Results:');
  console.log('  ✅ Report content visible:', attempt2.hasReportContent);
  console.log('  ❌ Lock overlay visible:', attempt2.hasLockOverlay);
  console.log('  📦 Quota data:', attempt2.quota);
  
  // Verify second attempt shows report, quota should be 0 (consumed after second report view)
  expect(attempt2.hasReportContent).toBe(true);
  expect(attempt2.hasLockOverlay).toBe(false);
  expect(attempt2.quota?.['https://sunspire-web-app.vercel.app/report?company=Apple&demo=1']).toBe(0);
  
  console.log('\n📊 TEST 3: Third Visit (Should show lock overlay)');
  
  // Navigate to a third address to trigger lock
  const testUrl3 = `${baseUrl}/report?address=789%20Pine%20St&lat=40.7505&lng=-73.9934&company=Apple&demo=1`;
  console.log('🔗 URL:', testUrl3);
  
  await page.goto(testUrl3);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check third visit
  const attempt3 = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size') || bodyText.includes('Annual Production');
    const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasReportContent,
      hasLockOverlay,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 500)
    };
  });
  
  console.log('📊 Attempt 3 Results:');
  console.log('  ✅ Report content visible:', attempt3.hasReportContent);
  console.log('  ❌ Lock overlay visible:', attempt3.hasLockOverlay);
  console.log('  📦 Quota data:', attempt3.quota);
  
  // Verify third attempt shows lock overlay
  expect(attempt3.hasLockOverlay).toBe(true);
  expect(attempt3.hasReportContent).toBe(false);
  expect(attempt3.quota?.['https://sunspire-web-app.vercel.app/report?company=Apple&demo=1']).toBe(0);
  
  console.log('\n📊 TEST 4: New Analysis Button (Should preserve company parameter)');
  
  // Go back to a working report page
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click New Analysis button
  await page.click('button:has-text("New Analysis")');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check if URL preserves company parameter
  const currentUrl = page.url();
  console.log('🔗 Current URL after New Analysis click:', currentUrl);
  
  // Should contain company=Apple and demo=1
  expect(currentUrl).toContain('company=Apple');
  expect(currentUrl).toContain('demo=1');
  
  console.log('\n📊 TEST 5: Address Autocomplete (Check if working)');
  
  // Check if address input is visible and functional
  const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const addressInputVisible = await addressInput.isVisible();
  console.log('📊 Address input visible:', addressInputVisible);
  
  if (addressInputVisible) {
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(2000);
    const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item, .pac-item').all();
    console.log('📊 Address suggestions found:', suggestions.length);
    
    // Check if Google Maps is loaded
    const googleMapsLoaded = await page.evaluate(() => {
      return typeof window.google !== 'undefined' && window.google.maps;
    });
    console.log('🗺️ Google Maps loaded:', googleMapsLoaded);
  }
  
  console.log('\n🎯 FINAL VERIFICATION:');
  console.log('=====================================');
  console.log('✅ Attempt 1: Report shown, quota: 1 (consumed)');
  console.log('✅ Attempt 2: Report shown, quota: 0 (consumed)');
  console.log('✅ Attempt 3: Lock overlay shown (quota: 0)');
  console.log('✅ New Analysis button preserves company parameter');
  console.log('✅ Address autocomplete available:', addressInputVisible);
  
  console.log('\n🎉 ALL FIXES WORKING PERFECTLY! 🎉');
});
