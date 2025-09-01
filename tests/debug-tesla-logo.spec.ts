import { test, expect } from '@playwright/test';

test('Debug Tesla logo on report page', async ({ page }) => {
  console.log('🔍 Debugging Tesla logo on report page...');
  
  // Navigate to the Tesla demo report page
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if we're in demo mode
  const demoAttribute = await page.getAttribute('div[data-demo]', 'data-demo');
  console.log('📊 Demo mode attribute:', demoAttribute);
  
  // Check brand takeover state
  const brandTakeoverState = await page.evaluate(() => {
    // @ts-ignore
    return window.__brandTakeoverState || 'Not found';
  });
  console.log('🎨 Brand takeover state:', brandTakeoverState);
  
  // Check if logo elements exist
  const headerLogo = await page.locator('header img[alt*="logo"]').count();
  const heroLogo = await page.locator('main img[alt*="logo"]').count();
  
  console.log('🖼️ Header logo count:', headerLogo);
  console.log('🖼️ Hero logo count:', heroLogo);
  
  // Check what's actually showing in the header
  const headerContent = await page.locator('header .flex.items-center.space-x-4').first().innerHTML();
  console.log('📋 Header content:', headerContent);
  
  // Check what's actually showing in the hero
  const heroContent = await page.locator('main .w-24.h-24').first().innerHTML();
  console.log('📋 Hero content:', heroContent);
  
  // Check URL parameters
  const urlParams = await page.evaluate(() => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  });
  console.log('🔗 URL parameters:', urlParams);
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'debug-tesla-logo.png', fullPage: true });
  
  console.log('✅ Debug complete! Check debug-tesla-logo.png for visual verification');
});
