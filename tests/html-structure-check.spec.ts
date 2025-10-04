import { test, expect } from '@playwright/test';

test.describe('HTML Structure Check', () => {
  test('Check the actual HTML structure of the earnings section', async ({ page }) => {
    console.log('Checking HTML structure...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Get the HTML structure around the earnings text
    const earningsSection = page.locator('h3:has-text("Earnings (example)")');
    if (await earningsSection.count() > 0) {
      const parentHTML = await earningsSection.locator('..').evaluate((el) => el.outerHTML);
      console.log('Earnings section HTML:', parentHTML);
    }
    
    // Check if there are any other elements with similar text
    const allElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results = [];
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.textContent && el.textContent.includes('clients →')) {
          results.push({
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent.substring(0, 100),
            outerHTML: el.outerHTML.substring(0, 200)
          });
        }
      }
      return results;
    });
    
    console.log('Elements containing "clients →":', allElements);
    
    console.log('✓ HTML structure check complete');
  });
});
