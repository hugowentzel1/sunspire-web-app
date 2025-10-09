import { test, expect } from '@playwright/test';

test('Paid page shows PaidFooter with 3 rows', async ({ page }) => {
  await page.goto('http://localhost:3000/paid?demo=0&company=Apple&brandColor=%23FF6B35', {
    waitUntil: 'networkidle',
    timeout: 15000
  });
  
  await page.waitForTimeout(2000);
  
  // Check that footer exists
  const footer = page.locator('footer');
  await expect(footer).toBeVisible({ timeout: 10000 });
  
  // Check for the 3 rows
  const brandRow = footer.locator('[data-testid="footer-brand"]');
  const linksRow = footer.locator('[data-testid="footer-links"]');
  const microRow = footer.locator('[data-testid="footer-micro"]');
  
  await expect(brandRow).toBeVisible();
  await expect(linksRow).toBeVisible();
  await expect(microRow).toBeVisible();
  
  // Check brand row has Apple
  await expect(brandRow).toContainText('Apple');
  
  // Check links row has all legal links
  await expect(linksRow).toContainText('Privacy Policy');
  await expect(linksRow).toContainText('Terms of Service');
  await expect(linksRow).toContainText('Cookie Preferences');
  await expect(linksRow).toContainText('Accessibility');
  await expect(linksRow).toContainText('Contact');
  
  // Check micro row has attributions
  await expect(microRow).toContainText('Mapping & location data © Google');
  await expect(microRow).toContainText('NREL PVWatts® v8');
  await expect(microRow).toContainText('Powered by Sunspire');
  
  // Should NOT have Sunspire contact info (that's demo only)
  await expect(footer).not.toContainText('support@getsunspire.com');
  await expect(footer).not.toContainText('billing@getsunspire.com');
  
  await page.screenshot({ path: 'test-results/paid-footer.png', fullPage: true });
  console.log('✓ Paid footer verified - screenshot saved');
});

test('Demo page shows full Footer with Sunspire contact', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=Netflix&demo=1&brandColor=%23E50914', {
    waitUntil: 'networkidle',
    timeout: 15000
  });
  
  await page.waitForTimeout(2000);
  
  const footer = page.locator('footer');
  await expect(footer).toBeVisible({ timeout: 10000 });
  
  // Demo should have Sunspire contact info
  await expect(footer).toContainText('Sunspire Solar Intelligence');
  await expect(footer).toContainText('support@getsunspire.com');
  await expect(footer).toContainText('Pricing');
  await expect(footer).toContainText('Partners');
  
  await page.screenshot({ path: 'test-results/demo-footer.png', fullPage: true });
  console.log('✓ Demo footer verified - screenshot saved');
});

