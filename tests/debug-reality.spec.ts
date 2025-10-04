import { test, expect } from '@playwright/test';

test.describe('Debug Live Site Reality', () => {
  test('Check what is actually showing on the live site', async ({ page }) => {
    console.log('Debugging what is actually on the live site...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Get the actual HTML structure
    const earningsSection = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results = [];
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.textContent && el.textContent.includes('clients →')) {
          results.push({
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent,
            outerHTML: el.outerHTML,
            computedColor: getComputedStyle(el).color
          });
        }
      }
      return results;
    });
    
    console.log('Earnings section HTML:', earningsSection);
    
    // Take a screenshot to see what's actually there
    await page.screenshot({
      path: 'test-results/debug-reality-check.png',
      fullPage: true
    });
    
    console.log('✓ Reality check complete');
  });
});
