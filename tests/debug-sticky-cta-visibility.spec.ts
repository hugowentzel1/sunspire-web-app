import { test, expect } from '@playwright/test';

test('Debug StickyCTA visibility', async ({ page }) => {
  // Go to the report page with Tesla demo
  await page.goto('http://localhost:3000/report?company=tesla&demo=1');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for any animations
  await page.waitForTimeout(3000);
  
  // Take a full page screenshot to see what's happening
  await page.screenshot({ 
    path: 'debug-sticky-cta-visibility.png',
    fullPage: true
  });
  
  // Check if any StickyCTA elements exist
  const stickyElements = page.locator('[data-testid*="sticky"]');
  const count = await stickyElements.count();
  console.log('Sticky elements found:', count);
  
  // Check if demo mode is detected
  const demoMode = await page.evaluate(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get('demo') === '1';
  });
  console.log('Demo mode detected:', demoMode);
  
  // Check if the StickyCTA component is rendered
  const stickyCTA = page.locator('[data-testid="sticky-cta"]');
  const isVisible = await stickyCTA.isVisible();
  console.log('StickyCTA visible:', isVisible);
  
  // Check the page content for any errors
  const bodyText = await page.textContent('body');
  console.log('Page contains "StickyCTA":', bodyText?.includes('StickyCTA'));
  
  // Check console for any errors
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      logs.push(msg.text());
    }
  });
  
  await page.waitForTimeout(1000);
  console.log('Console errors:', logs);
  
  // Try to find any CTA elements
  const ctaElements = page.locator('a').filter({ hasText: /Activate|Domain|24 Hours/i });
  const ctaCount = await ctaElements.count();
  console.log('CTA elements found:', ctaCount);
  
  if (ctaCount > 0) {
    const firstCTA = ctaElements.first();
    const ctaText = await firstCTA.textContent();
    console.log('First CTA text:', ctaText);
  }
});
