import { test, expect } from '@playwright/test';

test('Find correct button text on Netflix demo', async ({ page }) => {
  console.log('🔍 Finding correct button text on Netflix demo...');
  
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
  
  // Get all text content on the page
  const allText = await page.textContent('body');
  console.log('📄 All page text:', allText);
  
  // Look for any button-like elements
  const allButtons = await page.locator('button, input[type="button"], input[type="submit"], [role="button"]').all();
  console.log('🔘 All button-like elements found:', allButtons.length);
  
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    const tagName = await allButtons[i].evaluate(el => el.tagName);
    const type = await allButtons[i].getAttribute('type');
    const isVisible = await allButtons[i].isVisible();
    const isEnabled = await allButtons[i].isEnabled();
    console.log(`Button ${i}: <${tagName} type="${type}"> "${text}" (visible: ${isVisible}, enabled: ${isEnabled})`);
  }
  
  // Look for any elements containing "Generate" or "Report" or "Solar"
  const generateElements = await page.locator('text=Generate, text=Report, text=Solar').all();
  console.log('🔍 Found Generate/Report/Solar elements:', generateElements.length);
  
  for (let i = 0; i < generateElements.length; i++) {
    const text = await generateElements[i].textContent();
    const tagName = await generateElements[i].evaluate(el => el.tagName);
    const isVisible = await generateElements[i].isVisible();
    console.log(`Element ${i}: <${tagName}> "${text}" (visible: ${isVisible})`);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-button-debug.png' });
  console.log('📸 Screenshot saved as netflix-button-debug.png');
});
