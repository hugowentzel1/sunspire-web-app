import { test, expect } from '@playwright/test';

test.describe('Button Centering Verification', () => {
  test('verify buttons are vertically centered in their containers', async ({ page }) => {
    await page.goto('http://localhost:3000/report?address=1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA&lat=37.4220&lng=-122.0841&company=Apple&brandColor=%23000000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get the CTA footer element
    const ctaFooter = page.locator('[data-testid="report-cta-footer"]');
    await expect(ctaFooter).toBeVisible();
    
    // Get button elements
    const bookButton = ctaFooter.locator('button[aria-label="Book a Consultation"]');
    const downloadButton = ctaFooter.locator('button[aria-label="Download PDF Report"]');
    
    // Get container elements
    const topRowContainer = bookButton.locator('xpath=ancestor::div[contains(@class, "cta-row")]');
    const bottomRowContainer = downloadButton.locator('xpath=ancestor::div[contains(@class, "utility-row")]');
    
    // Get bounding boxes
    const bookBox = await bookButton.boundingBox();
    const downloadBox = await downloadButton.boundingBox();
    const topContainerBox = await topRowContainer.boundingBox();
    const bottomContainerBox = await bottomRowContainer.boundingBox();
    
    // Calculate centers
    const bookCenter = bookBox.y + (bookBox.height / 2);
    const downloadCenter = downloadBox.y + (downloadBox.height / 2);
    const topContainerCenter = topContainerBox.y + (topContainerBox.height / 2);
    const bottomContainerCenter = bottomContainerBox.y + (bottomContainerBox.height / 2);
    
    // Calculate offsets
    const bookOffset = Math.abs(bookCenter - topContainerCenter);
    const downloadOffset = Math.abs(downloadCenter - bottomContainerCenter);
    
    console.log('=== CENTERING RESULTS ===');
    console.log('Book button offset from top container center:', bookOffset, 'px');
    console.log('Download button offset from bottom container center:', downloadOffset, 'px');
    console.log('Top container height:', topContainerBox.height, 'px');
    console.log('Bottom container height:', bottomContainerBox.height, 'px');
    console.log('Book button height:', bookBox.height, 'px');
    console.log('Download button height:', downloadBox.height, 'px');
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'button-centering-verification.png',
      fullPage: false
    });
    
    // Verify buttons are centered (allow 2px tolerance)
    expect(bookOffset).toBeLessThanOrEqual(2);
    expect(downloadOffset).toBeLessThanOrEqual(2);
    
    // Verify container heights are 60px as expected
    expect(topContainerBox.height).toBe(60);
    expect(bottomContainerBox.height).toBe(60);
  });
});
