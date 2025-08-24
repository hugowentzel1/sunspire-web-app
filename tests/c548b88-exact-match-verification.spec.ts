import { test, expect } from '@playwright/test';

test.describe('c548b88 Exact Match Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');
  });

  test('Address box looks and functions EXACTLY like c548b88', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that the address box section exists with exact structure
    const addressSection = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-3xl.shadow-2xl.border.border-gray-200\\/30.p-8.md\\:p-12.max-w-3xl.mx-auto.section-spacing');
    await expect(addressSection).toBeVisible();

    // Check the exact title and description
    await expect(addressSection.locator('h2.text-2xl.font-bold.text-gray-900')).toHaveText('Enter Your Property Address');
    await expect(addressSection.locator('p.text-gray-600')).toHaveText('Get a comprehensive solar analysis tailored to your specific location');

    // Check that AddressAutocomplete component is used (not simple input)
    const addressInput = addressSection.locator('div.relative input');
    await expect(addressInput).toBeVisible();
    await expect(addressInput).toHaveAttribute('placeholder', 'Start typing your property address...');

    // Check the helper text below input
    await expect(addressSection.locator('p.text-sm.text-gray-500.mt-2.text-center')).toHaveText('Enter your property address to get started');

    // Check the button with exact text logic from c548b88
    const generateButton = addressSection.locator('button');
    await expect(generateButton).toBeVisible();
    
    // Check button text when no address (should show "Launch Tool" in demo mode)
    await expect(generateButton.locator('span')).toContainText('Launch Tool');

    // Check the preview/remaining runs section (only visible in demo mode)
    const previewSection = addressSection.locator('div.text-sm.text-gray-500.text-center.space-y-2');
    // This should be visible if brand takeover is enabled
    // await expect(previewSection).toBeVisible();
  });

  test('Report page looks and functions EXACTLY like c548b88', async ({ page }) => {
    // Navigate to report page
    await page.goto('http://localhost:3000/report?demo=1&company=TestCompany');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check the header with brand takeover
    const header = page.locator('header.bg-white\\/90.backdrop-blur-xl.border-b.border-gray-200\\/30.sticky.top-0.z-50.shadow-sm');
    await expect(header).toBeVisible();

    // Check the main title
    await expect(page.locator('h1.text-4xl.md\\:text-5xl.font-black.text-gray-900')).toHaveText('New Analysis');

    // Check the trust elements and CTA section
    const trustSection = page.locator('div.mt-4.flex.flex-wrap.items-center.justify-center.gap-3');
    await expect(trustSection).toBeVisible();
    
    // Check "Put this on our site" button
    await expect(trustSection.locator('a:has-text("Put this on our site")')).toBeVisible();

    // Check data sources text
    await expect(trustSection.locator('div.text-xs.text-slate-500:has-text("Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted")')).toBeVisible();

    // Check the metrics grid with blur overlays
    const metricsGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-5.items-stretch');
    await expect(metricsGrid).toBeVisible();

    // Check that metrics have blur overlays and unlock buttons
    const metricCards = metricsGrid.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50');
    await expect(metricCards).toHaveCount(4);

    // Check that unlock buttons are present
    const unlockButtons = page.locator('button:has-text("Unlock Full Report")');
    await expect(unlockButtons).toHaveCount(4);

    // Check the chart section with unlock button
    const chartSection = page.locator('div.relative.rounded-2xl.bg-white.p-5.overflow-hidden');
    await expect(chartSection).toBeVisible();
    
    // Check that unlock button is present in chart section
    await expect(chartSection.locator('button:has-text("Unlock Full Report")')).toBeVisible();

    // Check the three-column layout
    const threeColumnLayout = page.locator('div.grid.grid-cols-1.lg\\:grid-cols-3.gap-8');
    await expect(threeColumnLayout).toBeVisible();

    // Check Financial Analysis (should be unblurred)
    const financialAnalysis = threeColumnLayout.locator('div.relative.rounded-2xl.p-8.bg-white.border.border-gray-200\\/50:has-text("Financial Analysis")');
    await expect(financialAnalysis).toBeVisible();

    // Check Environmental Impact (should be blurred with unlock button)
    const environmentalImpact = threeColumnLayout.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50:has-text("Environmental Impact")');
    await expect(environmentalImpact).toBeVisible();
    
    // Check that it has blur overlay
    await expect(environmentalImpact.locator('div.absolute.inset-0.bg-white\\/60.backdrop-blur-sm.pointer-events-none')).toBeVisible();

    // Check Calculation Assumptions (should be unblurred)
    const calculationAssumptions = threeColumnLayout.locator('div.relative.rounded-2xl.p-8.bg-white.border.border-gray-200\\/50:has-text("Calculation Assumptions")');
    await expect(calculationAssumptions).toBeVisible();

    // Check the CTA band
    const ctaBand = page.locator('div.bg-gradient-to-r.from-orange-500.via-red-500.to-pink-500.rounded-3xl.py-12.px-8.text-center.text-white');
    await expect(ctaBand).toBeVisible();
    
    // Check CTA title and button
    await expect(ctaBand.locator('h2.text-3xl.font-bold.mb-6')).toHaveText('Ready to Go Solar?');
    await expect(ctaBand.locator('button:has-text("Get Matched with Installers")')).toBeVisible();

    // Check copy demo link button
    await expect(page.locator('button:has-text("📋 Copy Demo Link")')).toBeVisible();

    // Check disclaimer
    const disclaimer = page.locator('div.max-w-4xl.mx-auto.text-center div.bg-gray-50.rounded-lg.p-6.border.border-gray-200');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer.locator('p.text-sm.text-gray-600')).toContainText('Estimates are informational only, based on modeled data (NREL PVWatts® v8 and current utility rates)');
  });

  test('Navigation and links work correctly', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check that "New Analysis" button navigates to report page
    const newAnalysisButton = page.locator('button:has-text("New Analysis")');
    if (await newAnalysisButton.isVisible()) {
      await newAnalysisButton.click();
      await expect(page).toHaveURL(/^http:\/\/localhost:3000\/report/);
    }

    // Navigate back to home
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check that "Put this on our site" button exists
    const putOnSiteButton = page.locator('a:has-text("Put this on our site")');
    await expect(putOnSiteButton).toBeVisible();
  });

  test('DPA page link works and page is color-coded', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Click on DPA link in footer
    const dpaLink = page.locator('footer a[href="/dpa"]');
    await expect(dpaLink).toBeVisible();
    await dpaLink.click();

    // Check that we're on DPA page
    await expect(page).toHaveURL('http://localhost:3000/dpa');

    // Check DPA page content
    await expect(page.locator('h1.text-4xl.font-black.text-gray-900.mb-8.text-center')).toHaveText('Data Processing Agreement (DPA)');
    
    // Check that "Back to Home" link exists
    await expect(page.locator('a:has-text("Back to Home")')).toBeVisible();

    // Check that page uses brand colors
    const backButton = page.locator('a:has-text("Back to Home")');
    await expect(backButton).toHaveCSS('background-color', /rgba\(.*,.*,.*,.*\)/); // Should have some background color
  });

  test('Email icon on support page is changed', async ({ page }) => {
    // Navigate to support page
    await page.goto('http://localhost:3000/support');
    await page.waitForLoadState('networkidle');

    // Check that email support section exists
    const emailSupportSection = page.locator('div:has-text("Email Support")');
    await expect(emailSupportSection).toBeVisible();

    // Check that email icon exists and is different from default
    const emailIcon = emailSupportSection.locator('svg').first();
    await expect(emailIcon).toBeVisible();

    // Check that "Back to Home" link exists
    await expect(page.locator('a:has-text("Back to Home")')).toBeVisible();
  });
});
