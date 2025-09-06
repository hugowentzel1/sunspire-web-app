import { test, expect } from '@playwright/test';

test.describe('New Analysis Button Debug', () => {
  test('Debug New Analysis button click', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Debugging New Analysis button...');
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    // Check for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // Find New Analysis button
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    const btnCount = await newAnalysisBtn.count();
    console.log('New Analysis buttons found:', btnCount);
    
    if (btnCount > 0) {
      // Check if button is visible and enabled
      const isVisible = await newAnalysisBtn.isVisible();
      const isEnabled = await newAnalysisBtn.isEnabled();
      console.log('Button visible:', isVisible, 'Button enabled:', isEnabled);
      
      // Check button attributes
      const buttonText = await newAnalysisBtn.textContent();
      const buttonClass = await newAnalysisBtn.getAttribute('class');
      console.log('Button text:', buttonText, 'Button class:', buttonClass);
      
      // Try clicking with different methods
      console.log('Trying click()...');
      await newAnalysisBtn.click();
      await page.waitForTimeout(2000);
      
      const urlAfterClick = page.url();
      console.log('URL after click():', urlAfterClick);
      
      // Try force click
      console.log('Trying force click...');
      await newAnalysisBtn.click({ force: true });
      await page.waitForTimeout(2000);
      
      const urlAfterForceClick = page.url();
      console.log('URL after force click:', urlAfterForceClick);
      
      // Try evaluating the click handler directly
      console.log('Trying direct evaluation...');
      const clickResult = await page.evaluate(() => {
        const btn = document.querySelector('button:has-text("New Analysis")');
        if (btn) {
          btn.click();
          return 'Button clicked via evaluation';
        }
        return 'Button not found';
      });
      console.log('Direct evaluation result:', clickResult);
      
      await page.waitForTimeout(2000);
      const urlAfterEval = page.url();
      console.log('URL after evaluation:', urlAfterEval);
    }
    
    console.log('✅ New Analysis debug completed');
  });
});
