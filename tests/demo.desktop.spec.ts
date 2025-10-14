import { test, expect } from "@playwright/test";

test.describe("DEMO — desktop experience", () => {
  test("hero H1 + tightened subhead + single primary CTA + disclaimer", async ({ page }) => {
    await page.goto("/?company=google&demo=1&logo=https://logo.clearbit.com/google.com");

    // H1 present
    await expect(page.locator("h1")).toContainText("Your Branded Solar Quote Tool — Live on Your Site in 24 Hours.");

    // Tightened subhead present
    await expect(page.locator("p")).toContainText("Capture more leads with instant, fully-branded solar estimates. We set it up—no coding required. Add to your site or share a link.");

    // Single primary CTA, no secondary CTA buttons in group
    const ctaGroup = page.getByTestId("demo-cta-group");
    await expect(ctaGroup).toBeVisible();
    await expect(ctaGroup.getByRole("button")).toHaveCount(1);
    await expect(page.getByTestId("demo-cta-activate")).toHaveText(/Start Activation.*Demo Expires Soon/i);

    // Disclaimer includes company
    await expect(page.getByTestId("demo-disclaimer")).toContainText(/Private demo for google/i);

    // No top nav (no header nav links)
    const headerNavLinks = page.locator("header nav a");
    await expect(headerNavLinks).toHaveCount(0);
  });

  test("testimonials rendered with alignment hooks", async ({ page }) => {
    await page.goto("/?company=tesla&demo=1&logo=https://logo.clearbit.com/tesla.com");

    const section = page.getByTestId("demo-testimonials");
    await expect(section).toBeVisible();

    // Equal-card grid hook exists
    const cards = section.getByTestId("testimonial-card");
    await expect(cards).toHaveCount(4);

    // Quote paragraph uses readable measure class (enforced in styles)
    await expect(cards.nth(0).locator("blockquote p")).toHaveClass(/max-w-\[62ch\]/);
    // Person row exists
    await expect(cards.nth(0).locator("figcaption")).toBeVisible();

    // Verified pill present in at least one card
    await expect(section.getByTestId("verified-pill").first()).toBeVisible();
  });
});
