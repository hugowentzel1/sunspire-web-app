import { test } from '@playwright/test';

test('Debug paid page rendering', async ({ page }) => {
  // Navigate to paid Microsoft page
  await page.goto('http://localhost:3000/?company=microsoft&demo=0');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take full screenshot
  await page.screenshot({ 
    path: 'test-results/paid-page-full.png',
    fullPage: true 
  });

  // Check what's actually in the page
  const html = await page.content();
  console.log('Page has live-bar:', html.includes('data-testid="live-bar"'));
  console.log('Page has "Live for":', html.includes('Live for'));
  console.log('Page has checkmark:', html.includes('✅'));

  // Check brand state
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    return stored ? JSON.parse(stored) : null;
  });
  console.log('Brand state:', brandState);

  // Check if the bar exists but is hidden
  const liveBarExists = await page.locator('[data-testid="live-bar"]').count();
  console.log('Live bar element count:', liveBarExists);

  // Try to find the div by class
  const emeraldDivs = await page.locator('.bg-emerald-50').count();
  console.log('Emerald background divs:', emeraldDivs);

  console.log('✓ Debug complete');
});

