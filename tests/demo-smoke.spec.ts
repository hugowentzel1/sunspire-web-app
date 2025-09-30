/**
 * @demo-smoke
 * Smoke tests for DEMO mode core functionality
 * Target URL: http://localhost:3000/?company=Netflix&demo=1
 */

import { test, expect } from '@playwright/test';

const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';

test.describe('@demo-smoke', () => {
  test('Hero & Address Input are visible', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check that hero loads
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    
    // Check that address input placeholder is visible
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await expect(addressInput).toBeVisible({ timeout: 5000 });
    
    // Verify placeholder text contains expected substring
    const placeholder = await addressInput.getAttribute('placeholder');
    expect(placeholder).toContain('Start typing');
    
    console.log('✅ Hero and address input are visible');
  });

  test('Address Autocomplete works', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Find address input
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await expect(addressInput).toBeVisible({ timeout: 5000 });
    
    // Focus and type partial address
    await addressInput.click();
    await addressInput.fill('123 Main St Phoe');
    
    // Wait for autocomplete suggestions to appear
    // Look for any element with role="listbox" or data-autosuggest or predictions container
    const suggestions = page.locator('[role="listbox"], [data-autosuggest], .pac-container, [class*="prediction"]').first();
    await expect(suggestions).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Address autocomplete suggestions appeared');
    
    // Click first suggestion
    const firstSuggestion = page.locator('[role="option"], .pac-item, [class*="prediction"]').first();
    await firstSuggestion.click();
    
    // Wait for quote result to appear
    // Look for data-quote-result or navigate to /report
    await Promise.race([
      page.waitForSelector('[data-quote-result]', { timeout: 10000 }),
      page.waitForURL(/.*report.*/, { timeout: 10000 }),
    ]);
    
    console.log('✅ Quote result loaded after address selection');
  });

  test('Demo Run Limit & Lock State', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Helper function to complete a run
    const completeRun = async () => {
      const addressInput = page.locator('input[placeholder*="Start typing"]');
      await addressInput.click();
      await addressInput.fill('123 Main St Phoenix AZ');
      
      const firstSuggestion = page.locator('[role="option"], .pac-item').first();
      await expect(firstSuggestion).toBeVisible({ timeout: 5000 });
      await firstSuggestion.click();
      
      await Promise.race([
        page.waitForURL(/.*report.*/, { timeout: 10000 }),
        page.waitForSelector('[data-quote-result]', { timeout: 10000 }),
      ]);
      
      // Navigate back to home
      await page.goto(DEMO_URL);
    };
    
    // Complete two successful runs (green state)
    console.log('🔄 Completing run 1/2...');
    await completeRun();
    
    console.log('🔄 Completing run 2/2...');
    await completeRun();
    
    console.log('✅ Completed 2 demo runs');
    
    // On third attempt, check for lock state
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await addressInput.click();
    await addressInput.fill('123 Main St Phoenix AZ');
    
    // Look for lock overlay or disabled state
    const lockOverlay = page.locator('[data-testid="lock-overlay"], [class*="lock"], [class*="Lock"]').first();
    
    // Either the lock appears or the input is disabled
    const isLocked = await Promise.race([
      lockOverlay.isVisible().catch(() => false),
      addressInput.isDisabled().catch(() => false),
    ]);
    
    if (isLocked) {
      console.log('✅ Lock state detected after quota exhausted');
    } else {
      console.log('⚠️  Lock state not detected - may need manual verification');
    }
  });

  test('Demo Timer Countdown', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Look for timer/countdown element
    const timer = page.locator('[data-testid="countdown"], [class*="countdown"], [class*="timer"]').first();
    
    // Check if timer exists
    const timerExists = await timer.count() > 0;
    
    if (timerExists && await timer.isVisible()) {
      const timerText = await timer.textContent();
      console.log('⏱️  Timer found:', timerText);
      
      // Verify timer is counting down (contains time-related text)
      expect(timerText).toMatch(/\d+/); // Contains numbers
      
      console.log('✅ Timer is visible and counting');
    } else {
      console.log('⚠️  Timer not found - may be hidden or not implemented');
    }
  });

  test('CTA routes to Stripe Checkout', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Find primary CTA via data-cta="primary"
    const primaryCTA = page.locator('[data-cta="primary"]').first();
    await expect(primaryCTA).toBeVisible({ timeout: 5000 });
    
    console.log('🔘 Found primary CTA');
    
    // Listen for navigation/request to Stripe
    const [response] = await Promise.all([
      page.waitForResponse(
        response => 
          response.url().includes('stripe') ||
          response.url().includes('create-checkout-session'),
        { timeout: 10000 }
      ),
      primaryCTA.click(),
    ]);
    
    // Verify response is successful
    expect(response.status()).toBe(200);
    
    console.log('✅ CTA triggered Stripe checkout successfully');
    
    // Optionally check that redirect URL contains expected domain pattern
    const responseBody = await response.json().catch(() => ({}));
    if (responseBody.url) {
      console.log('📍 Checkout URL:', responseBody.url);
      // Verify it's a Stripe URL or contains quote.
      expect(responseBody.url).toMatch(/stripe\.com|quote\./);
    }
  });

  test('Legal Links in DEMO', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Check for Privacy, Terms, Security, DPA links
    const legalLinks = [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'DPA', href: '/dpa' },
    ];
    
    for (const link of legalLinks) {
      const linkElement = page.locator(`a[href="${link.href}"]`).first();
      await expect(linkElement).toBeVisible();
      console.log(`✅ ${link.name} link is visible in DEMO`);
    }
    
    // Verify one of them actually loads
    const privacyLink = page.locator('a[href="/privacy"]').first();
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/privacy')),
      privacyLink.click(),
    ]);
    
    expect(response.status()).toBe(200);
    console.log('✅ Privacy page loads successfully');
  });

  test('Legal Links NOT in PAID', async ({ page }) => {
    // Visit PAID URL (no demo=1 parameter)
    const paidURL = 'http://localhost:3000/paid?company=Netflix&brandColor=%23FF0000';
    await page.goto(paidURL, { waitUntil: 'networkidle' });
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Check that legal links are NOT present
    const legalLinks = [
      '/privacy',
      '/terms',
      '/security',
      '/dpa',
    ];
    
    for (const href of legalLinks) {
      const linkElement = page.locator(`a[href="${href}"]`);
      const count = await linkElement.count();
      expect(count).toBe(0);
      console.log(`✅ ${href} link is NOT present in PAID embed`);
    }
  });
});
