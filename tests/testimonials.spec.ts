import { test, expect } from "@playwright/test";

test("demo testimonials render with initials avatars and names", async ({ page }) => {
  await page.goto("/");
  const section = page.getByTestId("demo-testimonials");
  await expect(section).toBeVisible();

  // Check at least 4 cards
  const cards = section.locator("article");
  await expect(cards).toHaveCount(4);

  // Assert a sample name + initials avatar exist
  await expect(section.getByText("Brian Martin")).toBeVisible();
  // Avatar has aria-label with name
  await expect(section.getByLabel("Avatar for Brian Martin")).toBeVisible();

  // Verified pill appears
  await expect(section.getByText("Verified").first()).toBeVisible();
});
