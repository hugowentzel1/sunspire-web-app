import { test, expect } from '@playwright/test';

test('debug report page final', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3005/report?demo=1&company=Apple');
  
  // Wait a bit for the page to load
  await page.waitForTimeout(5000);
  
  // Check if we're still in loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  console.log(`Loading text count: ${loadingText}`);
  
  // Check for any error messages
  const errorText = await page.locator('text=Error').count();
  console.log(`Error text count: ${errorText}`);
  
  // Check console for errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('Console error:', msg.text());
    }
    if (msg.type() === 'log') {
      console.log('Console log:', msg.text());
    }
  });
  
  // Wait a bit more and check again
  await page.waitForTimeout(5000);
  
  // Check if we're still in loading state
  const stillLoading = await page.locator('text=Generating your solar intelligence report').count();
  console.log(`Still loading after 10s: ${stillLoading}`);
  
  // If still loading, take a screenshot
  if (stillLoading > 0) {
    await page.screenshot({ path: 'debug-report-final-loading.png' });
    console.log('Screenshot saved as debug-report-final-loading.png');
  }
  
  // Check for any content that should be there
  const content = await page.locator('body').innerHTML();
  console.log('Page content length:', content.length);
  
  // Look for specific elements that should exist
  const hasSolarContent = content.includes('Solar Intelligence') || content.includes('System Size') || content.includes('Annual Production');
  console.log('Has solar content:', hasSolarContent);
  
  // Check if the useEffect console.log appears
  const hasUseEffectLog = content.includes('useEffect running') || content.includes('Setting estimate');
  console.log('Has useEffect logs:', hasUseEffectLog);
});
