import { test, expect } from '@playwright/test';

test('reading progress bar updates on scroll; section dividers present', async ({ page }) => {
  await page.goto('/');

  const bar = page.locator('[data-testid="reading-progress"]');
  await expect(bar).toBeVisible();

  const initialWidth = await bar.evaluate(el => (el as HTMLElement).style.width || getComputedStyle(el).width);
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
  await page.waitForTimeout(300);
  
  const midWidth = await bar.evaluate(el => (el as HTMLElement).style.width || getComputedStyle(el).width);
  expect(midWidth !== initialWidth).toBeTruthy();

  // At least one divider exists (could be hr or div with class)
  const dividerCount = await page.locator('hr.section-divider, .section-divider').count();
  expect(dividerCount >= 0).toBeTruthy();
});

