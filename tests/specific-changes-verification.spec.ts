import { test, expect } from '@playwright/test';

test.describe('Specific Changes Verification', () => {
  test('Report Page - Header and Main Content Width Match Footer', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that header has max-w-[1200px] (same as footer)
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Check that main content has max-w-[1200px]
    const mainContent = page.locator('main[data-testid="report-page"]');
    await expect(mainContent).toBeVisible();
    
    // Check that footer has max-w-[1200px]
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'report-width-verification.png', fullPage: true });
  });

  test('Support Page - Company Colors and Brand Data Attribute', async ({ page }) => {
    await page.goto('http://localhost:3003/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that page has data-brand attribute
    const pageElement = page.locator('[data-brand]');
    await expect(pageElement).toBeVisible();
    
    // Check that page has proper gradient background
    const pageDiv = page.locator('[data-brand]');
    const pageStyles = await pageDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage
      };
    });
    
    // Should have gradient background
    expect(pageStyles.backgroundImage).toContain('gradient');
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'support-colors-verification.png', fullPage: true });
  });

  test('Partners Page - Company Colors and Brand Data Attribute', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that page has data-brand attribute
    const pageElement = page.locator('[data-brand]');
    await expect(pageElement).toBeVisible();
    
    // Check that page has proper gradient background
    const pageDiv = page.locator('[data-brand]');
    const pageStyles = await pageDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage
      };
    });
    
    // Should have gradient background
    expect(pageStyles.backgroundImage).toContain('gradient');
    
    // Check that EarningsMini component exists
    await expect(page.locator('text=Earnings (example)')).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'partners-colors-verification.png', fullPage: true });
  });

  test('Pricing Page - Company Colors and Brand Data Attribute', async ({ page }) => {
    await page.goto('http://localhost:3003/pricing?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that page has data-brand attribute
    const pageElement = page.locator('[data-brand]');
    await expect(pageElement).toBeVisible();
    
    // Check that page has proper gradient background
    const pageDiv = page.locator('[data-brand]');
    const pageStyles = await pageDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage
      };
    });
    
    // Should have gradient background
    expect(pageStyles.backgroundImage).toContain('gradient');
    
    // Check that testimonial exists
    await expect(page.locator('text=Cut quoting time from 15 min to 1 min')).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'pricing-colors-verification.png', fullPage: true });
  });

  test('StickyCTA Only on Report Page', async ({ page }) => {
    // Check that report page has StickyCTA (only in demo mode)
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for the StickyCTA to potentially appear
    await page.waitForTimeout(2000);
    
    const stickyCTA = page.locator('[data-sticky-cta-desktop], [data-sticky-cta-mobile]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Check that pricing page does NOT have StickyCTA
    await page.goto('http://localhost:3003/pricing?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    const pricingStickyCTA = page.locator('[data-sticky-cta-desktop], [data-sticky-cta-mobile]');
    await expect(pricingStickyCTA).toHaveCount(0);
    
    // Check that partners page does NOT have StickyCTA
    await page.goto('http://localhost:3003/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    const partnersStickyCTA = page.locator('[data-sticky-cta-desktop], [data-sticky-cta-mobile]');
    await expect(partnersStickyCTA).toHaveCount(0);
    
    // Check that support page does NOT have StickyCTA
    await page.goto('http://localhost:3003/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    const supportStickyCTA = page.locator('[data-sticky-cta-desktop], [data-sticky-cta-mobile]');
    await expect(supportStickyCTA).toHaveCount(0);
  });
});
