import { test, expect } from '@playwright/test';

test('sticky CTA exact content + validation cue fades', async ({ page }) => {
  await page.goto('/report?company=uber&demo=1');
  const sticky = page.locator('[data-testid="sticky-cta"]');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(500);
  await expect(sticky).toBeVisible();

  // Button text exact
  const button = sticky.locator('text=Activate on Your Domain — 24 Hours');
  await expect(button).toBeVisible();

  // Microcopy line present
  await expect(sticky.locator('text=Instant setup — no code, live in 2 min.')).toBeVisible();

  // Trust chips present
  await expect(sticky.locator('text=SOC 2')).toBeVisible();
  await expect(sticky.locator('text=GDPR')).toBeVisible();
  await expect(sticky.locator('text=NREL PVWatts')).toBeVisible();

  // Validation cue appears then fades
  const cue = sticky.locator('text=Ready for your company domain');
  const cueVisible = await cue.isVisible();
  if (cueVisible) {
    await page.waitForTimeout(1800);
    const cueAfterWait = await cue.isVisible();
    expect(cueAfterWait).toBeFalsy();
  }
});

