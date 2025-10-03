import { test, expect } from '@playwright/test';

test.describe('Visual Verification of All Changes', () => {
  test('Take Screenshots of All Pages to Verify Changes', async ({ page }) => {
    const pages = [
      { url: '/support?company=Netflix&brandColor=E50914&demo=1', name: 'support' },
      { url: '/partners?company=Netflix&brandColor=E50914&demo=1', name: 'partners' },
      { url: '/pricing?company=Netflix&brandColor=E50914&demo=1', name: 'pricing' },
      { url: '/report?company=Netflix&brandColor=E50914&demo=1', name: 'report' }
    ];

    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3000${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Wait a bit for any animations or dynamic content
      await page.waitForTimeout(2000);
      
      // Take screenshot for visual verification
      await page.screenshot({ path: `${pageInfo.name}-final-visual-check.png`, fullPage: true });
      
      console.log(`Screenshot taken for ${pageInfo.name} page`);
    }
  });
});
