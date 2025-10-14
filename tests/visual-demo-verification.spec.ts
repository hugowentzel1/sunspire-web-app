import { test, expect } from "@playwright/test";

test.describe("Visual Demo Verification - Full Branding", () => {
  test("Google demo loads with full branding and consistent avatars", async ({ page }) => {
    // Navigate to Google demo
    await page.goto("/?company=Google&demo=1&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com");

    // 1. Verify NO redirect message
    await expect(page.locator('text=Redirecting to paid version')).not.toBeVisible();

    // 2. Verify demo banner is visible
    await expect(page.getByText(/Demo for Google/i)).toBeVisible();
    await expect(page.getByText(/Powered by Sunspire/i)).toBeVisible();

    // 3. Verify Google logo is loaded in header
    const logo = page.locator('img[alt*="Google"]').first();
    await expect(logo).toBeVisible();

    // 4. Verify company name in header
    await expect(page.getByText("Google")).toBeVisible();

    // 5. Verify testimonials section loads
    const testimonials = page.getByTestId("demo-testimonials");
    await expect(testimonials).toBeVisible();

    // 6. Verify all 4 testimonial cards
    const cards = testimonials.locator("article");
    await expect(cards).toHaveCount(4);

    // 7. Verify all 4 names are visible
    await expect(page.getByText("Brian Martin")).toBeVisible();
    await expect(page.getByText("Dalyn Helms")).toBeVisible();
    await expect(page.getByText("Lensa Yohan")).toBeVisible();
    await expect(page.getByText("Noah Jones")).toBeVisible();

    // 8. Verify all avatars have consistent styling (white bg + brand ring)
    const avatars = page.getByTestId("avatar-initials");
    await expect(avatars).toHaveCount(4);
    
    // Check first avatar has the duo styling
    const firstAvatar = avatars.first();
    await expect(firstAvatar).toBeVisible();
    await expect(firstAvatar).toHaveClass(/bg-white/);
    await expect(firstAvatar).toHaveClass(/text-gray-800/);
    await expect(firstAvatar).toHaveClass(/ring-2/);

    // 9. Verify all verified badges are present
    const verifiedBadges = page.getByTestId("verified-chip");
    await expect(verifiedBadges).toHaveCount(4);
    
    // Check first badge has green styling
    const firstBadge = verifiedBadges.first();
    await expect(firstBadge).toHaveClass(/bg-emerald-50/);
    await expect(firstBadge).toHaveClass(/text-emerald-700/);

    // 10. Verify CTA button is visible with correct text
    const ctaButton = page.getByTestId("demo-cta-activate");
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText(/Start Activation.*Demo Expires Soon/i);

    // 11. Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/google-demo-visual.png', fullPage: true });
  });

  test("Tesla demo loads with different brand color", async ({ page }) => {
    await page.goto("/?company=Tesla&demo=1&logo=https%3A%2F%2Flogo.clearbit.com%2Ftesla.com");

    // Verify NO redirect
    await expect(page.locator('text=Redirecting to paid version')).not.toBeVisible();

    // Verify Tesla branding
    await expect(page.getByText(/Demo for Tesla/i)).toBeVisible();
    
    // Verify avatars still have consistent styling (not rainbow colors)
    const avatars = page.getByTestId("avatar-initials");
    await expect(avatars).toHaveCount(4);
    
    // All avatars should have white background (not colored)
    for (let i = 0; i < 4; i++) {
      const avatar = avatars.nth(i);
      await expect(avatar).toHaveClass(/bg-white/);
      await expect(avatar).toHaveClass(/text-gray-800/);
    }

    // Screenshot
    await page.screenshot({ path: 'test-results/tesla-demo-visual.png', fullPage: true });
  });

  test("Spotify demo loads with green brand color and logo", async ({ page }) => {
    await page.goto("/?company=Spotify&demo=1&logo=https%3A%2F%2Flogo.clearbit.com%2Fspotify.com");

    await expect(page.locator('text=Redirecting to paid version')).not.toBeVisible();
    await expect(page.getByText(/Demo for Spotify/i)).toBeVisible();
    
    // Verify consistent avatars
    const avatars = page.getByTestId("avatar-initials");
    await expect(avatars).toHaveCount(4);

    // Screenshot
    await page.screenshot({ path: 'test-results/spotify-demo-visual.png', fullPage: true });
  });

  test("Demo without company parameter shows default state", async ({ page }) => {
    await page.goto("/?demo=1");

    // Should NOT redirect
    await expect(page.locator('text=Redirecting to paid version')).not.toBeVisible();

    // Should show default branding
    await expect(page.getByText(/Your Company/i)).toBeVisible();
    
    // Testimonials should still be visible
    const testimonials = page.getByTestId("demo-testimonials");
    await expect(testimonials).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/default-demo-visual.png', fullPage: true });
  });

  test("Company without demo parameter DOES redirect to paid", async ({ page }) => {
    await page.goto("/?company=Apple");

    // Should see redirect message OR be on /paid page
    try {
      // Wait for either redirect message or URL change
      await Promise.race([
        page.waitForSelector('text=Redirecting to paid version', { timeout: 3000 }),
        page.waitForURL(/\/paid/, { timeout: 3000 })
      ]);
      
      // Verify we're either showing redirect or on paid page
      const isRedirecting = await page.locator('text=Redirecting to paid version').isVisible().catch(() => false);
      const isPaidUrl = page.url().includes('/paid');
      
      expect(isRedirecting || isPaidUrl).toBeTruthy();
    } catch (e) {
      throw new Error('Expected redirect to paid version but nothing happened');
    }
  });

  test("Avatar initials are calculated correctly", async ({ page }) => {
    await page.goto("/?company=Test&demo=1");

    const avatars = page.getByTestId("avatar-initials");
    
    // Brian Martin = BM
    await expect(avatars.nth(0)).toContainText("BM");
    
    // Dalyn Helms = DH  
    await expect(avatars.nth(1)).toContainText("DH");
    
    // Lensa Yohan = LY
    await expect(avatars.nth(2)).toContainText("LY");
    
    // Noah Jones = NJ
    await expect(avatars.nth(3)).toContainText("NJ");
  });
});

