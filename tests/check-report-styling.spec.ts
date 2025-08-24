import { test, expect } from '@playwright/test';

test('check report page styling and blur effects', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3005/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if we're past the loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  expect(loadingText).toBe(0);
  
  // Check for the main report content
  await expect(page.locator('h1:has-text("Solar Intelligence")')).toBeVisible();
  
  // Check for metric tiles
  const tiles = page.locator('[data-testid*="tile-"]');
  await expect(tiles).toHaveCount(4);
  
  // Check if any tiles have blur effects
  const blurredTiles = page.locator('.blur-target, .blur-overlay, [style*="filter: blur"]');
  const blurCount = await blurredTiles.count();
  console.log(`Blurred tiles found: ${blurCount}`);
  
  // Check for unlock buttons
  const unlockButtons = page.locator('button:has-text("Unlock Full Report")');
  const unlockCount = await unlockButtons.count();
  console.log(`Unlock buttons found: ${unlockCount}`);
  
  // Check button heights
  const buttons = page.locator('button');
  for (let i = 0; i < Math.min(5, await buttons.count()); i++) {
    const button = buttons.nth(i);
    const height = await button.evaluate(el => getComputedStyle(el).height);
    console.log(`Button ${i + 1} height: ${height}`);
  }
  
  // Check for brand colors
  const primaryColor = await page.evaluate(() => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue('--report-primary');
  });
  console.log(`Primary color CSS variable: ${primaryColor}`);
  
  // Take a screenshot to see the current state
  await page.screenshot({ path: 'report-current-state.png' });
  console.log('Screenshot saved as report-current-state.png');
  
  // Check if the page has the data-report attribute
  const hasDataReport = await page.locator('[data-report]').count();
  console.log(`Has data-report attribute: ${hasDataReport}`);
  
  // Check if CSS variables are set
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      primary: getComputedStyle(root).getPropertyValue('--report-primary'),
      accent: getComputedStyle(root).getPropertyValue('--report-accent'),
      muted: getComputedStyle(root).getPropertyValue('--report-muted'),
      unlockBlack: getComputedStyle(root).getPropertyValue('--report-unlockblack')
    };
  });
  console.log('CSS Variables:', cssVars);
});
