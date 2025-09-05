import { test, expect } from '@playwright/test';

test('Debug Demo Quota System - Check Console Logs', async ({ page }) => {
  console.log('🔍 Debugging demo quota system...');
  
  // Clear any existing demo quota
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared all localStorage');
  });
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.text().includes('Demo quota') || msg.text().includes('🔒')) {
      console.log('📝 Console:', msg.text());
    }
  });
  
  // First view
  console.log('👀 First view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check localStorage after first view
  const quotaAfterFirst = await page.evaluate(() => {
    const allKeys = Object.keys(localStorage);
    console.log('📦 All localStorage keys:', allKeys);
    
    const demoQuota = localStorage.getItem('demo_quota_v3');
    console.log('📦 demo_quota_v3:', demoQuota);
    
    return {
      allKeys,
      demoQuota: demoQuota ? JSON.parse(demoQuota) : null
    };
  });
  
  console.log('📦 After first view:', quotaAfterFirst);
  
  // Second view
  console.log('👀 Second view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const quotaAfterSecond = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📦 After second view:', quotaAfterSecond);
  
  // Third view
  console.log('👀 Third view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const quotaAfterThird = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📦 After third view:', quotaAfterThird);
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('[data-testid="lock-overlay"], .lock-overlay, [class*="lock"]').first();
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-demo-quota.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
});
