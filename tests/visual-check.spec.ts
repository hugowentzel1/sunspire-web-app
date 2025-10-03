import { test, expect } from '@playwright/test';

test.describe('Visual Check of All Pages', () => {
  test('Check Pricing Page Layout', async ({ page }) => {
    await page.goto('http://localhost:3003/pricing?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'pricing-page-check.png', fullPage: true });
    
    // Check basic elements exist
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Start setup')).toBeVisible();
  });

  test('Check Partners Page Layout', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'partners-page-check.png', fullPage: true });
    
    // Check basic elements exist
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Submit Partner Application')).toBeVisible();
  });

  test('Check Support Page Layout', async ({ page }) => {
    await page.goto('http://localhost:3003/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'support-page-check.png', fullPage: true });
    
    // Check basic elements exist
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Email Support')).toBeVisible();
  });

  test('Check Report Page Layout', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'report-page-check.png', fullPage: true });
    
    // Check basic elements exist
    await expect(page.locator('h1')).toBeVisible();
  });
});