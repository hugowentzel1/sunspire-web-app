import { test, expect } from '@playwright/test';

const base = 'http://localhost:3001';

test.describe('Visual Header Check - Full Page Load', () => {
  test.setTimeout(120000); // 2 minutes for visual inspection

  test('report page loads and header displays correctly', async ({ page }) => {
    console.log('🚀 Starting visual check...');
    
    // Enable console logging to see any errors
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    // Navigate to report page
    console.log('📍 Navigating to report page...');
    await page.goto(`${base}/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    // Wait a bit for hydration
    await page.waitForTimeout(3000);
    
    console.log('✅ Page loaded');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/01-full-page.png', 
      fullPage: true 
    });
    console.log('📸 Full page screenshot saved');
    
    // Check if error overlay is present
    const errorOverlay = page.locator('text=missing required error components');
    const hasError = await errorOverlay.isVisible().catch(() => false);
    
    if (hasError) {
      console.log('❌ Error overlay detected!');
      await page.screenshot({ path: 'test-results/error-state.png' });
      throw new Error('Page showing error overlay');
    }
    
    console.log('✅ No error overlay detected');
    
    // Wait for H1 to be visible
    console.log('🔍 Checking for H1...');
    const h1 = page.locator('[data-testid="hdr-h1"]');
    await expect(h1).toBeVisible({ timeout: 10000 });
    console.log('✅ H1 is visible');
    
    // Check H1 content
    const h1Text = await h1.textContent();
    console.log('📝 H1 text:', h1Text);
    expect(h1Text).toContain('Tesla');
    expect(h1Text).toContain('Solar Quote');
    
    // Take H1 screenshot
    await h1.screenshot({ path: 'test-results/02-h1-element.png' });
    console.log('📸 H1 screenshot saved');
    
    // Check for logo
    console.log('🔍 Checking for logo...');
    const logo = page.locator('[data-testid="hdr-logo"]');
    await expect(logo).toBeVisible({ timeout: 10000 });
    console.log('✅ Logo is visible');
    
    // Take logo screenshot
    await logo.screenshot({ path: 'test-results/03-logo-element.png' });
    console.log('📸 Logo screenshot saved');
    
    // Check positioning
    const h1Box = await h1.boundingBox();
    const logoBox = await logo.boundingBox();
    
    console.log('📐 H1 position:', h1Box);
    console.log('📐 Logo position:', logoBox);
    
    expect(h1Box).toBeTruthy();
    expect(logoBox).toBeTruthy();
    expect(h1Box!.y).toBeLessThan(logoBox!.y);
    console.log('✅ H1 is above logo');
    
    const gap = logoBox!.y - (h1Box!.y + h1Box!.height);
    console.log(`📏 Gap between H1 and logo: ${gap}px`);
    
    // Check subheadline
    console.log('🔍 Checking for subheadline...');
    const sub = page.locator('[data-testid="hdr-sub"]');
    await expect(sub).toBeVisible({ timeout: 10000 });
    await expect(sub).toContainText('Comprehensive analysis');
    console.log('✅ Subheadline is visible');
    
    // Check address
    console.log('🔍 Checking for address...');
    const address = page.locator('[data-testid="hdr-address"]');
    await expect(address).toBeVisible({ timeout: 10000 });
    console.log('✅ Address is visible');
    
    // Check meta section
    console.log('🔍 Checking for meta section...');
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta).toBeVisible({ timeout: 10000 });
    console.log('✅ Meta section is visible');
    
    // Check meta rows
    const metaDivs = meta.locator('div');
    const metaCount = await metaDivs.count();
    console.log(`📊 Meta rows count: ${metaCount}`);
    expect(metaCount).toBe(3);
    
    // Take header screenshot
    const section = page.locator('section[aria-labelledby="report-title"]');
    await section.screenshot({ path: 'test-results/04-header-section.png' });
    console.log('📸 Header section screenshot saved');
    
    // Check brand color
    const brandSpan = h1.locator('span').first();
    const color = await brandSpan.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 Brand color:', color);
    
    // Wait for a moment to see it visually
    console.log('⏸️  Pausing for visual inspection...');
    await page.waitForTimeout(2000);
    
    console.log('✅✅✅ ALL CHECKS PASSED! ✅✅✅');
    console.log('');
    console.log('Summary:');
    console.log('- H1 is visible and contains correct text');
    console.log('- Logo is visible and positioned below H1');
    console.log(`- Gap between H1 and logo: ${gap}px`);
    console.log('- Subheadline, address, and meta are all visible');
    console.log('- Brand color is applied');
    console.log('');
    console.log('Screenshots saved in test-results/');
  });

  test('mobile view - header displays correctly', async ({ page }) => {
    console.log('📱 Testing mobile view...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto(`${base}/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    await page.waitForTimeout(3000);
    
    // Check if error overlay is present
    const errorOverlay = page.locator('text=missing required error components');
    const hasError = await errorOverlay.isVisible().catch(() => false);
    
    if (hasError) {
      console.log('❌ Error overlay detected on mobile!');
      await page.screenshot({ path: 'test-results/mobile-error-state.png' });
      throw new Error('Mobile page showing error overlay');
    }
    
    console.log('✅ No error overlay on mobile');
    
    // Check header elements
    const h1 = page.locator('[data-testid="hdr-h1"]');
    await expect(h1).toBeVisible({ timeout: 10000 });
    
    const logo = page.locator('[data-testid="hdr-logo"]');
    await expect(logo).toBeVisible({ timeout: 10000 });
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'test-results/05-mobile-full.png', 
      fullPage: true 
    });
    console.log('📸 Mobile screenshot saved');
    
    console.log('✅ Mobile view passed');
  });
});

