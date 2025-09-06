import { test, expect } from '@playwright/test';

test('Test Demo Runs and Lockout Message', async ({ page, context }) => {
  console.log('🔍 Testing Demo Runs and Lockout Message...');
  
  // Clear all storage and cookies for fresh start
  await context.clearCookies();
  await context.clearPermissions();
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(5000);
  
  // First run - should show report
  console.log('👀 First Generate Report click...');
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(2000);
  
  // Click outside autocomplete to close it
  await page.click('body');
  await page.waitForTimeout(1000);
  
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if we're on report page or lockout page
  const isReportPage = await page.locator('text=System Size').isVisible();
  const isLockoutPage = await page.locator('text=Demo quota exhausted').isVisible();
  
  console.log('📍 First run - Report page:', isReportPage);
  console.log('📍 First run - Lockout page:', isLockoutPage);
  
  if (isLockoutPage) {
    console.log('❌ Only 1 run available - should be 2 runs');
    return;
  }
  
  // Go back for second run
  console.log('👀 Going back for second run...');
  await page.goBack();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Second run - should show report
  console.log('👀 Second Generate Report click...');
  const addressInput2 = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await addressInput2.fill('456 Oak Ave, Los Angeles');
  await page.waitForTimeout(2000);
  
  // Click outside autocomplete to close it
  await page.click('body');
  await page.waitForTimeout(1000);
  
  const generateButton2 = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  await generateButton2.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if we're on report page or lockout page
  const isReportPage2 = await page.locator('text=System Size').isVisible();
  const isLockoutPage2 = await page.locator('text=Demo quota exhausted').isVisible();
  
  console.log('📍 Second run - Report page:', isReportPage2);
  console.log('📍 Second run - Lockout page:', isLockoutPage2);
  
  if (isLockoutPage2) {
    console.log('❌ Only 1 run available - should be 2 runs');
    return;
  }
  
  // Go back for third run (should lockout)
  console.log('👀 Going back for third run (should lockout)...');
  await page.goBack();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Third run - should show lockout
  console.log('👀 Third Generate Report click (should lockout)...');
  const addressInput3 = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await addressInput3.fill('789 Pine St, Chicago');
  await page.waitForTimeout(2000);
  
  // Click outside autocomplete to close it
  await page.click('body');
  await page.waitForTimeout(1000);
  
  const generateButton3 = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  await generateButton3.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check lockout message
  const lockoutMessage = await page.locator('text=Demo quota exhausted').isVisible();
  const activateMessage = await page.locator('text=Activate to get full access').isVisible();
  const contactMessage = await page.locator('text=Contact us').isVisible();
  
  console.log('📍 Lockout message "Demo quota exhausted":', lockoutMessage);
  console.log('📍 "Activate to get full access" message:', activateMessage);
  console.log('📍 "Contact us" message:', contactMessage);
  
  if (lockoutMessage && activateMessage) {
    console.log('✅ Correct lockout message displayed');
  } else if (contactMessage) {
    console.log('❌ Wrong message - showing "Contact us" instead of "Activate to get full access"');
  } else {
    console.log('❌ No lockout message found');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'demo-runs-and-message-test.png', fullPage: true });
  
  console.log('🔍 Demo runs and message test complete');
});
