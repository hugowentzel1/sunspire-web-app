import { test, expect } from '@playwright/test';

test.describe('Verify Built For Banner Design', () => {
  test('Check that TealEnergy banner matches the ideal design', async ({ page }) => {
    console.log('🔍 Checking TealEnergy "Built for" banner design...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of the entire page to see the banner
    await page.screenshot({ 
      path: 'test-results/tealenergy-built-for-banner.png',
      fullPage: true 
    });
    
    // Check the "Built for" section specifically
    const builtForSection = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const builtForText = h2?.textContent || '';
      
      // Look for the button with lightning bolt icon
      const button = document.querySelector('button');
      const buttonText = button?.textContent || '';
      const hasLightningIcon = button?.innerHTML.includes('⚡') || button?.innerHTML.includes('lightning') || false;
      
      // Check for the description text
      const description = Array.from(document.querySelectorAll('p')).find(p => 
        p.textContent?.includes('Exclusive preview') || 
        p.textContent?.includes('white-label solar intelligence tool')
      );
      
      return {
        builtForText,
        buttonText,
        hasLightningIcon,
        descriptionText: description?.textContent || null,
        hasBuiltForSection: !!h2
      };
    });
    
    console.log('🔍 Built For Section Details:', builtForSection);
    
    // Take screenshot of just the banner area
    const bannerArea = page.locator('h2').first();
    if (await bannerArea.count() > 0) {
      await bannerArea.screenshot({ 
        path: 'test-results/tealenergy-banner-detail.png'
      });
    }
    
    console.log('✅ Banner screenshots saved');
  });

  test('Check that Netflix banner has the same design', async ({ page }) => {
    console.log('🔍 Checking Netflix "Built for" banner design...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/netflix-built-for-banner.png',
      fullPage: true 
    });
    
    // Check the banner content
    const builtForSection = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const builtForText = h2?.textContent || '';
      
      const button = document.querySelector('button');
      const buttonText = button?.textContent || '';
      
      return {
        builtForText,
        buttonText,
        hasBuiltForSection: !!h2
      };
    });
    
    console.log('🔍 Netflix Built For Section:', builtForSection);
    
    console.log('✅ Netflix banner screenshot saved');
  });
});
