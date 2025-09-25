import { test, expect } from '@playwright/test';

test('footer is ≥120px and visually ok', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=Apple&demo=1', { waitUntil: 'domcontentloaded' });
  const footer = page.locator('[data-testid="footer"]');
  const h = await footer.evaluate(el => Math.round(el.getBoundingClientRect().height));
  expect(h).toBeGreaterThanOrEqual(120);
  await expect(footer).toHaveScreenshot('footer-after.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
    scale: 'css'
  });
});
