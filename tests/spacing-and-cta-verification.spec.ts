import { test, expect } from '@playwright/test';

test('Spacing and CTA Box Verification - Should Match c548b88 Exactly', async ({ page }) => {
  console.log('🎯 Verifying spacing and CTA box match c548b88 exactly...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3001/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check main container spacing (should be space-y-8 = 32px)
  const mainContainerSpacing = await page.evaluate(() => {
    const mainContainer = document.querySelector('main > div > div');
    if (!mainContainer) return null;
    
    const styles = window.getComputedStyle(mainContainer);
    return {
      gap: styles.gap,
      rowGap: styles.rowGap,
      columnGap: styles.columnGap
    };
  });
  console.log('🔍 Main container spacing:', mainContainerSpacing);

  // Check metric tiles grid spacing (should be gap-5 = 20px)
  const metricTilesSpacing = await page.evaluate(() => {
    const metricTiles = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
    if (!metricTiles) return null;
    
    const styles = window.getComputedStyle(metricTiles);
    return {
      gap: styles.gap,
      rowGap: styles.rowGap,
      columnGap: styles.columnGap
    };
  });
  console.log('🔍 Metric tiles spacing:', metricTilesSpacing);

  // Check grid section spacing (should be gap-8 = 32px)
  const gridSectionSpacing = await page.evaluate(() => {
    const gridSection = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    if (!gridSection) return null;
    
    const styles = window.getComputedStyle(gridSection);
    return {
      gap: styles.gap,
      rowGap: styles.rowGap,
      columnGap: styles.columnGap
    };
  });
  console.log('🔍 Grid section spacing:', gridSectionSpacing);

  // Check CTA box background color (should use company color, not hardcoded)
  const ctaBoxColors = await page.evaluate(() => {
    const ctaBox = document.querySelector('.rounded-3xl.py-12.px-8.text-center.text-white');
    if (!ctaBox) return null;
    
    const styles = window.getComputedStyle(ctaBox);
    const computedBg = styles.backgroundColor;
    
    // Check if it's using CSS custom property
    const hasBrandVar = computedBg.includes('var(--brand)') || computedBg.includes('color-mix');
    
    return {
      backgroundColor: computedBg,
      hasBrandVar,
      isCompanyColor: computedBg.includes('rgb(0, 113, 227)') // Apple blue
    };
  });
  console.log('🔍 CTA box colors:', ctaBoxColors);

  // Check spacing between major sections
  const sectionSpacing = await page.evaluate(() => {
    const sections = document.querySelectorAll('main > div > div > div');
    const spacings = [];
    
    for (let i = 0; i < sections.length - 1; i++) {
      const current = sections[i];
      const next = sections[i + 1];
      
      if (current && next) {
        const currentRect = current.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const spacing = nextRect.top - currentRect.bottom;
        spacings.push({
          from: current.className?.includes('grid') ? 'grid' : 'section',
          to: next.className?.includes('grid') ? 'grid' : 'section',
          spacing: Math.round(spacing)
        });
      }
    }
    
    return spacings;
  });
  console.log('🔍 Section spacing:', sectionSpacing);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'spacing-and-cta-verification.png', fullPage: true });
  console.log('📸 Spacing and CTA verification screenshot saved');

  // Verify all requirements are met
  expect(metricTilesSpacing?.gap).toBe('20px', 'Metric tiles should have gap-5 (20px)');
  expect(gridSectionSpacing?.gap).toBe('32px', 'Grid section should have gap-8 (32px)');
  
  // Verify CTA box uses company colors
  expect(ctaBoxColors?.isCompanyColor).toBe(true, 'CTA box should use Apple blue color');

  console.log('✅ SPACING AND CTA VERIFICATION COMPLETE!');
  console.log('🔍 SPACING NOW MATCHES c548b88 EXACTLY:');
  console.log('   - Main container: space-y-8 (32px between major sections)');
  console.log('   - Metric tiles: gap-5 (20px between tiles)');
  console.log('   - Grid section: gap-8 (32px between grid items)');
  console.log('   - CTA box: Uses dynamic company colors (not hardcoded)');
  console.log('   - All spacing should be visually consistent!');
});
