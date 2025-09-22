import { test, expect } from '@playwright/test';

test('verify metrics bar width alignment with feature cards', async ({ page }) => {
  // Navigate to the live site
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Get the 3-column feature cards (second row)
  const featureCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-3.gap-8.max-w-5xl.mx-auto.section-spacing');
  await expect(featureCards).toBeVisible();
  
  // Get the metrics bar
  const metricsBar = page.locator('[data-testid="metrics-bar"]');
  await expect(metricsBar).toBeVisible();
  
  // Get the bounding boxes
  const featureCardsBox = await featureCards.boundingBox();
  const metricsBarBox = await metricsBar.boundingBox();
  
  console.log('Feature cards bounding box:', featureCardsBox);
  console.log('Metrics bar bounding box:', metricsBarBox);
  
  // Check if the widths are approximately equal (within 10px tolerance)
  if (featureCardsBox && metricsBarBox) {
    const widthDifference = Math.abs(featureCardsBox.width - metricsBarBox.width);
    console.log('Width difference:', widthDifference);
    
    // The widths should be very close (within 10px)
    expect(widthDifference).toBeLessThan(10);
    
    // Check if the left edges are aligned (within 5px tolerance)
    const leftEdgeDifference = Math.abs(featureCardsBox.x - metricsBarBox.x);
    console.log('Left edge difference:', leftEdgeDifference);
    expect(leftEdgeDifference).toBeLessThan(5);
  }
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'width-alignment-test.png', fullPage: true });
});

test('verify button size and centering', async ({ page }) => {
  // Navigate to the report page
  await page.goto('https://sunspire-web-app.vercel.app/report?company=Apple&demo=1&address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Get the activate button
  const activateButton = page.locator('[data-cta="primary"]');
  await expect(activateButton).toBeVisible();
  
  // Check button text size
  const buttonText = await activateButton.textContent();
  expect(buttonText).toContain('Activate on Your Domain - $99/mo + $399');
  
  // Get button styling
  const buttonStyles = await activateButton.evaluate((el) => {
    const computedStyle = window.getComputedStyle(el);
    return {
      paddingLeft: computedStyle.paddingLeft,
      paddingRight: computedStyle.paddingRight,
      paddingTop: computedStyle.paddingTop,
      paddingBottom: computedStyle.paddingBottom,
      fontSize: computedStyle.fontSize,
    };
  });
  
  console.log('Button styles:', buttonStyles);
  
  // Verify the button has the expected larger size
  expect(buttonStyles.fontSize).toBe('24px'); // text-2xl = 24px
  expect(buttonStyles.paddingLeft).toBe('56px'); // px-14 = 56px
  expect(buttonStyles.paddingRight).toBe('56px'); // px-14 = 56px
  expect(buttonStyles.paddingTop).toBe('24px'); // py-6 = 24px
  expect(buttonStyles.paddingBottom).toBe('24px'); // py-6 = 24px
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'button-size-test.png', fullPage: true });
});
