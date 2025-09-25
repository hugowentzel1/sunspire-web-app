import { test, expect } from '@playwright/test';

test('footer is ≥120px and visually ok', async ({ page }) => {
  // Capture console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/?company=Apple&demo=1', { waitUntil: 'networkidle' });
  
  // Wait a bit for the page to fully render
  await page.waitForTimeout(3000);
  
  // Check what elements are actually on the page
  const bodyText = await page.textContent('body');
  console.log('Body contains "footer":', bodyText?.toLowerCase().includes('footer'));
  console.log('Body contains "Sunspire":', bodyText?.toLowerCase().includes('sunspire'));
  
  // Check for any footer elements
  const footerElements = await page.locator('footer').count();
  console.log('Footer elements found:', footerElements);
  
  // Check for data-testid elements
  const testIdElements = await page.locator('[data-testid]').count();
  console.log('Elements with data-testid:', testIdElements);
  
  // Take a full page screenshot to see what's loading
  await page.screenshot({ path: 'debug-page.png', fullPage: true });
  
  // Take a screenshot of just the footer
  await page.screenshot({ path: 'footer-debug.png', fullPage: false });
  
  // Check if footer exists
  const footerExists = await page.locator('[data-testid="footer"]').count() > 0;
  console.log('Footer exists:', footerExists);
  
  if (footerExists) {
    const footer = page.locator('[data-testid="footer"]');
    const h = await footer.evaluate(el => Math.round(el.getBoundingClientRect().height));
    console.log('Footer height:', h);
    expect(h).toBeGreaterThanOrEqual(120);
    // Update the screenshot to match the new footer design
    await expect(footer).toHaveScreenshot('footer-after.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.1, // Allow more tolerance for visual changes
      scale: 'css'
    });
  } else {
    // If footer doesn't exist, fail the test with a helpful message
    throw new Error('Footer element with data-testid="footer" not found on page');
  }
});