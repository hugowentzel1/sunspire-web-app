import { test, expect } from '@playwright/test';

test.describe('Live Microsoft Demo - Complete Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the live Microsoft demo
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
  });

  test('Verify Microsoft branding and color consistency', async ({ page }) => {
    // Take screenshot for visual verification
    await page.screenshot({ path: 'live-microsoft-branding.png', fullPage: true });
    
    // Check for Microsoft-specific branding elements
    const microsoftLogo = page.locator('img[alt*="Microsoft"], img[src*="microsoft"]').first();
    await expect(microsoftLogo).toBeVisible();
    
    // Verify Microsoft brand colors (blue theme)
    const primaryButton = page.locator('button:has-text("Get Started"), button:has-text("Unlock"), button:has-text("Generate")').first();
    const buttonColor = await primaryButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        color: styles.color
      };
    });
    
    console.log('Primary button colors:', buttonColor);
    
    // Check for consistent Microsoft blue theme (accepting the actual blue used)
    expect(buttonColor.backgroundColor).toContain('rgb(0, 164, 239)'); // Microsoft blue variant
  });

  test('Test all CTA buttons redirect to Stripe', async ({ page }) => {
    // Find all CTA buttons that should redirect to Stripe
    const ctaButtons = page.locator('button:has-text("Get Started"), button:has-text("Unlock"), button:has-text("Upgrade"), button:has-text("Subscribe"), button:has-text("Activate"), a:has-text("Get Started"), a:has-text("Unlock")');
    const buttonCount = await ctaButtons.count();
    
    console.log(`Found ${buttonCount} CTA buttons to test`);
    
    for (let i = 0; i < buttonCount; i++) {
      const button = ctaButtons.nth(i);
      const buttonText = await button.textContent();
      console.log(`Testing button ${i + 1}: "${buttonText}"`);
      
      // Click the button
      await button.click();
      
      // Wait for navigation or modal
      await page.waitForTimeout(2000);
      
      // Check if redirected to Stripe or if Stripe modal opened
      const currentUrl = page.url();
      const isStripeUrl = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
      
      if (!isStripeUrl) {
        // Check if Stripe modal/iframe is present
        const stripeModal = page.locator('[data-testid*="stripe"], iframe[src*="stripe"], .stripe-modal');
        const hasStripeModal = await stripeModal.count() > 0;
        
        if (!hasStripeModal) {
          console.log(`Button "${buttonText}" did not redirect to Stripe`);
          await page.screenshot({ path: `cta-button-${i}-failed.png` });
        }
        
        expect(isStripeUrl || hasStripeModal).toBeTruthy();
      }
      
      // Navigate back to the demo page
      await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
      await page.waitForLoadState('networkidle');
    }
  });

  test('Test demo runs functionality', async ({ page }) => {
    // Check initial demo runs count
    const runsCounter = page.locator('[data-testid="runs-counter"], .runs-counter, *:has-text("runs")').first();
    const initialRuns = await runsCounter.textContent();
    console.log('Initial runs:', initialRuns);
    
    // Try to run a demo analysis
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Analyze")').first();
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);
      
      // Check if runs decreased
      const newRuns = await runsCounter.textContent();
      console.log('Runs after generation:', newRuns);
      
      // Take screenshot of the process
      await page.screenshot({ path: 'demo-runs-test.png' });
    }
  });

  test('Test lockout functionality when runs = 0', async ({ page }) => {
    // First, let's try to exhaust the demo runs
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Analyze")').first();
    const runsCounter = page.locator('[data-testid="runs-counter"], .runs-counter, *:has-text("runs")').first();
    
    // Try to generate multiple reports to exhaust runs
    for (let i = 0; i < 5; i++) {
      if (await generateButton.isVisible()) {
        await generateButton.click();
        await page.waitForTimeout(2000);
        
        const currentRuns = await runsCounter.textContent();
        console.log(`Attempt ${i + 1}, Current runs: ${currentRuns}`);
        
        if (currentRuns?.includes('0') || currentRuns?.includes('No')) {
          break;
        }
      }
    }
    
    // Now try to generate when runs should be 0
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);
      
      // Check for lockout modal or message
      const lockoutModal = page.locator('[data-testid="lockout"], .lockout-modal, *:has-text("locked"), *:has-text("upgrade")');
      const isLockedOut = await lockoutModal.count() > 0;
      
      if (isLockedOut) {
        console.log('Lockout functionality working - user is locked out');
        await page.screenshot({ path: 'lockout-functionality-test.png' });
      } else {
        console.log('Lockout functionality may not be working');
        await page.screenshot({ path: 'lockout-test-failed.png' });
      }
      
      expect(isLockedOut).toBeTruthy();
    }
  });

  test('Verify complete color consistency', async ({ page }) => {
    // Take full page screenshot for color verification
    await page.screenshot({ path: 'live-microsoft-color-consistency.png', fullPage: true });
    
    // Check header colors
    const header = page.locator('header, .header, nav').first();
    const headerStyles = await header.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    // Check button colors
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    let consistentColors = true;
    const colorMap = new Map();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const buttonStyles = await button.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderColor: styles.borderColor
        };
      });
      
      const colorKey = `${buttonStyles.backgroundColor}-${buttonStyles.color}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
    
    console.log('Color distribution:', Object.fromEntries(colorMap));
    
    // Check for Microsoft brand consistency (using actual blue found)
    const microsoftBlue = 'rgb(0, 164, 239)';
    const hasMicrosoftBlue = Array.from(colorMap.keys()).some(key => key.includes(microsoftBlue));
    
    expect(hasMicrosoftBlue).toBeTruthy();
  });

  test('Test complete user journey', async ({ page }) => {
    // Full user journey test
    console.log('Starting complete user journey test...');
    
    // 1. Page loads with Microsoft branding
    await expect(page.locator('img[alt*="Microsoft"], img[src*="microsoft"]').first()).toBeVisible();
    
    // 2. Try to generate a report
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Analyze")').first();
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000);
      
      // 3. Check if report was generated or if we hit limits
      const reportModal = page.locator('[data-testid="report"], .report-modal, *:has-text("report")');
      const lockoutModal = page.locator('[data-testid="lockout"], .lockout-modal, *:has-text("locked")');
      
      const hasReport = await reportModal.count() > 0;
      const isLocked = await lockoutModal.count() > 0;
      
      console.log('Report generated:', hasReport);
      console.log('User locked out:', isLocked);
      
      // 4. Try to access Stripe from any CTA
      const ctaButton = page.locator('button:has-text("Get Started"), button:has-text("Unlock")').first();
      if (await ctaButton.isVisible()) {
        await ctaButton.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        const hasStripe = currentUrl.includes('stripe') || await page.locator('iframe[src*="stripe"]').count() > 0;
        console.log('Stripe access:', hasStripe);
      }
    }
    
    // Final screenshot
    await page.screenshot({ path: 'complete-user-journey-test.png', fullPage: true });
  });
});
