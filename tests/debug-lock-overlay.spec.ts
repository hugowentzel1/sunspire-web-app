import { test, expect } from '@playwright/test';

test('Debug Lock Overlay', async ({ page }) => {
  console.log('🔍 Debugging lock overlay...');
  
  // Clear localStorage first to reset quota
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Navigate to Tesla report page
  await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  if (isLockVisible) {
    // Check for CTA buttons in lock overlay
    const ctaButtons = await page.locator('[data-cta="primary"]').count();
    console.log('🔘 CTA buttons in lock overlay:', ctaButtons);
    
    // Check for any buttons with "Activate" text
    const activateButtons = await page.locator('button:has-text("Activate")').count();
    console.log('🔘 Activate buttons found:', activateButtons);
    
    // Check for any buttons at all
    const allButtons = await page.locator('button').count();
    console.log('🔘 Total buttons found:', allButtons);
    
    // Check lock overlay content
    const lockText = await page.textContent('body');
    console.log('📝 Lock overlay contains "Activate":', lockText?.includes('Activate'));
    console.log('📝 Lock overlay contains "locked":', lockText?.includes('locked'));
    
    // Try to find any clickable elements
    const clickableElements = await page.locator('button, a, [onclick]').count();
    console.log('🖱️ Clickable elements found:', clickableElements);
    
    // Check if there are any buttons with specific text
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('🔘 Button texts:', buttonTexts);
  } else {
    console.log('📊 No lock overlay, checking for report content...');
    
    // Check for CTA buttons in report
    const ctaButtons = await page.locator('[data-cta="primary"]').count();
    console.log('🔘 CTA buttons in report:', ctaButtons);
    
    // Check for any buttons with "Activate" text
    const activateButtons = await page.locator('button:has-text("Activate")').count();
    console.log('🔘 Activate buttons found:', activateButtons);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-lock-overlay.png' });
  console.log('📸 Screenshot saved as debug-lock-overlay.png');
});
