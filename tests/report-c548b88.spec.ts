import { test, expect } from '@playwright/test';

test('report matches c548b88 structure, locks, and colors', async ({ page }) => {
  await page.goto('http://localhost:3000/report/1?company=apple');

  // Headline exists
  await expect(page.locator('[data-report] .headline')).toContainText(/New Analysis/i);

  // Tiles: 4 present; locks on #3 and #4
  const tiles = page.locator('[data-report] [data-testid*="tile-"]');
  await expect(tiles).toHaveCount(4);
  await expect(tiles.nth(0).locator('.blur-overlay')).toHaveCount(0);
  await expect(tiles.nth(1).locator('.blur-overlay')).toHaveCount(0);
  await expect(tiles.nth(2).locator('.blur-overlay')).toBeVisible();
  await expect(tiles.nth(3).locator('.blur-overlay')).toBeVisible();
  await expect(tiles.nth(2).getByRole('button', { name: /Unlock Full Report/i })).toBeVisible();
  await expect(tiles.nth(3).getByRole('button', { name: /Unlock Full Report/i })).toBeVisible();

  // Sections: financial & environmental locked, assumptions unlocked
  const financial = page.locator('[data-testid="section-financial"]');
  const environmental = page.locator('[data-testid="section-environmental"]');
  const assumptions = page.locator('[data-testid="section-assumptions"]');
  await expect(financial.locator('.blur-overlay')).toBeVisible();
  await expect(environmental.locator('.blur-overlay')).toBeVisible();
  await expect(assumptions.locator('.blur-overlay')).toHaveCount(0);

  // Apple brand primary on primary buttons
  // #0071e3 -> rgb(0, 113, 227)
  const primary = page.locator('[data-report] .btn-primary').first();
  const bg = await primary.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg.replace(/\s/g,'')).toBe('rgb(0,113,227)');

  // Unlock buttons are pure black
  const unlock = page.locator('[data-report] .unlock-btn').first();
  const unlockBg = await unlock.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(unlockBg.replace(/\s/g,'')).toBe('rgb(10,10,10)');

  // Button height exact
  const h = await primary.evaluate(el => getComputedStyle(el).height);
  expect(h).toBe('64px');

  // CTA band content
  await expect(page.getByRole('button', { name: /Get Matched with Installers/i })).toBeVisible();
});

test('report brand color swaps correctly', async ({ page }) => {
  // Test Apple (blue)
  await page.goto('http://localhost:3000/report/1?company=apple');
  const applePrimary = page.locator('[data-report] .btn-primary').first();
  const appleBg = await applePrimary.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(appleBg.replace(/\s/g,'')).toBe('rgb(0,113,227)');

  // Test Amazon (orange)
  await page.goto('http://localhost:3000/report/1?company=amazon');
  const amazonPrimary = page.locator('[data-report] .btn-primary').first();
  const amazonBg = await amazonPrimary.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(amazonBg.replace(/\s/g,'')).toBe('rgb(255,153,0)');
});
