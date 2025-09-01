import { test, expect } from '@playwright/test';

test.describe('Visual Demo - Browser Stays Open', () => {
  test('Visual demo of header, autosuggest, and solar report generation', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('🌐 Browser is now open and ready for visual inspection');
    console.log('📍 Current URL:', page.url());
    
    // Wait for user to see the header
    console.log('👀 Please inspect the header/banner - it should show:');
    console.log('   - Logo and company name on the left');
    console.log('   - Navigation links (Pricing, Partners, Support)');
    console.log('   - Orange CTA button "Activate on Your Domain — 24 Hours"');
    console.log('   - Disclaimer footer');
    
    // Wait 10 seconds for visual inspection
    await page.waitForTimeout(10000);
    
    // Find the address input field
    const addressInput = page.locator('input[placeholder*="property address"]');
    const generateButton = page.locator('button:has-text("Generate Solar Intelligence Report")');
    
    console.log('🔍 Now testing address input and autosuggest...');
    
    // Enter an address to test autosuggest
    await addressInput.click();
    await addressInput.fill('Times Square, New York');
    
    console.log('⌨️  Typed "Times Square, New York" - watch for autosuggest dropdown');
    
    // Wait for autosuggest
    await page.waitForTimeout(3000);
    
    const dropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
    
    if (await dropdown.isVisible()) {
      console.log('✅ Autosuggest dropdown appeared!');
      console.log('🖱️  Clicking on first suggestion...');
      
      const firstOption = dropdown.locator('.px-3.py-2.cursor-pointer').first();
      await firstOption.click();
      
      console.log('✅ Selected address from autosuggest');
    } else {
      console.log('⚠️  No autosuggest dropdown appeared (this might be expected)');
      console.log('📝 Using manual address entry...');
      
      // Clear and enter a manual address
      await addressInput.clear();
      await addressInput.fill('123 Main St, New York, NY 10001');
    }
    
    // Wait for user to see the address input
    await page.waitForTimeout(5000);
    
    console.log('🚀 Now testing the generate button...');
    console.log('💡 The button should be enabled and ready to click');
    
    // Wait for user to see the button state
    await page.waitForTimeout(3000);
    
    // Click the generate button
    console.log('🖱️  Clicking "Generate Solar Intelligence Report" button...');
    await generateButton.click();
    
    console.log('⏳ Waiting for navigation to report page...');
    
    // Wait for navigation
    await page.waitForURL('**/report**', { timeout: 15000 });
    
    console.log('✅ Successfully navigated to report page!');
    console.log('📍 Current URL:', page.url());
    
    // Wait for loading state
    await page.waitForSelector('text="Generating your solar intelligence report..."', { timeout: 10000 });
    console.log('🔄 Report is generating... (loading spinner visible)');
    
    // Wait for loading to complete
    await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 30000 });
    console.log('✅ Loading complete! Solar report should now be visible');
    
    // Wait for report to fully render
    await page.waitForTimeout(3000);
    
    console.log('📊 Solar report should now show:');
    console.log('   - System Size');
    console.log('   - Annual Production');
    console.log('   - Energy Savings');
    console.log('   - ROI and Payback Period');
    console.log('   - Carbon Offset');
    console.log('   - Monthly Savings');
    
    console.log('🎉 DEMO COMPLETE! Browser will stay open for 30 seconds for final inspection...');
    
    // Keep browser open for final inspection
    await page.waitForTimeout(30000);
    
    console.log('✅ Visual demo completed successfully!');
  });
});
