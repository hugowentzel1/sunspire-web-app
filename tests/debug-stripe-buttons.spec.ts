import { test, expect } from '@playwright/test';

test('Debug Stripe Buttons - See What Buttons Are Actually There', async ({ page }) => {
  console.log('🔍 Debugging Stripe buttons on report page...');
  
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-stripe-buttons.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-stripe-buttons.png');
  
  // Count all buttons
  const allButtons = await page.locator('button').count();
  console.log(`🔍 Found ${allButtons} total buttons`);
  
  // List all button texts
  for (let i = 0; i < allButtons; i++) {
    const buttonText = await page.locator('button').nth(i).textContent();
    console.log(`Button ${i}: "${buttonText}"`);
  }
  
  // Check for specific button patterns
  const unlockButtons = page.locator('button').filter({ hasText: /unlock/i });
  const unlockCount = await unlockButtons.count();
  console.log(`🔍 Found ${unlockCount} buttons with "unlock" text`);
  
  const activateButtons = page.locator('button').filter({ hasText: /activate/i });
  const activateCount = await activateButtons.count();
  console.log(`🔍 Found ${activateCount} buttons with "activate" text`);
  
  const buyButtons = page.locator('button').filter({ hasText: /buy/i });
  const buyCount = await buyButtons.count();
  console.log(`🔍 Found ${buyCount} buttons with "buy" text`);
  
  const getQuoteButtons = page.locator('button').filter({ hasText: /get quote/i });
  const getQuoteCount = await getQuoteButtons.count();
  console.log(`🔍 Found ${getQuoteCount} buttons with "get quote" text`);
  
  // Check for any buttons with data attributes
  const ctaButtons = page.locator('[data-cta]');
  const ctaCount = await ctaButtons.count();
  console.log(`🔍 Found ${ctaCount} buttons with data-cta attribute`);
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(10000);
});
