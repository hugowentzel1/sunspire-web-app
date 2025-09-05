import { test, expect } from '@playwright/test';

test('Debug Lock Overlay - Check What\'s Actually Showing', async ({ page }) => {
  console.log('🔍 Debugging lock overlay display...');
  
  // Clear localStorage and go to third view (should be locked)
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // First view
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Second view
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Third view (should be locked)
  console.log('👀 Third view - should be locked...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check what elements are visible
  const elements = await page.evaluate(() => {
    const lockOverlay = document.querySelector('[data-testid="lock-overlay"], .lock-overlay, [class*="lock"]');
    const reportContent = document.querySelector('h2');
    const mainContent = document.querySelector('main');
    
    return {
      lockOverlay: {
        exists: !!lockOverlay,
        visible: lockOverlay ? getComputedStyle(lockOverlay).display !== 'none' : false,
        text: lockOverlay ? lockOverlay.textContent : null
      },
      reportContent: {
        exists: !!reportContent,
        visible: reportContent ? getComputedStyle(reportContent).display !== 'none' : false,
        text: reportContent ? reportContent.textContent : null
      },
      mainContent: {
        exists: !!mainContent,
        visible: mainContent ? getComputedStyle(mainContent).display !== 'none' : false,
        children: mainContent ? mainContent.children.length : 0
      }
    };
  });
  
  console.log('🔍 Element visibility:', elements);
  
  // Check if we can see "What You See Now" text
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const isWhatYouSeeVisible = await whatYouSeeNow.isVisible();
  console.log('👁️ "What You See Now" visible:', isWhatYouSeeVisible);
  
  // Check if we can see "What You Get Live" text
  const whatYouGetLive = page.locator('text=What You Get Live').first();
  const isWhatYouGetVisible = await whatYouGetLive.isVisible();
  console.log('🚀 "What You Get Live" visible:', isWhatYouGetVisible);
  
  // Check if we can see CTA buttons
  const ctaButtons = await page.locator('[data-cta="primary"]').all();
  console.log('🔘 CTA buttons found:', ctaButtons.length);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-lock-overlay.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
  
  console.log('\n🎯 ANALYSIS:');
  if (isWhatYouSeeVisible && isWhatYouGetVisible) {
    console.log('✅ Lock overlay is working - showing "What You See Now" vs "What You Get Live"');
  } else if (elements.lockOverlay.exists) {
    console.log('⚠️ Lock overlay exists but content might be different');
  } else {
    console.log('❌ Lock overlay not working properly');
  }
});