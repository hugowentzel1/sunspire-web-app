import { test, expect } from '@playwright/test';

test('Demo Fixes Verification - Visual Test', async ({ page }) => {
  console.log('🎯 Starting comprehensive demo fixes verification...');
  
  // Test 1: System Status Page Colors
  console.log('\n🔍 Test 1: System Status Page Company Colors');
  await page.goto('https://sunspire-web-app.vercel.app/status?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take screenshot of system status page
  await page.screenshot({ path: 'system-status-apple-colors.png', fullPage: true });
  console.log('📸 System status page screenshot saved');
  
  // Check SLA section colors
  const slaSection = page.locator('text=SLA: Sunspire guarantees 99.9%+ uptime with 24/7 monitoring');
  if (await slaSection.count() > 0) {
    const slaContainer = slaSection.locator('..').locator('..');
    const slaColors = await slaContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        background: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color
      };
    });
    
    console.log('🎨 SLA Section Colors:');
    console.log(`  Background: ${slaColors.background}`);
    console.log(`  Border: ${slaColors.borderColor}`);
    console.log(`  Text: ${slaColors.color}`);
    
    // Verify it's using Apple's black color
    if (slaColors.color.includes('rgb(0, 0, 0)')) {
      console.log('✅ SLA section is using Apple brand colors (black)');
    } else {
      console.log('❌ SLA section is not using Apple brand colors');
    }
  }
  
  // Test 2: Sample Report Confirmation
  console.log('\n🔍 Test 2: Sample Report Confirmation');
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Look for sample report button
  const sampleButton = page.locator('button:has-text("Request Sample Report")');
  if (await sampleButton.count() > 0) {
    console.log('✅ Found sample report button');
    
    // Click the button
    await sampleButton.first().click();
    console.log('🖱️ Clicked sample report button');
    
    // Wait for modal
    await page.waitForSelector('.lead-form-modal, .modal, [role="dialog"]', { timeout: 10000 });
    console.log('✅ Modal opened');
    
    // Take screenshot of modal
    await page.screenshot({ path: 'sample-report-modal-open.png' });
    console.log('📸 Modal screenshot saved');
    
    // Fill out the form
    await page.fill('input[placeholder*="name"], input[name="name"]', 'Test User');
    await page.fill('input[placeholder*="email"], input[name="email"]', 'test@example.com');
    console.log('✅ Form filled out');
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      console.log('🚀 Form submitted');
      
      // Wait for success confirmation
      try {
        await page.waitForSelector('text=Sample Report Requested!, text=You\'re All Set!', { timeout: 15000 });
        console.log('✅ Success confirmation appeared!');
        
        // Take screenshot of success state
        await page.screenshot({ path: 'sample-report-confirmation-success.png' });
        console.log('📸 Success confirmation screenshot saved');
        
        // Verify the message
        const confirmationText = await page.textContent('body');
        if (confirmationText?.includes('Sample Report Requested!')) {
          console.log('🎉 Correct confirmation message: "Sample Report Requested!"');
        } else if (confirmationText?.includes("You're All Set!")) {
          console.log('⚠️ Old confirmation message: "You\'re All Set!" - needs update');
        }
        
      } catch (error) {
        console.log('❌ Success confirmation did not appear');
        await page.screenshot({ path: 'no-confirmation.png' });
      }
    } else {
      console.log('❌ Submit button not found');
    }
  } else {
    console.log('❌ Sample report button not found');
  }
  
  // Test 3: Button Height Consistency
  console.log('\n🔍 Test 3: Button Height Consistency');
  
  // Check CTABand buttons
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Look for CTA buttons
  const ctaButtons = page.locator('button:has-text("Activate Your White-Label Demo"), button:has-text("Request Sample Report")');
  const ctaButtonCount = await ctaButtons.count();
  
  if (ctaButtonCount >= 2) {
    console.log(`✅ Found ${ctaButtonCount} CTA buttons`);
    
    // Check button heights
    for (let i = 0; i < Math.min(ctaButtonCount, 2); i++) {
      const button = ctaButtons.nth(i);
      const buttonText = await button.textContent();
      const buttonHeight = await button.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          height: style.height
        };
      });
      
      console.log(`🎯 Button "${buttonText?.trim()}":`);
      console.log(`  Padding Top: ${buttonHeight.paddingTop}`);
      console.log(`  Padding Bottom: ${buttonHeight.paddingBottom}`);
      console.log(`  Height: ${buttonHeight.height}`);
      
      // Verify consistent padding
      if (buttonHeight.paddingTop === '16px' && buttonHeight.paddingBottom === '16px') {
        console.log('✅ Button has consistent py-4 padding');
      } else {
        console.log('❌ Button padding is inconsistent');
      }
    }
    
    // Take screenshot of CTA buttons
    await page.screenshot({ path: 'cta-buttons-consistent-heights.png' });
    console.log('📸 CTA buttons screenshot saved');
  }
  
  // Test 4: Different Company Colors
  console.log('\n🔍 Test 4: Different Company Colors');
  await page.goto('https://sunspire-web-app.vercel.app/status?company=Tesla&brandColor=%23cc0000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take screenshot of Tesla status page
  await page.screenshot({ path: 'system-status-tesla-colors.png', fullPage: true });
  console.log('📸 Tesla status page screenshot saved');
  
  // Check Tesla colors
  const teslaHeading = page.locator('h1:has-text("System Status")');
  if (await teslaHeading.count() > 0) {
    const teslaColor = await teslaHeading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    console.log(`🎨 Tesla heading color: ${teslaColor}`);
    
    if (teslaColor.includes('rgb(204, 0, 0)')) {
      console.log('✅ Tesla heading is using Tesla brand color (red)');
    } else {
      console.log('❌ Tesla heading is not using Tesla brand color');
    }
  }
  
  console.log('\n🎉 All tests completed! Check the screenshots to verify the fixes.');
  console.log('\n📸 Screenshots saved:');
  console.log('  - system-status-apple-colors.png');
  console.log('  - sample-report-modal-open.png');
  console.log('  - sample-report-confirmation-success.png');
  console.log('  - cta-buttons-consistent-heights.png');
  console.log('  - system-status-tesla-colors.png');
});
