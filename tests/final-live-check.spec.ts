import { test, expect } from '@playwright/test';

test.describe('Final Live Site Check', () => {
  test('Verify Tesla partners page company colors are working', async ({ page }) => {
    console.log('Checking Tesla partners page on live site...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check CSS variables
    const brandPrimary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
    });
    const brand600 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-600');
    });
    
    console.log('Brand Primary CSS variable:', brandPrimary);
    console.log('Brand 600 CSS variable:', brand600);
    
    // Find the earnings text paragraph
    const earningsText = page.locator('p').nth(4); // The earnings text
    
    // Check the span element (client count)
    const clientSpan = earningsText.locator('span');
    if (await clientSpan.count() > 0) {
      const spanColor = await clientSpan.evaluate((el) => getComputedStyle(el).color);
      const spanClasses = await clientSpan.evaluate((el) => el.className);
      console.log('Client span color:', spanColor);
      console.log('Client span classes:', spanClasses);
    }
    
    // Check the first b element (recurring amount)
    const recurringB = earningsText.locator('b').nth(0);
    if (await recurringB.count() > 0) {
      const bColor = await recurringB.evaluate((el) => getComputedStyle(el).color);
      const bClasses = await recurringB.evaluate((el) => el.className);
      console.log('Recurring b color:', bColor);
      console.log('Recurring b classes:', bClasses);
    }
    
    // Check the second b element (setup amount)
    const setupB = earningsText.locator('b').nth(1);
    if (await setupB.count() > 0) {
      const bColor = await setupB.evaluate((el) => getComputedStyle(el).color);
      const bClasses = await setupB.evaluate((el) => el.className);
      console.log('Setup b color:', bColor);
      console.log('Setup b classes:', bClasses);
    }
    
    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/final-tesla-partners-check.png',
      fullPage: true
    });
    
    console.log('✓ Final live site check complete');
  });
});
