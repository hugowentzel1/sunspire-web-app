// tests/sunspire.spec.ts
import { test, expect } from '@playwright/test';

const DEMO_URL =
  'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
const PAID_URL =
  'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';

async function assertFooterBasics(page) {
  const footer = page.locator('footer, [data-footer], body >> text=NREL');
  await expect(page.locator('body')).toHaveText(/NREL PVWatts/i);
  await expect(page.locator('body')).toHaveText(/Mapping\s*&\s*location data\s*©\s*Google/i);

  // No phone number; no legacy disclaimer
  await expect(page.locator('body')).not.toHaveText(/\(555\)\s*123-4567/i);
  await expect(page.locator('body')).not.toHaveText(/Estimates are informational/i);
  await expect(page.locator('body')).not.toHaveText(/not a binding quote/i);

  // Legal links present with href
  const legalLabels = [
    /Privacy Policy/i,
    /Terms of Service/i,
    /Security/i,
    /\bDPA\b/i,
    /Do Not Sell My Data/i,
  ];
  for (const label of legalLabels) {
    const link = page.locator('a', { hasText: label });
    await expect(link).toHaveCount(1);
    await expect(link.first()).toHaveAttribute(/href/i, /.+/);
  }
}

test.describe('Sunspire – Demo', () => {
  test('Footer + legal present and clean', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await assertFooterBasics(page);
  });

  test('Address autosuggest and CTA exist', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });

    // Address input
    const addressInput = page.getByRole('textbox').filter({ hasText: '' }).first();
    await expect(addressInput).toBeVisible();

    // Type and wait for Places suggestions (pac-item)
    await addressInput.fill('1600 Pennsylvania Ave');
    const suggestion = page.locator('.pac-item');
    try {
      await expect(suggestion).toBeVisible({ timeout: 10000 });
    } catch {
      // retry once
      await addressInput.fill('');
      await addressInput.type('1600 Pennsylvania Ave', { delay: 50 });
      await expect(suggestion).toBeVisible({ timeout: 10000 });
    }

    // Generate CTA exists/enabled (text may be "Generate Solar Intelligence Report")
    const generateBtn = page.getByRole('button', { name: /generate/i });
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toBeEnabled();
  });
});

test.describe('Sunspire – Paid', () => {
  test('Footer + legal present and clean', async ({ page }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    await assertFooterBasics(page);
  });

  test('Unlock flows to Stripe Checkout', async ({ page, context }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });

    const unlockBtn = page.getByRole('button', { name: /unlock full report/i });
    await expect(unlockBtn).toBeVisible();

    // Some apps open a new tab/window; detect popup
    const [popup] = await Promise.all([
      context.waitForEvent('page').catch(() => null),
      unlockBtn.click(),
    ]);

    if (popup) {
      await popup.waitForLoadState();
      const url = popup.url();
      expect(url).toMatch(/^https:\/\/checkout\.stripe\.com\/.*/i);
    } else {
      // If it's an <a> link in-place, assert href
      const link = page.locator('a', { hasText: /unlock full report/i });
      if (await link.count()) {
        await expect(link.first()).toHaveAttribute('href', /checkout\.stripe\.com/i);
      } else {
        // As a final fallback, assert we navigated to Stripe in the same tab
        expect(page.url()).toMatch(/checkout\.stripe\.com/i);
      }
    }
  });
});
