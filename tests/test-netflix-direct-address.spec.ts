import { test, expect } from '@playwright/test';

test('Test Netflix demo with direct address approach', async ({ page }) => {
  console.log('🔍 Testing Netflix demo with direct address approach...');
  
  // Try going directly to the address input page
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
  
  // Look for the address input
  const addressInput = page.locator('input[placeholder*="address"]');
  const inputCount = await addressInput.count();
  
  if (inputCount > 0) {
    console.log('✅ Found address input');
    
    // Try to type in the address input
    await addressInput.fill('123 Main St, Los Angeles, CA');
    console.log('📝 Filled address input');
    
    // Look for any button that might be the generate button
    const allButtons = await page.locator('button').all();
    console.log('🔘 All buttons found:', allButtons.length);
    
    for (let i = 0; i < allButtons.length; i++) {
      const text = await allButtons[i].textContent();
      const isVisible = await allButtons[i].isVisible();
      const isEnabled = await allButtons[i].isEnabled();
      console.log(`Button ${i}: "${text}" (visible: ${isVisible}, enabled: ${isEnabled})`);
      
      // Try clicking any enabled button that might be the generate button
      if (isEnabled && text && (text.includes('Generate') || text.includes('Solar') || text.includes('Report') || text.includes('Get') || text.includes('Start') || text.includes('Launch'))) {
        console.log(`🎯 Trying to click button: "${text}"`);
        try {
          await allButtons[i].click();
          console.log('✅ Successfully clicked button');
          
          // Wait for navigation
          await page.waitForTimeout(3000);
          
          // Check current URL
          const currentUrl = page.url();
          console.log('🌐 Current URL after click:', currentUrl);
          
          if (currentUrl.includes('/report')) {
            console.log('✅ Successfully navigated to report page');
            break;
          }
        } catch (error) {
          console.log('❌ Error clicking button:', error);
        }
      }
    }
    
    // If no button worked, try pressing Enter in the address input
    console.log('🔄 Trying to press Enter in address input...');
    await addressInput.press('Enter');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log('🌐 Current URL after Enter:', currentUrl);
    
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page with Enter key');
    }
    
  } else {
    console.log('❌ Address input not found');
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-direct-address.png' });
  console.log('📸 Screenshot saved as netflix-direct-address.png');
});
