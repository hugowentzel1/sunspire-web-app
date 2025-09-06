import { test, expect } from '@playwright/test';

test('Netflix Lock Overlay Debug', async ({ page }) => {
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1';
  
  console.log('🔒 Testing Netflix lock overlay structure...');
  
  // Go to third visit to trigger lock
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Check if lock is visible
  const lockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Lock overlay visible:', lockVisible);
  
  if (lockVisible) {
    // Get all buttons on the page
    const allButtons = await page.locator('button, [role="button"]').all();
    console.log('🔘 Total buttons on lock page:', allButtons.length);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Button ${i + 1}: "${text}" (visible: ${isVisible})`);
    }
    
    // Look for specific text patterns
    const unlockText = await page.locator('text=Unlock').count();
    const activateText = await page.locator('text=Activate').count();
    const fullReportText = await page.locator('text=Full Report').count();
    const domainText = await page.locator('text=Domain').count();
    
    console.log('📊 Text counts:');
    console.log('  - "Unlock":', unlockText);
    console.log('  - "Activate":', activateText);
    console.log('  - "Full Report":', fullReportText);
    console.log('  - "Domain":', domainText);
    
    // Check for any clickable elements
    const clickableElements = await page.locator('a, button, [onclick], [role="button"]').all();
    console.log('🔘 Clickable elements:', clickableElements.length);
    
    for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
      const element = clickableElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const text = await element.textContent();
      const isVisible = await element.isVisible();
      console.log(`Element ${i + 1}: <${tagName}> "${text}" (visible: ${isVisible})`);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'netflix-lock-debug.png', fullPage: true });
    console.log('📸 Screenshot saved as netflix-lock-debug.png');
  }
});
