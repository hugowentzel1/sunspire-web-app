import { test, expect } from '@playwright/test';

test('Debug Logo Issue - Check Why Company Logo Not Showing', async ({ page }) => {
  console.log('🔍 Debugging logo display issue on report page...');
  
  // Test with a company that should have a logo
  await page.goto('http://localhost:3001/report?company=Apple&demo=1&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-logo-issue.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-logo-issue.png');
  
  // Check header logo
  const headerLogos = page.locator('header img');
  const headerLogoCount = await headerLogos.count();
  console.log(`🔍 Found ${headerLogoCount} images in header`);
  
  for (let i = 0; i < headerLogoCount; i++) {
    const src = await headerLogos.nth(i).getAttribute('src');
    const alt = await headerLogos.nth(i).getAttribute('alt');
    console.log(`Header image ${i}: src="${src}", alt="${alt}"`);
  }
  
  // Check for sun emoji in header
  const headerSunEmojis = page.locator('header span:has-text("☀️")');
  const headerSunCount = await headerSunEmojis.count();
  console.log(`🔍 Found ${headerSunCount} sun emojis in header`);
  
  // Check hero section logo
  const heroLogos = page.locator('main img');
  const heroLogoCount = await heroLogos.count();
  console.log(`🔍 Found ${heroLogoCount} images in main/hero section`);
  
  for (let i = 0; i < heroLogoCount; i++) {
    const src = await heroLogos.nth(i).getAttribute('src');
    const alt = await heroLogos.nth(i).getAttribute('alt');
    console.log(`Hero image ${i}: src="${src}", alt="${alt}"`);
  }
  
  // Check for sun emoji in hero section
  const heroSunEmojis = page.locator('main span:has-text("☀️")');
  const heroSunCount = await heroSunEmojis.count();
  console.log(`🔍 Found ${heroSunCount} sun emojis in hero section`);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    return {
      localStorage: localStorage.getItem('sunspire-brand-takeover'),
      urlParams: new URLSearchParams(window.location.search).toString()
    };
  });
  console.log('🔍 Brand state:', brandState);
  
  // Check if demo mode is active
  const demoIndicator = page.locator('[data-demo="true"]');
  const isDemo = await demoIndicator.count();
  console.log(`🔍 Demo mode active: ${isDemo > 0}`);
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(10000);
});
