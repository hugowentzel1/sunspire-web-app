import { test, expect } from '@playwright/test';

const PAID_URL = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
const DEMO_URL = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';

test.describe('Final Verification Tests', () => {
  test('Paid version - brand colors and green checkmark', async ({ page }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    
    // Wait for everything to load
    await page.waitForTimeout(5000);
    
    // Check CSS variable
    const brandColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
    });
    
    console.log('CSS variable --brand-primary:', brandColor);
    
    // Check checkmark color (should be green)
    const checkmark = page.locator('.absolute.-top-6.-right-4.w-12.h-12.rounded-full').first();
    const checkmarkColor = await checkmark.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    console.log('Checkmark colors:', checkmarkColor);
    
    // Check if checkmark is green
    expect(checkmarkColor.backgroundColor).toBe('rgb(16, 185, 129)'); // #10B981
    
    // Check if "Powered by Sunspire" text is red
    const sunspireText = page.locator('text=Powered by Sunspire').first();
    const textColor = await sunspireText.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    
    console.log('Sunspire text color:', textColor);
    
    // Take a screenshot
    await page.screenshot({ path: 'final-paid-verification.png', fullPage: true });
  });

  test('Demo version - green checkmark', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Wait for everything to load
    await page.waitForTimeout(3000);
    
    // Check checkmark color (should be green)
    const checkmark = page.locator('.absolute.-top-4.-right-4.w-12.h-12.rounded-full').first();
    const checkmarkColor = await checkmark.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    console.log('Demo checkmark colors:', checkmarkColor);
    
    // Check if checkmark is green
    expect(checkmarkColor.backgroundColor).toBe('rgb(34, 197, 94)'); // green-500
    
    // Take a screenshot
    await page.screenshot({ path: 'final-demo-verification.png', fullPage: true });
  });

  test('Local version - verify everything works', async ({ page }) => {
    await page.goto('http://localhost:3001/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'networkidle' });
    
    // Wait for everything to load
    await page.waitForTimeout(3000);
    
    // Check CSS variable (should be red)
    const brandColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
    });
    
    console.log('Local CSS variable --brand-primary:', brandColor);
    expect(brandColor).toBe('#FF0000');
    
    // Check checkmark color (should be green)
    const checkmark = page.locator('.absolute.-top-6.-right-4.w-12.h-12.rounded-full').first();
    const checkmarkColor = await checkmark.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    console.log('Local checkmark colors:', checkmarkColor);
    expect(checkmarkColor.backgroundColor).toBe('rgb(16, 185, 129)'); // #10B981
    
    // Take a screenshot
    await page.screenshot({ path: 'final-local-verification.png', fullPage: true });
  });
});
