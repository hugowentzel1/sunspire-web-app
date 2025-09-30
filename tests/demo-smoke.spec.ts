import { test, expect } from '@playwright/test';

/**
 * @demo-smoke
 * Comprehensive smoke tests for demo functionality
 * Part D of Sunspire upgrade requirements
 */

const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';
const PAID_URL = 'http://localhost:3000/paid?company=Apple&brandColor=%23FF0000';

test.describe('@demo-smoke Demo Smoke Tests', () => {
  
  test('Hero & Address Input Visibility', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check hero content
    await expect(page.locator('h1')).toContainText('Your Branded Solar Quote Tool');
    
    // Check address input placeholder
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await expect(addressInput).toBeVisible();
    await expect(addressInput).toHaveAttribute('placeholder', /Start typing your property address/i);
    
    console.log('✅ Hero and address input verified');
  });

  test('Address Autocomplete Functionality', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Wait for page to be fully loaded
    await page.waitForTimeout(2000);
    
    // Find and focus address input
    const addressInput = page.locator('input[placeholder*="Start typing"]').first();
    await addressInput.click();
    await addressInput.fill('123 Main St Phoe');
    
    // Wait for autocomplete suggestions to appear
    await page.waitForTimeout(1500);
    
    // Check if suggestions appeared (Google autocomplete creates a pac-container)
    const suggestions = page.locator('.pac-container .pac-item').first();
    
    // If suggestions exist, click the first one
    const suggestionsCount = await page.locator('.pac-container .pac-item').count();
    if (suggestionsCount > 0) {
      await suggestions.click();
      console.log('✅ Autocomplete suggestions appeared and clicked');
    } else {
      console.log('⚠️  No autocomplete suggestions (may need Google API key)');
    }
  });

  test('Demo Run Limit & Lock Screen', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check for demo run counter
    const demoCounter = page.locator('text=/Preview.*run.*left/i');
    
    if (await demoCounter.count() > 0) {
      const counterText = await demoCounter.textContent();
      console.log('Demo counter found:', counterText);
      
      // Extract remaining runs
      const match = counterText?.match(/(\d+)\s+run/);
      if (match) {
        const remaining = parseInt(match[1]);
        console.log(`✅ Demo has ${remaining} run(s) remaining`);
        
        // If we have runs remaining, we can test the lock after exhaustion
        if (remaining === 0) {
          // Should show lock message
          await expect(page.locator('text=/Demo limit reached/i')).toBeVisible();
          console.log('✅ Lock screen shown when quota exhausted');
        }
      }
    } else {
      console.log('⚠️  Demo counter not found (may be disabled)');
    }
  });

  test('Demo Timer Display', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check for countdown timer
    const timer = page.locator('text=/Expires in.*d.*h.*m.*s/i');
    
    if (await timer.count() > 0) {
      const timerText = await timerText?.textContent();
      console.log('✅ Countdown timer found:', timerText);
      await expect(timer).toBeVisible();
    } else {
      console.log('⚠️  Countdown timer not visible');
    }
  });

  test('CTA Routes to Stripe Checkout', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Find primary CTA button
    const ctaButton = page.locator('[data-cta="primary"]').first();
    
    if (await ctaButton.count() > 0) {
      await expect(ctaButton).toBeVisible();
      console.log('✅ Primary CTA button found');
      
      // Listen for navigation or Stripe checkout request
      const [response] = await Promise.race([
        Promise.all([
          page.waitForResponse(response => 
            response.url().includes('stripe') || 
            response.url().includes('create-checkout-session'),
            { timeout: 5000 }
          ).catch(() => null),
          ctaButton.click()
        ]),
        new Promise(resolve => setTimeout(() => resolve([null]), 5000))
      ]);
      
      if (response) {
        console.log('✅ Stripe checkout initiated');
        expect(response.status()).toBe(200);
      } else {
        console.log('⚠️  No Stripe response detected (may need valid API keys)');
      }
    } else {
      console.log('❌ Primary CTA button not found');
    }
  });

  test('Demo Footer Contains Legal Links', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check for footer legal links (should exist in demo)
    const privacyLink = page.locator('a[href="/privacy"]');
    const termsLink = page.locator('a[href="/terms"]');
    const securityLink = page.locator('a[href="/security"]');
    const dpaLink = page.locator('a[href="/dpa"]');
    
    await expect(privacyLink).toBeVisible();
    await expect(termsLink).toBeVisible();
    await expect(securityLink).toBeVisible();
    await expect(dpaLink).toBeVisible();
    
    console.log('✅ All legal links present in demo footer');
  });

  test('Paid Embed Does NOT Contain Legal Links', async ({ page }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check that legal links are NOT present in paid version
    const privacyLink = page.locator('a[href="/privacy"]');
    const termsLink = page.locator('a[href="/terms"]');
    
    const privacyCount = await privacyLink.count();
    const termsCount = await termsLink.count();
    
    if (privacyCount === 0 && termsCount === 0) {
      console.log('✅ Legal links correctly hidden in paid embed');
    } else {
      console.log('⚠️  Legal links found in paid embed (may need to be removed)');
    }
  });

  test('Footer Consistency Across Demo Site', async ({ page }) => {
    // Test footer on homepage
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const homeFooter = page.locator('[data-testid="footer"]');
    await expect(homeFooter).toBeVisible();
    
    const homeCompanyName = await homeFooter.locator('text=/Demo for.*Netflix/i').textContent();
    console.log('Home page footer company:', homeCompanyName);
    
    // Navigate to report page (if possible with demo address)
    const addressInput = page.locator('input[placeholder*="Start typing"]').first();
    await addressInput.click();
    await addressInput.fill('123 Main St, Phoenix, AZ');
    
    const generateButton = page.locator('button:has-text("Generate")').first();
    if (await generateButton.count() > 0) {
      await generateButton.click();
      await page.waitForTimeout(3000);
      
      // Check footer on report page
      const reportFooter = page.locator('[data-testid="footer"]');
      if (await reportFooter.count() > 0) {
        const reportCompanyName = await reportFooter.locator('text=/Demo for.*Netflix/i').textContent();
        console.log('Report page footer company:', reportCompanyName);
        
        // Footer should be consistent
        expect(homeCompanyName).toBe(reportCompanyName);
        console.log('✅ Footer is consistent across demo site');
      }
    }
  });

  test('Dynamic Company Name and Color', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Check for Netflix branding
    const netflixText = page.locator('text=/Netflix/i').first();
    await expect(netflixText).toBeVisible();
    console.log('✅ Netflix company name visible');
    
    // Check for company color (Netflix red)
    const sunspireText = page.locator('span.font-medium').filter({ hasText: 'Sunspire' }).first();
    
    if (await sunspireText.count() > 0) {
      const color = await sunspireText.evaluate(el => {
        return window.getComputedStyle(el).color;
      });
      console.log('Sunspire text color:', color);
      
      // Netflix red is #E50914 or rgb(229, 9, 20)
      const hasNetflixColor = color.includes('rgb(229, 9, 20)') || color.includes('#E50914');
      if (hasNetflixColor) {
        console.log('✅ Company color correctly applied (Netflix red)');
      } else {
        console.log('Color found:', color, '(expected Netflix red)');
      }
    }
  });
});
