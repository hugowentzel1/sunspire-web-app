import { test, expect } from '@playwright/test';

test('Test Netflix demo with proper overlay handling', async ({ page }) => {
  console.log('🔍 Testing Netflix demo with proper overlay handling...');
  
  // Navigate to Netflix demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Clear localStorage to reset demo quota
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🧹 Cleared localStorage');
  });
  
  // Reload the page
  await page.reload();
  await page.waitForLoadState('networkidle');
  
  // Dismiss cookie banner first
  const cookieBanner = page.locator('text=Accept All').first();
  if (await cookieBanner.isVisible()) {
    await cookieBanner.click();
    console.log('🍪 Dismissed cookie banner');
    await page.waitForTimeout(1000);
  }
  
  // Look for the address input
  const addressInput = page.locator('input[placeholder*="address"]');
  await expect(addressInput).toBeVisible();
  
  // Type in the address input
  await addressInput.fill('123 Main St, Los Angeles, CA');
  console.log('📝 Filled address input');
  
  // Wait for autocomplete to appear and then click outside to dismiss it
  await page.waitForTimeout(1000);
  
  // Click outside the autocomplete dropdown to dismiss it
  await page.click('body', { position: { x: 100, y: 100 } });
  console.log('🖱️ Clicked outside to dismiss autocomplete');
  
  // Wait a moment for dropdown to disappear
  await page.waitForTimeout(500);
  
  // Now try to click the generate button
  const generateButton = page.locator('button:has-text("Generate Solar Report")');
  await expect(generateButton).toBeVisible();
  
  // Force click the button to bypass any overlays
  await generateButton.click({ force: true });
  console.log('🖱️ Clicked generate button with force');
  
  // Wait for navigation
  await page.waitForTimeout(3000);
  
  // Check current URL
  const currentUrl = page.url();
  console.log('🌐 Current URL after click:', currentUrl);
  
  if (currentUrl.includes('/report')) {
    console.log('✅ Successfully navigated to report page');
    
    // Check if there's a lockout overlay
    const lockoutOverlay = page.locator('text=Demo limit reached, text=quota exhausted');
    const lockoutVisible = await lockoutOverlay.isVisible();
    console.log('🔒 Lockout overlay visible:', lockoutVisible);
    
    if (lockoutVisible) {
      const lockoutText = await lockoutOverlay.textContent();
      console.log('🚫 Lockout text:', lockoutText);
    } else {
      console.log('✅ No lockout overlay - report page is accessible');
    }
  } else {
    console.log('❌ Did not navigate to report page');
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-fixed.png' });
  console.log('📸 Screenshot saved as netflix-fixed.png');
});
