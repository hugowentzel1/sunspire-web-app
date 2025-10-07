import { test, expect } from '@playwright/test';

test('sticky placeholder prevents layout shift', async ({ page }) => {
  await page.goto('/report?company=uber&demo=1');
  
  const before = await page.evaluate(() => document.body.scrollHeight);
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(500);
  
  const after = await page.evaluate(() => document.body.scrollHeight);
  
  // Body height shouldn't jump significantly just to show sticky
  expect(Math.abs(after - before)).toBeLessThan(200);
});

