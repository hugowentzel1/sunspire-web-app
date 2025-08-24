import { test, expect } from '@playwright/test';

test.describe('Comprehensive c548b88 Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Address box looks and functions exactly like c548b88', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find the address input section
    const addressSection = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-3xl.shadow-2xl.border.border-gray-200\\/30.p-8.md\\:p-12.max-w-3xl.mx-auto.section-spacing');
    await expect(addressSection).toBeVisible();
    
    // Check the exact text content
    await expect(addressSection.locator('h2')).toHaveText('Enter Your Property Address');
    await expect(addressSection.locator('p.text-gray-600')).toHaveText('Get a comprehensive solar analysis tailored to your specific location');
    
    // Check the input field
    const input = addressSection.locator('input[placeholder="Enter your property address"]');
    await expect(input).toBeVisible();
    
    // Check the Get Quote button
    const getQuoteButton = addressSection.locator('button:has-text("Get Quote")');
    await expect(getQuoteButton).toBeVisible();
    
    // Check the status messages
    await expect(addressSection.locator('p.text-sm.text-gray-500').filter({ hasText: 'Address autocomplete temporarily unavailable' })).toBeVisible();
    await expect(addressSection.locator('p.text-sm.text-gray-500').filter({ hasText: 'Enter your property address to get started' })).toBeVisible();
    
    // Check the Launch Tool text
    await expect(addressSection.locator('span.text-sm.font-medium')).toHaveText('Launch Tool');
    
    // Check the Request Sample Report button
    const requestButton = addressSection.locator('button:has-text("Request Sample Report")');
    await expect(requestButton).toBeVisible();
    
    // Test the sample report modal functionality
    await requestButton.click();
    
    // Check modal appears
    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();
    
    // Check modal content
    await expect(modal.locator('h3')).toHaveText('Request Sample Report');
    await expect(modal.locator('input[type="email"]')).toBeVisible();
    await expect(modal.locator('button:has-text("Submit Request")')).toBeVisible();
    
    // Close modal
    await modal.locator('button:has-text("Cancel")').click();
    await expect(modal).not.toBeVisible();
  });

  test('Report page looks and functions exactly like c548b88', async ({ page }) => {
    // Navigate to report page
    await page.goto('http://localhost:3000/report');
    await page.waitForLoadState('networkidle');
    
    // Check header
    await expect(page.locator('h1')).toHaveText('Solar Analysis Report');
    await expect(page.locator('header a[href="/"]')).toHaveText('← Back to Home');
    await expect(page.locator('header a[href="/pricing"]')).toHaveText('Pricing');
    
    // Check the main analysis icon
    const mainIcon = page.locator('div.w-24.h-24.mx-auto.rounded-full.flex.items-center.justify-center.shadow-2xl.mb-6');
    await expect(mainIcon).toBeVisible();
    await expect(mainIcon.locator('span.text-4xl')).toHaveText('📊');
    
    // Check property analysis section
    await expect(page.locator('h2:has-text("Property Analysis")')).toBeVisible();
    
    // Check key metrics grid
    await expect(page.locator('div.bg-gradient-to-br.from-blue-50.to-blue-100.rounded-2xl.p-6.text-center.border.border-blue-200\\/50:has-text("8.2 kW")')).toBeVisible();
    await expect(page.locator('div.bg-gradient-to-br.from-green-50.to-green-100.rounded-2xl.p-6.text-center.border.border-green-200\\/50:has-text("$1,847")')).toBeVisible();
    await expect(page.locator('div.bg-gradient-to-br.from-purple-50.to-purple-100.rounded-2xl.p-6.text-center.border.border-purple-200\\/50:has-text("12,450 kWh")')).toBeVisible();
    
    // Check CTA band
    const ctaBand = page.locator('div.cta-band');
    await expect(ctaBand).toBeVisible();
    await expect(ctaBand.locator('h2')).toHaveText('Ready to Launch Your Branded Tool?');
    await expect(ctaBand.locator('button:has-text("Activate Your White-Label Demo")')).toBeVisible();
    await expect(ctaBand.locator('button:has-text("Request Sample Report")')).toBeVisible();
    
    // Check pricing text
    await expect(ctaBand.locator('div.text-sm.opacity-90.mb-4:has-text("Only $99/mo + $399 setup")')).toBeVisible();
    
    // Test sample report modal from report page
    await ctaBand.locator('button:has-text("Request Sample Report")').click();
    
    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();
    
    // Fill out the form
    await modal.locator('input[type="email"]').fill('test@example.com');
    await modal.locator('button:has-text("Submit Request")').click();
    
    // Check confirmation message
    await expect(modal.locator('h3:has-text("Sample Report Requested!")')).toBeVisible();
    await expect(modal.locator('p:has-text("Thanks for reaching out! We\'ll send your sample report to your email within 24 hours.")')).toBeVisible();
    
    // Wait for auto-close
    await page.waitForTimeout(3500);
    await expect(modal).not.toBeVisible();
  });

  test('DPA link works correctly', async ({ page }) => {
    // Go to home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Find and click DPA link
    const dpaLink = page.locator('footer a[href="/dpa"]');
    await expect(dpaLink).toBeVisible();
    await expect(dpaLink).toHaveText('DPA');
    
    // Click the link
    await dpaLink.click();
    
    // Verify we're on the DPA page
    await expect(page).toHaveURL('http://localhost:3000/dpa');
    
    // Check DPA page content
    await expect(page.locator('h1.text-4xl.font-black.text-gray-900.mb-8.text-center')).toHaveText('Data Processing Agreement (DPA)');
    await expect(page.locator('a:has-text("Back to Home")')).toBeVisible();
    
    // Test back to home link
    await page.locator('a:has-text("Back to Home")').click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('All navigation and functionality works end-to-end', async ({ page }) => {
    // Start from home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Enter an address
    const input = page.locator('input[placeholder="Enter your property address"]');
    await input.fill('123 Main St, Phoenix, AZ');
    
    // Click Get Quote
    await page.locator('button:has-text("Get Quote")').click();
    
    // Should navigate to report page
    await expect(page).toHaveURL(/\/report/);
    
    // On report page, test the sample report modal
    await page.locator('button:has-text("Request Sample Report")').click();
    
    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();
    
    // Fill and submit form
    await modal.locator('input[type="email"]').fill('test@example.com');
    await modal.locator('button:has-text("Submit Request")').click();
    
    // Verify confirmation
    await expect(modal.locator('h3:has-text("Sample Report Requested!")')).toBeVisible();
    
    // Go back to home
    await page.locator('a:has-text("← Back to Home")').click();
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Verify we're back on home page
    await expect(page.locator('h1:has-text("Your Branded Solar Quote Tool")')).toBeVisible();
  });
});
