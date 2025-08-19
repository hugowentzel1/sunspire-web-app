import { test, expect } from '@playwright/test';

test.describe('Verify Deployed Site', () => {
  test('Actually look at TealEnergy to see if logo and layout are correct', async ({ page }) => {
    console.log('🔍 Actually checking deployed TealEnergy site...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of the actual deployed site
    await page.screenshot({ 
      path: 'test-results/deployed-tealenergy-full.png',
      fullPage: true 
    });
    
    // Take screenshot of just the header to compare with your ideal
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/deployed-tealenergy-header.png'
    });
    
    // Check what's actually in the header
    const headerContent = await page.evaluate(() => {
      const header = document.querySelector('header');
      const img = header?.querySelector('img');
      const h1 = header?.querySelector('h1');
      const navLinks = header?.querySelectorAll('nav a');
      const button = header?.querySelector('button');
      
      return {
        hasLogo: !!img,
        logoSrc: img?.src || null,
        companyName: h1?.textContent || null,
        navLinksCount: navLinks?.length || 0,
        buttonText: button?.textContent || null,
        headerHTML: header?.innerHTML.substring(0, 500) || null
      };
    });
    
    console.log('🔍 Actual Header Content:', headerContent);
    
    // Check the Built for section
    const builtForSection = await page.evaluate(() => {
      const builtFor = document.querySelector('h2');
      return {
        text: builtFor?.textContent || null,
        hasSection: !!builtFor
      };
    });
    
    console.log('🔍 Built For Section:', builtForSection);
    
    console.log('✅ Screenshots saved for manual inspection');
  });

  test('Check Google to verify logos work for multiple companies', async ({ page }) => {
    console.log('🔍 Checking deployed Google site...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/deployed-google-full.png',
      fullPage: true 
    });
    
    // Check header content
    const headerContent = await page.evaluate(() => {
      const header = document.querySelector('header');
      const img = header?.querySelector('img');
      const h1 = header?.querySelector('h1');
      
      return {
        hasLogo: !!img,
        logoSrc: img?.src || null,
        companyName: h1?.textContent || null
      };
    });
    
    console.log('🔍 Google Header Content:', headerContent);
    
    console.log('✅ Screenshots saved');
  });
});
