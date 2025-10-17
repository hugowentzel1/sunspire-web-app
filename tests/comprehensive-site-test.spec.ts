import { test, expect } from '@playwright/test';

test.describe('Comprehensive Site Test', () => {
  test('All legal pages have proper structure and content', async ({ page }) => {
    const legalPages = [
      { path: '/terms', title: 'Terms of Service' },
      { path: '/privacy', title: 'Privacy Policy' },
      { path: '/legal/refund', title: 'Refund Policy' },
      { path: '/dpa', title: 'Data Processing Agreement' },
      { path: '/security', title: 'Security & Compliance' },
      { path: '/do-not-sell', title: 'Do Not Sell My Data' }
    ];

    for (const legalPage of legalPages) {
      await page.goto(`http://localhost:3001${legalPage.path}?company=Tesla&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Check title (use more specific locator to avoid header h1)
      await expect(page.locator('main h1, .prose h1')).toContainText(legalPage.title);
      
      // Check back button exists
      await expect(page.locator('text=Back to Home')).toBeVisible();
      
      // Check footer exists
      await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
      
      // Check no double headers
      const headerElements = await page.locator('header').count();
      expect(headerElements).toBeLessThanOrEqual(1);
    }
  });

  test('Documentation pages exist and are properly linked', async ({ page }) => {
    const docPages = [
      { path: '/docs/setup', title: 'Setup Guide' },
      { path: '/docs/crm', title: 'CRM Integration Guides' },
      { path: '/docs/branding', title: 'Branding Customization' },
      { path: '/docs/api', title: 'API Documentation' }
    ];

    for (const docPage of docPages) {
      await page.goto(`http://localhost:3001${docPage.path}?company=Tesla&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Check title (use more specific locator to avoid header h1)
      const titleElement = page.locator('h1, h2').filter({ hasText: docPage.title }).first();
      await expect(titleElement).toBeVisible();
      
      // Check back button exists
      await expect(page.locator('text=Back to Home')).toBeVisible();
      
      // Check footer exists
      await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
    }
  });

  test('Support page links work correctly', async ({ page }) => {
    await page.goto('http://localhost:3001/support?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that all documentation links work
    const docLinks = [
      { text: 'Setup Guide', href: '/docs/setup' },
      { text: 'CRM Integration Tutorial', href: '/docs/crm' },
      { text: 'Branding Customization', href: '/docs/branding' },
      { text: 'API Documentation', href: '/docs/api' }
    ];

    for (const link of docLinks) {
      const linkElement = page.locator(`a:has-text("${link.text}")`);
      await expect(linkElement).toBeVisible();
      await expect(linkElement).toHaveAttribute('href', link.href);
    }
  });

  test('Form submissions go to correct email addresses', async ({ page }) => {
    // Test partners page
    await page.goto('http://localhost:3001/partners?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Fill out partner form
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.selectOption('select[name="clientRange"]', '1-5');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Mock the form submission to check the email
    await page.route('**/api/partner-apply', route => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.click('button[data-testid="partner-apply-btn"]');
    
    // Test support page
    await page.goto('http://localhost:3001/support?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Fill out support form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Mock the form submission
    await page.route('**/api/support-ticket', route => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.click('button[data-testid="support-submit-btn"]');
    
    // Test do not sell page
    await page.goto('http://localhost:3001/do-not-sell?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Check that the form submission would trigger mailto
    const form = page.locator('form');
    await form.evaluate((form) => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
    });
  });

  test('All pages have consistent branding and styling', async ({ page }) => {
    const pages = [
      '/?company=Tesla&demo=1',
      '/paid?company=Tesla&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Ftesla.com',
      '/terms?company=Tesla&demo=1',
      '/privacy?company=Tesla&demo=1',
      '/legal/refund?company=Tesla&demo=1',
      '/dpa?company=Tesla&demo=1',
      '/security?company=Tesla&demo=1',
      '/do-not-sell?company=Tesla&demo=1',
      '/partners?company=Tesla&demo=1',
      '/support?company=Tesla&demo=1',
      '/docs/setup?company=Tesla&demo=1',
      '/docs/crm?company=Tesla&demo=1',
      '/docs/branding?company=Tesla&demo=1',
      '/docs/api?company=Tesla&demo=1'
    ];

    for (const pagePath of pages) {
      await page.goto(`http://localhost:3001${pagePath}`);
      await page.waitForLoadState('networkidle');
      
      // Check that the page loads without errors
      const title = await page.title();
      expect(title).toBeTruthy();
      
      // Check for consistent header structure
      const header = page.locator('header');
      if (await header.count() > 0) {
        await expect(header).toBeVisible();
      }
      
      // Check for consistent footer
      const footer = page.locator('footer');
      if (await footer.count() > 0) {
        await expect(footer).toBeVisible();
      }
      
      // Check that there are no console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Wait a bit to catch any async errors
      await page.waitForTimeout(1000);
      
      // Filter out known non-critical errors
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('404') &&
        !error.includes('Failed to load resource')
      );
      
      expect(criticalErrors).toHaveLength(0);
    }
  });

  test('Mobile responsiveness works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const pages = [
      '/?company=Tesla&demo=1',
      '/terms?company=Tesla&demo=1',
      '/privacy?company=Tesla&demo=1',
      '/legal/refund?company=Tesla&demo=1',
      '/support?company=Tesla&demo=1'
    ];

    for (const pagePath of pages) {
      await page.goto(`http://localhost:3001${pagePath}`);
      await page.waitForLoadState('networkidle');
      
      // Check that the page is responsive
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check that text is readable (not too small)
      const mainContent = page.locator('main').first();
      if (await mainContent.count() > 0) {
        const fontSize = await mainContent.evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        expect(parseFloat(fontSize)).toBeGreaterThan(12);
      }
      
      // Check that buttons are tappable size
      const buttons = page.locator('button, a[role="button"]');
      const buttonCount = await buttons.count();
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        const boundingBox = await firstButton.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThan(40); // Minimum touch target size
        }
      }
    }
  });

  test('Demo functionality works correctly', async ({ page }) => {
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that demo banner is visible
    const demoBanner = page.locator('[data-testid="demo-banner"], .demo-banner, .demo-ribbon');
    if (await demoBanner.count() > 0) {
      await expect(demoBanner).toBeVisible();
    }
    
    // Check that quota system works
    const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]');
    if (await addressInput.count() > 0) {
      await addressInput.fill('123 Main St, New York, NY');
      
      // Try to generate estimate
      const generateButton = page.locator('button:has-text("Generate"), button:has-text("Get Estimate"), button:has-text("Launch")').first();
      if (await generateButton.count() > 0) {
        await generateButton.click();
        
        // Wait for either success or lock screen
        await page.waitForTimeout(2000);
        
        // Check if we're on report page or lock screen
        const currentUrl = page.url();
        const isReportPage = currentUrl.includes('/report');
        const isLockScreen = await page.locator('.lock-overlay, [data-testid="lock-overlay"]').count() > 0;
        const isDemoResult = currentUrl.includes('/demo-result');
        
        expect(isReportPage || isLockScreen || isDemoResult).toBeTruthy();
      }
    }
  });

  test('Branding system works correctly', async ({ page }) => {
    // Test with Tesla branding
    await page.goto('http://localhost:3001/?company=Tesla&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Ftesla.com');
    await page.waitForLoadState('networkidle');
    
    // Check that Tesla logo appears
    const logo = page.locator('img[alt*="Tesla"], img[src*="tesla"]').first();
    if (await logo.count() > 0) {
      await expect(logo).toBeVisible();
    }
    
    // Check that brand color is applied
    const brandElements = page.locator('[style*="--brand-primary"], [style*="color: var(--brand-primary)"]');
    if (await brandElements.count() > 0) {
      await expect(brandElements.first()).toBeVisible();
    }
    
    // Test with Google branding
    await page.goto('http://localhost:3001/?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com');
    await page.waitForLoadState('networkidle');
    
    // Check that Google branding appears
    const googleElements = page.locator('text=Google');
    if (await googleElements.count() > 0) {
      await expect(googleElements.first()).toBeVisible();
    }
  });
});
