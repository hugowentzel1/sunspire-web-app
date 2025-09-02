import { test, expect } from '@playwright/test';

test('Debug report page content to see what text is actually there', async ({ page }) => {
  console.log('🔍 Debugging report page content...');
  
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Get all text content on the page
  const pageText = await page.textContent('body');
  console.log('📄 Full page text:', pageText);
  
  // Check for specific text patterns
  const readyToDeployText = await page.locator('p:has-text("ready-to-deploy")').count();
  const readyToLaunchText = await page.locator('p:has-text("Ready to Launch")').count();
  const privateDemoText = await page.locator('text=Private demo for Tesla').count();
  
  console.log('🔍 Text counts:');
  console.log('  - ready-to-deploy text count:', readyToDeployText);
  console.log('  - Ready to Launch text count:', readyToLaunchText);
  console.log('  - Private demo for Tesla text count:', privateDemoText);
  
  // Get all paragraph elements
  const paragraphs = await page.locator('p').allTextContents();
  console.log('📝 All paragraph texts:', paragraphs);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-report-page-content.png', fullPage: true });
  
  console.log('✅ Debug complete! Check debug-report-page-content.png for visual verification');
});
