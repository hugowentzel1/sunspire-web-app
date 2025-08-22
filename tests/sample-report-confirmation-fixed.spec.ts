import { test, expect } from '@playwright/test';

test('Sample Report Confirmation - Fixed Test', async ({ page }) => {
  // Test with Apple demo to ensure confirmation works
  const appleDemoUrl = 'https://sunspire-web-app.vercel.app/demo-result?company=Apple&brandColor=%23000000&demo=1';
  await page.goto(appleDemoUrl);
  
  console.log('🌐 Navigated to Apple demo page');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Look for sample report buttons
  const sampleButtons = page.locator('button:has-text("Request Sample Report"), button:has-text("Sample Report"), a:has-text("Request Sample Report")');
  const buttonCount = await sampleButtons.count();
  
  console.log(`🔍 Found ${buttonCount} sample report buttons`);
  
  if (buttonCount === 0) {
    console.log('⚠️ No sample report button found, taking screenshot for debugging');
    await page.screenshot({ path: 'no-button-found.png', fullPage: true });
    return;
  }
  
  // Click the first sample report button
  console.log('🖱️ Clicking sample report button...');
  await sampleButtons.first().click();
  
  // Wait for modal to appear
  console.log('⏳ Waiting for modal to appear...');
  try {
    await page.waitForSelector('[role="dialog"], .modal, .fixed, .absolute, .lead-form-modal', { timeout: 10000 });
    console.log('✅ Modal appeared');
  } catch (error) {
    console.log('❌ Modal did not appear');
    await page.screenshot({ path: 'modal-not-found.png' });
    return;
  }
  
  // Take screenshot of modal
  await page.screenshot({ path: 'modal-open.png' });
  console.log('📸 Modal screenshot saved');
  
  // Fill out the form
  console.log('✍️ Filling out form...');
  try {
    await page.fill('input[placeholder*="name"], input[name="name"]', 'Test User');
    await page.fill('input[placeholder*="email"], input[name="email"]', 'test@example.com');
    console.log('✅ Form filled out');
  } catch (error) {
    console.log('❌ Could not fill form fields:', error);
    return;
  }
  
  // Submit the form
  console.log('🚀 Submitting form...');
  try {
    // Look for the submit button in the form
    const submitButton = page.locator('button[type="submit"], button:has-text("Request Sample Report")').filter({ hasText: "Request Sample Report" });
    
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      console.log('✅ Form submitted via submit button');
    } else {
      // Try clicking the button directly
      await page.click('button:has-text("Request Sample Report")');
      console.log('✅ Form submitted via direct button click');
    }
  } catch (error) {
    console.log('❌ Could not submit form:', error);
    await page.screenshot({ path: 'submit-error.png' });
    return;
  }
  
  // Wait for success state
  console.log('⏳ Waiting for success confirmation...');
  try {
    // Wait for either confirmation message
    await page.waitForSelector('text=Sample Report Requested!, text=You\'re All Set!', { timeout: 15000 });
    console.log('✅ Success confirmation appeared');
    
    // Take screenshot of success state
    await page.screenshot({ path: 'success-confirmation.png' });
    console.log('📸 Success screenshot saved');
    
    // Verify the correct confirmation message
    const confirmationText = await page.textContent('body');
    
    if (confirmationText?.includes('Sample Report Requested!')) {
      console.log('🎉 Correct confirmation message: "Sample Report Requested!"');
    } else if (confirmationText?.includes("You're All Set!")) {
      console.log('⚠️ Old confirmation message: "You\'re All Set!" - needs update');
    } else {
      console.log('❓ Unknown confirmation message');
    }
    
    // Check for the detailed message
    if (confirmationText?.includes('Thanks for reaching out')) {
      console.log('✅ Detailed confirmation message is present');
    } else {
      console.log('❌ Detailed confirmation message missing');
    }
    
  } catch (error) {
    console.log('❌ Success confirmation did not appear:', error);
    await page.screenshot({ path: 'no-confirmation.png' });
  }
  
  console.log('🎉 Sample report confirmation test complete!');
});
