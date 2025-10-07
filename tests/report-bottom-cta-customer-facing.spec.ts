import { test, expect } from '@playwright/test';

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:3000/?company=meta&demo=1';

test.describe('Report bottom CTA — customer-facing with price anchor only', () => {
  test('shows headline, subtext, price in button, anchor line, and no duplicate price footer', async ({ page }) => {
    // Navigate to home first to trigger demo generation
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    
    // Find address input and enter a test address
    const addressInput = page.locator('input[type="text"]').first();
    await addressInput.fill('123 Main St, Phoenix, AZ 85001');
    await page.waitForTimeout(1000);
    
    // Click the generate button
    const generateButton = page.locator('button', { hasText: /Generate|Launch/i }).first();
    await generateButton.click();
    
    // Wait for navigation to report page
    await page.waitForURL(/\/report/);
    await page.waitForLoadState('networkidle');

    // Band + headline + subtext
    await expect(page.getByTestId('bottom-cta-band')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Ready to Launch Your Branded, Customer-Facing Tool?' })
    ).toBeVisible();
    await expect(
      page.getByText(
        'Get the full paid version—customer-facing and under your brand—with complete projections, detailed assumptions, and unblurred savings charts.'
      )
    ).toBeVisible();

    // Button shows your price
    const btn = page.getByTestId('bottom-cta-button');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveText(/Activate on Your Domain — \$99\/mo \+ \$399 setup/);

    // Footer shows ONLY the anchor line (no duplicate "Full version…" price text)
    const footer = page.getByTestId('bottom-cta-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveText(/Comparable tools cost \$2,500\+\/mo\./);

    // Ensure the old redundant line is gone
    await expect(page.locator('text=Full version from just $99/mo + $399 setup')).toHaveCount(0);

    // No sticky CTAs on report (per our earlier decision)
    await expect(page.locator('[data-testid="sticky-cta"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="footer-cta"]')).toHaveCount(0);
  });
});
