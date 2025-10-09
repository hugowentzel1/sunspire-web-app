import { test, expect } from '@playwright/test';

const PAID_HOME = 'http://localhost:3001/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0';

test.describe('Paid surface cleanup', () => {
  test('no B2B/demo nav items on paid', async ({ page }) => {
    await page.goto(PAID_HOME);
    await expect(page.getByText(/Pricing/i)).toHaveCount(0);
    await expect(page.getByText(/Activate on Your Domain|Stripe|refund/i)).toHaveCount(0);
    await expect(page.getByText(/Partner Program|Partners/i)).toHaveCount(0);
    await expect(page.getByText(/System Status|Support Center/i)).toHaveCount(0);
  });

  test('footer has tenant legal links and one Powered by Sunspire', async ({ page }) => {
    await page.goto(PAID_HOME);
    // Check links
    for (const name of ['Privacy Policy','Terms of Service','Accessibility','Contact']) {
      await expect(page.getByRole('link', { name: new RegExp(name,'i') })).toBeVisible();
    }
    // Check Cookie Preferences button
    await expect(page.getByRole('button', { name: /Cookie Preferences/i })).toBeVisible();
    
    const powered = page.getByText(/Powered by Sunspire/i);
    await expect(powered).toBeVisible();
    await expect(powered).toHaveCount(1);
  });
});
