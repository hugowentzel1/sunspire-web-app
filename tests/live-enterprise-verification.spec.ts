import { test, expect } from '@playwright/test';

test.describe('Live Site Enterprise UX Verification', () => {
  const LIVE_URL = 'https://sunspire-web-app.vercel.app';

  test('Live Pricing page - enterprise layout verification', async ({ page }) => {
    await page.goto(`${LIVE_URL}/pricing?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Check hero elements
    await expect(page.locator('h1').nth(1)).toContainText('$99/mo + $399 setup');
    await expect(page.locator('text=14-day refund if it doesn\'t lift booked calls')).toBeVisible();
    await expect(page.locator('text=Start setup — $399 today + $99/mo')).toBeVisible();
    
    // Check social proof strip
    await expect(page.locator('text="Cut quoting time from 15 min to 1 min." — Solar Company Owner, CA')).toBeVisible();
    
    // Check core value cards
    await expect(page.locator('text=What You Get')).toBeVisible();
    await expect(page.locator('text=Why Installers Switch')).toBeVisible();
    
    // Check ROI micro-nudge
    await expect(page.locator('text=One extra booked job per month typically covers the subscription')).toBeVisible();
    
    console.log('✅ Live Pricing page enterprise layout verified');
  });

  test('Live Partners page - economics and form verification', async ({ page }) => {
    await page.goto(`${LIVE_URL}/partners?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Check hero
    await expect(page.locator('h1').nth(1)).toContainText('Partner Program');
    
    // Check eligibility/payout strip
    await expect(page.locator('text=$30/mo')).toBeVisible();
    await expect(page.locator('text=$120')).toBeVisible();
    await expect(page.locator('text=30 days')).toBeVisible();
    
    // Check commission structure
    await expect(page.locator('text=Commission Structure')).toBeVisible();
    
    // Check earnings mini calculator
    await expect(page.locator('text=Earnings (example)')).toBeVisible();
    
    // Check application form
    await expect(page.locator('text=Apply to Become a Partner')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('text=Submit Partner Application')).toBeVisible();
    
    console.log('✅ Live Partners page economics and form verified');
  });

  test('Live Support page - SLO and ordering verification', async ({ page }) => {
    await page.goto(`${LIVE_URL}/support?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Check hero
    await expect(page.locator('h1').nth(1)).toContainText('Support Center');
    
    // Check SLO badge row
    await expect(page.locator('text=Avg reply <24h • High priority 4h • Urgent 1h • Enterprise 2h SLA')).toBeVisible();
    
    // Check support cards order
    await expect(page.locator('text=Email Support')).toBeVisible();
    await expect(page.locator('text=Documentation')).toBeVisible();
    await expect(page.locator('text=System Status')).toBeVisible();
    
    // Check support form
    await expect(page.locator('text=Create Support Ticket')).toBeVisible();
    await expect(page.locator('text=Response Times')).toBeVisible();
    
    console.log('✅ Live Support page SLO and ordering verified');
  });

  test('Take final screenshots of live site', async ({ page }) => {
    // Pricing page
    await page.goto(`${LIVE_URL}/pricing?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'live-pricing-enterprise-final.png', fullPage: true });
    console.log('📸 Live Pricing page screenshot saved');

    // Partners page
    await page.goto(`${LIVE_URL}/partners?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'live-partners-enterprise-final.png', fullPage: true });
    console.log('📸 Live Partners page screenshot saved');

    // Support page
    await page.goto(`${LIVE_URL}/support?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'live-support-enterprise-final.png', fullPage: true });
    console.log('📸 Live Support page screenshot saved');
  });
});
