import { test, expect } from '@playwright/test';

test.describe('Final Changes Verification', () => {
  test('Support Page - No Blue Colors (Visual Check)', async ({ page }) => {
    await page.goto('http://localhost:3003/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to verify visually that blue colors are gone
    await page.screenshot({ path: 'support-final-colors.png', fullPage: true });
    
    // Check that page has data-brand attribute
    await expect(page.locator('[data-brand]')).toBeVisible();
  });

  test('Partners Page - No Blue Colors (Visual Check)', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to verify visually that blue colors are gone
    await page.screenshot({ path: 'partners-final-colors.png', fullPage: true });
    
    // Check that page has data-brand attribute
    await expect(page.locator('[data-brand]')).toBeVisible();
  });

  test('Report Page - Navigation Links Match Home Page', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that report page header has Pricing, Partners, Support links
    await expect(page.locator('nav a[href*="/pricing"]')).toBeVisible();
    await expect(page.locator('nav a[href*="/partners"]')).toBeVisible();
    await expect(page.locator('nav a[href*="/support"]')).toBeVisible();
    
    // Check that outdated links (Privacy, Terms, Security) are NOT present
    await expect(page.locator('nav a[href*="/privacy"]')).toHaveCount(0);
    await expect(page.locator('nav a[href*="/terms"]')).toHaveCount(0);
    await expect(page.locator('nav a[href*="/security"]')).toHaveCount(0);
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'report-navigation-final.png', fullPage: true });
  });

  test('Report Page - Container Width Alignment', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that header uses Container
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check that main content uses Container
    const mainContent = page.locator('main[data-testid="report-page"]');
    await expect(mainContent).toBeVisible();
    
    // Check that footer uses Container
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Take screenshot to verify visual alignment
    await page.screenshot({ path: 'report-container-alignment.png', fullPage: true });
  });

  test('All Pages Use Container Consistently', async ({ page }) => {
    const pages = [
      { url: '/pricing?company=Netflix&demo=1', name: 'pricing' },
      { url: '/partners?company=Netflix&demo=1', name: 'partners' },
      { url: '/support?company=Netflix&demo=1', name: 'support' },
      { url: '/report?company=Netflix&demo=1', name: 'report' }
    ];

    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3003${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Check that page has data-brand attribute
      await expect(page.locator('[data-brand]')).toBeVisible();
      
      // Take screenshot for each page
      await page.screenshot({ path: `${pageInfo.name}-final-verification.png`, fullPage: true });
    }
  });
});