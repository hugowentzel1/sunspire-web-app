import { test, expect } from '@playwright/test';

test('Debug brand takeover console logs', async ({ page }) => {
  // Listen to console logs
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
  });

  // Navigate to main page with paid version
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&brandColor=%23FF0000&logo=https://logo.clearbit.com/apple.com');
  await page.waitForLoadState('networkidle');
  
  // Wait for brand takeover to load
  await page.waitForTimeout(5000);
  
  // Filter brand takeover logs
  const brandLogs = consoleLogs.filter(log => 
    log.includes('useBrandTakeover') || 
    log.includes('Apple') || 
    log.includes('logo') ||
    log.includes('brandColor') ||
    log.includes('URL enabled') ||
    log.includes('hasCompany') ||
    log.includes('isDemo')
  );
  
  console.log('Brand takeover logs:', brandLogs);
  
  // Check brand state from localStorage
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    return stored ? JSON.parse(stored) : null;
  });
  
  console.log('Final brand state:', brandState);
});


