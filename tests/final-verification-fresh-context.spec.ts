import { test, expect } from '@playwright/test';

test.describe('Final Comprehensive Verification - Fresh Browser Context', () => {
  const LIVE_URL = 'https://sunspire-web-app.vercel.app';
  const LOCALHOST_URL = 'http://localhost:3000';

  test('Localhost Demo - California should show 12,286 kWh (NOT 11,105)', async ({ browser }) => {
    const context = await browser.newContext({ 
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    console.log('\n🏠 Testing LOCALHOST DEMO - California\n');
    
    await page.goto(`${LOCALHOST_URL}/?company=testcompany&demo=1`);
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('[data-testid="demo-address-input"]');
    await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
    await page.waitForTimeout(2000);
    
    const suggestion = page.locator('.pac-item').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
      await page.waitForTimeout(500);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const generateBtn = page.getByRole('button', { name: /Generate Solar Report/i });
    await generateBtn.click();
    
    await page.waitForURL('**/report**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const productionElement = page.locator('[data-testid="tile-annualProduction"]');
    const productionText = await productionElement.textContent();
    console.log(`📊 Production text: "${productionText}"`);
    
    const productionMatch = productionText?.match(/(\d{1,2},\d{3})/);
    expect(productionMatch).toBeDefined();
    const productionValue = parseInt(productionMatch![1].replace(',', ''));
    console.log(`🔢 Production value: ${productionValue} kWh`);
    
    expect(productionValue).not.toBe(11105);
    expect(productionValue).toBeGreaterThan(11000);
    expect(productionValue).toBeLessThan(13500);
    
    console.log(`✅ Localhost Demo CA: ${productionValue} kWh (expected ~12,286)`);
    
    await context.close();
  });

  test('Localhost Demo - New York should show 9,382 kWh (different from CA)', async ({ browser }) => {
    const context = await browser.newContext({ 
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    console.log('\n🏠 Testing LOCALHOST DEMO - New York\n');
    
    await page.goto(`${LOCALHOST_URL}/?company=testcompany&demo=1`);
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('[data-testid="demo-address-input"]');
    await addressInput.fill('350 5th Ave, New York, NY');
    await page.waitForTimeout(2000);
    
    const suggestion = page.locator('.pac-item').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
      await page.waitForTimeout(500);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const generateBtn = page.getByRole('button', { name: /Generate Solar Report/i });
    await generateBtn.click();
    
    await page.waitForURL('**/report**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const productionElement = page.locator('[data-testid="tile-annualProduction"]');
    const productionText = await productionElement.textContent();
    console.log(`📊 Production text: "${productionText}"`);
    
    const productionMatch = productionText?.match(/(\d{1,2},\d{3})/);
    expect(productionMatch).toBeDefined();
    const productionValue = parseInt(productionMatch![1].replace(',', ''));
    console.log(`🔢 Production value: ${productionValue} kWh`);
    
    expect(productionValue).not.toBe(11105);
    expect(productionValue).toBeGreaterThan(8000);
    expect(productionValue).toBeLessThan(10500);
    
    console.log(`✅ Localhost Demo NY: ${productionValue} kWh (expected ~9,382)`);
    
    await context.close();
  });

  test('Live Demo - California should show real data (NOT 11,105)', async ({ browser }) => {
    const context = await browser.newContext({ 
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    console.log('\n🌐 Testing LIVE DEMO - California\n');
    
    await page.goto(`${LIVE_URL}/?company=testcompany&demo=1&_nocache=${Date.now()}`);
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('[data-testid="demo-address-input"]');
    await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
    await page.waitForTimeout(2000);
    
    const suggestion = page.locator('.pac-item').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
      await page.waitForTimeout(500);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const generateBtn = page.getByRole('button', { name: /Generate Solar Report/i });
    await generateBtn.click();
    
    await page.waitForURL('**/report**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const productionElement = page.locator('[data-testid="tile-annualProduction"]');
    const productionText = await productionElement.textContent();
    console.log(`📊 Production text: "${productionText}"`);
    
    const productionMatch = productionText?.match(/(\d{1,2},\d{3})/);
    expect(productionMatch).toBeDefined();
    const productionValue = parseInt(productionMatch![1].replace(',', ''));
    console.log(`🔢 Production value: ${productionValue} kWh`);
    
    expect(productionValue).not.toBe(11105);
    console.log(`✅ Live Demo CA: ${productionValue} kWh (NOT fallback 11,105)`);
    
    await context.close();
  });

  test('Live Paid - California should show real data (NOT 11,105)', async ({ browser }) => {
    const context = await browser.newContext({ 
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    console.log('\n🌐 Testing LIVE PAID - California\n');
    
    await page.goto(`${LIVE_URL}/paid?company=Apple&brandColor=%23FF0000&_nocache=${Date.now()}`);
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('input[type="text"]').first();
    await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
    await page.waitForTimeout(2000);
    
    const suggestion = page.locator('.pac-item').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
      await page.waitForTimeout(500);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const generateBtn = page.getByRole('button', { name: /Generate Solar Report/i });
    await generateBtn.click();
    
    await page.waitForURL('**/report**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const productionElement = page.locator('[data-testid="tile-annualProduction"]');
    const productionText = await productionElement.textContent();
    console.log(`📊 Production text: "${productionText}"`);
    
    const productionMatch = productionText?.match(/(\d{1,2},\d{3})/);
    expect(productionMatch).toBeDefined();
    const productionValue = parseInt(productionMatch![1].replace(',', ''));
    console.log(`🔢 Production value: ${productionValue} kWh`);
    
    expect(productionValue).not.toBe(11105);
    
    const savingsElement = page.locator('[data-testid="tile-large"]');
    const savingsText = await savingsElement.textContent();
    const savingsMatch = savingsText?.match(/\$(\d{1,2},\d{3})/);
    if (savingsMatch) {
      const savingsValue = parseInt(savingsMatch[1].replace(',', ''));
      console.log(`💰 Savings: $${savingsValue}`);
      expect(savingsValue).toBeGreaterThan(1000);
    }
    
    console.log(`✅ Live Paid CA: ${productionValue} kWh (NOT fallback 11,105)`);
    
    await context.close();
  });
});

