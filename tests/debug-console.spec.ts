import { test, expect } from '@playwright/test';

test('debug console logs', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3005/report?demo=1&company=Apple');
  
  // Wait a bit for the page to load
  await page.waitForTimeout(3000);
  
  // Check console for our debug logs
  const logs: string[] = [];
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'log') {
      logs.push(msg.text());
      console.log('Console log:', msg.text());
    }
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('Console error:', msg.text());
    }
  });
  
  // Wait a bit more to capture logs
  await page.waitForTimeout(5000);
  
  // Check if we have our debug logs
  const hasMountLog = logs.some(log => log.includes('ReportContent component is mounting'));
  const hasUseEffectLog = logs.some(log => log.includes('useEffect is running'));
  const hasHooksLog = logs.some(log => log.includes('hooks initialized'));
  
  console.log('Has mount log:', hasMountLog);
  console.log('Has useEffect log:', hasUseEffectLog);
  console.log('Has hooks log:', hasHooksLog);
  console.log('Total logs:', logs.length);
  console.log('Total errors:', errors.length);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-console.png' });
  
  // Check if still loading
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  console.log('Still loading:', loadingText > 0);
});
