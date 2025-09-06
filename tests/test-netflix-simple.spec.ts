import { test, expect } from '@playwright/test';

test('Test Working Netflix Link - Simple Verification', async ({ page }) => {
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1';
  
  console.log('🔍 Testing working Netflix link - Simple verification...');
  
  // First visit - should show report
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Check if report is visible
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Report visible on first visit:', reportVisible);
  
  // Check brand colors
  const brandColors = await page.evaluate(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary').trim(),
      brand: computedStyle.getPropertyValue('--brand').trim()
    };
  });
  console.log('🎨 Brand colors:', brandColors);
  
  // Check CTA buttons
  const ctaButtons = await page.locator('button, [role="button"]').all();
  console.log('🔘 CTA Buttons found:', ctaButtons.length);
  
  // Check for specific CTA buttons
  const unlockButtons = await page.locator('text=Unlock Full Report').count();
  const activateButtons = await page.locator('text=Activate').count();
  console.log('🔘 Unlock Full Report buttons:', unlockButtons);
  console.log('🔘 Activate buttons:', activateButtons);
  
  // Check demo quota system
  console.log('🔍 Testing demo quota system...');
  
  // First visit - should show report
  const firstVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 First visit quota:', firstVisitQuota);
  
  // Second visit - should still show report
  console.log('🔍 Second visit...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  const secondVisitReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const secondVisitLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Second visit - Report visible:', secondVisitReportVisible);
  console.log('📊 Second visit - Lock visible:', secondVisitLockVisible);
  
  const secondVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 Second visit quota:', secondVisitQuota);
  
  // Third visit - should show lock
  console.log('🔍 Third visit...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  const thirdVisitReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const thirdVisitLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Third visit - Report visible:', thirdVisitReportVisible);
  console.log('📊 Third visit - Lock visible:', thirdVisitLockVisible);
  
  const thirdVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 Third visit quota:', thirdVisitQuota);
  
  // Check address autocomplete
  console.log('🔍 Testing address autocomplete...');
  const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const addressInputVisible = await addressInput.isVisible();
  console.log('📊 Address input visible:', addressInputVisible);
  
  // Final verification
  console.log('🎯 SIMPLE VERIFICATION RESULTS:');
  console.log('📊 Demo Quota System:');
  console.log('  - First visit report visible:', reportVisible);
  console.log('  - Second visit report visible:', secondVisitReportVisible);
  console.log('  - Third visit lock visible:', thirdVisitLockVisible);
  console.log('  - Quota progression:', firstVisitQuota, '->', secondVisitQuota, '->', thirdVisitQuota);
  
  console.log('📊 CTA Buttons:');
  console.log('  - Total buttons found:', ctaButtons.length);
  console.log('  - Unlock Full Report buttons:', unlockButtons);
  console.log('  - Activate buttons:', activateButtons);
  
  console.log('📊 Brand Colors:');
  console.log('  - Brand primary:', brandColors.brandPrimary);
  console.log('  - Brand:', brandColors.brand);
  console.log('  - Is Netflix red?', brandColors.brandPrimary === '#E50914');
  
  console.log('📊 Address Autocomplete:');
  console.log('  - Address input visible:', addressInputVisible);
  
  // Assertions
  expect(reportVisible).toBe(true);
  expect(unlockButtons).toBeGreaterThan(0);
  expect(brandColors.brandPrimary).toBe('#E50914'); // Should be Netflix red
  expect(thirdVisitLockVisible).toBe(true); // Should show lock after 2 visits
  
  console.log('🎯 OVERALL SUCCESS: ✅');
});
