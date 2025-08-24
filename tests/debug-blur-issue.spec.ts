import { test, expect } from '@playwright/test';

test('debug blur issue and loading state', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(5000);
  
  // Check console for errors
  const errors: string[] = [];
  const logs: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('Console error:', msg.text());
    }
    if (msg.type() === 'log') {
      logs.push(msg.text());
      console.log('Console log:', msg.text());
    }
  });
  
  // Wait a bit more to capture logs
  await page.waitForTimeout(5000);
  
  // Check if we have any content
  const content = await page.locator('body').innerHTML();
  console.log('Page content length:', content.length);
  
  // Check if still loading
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  console.log('Still loading:', loadingText > 0);
  
  // Check for any JavaScript errors
  console.log('Total console errors:', errors.length);
  errors.forEach((error, index) => {
    console.log(`Error ${index + 1}:`, error);
  });
  
  // Look for specific elements that should exist
  const hasSolarContent = content.includes('Solar Intelligence') || content.includes('System Size') || content.includes('Annual Production');
  console.log('Has solar content:', hasSolarContent);
  
  // Check if blur classes are present
  const hasBlurClasses = content.includes('backdrop-blur-sm') || content.includes('bg-white/60');
  console.log('Has blur classes:', hasBlurClasses);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-blur-issue.png' });
});
