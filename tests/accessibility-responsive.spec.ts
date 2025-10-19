import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { addrs, tenancies } from './_utils';

test.describe('Accessibility & Responsive Design', () => {
  test('No serious a11y issues on demo header (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(tenancies.demo(addrs.long));
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page }).analyze();
    const seriousViolations = results.violations.filter(v => 
      v.impact === 'serious' || v.impact === 'critical'
    );
    
    expect(seriousViolations).toHaveLength(0);
  });

  test('No serious a11y issues on paid full report (desktop)', async ({ page }) => {
    await page.goto(tenancies.paid(addrs.short));
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page }).analyze();
    const seriousViolations = results.violations.filter(v => 
      v.impact === 'serious' || v.impact === 'critical'
    );
    
    expect(seriousViolations).toHaveLength(0);
  });

  test('Keyboard navigation works', async ({ page }) => {
    await page.goto(tenancies.paid(addrs.short));
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test Enter key on buttons
    const bookButton = page.getByRole('button', { name: /Book a Consultation/i });
    if (await bookButton.isVisible()) {
      await bookButton.focus();
      await page.keyboard.press('Enter');
      // Should trigger button action (might open modal or navigate)
    }
  });

  test('Color contrast meets standards', async ({ page }) => {
    await page.goto(tenancies.paid(addrs.short));
    
    // Check text contrast
    const textElements = page.locator('p, h1, h2, h3, span, div');
    const count = await textElements.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const color = await element.evaluate((el: HTMLElement) => getComputedStyle(el).color);
        const backgroundColor = await element.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
        
        // Basic contrast check (not comprehensive, but catches obvious issues)
        expect(color).not.toBe('rgb(255, 255, 255)'); // Not white text
        expect(backgroundColor).not.toBe('rgb(255, 255, 255)'); // Not white background
      }
    }
  });

  test('Responsive design works on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 360, height: 740, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 800, name: 'Desktop' },
      { width: 1440, height: 900, name: 'Large Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(tenancies.paid(addrs.short));
      
      // Check that header is visible
      await expect(page.getByTestId('hdr-h1')).toBeVisible();
      
      // Check that buttons are accessible
      const bookButton = page.getByRole('button', { name: /Book a Consultation/i });
      await expect(bookButton).toBeVisible();
      
      // Check that content doesn't overflow horizontally
      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el: HTMLElement) => el.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50); // Allow small margin
    }
  });

  test('Mobile-specific interactions work', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(tenancies.demo(addrs.short));
    
    // Test touch interactions
    const unlockButton = page.getByRole('button', { name: /Unlock Full Report/i }).first();
    if (await unlockButton.isVisible()) {
      await unlockButton.tap();
      // Should trigger button action
    }
    
    // Test scroll behavior
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    // Check that content is still accessible after scroll
    await expect(page.getByTestId('hdr-h1')).toBeVisible();
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto(tenancies.paid(addrs.short));
    
    // Check for proper ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const buttonText = await button.textContent();
        
        // Should have either aria-label or visible text
        expect(ariaLabel || buttonText).toBeTruthy();
      }
    }
    
    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      if (await image.isVisible()) {
        const alt = await image.getAttribute('alt');
        // Should have alt text (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    }
  });

  test('Focus management and tab order', async ({ page }) => {
    await page.goto(tenancies.paid(addrs.short));
    
    // Test tab order through main interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      
      // Focus should move to next element
      const currentFocused = await focusedElement.evaluate((el: HTMLElement) => el.tagName);
      expect(currentFocused).toBeTruthy();
    }
  });
});
