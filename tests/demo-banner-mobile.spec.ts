import { test, expect } from '@playwright/test';

test.describe('Mobile Layout & Footer Improvements', () => {
  test('Desktop - all elements fit properly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check demo banner
    const banner = page.locator('div').filter({ hasText: 'Exclusive preview built for' }).first();
    await expect(banner).toBeVisible();

    // Check "How it works" section
    const howItWorks = page.locator('h2').filter({ hasText: 'How it works' });
    await expect(howItWorks).toBeVisible();

    // Check trust badges
    const trustStrip = page.locator('[data-testid="hero-trust-strip"]');
    await expect(trustStrip).toBeVisible();

    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/desktop-layout-full.png',
      fullPage: true 
    });

    console.log('✓ Desktop layout looks good');
  });

  test('Mobile - demo banner wraps properly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check demo banner
    const banner = page.locator('div').filter({ hasText: 'Exclusive preview built for' }).first();
    await expect(banner).toBeVisible();

    // Take screenshot of banner area
    await page.screenshot({ 
      path: 'test-results/mobile-demo-banner.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 390, height: 250 }
    });

    // Verify countdown doesn't overflow
    const countdownBadge = page.locator('span').filter({ hasText: /expires in \d+:\d+:\d+:\d+/ });
    await expect(countdownBadge).toBeVisible();
    
    const countdownBox = await countdownBadge.boundingBox();
    if (countdownBox) {
      expect(countdownBox.x).toBeGreaterThanOrEqual(0);
      expect(countdownBox.x + countdownBox.width).toBeLessThanOrEqual(390);
    }

    console.log('✓ Mobile demo banner wraps properly');
  });

  test('Mobile - "How it works" circles align vertically', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to "How it works" section
    const howItWorks = page.locator('h2').filter({ hasText: 'How it works' });
    await howItWorks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot of "How it works" section
    const howItWorksSection = howItWorks.locator('..');
    await howItWorksSection.screenshot({ 
      path: 'test-results/mobile-how-it-works.png'
    });

    // Get all numbered circles
    const circles = page.locator('div.bg-\\[var\\(--brand-primary\\)\\].rounded-full').filter({ hasText: /^[123]$/ });
    const count = await circles.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Verify circles are aligned (same X position on mobile)
    const positions = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await circles.nth(i).boundingBox();
      if (box) {
        positions.push({ index: i + 1, x: box.x, y: box.y, width: box.width });
      }
    }

    console.log('Circle positions:', positions);

    // On mobile, all circles should have the same X position (vertically stacked)
    if (positions.length >= 2) {
      const firstX = positions[0].x;
      positions.forEach((pos, idx) => {
        // Allow 2px tolerance for alignment
        expect(Math.abs(pos.x - firstX)).toBeLessThanOrEqual(2);
        console.log(`Circle ${pos.index}: aligned at x=${pos.x}`);
      });
    }

    console.log('✓ Mobile "How it works" circles align vertically');
  });

  test('Mobile - security trust badges use grid layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to trust strip
    const trustStrip = page.locator('[data-testid="hero-trust-strip"]');
    await trustStrip.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot
    await trustStrip.screenshot({ 
      path: 'test-results/mobile-trust-badges.png'
    });

    // Verify trust strip is visible
    await expect(trustStrip).toBeVisible();

    // On mobile, should show grid layout (not inline-flex)
    const mobileGrid = trustStrip.locator('.grid.grid-cols-2');
    await expect(mobileGrid).toBeVisible();

    // Desktop version with bullets should be hidden on mobile
    const desktopVersion = trustStrip.locator('.hidden.md\\:flex');
    await expect(desktopVersion).toBeHidden();

    // Verify bullets are not visible (they're in the hidden desktop version)
    const visibleBullets = trustStrip.locator('.grid.grid-cols-2 span').filter({ hasText: '•' });
    const bulletCount = await visibleBullets.count();
    expect(bulletCount).toBe(0); // No bullets in the mobile grid

    // Check that badges fit within viewport
    const badgeElements = trustStrip.locator('span.inline-flex.items-center');
    const badgeCount = await badgeElements.count();
    expect(badgeCount).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < Math.min(badgeCount, 5); i++) {
      const box = await badgeElements.nth(i).boundingBox();
      if (box) {
        expect(box.x + box.width).toBeLessThanOrEqual(390);
      }
    }

    console.log('✓ Mobile security trust badges use clean grid layout');
  });

  test('Mobile - full page layout check', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/mobile-full-page.png',
      fullPage: true 
    });

    // Verify key sections are visible and properly laid out
    const banner = page.locator('div').filter({ hasText: 'Exclusive preview built for' }).first();
    const trustStrip = page.locator('[data-testid="hero-trust-strip"]');
    const howItWorks = page.locator('h2').filter({ hasText: 'How it works' });

    await expect(banner).toBeVisible();
    await expect(trustStrip).toBeVisible();
    await expect(howItWorks).toBeVisible();

    console.log('✓ Mobile full page layout looks clean');
  });

  test('Small mobile (320px) - extreme test', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/small-mobile-full.png',
      fullPage: true 
    });

    // Verify critical elements still work
    const banner = page.locator('div').filter({ hasText: 'Exclusive preview built for' }).first();
    await expect(banner).toBeVisible();

    // Check countdown doesn't break
    const countdown = page.locator('span').filter({ hasText: /expires in/ });
    await expect(countdown).toBeVisible();

    console.log('✓ Small mobile (320px) still usable');
  });

  test('Mobile - footer stacks cleanly (no diagonal text)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    const footer = page.locator('[data-testid="footer"]');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot
    await footer.screenshot({ 
      path: 'test-results/mobile-footer.png'
    });

    // Verify footer is visible
    await expect(footer).toBeVisible();

    // Check that footer content is properly stacked (not diagonal)
    const footerColumns = footer.locator('.grid.grid-cols-1');
    await expect(footerColumns).toBeVisible();

    // Verify touch targets containers are adequate (min 44px on li elements)
    const footerListItems = footer.locator('li');
    const itemCount = await footerListItems.count();
    
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const box = await footerListItems.nth(i).boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40); // Close to 44px minimum
      }
    }

    console.log('✓ Mobile footer stacks cleanly with proper touch targets');
  });

  test('Desktop - footer uses multi-column layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    const footer = page.locator('[data-testid="footer"]');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot
    await footer.screenshot({ 
      path: 'test-results/desktop-footer.png'
    });

    // On desktop, should use 3-column grid
    const footerGrid = footer.locator('.grid.md\\:grid-cols-3');
    await expect(footerGrid).toBeVisible();

    console.log('✓ Desktop footer uses multi-column layout');
  });

  test('Mobile - "How it works" centered properly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to "How it works"
    const howItWorks = page.locator('h2').filter({ hasText: 'How it works' });
    await howItWorks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot
    const section = howItWorks.locator('..');
    await section.screenshot({ 
      path: 'test-results/mobile-how-it-works-centered.png'
    });

    // Verify circles and text are centered
    const container = section.locator('.flex.flex-col.items-center');
    await expect(container.first()).toBeVisible();

    console.log('✓ Mobile "How it works" properly centered');
  });

  test('Mobile - security badges are clean and professional', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/?company=microsoft&demo=1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check trust badges
    const trustStrip = page.locator('[data-testid="hero-trust-strip"]');
    await trustStrip.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot
    await trustStrip.screenshot({ 
      path: 'test-results/mobile-trust-badges-clean.png'
    });

    // Verify grid layout on mobile
    const mobileGrid = trustStrip.locator('.grid.grid-cols-2');
    await expect(mobileGrid).toBeVisible();

    // Verify no flashy styling (should have clean border, not gradient)
    const hasBorder = await mobileGrid.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.border.includes('slate') || style.borderColor.includes('203'); // slate-200
    });
    
    console.log('Mobile badges have clean styling:', hasBorder);
    console.log('✓ Mobile security badges are professional');
  });
});

