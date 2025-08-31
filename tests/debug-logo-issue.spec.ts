import { test, expect } from '@playwright/test';

test('Debug logo display issue', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => console.log('Browser console:', msg.text()));
  page.on('pageerror', error => console.log('Page error:', error.message));
  
  await page.goto('http://127.0.0.1:3000/report?company=meta&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit more for any async operations
  await page.waitForTimeout(2000);
  
  // Take a screenshot to see what's actually there
  await page.screenshot({ path: 'debug-logo-issue.png', fullPage: true });
  
  // Log the page content to see what's happening
  const pageContent = await page.content();
  console.log('Page HTML:', pageContent.substring(0, 2000));
  
  // Check if we're still loading
  const loadingText = await page.locator('text=Generating your solar intelligence report...').count();
  console.log('Loading text found:', loadingText);
  
  // Check what elements are actually present
  const allImages = await page.locator('img').all();
  console.log(`Found ${allImages.length} images on the page`);
  
  for (let i = 0; i < allImages.length; i++) {
    const src = await allImages[i].getAttribute('src');
    const alt = await allImages[i].getAttribute('url');
    console.log(`Image ${i}: src="${src}", alt="${alt}"`);
  }
  
  // Check if the company name is showing
  const h1Elements = await page.locator('h1').all();
  console.log(`Found ${h1Elements.length} h1 elements`);
  
  for (let i = 0; i < h1Elements.length; i++) {
    const text = await h1Elements[i].textContent();
    console.log(`H1 ${i}: "${text}"`);
  }
  
  // Check if demo mode is active
  const demoModeIndicator = await page.locator('[data-demo="true"]').count();
  console.log('Demo mode indicator found:', demoModeIndicator);
  
  // Check the brand takeover state
  const brandTakeover = await page.evaluate(() => {
    // @ts-ignore
    return window.__BRAND_TAKEOVER__ || 'Not found';
  });
  console.log('Brand takeover state:', brandTakeover);
});
