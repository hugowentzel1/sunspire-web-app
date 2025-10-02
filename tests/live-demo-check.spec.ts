import { test, expect } from '@playwright/test';

test.describe('Live Demo Site Check', () => {
  test('Capture live support page with Netflix demo', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-support-netflix-demo.png',
      fullPage: true 
    });
    
    console.log('✅ Live support page screenshot saved as live-support-netflix-demo.png');
  });

  test('Capture live pricing page with Netflix demo', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-pricing-netflix-demo.png',
      fullPage: true 
    });
    
    console.log('✅ Live pricing page screenshot saved as live-pricing-netflix-demo.png');
  });

  test('Capture live partners page with Netflix demo', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-partners-netflix-demo.png',
      fullPage: true 
    });
    
    console.log('✅ Live partners page screenshot saved as live-partners-netflix-demo.png');
  });
});
