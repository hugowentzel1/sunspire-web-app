import { test, expect } from '@playwright/test';

test.describe('Live Apple Demo - Debug Test', () => {
  test('Debug Apple demo issues', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🍎 Debugging Apple demo on live site...');
    
    // Navigate to Apple demo
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-apple-homepage.png' });
    
    // Check page title and content
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for any error messages
    const errorMessages = await page.locator('[class*="error"], [class*="Error"]').allTextContents();
    console.log('Error messages:', errorMessages);
    
    // Check console logs
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // Check if Apple branding is applied
    const brandElements = await page.locator('[style*="--brand"]').count();
    console.log('Brand elements found:', brandElements);
    
    // Check for address input
    const addressInput = page.locator('input[placeholder*="address" i]');
    const inputCount = await addressInput.count();
    console.log('Address inputs found:', inputCount);
    
    if (inputCount > 0) {
      // Test address input
      await addressInput.first().fill('123 Main St');
      await page.waitForTimeout(2000);
      
      // Check for autosuggest
      const suggestions = page.locator('[role="listbox"], .autocomplete-suggestions, [data-testid="suggestions"]');
      const suggestionCount = await suggestions.count();
      console.log('Autosuggest suggestions found:', suggestionCount);
      
      // Check for generate button
      const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Estimate")');
      const btnCount = await generateBtn.count();
      console.log('Generate buttons found:', btnCount);
      
      if (btnCount > 0) {
        // Try to generate estimate
        await generateBtn.first().click();
        await page.waitForTimeout(3000);
        
        // Check current URL
        const currentUrl = page.url();
        console.log('Current URL after generate:', currentUrl);
        
        // Check if we're on report page
        if (currentUrl.includes('/report')) {
          await page.screenshot({ path: 'debug-apple-report.png' });
          
          // Check for report content
          const reportContent = page.locator('[data-testid="report-content"], .report-content, .solar-estimate');
          const reportCount = await reportContent.count();
          console.log('Report content elements found:', reportCount);
          
          // Check for lock overlay
          const lockOverlay = page.locator('[data-testid="lock-overlay"], .lock-overlay, .preview-limit');
          const lockCount = await lockOverlay.count();
          console.log('Lock overlay elements found:', lockCount);
          
          // Check for quota display
          const quotaText = await page.locator('text=Preview:').or(page.locator('text=runs left')).allTextContents();
          console.log('Quota text found:', quotaText);
          
          // Check for CTA buttons
          const ctaButtons = page.locator('button:has-text("Activate"), button:has-text("Unlock"), button:has-text("Checkout"), a:has-text("Activate"), a:has-text("Unlock")');
          const ctaCount = await ctaButtons.count();
          console.log('CTA buttons found:', ctaCount);
          
          if (ctaCount > 0) {
            const ctaTexts = await ctaButtons.allTextContents();
            console.log('CTA button texts:', ctaTexts);
          }
        }
      }
    }
    
    // Check localStorage
    const localStorage = await page.evaluate(() => {
      const items = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          items[key] = window.localStorage.getItem(key);
        }
      }
      return items;
    });
    console.log('LocalStorage contents:', localStorage);
    
    console.log('✅ Debug test completed');
  });
});
