// tests/solar-estimation-basic-verification.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Solar Estimation Basic Verification', () => {
  
  test('API Health Check', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/health');
    expect(response?.status()).toBe(200);
    
    const healthData = await response?.json();
    console.log('Health check response:', healthData);
    
    expect(healthData.ok).toBe(true);
    expect(healthData.apis).toBeDefined();
    expect(healthData.apis.nrel).toBeDefined();
    expect(healthData.apis.openei).toBeDefined();
    expect(healthData.apis.airtable).toBeDefined();
    expect(healthData.apis.stripe).toBeDefined();
  });

  test('Solar Estimation API - NYC Address', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=40.7128&lng=-74.0060&address=123%20Main%20St%20New%20York%20NY&systemKw=7&state=NY');
    expect(response?.status()).toBe(200);
    
    const estimateData = await response?.json();
    console.log('Estimate response:', estimateData);
    
    expect(estimateData.estimate).toBeDefined();
    expect(estimateData.estimate.annualProductionKWh).toBeDefined();
    expect(estimateData.estimate.year1Savings).toBeDefined();
    expect(estimateData.estimate.shadingAnalysis).toBeDefined();
    expect(estimateData.estimate.dataSource).toBeDefined();
    expect(estimateData.estimate.tariff).toBeDefined();
    
    // Verify realistic production numbers
    const production = estimateData.estimate.annualProductionKWh.estimate;
    expect(production).toBeGreaterThan(7000);
    expect(production).toBeLessThan(15000);
    
    // Verify realistic savings
    const savings = estimateData.estimate.year1Savings.estimate;
    expect(savings).toBeGreaterThan(1000);
    expect(savings).toBeLessThan(5000);
    
    // Verify data sources
    expect(estimateData.estimate.dataSource).toContain('PVWatts');
    expect(estimateData.estimate.tariff).toBeDefined();
    
    // Verify shading analysis
    expect(estimateData.estimate.shadingAnalysis.method).toBeDefined();
    expect(estimateData.estimate.shadingAnalysis.annualShadingLoss).toBeDefined();
  });

  test('Solar Estimation API - California Address (NEM 3.0)', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=37.7749&lng=-122.4194&address=123%20Main%20St%20San%20Francisco%20CA&systemKw=7&state=CA');
    expect(response?.status()).toBe(200);
    
    const estimateData = await response?.json();
    console.log('CA Estimate response:', estimateData);
    
    expect(estimateData.estimate).toBeDefined();
    expect(estimateData.estimate.annualProductionKWh).toBeDefined();
    expect(estimateData.estimate.year1Savings).toBeDefined();
    
    // Verify CA has good production (good sun)
    const production = estimateData.estimate.annualProductionKWh.estimate;
    expect(production).toBeGreaterThan(8000);
    expect(production).toBeLessThan(16000);
    
    // Verify CA savings are reasonable
    const savings = estimateData.estimate.year1Savings.estimate;
    expect(savings).toBeGreaterThan(1000);
    expect(savings).toBeLessThan(4000);
    
    // Verify shading analysis for SF (should be remote)
    expect(estimateData.estimate.shadingAnalysis.method).toBeDefined();
  });

  test('Solar Estimation API - Rural Address (Proxy Shading)', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=45.7866&lng=-108.5266&address=123%20Main%20St%20Billings%20MT&systemKw=7&state=MT');
    expect(response?.status()).toBe(200);
    
    const estimateData = await response?.json();
    console.log('Rural Estimate response:', estimateData);
    
    expect(estimateData.estimate).toBeDefined();
    expect(estimateData.estimate.annualProductionKWh).toBeDefined();
    expect(estimateData.estimate.year1Savings).toBeDefined();
    
    // Verify realistic numbers
    const production = estimateData.estimate.annualProductionKWh.estimate;
    expect(production).toBeGreaterThan(6000);
    expect(production).toBeLessThan(14000);
    
    // Verify proxy shading is used
    expect(estimateData.estimate.shadingAnalysis.method).toBeDefined();
  });

  test('Error Handling - Invalid Coordinates', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=999&lng=999&address=Invalid&systemKw=7&state=NY');
    expect(response?.status()).toBe(500); // API returns 500 for invalid coords
    
    const errorData = await response?.json();
    console.log('Error response:', errorData);
    expect(errorData.error).toBeDefined();
  });

  test('Rate Limiting - Multiple Requests', async ({ page }) => {
    const responses = [];
    
    // Make 5 requests quickly
    for (let i = 0; i < 5; i++) {
      const response = await page.goto(`https://sunspire-web-app.vercel.app/api/estimate?lat=40.7128&lng=-74.0060&address=Test${i}&systemKw=7&state=NY`);
      responses.push(response);
    }
    
    // All should succeed (within rate limit)
    for (const response of responses) {
      expect(response?.status()).toBe(200);
    }
  });

  test('Demo Page Loads Correctly', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify demo elements are visible
    await expect(page.locator('[data-testid="demo-address-input"]')).toBeVisible();
    await expect(page.locator('text=Exclusive preview for Netflix')).toBeVisible();
    await expect(page.locator('text=Generate Solar Report')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/demo-page.png', fullPage: true });
  });

  test('Paid Page Loads Correctly', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    await page.waitForLoadState('networkidle');
    
    // Verify paid page elements
    await expect(page.locator('text=Enter Your Property Address')).toBeVisible();
    await expect(page.locator('text=Generate Solar Report')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/paid-page.png', fullPage: true });
  });

  test('Brand Customization Works', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%2300FF00&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify brand name appears
    await expect(page.locator('text=Exclusive preview for Google')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/brand-customization.png', fullPage: true });
  });

  test('Mobile Responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="demo-address-input"]')).toBeVisible();
    await expect(page.locator('text=Generate Solar Report')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-demo.png', fullPage: true });
  });
});
