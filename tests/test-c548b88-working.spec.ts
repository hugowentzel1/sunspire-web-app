import { test, expect } from '@playwright/test';

test('test c548b88 report page is working', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3005/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if we're NOT in loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  console.log(`Loading text count: ${loadingText}`);
  
  // Check for actual content
  const hasSolarContent = await page.locator('text=Solar Intelligence').count();
  const hasSystemSize = await page.locator('text=System Size').count();
  const hasAnnualProduction = await page.locator('text=Annual Production').count();
  
  console.log('Has Solar Intelligence:', hasSolarContent);
  console.log('Has System Size:', hasSystemSize);
  console.log('Has Annual Production:', hasAnnualProduction);
  
  // Check for blur effects (the key visual element from c548b88)
  const blurElements = await page.locator('.backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg').count();
  console.log('Blur elements found:', blurElements);
  
  // Check for unlock buttons
  const unlockButtons = await page.locator('button:has-text("Unlock Full Report")').count();
  console.log('Unlock buttons found:', unlockButtons);
  
  // Take screenshot
  await page.screenshot({ path: 'c548b88-working.png' });
  
  // Assert the page is working
  expect(loadingText).toBe(0); // Should not be loading
  expect(hasSolarContent).toBeGreaterThan(0); // Should have content
  expect(blurElements).toBeGreaterThan(0); // Should have blur effects
  expect(unlockButtons).toBeGreaterThan(0); // Should have unlock buttons
});
