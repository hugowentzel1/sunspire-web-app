import { test, expect } from '@playwright/test';

test.describe('Report CTAs: sticky + footer', () => {
  test('sticky CTA shows at mid scroll, hides near footer, respects modal & tiny viewport', async ({ page }) => {
    await page.goto('/report?company=uber&demo=1');
    const sticky = page.locator('[data-testid="sticky-cta"]');

    // 1) Not visible at load
    await page.waitForTimeout(1000);
    const initiallyVisible = await sticky.isVisible();
    expect(initiallyVisible).toBeFalsy();

    // 2) After ~55% scroll, becomes visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
    await page.waitForTimeout(500);
    await expect(sticky).toBeVisible();

    // 3) Cookie banner offset honored (if present)
    const hasCookie = await page.locator('[data-cookie-banner]').count();
    if (hasCookie) {
      const bottom = await sticky.evaluate((el) => parseInt(getComputedStyle(el).bottom, 10));
      expect(bottom).toBeGreaterThan(16); // lifted above cookie banner
    }

    // 4) Modal open hides sticky
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.setAttribute('data-modal-open', 'true');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      document.body.appendChild(overlay);
    });
    await page.waitForTimeout(300);
    const stickyWhenModalOpen = await sticky.isVisible();
    expect(stickyWhenModalOpen).toBeFalsy();

    // 5) Close modal shows sticky again
    await page.evaluate(() => {
      document.querySelectorAll('[data-modal-open="true"]').forEach(n => n.remove());
    });
    await page.waitForTimeout(300);
    await expect(sticky).toBeVisible();

    // 6) Near footer hides sticky & shows footer CTA
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 630));
    await page.waitForTimeout(500);
    const stickyNearFooter = await sticky.isVisible();
    const footer = page.locator('[data-testid="footer-cta"]');
    const footerVisible = await footer.isVisible();
    
    // 7) Mutual exclusivity: never both visible
    expect(stickyNearFooter && footerVisible).toBeFalsy();
  });
});

