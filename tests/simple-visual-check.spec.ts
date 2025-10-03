import { test, expect } from '@playwright/test';

test.describe('Simple Visual Verification', () => {
  test('Take Screenshots of All Pages', async ({ page }) => {
    const pages = [
      { url: '/pricing?company=Netflix&demo=1', name: 'pricing' },
      { url: '/partners?company=Netflix&demo=1', name: 'partners' },
      { url: '/support?company=Netflix&demo=1', name: 'support' },
      { url: '/report?company=Netflix&demo=1', name: 'report' }
    ];

    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3000${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for visual verification
      await page.screenshot({ path: `${pageInfo.name}-final-check.png`, fullPage: true });
      
      console.log(`Screenshot taken for ${pageInfo.name}`);
    }
  });
});
