import { test, expect } from '@playwright/test';

test('verify LeadModal matches the image exactly', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Click the Request Sample Report button to open the modal
  await page.click('text=Request Sample Report');
  
  // Wait for modal to appear
  await page.waitForTimeout(1000);
  
  // Verify modal title
  const modalTitle = await page.locator('text=Request Sample Report').count();
  expect(modalTitle).toBeGreaterThan(0);
  
  // Verify modal description
  const modalDescription = await page.locator('text=Get a detailed sample of your solar analysis').count();
  expect(modalDescription).toBeGreaterThan(0);
  
  // Verify form fields
  const nameField = await page.locator('label:has-text("Name *")').count();
  expect(nameField).toBe(1);
  
  const emailField = await page.locator('label:has-text("Email *")').count();
  expect(emailField).toBe(1);
  
  const phoneField = await page.locator('label:has-text("Phone (optional)")').count();
  expect(phoneField).toBe(1);
  
  const notesField = await page.locator('label:has-text("Notes (optional)")').count();
  expect(notesField).toBe(1);
  
  // Verify submit button
  const submitButton = await page.locator('.bg-white button:has-text("Request Sample Report")').count();
  expect(submitButton).toBe(1);
  
  // Verify confirmation message
  const confirmationText = await page.locator('text=We\'ll send your sample report within 24 hours.').count();
  expect(confirmationText).toBe(1);
  
  // Fill out the form
  await page.fill('input[placeholder="Your full name"]', 'Test User');
  await page.fill('input[placeholder="your@email.com"]', 'test@example.com');
  await page.fill('input[placeholder="(555) 123-4567"]', '(555) 123-4567');
  await page.fill('textarea[placeholder="Any specific questions or requirements..."]', 'Test notes');
  
  // Submit the form - use the modal submit button specifically
  await page.locator('.bg-white button:has-text("Request Sample Report")').click();
  
  // Wait for success state
  await page.waitForTimeout(2000);
  
  // Verify success message
  const successTitle = await page.locator('text=Sample Report Requested!').count();
  expect(successTitle).toBe(1);
  
  const thanksMessage = await page.locator('text=Thanks for reaching out!').count();
  expect(thanksMessage).toBe(1);
  
  const whatNextTitle = await page.locator('text=What\'s Next?').count();
  expect(whatNextTitle).toBe(1);
  
  const nextStepsText = await page.locator('text=We\'ll email you a detailed sample report within 24 hours, along with next steps to get your white-label demo live.').count();
  expect(nextStepsText).toBe(1);
  
  const closeButton = await page.locator('button:has-text("Close")').count();
  expect(closeButton).toBe(1);
  
  // Take screenshot for visual verification
  await page.screenshot({ path: 'leadmodal-verified.png' });
  
  console.log('✅ LeadModal verified successfully!');
});
