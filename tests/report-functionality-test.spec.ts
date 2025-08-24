import { test, expect } from '@playwright/test';

test('Test Report Page Functionality - Exact Match to c548b88', async ({ page }) => {
  console.log('🚀 Testing report page functionality...');
  
  // Navigate to report page with sample data
  await page.goto('http://localhost:3002/report?address=123%20Main%20St%2C%20Anytown%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded');
  
  // Check that the address input section shows exactly what was requested
  const addressSection = page.locator('h2:has-text("Enter Your Property Address")');
  await expect(addressSection).toBeVisible();
  console.log('✅ Address section header visible');
  
  // Check the exact text from c548b88
  const comprehensiveText = page.locator('p:has-text("Get a comprehensive solar analysis tailored to your specific location")');
  await expect(comprehensiveText).toBeVisible();
  console.log('✅ "Get a comprehensive solar analysis tailored to your specific location" text visible');
  
  // Check for "Get Quote" button
  const getQuoteButton = page.locator('button:has-text("Get Quote")');
  await expect(getQuoteButton).toBeVisible();
  console.log('✅ "Get Quote" button visible');
  
  // Check for "Address autocomplete temporarily unavailable" message
  const autocompleteMessage = page.locator('p:has-text("Address autocomplete temporarily unavailable")');
  await expect(autocompleteMessage).toBeVisible();
  console.log('✅ "Address autocomplete temporarily unavailable" message visible');
  
  // Check for "Enter your property address to get started" message
  const enterAddressMessage = page.locator('p:has-text("Enter your property address to get started")');
  await expect(enterAddressMessage).toBeVisible();
  console.log('✅ "Enter your property address to get started" message visible');
  
  // Check for "Launch Tool" text
  const launchToolText = page.locator('span:has-text("Launch Tool")');
  await expect(launchToolText).toBeVisible();
  console.log('✅ "Launch Tool" text visible');
  
  // Now test the report page functionality
  console.log('🔍 Testing report page sample report functionality...');
  
  // Check that the report page shows the correct address
  const reportAddress = page.locator('p:has-text("Location: 123 Main St, Anytown, CA")');
  await expect(reportAddress).toBeVisible();
  console.log('✅ Report shows correct address');
  
  // Check for "Request Sample Report" button
  const sampleReportButton = page.locator('button:has-text("Request Sample Report")');
  await expect(sampleReportButton).toBeVisible();
  console.log('✅ "Request Sample Report" button visible');
  
  // Click the sample report button
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
  
  console.log('🎉 All functionality matches c548b88 exactly!');
  console.log('✅ Address input section: Exact text and layout');
  console.log('✅ Report page: Sample report functionality');
  console.log('✅ Modal: Opens, form submission, confirmation');
  console.log('✅ Confirmation: Exact text and auto-close');
  
  // Keep page open for visual verification
  await page.waitForTimeout(5000);
});
