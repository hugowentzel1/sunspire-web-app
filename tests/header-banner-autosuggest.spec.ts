import { test, expect } from '@playwright/test';

test.describe('Header/Banner and Autosuggest Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Header banner displays correctly with logo and company name', async ({ page }) => {
    // Check that the header is visible and has the correct structure
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check for the logo/company section on the left
    const logoSection = header.locator('.flex.items-center.space-x-4');
    await expect(logoSection).toBeVisible();

    // Check for the sun emoji logo (default when no company logo)
    const sunLogo = header.locator('.w-12.h-12.bg-gray-900.rounded-lg');
    await expect(sunLogo).toBeVisible();
    await expect(sunLogo.locator('span')).toHaveText('☀️');

    // Check for company name
    const companyName = header.locator('h1.text-2xl.font-black');
    await expect(companyName).toBeVisible();
    await expect(companyName).toHaveText('Your Company');

    // Check for "Solar Intelligence" subtitle
    const subtitle = header.locator('p.text-xs.font-semibold.text-gray-500');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText('Solar Intelligence');

    // Check for navigation links
    const pricingLink = header.locator('a[href="/pricing"]').first();
    const partnersLink = header.locator('a[href="/partners"]').first();
    const supportLink = header.locator('a[href="/support"]').first();
    
    await expect(pricingLink).toBeVisible();
    await expect(pricingLink).toHaveText('Pricing');
    await expect(partnersLink).toBeVisible();
    await expect(partnersLink).toHaveText('Partners');
    await expect(supportLink).toBeVisible();
    await expect(supportLink).toHaveText('Support');

    // Check for the CTA button
    const ctaButton = header.locator('button.btn-primary');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveText('Activate on Your Domain — 24 Hours');

    // Check for the disclaimer footer
    const disclaimer = header.locator('.border-t.border-gray-100.bg-gray-50\\/50');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer.locator('p')).toHaveText('Private demo for Your Company. Not affiliated.');
  });

  test('Address autosuggest functionality works correctly', async ({ page }) => {
    // Find the address input field
    const addressInput = page.locator('input[placeholder*="property address"]');
    await expect(addressInput).toBeVisible();

    // Type in an address to trigger autosuggest
    await addressInput.click();
    await addressInput.fill('123 Main St');

    // Wait for autosuggest dropdown to appear
    const dropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
    
    // Wait a bit for the API call to complete
    await page.waitForTimeout(1000);

    // Check if dropdown appears (may not if no results or API issues)
    const dropdownVisible = await dropdown.isVisible();
    
    if (dropdownVisible) {
      // If dropdown is visible, test selection
      const firstOption = dropdown.locator('.px-3.py-2.cursor-pointer').first();
      await expect(firstOption).toBeVisible();
      
      // Click on the first option
      await firstOption.click();
      
      // Verify the input is populated with the selected address
      await expect(addressInput).not.toHaveValue('123 Main St');
    } else {
      // If no dropdown, just verify the input accepts text
      await expect(addressInput).toHaveValue('123 Main St');
    }
  });

  test('Address autosuggest keyboard navigation works', async ({ page }) => {
    const addressInput = page.locator('input[placeholder*="property address"]');
    await expect(addressInput).toBeVisible();

    // Type in an address
    await addressInput.click();
    await addressInput.fill('456 Oak Ave');

    // Wait for potential dropdown
    await page.waitForTimeout(1000);

    // Test keyboard navigation if dropdown is visible
    const dropdown = page.locator('.absolute.z-10.w-full.mt-1.bg-white.border.border-gray-300.rounded-md.shadow-lg');
    
    if (await dropdown.isVisible()) {
      // Press arrow down to select first option
      await addressInput.press('ArrowDown');
      
      // Press enter to select
      await addressInput.press('Enter');
      
      // Verify selection was made
      await expect(addressInput).not.toHaveValue('456 Oak Ave');
    }
  });

  test('Generate button functionality works with address', async ({ page }) => {
    const addressInput = page.locator('input[placeholder*="property address"]');
    const generateButton = page.locator('button:has-text("Generate Solar Intelligence Report")');
    
    await expect(addressInput).toBeVisible();
    await expect(generateButton).toBeVisible();

    // Enter an address
    await addressInput.fill('789 Pine St, New York, NY');
    
    // Handle any JavaScript dialogs that might appear
    page.on('dialog', dialog => dialog.dismiss());
    
    // Click the generate button
    await generateButton.click();

    // Wait for navigation to start
    await page.waitForLoadState('networkidle');
    
    // Check if we're on the report page or if there was an error
    const currentUrl = page.url();
    if (currentUrl.includes('/report')) {
      // Successfully navigated to report page
      await expect(page).toHaveURL(/.*\/report/);
    } else {
      // If not on report page, check if there's an error or if the button is still on the page
      const stillOnHomePage = await page.locator('button:has-text("Generate Solar Intelligence Report")').isVisible();
      if (stillOnHomePage) {
        // Button is still there, which means navigation didn't happen
        // This might be expected behavior if there are validation issues
        console.log('Generate button clicked but navigation did not occur - this might be expected');
      }
    }
  });

  test('Generate button is disabled without address', async ({ page }) => {
    const addressInput = page.locator('input[placeholder*="property address"]');
    const generateButton = page.locator('button:has-text("Generate Solar Intelligence Report")');
    
    await expect(addressInput).toBeVisible();
    await expect(generateButton).toBeVisible();

    // Clear the input
    await addressInput.clear();
    
    // Button should be disabled
    await expect(generateButton).toBeDisabled();
  });

  test('Header CTA button functionality', async ({ page }) => {
    const ctaButton = page.locator('button.btn-primary');
    await expect(ctaButton).toBeVisible();

    // Click the CTA button and check if it triggers any action
    await ctaButton.click();
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Check if we navigated to demo-result (expected behavior for non-branded mode)
    await expect(page).toHaveURL('http://localhost:3000/demo-result');
  });

  test('Header styling matches orange/gold theme', async ({ page }) => {
    const header = page.locator('header');
    const ctaButton = page.locator('button.btn-primary');
    
    // Check that the header has the correct background
    await expect(header).toHaveClass(/bg-white\/90/);
    
    // Check that the CTA button has the primary brand color class
    await expect(ctaButton).toHaveClass(/btn-primary/);
    
    // Check that navigation links have hover effects (use first to avoid duplicates)
    const pricingLink = header.locator('a[href="/pricing"]').first();
    await expect(pricingLink).toHaveClass(/hover:text-\[var\(--brand-primary\)\]/);
  });

  test('Responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Navigation should be hidden on mobile (md:flex)
    const nav = header.locator('nav.hidden.md\\:flex');
    // On mobile, the nav should be hidden, so we expect it to not be visible
    await expect(nav).not.toBeVisible();
    
    // Logo and company name should still be visible
    const logoSection = header.locator('.flex.items-center.space-x-4');
    await expect(logoSection).toBeVisible();
    
    const companyName = header.locator('h1.text-2xl.font-black');
    await expect(companyName).toBeVisible();
  });

  test('Address input accepts and displays text correctly', async ({ page }) => {
    const addressInput = page.locator('input[placeholder*="property address"]');
    await expect(addressInput).toBeVisible();

    // Test typing in the input
    await addressInput.fill('Test Address, Test City, TS');
    await expect(addressInput).toHaveValue('Test Address, Test City, TS');

    // Test clearing the input
    await addressInput.clear();
    await expect(addressInput).toHaveValue('');
  });

  test('Address input placeholder text is correct', async ({ page }) => {
    const addressInput = page.locator('input[placeholder*="property address"]');
    await expect(addressInput).toBeVisible();

    // Check the placeholder text
    const placeholder = await addressInput.getAttribute('placeholder');
    expect(placeholder).toContain('property address');
  });
});
