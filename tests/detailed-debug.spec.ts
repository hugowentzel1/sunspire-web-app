import { test, expect } from '@playwright/test';

test('Detailed debug of brand takeover', async ({ page }) => {
  // Listen to console logs
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
  });

  // Navigate to demo version with Apple company
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit more for any async operations
  await page.waitForTimeout(2000);
  
  // Check console logs for brand takeover
  const brandLogs = consoleLogs.filter(log => 
    log.includes('useBrandTakeover') || 
    log.includes('Apple') || 
    log.includes('enabled') ||
    log.includes('isDemo')
  );
  
  console.log('Brand takeover logs:', brandLogs);
  
  // Check if the brand state is correct
  const brandState = await page.evaluate(() => {
    // Try to get the brand state from localStorage
    const stored = localStorage.getItem('sunspire-brand-takeover');
    return stored ? JSON.parse(stored) : null;
  });
  
  console.log('Brand state from localStorage:', brandState);
  
  // Check if HeroBrand component exists in DOM
  const heroBrandExists = await page.locator('[data-hero-logo]').count();
  console.log('HeroBrand components found:', heroBrandExists);
  
  // Check if there's a sun icon
  const sunIconExists = await page.locator('text=☀️').count();
  console.log('Sun icons found:', sunIconExists);
  
  // Check the actual hero section content
  const heroSection = page.locator('main').first();
  const heroContent = await heroSection.innerHTML();
  console.log('Hero section content length:', heroContent.length);
  
  // Take a screenshot
  await page.screenshot({ path: 'detailed-debug.png', fullPage: true });
});
