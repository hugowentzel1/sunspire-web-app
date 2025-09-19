import { test, expect } from '@playwright/test';

test('Debug brand takeover on privacy page', async ({ page }) => {
  // Navigate to privacy page with paid version
  await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&brandColor=%23FF0000&logo=https://logo.clearbit.com/apple.com');
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
    log.includes('brandColor') ||
    log.includes('URL enabled')
  );
  
  console.log('Brand takeover logs:', brandLogs);
  
  // Check brand state from localStorage
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    return stored ? JSON.parse(stored) : null;
  });
  
  console.log('Brand state from localStorage:', brandState);
  
  // Check if the footer has the logo condition
  const footer = page.locator('footer');
  const footerHTML = await footer.innerHTML();
  console.log('Footer contains logo condition:', footerHTML.includes('!isDemo && b.logo'));
  console.log('Footer contains logo src:', footerHTML.includes('logo.clearbit.com'));
  
  // Check if there are any images on the page
  const images = await page.locator('img').all();
  console.log('Images found:', images.length);
  
  for (let i = 0; i < images.length; i++) {
    const src = await images[i].getAttribute('src');
    console.log(`Image ${i}: ${src}`);
  }
});


