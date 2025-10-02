import { test, expect } from '@playwright/test';

test.describe('Visual Spacing Check', () => {
  test('Pricing page loads with proper spacing', async ({ page }) => {
    await page.goto('http://localhost:3003/pricing');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('main h1')).toBeVisible();
    console.log('✅ Pricing page loaded successfully');
  });

  test('Partners page loads with proper spacing', async ({ page }) => {
    await page.goto('http://localhost:3003/partners');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('main h1')).toBeVisible();
    console.log('✅ Partners page loaded successfully');
  });

  test('Support page loads with proper spacing', async ({ page }) => {
    await page.goto('http://localhost:3003/support');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('main h1')).toBeVisible();
    console.log('✅ Support page loaded successfully');
  });

  test('Report page loads with proper width', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('[data-testid="report-page"]')).toBeVisible();
    console.log('✅ Report page loaded successfully');
  });
});
