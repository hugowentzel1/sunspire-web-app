import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } }); // iPhone-ish

test.describe("DEMO — mobile experience", () => {
  test("hero readable, sticky CTA visible, disclaimer present", async ({ page }) => {
    await page.goto("/?company=google&demo=1&logo=https://logo.clearbit.com/google.com");

    // H1 visible (not overlapped by any header/overlay)
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Sticky demo CTA exists on mobile
    await expect(page.getByTestId("sticky-demo-cta")).toBeVisible();

    // Disclaimer visible
    await expect(page.getByTestId("demo-disclaimer")).toBeVisible();
  });

  test("testimonials readable on mobile", async ({ page }) => {
    await page.goto("/?company=tesla&demo=1&logo=https://logo.clearbit.com/tesla.com");

    const section = page.getByTestId("demo-testimonials");
    await expect(section).toBeVisible();

    // Ensure avatars & names render
    const firstCard = section.getByTestId("testimonial-card").nth(0);
    await expect(firstCard.getByTestId("avatar-initials")).toBeVisible();
    await expect(firstCard.locator("figcaption")).toBeVisible();

    // Quote text is visible and not truncated
    await expect(firstCard.locator("blockquote p")).toBeVisible();
  });
});
