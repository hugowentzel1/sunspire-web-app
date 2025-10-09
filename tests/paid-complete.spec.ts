import { test, expect } from '@playwright/test';

const PAID_HOME = 'http://localhost:3002/paid?demo=0&company=Apple&brandColor=%23FF6B35';
const PAID_REPORT = 'http://localhost:3002/report?demo=0&company=Apple&brandColor=%23FF6B35&address=123%20Main%20St&lat=33.7490&lng=-84.3880';
const DEMO_HOME = 'http://localhost:3002/?demo=1&company=Netflix&brandColor=%23E50914';

test.describe('Paid Footer - Unified & Minimal', () => {
  test('Paid home has PaidFooter with 3 rows, no PVWatts', async ({ page }) => {
    await page.goto(PAID_HOME, { waitUntil: 'networkidle', timeout: 15000 });
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 10000 });
    
    // Row 1: Brand
    await expect(footer.locator('[data-testid="footer-brand"]')).toBeVisible();
    await expect(footer).toContainText('Apple');
    
    // Row 2: Links
    const linksRow = footer.locator('[data-testid="footer-links"]');
    await expect(linksRow).toBeVisible();
    for (const link of ['Privacy Policy', 'Terms of Service', 'Cookie Preferences', 'Accessibility', 'Contact']) {
      await expect(linksRow).toContainText(link);
    }
    
    // Row 3: Micro-attribution (Google + Sunspire ONLY, no PVWatts)
    const microRow = footer.locator('[data-testid="footer-micro"]');
    await expect(microRow).toBeVisible();
    await expect(microRow).toContainText('Mapping & location data © Google');
    await expect(microRow).toContainText('Powered by Sunspire');
    await expect(microRow).not.toContainText('PVWatts');
    await expect(microRow).not.toContainText('NREL');
    
    // No Sunspire contact info in paid footer
    await expect(footer).not.toContainText('support@getsunspire.com');
    await expect(footer).not.toContainText('billing@getsunspire.com');
    
    await page.screenshot({ path: 'test-results/paid-home-footer.png', fullPage: true });
    console.log('✓ Paid home footer verified');
  });
  
  test('Paid report has PaidFooter with same structure', async ({ page }) => {
    await page.goto(PAID_REPORT, { waitUntil: 'networkidle', timeout: 15000 });
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 10000 });
    
    // Same 3 rows
    await expect(footer.locator('[data-testid="footer-brand"]')).toBeVisible();
    await expect(footer.locator('[data-testid="footer-links"]')).toBeVisible();
    await expect(footer.locator('[data-testid="footer-micro"]')).toBeVisible();
    
    // No PVWatts in footer
    const microRow = footer.locator('[data-testid="footer-micro"]');
    await expect(microRow).not.toContainText('PVWatts');
    
    await page.screenshot({ path: 'test-results/paid-report-footer.png', fullPage: true });
    console.log('✓ Paid report footer verified');
  });
  
  test('Legal pages use PaidFooter in paid mode', async ({ page }) => {
    const legalPages = [
      '/legal/privacy',
      '/legal/terms',
      '/legal/cookies',
      '/legal/accessibility',
      '/contact'
    ];
    
    for (const pagePath of legalPages) {
      await page.goto(`http://localhost:3000${pagePath}?demo=0&company=Apple&brandColor=%23FF6B35`, {
        waitUntil: 'networkidle',
        timeout: 15000
      });
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible({ timeout: 10000 });
      
      // Should have PaidFooter structure
      await expect(footer.locator('[data-testid="footer-brand"]')).toBeVisible();
      await expect(footer.locator('[data-testid="footer-micro"]')).toBeVisible();
      
      // No Sunspire contact in paid mode
      await expect(footer).not.toContainText('support@getsunspire.com');
    }
    
    console.log('✓ All legal pages use PaidFooter in paid mode');
  });
});

test.describe('Report Page Attribution & CTAs', () => {
  test('Report has ONE data sources line with PVWatts, not in footer', async ({ page }) => {
    await page.goto(PAID_REPORT, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Should have one data sources line in report content
    const dataSourcesLine = page.locator('[data-testid="report-data-sources"]');
    await expect(dataSourcesLine).toBeVisible({ timeout: 10000 });
    await expect(dataSourcesLine).toContainText('NREL PVWatts® v8');
    await expect(dataSourcesLine).toContainText('U.S. EIA');
    await expect(dataSourcesLine).toContainText('Google Maps');
    
    // Count all "Data sources" mentions on page
    const allDataSources = await page.locator('text=/Data sources:/i').count();
    expect(allDataSources).toBe(1);
    
    // Footer should NOT have PVWatts
    const footer = page.locator('footer');
    await expect(footer).not.toContainText('PVWatts');
    
    console.log('✓ Report has exactly one data sources line, footer clean');
  });
  
  test('Report CTA hierarchy correct', async ({ page }) => {
    await page.goto(PAID_REPORT, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Bottom CTA block exists
    const bottomCta = page.locator('[data-testid="report-bottom-cta"]');
    await expect(bottomCta).toBeVisible({ timeout: 10000 });
    
    // Has primary and secondary
    await expect(page.locator('[data-testid="cta-book"]')).toBeVisible();
    await expect(page.locator('[data-testid="cta-talk"]')).toBeVisible();
    
    // Has utilities
    await expect(bottomCta.getByText(/Download PDF/i)).toBeVisible();
    await expect(bottomCta.getByText(/Copy Share Link/i)).toBeVisible();
    
    // Has reassurance line
    await expect(bottomCta).toContainText('no obligation');
    
    await page.screenshot({ path: 'test-results/paid-report-cta.png', fullPage: true });
    console.log('✓ Report CTA hierarchy verified');
  });
});

test.describe('Demo Mode Unchanged', () => {
  test('Demo mode still shows full Footer with Sunspire contact', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle', timeout: 15000 });
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 10000 });
    
    // Demo should have full footer with Sunspire info
    await expect(footer).toContainText('Sunspire Solar Intelligence');
    await expect(footer).toContainText('support@getsunspire.com');
    await expect(footer).toContainText('Pricing');
    await expect(footer).toContainText('Partners');
    await expect(footer).toContainText('Support');
    
    // Should NOT have the minimal PaidFooter testids
    await expect(footer.locator('[data-testid="footer-brand"]')).toHaveCount(0);
    
    console.log('✓ Demo footer unchanged');
  });
});

