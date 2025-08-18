import { test, expect } from '@playwright/test';

test.describe('Sunspire Web App - Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the full page
    await page.screenshot({ 
      path: 'test-results/homepage-full.png',
      fullPage: true 
    });
    
    // Verify the page loaded
    await expect(page).toHaveTitle(/Sunspire/);
  });

  test('should capture hero section', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('domcontentloaded');
    
    // Take screenshot of hero section
    const heroSection = page.locator('main').first();
    if (await heroSection.isVisible()) {
      await heroSection.screenshot({ 
        path: 'test-results/hero-section.png' 
      });
    }
  });

  test('should capture demo features', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Look for demo-related elements
    const demoElements = page.locator('[class*="demo"], [class*="Demo"]');
    
    if (await demoElements.count() > 0) {
      await page.screenshot({ 
        path: 'test-results/demo-features.png',
        fullPage: true 
      });
    }
  });

  test('should capture mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.screenshot({ 
      path: 'test-results/mobile-homepage.png',
      fullPage: true 
    });
  });
});
