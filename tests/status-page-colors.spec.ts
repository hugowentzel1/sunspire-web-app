import { test, expect } from '@playwright/test';

test('System Status Page - Company Color Test', async ({ page }) => {
  // Test with Apple demo to ensure no purple/blue colors
  const appleDemoUrl = 'https://sunspire-web-app.vercel.app/status?company=Apple&brandColor=%23000000&demo=1';
  await page.goto(appleDemoUrl);
  
  console.log('🌐 Navigated to Apple demo system status page');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take a screenshot to visually verify colors
  await page.screenshot({ path: 'apple-status-page.png', fullPage: true });
  console.log('📸 Screenshot saved as apple-status-page.png');
  
  // Check the SLA section specifically for company colors
  const slaSection = page.locator('text=SLA: Sunspire guarantees 99.9%+ uptime with 24/7 monitoring');
  const slaContainer = slaSection.locator('..').locator('..'); // Get the parent container
  
  if (await slaContainer.count() > 0) {
    console.log('✅ Found SLA section');
    
    // Get computed styles to verify colors
    const computedStyle = await slaContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color
      };
    });
    
    console.log('🎨 SLA Section Colors:');
    console.log(`  Background: ${computedStyle.backgroundColor}`);
    console.log(`  Border: ${computedStyle.borderColor}`);
    console.log(`  Text: ${computedStyle.color}`);
    
    // Verify it's not using hardcoded blue colors
    const isNotBlue = !computedStyle.backgroundColor.includes('rgb(239, 246, 255)') && 
                     !computedStyle.borderColor.includes('rgb(191, 219, 254)') &&
                     !computedStyle.color.includes('rgb(30, 64, 175)');
    
    if (isNotBlue) {
      console.log('✅ SLA section is using company colors, not hardcoded blue');
    } else {
      console.log('❌ SLA section still using hardcoded blue colors');
    }
    
    // Check if it's using Apple's black color
    if (computedStyle.backgroundColor.includes('rgba(0, 0, 0, 0.1)') || 
        computedStyle.borderColor.includes('rgba(0, 0, 0, 0.2)') ||
        computedStyle.color.includes('rgb(0, 0, 0)')) {
      console.log('✅ SLA section is using Apple brand colors (black)');
    }
    
  } else {
    console.log('❌ SLA section not found');
  }
  
  // Also test the main heading color
  const mainHeading = page.locator('h1:has-text("System Status")');
  if (await mainHeading.count() > 0) {
    const headingColor = await mainHeading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    console.log(`🎨 Main heading color: ${headingColor}`);
    
    // Should be Apple's black color
    if (headingColor.includes('rgb(0, 0, 0)')) {
      console.log('✅ Main heading is using Apple brand color (black)');
    } else {
      console.log('❌ Main heading is not using Apple brand color');
    }
  }
  
  // Test with a different company to ensure colors change
  const teslaDemoUrl = 'https://sunspire-web-app.vercel.app/status?company=Tesla&brandColor=%23cc0000&demo=1';
  await page.goto(teslaDemoUrl);
  
  console.log('🚗 Testing with Tesla demo (red colors)');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'tesla-status-page.png', fullPage: true });
  console.log('📸 Tesla screenshot saved as tesla-status-page.png');
  
  // Check Tesla colors
  const teslaHeading = page.locator('h1:has-text("System Status")');
  if (await teslaHeading.count() > 0) {
    const teslaHeadingColor = await teslaHeading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    console.log(`🎨 Tesla heading color: ${teslaHeadingColor}`);
    
    // Should be Tesla's red color
    if (teslaHeadingColor.includes('rgb(204, 0, 0)')) {
      console.log('✅ Tesla heading is using Tesla brand color (red)');
    } else {
      console.log('❌ Tesla heading is not using Tesla brand color');
    }
  }
  
  console.log('🎉 System status page color test complete!');
});
