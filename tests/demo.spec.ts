import { test, expect } from '@playwright/test';

test('demo hero copy updated (H1 + subhead) and single CTA present', async ({ page }) => {
  await page.goto('/');
  // H1 + subhead copy updated
  await expect(page.locator('h1')).toContainText('Your Branded Solar Quote Tool — Live on Your Site in 24 Hours.');
  await expect(page.locator('p').first()).toContainText('instant, fully-branded');
  // Single outcome-first CTA
  await expect(page.getByTestId('demo-cta-group')).toBeVisible();
  await expect(page.getByTestId('demo-cta-activate')).toHaveText(/Launch on Your Domain/i);
  // No secondary CTA expected
  const secondary = page.getByTestId('demo-cta-secondary');
  await expect(secondary).toHaveCount(0);
});

test('demo subhead uses plain-language setup promise', async ({ page }) => {
  await page.goto('/');
  // New phrase present
  await expect(page.locator('p')).toContainText('We set it up for you — no coding required');
  // Old phrase absent
  await expect(page.locator('p')).not.toContainText('No dev work');
});

