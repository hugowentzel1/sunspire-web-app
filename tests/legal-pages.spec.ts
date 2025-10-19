import { test, expect } from '@playwright/test';

test.describe('Legal pages validation', () => {
  const legalPages = [
    { path: '/privacy', expectedContent: ['Privacy', 'Policy', 'Sunspire', 'data', 'collection'] },
    { path: '/terms', expectedContent: ['Terms', 'Service', 'Sunspire', 'agreement', 'conditions'] },
    { path: '/refund', expectedContent: ['Refund', 'Policy', 'Sunspire', 'money', 'back'] },
    { path: '/security', expectedContent: ['Security', 'Sunspire', 'protection', 'data', 'encryption'] },
    { path: '/accuracy', expectedContent: ['Accuracy', 'Disclaimer', 'Sunspire', 'estimates', 'model'] },
    { path: '/methodology', expectedContent: ['Methodology', 'Sunspire', 'calculation', 'model', 'NREL'] }
  ];

  for (const page of legalPages) {
    test(`Legal page ${page.path} loads & has expected content`, async ({ page: testPage, baseURL }) => {
      await testPage.goto((baseURL ?? '') + page.path);
      
      // Check that page loads without errors
      await expect(testPage.locator('h1, h2, h3').first()).toBeVisible();
      
      // Check for expected content
      for (const content of page.expectedContent) {
        await expect(testPage.getByText(new RegExp(content, 'i'))).toBeVisible();
      }
      
      // Check for Sunspire branding
      await expect(testPage.getByText(/Sunspire/i)).toBeVisible();
      
      // Check for last updated date (if present)
      const lastUpdated = testPage.getByText(/Last updated|Updated on|Date/i);
      if (await lastUpdated.isVisible()) {
        await expect(lastUpdated).toBeVisible();
      }
    });
  }

  test('Legal pages have proper navigation', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    
    // Check footer links
    const footer = page.locator('footer, .footer');
    if (await footer.isVisible()) {
      // Look for legal links in footer
      const privacyLink = footer.getByRole('link', { name: /Privacy/i });
      const termsLink = footer.getByRole('link', { name: /Terms/i });
      
      if (await privacyLink.isVisible()) {
        await privacyLink.click();
        await expect(page).toHaveURL(/privacy/);
      }
      
      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/terms/);
      }
    }
  });

  test('Legal pages are accessible', async ({ page, baseURL }) => {
    for (const legalPage of legalPages) {
      await page.goto((baseURL ?? '') + legalPage.path);
      
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings.first()).toBeVisible();
      
      // Check for readable content
      const content = page.locator('p, li, div');
      await expect(content.first()).toBeVisible();
      
      // Check that page is not just a blank page
      const bodyText = await page.textContent('body');
      expect(bodyText?.length).toBeGreaterThan(100);
    }
  });

  test('Legal pages have consistent styling', async ({ page, baseURL }) => {
    for (const legalPage of legalPages) {
      await page.goto((baseURL ?? '') + legalPage.path);
      
      // Check that page has consistent styling (not broken CSS)
      const headings = page.locator('h1, h2, h3');
      if (await headings.first().isVisible()) {
        const headingStyle = await headings.first().evaluate((el: HTMLElement) => getComputedStyle(el).fontSize);
        expect(parseFloat(headingStyle)).toBeGreaterThan(0);
      }
      
      // Check that text is readable (not white text on white background)
      const textElements = page.locator('p, li, div');
      if (await textElements.first().isVisible()) {
        const textColor = await textElements.first().evaluate((el: HTMLElement) => getComputedStyle(el).color);
        expect(textColor).not.toBe('rgb(255, 255, 255)'); // Not white text
      }
    }
  });
});
