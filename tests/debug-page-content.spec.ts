import { test, expect } from '@playwright/test';

test('Debug Page Content', async ({ page }) => {
  console.log('🔍 Debugging page content...');
  
  // Navigate to Tesla report page
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check page title
  const title = await page.title();
  console.log('📄 Page title:', title);
  
  // Check if we're on the right page
  const currentUrl = page.url();
  console.log('🔗 Current URL:', currentUrl);
  
  // Check for any buttons on the page
  const allButtons = await page.locator('button').count();
  console.log('🔘 Total buttons found:', allButtons);
  
  // Check for any text content
  const bodyText = await page.textContent('body');
  console.log('📝 Page contains "Activate":', bodyText?.includes('Activate'));
  console.log('📝 Page contains "Tesla":', bodyText?.includes('Tesla'));
  console.log('📝 Page contains "locked":', bodyText?.includes('locked'));
  console.log('📝 Page contains "quota":', bodyText?.includes('quota'));
  
  // Check for any data-cta attributes
  const ctaElements = await page.locator('[data-cta]').count();
  console.log('🔘 Elements with data-cta attribute:', ctaElements);
  
  // Check for any images
  const images = await page.locator('img').count();
  console.log('🖼️ Images found:', images);
  
  // Check for any divs with specific classes
  const reportDivs = await page.locator('div[data-demo="true"]').count();
  console.log('📊 Report divs found:', reportDivs);
  
  // Check for lock overlay
  const lockOverlay = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  console.log('🔒 Lock overlay count:', lockOverlay);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-page-content.png' });
  console.log('📸 Screenshot saved as debug-page-content.png');
  
  // Check console logs
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console error:', msg.text());
    }
  });
});
