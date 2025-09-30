import { test, expect } from '@playwright/test';

/**
 * Verify color names in chart descriptions are dynamic
 */

test('Chart color description - Netflix (red)', async ({ page }) => {
  await page.goto('http://localhost:3001/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
  
  // Enter address and generate report
  const addressInput = page.locator('input[placeholder*="Start typing"]').first();
  await addressInput.fill('123 Main St, Phoenix, AZ 85001');
  await page.waitForTimeout(500);
  
  const generateButton = page.locator('button').filter({ hasText: /Generate|Launch/ }).first();
  await generateButton.click();
  
  // Wait for report page
  await page.waitForTimeout(3000);
  
  // Check for "red area" text
  const chartDescription = page.locator('text=/The.*area shows your total savings/i').first();
  
  if (await chartDescription.count() > 0) {
    const descText = await chartDescription.textContent();
    console.log('Chart description:', descText);
    
    const hasRedMention = descText?.toLowerCase().includes('red');
    console.log('✅ Netflix report mentions "red area":', hasRedMention);
    expect(hasRedMention).toBe(true);
  }
  
  await page.waitForTimeout(5000);
});

test('Chart color description - Spotify (green)', async ({ page }) => {
  await page.goto('http://localhost:3001/?company=Spotify&demo=1', { waitUntil: 'networkidle' });
  
  // Enter address and generate report
  const addressInput = page.locator('input[placeholder*="Start typing"]').first();
  await addressInput.fill('123 Main St, Phoenix, AZ 85001');
  await page.waitForTimeout(500);
  
  const generateButton = page.locator('button').filter({ hasText: /Generate|Launch/ }).first();
  await generateButton.click();
  
  // Wait for report page
  await page.waitForTimeout(3000);
  
  // Check for "green area" text
  const chartDescription = page.locator('text=/The.*area shows your total savings/i').first();
  
  if (await chartDescription.count() > 0) {
    const descText = await chartDescription.textContent();
    console.log('Chart description:', descText);
    
    const hasGreenMention = descText?.toLowerCase().includes('green');
    console.log('✅ Spotify report mentions "green area":', hasGreenMention);
    expect(hasGreenMention).toBe(true);
  }
  
  await page.waitForTimeout(5000);
});

test('Chart color description - Apple (blue)', async ({ page }) => {
  await page.goto('http://localhost:3001/?company=Apple&demo=1', { waitUntil: 'networkidle' });
  
  // Enter address and generate report
  const addressInput = page.locator('input[placeholder*="Start typing"]').first();
  await addressInput.fill('123 Main St, Phoenix, AZ 85001');
  await page.waitForTimeout(500);
  
  const generateButton = page.locator('button').filter({ hasText: /Generate|Launch/ }).first();
  await generateButton.click();
  
  // Wait for report page
  await page.waitForTimeout(3000);
  
  // Check for "blue area" text
  const chartDescription = page.locator('text=/The.*area shows your total savings/i').first();
  
  if (await chartDescription.count() > 0) {
    const descText = await chartDescription.textContent();
    console.log('Chart description:', descText);
    
    const hasBlueMention = descText?.toLowerCase().includes('blue');
    console.log('✅ Apple report mentions "blue area":', hasBlueMention);
    expect(hasBlueMention).toBe(true);
  }
  
  await page.waitForTimeout(5000);
});
