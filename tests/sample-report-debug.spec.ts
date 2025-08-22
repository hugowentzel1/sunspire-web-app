import { test, expect } from '@playwright/test';

test('Sample Report Confirmation Debug', async ({ page }) => {
  console.log('🔍 Debugging sample report confirmation...');
  
  // Navigate to Apple demo page
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Listen to console logs
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
    console.log('📝 Console:', msg.text());
  });
  
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
    
    // Wait a bit for modal to fully render
    await page.waitForTimeout(1000);
    
    // Take screenshot of modal
    await page.screenshot({ path: 'sample-report-modal-debug.png' });
    console.log('📸 Modal screenshot saved');
    
    // Fill out the form
    await page.fill('input[placeholder*="name"], input[name="name"]', 'Test User');
    await page.fill('input[placeholder*="email"], input[name="email"]', 'test@example.com');
    console.log('✅ Form filled out');
    
    // Check if submit button is inside form
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.count() > 0) {
      console.log('✅ Submit button found');
      
      // Check if button is inside form
      const isInsideForm = await submitButton.evaluate((el) => {
        return el.closest('form') !== null;
      });
      console.log(`🔍 Submit button inside form: ${isInsideForm}`);
      
      // Submit the form
      console.log('🚀 About to submit form...');
      await submitButton.first().click();
      console.log('🚀 Form submitted');
      
      // Wait a bit for the submission to process
      await page.waitForTimeout(2000);
      
      // Check console logs for debugging info
      console.log('\n🔍 Console logs after form submission:');
      consoleLogs.forEach(log => console.log(`  ${log}`));
      
      // Check if success state is visible
      const successElements = page.locator('text=Sample Report Requested!, text=You\'re All Set!');
      const successCount = await successElements.count();
      console.log(`🔍 Success elements found: ${successCount}`);
      
      // Check what's actually in the modal content
      const modalContent = page.locator('.modal-content, .lead-form-modal > div').first();
      if (await modalContent.count() > 0) {
        const modalText = await modalContent.textContent();
        console.log('🔍 Modal content text:', modalText?.substring(0, 200) + '...');
        
        // Check if success text is in the DOM but hidden
        const successInDOM = modalText?.includes('Sample Report Requested!') || modalText?.includes("You're All Set!");
        console.log(`🔍 Success text in DOM: ${successInDOM}`);
      }
      
      // Check for any hidden elements
      const hiddenElements = await page.locator('*').evaluateAll((elements) => {
        return elements
          .filter(el => el.textContent?.includes('Sample Report Requested!') || el.textContent?.includes("You're All Set!"))
          .map(el => ({
            tag: el.tagName,
            text: el.textContent?.substring(0, 50),
            visible: el.offsetParent !== null,
            display: window.getComputedStyle(el).display,
            opacity: window.getComputedStyle(el).opacity
          }));
      });
      
      if (hiddenElements.length > 0) {
        console.log('🔍 Hidden success elements found:', hiddenElements);
      } else {
        console.log('🔍 No success elements found in DOM at all');
      }
      
      if (successCount > 0) {
        console.log('🎉 Success confirmation is visible!');
        await page.screenshot({ path: 'sample-report-success-debug.png' });
      } else {
        console.log('❌ Success confirmation not visible');
        
        // Check if modal is still open
        const modalOpen = await page.locator('.lead-form-modal, .modal, [role="dialog"]').count();
        console.log(`🔍 Modal still open: ${modalOpen > 0}`);
        
        // Check if form is still visible
        const formVisible = await page.locator('form').count();
        console.log(`🔍 Form still visible: ${formVisible > 0}`);
        
        // Take screenshot of current state
        await page.screenshot({ path: 'sample-report-no-success-debug.png' });
      }
      
    } else {
      console.log('❌ Submit button not found');
    }
  } else {
    console.log('❌ Sample report button not found');
  }
  
  console.log('\n🎯 Debug Summary:');
  console.log(`- Console logs captured: ${consoleLogs.length}`);
  console.log(`- Success elements found: ${await page.locator('text=Sample Report Requested!, text=You\'re All Set!').count()}`);
  console.log(`- Modal open: ${await page.locator('.lead-form-modal, .modal, [role="dialog"]').count() > 0}`);
});
