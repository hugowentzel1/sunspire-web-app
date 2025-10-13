import { test, expect } from "@playwright/test";

test.describe("Testimonials — minimal brand avatar visuals", () => {
  test("avatar uses white center + faint brand ring + dark initials (no saturated fill)", async ({ page }) => {
    // Pick a company color-heavy demo
    await page.goto("/?company=tesla&demo=1&logo=https://logo.clearbit.com/tesla.com");

    const avatar = page.getByTestId("avatar-initials").first();
    await expect(avatar).toBeVisible();

    // No brand-colored background fill utility (center should remain white)
    await expect(avatar).not.toHaveClass(/bg-\[/); // avoids bg-[color:var(--brand...)]
    // Has a ring (uses ring-2)
    await expect(avatar).toHaveClass(/ring-2/);

    // Text remains dark neutral (we assert it doesn't switch to brand text utility)
    await expect(avatar).not.toHaveClass(/text-\[color:var\(--brand/);
  });

  test("names, roles, and verified pill present (credibility cues)", async ({ page }) => {
    await page.goto("/?company=google&demo=1&logo=https://logo.clearbit.com/google.com");

    const section = page.getByTestId("demo-testimonials");
    await expect(section).toBeVisible();

    // At least one name and verified pill show
    await expect(section.getByText(/Owner|Manager|Founder|Ops/i).first()).toBeVisible();
    await expect(section.getByTestId("verified-pill").first()).toBeVisible();
  });
});
