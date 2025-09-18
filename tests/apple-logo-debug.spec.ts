import { test, expect } from '@playwright/test';

test('Debug Apple logo in demo version', async ({ page }) => {
  // Navigate to demo version with Apple company
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot to see what's actually showing
  await page.screenshot({ path: 'apple-logo-debug.png', fullPage: true });
  
  // Check if there's any logo image anywhere on the page
  const logoImages = await page.locator('img').all();
  console.log('Found images:', logoImages.length);
  
  for (let i = 0; i < logoImages.length; i++) {
    const src = await logoImages[i].getAttribute('src');
    console.log(`Image ${i}: ${src}`);
  }
  
  // Check if HeroBrand component is rendered
  const heroBrand = page.locator('[data-hero-logo]');
  const heroBrandVisible = await heroBrand.isVisible();
  console.log('HeroBrand component visible:', heroBrandVisible);
  
  // Check if there's a sun icon instead
  const sunIcon = page.locator('text=☀️');
  const sunIconVisible = await sunIcon.isVisible();
  console.log('Sun icon visible:', sunIconVisible);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    return (window as any).__CONTENT_SHOWN__;
  });
  console.log('Content shown flag:', brandState);
  
  // Check if there are any console logs about brand takeover
  page.on('console', msg => {
    if (msg.text().includes('useBrandTakeover') || msg.text().includes('Apple')) {
      console.log('Console:', msg.text());
    }
  });
});
