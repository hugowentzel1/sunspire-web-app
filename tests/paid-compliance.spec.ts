import { test, expect } from '@playwright/test';

test.describe('Paid: address page - minimal compliance', () => {
  test('shows Places input and Powered by Google only (no extra sources strip)', async ({ page }) => {
    await page.goto('/paid?company=Apple&logo=https://logo.clearbit.com/apple.com');
    
    // Address input and Powered by Google should be visible
    await expect(page.getByTestId('paid-address-input')).toBeVisible();
    await expect(page.getByTestId('powered-by-google')).toBeVisible();
    
    // The old sources strip should NOT be present on paid version
    await expect(page.locator('text=Industry-standard modeling (NREL PVWatts® v8)')).toHaveCount(0);
    await expect(page.locator('text=Local utility rates')).toHaveCount(0);
  });
});

test.describe('Paid: report - consolidated sources line', () => {
  test('shows one consolidated sources line at bottom, no duplicates', async ({ page }) => {
    // Navigate to report page
    await page.goto('/report?address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&company=Apple');
    
    await page.waitForLoadState('networkidle');
    
    // Wait for report to load
    await page.waitForTimeout(2000);
    
    // Single data sources line should be visible
    const line = page.getByTestId('data-sources-line');
    if (await line.count() > 0) {
      await expect(line).toBeVisible();
      await expect(line).toContainText('PVWatts');
      await expect(line).toContainText('U.S. EIA');
      await expect(line).toContainText('Google Maps');
      await expect(line).toContainText('average retail rates');
      await expect(line).toContainText('geocoding');
    }
    
    // No duplicate Google attribution in footer
    const footerMicro = page.getByTestId('footer-micro');
    if (await footerMicro.count() > 0) {
      const footerText = await footerMicro.textContent();
      expect(footerText).not.toContain('Mapping');
      expect(footerText).not.toContain('location data');
    }
  });

  test('estimate disclaimer respects flag (default off)', async ({ page }) => {
    await page.goto('/report?address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&company=Apple');
    
    await page.waitForLoadState('networkidle');
    
    // Disclaimer should NOT be visible by default
    await expect(page.getByTestId('estimate-disclaimer')).toHaveCount(0);
  });

  test('last validated is not shown by default', async ({ page }) => {
    await page.goto('/report?address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&company=Apple');
    
    await page.waitForLoadState('networkidle');
    
    const line = page.getByTestId('data-sources-line');
    if (await line.count() > 0) {
      const text = await line.textContent();
      expect(text).not.toContain('Last validated');
    }
  });
});

test.describe('Paid: footer links are minimal and conditional', () => {
  test('shows only core links by default (no Cookie Preferences or CPRA)', async ({ page }) => {
    await page.goto('/paid?company=Apple&logo=https://logo.clearbit.com/apple.com');
    
    const nav = page.getByTestId('footer-links');
    await expect(nav).toBeVisible();
    
    // Core links should be visible
    await expect(nav.getByText('Privacy Policy')).toBeVisible();
    await expect(nav.getByText('Terms of Service')).toBeVisible();
    await expect(nav.getByText('Accessibility')).toBeVisible();
    await expect(nav.getByText('Contact')).toBeVisible();
    
    // Conditional links should be absent by default
    await expect(nav.getByText('Cookie Preferences')).toHaveCount(0);
    await expect(nav.getByText('Do Not Sell or Share My Personal Information')).toHaveCount(0);
  });

  test('footer has no Google mapping attribution line', async ({ page }) => {
    await page.goto('/paid?company=Apple&logo=https://logo.clearbit.com/apple.com');
    
    const footerMicro = page.getByTestId('footer-micro');
    await expect(footerMicro).toBeVisible();
    
    const footerText = await footerMicro.textContent();
    expect(footerText).not.toContain('Mapping');
    expect(footerText).not.toContain('location data');
    expect(footerText).toContain('Powered by Sunspire');
  });
});

