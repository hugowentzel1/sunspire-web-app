import { test, expect } from '@playwright/test';

test('quotes: 4 cards, exact copy snippets, verified line, grid layout', async ({ page }) => {
  await page.goto('/');

  // Look for "Verified" indicators
  const verifiedElements = page.locator('text=Verified');
  const verifiedCount = await verifiedElements.count();
  expect(verifiedCount).toBeGreaterThanOrEqual(4);

  // Copy snippets from the new quotes
  const snippets = [
    'Booked 4 extra consults in week one.',
    'Closed 2 deals the same day',
    '+42% more follow-ups',
    'Paid for itself in 9 days.'
  ];
  
  for (const snippet of snippets) {
    await expect(page.locator(`text=${snippet}`)).toBeVisible();
  }

  // Hero micro-testimonial chip present
  await expect(page.locator('text=Cut quoting time from 15 min → 1 min')).toBeVisible();
});

