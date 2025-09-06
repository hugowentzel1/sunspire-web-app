import { test, expect } from '@playwright/test';

test('Check Netflix demo state', async ({ page }) => {
  console.log('🔍 Testing Netflix demo state...');
  
  // Navigate to Netflix demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if we can see the address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]');
  await expect(addressInput).toBeVisible();
  
  // Check demo status text
  const demoStatus = page.locator('text=Preview:').first();
  await expect(demoStatus).toBeVisible();
  
  const demoText = await demoStatus.textContent();
  console.log('📊 Demo status text:', demoText);
  
  // Check if there's a countdown timer
  const countdown = page.locator('text=Expires in').first();
  const countdownText = await countdown.textContent();
  console.log('⏰ Countdown text:', countdownText);
  
  // Check if the generate button is enabled
  const generateButton = page.locator('button:has-text("Generate Solar Report")');
  const isEnabled = await generateButton.isEnabled();
  console.log('🔘 Generate button enabled:', isEnabled);
  
  // Try to click generate button
  if (isEnabled) {
    console.log('🖱️ Attempting to click generate button...');
    await generateButton.click();
    
    // Wait a moment to see what happens
    await page.waitForTimeout(2000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log('🌐 Current URL after click:', currentUrl);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-demo-state.png' });
  console.log('📸 Screenshot saved as netflix-demo-state.png');
});
