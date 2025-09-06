import { test, expect } from '@playwright/test';

test('Debug Netflix demo page', async ({ page }) => {
  console.log('🔍 Debugging Netflix demo page...');
  
  // Navigate to Netflix demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Log all buttons on the page
  const buttons = await page.locator('button').all();
  console.log('🔘 Found buttons:', buttons.length);
  
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const isVisible = await buttons[i].isVisible();
    const isEnabled = await buttons[i].isEnabled();
    console.log(`Button ${i}: "${text}" (visible: ${isVisible}, enabled: ${isEnabled})`);
  }
  
  // Check for any elements with "Generate" text
  const generateElements = await page.locator('text=Generate').all();
  console.log('🔍 Found Generate elements:', generateElements.length);
  
  for (let i = 0; i < generateElements.length; i++) {
    const text = await generateElements[i].textContent();
    const tagName = await generateElements[i].evaluate(el => el.tagName);
    console.log(`Generate element ${i}: <${tagName}> "${text}"`);
  }
  
  // Check for any elements with "Solar" text
  const solarElements = await page.locator('text=Solar').all();
  console.log('🔍 Found Solar elements:', solarElements.length);
  
  for (let i = 0; i < solarElements.length; i++) {
    const text = await solarElements[i].textContent();
    const tagName = await solarElements[i].evaluate(el => el.tagName);
    console.log(`Solar element ${i}: <${tagName}> "${text}"`);
  }
  
  // Check for any elements with "Report" text
  const reportElements = await page.locator('text=Report').all();
  console.log('🔍 Found Report elements:', reportElements.length);
  
  for (let i = 0; i < reportElements.length; i++) {
    const text = await reportElements[i].textContent();
    const tagName = await reportElements[i].evaluate(el => el.tagName);
    console.log(`Report element ${i}: <${tagName}> "${text}"`);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-debug.png' });
  console.log('📸 Screenshot saved as netflix-debug.png');
});
