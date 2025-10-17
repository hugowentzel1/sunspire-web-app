import { test, expect } from '@playwright/test';

test('Show lock screen overlay', async ({ page }) => {
  // Navigate to demo page with company branding
  await page.goto('/?company=uber&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of initial page
  await page.screenshot({ 
    path: 'screenshots/lock-screen-01-initial.png', 
    fullPage: true 
  });
  
  // Try to trigger lock overlay by exhausting quota
  // Navigate to report page multiple times to consume quota
  for (let i = 0; i < 5; i++) {
    await page.goto(`/report?company=uber&demo=1&address=123+Test+St,+City,+CA&run=${i}`);
    await page.waitForTimeout(1000);
  }
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('[data-testid="primary-cta-lock"]');
  
  if (await lockOverlay.isVisible()) {
    console.log('✅ Lock overlay is visible!');
    
    // Take screenshot of lock overlay
    await page.screenshot({ 
      path: 'screenshots/lock-screen-02-overlay.png',
      fullPage: false 
    });
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'screenshots/lock-screen-03-full.png',
      fullPage: true 
    });
    
    // Highlight the CTA button
    await lockOverlay.highlight();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/lock-screen-04-cta-highlighted.png',
      fullPage: false 
    });
    
  } else {
    console.log('⚠️ Lock overlay not triggered yet - trying alternative approach');
    
    // Alternative: try to navigate to a specific demo URL that might trigger lock
    await page.goto('/?company=uber&demo=1&runs=0');
    await page.waitForTimeout(2000);
    
    // Check again
    if (await lockOverlay.isVisible()) {
      console.log('✅ Lock overlay triggered with alternative method!');
      await page.screenshot({ 
        path: 'screenshots/lock-screen-alternative.png',
        fullPage: true 
      });
    } else {
      console.log('❌ Could not trigger lock overlay');
      await page.screenshot({ 
        path: 'screenshots/lock-screen-fallback.png',
        fullPage: true 
      });
    }
  }
  
  // Keep browser open for visual inspection
  console.log('\n📸 Screenshots saved to screenshots/ directory');
  await page.waitForTimeout(10000); // Keep open for 10 seconds
});
