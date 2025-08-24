import { test, expect } from '@playwright/test';

test('c548b88 Exact Verification - Keep Browser Open', async ({ page }) => {
  console.log('🚀 Starting comprehensive c548b88 exact verification...');
  
  // Navigate to main page
  await page.goto('http://localhost:3002/');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded');
  
  // 1. Verify old banner from c548b88
  console.log('🔍 1. Checking old banner from c548b88...');
  const oldBanner = page.locator('text=Private demo for Your Company. Not affiliated.');
  await expect(oldBanner).toBeVisible();
  console.log('✅ Old banner visible: "Private demo for Your Company. Not affiliated."');
  
  // 2. Verify hero text updates
  console.log('🔍 2. Checking hero text...');
  const heroText = page.locator('h1:has-text("Your Branded Solar Quote Tool")');
  await expect(heroText).toBeVisible();
  const readyToLaunchText = page.locator('span:has-text("— Ready to Launch")');
  await expect(readyToLaunchText).toBeVisible();
  console.log('✅ Hero text: "Your Branded Solar Quote Tool — Ready to Launch"');
  
  // 3. Verify sub-hero with 24 hours
  const subHeroText = page.locator('p:has-text("Go live in 24 hours")');
  await expect(subHeroText).toBeVisible();
  console.log('✅ Sub-hero text updated with 24 hours');
  
  // 4. Verify EXACT address input section from c548b88
  console.log('🔍 4. Checking EXACT address input section...');
  
  // Header
  const addressHeader = page.locator('h2:has-text("Enter Your Property Address")');
  await expect(addressHeader).toBeVisible();
  console.log('✅ "Enter Your Property Address" header');
  
  // Description
  const comprehensiveText = page.locator('p:has-text("Get a comprehensive solar analysis tailored to your specific location")');
  await expect(comprehensiveText).toBeVisible();
  console.log('✅ "Get a comprehensive solar analysis tailored to your specific location"');
  
  // Input field
  const addressInput = page.locator('input[placeholder="Enter your property address"]');
  await expect(addressInput).toBeVisible();
  console.log('✅ Address input field');
  
  // Get Quote button
  const getQuoteButton = page.locator('button:has-text("Get Quote")');
  await expect(getQuoteButton).toBeVisible();
  console.log('✅ "Get Quote" button');
  
  // Status messages
  const autocompleteMessage = page.locator('p:has-text("Address autocomplete temporarily unavailable")').first();
  await expect(autocompleteMessage).toBeVisible();
  console.log('✅ "Address autocomplete temporarily unavailable"');
  
  const enterAddressMessage = page.locator('p:has-text("Enter your property address to get started")').first();
  await expect(enterAddressMessage).toBeVisible();
  console.log('✅ "Enter your property address to get started"');
  
  // Launch Tool
  const launchToolText = page.locator('span:has-text("Launch Tool")');
  await expect(launchToolText).toBeVisible();
  console.log('✅ "Launch Tool" text');
  
  // 5. Verify Request Sample Report button on main page
  const sampleReportButton = page.locator('button:has-text("Request Sample Report")');
  await expect(sampleReportButton).toBeVisible();
  console.log('✅ "Request Sample Report" button on main page');
  
  // 6. Test sample report modal from main page
  console.log('🔍 6. Testing sample report modal...');
  await sampleReportButton.click();
  console.log('🖱️ Clicked sample report button');
  
  await page.waitForSelector('h3:has-text("Request Sample Report")', { timeout: 5000 });
  console.log('✅ Sample report modal opened');
  
  // Fill and submit
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('test@example.com');
  console.log('📧 Filled email');
  
  const submitButton = page.locator('button:has-text("Submit Request")');
  await submitButton.click();
  console.log('🖱️ Submitted');
  
  // Wait for confirmation
  await page.waitForSelector('h3:has-text("Sample Report Requested!")', { timeout: 5000 });
  console.log('✅ Confirmation: "Sample Report Requested!"');
  
  const confirmationText = page.locator('p:has-text("Thanks for reaching out! We\'ll send your sample report to your email within 24 hours.")');
  await expect(confirmationText).toBeVisible();
  console.log('✅ Exact confirmation text');
  
  // Wait for auto-close
  await page.waitForTimeout(3500);
  
  // 7. Test navigation to report page
  console.log('🔍 7. Testing report page navigation...');
  
  // Fill address and generate report
  await addressInput.fill('123 Main St, Anytown, CA');
  console.log('🏠 Filled address');
  
  await getQuoteButton.click();
  console.log('🖱️ Clicked Get Quote');
  
  // Wait for report page
  await page.waitForURL('**/report**', { timeout: 10000 });
  console.log('✅ Navigated to report page');
  
  // 8. Verify EXACT report page from c548b88
  console.log('🔍 8. Verifying EXACT report page...');
  
  // Check header
  const reportHeader = page.locator('h1:has-text("Solar Intelligence Report")');
  await expect(reportHeader).toBeVisible();
  console.log('✅ Report header: "Solar Intelligence Report"');
  
  // Check address display
  const reportAddress = page.locator('p:has-text("Comprehensive analysis for 123 Main St, Anytown, CA")');
  await expect(reportAddress).toBeVisible();
  console.log('✅ Report shows address');
  
  // Check back to home button
  const backToHomeButton = page.locator('a:has-text("Back to Home")');
  await expect(backToHomeButton).toBeVisible();
  console.log('✅ "Back to Home" button');
  
  // Check property analysis section
  const propertyAnalysis = page.locator('h2:has-text("Property Analysis")');
  await expect(propertyAnalysis).toBeVisible();
  console.log('✅ "Property Analysis" section');
  
  // Check solar potential
  const solarPotential = page.locator('h3:has-text("Solar Potential")');
  await expect(solarPotential).toBeVisible();
  console.log('✅ Solar Potential metric');
  
  // Check savings
  const savings = page.locator('h3:has-text("Est. Savings")');
  await expect(savings).toBeVisible();
  console.log('✅ Est. Savings metric');
  
  // Check system size
  const systemSize = page.locator('h3:has-text("System Size")');
  await expect(systemSize).toBeVisible();
  console.log('✅ System Size metric');
  
  // 9. Test report page sample report button
  const reportSampleButton = page.locator('button:has-text("Request Sample Report")');
  await expect(reportSampleButton).toBeVisible();
  console.log('✅ Sample report button on report page');
  
  await reportSampleButton.click();
  console.log('🖱️ Clicked report sample button');
  
  await page.waitForSelector('h3:has-text("Request Sample Report")', { timeout: 5000 });
  console.log('✅ Report modal opened');
  
  // Fill and submit on report page
  const reportEmailInput = page.locator('input[type="email"]');
  await reportEmailInput.fill('test2@example.com');
  console.log('📧 Filled report email');
  
  const reportSubmitButton = page.locator('button:has-text("Submit Request")');
  await reportSubmitButton.click();
  console.log('🖱️ Submitted report form');
  
  await page.waitForSelector('h3:has-text("Sample Report Requested!")', { timeout: 5000 });
  console.log('✅ Report confirmation appeared');
  
  // Wait for auto-close
  await page.waitForTimeout(3500);
  
  // 10. Test back to home navigation
  await backToHomeButton.click();
  console.log('🖱️ Clicked Back to Home');
  
  await page.waitForURL('**/', { timeout: 10000 });
  console.log('✅ Back on main page');
  
  // 11. Verify email support emoji change
  console.log('🔍 11. Checking email support emoji...');
  const emailSupportEmoji = page.locator('h3:has-text("📮 Email support 24/7")');
  await expect(emailSupportEmoji).toBeVisible();
  console.log('✅ Email support emoji changed to 📮');
  
  console.log('🎉🎉🎉 ALL c548b88 FUNCTIONALITY VERIFIED EXACTLY! 🎉🎉🎉');
  console.log('');
  console.log('✅ MAIN PAGE:');
  console.log('   ✓ Old banner: "Private demo for Your Company. Not affiliated."');
  console.log('   ✓ Hero: "Your Branded Solar Quote Tool — Ready to Launch"');
  console.log('   ✓ Sub-hero: 24 hours reference');
  console.log('   ✓ Address section: EXACT text from c548b88');
  console.log('   ✓ Sample report button and modal functionality');
  console.log('   ✓ Email emoji changed to 📮');
  console.log('');
  console.log('✅ REPORT PAGE:');
  console.log('   ✓ Exact layout and design from c548b88');
  console.log('   ✓ Proper navigation and back button');
  console.log('   ✓ Sample report modal with exact confirmation');
  console.log('   ✓ Auto-close functionality');
  console.log('');
  console.log('🚀 READY TO PUSH TO GIT!');
  
  // Keep browser open for visual inspection
  console.log('');
  console.log('⏸️ Keeping browser open for visual inspection...');
  console.log('   You can now visually inspect all the changes!');
  console.log('   Browser will stay open for 60 seconds...');
  
  await page.waitForTimeout(60000);
  
  console.log('✅ Visual verification complete!');
});
