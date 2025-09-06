import { test, expect } from '@playwright/test';

test('Check Lockout Text Content', async ({ page }) => {
  console.log('🔍 Checking lockout text content...');
  
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
  
  // Third click - should show lockout
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('789 Pine St, Chicago, IL');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check what text is actually showing
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible = await lockOverlay.count() > 0;
  console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
  
  if (isLockOverlayVisible) {
    // Get all text content in the lockout overlay
    const allText = await lockOverlay.textContent();
    console.log('📝 All text in lockout overlay:', allText);
    
    // Check for specific messages
    const hasQuotaExhausted = allText?.includes('🚫 Demo quota exhausted');
    const hasActivateMessage = allText?.includes('Activate to get full access');
    const hasOldMessage = allText?.includes('Your Solar Intelligence Tool is now locked');
    
    console.log('🚫 Has "Demo quota exhausted":', hasQuotaExhausted);
    console.log('🔓 Has "Activate to get full access":', hasActivateMessage);
    console.log('📜 Has old message:', hasOldMessage);
    
    if (hasOldMessage) {
      console.log('❌ Still showing old message - deployment not updated yet');
    } else if (hasQuotaExhausted && hasActivateMessage) {
      console.log('✅ New message is showing correctly');
    } else {
      console.log('❓ Unknown state - checking what text is present');
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'check-lockout-text.png', fullPage: true });
  
  console.log('🔍 Lockout text check complete');
});
