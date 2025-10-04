import { test, expect } from '@playwright/test';

test('Debug page HTML to see if StickyCTA is rendered', async ({ page }) => {
  // Go to the report page with Tesla demo
  await page.goto('http://localhost:3000/report?company=tesla&demo=1');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for any animations
  await page.waitForTimeout(3000);
  
  // Get the full HTML content
  const html = await page.content();
  
  // Check if StickyCTA is in the HTML
  console.log('HTML contains "StickyCTA":', html.includes('StickyCTA'));
  console.log('HTML contains "sticky-cta":', html.includes('sticky-cta'));
  console.log('HTML contains "Activate on Your Domain":', html.includes('Activate on Your Domain'));
  
  // Check if there are any React components rendered
  console.log('HTML contains "data-testid":', html.includes('data-testid'));
  
  // Look for any CTA-related content
  const ctaMatches = html.match(/Activate|Domain|24 Hours|pricing/gi);
  console.log('CTA-related content found:', ctaMatches);
  
  // Check the page title and meta
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if there are any JavaScript errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  await page.waitForTimeout(1000);
  console.log('JavaScript errors:', errors);
  
  // Try to find any elements with testid
  const testIdElements = await page.locator('[data-testid]').count();
  console.log('Elements with data-testid:', testIdElements);
  
  // List all data-testid values
  const testIds = await page.locator('[data-testid]').evaluateAll(elements => 
    elements.map(el => el.getAttribute('data-testid'))
  );
  console.log('All data-testid values:', testIds);
});
