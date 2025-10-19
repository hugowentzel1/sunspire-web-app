import { test, expect } from '@playwright/test';

// Multiple real addresses to test with
const testAddresses = {
  atlanta: '123 W Peachtree St NW, Atlanta, GA 30309, USA',
  sanFrancisco: '100 Market St, San Francisco, CA 94105, USA',
  miami: '1200 Brickell Ave, Miami, FL 33131, USA',
  phoenix: '123 N Central Ave, Phoenix, AZ 85004, USA',
  seattle: '400 Broad St, Seattle, WA 98109, USA'
};

test.describe('EXHAUSTIVE Estimation Tests - Real Data Verification', () => {
  
  test.describe('Demo Version - Multiple Locations', () => {
    for (const [city, address] of Object.entries(testAddresses)) {
      test(`Demo ${city}: All estimations calculate with real data`, async ({ page, baseURL }) => {
        await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(address)}&demo=1`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000); // Ensure API calls complete
        
        // Check for "calculating" or loading state has finished
        const calculatingText = page.locator('text=/calculating|loading/i');
        const hasCalculating = await calculatingText.isVisible().catch(() => false);
        if (hasCalculating) {
          await calculatingText.waitFor({ state: 'hidden', timeout: 30000 });
        }
        
        // Verify system size
        const systemSizeTile = page.getByTestId('tile-systemSize');
        await expect(systemSizeTile).toBeVisible();
        const systemSizeText = await systemSizeTile.innerText();
        const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
        
        // Should NOT be fallback data (typically 0 or exactly 10.0)
        expect(systemSize).toBeGreaterThan(0);
        expect(systemSize).not.toBe(10.0); // Common fallback value
        expect(systemSize).toBeGreaterThan(3);
        expect(systemSize).toBeLessThan(20);
        
        // Verify annual production
        const annualProductionTile = page.getByTestId('tile-annualProduction');
        await expect(annualProductionTile).toBeVisible();
        const productionText = await annualProductionTile.innerText();
        const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
        
        // Should NOT be fallback (typically 0 or round numbers like 10000)
        expect(annualProduction).toBeGreaterThan(0);
        expect(annualProduction % 1000).not.toBe(0); // Not a round thousand
        expect(annualProduction).toBeGreaterThan(4000);
        expect(annualProduction).toBeLessThan(25000);
        
        // Verify production-to-size ratio is realistic (proves real data)
        const ratio = annualProduction / systemSize;
        expect(ratio).toBeGreaterThan(800);
        expect(ratio).toBeLessThan(1800);
        
        // Check that address is displayed correctly (not fallback)
        const addressElement = page.getByTestId('hdr-address');
        const displayedAddress = await addressElement.innerText();
        expect(displayedAddress).toContain(city === 'sanFrancisco' ? 'Market' : 
                                          city === 'miami' ? 'Brickell' :
                                          city === 'phoenix' ? 'Central' :
                                          city === 'seattle' ? 'Broad' : 'Peachtree');
        
        console.log(`✅ ${city}: System=${systemSize}kW, Production=${annualProduction}kWh, Ratio=${ratio.toFixed(0)}`);
      });
    }
  });

  test.describe('Paid Version - Multiple Locations with Live URL', () => {
    for (const [city, address] of Object.entries(testAddresses)) {
      test(`Paid ${city}: All estimations calculate with real data`, async ({ page }) => {
        await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(address)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000); // Ensure API calls complete
        
        // Check for "calculating" or loading state has finished
        const calculatingText = page.locator('text=/calculating|loading/i');
        const hasCalculating = await calculatingText.isVisible().catch(() => false);
        if (hasCalculating) {
          await calculatingText.waitFor({ state: 'hidden', timeout: 30000 });
        }
        
        // Verify system size
        const systemSizeTile = page.getByTestId('tile-systemSize');
        await expect(systemSizeTile).toBeVisible({ timeout: 20000 });
        const systemSizeText = await systemSizeTile.innerText();
        const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
        
        // Should NOT be fallback data
        expect(systemSize).toBeGreaterThan(0);
        expect(systemSize).not.toBe(10.0);
        expect(systemSize).toBeGreaterThan(3);
        expect(systemSize).toBeLessThan(20);
        
        // Verify annual production
        const annualProductionTile = page.getByTestId('tile-annualProduction');
        await expect(annualProductionTile).toBeVisible();
        const productionText = await annualProductionTile.innerText();
        const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
        
        // Should NOT be fallback
        expect(annualProduction).toBeGreaterThan(0);
        expect(annualProduction % 1000).not.toBe(0);
        expect(annualProduction).toBeGreaterThan(4000);
        expect(annualProduction).toBeLessThan(25000);
        
        // Verify production-to-size ratio
        const ratio = annualProduction / systemSize;
        expect(ratio).toBeGreaterThan(800);
        expect(ratio).toBeLessThan(1800);
        
        // Verify paid-specific elements
        await expect(page.getByRole('button', { name: /Book a Consultation/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
        
        // Verify NO demo elements
        await expect(page.getByText('(Live Preview)')).toHaveCount(0);
        await expect(page.getByText(/runs left/i)).toHaveCount(0);
        
        // Verify brand theming (Apple)
        const h1 = page.getByTestId('hdr-h1');
        await expect(h1).toContainText('Apple');
        
        console.log(`✅ PAID ${city}: System=${systemSize}kW, Production=${annualProduction}kWh, Ratio=${ratio.toFixed(0)}`);
      });
    }
  });

  test.describe('Data Non-Fallback Verification', () => {
    test('Demo: Verify calculations are NOT using fallback data', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddresses.atlanta)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      // Get all metric tiles
      const tiles = await page.locator('[data-testid^="tile-"]').allTextContents();
      
      // Check that we have multiple different values (not all same/fallback)
      const numbers = tiles.map(t => parseFloat(t.replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
      
      // Should have at least 3 different values
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBeGreaterThan(3);
      
      // None should be exactly 0 or 10
      expect(numbers.every(n => n !== 0 && n !== 10)).toBe(true);
      
      // Should have decimal precision (not all round numbers)
      const hasDecimals = numbers.some(n => n % 1 !== 0);
      expect(hasDecimals).toBe(true);
    });

    test('Paid: Verify calculations are NOT using fallback data', async ({ page }) => {
      await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(testAddresses.sanFrancisco)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const tiles = await page.locator('[data-testid^="tile-"]').allTextContents();
      const numbers = tiles.map(t => parseFloat(t.replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
      
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBeGreaterThan(3);
      expect(numbers.every(n => n !== 0 && n !== 10)).toBe(true);
      
      const hasDecimals = numbers.some(n => n % 1 !== 0);
      expect(hasDecimals).toBe(true);
    });
  });

  test.describe('Location-Specific Solar Resource Validation', () => {
    test('Phoenix (sunny) should have higher production than Seattle (cloudy)', async ({ page, baseURL }) => {
      // Test Phoenix
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddresses.phoenix)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const phoenixTile = page.getByTestId('tile-annualProduction');
      const phoenixText = await phoenixTile.innerText();
      const phoenixProduction = parseFloat(phoenixText.replace(/[^0-9.]/g, ''));
      
      // Test Seattle
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddresses.seattle)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const seattleTile = page.getByTestId('tile-annualProduction');
      const seattleText = await seattleTile.innerText();
      const seattleProduction = parseFloat(seattleText.replace(/[^0-9.]/g, ''));
      
      // Phoenix should have higher production (more sun)
      expect(phoenixProduction).toBeGreaterThan(seattleProduction);
      
      console.log(`🌞 Phoenix: ${phoenixProduction} kWh/yr`);
      console.log(`☁️ Seattle: ${seattleProduction} kWh/yr`);
      console.log(`📊 Difference: ${((phoenixProduction - seattleProduction) / seattleProduction * 100).toFixed(1)}% more in Phoenix`);
    });
  });

  test.describe('API Integration Verification', () => {
    test('Demo: Verify API calls are made (not cached/fallback)', async ({ page, baseURL }) => {
      // Monitor network requests
      const apiCalls: string[] = [];
      page.on('request', request => {
        const url = request.url();
        if (url.includes('api/') || url.includes('nrel') || url.includes('openei') || url.includes('pvwatts')) {
          apiCalls.push(url);
        }
      });
      
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddresses.miami)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      // Should have made API calls
      expect(apiCalls.length).toBeGreaterThan(0);
      
      console.log(`📡 API calls made: ${apiCalls.length}`);
      console.log(`🔗 API endpoints: ${[...new Set(apiCalls.map(url => new URL(url).pathname))].join(', ')}`);
    });

    test('Paid: Verify API calls are made (not cached/fallback)', async ({ page }) => {
      const apiCalls: string[] = [];
      page.on('request', request => {
        const url = request.url();
        if (url.includes('api/') || url.includes('nrel') || url.includes('openei') || url.includes('pvwatts')) {
          apiCalls.push(url);
        }
      });
      
      await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(testAddresses.atlanta)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      expect(apiCalls.length).toBeGreaterThan(0);
      
      console.log(`📡 PAID API calls made: ${apiCalls.length}`);
    });
  });

  test.describe('Calculation Accuracy Cross-Check', () => {
    test('Demo: System size * capacity factor ≈ annual production', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddresses.atlanta)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const systemSizeText = await page.getByTestId('tile-systemSize').innerText();
      const productionText = await page.getByTestId('tile-annualProduction').innerText();
      
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      // Calculate implied capacity factor
      const hoursPerYear = 8760;
      const impliedCapacityFactor = (annualProduction / (systemSize * hoursPerYear)) * 100;
      
      // Capacity factor should be realistic (12-20% for residential solar)
      expect(impliedCapacityFactor).toBeGreaterThan(10);
      expect(impliedCapacityFactor).toBeLessThan(25);
      
      console.log(`⚡ System: ${systemSize} kW`);
      console.log(`📊 Production: ${annualProduction} kWh/yr`);
      console.log(`📈 Capacity Factor: ${impliedCapacityFactor.toFixed(1)}%`);
    });

    test('Paid: Verify cost calculations are realistic', async ({ page }) => {
      await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(testAddresses.sanFrancisco)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const systemSizeText = await page.getByTestId('tile-systemSize').innerText();
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      
      // Check for install cost tile
      const installCostTile = page.getByTestId('tile-installCost');
      if (await installCostTile.isVisible()) {
        const costText = await installCostTile.innerText();
        const installCost = parseFloat(costText.replace(/[^0-9.]/g, ''));
        
        // Calculate $/W
        const costPerWatt = installCost / (systemSize * 1000);
        
        // Should be realistic ($2.00-$4.00/W)
        expect(costPerWatt).toBeGreaterThan(1.5);
        expect(costPerWatt).toBeLessThan(5.0);
        
        console.log(`💰 Install Cost: $${installCost.toLocaleString()}`);
        console.log(`📊 Cost per Watt: $${costPerWatt.toFixed(2)}/W`);
      }
    });
  });

  test.describe('Environmental Calculations Verification', () => {
    test('Demo: CO2 offset correlates with production', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(testAddresses.miami)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const productionText = await page.getByTestId('tile-annualProduction').innerText();
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      const co2Tile = page.getByTestId('tile-co2Offset');
      if (await co2Tile.isVisible()) {
        const co2Text = await co2Tile.innerText();
        const co2Offset = parseFloat(co2Text.replace(/[^0-9.]/g, ''));
        
        // Typical: ~0.7 lbs CO2 per kWh = 0.000317515 metric tons per kWh
        const expectedCO2 = annualProduction * 0.0004; // Rough estimate
        
        // Should be within reasonable range
        expect(co2Offset).toBeGreaterThan(expectedCO2 * 0.5);
        expect(co2Offset).toBeLessThan(expectedCO2 * 2);
        
        console.log(`🌱 Production: ${annualProduction} kWh/yr`);
        console.log(`♻️ CO2 Offset: ${co2Offset} tons/yr`);
      }
    });
  });

  test.describe('Paid Version Exclusive Features', () => {
    test('Paid: Has consultation booking functionality', async ({ page }) => {
      await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(testAddresses.atlanta)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const bookButton = page.getByRole('button', { name: /Book a Consultation/i });
      await expect(bookButton).toBeVisible();
      
      // Verify button is clickable
      await expect(bookButton).toBeEnabled();
      
      // Check for phone link
      const phoneLink = page.getByRole('link', { name: /Talk to a Specialist/i });
      if (await phoneLink.isVisible()) {
        const href = await phoneLink.getAttribute('href');
        expect(href).toContain('tel:');
      }
    });

    test('Paid: Has PDF download functionality', async ({ page }) => {
      await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(testAddresses.sanFrancisco)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const pdfButton = page.getByRole('button', { name: /Download PDF/i });
      await expect(pdfButton).toBeVisible();
      await expect(pdfButton).toBeEnabled();
    });

    test('Paid: Has share link functionality', async ({ page }) => {
      await page.goto(`https://sunspire-web-app.vercel.app/paid?address=${encodeURIComponent(testAddresses.phoenix)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const shareButton = page.getByRole('button', { name: /Copy Share Link/i });
      await expect(shareButton).toBeVisible();
      await expect(shareButton).toBeEnabled();
    });
  });
});
