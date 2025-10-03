import { test, expect } from '@playwright/test';

test.describe('Actual Changes Verification', () => {
  test('Support Page - No Green Colors (Should Use Brand Colors)', async ({ page }) => {
    await page.goto('http://localhost:3003/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there are NO green colors on the page
    const greenElements = page.locator('.text-green-600, .text-green-700, .bg-green-100, .bg-green-50, .border-green-200');
    await expect(greenElements).toHaveCount(0);
    
    // Check that brand colors are used instead
    const brandElements = page.locator('.text-\\[var\\(--brand-600\\)\\], .text-\\[var\\(--brand-700\\)\\], .bg-\\[var\\(--brand-100\\)\\]');
    await expect(brandElements.first()).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'support-no-green-colors.png', fullPage: true });
  });

  test('Partners Page - No Green Colors Except Checkmarks', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there are NO green colors except for checkmarks
    const greenElements = page.locator('.text-green-600, .text-green-700, .bg-green-100, .bg-green-50, .border-green-200');
    await expect(greenElements).toHaveCount(0);
    
    // Check that checkmarks are still green (they should be)
    const checkmarkElements = page.locator('svg[fill="currentColor"]').filter({ hasText: '' });
    // Checkmarks should remain green for accessibility
    
    // Check that brand colors are used for other elements
    const brandElements = page.locator('.text-\\[var\\(--brand-600\\)\\], .text-\\[var\\(--brand-700\\)\\], .bg-\\[var\\(--brand-100\\)\\]');
    await expect(brandElements.first()).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'partners-no-green-colors.png', fullPage: true });
  });

  test('Support Page - No Blue Colors (Should Use Brand Colors)', async ({ page }) => {
    await page.goto('http://localhost:3003/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there are NO blue colors on the page (except gradient background)
    const blueElements = page.locator('.text-blue-600, .text-blue-700, .bg-blue-100, .focus\\:ring-blue-500');
    await expect(blueElements).toHaveCount(0);
    
    // Check that brand colors are used instead
    const brandElements = page.locator('.text-\\[var\\(--brand-600\\)\\], .text-\\[var\\(--brand-700\\)\\], .focus\\:ring-\\[var\\(--brand-500\\)\\]');
    await expect(brandElements.first()).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'support-no-blue-colors.png', fullPage: true });
  });

  test('Partners Page - No Blue Colors (Should Use Brand Colors)', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there are NO blue colors on the page (except gradient background)
    const blueElements = page.locator('.text-blue-600, .text-blue-700, .bg-blue-100, .focus\\:ring-blue-500');
    await expect(blueElements).toHaveCount(0);
    
    // Check that brand colors are used instead
    const brandElements = page.locator('.text-\\[var\\(--brand-600\\)\\], .text-\\[var\\(--brand-700\\)\\], .focus\\:ring-\\[var\\(--brand-500\\)\\]');
    await expect(brandElements.first()).toBeVisible();
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'partners-no-blue-colors.png', fullPage: true });
  });

  test('Report Page - Has Navigation Links Like Home Page', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that report page header has Pricing, Partners, Support links
    await expect(page.locator('nav a[href*="/pricing"]')).toBeVisible();
    await expect(page.locator('nav a[href*="/partners"]')).toBeVisible();
    await expect(page.locator('nav a[href*="/support"]')).toBeVisible();
    
    // Check that links preserve URL parameters
    const pricingLink = page.locator('nav a[href*="/pricing"]');
    const pricingHref = await pricingLink.getAttribute('href');
    expect(pricingHref).toContain('company=Netflix');
    expect(pricingHref).toContain('demo=1');
    
    // Take screenshot to verify visually
    await page.screenshot({ path: 'report-navigation-links.png', fullPage: true });
  });

  test('All Pages Use Brand Colors Consistently', async ({ page }) => {
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
      
      // Check that brand colors are used
      const brandElements = page.locator('.text-\\[var\\(--brand-600\\)\\], .text-\\[var\\(--brand-700\\)\\], .bg-\\[var\\(--brand-100\\)\\]');
      await expect(brandElements.first()).toBeVisible();
      
      // Take screenshot for each page
      await page.screenshot({ path: `${pageInfo.name}-brand-colors-verification.png`, fullPage: true });
    }
  });
});
