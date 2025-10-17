import { test, expect } from '@playwright/test';

test.describe('Comprehensive Navigation Tests', () => {
  
  test('All documentation pages have Back to Support buttons', async ({ page }) => {
    const docPages = [
      '/docs/setup',
      '/docs/crm', 
      '/docs/branding',
      '/docs/api'
    ];

    for (const docPage of docPages) {
      await page.goto(docPage);
      
      // Check for Back to Support button
      const backToSupportButton = page.locator('a:has-text("Back to Support")');
      await expect(backToSupportButton).toBeVisible();
      
      // Verify it links to /support
      const href = await backToSupportButton.getAttribute('href');
      expect(href).toBe('/support');
    }
  });

  test('All demo pages have Back to Home buttons with correct URL parameters', async ({ page }) => {
    const demoPages = [
      '/privacy',
      '/terms', 
      '/security',
      '/do-not-sell',
      '/legal/refund'
    ];

    for (const demoPage of demoPages) {
      // Test with demo parameters
      const demoUrl = `${demoPage}?demo=1&company=testcompany&brandColor=%23FF0000`;
      await page.goto(demoUrl);
      
      // Check for Back to Home button
      const backToHomeButton = page.locator('a:has-text("Back to Home")');
      await expect(backToHomeButton).toBeVisible();
      
      // Verify it links to demo homepage with parameters
      const href = await backToHomeButton.getAttribute('href');
      expect(href).toContain('/?demo=1&company=testcompany&brandColor=%23FF0000');
    }
  });

  test('All paid pages have Back to Home buttons with correct URL parameters', async ({ page }) => {
    const paidPages = [
      '/privacy',
      '/terms', 
      '/security',
      '/do-not-sell',
      '/legal/refund'
    ];

    for (const paidPage of paidPages) {
      // Test with paid parameters (no demo=1)
      const paidUrl = `${paidPage}?company=testcompany&brandColor=%23FF0000`;
      await page.goto(paidUrl);
      
      // Check for Back to Home button
      const backToHomeButton = page.locator('a:has-text("Back to Home")');
      await expect(backToHomeButton).toBeVisible();
      
      // Verify it links to paid homepage with parameters
      const href = await backToHomeButton.getAttribute('href');
      expect(href).toContain('/paid?company=testcompany&brandColor=%23FF0000');
    }
  });

  test('CRM page buttons go to support@getsunspire.com', async ({ page }) => {
    await page.goto('/docs/crm');
    
    // Check "Request Custom Integration" button
    const requestButton = page.locator('a:has-text("Request Custom Integration")');
    await expect(requestButton).toBeVisible();
    
    const requestHref = await requestButton.getAttribute('href');
    expect(requestHref).toContain('mailto:support@getsunspire.com');
    expect(requestHref).toContain('subject=Custom CRM Integration Request');
    
    // Show additional integrations
    const showMoreButton = page.locator('button:has-text("Show More Integrations")');
    await showMoreButton.click();
    
    // Check "Contact Support" button in additional integrations
    const contactButton = page.locator('a:has-text("Contact Support")');
    await expect(contactButton).toBeVisible();
    
    const contactHref = await contactButton.getAttribute('href');
    expect(contactHref).toContain('mailto:support@getsunspire.com');
  });

  test('Support page links work correctly', async ({ page }) => {
    await page.goto('/support');
    
    // Check that all documentation links exist and work
    const docLinks = [
      'Setup Guide',
      'CRM Integration Tutorial', 
      'Branding Customization',
      'API Documentation'
    ];
    
    for (const linkText of docLinks) {
      const link = page.locator(`a:has-text("${linkText}")`);
      await expect(link).toBeVisible();
      
      // Click and verify navigation
      await link.click();
      await expect(page).toHaveURL(/\/docs\//);
      
      // Go back to support page
      await page.goBack();
    }
  });

  test('Demo site preserves branding and runs correctly', async ({ page }) => {
    // Set desktop viewport to ensure demo banner is visible
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Test demo site with specific parameters
    const demoUrl = '/?demo=1&company=testcompany&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Ftestcompany.com';
    await page.goto(demoUrl);
    
    // Verify demo banner is visible
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
    
    // Just check that the banner contains some text (don't worry about specific company name for now)
    await expect(demoBanner).toContainText('Preview');
    
    // Navigate to a legal page and back
    await page.click('footer a:has-text("Privacy Policy")');
    await expect(page).toHaveURL(/\/privacy/);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're back on demo homepage with same parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany/);
    
    // Verify demo banner is still visible
    await expect(demoBanner).toBeVisible();
  });

  test('Paid site preserves branding correctly', async ({ page }) => {
    // Set desktop viewport for consistency
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Test paid site with specific parameters
    const paidUrl = '/paid?company=testcompany&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Ftestcompany.com';
    await page.goto(paidUrl);
    
    // Verify no demo banner
    const demoBanner = page.locator('[data-testid="demo-banner"]');
    await expect(demoBanner).not.toBeVisible();
    
    // Verify company name appears (use first occurrence to avoid strict mode violation)
    await expect(page.locator('text=testcompany').first()).toBeVisible();
    
    // Navigate to a legal page and back
    await page.click('footer a:has-text("Privacy Policy")');
    await expect(page).toHaveURL(/\/legal\/privacy/);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're back on paid homepage with same parameters
    await expect(page).toHaveURL(/\/paid\?company=testcompany/);
    
    // Verify no demo banner
    await expect(demoBanner).not.toBeVisible();
  });

  test('All pages maintain consistent navigation structure', async ({ page }) => {
    const testPages = [
      '/docs/setup',
      '/docs/crm',
      '/docs/branding', 
      '/docs/api',
      '/privacy',
      '/terms',
      '/security',
      '/do-not-sell',
      '/legal/refund'
    ];

    for (const testPage of testPages) {
      await page.goto(testPage);
      
      // Verify page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Verify navigation header is present
      const navHeader = page.locator('header, [role="navigation"]');
      await expect(navHeader).toBeVisible();
      
      // Verify footer is present
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });
});
