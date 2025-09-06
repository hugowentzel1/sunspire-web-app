import { test, expect } from '@playwright/test';

test('Test Netflix demo with correct approach', async ({ page }) => {
  console.log('🔍 Testing Netflix demo with correct approach...');
  
  // Try different URL variations
  const urls = [
    'https://sunspire-web-app.vercel.app/?company=Netflix&demo=1',
    'https://sunspire-web-app.vercel.app/?company=Netflix&demo=true',
    'https://sunspire-web-app.vercel.app/?company=Netflix',
    'https://sunspire-web-app.vercel.app/?demo=1&company=Netflix'
  ];
  
  for (const url of urls) {
    console.log(`\n🌐 Testing URL: ${url}`);
    
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    // Check if we have the address input form
    const addressInput = page.locator('input[placeholder*="address"]');
    const inputCount = await addressInput.count();
    
    if (inputCount > 0) {
      console.log('✅ Found address input form!');
      
      // Check for demo status
      const demoStatus = page.locator('text=Preview:').first();
      const demoVisible = await demoStatus.isVisible();
      
      if (demoVisible) {
        const demoText = await demoStatus.textContent();
        console.log('📊 Demo status:', demoText);
        
        // Check for generate button
        const generateButton = page.locator('button:has-text("Generate Solar Report")');
        const generateCount = await generateButton.count();
        
        if (generateCount > 0) {
          const isEnabled = await generateButton.isEnabled();
          console.log('🔘 Generate button found and enabled:', isEnabled);
          
          if (isEnabled) {
            // Test the functionality
            await addressInput.fill('123 Main St, Los Angeles, CA');
            await generateButton.click();
            
            await page.waitForTimeout(3000);
            const currentUrl = page.url();
            console.log('🌐 Current URL after click:', currentUrl);
            
            if (currentUrl.includes('/report')) {
              console.log('✅ Successfully navigated to report page');
              break;
            }
          }
        } else {
          console.log('❌ Generate button not found');
        }
      } else {
        console.log('❌ Demo status not visible');
      }
    } else {
      console.log('❌ Address input form not found');
    }
    
    // Take a screenshot for this URL
    await page.screenshot({ path: `netflix-test-${urls.indexOf(url)}.png` });
  }
  
  console.log('📸 Screenshots saved for all URL variations');
});
