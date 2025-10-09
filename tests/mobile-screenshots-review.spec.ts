import { test, expect } from '@playwright/test';

test.describe('Mobile Site Screenshots for Review', () => {
  test('Take Mobile Screenshots of All Pages', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // Demo Homepage
    await page.goto('http://localhost:3002/?demo=1&company=Netflix&brandColor=%23E50914');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/mobile-demo-homepage.png', fullPage: true });
    console.log('✓ Mobile demo homepage screenshot saved');
    
    // Paid Homepage
    await page.goto('http://localhost:3002/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/mobile-paid-homepage.png', fullPage: true });
    console.log('✓ Mobile paid homepage screenshot saved');
    
    // Legal Pages
    const legalPages = [
      { url: 'http://localhost:3002/legal/privacy?demo=1', name: 'privacy' },
      { url: 'http://localhost:3002/legal/terms?demo=1', name: 'terms' },
      { url: 'http://localhost:3002/legal/accessibility?demo=1', name: 'accessibility' },
      { url: 'http://localhost:3002/legal/cookies?demo=1', name: 'cookies' },
      { url: 'http://localhost:3002/contact?demo=1', name: 'contact' }
    ];
    
    for (const pageInfo of legalPages) {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `test-results/mobile-${pageInfo.name}.png`, fullPage: true });
      console.log(`✓ Mobile ${pageInfo.name} page screenshot saved`);
    }
    
    await context.close();
    console.log('📱 All mobile screenshots saved to test-results/ folder');
  });
});
