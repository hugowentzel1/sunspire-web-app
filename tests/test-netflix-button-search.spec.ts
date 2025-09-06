import { test, expect } from '@playwright/test';

test('Search for correct button text on Netflix demo', async ({ page }) => {
  console.log('🔍 Searching for correct button text on Netflix demo...');
  
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
  
  // Look for any button that might be the generate button
  const allButtons = await page.locator('button').all();
  console.log('🔘 All buttons found:', allButtons.length);
  
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    const isVisible = await allButtons[i].isVisible();
    const isEnabled = await allButtons[i].isEnabled();
    console.log(`Button ${i}: "${text}" (visible: ${isVisible}, enabled: ${isEnabled})`);
    
    // Check if this button contains any of these keywords
    if (text && (text.includes('Generate') || text.includes('Solar') || text.includes('Report') || text.includes('Get') || text.includes('Start'))) {
      console.log(`🎯 Potential generate button found: "${text}"`);
    }
  }
  
  // Look for any clickable elements that might be the generate button
  const clickableElements = await page.locator('button, input[type="button"], input[type="submit"], [role="button"], a').all();
  console.log('🖱️ All clickable elements found:', clickableElements.length);
  
  for (let i = 0; i < clickableElements.length; i++) {
    const text = await clickableElements[i].textContent();
    const tagName = await clickableElements[i].evaluate(el => el.tagName);
    const isVisible = await clickableElements[i].isVisible();
    const isEnabled = await clickableElements[i].isEnabled();
    
    if (text && (text.includes('Generate') || text.includes('Solar') || text.includes('Report') || text.includes('Get') || text.includes('Start'))) {
      console.log(`🎯 Potential generate element found: <${tagName}> "${text}" (visible: ${isVisible}, enabled: ${isEnabled})`);
    }
  }
  
  // Look for any text that might be a button
  const allText = await page.textContent('body');
  const lines = allText.split('\n');
  
  console.log('📄 Looking for button-like text in page content...');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && (trimmed.includes('Generate') || trimmed.includes('Solar') || trimmed.includes('Report') || trimmed.includes('Get') || trimmed.includes('Start'))) {
      console.log(`📝 Found text: "${trimmed}"`);
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-button-search.png' });
  console.log('📸 Screenshot saved as netflix-button-search.png');
});
