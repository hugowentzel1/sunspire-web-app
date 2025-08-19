import { test, expect } from '@playwright/test';

test.describe('Visual Layout Check', () => {
  test('Check TealEnergy layout matches the ideal design', async ({ page }) => {
    console.log('🔍 Checking TealEnergy visual layout...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the entire page
    await page.screenshot({ 
      path: 'test-results/tealenergy-current-layout.png',
      fullPage: true 
    });
    
    // Take a screenshot of just the header/navigation area
    const header = page.locator('header').first();
    if (await header.count() > 0) {
      await header.screenshot({ 
        path: 'test-results/tealenergy-header-layout.png'
      });
    }
    
    // Check if the logo is visible in the header
    const logo = page.locator('header img').first();
    const hasLogo = await logo.count() > 0;
    console.log('🔍 Header has logo:', hasLogo);
    
    // Check navigation spacing
    const navLinks = page.locator('nav a');
    const navCount = await navLinks.count();
    console.log('🔍 Navigation links count:', navCount);
    
    // Check "Built for" section
    const builtForSection = page.locator('h2').filter({ hasText: 'Built for' });
    const hasBuiltFor = await builtForSection.count() > 0;
    console.log('🔍 Has "Built for" section:', hasBuiltFor);
    
    console.log('✅ Screenshots saved for visual inspection');
  });

  test('Check Google layout for comparison', async ({ page }) => {
    console.log('🔍 Checking Google visual layout...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the entire page
    await page.screenshot({ 
      path: 'test-results/google-current-layout.png',
      fullPage: true 
    });
    
    // Take a screenshot of just the header/navigation area
    const header = page.locator('header').first();
    if (await header.count() > 0) {
      await header.screenshot({ 
        path: 'test-results/google-header-layout.png'
      });
    }
    
    console.log('✅ Screenshots saved for visual inspection');
  });
});
