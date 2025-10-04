import { test, expect } from '@playwright/test';

test.describe('CSS Variables Debug', () => {
  test('Debug why CSS variables are not working', async ({ page }) => {
    console.log('Debugging CSS variables...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check all CSS variables
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
        brand600: computedStyle.getPropertyValue('--brand-600'),
        brand: computedStyle.getPropertyValue('--brand'),
        brand2: computedStyle.getPropertyValue('--brand-2'),
      };
    });
    
    console.log('CSS Variables:', cssVars);
    
    // Check the specific element and its computed styles
    const earningsText = page.locator('p').nth(4);
    const elementStyles = await earningsText.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        allProperties: Array.from(computed).filter(prop => prop.startsWith('--brand')).map(prop => ({
          property: prop,
          value: computed.getPropertyValue(prop)
        }))
      };
    });
    
    console.log('Element styles:', elementStyles);
    
    // Check if the span elements have the right styles
    const spanElement = earningsText.locator('span').first();
    const spanStyles = await spanElement.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        color: computed.color,
        className: el.className,
        allCSS: Array.from(computed).filter(prop => prop.includes('color')).map(prop => ({
          property: prop,
          value: computed.getPropertyValue(prop)
        }))
      };
    });
    
    console.log('Span styles:', spanStyles);
    
    console.log('✓ CSS debug complete');
  });
});