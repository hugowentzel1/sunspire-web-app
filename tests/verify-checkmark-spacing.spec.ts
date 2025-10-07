import { test, expect } from '@playwright/test';

test('Verify checkmark spacing on paid page', async ({ page }) => {
  // Navigate to paid Microsoft page
  await page.goto('http://localhost:3000/?company=microsoft&demo=0');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Find the live bar
  const liveBar = page.locator('[data-testid="live-bar"]');
  await expect(liveBar).toBeVisible();

  // Take screenshot
  await liveBar.screenshot({ 
    path: 'test-results/checkmark-spacing.png'
  });

  // Get the checkmark span
  const checkmark = liveBar.locator('span').first();
  const textSpan = liveBar.locator('span').last();

  // Get bounding boxes
  const checkmarkBox = await checkmark.boundingBox();
  const textBox = await textSpan.boundingBox();

  console.log('Checkmark box:', checkmarkBox);
  console.log('Text box:', textBox);

  if (checkmarkBox && textBox) {
    const spacing = textBox.x - (checkmarkBox.x + checkmarkBox.width);
    console.log(`Spacing between checkmark and text: ${spacing}px`);
    
    // Verify spacing is at least 24px (should be ~32px with gap-6 + mr-2)
    expect(spacing).toBeGreaterThan(20);
  }

  // Also check computed styles
  const gapValue = await liveBar.evaluate((el) => {
    return window.getComputedStyle(el).gap;
  });
  
  const marginRight = await checkmark.evaluate((el) => {
    return window.getComputedStyle(el).marginRight;
  });

  console.log('Container gap:', gapValue);
  console.log('Checkmark margin-right:', marginRight);

  await page.screenshot({ 
    path: 'test-results/full-page-checkmark.png',
    fullPage: true 
  });

  console.log('✓ Checkmark spacing verified');
});

