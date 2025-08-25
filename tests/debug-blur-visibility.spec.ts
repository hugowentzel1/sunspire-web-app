import { test, expect } from '@playwright/test';

test('Debug Blur Visibility Issues', async ({ page }) => {
  console.log('🔍 Debugging blur visibility issues...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3000/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check if blur layers exist
  const blurLayers = await page.locator('[class*="bg-white/60 backdrop-blur-sm"]').count();
  console.log('🔍 Blur layers found:', blurLayers);

  // Check the actual DOM structure and positioning
  const blurDebug = await page.evaluate(() => {
    const blurLayers = document.querySelectorAll('[class*="bg-white/60 backdrop-blur-sm"]');
    const contentElements = document.querySelectorAll('[class*="text-3xl font-black"]');
    
    return {
      blurLayers: Array.from(blurLayers).map((blur, index) => {
        const rect = blur.getBoundingClientRect();
        const styles = window.getComputedStyle(blur);
        return {
          index,
          position: styles.position,
          zIndex: styles.zIndex,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter,
          opacity: styles.opacity,
          visibility: styles.visibility,
          display: styles.display
        };
      }),
      contentElements: Array.from(contentElements).map((content, index) => {
        const rect = content.getBoundingClientRect();
        const styles = window.getComputedStyle(content);
        return {
          index,
          position: styles.position,
          zIndex: styles.zIndex,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        };
      })
    };
  });
  console.log('🔍 Blur debug info:', JSON.stringify(blurDebug, null, 2));

  // Check if blur layers are actually covering the content
  const coverageCheck = await page.evaluate(() => {
    const blurLayers = document.querySelectorAll('[class*="bg-white/60 backdrop-blur-sm"]');
    const contentElements = document.querySelectorAll('[class*="text-3xl font-black"]');
    
    return Array.from(blurLayers).map((blur, index) => {
      const blurRect = blur.getBoundingClientRect();
      const contentRect = contentElements[index]?.getBoundingClientRect();
      
      if (!contentRect) return { index, covered: false, reason: 'No matching content' };
      
      // Check if blur layer covers the content
      const covered = 
        blurRect.top <= contentRect.top &&
        blurRect.left <= contentRect.left &&
        blurRect.bottom >= contentRect.bottom &&
        blurRect.right >= contentRect.right;
      
      return {
        index,
        covered,
        blurBounds: { top: blurRect.top, left: blurRect.left, bottom: blurRect.bottom, right: blurRect.right },
        contentBounds: { top: contentRect.top, left: contentRect.left, bottom: contentRect.bottom, right: contentRect.right },
        reason: covered ? 'Covered' : 'Not covered - positioning issue'
      };
    });
  });
  console.log('🔍 Coverage check:', JSON.stringify(coverageCheck, null, 2));

  // Check CSS specificity and overrides
  const cssSpecificity = await page.evaluate(() => {
    const blurLayers = document.querySelectorAll('[class*="bg-white/60 backdrop-blur-sm"]');
    return Array.from(blurLayers).map((blur, index) => {
      const styles = window.getComputedStyle(blur);
      return {
        index,
        backgroundColor: styles.backgroundColor,
        backdropFilter: styles.backdropFilter,
        opacity: styles.opacity,
        visibility: styles.visibility,
        display: styles.display,
        zIndex: styles.zIndex,
        position: styles.position,
        // Check if any styles are being overridden
        allStyles: {
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter,
          filter: styles.filter,
          transform: styles.transform
        }
      };
    });
  });
  console.log('🔍 CSS specificity check:', JSON.stringify(cssSpecificity, null, 2));

  // Take screenshot for visual inspection
  await page.screenshot({ path: 'debug-blur-visibility.png', fullPage: true });
  console.log('📸 Debug screenshot saved');

  // Log findings
  console.log('🔍 DEBUG FINDINGS:');
  console.log('   - Blur layers found:', blurLayers);
  console.log('   - Check if blur layers are positioned correctly');
  console.log('   - Check if z-index is working');
  console.log('   - Check if CSS is being overridden');
  console.log('   - Check if content is actually behind blur layers');
});
