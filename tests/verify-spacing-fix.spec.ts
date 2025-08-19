import { test, expect } from '@playwright/test';

test.describe('Verify Spacing Fix is Working', () => {
  test('Check TealEnergy spacing to see if vertical spacing fix is applied', async ({ page }) => {
    console.log('🔍 Checking TealEnergy spacing fix...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of the entire header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/tealenergy-spacing-check.png'
    });
    
    // Check the actual CSS classes and spacing
    const headerSpacing = await page.evaluate(() => {
      const header = document.querySelector('header');
      const textContainer = header?.querySelector('div:has(h1)');
      const nav = header?.querySelector('nav');
      
      return {
        headerHeight: header?.offsetHeight,
        textContainerClasses: textContainer?.className,
        navClasses: nav?.className,
        textContainerPadding: getComputedStyle(textContainer as Element).padding,
        navSpacing: getComputedStyle(nav as Element).gap || 'not set'
      };
    });
    
    console.log('🔍 Header Spacing Details:', headerSpacing);
    
    console.log('✅ TealEnergy header screenshot saved');
  });

  test('Check Netflix spacing to compare', async ({ page }) => {
    console.log('🔍 Checking Netflix spacing for comparison...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of the header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/netflix-spacing-check.png'
    });
    
    // Check spacing details
    const headerSpacing = await page.evaluate(() => {
      const header = document.querySelector('header');
      const textContainer = header?.querySelector('div:has(h1)');
      const nav = header?.querySelector('nav');
      
      return {
        headerHeight: header?.offsetHeight,
        textContainerClasses: textContainer?.className,
        navClasses: nav?.className,
        textContainerPadding: getComputedStyle(textContainer as Element).padding,
        navSpacing: getComputedStyle(nav as Element).gap || 'not set'
      };
    });
    
    console.log('🔍 Netflix Header Spacing Details:', headerSpacing);
    
    console.log('✅ Netflix header screenshot saved');
  });

  test('Check Google spacing to verify all companies have same spacing', async ({ page }) => {
    console.log('🔍 Checking Google spacing...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of the header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/google-spacing-check.png'
    });
    
    console.log('✅ Google header screenshot saved');
  });
});
