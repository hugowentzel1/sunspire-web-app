import { test, expect } from '@playwright/test';

const LOCAL_URL = 'http://localhost:3001/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';

test('Local debug - check BrandProvider behavior', async ({ page }) => {
  // Capture console logs
  const logs: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'log') {
      logs.push(msg.text());
    }
  });
  
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
  
  // Wait for everything to load
  await page.waitForTimeout(3000);
  
  // Check what the CSS variable actually is
  const brandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
  });
  
  console.log('CSS variable value:', brandColor);
  
  // Print all console logs
  console.log('Console logs:');
  logs.forEach(log => console.log('  ', log));
  
  // Check if any elements are using red
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
          color: styles.color
        });
      }
    }
    return redElements;
  });
  
  console.log('Red elements found:', redElements.length);
  redElements.forEach(el => console.log('  ', el));
});
