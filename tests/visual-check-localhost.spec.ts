import { test, expect } from '@playwright/test';

test('Visual check - localhost home page', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=uber&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Scroll to show hero and trust row
  await page.evaluate(() => window.scrollTo(0, 0));
  
  // Take screenshot of hero section
  await page.screenshot({ 
    path: 'localhost-hero-section.png',
    fullPage: false 
  });
  
  console.log('✓ Screenshot saved: localhost-hero-section.png');
  
  // Check trust row
  const trustRow = page.getByTestId('hero-trust-row');
  await expect(trustRow).toBeVisible();
  console.log('✓ Trust row visible');
  
  // Scroll to quotes
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  
  // Take screenshot of quotes section
  await page.screenshot({ 
    path: 'localhost-quotes-section.png',
    fullPage: false 
  });
  
  console.log('✓ Screenshot saved: localhost-quotes-section.png');
  
  // Check quotes
  const cards = page.getByTestId('quote-card');
  const count = await cards.count();
  console.log(`✓ Found ${count} quote cards`);
  
  if (count > 0) {
    const chip = cards.first().getByTestId('verified-chip');
    const chipVisible = await chip.isVisible();
    console.log(`✓ Verified chip visible: ${chipVisible}`);
    
    const classList = await chip.evaluate(el => el.className);
    console.log(`✓ Chip classes: ${classList}`);
  }
  
  // Keep browser open for 60 seconds so you can see it
  console.log('\n📸 Screenshots taken! Browser will stay open for 60 seconds...\n');
  await page.waitForTimeout(60000);
});

