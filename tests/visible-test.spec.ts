import { test, expect } from '@playwright/test';

test('Visible Footer Check', async ({ page }) => {
  console.log('🚀 Opening browser to show you the footer...');
  
  // Go to the demo page
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForTimeout(3000);
  
  console.log('📋 Taking full page screenshot...');
  await page.screenshot({ path: 'full-page-visible.png', fullPage: true });
  
  // Scroll to footer
  console.log('📋 Scrolling to footer...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  console.log('📋 Taking footer screenshot...');
  await page.screenshot({ path: 'footer-visible.png', fullPage: true });
  
  // Check footer elements
  const companyName = await page.locator('text=Sunspire Solar Intelligence').isVisible();
  console.log('✅ Company name visible:', companyName);
  
  const demoTag = await page.locator('text=Demo for Apple — Powered by Sunspire').isVisible();
  console.log('✅ Demo tag visible:', demoTag);
  
  const address = await page.locator('text=1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318').isVisible();
  console.log('✅ Address visible:', address);
  
  const gdprBadge = await page.locator('text=GDPR').isVisible();
  console.log('✅ GDPR badge visible:', gdprBadge);
  
  const nrelText = await page.locator('text=Estimates generated using NREL PVWatts® v8').isVisible();
  console.log('✅ NREL text visible:', nrelText);
  
  const poweredBy = await page.locator('text=Powered by Sunspire').isVisible();
  console.log('✅ Powered by text visible:', poweredBy);
  
  console.log('🎉 Footer check complete! Check the screenshots.');
});
