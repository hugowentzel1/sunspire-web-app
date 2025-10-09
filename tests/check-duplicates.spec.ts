import { test, expect } from '@playwright/test';

test('check for duplicate content on paid report page', async ({ page }) => {
  await page.goto('http://localhost:3001/report?company=Apple&brandColor=%23FF0000&demo=0&address=465%20Page%20Pl%2C%20Roswell%2C%20GA&lat=34.0234&lng=-84.3617&placeId=test');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/duplicate-check.png', fullPage: true });
  
  // Count "Download" buttons/links
  const downloadCount = await page.locator('text=/Download.*PDF/i').count();
  console.log('❌ Download PDF buttons:', downloadCount);
  
  // Count "Copy Share Link" buttons
  const shareCount = await page.locator('text=/Copy.*Share.*Link|Share.*Link/i').count();
  console.log('❌ Copy Share Link buttons:', shareCount);
  
  // Count "Data sources" mentions
  const dataSourcesCount = await page.locator('text=/Data sources:/i').count();
  console.log('❌ "Data sources:" mentions:', dataSourcesCount);
  
  // Count "PVWatts" mentions
  const pvwattsCount = await page.locator('text=/PVWatts/i').count();
  console.log('❌ PVWatts mentions:', pvwattsCount);
  
  // Count "Mapping.*Google" mentions
  const googleCount = await page.locator('text=/Mapping.*Google|Map.*data.*Google/i').count();
  console.log('❌ Google attribution mentions:', googleCount);
  
  // Count "Book a Consultation" buttons
  const bookCount = await page.locator('text=/Book a Consultation/i').count();
  console.log('❌ "Book a Consultation" buttons:', bookCount);
  
  console.log('\n✅ Duplicates check complete. Review counts above.');
});
