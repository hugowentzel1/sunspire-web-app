import { test, expect } from '@playwright/test';

test.describe('ALL PAGES - Parameter Preservation Test', () => {
  const demoParams = 'demo=1&company=tesla&brandColor=%23CC0000';
  const paidParams = 'company=apple&brandColor=%2300FF00';

  test('DEMO MODE - All major pages preserve parameters', async ({ page }) => {
    // Start at home
    await page.goto(`/?${demoParams}`);
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
    await expect(demoBanner).toContainText('tesla');

    // Test Privacy page (banner should NOT show on legal pages)
    await page.goto(`/privacy?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('main a:has-text("Back to Home")').click(); // Click the one at top of page
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);
    await expect(page.locator('[data-testid="demo-banner"]').first()).toContainText('tesla');

    // Test Terms page (banner should NOT show on legal pages)
    await page.goto(`/terms?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);

    // Test Security page (banner should NOT show on legal pages)
    await page.goto(`/security?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);

    // Test Support page (banner SHOULD show)
    await page.goto(`/support?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]').first()).toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);

    // Test Setup Guide (banner SHOULD show)
    await page.goto(`/docs/setup?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]').first()).toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);

    // Test Branding Guide (banner SHOULD show)
    await page.goto(`/docs/branding?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]').first()).toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);

    // Test API Docs (banner SHOULD show)
    await page.goto(`/docs/api?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]').first()).toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);

    // Test CRM page (banner SHOULD show)
    await page.goto(`/docs/crm?${demoParams}`);
    await expect(page.locator('[data-testid="demo-banner"]').first()).toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\?demo=1&company=tesla/);
  });

  test('PAID MODE - All major pages preserve parameters', async ({ page }) => {
    // Start at paid home
    await page.goto(`/paid?${paidParams}`);
    const demoBanner = page.locator('[data-testid="demo-banner"]');
    await expect(demoBanner).not.toBeVisible(); // No demo banner in paid mode

    // Test Privacy page (paid)
    await page.goto(`/privacy?${paidParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\/paid\?company=apple/);

    // Test Terms page (paid)
    await page.goto(`/terms?${paidParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\/paid\?company=apple/);

    // Test Security page (paid)
    await page.goto(`/security?${paidParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\/paid\?company=apple/);

    // Test Support page (paid)
    await page.goto(`/support?${paidParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\/paid\?company=apple/);

    // Test Setup Guide (paid)
    await page.goto(`/docs/setup?${paidParams}`);
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
    await page.locator('a:has-text("Back to Home")').first().click();
    await expect(page).toHaveURL(/\/paid\?company=apple/);
  });
});
