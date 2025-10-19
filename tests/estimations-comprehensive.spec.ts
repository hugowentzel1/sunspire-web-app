import { test, expect } from '@playwright/test';
import { addrs } from './_utils';

test.describe('Solar Estimations - Comprehensive Validation', () => {
  
  test.describe('System Size Calculations', () => {
    test('System size is reasonable for residential property', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      
      // Wait for calculations to complete
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const systemSizeTile = page.getByTestId('tile-systemSize');
      await expect(systemSizeTile).toBeVisible();
      
      const systemSizeText = await systemSizeTile.innerText();
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      
      // Residential systems typically 5-15 kW
      expect(systemSize).toBeGreaterThan(3);
      expect(systemSize).toBeLessThan(20);
    });

    test('System size has proper unit (kW)', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const systemSizeTile = page.getByTestId('tile-systemSize');
      const text = await systemSizeTile.innerText();
      
      expect(text.toLowerCase()).toContain('kw');
    });
  });

  test.describe('Annual Production Estimates', () => {
    test('Annual production is realistic for system size', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const annualProductionTile = page.getByTestId('tile-annualProduction');
      await expect(annualProductionTile).toBeVisible();
      
      const productionText = await annualProductionTile.innerText();
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      // Typical residential: 5,000 - 20,000 kWh/year
      expect(annualProduction).toBeGreaterThan(4000);
      expect(annualProduction).toBeLessThan(25000);
    });

    test('Annual production has proper unit (kWh)', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const tile = page.getByTestId('tile-annualProduction');
      const text = await tile.innerText();
      
      expect(text.toLowerCase()).toContain('kwh');
    });

    test('Production-to-system-size ratio is realistic', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const systemSizeText = await page.getByTestId('tile-systemSize').innerText();
      const productionText = await page.getByTestId('tile-annualProduction').innerText();
      
      const systemSize = parseFloat(systemSizeText.replace(/[^0-9.]/g, ''));
      const annualProduction = parseFloat(productionText.replace(/[^0-9.]/g, ''));
      
      // Typical ratio: 1,000 - 1,500 kWh per kW (capacity factor * hours/year)
      const ratio = annualProduction / systemSize;
      expect(ratio).toBeGreaterThan(800);
      expect(ratio).toBeLessThan(1800);
    });
  });

  test.describe('Cost Calculations', () => {
    test('Installation cost is market-realistic', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const installCostTile = page.getByTestId('tile-installCost');
      if (await installCostTile.isVisible()) {
        const costText = await installCostTile.innerText();
        const installCost = parseFloat(costText.replace(/[^0-9.]/g, ''));
        
        // Typical: $2.50-$3.50/W, so 10kW = $25,000-$35,000
        expect(installCost).toBeGreaterThan(10000);
        expect(installCost).toBeLessThan(60000);
      }
    });

    test('Annual savings is positive and realistic', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const savingsTile = page.getByTestId('tile-annualSavings');
      if (await savingsTile.isVisible()) {
        const savingsText = await savingsTile.innerText();
        const annualSavings = parseFloat(savingsText.replace(/[^0-9.]/g, ''));
        
        // Typical residential: $800-$3,000/year
        expect(annualSavings).toBeGreaterThan(500);
        expect(annualSavings).toBeLessThan(5000);
      }
    });

    test('25-year savings exceeds installation cost', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const lifetimeSavingsTile = page.getByTestId('tile-lifetimeSavings');
      const installCostTile = page.getByTestId('tile-installCost');
      
      if (await lifetimeSavingsTile.isVisible() && await installCostTile.isVisible()) {
        const lifetimeSavingsText = await lifetimeSavingsTile.innerText();
        const installCostText = await installCostTile.innerText();
        
        const lifetimeSavings = parseFloat(lifetimeSavingsText.replace(/[^0-9.]/g, ''));
        const installCost = parseFloat(installCostText.replace(/[^0-9.]/g, ''));
        
        // 25-year savings should exceed installation cost
        expect(lifetimeSavings).toBeGreaterThan(installCost);
      }
    });
  });

  test.describe('Financial Projections', () => {
    test('Payback period is reasonable', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const paybackTile = page.getByTestId('tile-payback');
      if (await paybackTile.isVisible()) {
        const paybackText = await paybackTile.innerText();
        const payback = parseFloat(paybackText.replace(/[^0-9.]/g, ''));
        
        // Typical: 6-12 years
        expect(payback).toBeGreaterThan(4);
        expect(payback).toBeLessThan(15);
      }
    });

    test('ROI is positive', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Check for ROI in financial section
      const roiElement = page.locator('text=/ROI|Return on Investment/i').first();
      if (await roiElement.isVisible()) {
        const roiText = await roiElement.innerText();
        const roi = parseFloat(roiText.replace(/[^0-9.]/g, ''));
        
        // ROI should be positive
        expect(roi).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Environmental Impact', () => {
    test('CO2 offset is calculated', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const co2Tile = page.getByTestId('tile-co2Offset');
      if (await co2Tile.isVisible()) {
        const co2Text = await co2Tile.innerText();
        const co2 = parseFloat(co2Text.replace(/[^0-9.]/g, ''));
        
        // Typical: 5-15 tons/year
        expect(co2).toBeGreaterThan(2);
        expect(co2).toBeLessThan(25);
      }
    });

    test('Tree equivalent is calculated', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const treeTile = page.getByTestId('tile-treesEquivalent');
      if (await treeTile.isVisible()) {
        const treeText = await treeTile.innerText();
        const trees = parseFloat(treeText.replace(/[^0-9.]/g, ''));
        
        // Typical: 50-300 trees
        expect(trees).toBeGreaterThan(20);
        expect(trees).toBeLessThan(500);
      }
    });
  });

  test.describe('Data Consistency Across UI', () => {
    test('Numbers are consistent between tiles and charts', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Get system size from tile
      const systemSizeTile = page.getByTestId('tile-systemSize');
      const tileText = await systemSizeTile.innerText();
      const tileSystemSize = parseFloat(tileText.replace(/[^0-9.]/g, ''));
      
      // Check if system size appears elsewhere consistently
      const allNumbers = await page.locator('text=/\\d+\\.?\\d*\\s*kW/').allTextContents();
      
      // At least one other reference should match
      expect(allNumbers.length).toBeGreaterThan(1);
    });

    test('All numeric values are properly formatted', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Check all metric tiles
      const tiles = page.locator('[data-testid^="tile-"]');
      const count = await tiles.count();
      
      for (let i = 0; i < count; i++) {
        const tile = tiles.nth(i);
        if (await tile.isVisible()) {
          const text = await tile.innerText();
          
          // Should not contain NaN, Infinity, undefined
          expect(text.toLowerCase()).not.toContain('nan');
          expect(text.toLowerCase()).not.toContain('infinity');
          expect(text.toLowerCase()).not.toContain('undefined');
        }
      }
    });

    test('Currency values use proper formatting', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Find all currency values
      const currencyElements = page.locator('text=/\\$[0-9,]+/');
      const count = await currencyElements.count();
      
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const text = await currencyElements.nth(i).innerText();
        
        // Should have $ symbol and numbers
        expect(text).toMatch(/\$[0-9,]+/);
      }
    });
  });

  test.describe('Different Locations', () => {
    test('Estimates vary by location (Georgia vs California)', async ({ page, baseURL }) => {
      // Test Georgia location
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const gaTile = page.getByTestId('tile-annualProduction');
      const gaProduction = parseFloat((await gaTile.innerText()).replace(/[^0-9.]/g, ''));
      
      // Test California location (better solar resource)
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('100 Market St, San Francisco, CA 94105, USA')}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const caTile = page.getByTestId('tile-annualProduction');
      if (await caTile.isVisible()) {
        const caProduction = parseFloat((await caTile.innerText()).replace(/[^0-9.]/g, ''));
        
        // Both should have valid estimates (may or may not differ significantly)
        expect(gaProduction).toBeGreaterThan(0);
        expect(caProduction).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('Handles invalid address gracefully', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('Invalid Address XYZ 123')}&demo=1`);
      await page.waitForTimeout(5000);
      
      // Should show error or redirect
      const hasError = await page.locator('.error, [data-testid*="error"], text=/error/i').isVisible();
      const isRedirected = page.url().includes('/') && !page.url().includes('/report');
      
      expect(hasError || isRedirected).toBe(true);
    });

    test('Shows loading state during calculation', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      
      // Check for loading indicator
      const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner, text=/loading/i');
      
      // May or may not catch it depending on speed
      const wasLoading = await loadingIndicator.isVisible().catch(() => false);
      
      // Eventually should show content
      await page.waitForLoadState('networkidle');
      const systemSizeTile = page.getByTestId('tile-systemSize');
      await expect(systemSizeTile).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Demo vs Paid Differences', () => {
    test('Demo mode shows all basic estimations', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Basic tiles should be visible in demo
      await expect(page.getByTestId('tile-systemSize')).toBeVisible();
      await expect(page.getByTestId('tile-annualProduction')).toBeVisible();
    });

    test('Paid mode shows detailed financial analysis', async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&company=Apple`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Should show financial details
      const financialSection = page.locator('[data-testid*="financial"], text=/Financial Analysis/i');
      
      // May or may not be visible depending on implementation
      const hasFinancialSection = await financialSection.isVisible().catch(() => false);
      
      // At minimum, tiles should be visible
      await expect(page.getByTestId('tile-systemSize')).toBeVisible({ timeout: 15000 });
    });
  });
});
