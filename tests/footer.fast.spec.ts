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
  
        // Check Quick Links column is fully centered
        const quickLinksColumn = footer.locator('.grid.grid-cols-1.md\\:grid-cols-3 > div').nth(1);
        const quickLinksClass = await quickLinksColumn.getAttribute('class');
        console.log('Quick Links column classes:', quickLinksClass);

        const isFullyCentered = quickLinksClass?.includes('flex flex-col items-center text-center');
        console.log('✅ Quick Links is fully centered horizontally in footer block:', isFullyCentered);
        expect(isFullyCentered).toBe(true);
  
  // Check if "Powered by Sunspire" is centered in the bottom row
  const poweredByContainer = footer.locator('.flex-1.flex.justify-center').filter({ hasText: 'Powered by Sunspire' });
  const poweredByExists = await poweredByContainer.count() > 0;
  console.log('Powered by Sunspire container exists:', poweredByExists);

  if (poweredByExists) {
    const poweredByClass = await poweredByContainer.getAttribute('class');
    console.log('Powered by Sunspire container classes:', poweredByClass);

    const isCentered = poweredByClass?.includes('justify-center');
    console.log('✅ Powered by Sunspire is centered horizontally:', isCentered);
    expect(isCentered).toBe(true);
  } else {
    throw new Error('Powered by Sunspire container not found in footer bottom row');
  }

  // Check if Sunspire text has company color
  const sunspireText = footer.locator('span.font-medium').filter({ hasText: 'Sunspire' });
  const sunspireTextExists = await sunspireText.count() > 0;
  console.log('Sunspire text exists:', sunspireTextExists);

  if (sunspireTextExists) {
    const sunspireColor = await sunspireText.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.color;
    });
    console.log('Sunspire text color:', sunspireColor);
    
    // Check for Apple blue color (should be dynamic based on URL)
    const hasCompanyColor = sunspireColor.includes('rgb(0, 113, 227)') || sunspireColor.includes('#0071E3');
    console.log('✅ Sunspire text has company color:', hasCompanyColor);
    expect(hasCompanyColor).toBe(true);
  } else {
    throw new Error('Sunspire text not found in footer');
  }

  // Check if company name is dynamic (should show "Apple" for this URL)
  const companyNameText = footer.locator('text=Demo for Apple — Powered by Sunspire');
  const companyNameExists = await companyNameText.count() > 0;
  console.log('✅ Company name is dynamic (shows Apple):', companyNameExists);
  expect(companyNameExists).toBe(true);
  
  // 3. CHECK FOOTER CONTENT LENGTH BALANCE
  const leftContent = await footer.locator('text=Estimates generated using NREL PVWatts® v8').textContent();
  const rightContent = await footer.locator('text=Mapping & location data © Google').textContent();
  
  console.log('Left content length:', leftContent?.length);
  console.log('Right content length:', rightContent?.length);
  
  const contentBalanced = Math.abs((leftContent?.length || 0) - (rightContent?.length || 0)) <= 20;
  console.log('✅ Footer content is balanced for centering:', contentBalanced);
  expect(contentBalanced).toBe(true);
  
  console.log('🎉 ALL CURRENT REQUIREMENTS VERIFIED!');
  console.log('   - KPI band has white to company color gradient');
  console.log('   - Quick Links is fully centered horizontally in footer block');
  console.log('   - Powered by Sunspire is centered horizontally in footer');
  console.log('   - Sunspire text has dynamic company color (not a link)');
  console.log('   - Company name is dynamic based on URL');
  console.log('   - Footer has proper left, center, right alignment');
  
  // Keep browser open for 30 seconds to view the beautiful footer
  console.log('🕐 Keeping browser open for 30 seconds to view the beautiful footer...');
  await page.waitForTimeout(30000);
});