import { test, expect } from '@playwright/test';

test('Final Verification - All c548b88 Functionality Restored', async ({ page }) => {
  console.log('🚀 Final verification of all c548b88 functionality...');
  
  // Navigate to main page
  await page.goto('http://localhost:3002/');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded');
  
  // 1. Check old banner from c548b88 is visible
  console.log('🔍 Checking old banner from c548b88...');
  const oldBanner = page.locator('text=Private demo for Your Company. Not affiliated.');
  await expect(oldBanner).toBeVisible();
  console.log('✅ Old banner from c548b88 is visible: "Private demo for Your Company. Not affiliated."');
  
  // 2. Check hero text is updated
  console.log('🔍 Checking hero text updates...');
  const heroText = page.locator('h1:has-text("Your Branded Solar Quote Tool")');
  await expect(heroText).toBeVisible();
  const readyToLaunchText = page.locator('span:has-text("— Ready to Launch")');
  await expect(readyToLaunchText).toBeVisible();
  console.log('✅ Hero text updated: "Your Branded Solar Quote Tool — Ready to Launch"');
  
  // 3. Check sub-hero text is updated
  const subHeroText = page.locator('p:has-text("Go live in 24 hours. Convert more leads, book more consultations, and sync every inquiry seamlessly to your CRM — all fully branded for your company.")');
  await expect(subHeroText).toBeVisible();
  console.log('✅ Sub-hero text updated with 24 hours reference');
  
  // 4. Check address input section has exact text from c548b88
  console.log('🔍 Checking address input section...');
  const addressHeader = page.locator('h2:has-text("Enter Your Property Address")');
  await expect(addressHeader).toBeVisible();
  console.log('✅ Address section header: "Enter Your Property Address"');
  
  const comprehensiveText = page.locator('p:has-text("Get a comprehensive solar analysis tailored to your specific location")');
  await expect(comprehensiveText).toBeVisible();
  console.log('✅ "Get a comprehensive solar analysis tailored to your specific location" text visible');
  
  const autocompleteMessage = page.locator('p:has-text("Address autocomplete temporarily unavailable")').first();
  await expect(autocompleteMessage).toBeVisible();
  console.log('✅ "Address autocomplete temporarily unavailable" message visible');
  
  const enterAddressMessage = page.locator('p:has-text("Enter your property address to get started")').first();
  await expect(enterAddressMessage).toBeVisible();
  console.log('✅ "Enter your property address to get started" message visible');
  
  // 5. Check "Request Sample Report" button is visible on main page
  console.log('🔍 Checking Request Sample Report button...');
  const sampleReportButton = page.locator('button:has-text("Request Sample Report")');
  await expect(sampleReportButton).toBeVisible();
  console.log('✅ "Request Sample Report" button visible on main page');
  
  // 6. Test the sample report modal functionality
  console.log('🔍 Testing sample report modal...');
  await sampleReportButton.click();
  console.log('🖱️ Clicked sample report button');
  
  // Wait for modal to appear
  await page.waitForSelector('h3:has-text("Request Sample Report")', { timeout: 5000 });
  console.log('✅ Sample report modal opened');
  
  // Fill in email
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('test@example.com');
  console.log('📧 Filled in email address');
  
  // Submit the form
  const submitButton = page.locator('button:has-text("Submit Request")');
  await submitButton.click();
  console.log('🖱️ Clicked submit button');
  
  // Wait for confirmation
  await page.waitForSelector('h3:has-text("Sample Report Requested!")', { timeout: 5000 });
  console.log('✅ Confirmation message appeared: "Sample Report Requested!"');
  
  // Check the exact confirmation text
  const confirmationText = page.locator('p:has-text("Thanks for reaching out! We\'ll send your sample report to your email within 24 hours.")');
  await expect(confirmationText).toBeVisible();
  console.log('✅ Exact confirmation text visible');
  
  // Wait for modal to auto-close
  await page.waitForTimeout(3500);
  
  // Check that modal is closed
  const modalClosed = page.locator('h3:has-text("Request Sample Report")');
  await expect(modalClosed).not.toBeVisible();
  console.log('✅ Modal auto-closed after confirmation');
  
  // 7. Check email support emoji is changed
  console.log('🔍 Checking email support emoji...');
  const emailSupportEmoji = page.locator('h3:has-text("📮 Email support 24/7")');
  await expect(emailSupportEmoji).toBeVisible();
  console.log('✅ Email support emoji changed to 📮');
  
  // 8. Test report page functionality
  console.log('🔍 Testing report page...');
  
  // Fill in an address and generate report
  const addressInput = page.locator('input[placeholder*="address"]');
  await addressInput.fill('123 Main St, Anytown, CA');
  console.log('🏠 Filled in address');
  
  const generateButton = page.locator('button:has-text("Generate Solar Intelligence Report")');
  await generateButton.click();
  console.log('🖱️ Clicked generate button');
  
  // Wait for navigation to report page
  await page.waitForURL('**/report**', { timeout: 10000 });
  console.log('✅ Navigated to report page');
  
  // Check report page has "Request Sample Report" button
  const reportSampleButton = page.locator('button:has-text("Request Sample Report")');
  await expect(reportSampleButton).toBeVisible();
  console.log('✅ Report page has "Request Sample Report" button');
  
  // Test report page modal
  await reportSampleButton.click();
  console.log('🖱️ Clicked report page sample report button');
  
  await page.waitForSelector('h3:has-text("Request Sample Report")', { timeout: 5000 });
  console.log('✅ Report page modal opened');
  
  // Fill and submit form
  const reportEmailInput = page.locator('input[type="email"]');
  await reportEmailInput.fill('test2@example.com');
  console.log('📧 Filled in report page email');
  
  const reportSubmitButton = page.locator('button:has-text("Submit Request")');
  await reportSubmitButton.click();
  console.log('🖱️ Submitted report page form');
  
  // Wait for confirmation
  await page.waitForSelector('h3:has-text("Sample Report Requested!")', { timeout: 5000 });
  console.log('✅ Report page confirmation appeared');
  
  // Wait for auto-close
  await page.waitForTimeout(3500);
  
  // 9. Check "Back to Home" navigation
  console.log('🔍 Checking Back to Home navigation...');
  const backToHomeButton = page.locator('a:has-text("Back to Home")');
  await expect(backToHomeButton).toBeVisible();
  console.log('✅ "Back to Home" button visible on report page');
  
  // Click back to home
  await backToHomeButton.click();
  console.log('🖱️ Clicked Back to Home');
  
  // Wait for navigation back to main page
  await page.waitForURL('**/', { timeout: 10000 });
  console.log('✅ Navigated back to main page');
  
  console.log('🎉 ALL c548b88 FUNCTIONALITY VERIFIED!');
  console.log('✅ Old banner restored: "Private demo for Your Company. Not affiliated."');
  console.log('✅ Hero text updated to "Your Branded Solar Quote Tool — Ready to Launch"');
  console.log('✅ Sub-hero text updated with 24 hours reference');
  console.log('✅ Address input section has exact text from c548b88');
  console.log('✅ "Request Sample Report" button visible on main page');
  console.log('✅ Sample report modal opens, form submission, confirmation works');
  console.log('✅ Confirmation text matches exactly: "Sample Report Requested!"');
  console.log('✅ Modal auto-closes after confirmation');
  console.log('✅ Email support emoji changed to 📮');
  console.log('✅ Report page has "Request Sample Report" functionality');
  console.log('✅ Report page modal works exactly the same');
  console.log('✅ "Back to Home" navigation working');
  
  // Keep page open for visual verification
  await page.waitForTimeout(5000);
});
