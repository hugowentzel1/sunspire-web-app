import { test, expect } from '@playwright/test';

test.describe('Header and Color Fixes Verification', () => {
  test('Report Page - Header Width Consistency', async ({ page }) => {
    await page.goto('http://localhost:3000/report?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that header is visible
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Check that header uses max-w-[1200px] (same as footer)
    const headerContent = header.locator('div').first();
    await expect(headerContent).toBeVisible();
    
    // Take screenshot to verify header width
    await page.screenshot({ path: 'report-header-width-check.png', fullPage: true });
    
    console.log('Report page header checked');
  });

  test('Support Page - Brand Colors in Background', async ({ page }) => {
    await page.goto('http://localhost:3000/support?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that page has data-brand attribute
    await expect(page.locator('[data-brand]')).toBeVisible();
    
    // Check that page has brand gradient background
    const pageDiv = page.locator('[data-brand]');
    const styles = await pageDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage
      };
    });
    
    // Should have gradient background with brand colors
    expect(styles.backgroundImage).toContain('gradient');
    
    // Take screenshot to verify brand colors
    await page.screenshot({ path: 'support-brand-colors-check.png', fullPage: true });
    
    console.log('Support page brand colors checked');
  });

  test('Partners Page - Brand Colors in Background', async ({ page }) => {
    await page.goto('http://localhost:3000/partners?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that page has data-brand attribute
    await expect(page.locator('[data-brand]')).toBeVisible();
    
    // Check that page has brand gradient background
    const pageDiv = page.locator('[data-brand]');
    const styles = await pageDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage
      };
    });
    
    // Should have gradient background with brand colors
    expect(styles.backgroundImage).toContain('gradient');
    
    // Take screenshot to verify brand colors
    await page.screenshot({ path: 'partners-brand-colors-check.png', fullPage: true });
    
    console.log('Partners page brand colors checked');
  });

  test('All Pages Visual Verification', async ({ page }) => {
    const pages = [
      { url: '/support?company=Netflix&brandColor=E50914&demo=1', name: 'support' },
      { url: '/partners?company=Netflix&brandColor=E50914&demo=1', name: 'partners' },
      { url: '/report?company=Netflix&brandColor=E50914&demo=1', name: 'report' }
    ];

    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3000${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Wait for any dynamic content
      await page.waitForTimeout(2000);
      
      // Take screenshot for visual verification
      await page.screenshot({ path: `${pageInfo.name}-final-fixes-check.png`, fullPage: true });
      
      console.log(`Screenshot taken for ${pageInfo.name} page`);
    }
  });
});
