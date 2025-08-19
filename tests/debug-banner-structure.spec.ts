import { test, expect } from '@playwright/test';

test.describe('Debug Banner Structure', () => {
  test('Examine TealEnergy banner structure in detail', async ({ page }) => {
    console.log('🔍 Examining TealEnergy banner structure in detail...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Get detailed information about the banner area
    const bannerInfo = await page.evaluate(() => {
      // Find the "Built for" section
      const builtForH2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
        h2.textContent?.includes('Built for')
      );
      
      if (!builtForH2) return { error: 'No "Built for" section found' };
      
      // Get the parent container
      const bannerContainer = builtForH2.closest('div') || builtForH2.parentElement;
      
      // Find all elements in the banner area
      const allElements = bannerContainer ? Array.from(bannerContainer.children) : [];
      const elementDetails = allElements.map((el, index) => ({
        index,
        tagName: el.tagName,
        textContent: el.textContent?.trim().substring(0, 100),
        className: el.className,
        hasButton: el.tagName === 'BUTTON',
        hasIcon: el.innerHTML.includes('⚡') || el.innerHTML.includes('lightning'),
        isDescription: el.tagName === 'P' && el.textContent?.includes('Exclusive preview')
      }));
      
      // Look for the launch button specifically
      const launchButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Ready to launch') || 
        btn.textContent?.includes('Launch on')
      );
      
      // Look for any button with lightning icon
      const lightningButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.innerHTML.includes('⚡') || btn.innerHTML.includes('lightning')
      );
      
      return {
        builtForText: builtForH2.textContent,
        bannerContainer: bannerContainer?.className || 'none',
        elementCount: allElements.length,
        elementDetails,
        hasLaunchButton: !!launchButton,
        launchButtonText: launchButton?.textContent || 'none',
        hasLightningButton: !!lightningButton,
        lightningButtonText: lightningButton?.textContent || 'none',
        pageHTML: document.body.innerHTML.substring(0, 2000)
      };
    });
    
    console.log('🔍 Detailed Banner Info:', JSON.stringify(bannerInfo, null, 2));
    
    // Take multiple screenshots to see the layout
    await page.screenshot({ 
      path: 'test-results/tealenergy-banner-debug-full.png',
      fullPage: true 
    });
    
    // Try to find and screenshot the banner container
    const bannerContainer = page.locator('h2').filter({ hasText: 'Built for' }).first();
    if (await bannerContainer.count() > 0) {
      await bannerContainer.screenshot({ 
        path: 'test-results/tealenergy-banner-debug-section.png'
      });
    }
    
    console.log('✅ Debug screenshots saved');
  });
});
