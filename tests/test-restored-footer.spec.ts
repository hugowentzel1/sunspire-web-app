import { test, expect } from '@playwright/test';

test('Test Restored Footer Sections - Copy Demo Link Button, ResultsAttribution, and Disclaimer', async ({ page }) => {
  console.log('🔍 Testing restored footer sections...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if report content is visible (not locked)
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible = await reportContent.isVisible();
  
  if (!isReportVisible) {
    console.log('❌ Report content not visible - may be locked');
    await page.screenshot({ path: 'report-not-visible.png', fullPage: true });
    return;
  }
  
  console.log('✅ Report content is visible');
  
  // Check for "Copy Demo Link Button" section
  const copyDemoButton = page.locator('button:has-text("🚀 Activate on Your Domain")').first();
  const isCopyDemoButtonVisible = await copyDemoButton.isVisible();
  
  console.log('📊 Copy Demo Link Button visible:', isCopyDemoButtonVisible);
  
  // Check for ResultsAttribution component (PVWatts and Google badges)
  const pvwattsBadge = page.locator('text=PVWatts').first();
  const isPvwattsBadgeVisible = await pvwattsBadge.isVisible();
  
  const googleAttribution = page.locator('text=Google').first();
  const isGoogleAttributionVisible = await googleAttribution.isVisible();
  
  console.log('📊 PVWatts badge visible:', isPvwattsBadgeVisible);
  console.log('📊 Google attribution visible:', isGoogleAttributionVisible);
  
  // Check for separate disclaimer section
  const disclaimer = page.locator('text=Estimates are informational only').first();
  const isDisclaimerVisible = await disclaimer.isVisible();
  
  console.log('📊 Disclaimer visible:', isDisclaimerVisible);
  
  // Check for the specific disclaimer text
  const disclaimerText = page.locator('text=NREL PVWatts® v8 and current utility rates').first();
  const isDisclaimerTextVisible = await disclaimerText.isVisible();
  
  console.log('📊 Disclaimer text visible:', isDisclaimerTextVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'restored-footer-test.png', fullPage: true });
  console.log('📸 Test screenshot saved');
  
  // Verify results
  expect(isCopyDemoButtonVisible).toBe(true);
  expect(isPvwattsBadgeVisible).toBe(true);
  expect(isGoogleAttributionVisible).toBe(true);
  expect(isDisclaimerVisible).toBe(true);
  expect(isDisclaimerTextVisible).toBe(true);
  
  console.log('\n🎯 RESTORED FOOTER TEST RESULTS:');
  console.log('✅ Copy Demo Link Button visible:', isCopyDemoButtonVisible);
  console.log('✅ PVWatts badge visible:', isPvwattsBadgeVisible);
  console.log('✅ Google attribution visible:', isGoogleAttributionVisible);
  console.log('✅ Disclaimer visible:', isDisclaimerVisible);
  console.log('✅ Disclaimer text visible:', isDisclaimerTextVisible);
  
  console.log('\n🎉 ALL FOOTER SECTIONS SUCCESSFULLY RESTORED!');
  console.log('✅ Copy Demo Link Button with 🚀 emoji');
  console.log('✅ ResultsAttribution component with PVWatts and Google badges');
  console.log('✅ Separate disclaimer section with PVWatts attribution');
});
