import { test, expect } from '@playwright/test';

test('Current visual requirements check', async ({ page }) => {
  // Capture console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/?company=Apple&demo=1', { waitUntil: 'networkidle' });
  
  // Wait a bit for the page to fully render
  await page.waitForTimeout(3000);
  
  console.log('🔍 CHECKING CURRENT REQUIREMENTS...');
  
  // 1. CHECK KPI BAND HAS WHITE TO COMPANY COLOR GRADIENT
  const kpiBand = page.locator('.py-16.relative').first();
  const kpiBandExists = await kpiBand.count() > 0;
  console.log('KPI band exists:', kpiBandExists);
  
  if (kpiBandExists) {
    const kpiBandStyle = await kpiBand.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        background: computedStyle.background,
        backgroundImage: computedStyle.backgroundImage
      };
    });
    console.log('KPI band background:', kpiBandStyle.background);
    
    // Check for white to company color gradient
    const hasGradient = kpiBandStyle.background.includes('linear-gradient');
    const hasWhite = kpiBandStyle.background.includes('white') || kpiBandStyle.background.includes('rgb(255, 255, 255)');
    const hasCompanyColor = kpiBandStyle.background.includes('#0071E3') || kpiBandStyle.background.includes('rgb(0, 113, 227)');
    const hasWhiteToColor = (kpiBandStyle.background.includes('white') || kpiBandStyle.background.includes('rgb(255, 255, 255)')) && (kpiBandStyle.background.includes('#0071E3') || kpiBandStyle.background.includes('rgb(0, 113, 227)'));
    
    console.log('✅ Has gradient:', hasGradient);
    console.log('✅ Has white start:', hasWhite);
    console.log('✅ Has company color end:', hasCompanyColor);
    console.log('✅ Has white-to-company-color gradient:', hasWhiteToColor);
    
    expect(hasGradient).toBe(true);
    expect(hasWhite).toBe(true);
    expect(hasCompanyColor).toBe(true);
    expect(hasWhiteToColor).toBe(true);
  } else {
    throw new Error('KPI band not found on page');
  }
  
  // 2. CHECK FOOTER STRUCTURE AND CENTERING
  const footer = page.locator('[data-testid="footer"]');
  const footerExists = await footer.count() > 0;
  console.log('Footer exists:', footerExists);
  
  if (!footerExists) {
    throw new Error('Footer element with data-testid="footer" not found on page');
  }
  
  // Check Quick Links is centered horizontally
  const quickLinksColumn = footer.locator('.grid.grid-cols-1.md\\:grid-cols-3 > div').nth(1);
  const quickLinksClass = await quickLinksColumn.getAttribute('class');
  console.log('Quick Links column classes:', quickLinksClass);
  
  const quickLinksCentered = quickLinksClass?.includes('text-center');
  console.log('✅ Quick Links is centered horizontally:', quickLinksCentered);
  expect(quickLinksCentered).toBe(true);
  
  // Check if "Powered by Sunspire" is centered in the bottom row
  const poweredBySunspire = footer.locator('.border-t.border-gray-200').locator('text=Powered by Sunspire');
  const poweredByExists = await poweredBySunspire.count() > 0;
  console.log('Powered by Sunspire exists in bottom row:', poweredByExists);
  
  if (poweredByExists) {
    // Find the div that contains "Powered by Sunspire" text
    const poweredByContainer = poweredBySunspire.locator('xpath=..');
    const poweredByClass = await poweredByContainer.getAttribute('class');
    console.log('Powered by Sunspire container classes:', poweredByClass);
    
    const isCentered = poweredByClass?.includes('text-center') || poweredByClass?.includes('flex justify-center') || poweredByClass?.includes('flex-1');
    console.log('✅ Powered by Sunspire is centered horizontally:', isCentered);
    expect(isCentered).toBe(true);
  } else {
    throw new Error('Powered by Sunspire text not found in footer bottom row');
  }
  
  // 3. CHECK FOOTER CONTENT LENGTH BALANCE
  const leftContent = await footer.locator('text=Solar estimates generated').textContent();
  const rightContent = await footer.locator('text=Mapping & location data').textContent();
  
  console.log('Left content length:', leftContent?.length);
  console.log('Right content length:', rightContent?.length);
  
  const contentBalanced = Math.abs((leftContent?.length || 0) - (rightContent?.length || 0)) <= 5;
  console.log('✅ Footer content is balanced for centering:', contentBalanced);
  expect(contentBalanced).toBe(true);
  
  console.log('🎉 ALL CURRENT REQUIREMENTS VERIFIED!');
  console.log('   - KPI band has white to company color gradient');
  console.log('   - Quick Links is centered horizontally in footer');
  console.log('   - Powered by Sunspire is centered horizontally in footer');
  console.log('   - Footer content is balanced for proper centering');
});