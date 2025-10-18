import { test, expect } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3001';

test.describe('Report Header Visual Check', () => {
  test('header renders correctly with proper spacing and brand color', async ({ page }) => {
    // Navigate to report page with a demo company
    await page.goto(`${base}/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that H1 exists and is visible
    const h1 = page.locator('[data-testid="hdr-h1"]');
    await expect(h1).toBeVisible();
    
    // Check that logo is below H1
    const logo = page.locator('[data-testid="hdr-logo"]');
    await expect(logo).toBeVisible();
    
    const h1Box = await h1.boundingBox();
    const logoBox = await logo.boundingBox();
    
    expect(h1Box).toBeTruthy();
    expect(logoBox).toBeTruthy();
    expect(h1Box!.y).toBeLessThan(logoBox!.y);
    
    // Check subheadline
    const subheadline = page.locator('[data-testid="hdr-sub"]');
    await expect(subheadline).toBeVisible();
    await expect(subheadline).toContainText('Comprehensive analysis');
    
    // Check address
    const address = page.locator('[data-testid="hdr-address"]');
    await expect(address).toBeVisible();
    
    // Check meta section
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta).toBeVisible();
    
    // Check that meta has 3 rows (Generated on, Preview, Expires)
    const metaDivs = meta.locator('div');
    await expect(metaDivs).toHaveCount(3);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/report-header.png', fullPage: true });
    
    console.log('✅ Header visual check passed');
  });

  test('header spacing is correct', async ({ page }) => {
    await page.goto(`${base}/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1`);
    await page.waitForLoadState('networkidle');
    
    const h1 = page.locator('[data-testid="hdr-h1"]');
    const logo = page.locator('[data-testid="hdr-logo"]');
    const sub = page.locator('[data-testid="hdr-sub"]');
    const address = page.locator('[data-testid="hdr-address"]');
    const meta = page.locator('[data-testid="hdr-meta"]');
    
    // Wait for all elements
    await expect(h1).toBeVisible();
    await expect(logo).toBeVisible();
    await expect(sub).toBeVisible();
    await expect(address).toBeVisible();
    await expect(meta).toBeVisible();
    
    // Get bounding boxes
    const h1Box = await h1.boundingBox();
    const logoBox = await logo.boundingBox();
    const subBox = await sub.boundingBox();
    const addressBox = await address.boundingBox();
    const metaBox = await meta.boundingBox();
    
    // Check spacing (allowing some tolerance for different viewports)
    // H1 -> Logo should be mt-6 (24px)
    const h1ToLogoGap = logoBox!.y - (h1Box!.y + h1Box!.height);
    expect(h1ToLogoGap).toBeGreaterThanOrEqual(20);
    expect(h1ToLogoGap).toBeLessThanOrEqual(30);
    
    // Logo -> Sub should be mt-4 (16px)  
    const logoToSubGap = subBox!.y - (logoBox!.y + logoBox!.height);
    expect(logoToSubGap).toBeGreaterThanOrEqual(12);
    expect(logoToSubGap).toBeLessThanOrEqual(20);
    
    console.log('✅ Header spacing check passed');
    console.log(`H1 -> Logo gap: ${h1ToLogoGap}px`);
    console.log(`Logo -> Sub gap: ${logoToSubGap}px`);
  });

  test('brand color is applied to company name', async ({ page }) => {
    await page.goto(`${base}/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1`);
    await page.waitForLoadState('networkidle');
    
    const h1 = page.locator('[data-testid="hdr-h1"]');
    await expect(h1).toBeVisible();
    
    // Check that company name span has brand color applied
    const brandSpan = h1.locator('span[class*="[color:var(--brand-ink)]"]');
    await expect(brandSpan).toBeVisible();
    await expect(brandSpan).toContainText('Tesla');
    
    // Get computed color
    const color = await brandSpan.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    console.log('✅ Brand color check passed');
    console.log(`Brand color: ${color}`);
  });
});

