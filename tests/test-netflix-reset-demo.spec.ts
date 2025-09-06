import { test, expect } from '@playwright/test';

test('Reset Netflix demo and test functionality', async ({ page }) => {
  console.log('🔍 Resetting Netflix demo and testing...');
  
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
  
  // Check demo status after reset
  const demoStatus = page.locator('text=Preview:').first();
  await expect(demoStatus).toBeVisible();
  
  const demoText = await demoStatus.textContent();
  console.log('📊 Demo status after reset:', demoText);
  
  // Check for address input
  const addressInput = page.locator('input[placeholder*="address"]');
  await expect(addressInput).toBeVisible();
  
  // Check for generate button
  const generateButton = page.locator('button:has-text("Generate Solar Report")');
  const isEnabled = await generateButton.isEnabled();
  console.log('🔘 Generate button enabled after reset:', isEnabled);
  
  if (isEnabled) {
    // Type an address
    await addressInput.fill('123 Main St, Los Angeles, CA');
    console.log('📝 Filled address input');
    
    // Click generate button
    await generateButton.click();
    console.log('🖱️ Clicked generate button');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log('🌐 Current URL after click:', currentUrl);
    
    // Check if we're on report page or lockout
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page');
      
      // Check if there's a lockout overlay
      const lockoutOverlay = page.locator('text=Demo limit reached, text=quota exhausted');
      const lockoutVisible = await lockoutOverlay.isVisible();
      console.log('🔒 Lockout overlay visible:', lockoutVisible);
      
      if (lockoutVisible) {
        const lockoutText = await lockoutOverlay.textContent();
        console.log('🚫 Lockout text:', lockoutText);
      }
    } else {
      console.log('❌ Did not navigate to report page');
    }
  } else {
    console.log('❌ Generate button is not enabled');
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-reset-test.png' });
  console.log('📸 Screenshot saved as netflix-reset-test.png');
});
