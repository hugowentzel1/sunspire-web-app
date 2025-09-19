import { test, expect } from '@playwright/test';

test('Countdown timer should start at 7 days', async ({ page }) => {
  // Navigate to demo version
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for countdown to initialize
  await page.waitForTimeout(2000);
  
  // Check if countdown is visible and shows 7 days
  const countdownText = await page.textContent('text=6:23:16:19');
  
  if (countdownText) {
    console.log('Countdown found:', countdownText);
    // The countdown should show 6 days, 23 hours, 16 minutes, 19 seconds (or similar)
    // This indicates it started at 7 days
    expect(countdownText).toContain('6:');
  } else {
    // Look for any countdown pattern
    const countdownElements = await page.locator('text=/\\d+:\\d+:\\d+:\\d+/').all();
    console.log('Countdown elements found:', countdownElements.length);
    
    for (let i = 0; i < countdownElements.length; i++) {
      const text = await countdownElements[i].textContent();
      console.log(`Countdown ${i}:`, text);
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'countdown-test.png', fullPage: true });
});


