import { test, expect } from '@playwright/test';

test('Check Deployment Status', async ({ page }) => {
  console.log('🚀 Checking deployment status...');
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check if we can see any console logs that would indicate the new logic
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('🔒')) {
      consoleLogs.push(msg.text());
    }
  });
  
  // Clear quota and test
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('demo_countdown_deadline');
  });
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  
  // First click
  await addressInput.fill('123 Main St, New York, NY');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Second click
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('456 Oak Ave, Los Angeles, CA');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📝 Console logs captured:', consoleLogs);
  
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible = await reportContent.isVisible();
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible = await lockOverlay.count() > 0;
  
  console.log('📊 Report visible:', isReportVisible);
  console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
  
  if (isReportVisible) {
    console.log('✅ Deployment updated - showing report on second click');
  } else if (isLockOverlayVisible) {
    console.log('❌ Deployment not updated - still showing lockout on second click');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'deployment-check.png', fullPage: true });
});