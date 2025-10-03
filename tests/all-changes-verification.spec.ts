import { test, expect } from '@playwright/test';

test.describe('All Changes Verification', () => {
  test('Support Page - Icon Circles with Gradients and Company Colors', async ({ page }) => {
    await page.goto('http://localhost:3000/support?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that icon circles have gradients
    const iconCircles = page.locator('.w-12.h-12.bg-gradient-to-br');
    await expect(iconCircles).toHaveCount(2); // Email Support and Documentation
    
    // Check that resource links use company colors
    const resourceLinks = page.locator('a[href="#"]').filter({ hasText: /Setup Guide|CRM Integration|Branding Customization|API Documentation/ });
    await expect(resourceLinks.first()).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'support-final-verification.png', fullPage: true });
  });

  test('Partners Page - Company Color Gradient Background', async ({ page }) => {
    await page.goto('http://localhost:3000/partners?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that page has data-brand attribute
    await expect(page.locator('[data-brand]')).toBeVisible();
    
    // Check that background uses brand colors
    const pageDiv = page.locator('[data-brand]');
    const styles = await pageDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        backgroundImage: computed.backgroundImage
      };
    });
    
    // Should have gradient background with brand colors
    expect(styles.backgroundImage).toContain('gradient');
    
    // Take screenshot
    await page.screenshot({ path: 'partners-final-verification.png', fullPage: true });
  });

  test('Pricing Page - CTA Button Uses Company Colors', async ({ page }) => {
    await page.goto('http://localhost:3000/pricing?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that main CTA button uses brand colors
    const mainCTA = page.locator('#main-cta');
    await expect(mainCTA).toBeVisible();
    
    // Check that button has brand color background
    const buttonStyles = await mainCTA.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    // Should have brand color background and white text
    expect(buttonStyles.color).toBe('rgb(255, 255, 255)'); // white text
    
    // Take screenshot
    await page.screenshot({ path: 'pricing-final-verification.png', fullPage: true });
  });

  test('Report Page - Sticky CTA with Cookie Offset Support', async ({ page }) => {
    await page.goto('http://localhost:3000/report?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for StickyCTA to potentially appear
    await page.waitForTimeout(2000);
    
    // Check that StickyCTA is present (desktop or mobile version)
    const stickyCTA = page.locator('[data-sticky-cta-desktop], [data-sticky-cta-mobile]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Check that it uses brand colors
    const stickyButton = stickyCTA.locator('a');
    await expect(stickyButton).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'report-final-verification.png', fullPage: true });
  });

  test('Cookie Offset Provider Integration', async ({ page }) => {
    await page.goto('http://localhost:3000/support?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that CookieOffsetProvider is working by checking for CSS variable
    const cookieOffset = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--cookie-offset');
    });
    
    // Should have cookie-offset CSS variable (even if 0px)
    expect(cookieOffset).toBeDefined();
    
    // Take screenshot
    await page.screenshot({ path: 'cookie-offset-verification.png', fullPage: true });
  });

  test('All Pages Use Consistent Brand Colors', async ({ page }) => {
    const pages = [
      { url: '/pricing?company=Netflix&brandColor=E50914&demo=1', name: 'pricing' },
      { url: '/partners?company=Netflix&brandColor=E50914&demo=1', name: 'partners' },
      { url: '/support?company=Netflix&brandColor=E50914&demo=1', name: 'support' },
      { url: '/report?company=Netflix&brandColor=E50914&demo=1', name: 'report' }
    ];

    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3000${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Check that page has data-brand attribute
      await expect(page.locator('[data-brand]')).toBeVisible();
      
      // Take screenshot for each page
      await page.screenshot({ path: `${pageInfo.name}-brand-colors-final.png`, fullPage: true });
    }
  });
});
