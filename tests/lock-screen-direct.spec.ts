import { test, expect } from '@playwright/test';

test('Show lock screen - direct approach', async ({ page }) => {
  // Navigate to a demo page
  await page.goto('/?company=uber&demo=1');
  await page.waitForLoadState('networkidle');
  
  console.log('📱 Current page URL:', page.url());
  
  // Take initial screenshot
  await page.screenshot({ 
    path: 'screenshots/lock-direct-01-home.png', 
    fullPage: true 
  });
  
  // Try to go to report page to see if we can trigger the lock
  await page.goto('/report?company=uber&demo=1&address=123+Main+St,+Los+Angeles,+CA');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📱 Report page URL:', page.url());
  
  // Check for any lock overlay elements
  const lockElements = await page.locator('[data-testid="primary-cta-lock"], .lock-overlay, [class*="lock"]').count();
  console.log('🔍 Found lock elements:', lockElements);
  
  // Take screenshot of report page
  await page.screenshot({ 
    path: 'screenshots/lock-direct-02-report.png', 
    fullPage: true 
  });
  
  // Try to manually trigger the lock overlay by injecting the component
  // or checking if there's a way to force it
  await page.evaluate(() => {
    // Check if there's a way to trigger the lock overlay
    console.log('Checking for lock overlay triggers...');
    
    // Look for any elements that might trigger the lock
    const lockTriggers = document.querySelectorAll('[data-lock], [class*="lock"], [id*="lock"]');
    console.log('Found potential lock triggers:', lockTriggers.length);
    
    // Try to dispatch a custom event that might trigger the lock
    window.dispatchEvent(new CustomEvent('lockOverlay', { detail: { force: true } }));
  });
  
  await page.waitForTimeout(2000);
  
  // Final screenshot
  await page.screenshot({ 
    path: 'screenshots/lock-direct-03-final.png', 
    fullPage: true 
  });
  
  console.log('\n📸 Screenshots saved to screenshots/ directory');
  console.log('🔍 Check the screenshots to see the current state');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(15000);
});
