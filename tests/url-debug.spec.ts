import { test, expect } from '@playwright/test';

test('Debug URL parameters', async ({ page }) => {
  // Navigate to privacy page with paid version
  await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&brandColor=#FF0000&logo=https://logo.clearbit.com/apple.com');
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for brand state to load
  await page.waitForTimeout(3000);
  
  // Check console logs for brand takeover
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
  });
  
  // Wait for logs to accumulate
  await page.waitForTimeout(2000);
  
  // Filter brand takeover logs
  const brandLogs = consoleLogs.filter(log => 
    log.includes('useBrandTakeover') || 
    log.includes('Apple') || 
    log.includes('logo') ||
    log.includes('brandColor')
  );
  
  console.log('Brand takeover logs:', brandLogs);
  
  // Check current URL
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);
  
  // Check if the logo parameter is in the URL
  const url = new URL(currentUrl);
  console.log('URL search params:');
  for (const [key, value] of url.searchParams.entries()) {
    console.log(`  ${key}: ${value}`);
  }
});


