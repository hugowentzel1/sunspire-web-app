import { test, expect } from '@playwright/test';

test('inspect report page for duplicates', async ({ page }) => {
  await page.goto('http://localhost:3001/report?company=Apple&brandColor=%23FF0000&demo=0&address=465%20Page%20Pl%2C%20Roswell%2C%20GA&lat=34.0234&lng=-84.3617&placeId=test', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  
  // Wait a bit for content to load
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/report-page-full.png', fullPage: true });
  
  // Get all text content
  const bodyText = await page.locator('body').innerText();
  
  // Count specific phrases
  const phrases = [
    'Download PDF',
    'Copy Share Link',
    'Data sources:',
    'PVWatts',
    'Google',
    'Book a Consultation',
    'Talk to a Specialist',
    'Mapping & location',
    'registered trademark'
  ];
  
  console.log('\n📊 DUPLICATE CHECK RESULTS:');
  console.log('═'.repeat(50));
  
  for (const phrase of phrases) {
    const regex = new RegExp(phrase, 'gi');
    const matches = bodyText.match(regex) || [];
    const count = matches.length;
    const status = count > 1 ? '⚠️' : '✅';
    console.log(`${status} "${phrase}": ${count} occurrences`);
  }
  
  console.log('═'.repeat(50));
  
  // Check for specific duplicate sections
  const downloadPDFCount = await page.locator('text=/Download.*PDF/i').count();
  const copyLinkCount = await page.locator('text=/Copy.*Share.*Link/i').count();
  const dataSourcesCount = await page.locator('text=/Data sources:/i').count();
  
  console.log('\n🔍 ELEMENT-SPECIFIC COUNTS:');
  console.log(`Download PDF buttons/links: ${downloadPDFCount}`);
  console.log(`Copy Share Link buttons: ${copyLinkCount}`);
  console.log(`"Data sources:" headings: ${dataSourcesCount}`);
});
