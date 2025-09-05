import { test, expect } from '@playwright/test';

test('Debug Console Logs - Check Quota Debugging', async ({ page }) => {
  console.log('🔍 Checking console logs for quota debugging...');
  
  // Clear localStorage
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Listen for all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(msg.text());
  });
  
  // First view
  console.log('👀 First view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Filter quota-related messages
  const quotaMessages = consoleMessages.filter(msg => 
    msg.includes('Demo quota') || 
    msg.includes('🔒') || 
    msg.includes('remaining') ||
    msg.includes('demoMode')
  );
  
  console.log('📝 Quota-related console messages:');
  quotaMessages.forEach((msg, i) => {
    console.log(`  ${i + 1}. ${msg}`);
  });
  
  // Check the current state
  const currentState = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return {
      demoQuota: demoQuota ? JSON.parse(demoQuota) : null,
      url: window.location.href
    };
  });
  
  console.log('📦 Current state:', currentState);
  
  // Check if lock overlay should be visible
  const lockOverlay = page.locator('[data-testid="lock-overlay"], .lock-overlay, [class*="lock"]').first();
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible = await reportContent.isVisible();
  console.log('📊 Report content visible:', isReportVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-console-logs.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
});