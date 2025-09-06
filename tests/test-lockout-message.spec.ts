import { test, expect } from '@playwright/test';

test('Test Lockout Message Update', async ({ page }) => {
  console.log('🔒 Testing updated lockout message...');
  
  // Clear any existing demo quota to start fresh
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('demo_countdown_deadline');
    console.log('🗑️ Cleared demo quota and countdown data');
  });
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  
  // First click - should show report
  console.log('👀 First Generate Report click...');
  await addressInput.fill('123 Main St, New York, NY');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Second click - should show report
  console.log('👀 Second Generate Report click...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('456 Oak Ave, Los Angeles, CA');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Third click - should show lockout with new message
  console.log('🔒 Third Generate Report click - should show lockout with new message...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('789 Pine St, Chicago, IL');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check for lockout overlay
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible = await lockOverlay.count() > 0;
  console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
  expect(isLockOverlayVisible).toBeTruthy();
  
  // Check for the new lockout message
  const quotaExhaustedMessage = page.locator('text=🚫 Demo quota exhausted').first();
  const isQuotaExhaustedVisible = await quotaExhaustedMessage.isVisible();
  console.log('🚫 "Demo quota exhausted" message visible:', isQuotaExhaustedVisible);
  expect(isQuotaExhaustedVisible).toBeTruthy();
  
  // Check for the activation message
  const activateMessage = page.locator('text=Activate to get full access').first();
  const isActivateMessageVisible = await activateMessage.isVisible();
  console.log('🔓 "Activate to get full access" message visible:', isActivateMessageVisible);
  expect(isActivateMessageVisible).toBeTruthy();
  
  // Check for countdown timer
  const countdownTimer = page.locator('text=Expires in').first();
  const isCountdownVisible = await countdownTimer.isVisible();
  console.log('⏰ Countdown timer visible:', isCountdownVisible);
  expect(isCountdownVisible).toBeTruthy();
  
  // Check for CTA button
  const ctaButton = page.locator('button:has-text("Activate")').first();
  const isCtaVisible = await ctaButton.isVisible();
  console.log('💳 CTA button visible:', isCtaVisible);
  expect(isCtaVisible).toBeTruthy();
  
  // Take screenshot
  await page.screenshot({ path: 'lockout-message-test.png', fullPage: true });
  
  console.log('🎉 Lockout message test passed!');
  console.log('✅ Shows "🚫 Demo quota exhausted"');
  console.log('✅ Shows "Activate to get full access"');
  console.log('✅ Shows countdown timer');
  console.log('✅ Shows CTA button');
});
