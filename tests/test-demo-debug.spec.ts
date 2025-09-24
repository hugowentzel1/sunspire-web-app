import { test, expect } from '@playwright/test';

test('Debug demo link locally', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  console.log('Testing demo link: http://localhost:3000/paid?company=Apple&demo=1');
  
  await page.goto('http://localhost:3000/paid?company=Apple&demo=1', { 
    waitUntil: 'networkidle0',
    timeout: 10000 
  });
  
  // Wait a bit for React to hydrate
  await page.waitForTimeout(2000);
  
  // Check if we can find Apple branding
  const title = await page.title();
  console.log('Page title:', title);
  
  // Look for Apple-specific content
  const appleContent = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasApple: body.includes('Apple'),
      hasDemo: body.includes('demo'),
      hasInstantSolar: body.includes('Instant Solar Analysis'),
      hasBrandTakeover: body.includes('brand takeover'),
      searchParams: window.location.search
    };
  });
  
  console.log('Content analysis:', appleContent);
  
  // Take a screenshot
  await page.screenshot({ path: 'demo-debug.png', fullPage: true });
  console.log('Screenshot saved as demo-debug.png');
  
  // Check if the page shows Apple branding
  expect(appleContent.hasApple).toBe(true);
});
