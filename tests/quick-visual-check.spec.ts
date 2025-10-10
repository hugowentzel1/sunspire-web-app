import { test, expect } from "@playwright/test";

test("Quick visual check - Google demo", async ({ page }) => {
  console.log("Navigating to Google demo...");
  await page.goto("/?company=Google&demo=1&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com");
  
  // Wait for page to fully load
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/google-demo-check.png', fullPage: true });
  console.log("Screenshot saved to test-results/google-demo-check.png");
  
  // Check if we have the demo banner
  const hasDemoBanner = await page.locator('text=/Demo for/').count();
  console.log(`Demo banner elements found: ${hasDemoBanner}`);
  
  // Check company name in header
  const companyName = await page.locator('h1').first().textContent();
  console.log(`Company name in header: ${companyName}`);
  
  // Check avatars
  const avatarCount = await page.getByTestId("avatar-initials").count();
  console.log(`Avatars found: ${avatarCount}`);
  
  // Check if avatars have white background
  const firstAvatar = page.getByTestId("avatar-initials").first();
  const hasWhiteBg = await firstAvatar.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  console.log(`First avatar background color: ${hasWhiteBg}`);
  
  // Basic assertions
  expect(avatarCount).toBe(4);
  expect(companyName).toContain("Google");
});
