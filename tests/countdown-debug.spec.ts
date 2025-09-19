import { test, expect } from '@playwright/test';

test('Debug countdown timer', async ({ page }) => {
  // Navigate to demo version
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for countdown to initialize
  await page.waitForTimeout(3000);
  
  // Look for any countdown-related text
  const countdownElements = await page.locator('text=/\\d+:\\d+:\\d+:\\d+/').all();
  console.log('Countdown elements found:', countdownElements.length);
  
  for (let i = 0; i < countdownElements.length; i++) {
    const text = await countdownElements[i].textContent();
    console.log(`Countdown ${i}:`, text);
  }
  
  // Look for "expires in" text
  const expiresText = await page.locator('text=/expires in/i').all();
  console.log('Expires text found:', expiresText.length);
  
  for (let i = 0; i < expiresText.length; i++) {
    const text = await expiresText[i].textContent();
    console.log(`Expires ${i}:`, text);
  }
  
  // Look for any text containing numbers and colons
  const allText = await page.textContent('body');
  const countdownMatches = allText?.match(/\d+:\d+:\d+:\d+/g);
  console.log('All countdown matches:', countdownMatches);
  
  // Take a screenshot
  await page.screenshot({ path: 'countdown-debug.png', fullPage: true });
});


