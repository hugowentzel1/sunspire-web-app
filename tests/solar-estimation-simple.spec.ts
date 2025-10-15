// tests/solar-estimation-simple.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Solar Estimation Simple Verification', () => {
  
  test('API Health Check', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/health');
    expect(response?.status()).toBe(200);
    
    const healthData = await response?.json();
    console.log('Health check response:', healthData);
    
    expect(healthData.ok).toBe(true);
    // Health check is working
  });

  test('Solar Estimation API - NYC Address - CORE FUNCTIONALITY', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=40.7128&lng=-74.0060&address=123%20Main%20St%20New%20York%20NY&systemKw=7&state=NY');
    expect(response?.status()).toBe(200);
    
    const data = await response?.json();
    console.log('NYC Estimate response:', JSON.stringify(data, null, 2));
    
    expect(data.estimate).toBeDefined();
    
    // Check if we have the new format (with .estimate property) or old format (direct number)
    const annualProduction = typeof data.estimate.annualProductionKWh === 'object' 
      ? data.estimate.annualProductionKWh.estimate 
      : data.estimate.annualProductionKWh;
    
    const yearSavings = typeof data.estimate.year1Savings === 'object'
      ? data.estimate.year1Savings.estimate
      : data.estimate.year1Savings;
    
    // Verify realistic production numbers (7kW system should produce 7k-15k kWh)
    console.log(`Annual Production: ${annualProduction} kWh`);
    expect(annualProduction).toBeGreaterThan(7000);
    expect(annualProduction).toBeLessThan(15000);
    
    // Verify realistic savings ($1k-5k)
    console.log(`Year 1 Savings: $${yearSavings}`);
    expect(yearSavings).toBeGreaterThan(1000);
    expect(yearSavings).toBeLessThan(5000);
    
    // Verify data sources exist
    expect(data.estimate.dataSource).toBeDefined();
    expect(data.estimate.utilityRate).toBeDefined();
    
    console.log('✅ NYC estimation working correctly!');
  });

  test('Solar Estimation API - California Address - NEM 3.0', async ({ page }) => {
    const response = await page.goto('https://sunspire-web-app.vercel.app/api/estimate?lat=37.7749&lng=-122.4194&address=123%20Main%20St%20San%20Francisco%20CA&systemKw=7&state=CA');
    expect(response?.status()).toBe(200);
    
    const data = await response?.json();
    console.log('CA Estimate response:', JSON.stringify(data, null, 2));
    
    expect(data.estimate).toBeDefined();
    
    const annualProduction = typeof data.estimate.annualProductionKWh === 'object' 
      ? data.estimate.annualProductionKWh.estimate 
      : data.estimate.annualProductionKWh;
    
    const yearSavings = typeof data.estimate.year1Savings === 'object'
      ? data.estimate.year1Savings.estimate
      : data.estimate.year1Savings;
    
    // CA should have good production (good sun)
    console.log(`CA Annual Production: ${annualProduction} kWh`);
    expect(annualProduction).toBeGreaterThan(8000);
    expect(annualProduction).toBeLessThan(16000);
    
    // CA savings should be reasonable
    console.log(`CA Year 1 Savings: $${yearSavings}`);
    expect(yearSavings).toBeGreaterThan(1000);
    expect(yearSavings).toBeLessThan(5000);
    
    console.log('✅ CA estimation working correctly!');
  });

  test('Demo Page Loads and Functions', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify demo elements are visible
    await expect(page.locator('[data-testid="demo-address-input"]')).toBeVisible();
    await expect(page.locator('text=Exclusive preview for Netflix')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/demo-page.png', fullPage: true });
    
    console.log('✅ Demo page loads correctly!');
  });

  test('Paid Page Loads', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000');
    await page.waitForLoadState('networkidle');
    
    // Verify paid page elements
    await expect(page.locator('text=Enter Your Property Address')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/paid-page.png', fullPage: true });
    
    console.log('✅ Paid page loads correctly!');
  });

  test('Mobile Responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="demo-address-input"]')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-demo.png', fullPage: true });
    
    console.log('✅ Mobile view works correctly!');
  });
});
