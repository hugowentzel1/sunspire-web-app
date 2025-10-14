import { test, expect } from "@playwright/test";

test("Check spacing between address input and generate button", async ({ page }) => {
  await page.goto("http://localhost:3000?company=Netflix&demo=1");
  
  // Wait for page to load
  await page.waitForLoadState("networkidle");
  
  // Find the address input
  const addressInput = page.getByTestId("demo-address-input");
  await expect(addressInput).toBeVisible();
  
  // Find the generate button
  const generateButton = page.locator('button:has-text("Generate Solar Report")');
  await expect(generateButton).toBeVisible();
  
  // Measure positions
  const inputBox = await addressInput.boundingBox();
  const buttonBox = await generateButton.boundingBox();
  
  if (inputBox && buttonBox) {
    const spacing = buttonBox.y - (inputBox.y + inputBox.height);
    console.log(`\n📏 SPACING MEASUREMENTS:`);
    console.log(`Address Input bottom: ${inputBox.y + inputBox.height}px`);
    console.log(`Generate Button top: ${buttonBox.y}px`);
    console.log(`Gap between them: ${spacing}px`);
    console.log(`\nTarget: Should be around 48-64px for proper spacing\n`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/spacing-check.png', fullPage: true });
  console.log("Screenshot saved to test-results/spacing-check.png");
});

