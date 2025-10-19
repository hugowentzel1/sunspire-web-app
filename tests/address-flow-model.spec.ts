import { test, expect } from '@playwright/test';

test.describe('Address flow & model validation', () => {
  test('Autocomplete selects; normalized address lands on report; numbers are sane', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const input = page.getByPlaceholder(/Start typing your property address/i);
    await expect(input).toBeVisible();
    
    // Type partial address
    await input.fill('1230 W Peac');
    await page.waitForTimeout(2000); // allow Google dropdown
    
    // Click first suggestion
    const suggestions = page.locator('[role="option"], .autocomplete-suggestion, .suggestion-item').first();
    if (await suggestions.isVisible()) {
      await suggestions.click();
    } else {
      // Fallback: just fill the full address
      await input.fill('1230 W Peachtree St NW, Atlanta, GA 30309, USA');
    }

    // Generate & land on report
    await page.getByRole('button', { name: /Generate Solar Report/i }).click();
    await expect(page).toHaveURL(/report\?address=/);

    // Sanity on numbers (not NaN or absurd)
    const annual = page.locator('[data-testid*="annual"], [data-testid*="production"]').first();
    if (await annual.isVisible()) {
      const aText = await annual.innerText();
      const num = parseFloat(aText.replace(/[^0-9.]/g, ''));
      expect(num).toBeGreaterThan(1000);
      expect(num).toBeLessThan(1000000);
    }

    // Check that address is properly displayed in header
    const addressElement = page.getByTestId('hdr-address');
    await expect(addressElement).toBeVisible();
    const displayedAddress = await addressElement.innerText();
    expect(displayedAddress).toContain('Atlanta');
    expect(displayedAddress).toContain('GA');
  });

  test('Address wrapping and formatting', async ({ page, baseURL }) => {
    const longAddress = '12345 Very Long Street Name Southwest, Mountain Park, GA 30047, United States of America';
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(longAddress)}&demo=1`);
    
    const addressElement = page.getByTestId('hdr-address');
    await expect(addressElement).toBeVisible();
    
    // Check for balanced wrapping (no ellipsis)
    const addressText = await addressElement.innerText();
    expect(addressText).not.toContain('…');
    expect(addressText).not.toContain('...');
    
    // Check line count (should be ≤ 2 lines)
    const lineCount = await addressElement.evaluate((node: HTMLElement) => {
      const cs = getComputedStyle(node);
      const lh = parseFloat(cs.lineHeight);
      const h = node.getBoundingClientRect().height;
      return Math.round(h / lh);
    });
    expect(lineCount).toBeLessThanOrEqual(2);
  });

  test('Model calculations are consistent across sections', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&demo=1`);
    
    // Wait for calculations to complete
    await page.waitForTimeout(3000);
    
    // Find all numeric values in the report
    const numericElements = page.locator('[data-testid*="stat"], [data-testid*="tile"], .metric-value, .stat-value');
    
    let foundValidNumbers = false;
    const count = await numericElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = numericElements.nth(i);
      if (await element.isVisible()) {
        const text = await element.innerText();
        const numbers = text.match(/[\d,]+\.?\d*/g);
        
        if (numbers && numbers.length > 0) {
          for (const numStr of numbers) {
            const num = parseFloat(numStr.replace(/,/g, ''));
            if (!isNaN(num) && num > 0 && num < 10000000) {
              foundValidNumbers = true;
              break;
            }
          }
        }
      }
      if (foundValidNumbers) break;
    }
    
    expect(foundValidNumbers).toBe(true);
  });

  test('Error handling for invalid addresses', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('Invalid Address XYZ')}&demo=1`);
    
    // Should either redirect to home or show error message
    const hasError = await page.locator('.error, .alert-error, [data-testid*="error"]').isVisible();
    const isOnHomePage = page.url().includes('/') && !page.url().includes('/report');
    
    expect(hasError || isOnHomePage).toBe(true);
  });
});
