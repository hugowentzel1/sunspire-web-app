import { test, expect } from '@playwright/test';

test('Debug CRM Guides Link - Check What Happens', async ({ page }) => {
  console.log('🔍 Debugging CRM Guides link...');
  
  // Go to support page
  await page.goto('http://localhost:3001/support');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of support page
  await page.screenshot({ path: 'debug-support-page.png', fullPage: true });
  console.log('📸 Support page screenshot saved');
  
  // Find CRM Guides link
  const crmGuidesLink = page.locator('a:has-text("CRM Guides")');
  await expect(crmGuidesLink).toBeVisible();
  console.log('✅ CRM Guides link found');
  
  // Get the href attribute
  const href = await crmGuidesLink.getAttribute('href');
  console.log(`🔗 CRM Guides link href: ${href}`);
  
  // Click the link
  await crmGuidesLink.click();
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of where we ended up
  await page.screenshot({ path: 'debug-after-crm-click.png', fullPage: true });
  console.log('📸 After CRM click screenshot saved');
  
  // Check current URL
  const currentUrl = page.url();
  console.log(`📍 Current URL after click: ${currentUrl}`);
  
  // Check what's on the page
  const pageTitle = await page.title();
  console.log(`📄 Page title: ${pageTitle}`);
  
  const h1Elements = await page.locator('h1').count();
  console.log(`🔍 Found ${h1Elements} h1 elements`);
  
  for (let i = 0; i < h1Elements; i++) {
    const h1Text = await page.locator('h1').nth(i).textContent();
    console.log(`H1 ${i}: ${h1Text}`);
  }
  
  // Check for docs-related content
  const docsContent = page.locator('text=Documentation, text=Setup, text=Integration');
  const docsCount = await docsContent.count();
  console.log(`🔍 Found ${docsCount} docs-related elements`);
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(10000);
});
