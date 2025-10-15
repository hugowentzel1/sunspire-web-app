// tests/solar-estimation-visual-verification.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Solar Estimation Visual Verification', () => {
  
  test('NYC Address - Standard Net Metering', async ({ page }) => {
    // Test New York address (standard net metering)
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Enter NYC address
    await page.fill('[data-testid="demo-address-input"]', '123 Main St, New York, NY');
    await page.waitForTimeout(1000); // Wait for autocomplete
    
    // Click generate button
    await page.click('[data-cta-button]');
    
    // Wait for report to load
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Verify industry-standard badges
    await expect(page.locator('text=⚡ NREL PVWatts v8')).toBeVisible();
    await expect(page.locator('text=💰')).toBeVisible(); // Tariff badge
    await expect(page.locator('text=☀️ Shading:')).toBeVisible();
    
    // Verify NO California NEM 3.0 badge for NY
    await expect(page.locator('text=🏛️ Net Billing (NEM 3.0)')).not.toBeVisible();
    
    // Verify realistic production numbers (7kW system should produce 7k-15k kWh)
    const productionText = await page.locator('text=/\\d+,\\d+ kWh/').first().textContent();
    const productionNumber = parseInt(productionText?.replace(/[,\s]/g, '') || '0');
    expect(productionNumber).toBeGreaterThan(7000);
    expect(productionNumber).toBeLessThan(15000);
    
    // Verify realistic savings (should be $1k-5k)
    const savingsText = await page.locator('text=/\\$\\d+,\\d+/').first().textContent();
    const savingsNumber = parseInt(savingsText?.replace(/[$,]/g, '') || '0');
    expect(savingsNumber).toBeGreaterThan(1000);
    expect(savingsNumber).toBeLessThan(5000);
    
    // Verify data source transparency
    await expect(page.locator('text=Modeled with NREL PVWatts v8 (2020 TMY)')).toBeVisible();
    await expect(page.locator('text=NSRDB 2020 TMY')).toBeVisible();
    
    // Verify uncertainty ranges are displayed
    await expect(page.locator('text=/±\\d+%/')).toBeVisible();
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/nyc-estimation.png', fullPage: true });
  });

  test('San Francisco Address - California NEM 3.0', async ({ page }) => {
    // Test California address (NEM 3.0)
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&demo=1');
    
    await page.waitForLoadState('networkidle');
    
    // Enter SF address
    await page.fill('[data-testid="demo-address-input"]', '123 Main St, San Francisco, CA');
    await page.waitForTimeout(1000);
    
    await page.click('[data-cta-button]');
    
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Verify California NEM 3.0 badge
    await expect(page.locator('text=🏛️ Net Billing (NEM 3.0)')).toBeVisible();
    await expect(page.locator('text=exports credited at avoided-cost rates')).toBeVisible();
    
    // Verify all industry-standard badges
    await expect(page.locator('text=⚡ NREL PVWatts v8')).toBeVisible();
    await expect(page.locator('text=☀️ Shading:')).toBeVisible();
    
    // Verify realistic production (CA should have good sun)
    const productionText = await page.locator('text=/\\d+,\\d+ kWh/').first().textContent();
    const productionNumber = parseInt(productionText?.replace(/[,\s]/g, '') || '0');
    expect(productionNumber).toBeGreaterThan(8000);
    expect(productionNumber).toBeLessThan(16000);
    
    // Verify CA savings are lower than NY due to NEM 3.0
    const savingsText = await page.locator('text=/\\$\\d+,\\d+/').first().textContent();
    const savingsNumber = parseInt(savingsText?.replace(/[$,]/g, '') || '0');
    expect(savingsNumber).toBeGreaterThan(1000);
    expect(savingsNumber).toBeLessThan(4000);
    
    // Verify Remote shading for SF (major city)
    await expect(page.locator('text=Remote (LiDAR/DEM)')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/sf-estimation.png', fullPage: true });
  });

  test('Rural Address - Proxy Shading', async ({ page }) => {
    // Test rural address (should use proxy shading)
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    
    await page.waitForLoadState('networkidle');
    
    // Enter rural Montana address
    await page.fill('[data-testid="demo-address-input"]', '123 Main St, Billings, MT');
    await page.waitForTimeout(1000);
    
    await page.click('[data-cta-button]');
    
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Verify proxy shading is used
    await expect(page.locator('text=☀️ Shading: Proxy')).toBeVisible();
    
    // Verify NO California badge
    await expect(page.locator('text=🏛️ Net Billing (NEM 3.0)')).not.toBeVisible();
    
    // Verify all standard badges
    await expect(page.locator('text=⚡ NREL PVWatts v8')).toBeVisible();
    await expect(page.locator('text=💰')).toBeVisible();
    
    // Verify realistic numbers
    const productionText = await page.locator('text=/\\d+,\\d+ kWh/').first().textContent();
    const productionNumber = parseInt(productionText?.replace(/[,\s]/g, '') || '0');
    expect(productionNumber).toBeGreaterThan(6000);
    expect(productionNumber).toBeLessThan(14000);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/rural-estimation.png', fullPage: true });
  });

  test('API Health Check', async ({ page }) => {
    // Test health endpoint
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/health');
    expect(response?.status()).toBe(200);
    
    const healthData = await response?.json();
    expect(healthData.ok).toBe(true);
    expect(healthData.apis.nrel).toBe(true);
    expect(healthData.apis.openei).toBe(true);
    expect(healthData.apis.airtable).toBe(true);
    expect(healthData.apis.stripe).toBe(true);
  });

  test('Rate Limiting Verification', async ({ page }) => {
    // Test rate limiting by making many requests
    const responses = [];
    
    for (let i = 0; i < 5; i++) {
      const response = await page.goto(`https://sunspire-web-app.vercel.app/api/estimate?lat=40.7128&lng=-74.0060&address=Test${i}&systemKw=7&state=NY`);
      responses.push(response);
    }
    
    // All should succeed (within rate limit)
    for (const response of responses) {
      expect(response?.status()).toBe(200);
    }
  });

  test('Demo Quota System', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // First run
    await page.fill('[data-testid="demo-address-input"]', '123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    await page.click('[data-cta-button]');
    await page.waitForURL('**/report**');
    
    // Go back for second run
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    await page.fill('[data-testid="demo-address-input"]', '456 Oak St, Boston, MA');
    await page.waitForTimeout(1000);
    await page.click('[data-cta-button]');
    await page.waitForURL('**/report**');
    
    // Go back for third run (should trigger quota limit)
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    await page.fill('[data-testid="demo-address-input"]', '789 Pine St, Seattle, WA');
    await page.waitForTimeout(1000);
    await page.click('[data-cta-button]');
    
    // Should show demo limit reached
    await expect(page.locator('text=🚫 Demo limit reached')).toBeVisible();
    await expect(page.locator('text=Launch to get full access')).toBeVisible();
  });

  test('Cron Job Endpoints', async ({ page }) => {
    // Test PVWatts precompute endpoint
    const pvResponse = await page.goto('https://sunspire-web-app.vercel.app/api/cron/precompute-pvwatts');
    expect(pvResponse?.status()).toBe(200);
    
    const pvData = await pvResponse?.json();
    expect(pvData.success).toBe(true);
    expect(pvData.precomputed).toBeGreaterThan(0);
    
    // Test rate refresh endpoint
    const rateResponse = await page.goto('https://sunspire-web-app.vercel.app/api/cron/refresh-rates');
    expect(rateResponse?.status()).toBe(200);
    
    const rateData = await rateResponse?.json();
    expect(rateData.success).toBe(true);
    expect(rateData.refreshed).toBeGreaterThan(0);
  });

  test('Error Handling', async ({ page }) => {
    // Test invalid coordinates
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=999&lng=999&address=Invalid&systemKw=7&state=NY');
    expect(response?.status()).toBe(400);
    
    const errorData = await response?.json();
    expect(errorData.error).toContain('Invalid');
  });

  test('Mobile Responsiveness', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="demo-address-input"]')).toBeVisible();
    await expect(page.locator('[data-cta-button]')).toBeVisible();
    
    // Test mobile report
    await page.fill('[data-testid="demo-address-input"]', '123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    await page.click('[data-cta-button]');
    await page.waitForURL('**/report**');
    
    // Verify mobile report layout
    await expect(page.locator('text=⚡ NREL PVWatts v8')).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/mobile-estimation.png', fullPage: true });
  });

  test('Brand Customization', async ({ page }) => {
    // Test different brand colors
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&brandColor=%23FF0000&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify brand colors are applied
    const brandElement = page.locator('[style*="--brand-primary"]');
    await expect(brandElement).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/brand-customization.png', fullPage: true });
  });
});
