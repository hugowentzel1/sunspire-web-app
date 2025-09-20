import { test, expect } from '@playwright/test';

const PAID_URL = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';

test('Visual check of Apple paid link colors', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });
  
  // Wait for everything to load
  await page.waitForTimeout(3000);
  
  // Check what color the main CTA button actually has
  const ctaButton = page.locator('button').first();
  const buttonColor = await ctaButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      borderColor: styles.borderColor
    };
  });
  
  console.log('CTA Button colors:', buttonColor);
  
  // Check what color the "Powered by Sunspire" text has
  const sunspireText = page.locator('text=Powered by Sunspire').first();
  const textColor = await sunspireText.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      color: styles.color
    };
  });
  
  console.log('Sunspire text color:', textColor);
  
  // Check what color the feature icons have
  const featureIcons = page.locator('[style*="var(--brand-primary)"]').first();
  const iconColor = await featureIcons.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      backgroundImage: styles.backgroundImage
    };
  });
  
  console.log('Feature icon colors:', iconColor);
  
  // Check the CSS variable value
  const cssVariable = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
  });
  
  console.log('CSS variable --brand-primary:', cssVariable);
  
  // Take a screenshot to see the visual appearance
  await page.screenshot({ path: 'visual-check.png', fullPage: true });
  
  // Check if any elements are actually using the red color
  const redElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const redElements = [];
    for (const el of elements) {
      const styles = window.getComputedStyle(el);
      if (styles.backgroundColor === 'rgb(255, 0, 0)' || 
          styles.color === 'rgb(255, 0, 0)' ||
          styles.borderColor === 'rgb(255, 0, 0)') {
        redElements.push({
          tagName: el.tagName,
          className: el.className,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderColor: styles.borderColor
        });
      }
    }
    return redElements;
  });
  
  console.log('Elements using red color:', redElements);
});
