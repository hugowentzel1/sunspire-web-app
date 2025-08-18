import { test, expect } from '@playwright/test';

test.describe('Button Color Analysis - Current State', () => {
  test('should capture all button types and their current colors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);
    
    // Capture all buttons on the page
    const buttons = page.locator('button, .btn, [class*="btn"], [class*="button"]');
    const buttonCount = await buttons.count();
    
    console.log(`Found ${buttonCount} buttons on the page`);
    
    // Take screenshot of the full page to see all buttons
    await page.screenshot({ 
      path: 'test-results/current-buttons-full.png',
      fullPage: true 
    });
    
    // Capture individual button details
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        try {
          // Get button text and classes
          const text = await button.textContent();
          const classes = await button.getAttribute('class');
          const computedStyle = await button.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return {
              backgroundColor: style.backgroundColor,
              color: style.color,
              borderColor: style.borderColor,
              boxShadow: style.boxShadow
            };
          });
          
          console.log(`Button ${i + 1}:`, {
            text: text?.trim(),
            classes,
            styles: computedStyle
          });
          
          // Take screenshot of individual button
          await button.screenshot({ 
            path: `test-results/button-${i + 1}-${text?.trim().replace(/\s+/g, '-') || 'unnamed'}.png` 
          });
        } catch (e) {
          console.log(`Could not capture button ${i + 1}:`, e);
        }
      }
    }
  });

  test('should capture button hover states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Find primary buttons
    const primaryButtons = page.locator('button, .btn, [class*="btn"], [class*="button"]').first();
    
    if (await primaryButtons.isVisible()) {
      // Take screenshot before hover
      await primaryButtons.screenshot({ 
        path: 'test-results/button-before-hover.png' 
      });
      
      // Hover over button
      await primaryButtons.hover();
      await page.waitForTimeout(500);
      
      // Take screenshot after hover
      await primaryButtons.screenshot({ 
        path: 'test-results/button-after-hover.png' 
      });
    }
  });

  test('should capture different company color schemes', async ({ page }) => {
    // Test with default colors
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/default-company-colors.png',
      fullPage: true 
    });
    
    // Test with a different company (if you have one set up)
    // This would test the dynamic color system
    console.log('Testing default company color scheme');
  });
});
