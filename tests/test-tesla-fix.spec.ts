import { test, expect } from '@playwright/test';

test.describe('Tesla Color Fix Test', () => {
  test('Verify Tesla red colors are working after fix', async ({ page }) => {
    console.log('🔧 Testing Tesla color fix...');
    
    // Navigate to Tesla demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for brand CSS to be injected
    await page.waitForTimeout(2000);
    
    // Navigate to partners page
    await page.click('text=Partners');
    await page.waitForLoadState('networkidle');
    
    // Check if the new CSS classes are working
    const pricingElements = await page.evaluate(() => {
      const elements = [
        '$30/mo',
        '$120', 
        '30 days',
        '$30/client',
        '$120/client'
      ];
      
      const results = {};
      elements.forEach(text => {
        const element = Array.from(document.querySelectorAll('*')).find(el => 
          el.textContent?.trim() === text
        );
        
        if (element) {
          const computedStyle = getComputedStyle(element);
          results[text] = {
            color: computedStyle.color,
            className: element.className,
            textContent: element.textContent?.trim()
          };
        } else {
          results[text] = 'NOT_FOUND';
        }
      });
      
      return results;
    });
    
    console.log('🎨 Pricing Elements After Fix:', pricingElements);
    
    // Check if any elements now show Tesla red
    const hasTeslaRed = Object.values(pricingElements).some((element: any) => 
      element !== 'NOT_FOUND' && element.color === 'rgb(204, 0, 0)'
    );
    
    console.log('✅ Has Tesla Red Colors:', hasTeslaRed);
    
    // Take screenshot
    await page.screenshot({ path: 'tesla-fix-test.png', fullPage: true });
    
    // Test support page
    await page.click('text=Support');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tesla-support-fix-test.png', fullPage: true });
    
    console.log('🔧 Tesla fix test complete!');
  });
});
