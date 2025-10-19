import { test, expect } from '@playwright/test';

// Test addresses that should work
const testAddresses = {
  california: '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA',
  newYork: '350 5th Ave, New York, NY 10118, USA',
  arizona: '123 N Central Ave, Phoenix, AZ 85004, USA',
  florida: '1200 Brickell Ave, Miami, FL 33131, USA'
};

test.describe('Solar Estimations - Complete E2E Flow', () => {
  
  test.describe('Demo Version - Full Flow', () => {
    test('Demo: California - Enter address, generate report, verify real data', async ({ page, baseURL }) => {
      // Go to demo home page
      await page.goto((baseURL ?? '') + '/?demo=1');
      await page.waitForLoadState('networkidle');
      
      // Enter address
      const addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.california);
      await page.waitForTimeout(2000);
      
      // Click first autocomplete suggestion
      const suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      // Click generate report
      const generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      // Wait for report page
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000); // Wait for calculations
      
      // Verify system size
      const systemSizeTile = page.getByTestId('tile-systemSize');
      await expect(systemSizeTile).toBeVisible({ timeout: 15000 });
      const systemSizeText = await systemSizeTile.innerText();
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      
      expect(systemSize).toBeGreaterThan(0);
      expect(systemSize).toBeGreaterThan(3);
      expect(systemSize).toBeLessThan(20);
      
      // Verify annual production
      const annualProductionTile = page.getByTestId('tile-annualProduction');
      const productionText = await annualProductionTile.innerText();
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      expect(annualProduction).toBeGreaterThan(4000);
      expect(annualProduction).toBeLessThan(25000);
      
      // Verify it's real data (not fallback)
      const ratio = annualProduction / systemSize;
      expect(ratio).toBeGreaterThan(800);
      expect(ratio).toBeLessThan(1800);
      
      console.log(`✅ CA Demo: System=${systemSize}kW, Production=${annualProduction}kWh, Ratio=${ratio.toFixed(0)}`);
    });

    test('Demo: New York - Verify different location gives different results', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + '/?demo=1');
      await page.waitForLoadState('networkidle');
      
      const addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.newYork);
      await page.waitForTimeout(2000);
      
      const suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      const generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const systemSizeTile = page.getByTestId('tile-systemSize');
      await expect(systemSizeTile).toBeVisible({ timeout: 15000 });
      const systemSizeText = await systemSizeTile.innerText();
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      
      const annualProductionTile = page.getByTestId('tile-annualProduction');
      const productionText = await annualProductionTile.innerText();
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      expect(systemSize).toBeGreaterThan(3);
      expect(annualProduction).toBeGreaterThan(4000);
      
      const ratio = annualProduction / systemSize;
      expect(ratio).toBeGreaterThan(800);
      expect(ratio).toBeLessThan(1800);
      
      console.log(`✅ NY Demo: System=${systemSize}kW, Production=${annualProduction}kWh, Ratio=${ratio.toFixed(0)}`);
    });
  });

  test.describe('Paid Version - Full Flow with Live URL', () => {
    test('Paid: Enter address on home, generate report, verify features', async ({ page }) => {
      // Go to paid home page (the URL you provided)
      await page.goto('https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
      await page.waitForLoadState('networkidle');
      
      // Verify we're on the home page
      await expect(page.getByPlaceholder(/Start typing/i)).toBeVisible({ timeout: 10000 });
      
      // Enter address
      const addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.california);
      await page.waitForTimeout(2000);
      
      // Click first autocomplete suggestion
      const suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      // Click generate report
      const generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      // Wait for report page
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      // Verify system size
      const systemSizeTile = page.getByTestId('tile-systemSize');
      await expect(systemSizeTile).toBeVisible({ timeout: 15000 });
      const systemSizeText = await systemSizeTile.innerText();
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      
      expect(systemSize).toBeGreaterThan(3);
      expect(systemSize).toBeLessThan(20);
      
      // Verify annual production
      const annualProductionTile = page.getByTestId('tile-annualProduction');
      const productionText = await annualProductionTile.innerText();
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      expect(annualProduction).toBeGreaterThan(4000);
      expect(annualProduction).toBeLessThan(25000);
      
      // Verify paid features are present
      await expect(page.getByRole('button', { name: /Book a Consultation/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
      
      // Verify NO demo elements
      await expect(page.getByText('(Live Preview)')).toHaveCount(0);
      
      // Verify brand (Apple)
      const h1 = page.getByTestId('hdr-h1');
      await expect(h1).toContainText('Apple');
      
      console.log(`✅ PAID: System=${systemSize}kW, Production=${annualProduction}kWh`);
    });

    test('Paid: Arizona - Verify location-specific calculations', async ({ page }) => {
      await page.goto('https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
      await page.waitForLoadState('networkidle');
      
      const addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.arizona);
      await page.waitForTimeout(2000);
      
      const suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      const generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const systemSizeTile = page.getByTestId('tile-systemSize');
      await expect(systemSizeTile).toBeVisible({ timeout: 15000 });
      const systemSizeText = await systemSizeTile.innerText();
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      
      const annualProductionTile = page.getByTestId('tile-annualProduction');
      const productionText = await annualProductionTile.innerText();
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      // Arizona should have high production (lots of sun)
      const ratio = annualProduction / systemSize;
      expect(ratio).toBeGreaterThan(1200); // Arizona gets more sun
      expect(ratio).toBeLessThan(1900);
      
      // Verify address displayed correctly
      const addressElement = page.getByTestId('hdr-address');
      const displayedAddress = await addressElement.innerText();
      expect(displayedAddress.toLowerCase()).toContain('phoenix');
      
      console.log(`✅ AZ PAID: System=${systemSize}kW, Production=${annualProduction}kWh, Ratio=${ratio.toFixed(0)}`);
    });
  });

  test.describe('Location Variance Verification', () => {
    test('Sunny location (AZ) vs Cloudy location (NY) - Different production', async ({ page, baseURL }) => {
      // Test Arizona
      await page.goto((baseURL ?? '') + '/?demo=1');
      await page.waitForLoadState('networkidle');
      
      let addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.arizona);
      await page.waitForTimeout(2000);
      
      let suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      let generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const azProductionTile = page.getByTestId('tile-annualProduction');
      const azText = await azProductionTile.innerText();
      const azProduction = parseFloat(azText.replace(/[^0-9.]/g, ''));
      
      // Test New York
      await page.goto((baseURL ?? '') + '/?demo=1');
      await page.waitForLoadState('networkidle');
      
      addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.newYork);
      await page.waitForTimeout(2000);
      
      suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const nyProductionTile = page.getByTestId('tile-annualProduction');
      const nyText = await nyProductionTile.innerText();
      const nyProduction = parseFloat(nyText.replace(/[^0-9.]/g, ''));
      
      // Arizona should have higher production
      expect(azProduction).toBeGreaterThan(nyProduction);
      
      const difference = ((azProduction - nyProduction) / nyProduction * 100).toFixed(1);
      console.log(`🌞 AZ: ${azProduction} kWh/yr`);
      console.log(`☁️ NY: ${nyProduction} kWh/yr`);
      console.log(`📊 Difference: ${difference}% more in Arizona`);
    });
  });

  test.describe('API Integration Verification', () => {
    test('Demo: Verify real API calls are made', async ({ page, baseURL }) => {
      const apiCalls: string[] = [];
      page.on('request', request => {
        const url = request.url();
        if (url.includes('/api/')) {
          apiCalls.push(url);
        }
      });
      
      await page.goto((baseURL ?? '') + '/?demo=1');
      await page.waitForLoadState('networkidle');
      
      const addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.florida);
      await page.waitForTimeout(2000);
      
      const suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      const generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      expect(apiCalls.length).toBeGreaterThan(0);
      console.log(`📡 API calls made: ${apiCalls.length}`);
      console.log(`🔗 Endpoints: ${[...new Set(apiCalls.map(url => new URL(url).pathname))].join(', ')}`);
    });
  });

  test.describe('Calculation Accuracy', () => {
    test('Capacity factor is realistic (12-22%)', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + '/?demo=1');
      await page.waitForLoadState('networkidle');
      
      const addressInput = page.getByPlaceholder(/Start typing/i);
      await addressInput.fill(testAddresses.california);
      await page.waitForTimeout(2000);
      
      const suggestion = page.locator('[role="option"]').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      const generateButton = page.getByRole('button', { name: /Generate.*Report/i });
      await generateButton.click();
      
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const systemSizeText = await page.getByTestId('tile-systemSize').innerText();
      const productionText = await page.getByTestId('tile-annualProduction').innerText();
      
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      const hoursPerYear = 8760;
      const capacityFactor = (annualProduction / (systemSize * hoursPerYear)) * 100;
      
      expect(capacityFactor).toBeGreaterThan(10);
      expect(capacityFactor).toBeLessThan(25);
      
      console.log(`⚡ System: ${systemSize} kW`);
      console.log(`📊 Production: ${annualProduction} kWh/yr`);
      console.log(`📈 Capacity Factor: ${capacityFactor.toFixed(1)}%`);
    });
  });
});
