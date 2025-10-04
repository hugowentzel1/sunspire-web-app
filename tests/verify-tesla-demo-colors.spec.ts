import { test, expect } from '@playwright/test';

test.describe('Tesla Demo Site Color Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Tesla demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
  });

  test('Verify Partners Page Tesla Red Colors', async ({ page }) => {
    // Navigate to partners page
    await page.click('text=Partners');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'partners-tesla-colors-verification.png', fullPage: true });
    
    // Check for Tesla red color (#CC0000) on pricing elements
    const pricingElements = [
      '$30/mo',
      '$120',
      '30 days',
      '$30/client',
      '$120/client',
      '10', // clients
      '$300/mo recurring',
      '$1200 setup'
    ];
    
    for (const text of pricingElements) {
      const element = page.locator(`text=${text}`).first();
      await expect(element).toBeVisible();
      
      // Check if element has Tesla red color
      const color = await element.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.color;
      });
      
      console.log(`Element "${text}" color: ${color}`);
      
      // Tesla red should be rgb(204, 0, 0) or similar
      expect(color).toMatch(/rgb\(204,\s*0,\s*0\)|#cc0000|#CC0000/i);
    }
  });

  test('Verify Support Page Mixed Colors', async ({ page }) => {
    // Navigate to support page
    await page.click('text=Support');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'support-mixed-colors-verification.png', fullPage: true });
    
    // Check Tesla red colors
    const teslaRedElements = [
      'Setup Guide',
      'CRM Integration Tutorial',
      'Branding Customization',
      'API Documentation'
    ];
    
    for (const text of teslaRedElements) {
      const element = page.locator(`text=${text}`).first();
      await expect(element).toBeVisible();
      
      const color = await element.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.color;
      });
      
      console.log(`Tesla red element "${text}" color: ${color}`);
      expect(color).toMatch(/rgb\(204,\s*0,\s*0\)|#cc0000|#CC0000/i);
    }
    
    // Check grey colors
    const greyElements = [
      'support@getsunspire.com',
      'View Documentation',
      'All systems operational'
    ];
    
    for (const text of greyElements) {
      const element = page.locator(`text=${text}`).first();
      await expect(element).toBeVisible();
      
      const color = await element.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.color;
      });
      
      console.log(`Grey element "${text}" color: ${color}`);
      // Grey should be rgb(107, 114, 128) or similar
      expect(color).toMatch(/rgb\(107,\s*114,\s*128\)|rgb\(64,\s*64,\s*64\)/i);
    }
  });

  test('Verify Pricing Page Grey Text', async ({ page }) => {
    // Navigate to pricing page
    await page.click('text=Pricing');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'pricing-grey-text-verification.png', fullPage: true });
    
    // Check grey text
    const greyTextElement = page.locator('text=Go live in under 24 hours with branded solar quotes');
    await expect(greyTextElement).toBeVisible();
    
    const color = await greyTextElement.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.color;
    });
    
    console.log(`Pricing grey text color: ${color}`);
    // Should be rgb(64, 64, 64) or similar grey
    expect(color).toMatch(/rgb\(64,\s*64,\s*64\)/i);
  });

  test('Reset Demo Runs and Test Report Page Access', async ({ page }) => {
    // Reset demo runs using the reset function
    await page.evaluate(() => {
      // Reset all demo quota systems
      localStorage.removeItem("demo_quota_v5");
      localStorage.removeItem("demo_runs_left");
      localStorage.removeItem("sunspire_demo_quota");
      localStorage.removeItem("sunspire_demo_quota_v1");
      localStorage.removeItem("demo_auto_open_v1");
      
      console.log("✅ Demo runs reset - you now have unlimited runs for testing");
    });
    
    // Navigate to report page to verify it's accessible
    await page.click('text=Report');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to verify report page loads
    await page.screenshot({ path: 'report-page-after-reset.png', fullPage: true });
    
    // Verify report page is accessible (no quota exceeded message)
    const quotaMessage = page.locator('text=Demo quota exceeded');
    await expect(quotaMessage).not.toBeVisible();
    
    console.log('✅ Demo runs reset successfully - report page is accessible');
  });
});
