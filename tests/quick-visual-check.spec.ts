import { test, expect } from '@playwright/test';

test.describe('Quick Visual Check', () => {
  test('Check all pages visually', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Home' },
      { url: '/pricing', name: 'Pricing' },
      { url: '/partners', name: 'Partners' },
      { url: '/support', name: 'Support' },
      { url: '/report?company=Netflix&demo=1', name: 'Report' }
    ];

    for (const pageInfo of pages) {
      console.log(`Checking ${pageInfo.name} page...`);
      await page.goto(`http://localhost:3001${pageInfo.url}`);
      await page.waitForLoadState('domcontentloaded');
      
      // Take a screenshot
      await page.screenshot({ 
        path: `test-results/${pageInfo.name.toLowerCase()}-check.png`,
        fullPage: true 
      });
      
      console.log(`✓ ${pageInfo.name} page loaded successfully`);
    }
  });
});
