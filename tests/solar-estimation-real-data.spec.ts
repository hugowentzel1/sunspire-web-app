import { test, expect } from '@playwright/test';

test.describe('Solar Estimation Real Data Verification', () => {
  test('should show different production values for different locations', async ({ page }) => {
    // Test multiple locations to ensure we're getting real data, not fallback
    const testLocations = [
      {
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
        expectedMinProduction: 12000, // CA should have high production
        expectedMaxProduction: 18000,
        description: 'Silicon Valley, CA'
      },
      {
        address: '1 Hacker Way, Menlo Park, CA', 
        expectedMinProduction: 12000,
        expectedMaxProduction: 18000,
        description: 'Facebook HQ, CA'
      },
      {
        address: '350 5th Ave, New York, NY',
        expectedMinProduction: 8000, // NY should have lower production
        expectedMaxProduction: 12000,
        description: 'Empire State Building, NY'
      },
      {
        address: '1600 Pennsylvania Avenue NW, Washington, DC',
        expectedMinProduction: 9000, // DC should be moderate
        expectedMaxProduction: 13000,
        description: 'White House, DC'
      }
    ];

    for (const location of testLocations) {
      console.log(`\n🌍 Testing location: ${location.description}`);
      
      // Navigate to demo page
      await page.goto('http://localhost:3000/?company=blockbuster&demo=1');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Fill in the address
      const addressInput = page.locator('[data-testid="demo-address-input"]');
      await addressInput.clear();
      await addressInput.fill(location.address);
      
      // Wait a moment for autocomplete
      await page.waitForTimeout(1000);
      
      // Click the first autocomplete suggestion
      const suggestion = page.locator('.pac-item').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      // Click generate button (the one with "Generate Solar Report" text)
      const generateBtn = page.getByRole('button', { name: 'Generate Solar Report' });
      await generateBtn.click();
      
      // Wait for report page to load
      await page.waitForURL('**/report**');
      await page.waitForLoadState('networkidle');
      
      // Wait for the estimate to load (not fallback)
      await page.waitForSelector('[data-testid="tile-annualProduction"]', { timeout: 10000 });
      
      // Get the production value
      const productionElement = page.locator('[data-testid="tile-annualProduction"]');
      const productionText = await productionElement.textContent();
      
      console.log(`📊 Production text: "${productionText}"`);
      
      // Extract the number from the text (e.g., "11,105 kWh" -> 11105)
      const productionMatch = productionText?.match(/(\d{1,2},\d{3})/);
      if (!productionMatch) {
        throw new Error(`Could not extract production number from: "${productionText}"`);
      }
      
      const productionValue = parseInt(productionMatch[1].replace(',', ''));
      console.log(`🔢 Extracted production: ${productionValue} kWh`);
      
      // Verify it's within expected range
      expect(productionValue).toBeGreaterThanOrEqual(location.expectedMinProduction);
      expect(productionValue).toBeLessThanOrEqual(location.expectedMaxProduction);
      
      console.log(`✅ ${location.description}: ${productionValue} kWh (expected: ${location.expectedMinProduction}-${location.expectedMaxProduction})`);
      
      // Also check that we're not getting the fallback value (11,105)
      if (productionValue === 11105) {
        console.log(`⚠️  WARNING: Got fallback value 11,105 for ${location.description}`);
      }
      
      // Check for API call logs in console
      const logs = await page.evaluate(() => {
        return (window as any).consoleLogs || [];
      });
      
      const hasRealDataLog = logs.some((log: string) => 
        log.includes('Real estimate received') || 
        log.includes('Fetching real estimate')
      );
      
      if (hasRealDataLog) {
        console.log(`✅ Found real data API logs for ${location.description}`);
      } else {
        console.log(`⚠️  No real data API logs found for ${location.description}`);
      }
    }
  });

  test('should show different savings for different locations', async ({ page }) => {
    // Test that savings vary by location (different utility rates)
    const locations = [
      {
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
        description: 'CA (high rates)'
      },
      {
        address: '350 5th Ave, New York, NY', 
        description: 'NY (very high rates)'
      }
    ];

    const savingsValues: number[] = [];

    for (const location of locations) {
      console.log(`\n💰 Testing savings for: ${location.description}`);
      
      await page.goto('http://localhost:3000/?company=blockbuster&demo=1');
      await page.waitForLoadState('networkidle');
      
      const addressInput = page.locator('[data-testid="demo-address-input"]');
      await addressInput.clear();
      await addressInput.fill(location.address);
      await page.waitForTimeout(1000);
      
      const suggestion = page.locator('.pac-item').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      await page.getByRole('button', { name: 'Generate Solar Report' }).click();
      await page.waitForURL('**/report**');
      await page.waitForLoadState('networkidle');
      
      await page.waitForSelector('[data-testid="tile-large"]', { timeout: 10000 });
      
      const savingsElement = page.locator('[data-testid="tile-large"]');
      const savingsText = await savingsElement.textContent();
      
      console.log(`💵 Savings text: "${savingsText}"`);
      
      const savingsMatch = savingsText?.match(/\$(\d{1,2},\d{3})/);
      if (!savingsMatch) {
        throw new Error(`Could not extract savings number from: "${savingsText}"`);
      }
      
      const savingsValue = parseInt(savingsMatch[1].replace(',', ''));
      savingsValues.push(savingsValue);
      
      console.log(`🔢 Extracted savings: $${savingsValue}`);
    }

    // Verify that different locations have different savings
    if (savingsValues.length >= 2) {
      const [savings1, savings2] = savingsValues;
      const difference = Math.abs(savings1 - savings2);
      
      console.log(`📊 Savings comparison: $${savings1} vs $${savings2} (difference: $${difference})`);
      
      // Different locations should have different savings (at least $200 difference)
      expect(difference).toBeGreaterThan(200);
    }
  });

  test('should not show fallback values for any location', async ({ page }) => {
    // Quick test to ensure we never get the hardcoded fallback
    const fallbackProduction = 11105;
    const fallbackSavings = 1444;
    
    await page.goto('http://localhost:3000/?company=blockbuster&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test a few different addresses
    const testAddresses = [
      '1600 Amphitheatre Parkway, Mountain View, CA',
      '350 5th Ave, New York, NY',
      '1 Hacker Way, Menlo Park, CA'
    ];
    
    for (const address of testAddresses) {
      console.log(`\n🚫 Testing no fallback for: ${address}`);
      
      const addressInput = page.locator('[data-testid="demo-address-input"]');
      await addressInput.clear();
      await addressInput.fill(address);
      await page.waitForTimeout(1000);
      
      const suggestion = page.locator('.pac-item').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
      
      await page.getByRole('button', { name: 'Generate Solar Report' }).click();
      await page.waitForURL('**/report**');
      await page.waitForLoadState('networkidle');
      
      await page.waitForSelector('[data-testid="tile-annualProduction"]', { timeout: 10000 });
      
      const productionElement = page.locator('[data-testid="tile-annualProduction"]');
      const productionText = await productionElement.textContent();
      const productionMatch = productionText?.match(/(\d{1,2},\d{3})/);
      
      if (productionMatch) {
        const productionValue = parseInt(productionMatch[1].replace(',', ''));
        
        // Should NOT be the fallback value
        expect(productionValue).not.toBe(fallbackProduction);
        console.log(`✅ Production ${productionValue} is not fallback ${fallbackProduction}`);
      }
      
      // Check savings too
      const savingsElement = page.locator('[data-testid="tile-large"]');
      const savingsText = await savingsElement.textContent();
      const savingsMatch = savingsText?.match(/\$(\d{1,2},\d{3})/);
      
      if (savingsMatch) {
        const savingsValue = parseInt(savingsMatch[1].replace(',', ''));
        
        // Should NOT be the fallback value
        expect(savingsValue).not.toBe(fallbackSavings);
        console.log(`✅ Savings $${savingsValue} is not fallback $${fallbackSavings}`);
      }
    }
  });
});
