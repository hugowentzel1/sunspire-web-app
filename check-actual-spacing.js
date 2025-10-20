const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/?company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Enter address
  const addressInput = page.locator('input[placeholder*="Start typing"]').first();
  await addressInput.fill('123 Main St, Phoenix, AZ');
  await page.waitForTimeout(1500);
  
  const firstSuggestion = page.locator('[data-autosuggest]').first();
  await firstSuggestion.click();
  await page.waitForURL(/\/report\?/);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Measure actual spacing
  const spacing = await page.evaluate(() => {
    const meta = document.querySelector('[data-testid="hdr-meta"]');
    const cards = document.querySelector('[data-testid="tile-systemSize"]');
    
    if (!meta || !cards) {
      return { error: 'Elements not found' };
    }
    
    const metaRect = meta.getBoundingClientRect();
    const cardsRect = cards.getBoundingClientRect();
    
    const gap = cardsRect.top - metaRect.bottom;
    
    return {
      metaBottom: metaRect.bottom,
      cardsTop: cardsRect.top,
      gap: Math.round(gap),
      metaMarginTop: window.getComputedStyle(meta).marginTop,
      cardsMarginTop: window.getComputedStyle(cards.parentElement).marginTop
    };
  });
  
  console.log('📊 ACTUAL SPACING MEASUREMENT:');
  console.log(JSON.stringify(spacing, null, 2));
  
  await browser.close();
})();

