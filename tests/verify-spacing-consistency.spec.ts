import { test, expect } from '@playwright/test';

test.describe('Verify Navigation Spacing Consistency', () => {
  test('Check that Netflix now matches TealEnergy spacing', async ({ page }) => {
    console.log('🔍 Checking Netflix navigation spacing...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/netflix-header-spacing.png'
    });
    
    console.log('✅ Netflix header screenshot saved');
  });

  test('Check that Google matches TealEnergy spacing', async ({ page }) => {
    console.log('🔍 Checking Google navigation spacing...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/google-header-spacing.png'
    });
    
    console.log('✅ Google header screenshot saved');
  });

  test('Reference TealEnergy spacing', async ({ page }) => {
    console.log('🔍 Getting TealEnergy reference spacing...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/tealenergy-header-spacing.png'
    });
    
    console.log('✅ TealEnergy reference screenshot saved');
  });
});
