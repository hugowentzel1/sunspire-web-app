import { test, expect } from "@playwright/test";

test("Check spacing in paid version", async ({ page }) => {
  await page.goto("http://localhost:3000/paid?company=Apple");
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Find the address input
  const addressInput = page.getByTestId("paid-address-input");
  await expect(addressInput).toBeVisible();
  
  // Find the Powered by Google text
  const poweredBy = page.getByTestId("powered-by-google");
  await expect(poweredBy).toBeVisible();
  
  // Find the generate button
  const generateButton = page.getByTestId("paid-generate-btn");
  await expect(generateButton).toBeVisible();
  
  // Measure positions
  const inputBox = await addressInput.boundingBox();
  const buttonBox = await generateButton.boundingBox();
  
  if (inputBox && buttonBox) {
    const spacing = buttonBox.y - (inputBox.y + inputBox.height);
    console.log(`\n📏 PAID VERSION SPACING:`);
    console.log(`Address Input bottom: ${inputBox.y + inputBox.height}px`);
    console.log(`Generate Button top: ${buttonBox.y}px`);
    console.log(`Gap between them: ${spacing}px`);
    console.log(`\nTarget: Should be around 64px to match demo version\n`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/paid-spacing-check.png', fullPage: true });
  console.log("Screenshot saved to test-results/paid-spacing-check.png");
});

