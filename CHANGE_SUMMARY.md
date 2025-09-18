.github/workflows/e2e.yml | 157 ++-
CHANGE_SUMMARY.md | 513 ++++++++++
COMPLETE-LAUNCH-RUNBOOK.md | 29 +-
ENV-CHECKLIST.md | 13 +
LAUNCH-CHECKLIST.md | 11 +
NOTION-CHECKLIST.md | 20 +
ONE-PAGE-SOP.md | 7 +
PRODUCTION-READINESS.md | 21 +-
README-testing.md | 18 +-
README.md | 39 +-
app/BootProbe.tsx | 14 +-
app/api/activate-intent/route.ts | 25 +-
app/api/admin/create-tenant/route.ts | 86 +-
app/api/autocomplete/route.ts | 18 +-
app/api/calc/quote/route.ts | 131 +--
app/api/checkout/route.ts | 28 +-
app/api/demo-event/route.ts | 37 +-
app/api/demo-lead/route.ts | 9 +-
app/api/domains/attach/route.ts | 73 +-
app/api/domains/prefill/route.ts | 28 +-
app/api/domains/status/route.ts | 66 +-
app/api/domains/verify/route.ts | 71 +-
app/api/email-report/route.ts | 24 +
app/api/estimate/route.ts | 63 +-
app/api/events/log/route.ts | 50 +-
app/api/geo/normalize/route.ts | 51 +-
app/api/geocode/route.ts | 30 +-
app/api/health/route.ts | 28 +-
app/api/lead/route.ts | 74 +-
app/api/leads/route.ts | 39 +-
app/api/leads/upsert/route.ts | 42 +-
app/api/links/open/route.ts | 52 +-
app/api/provision/route.ts | 7 +-
app/api/stripe/create-checkout-session/route.ts | 160 +--
app/api/stripe/create-portal-session/route.ts | 24 +-
app/api/stripe/session/route.ts | 33 +-
app/api/stripe/webhook/route.ts | 190 ++--
app/api/submit-lead/route.ts | 34 +-
app/api/test/last-lead/route.ts | 37 +-
app/api/track/cta-click/route.ts | 123 +--
app/api/track/view/route.ts | 125 +--
app/api/unsubscribe/[hash]/route.ts | 13 +-
app/api/unsubscribe/route.ts | 15 +-
app/api/webhooks/sample-request/route.ts | 245 +++--
app/api/webhooks/stripe/route.ts | 100 +-
app/api/webhooks/unsubscribe/route.ts | 7 +-
app/c/[companyHandle]/cancel/page.tsx | 27 +-
app/c/[companyHandle]/leads/page.tsx | 37 +-
app/c/[companyHandle]/success/page.tsx | 47 +-
app/cancel/page.tsx | 44 +-
app/do-not-sell/page.tsx | 221 +++--
app/docs/crm/airtable/page.tsx | 218 +++-
app/docs/crm/hubspot/page.tsx | 179 +++-
app/docs/crm/page.tsx | 95 +-
app/docs/crm/salesforce/page.tsx | 173 +++-
app/docs/embed/page.tsx | 154 ++-
app/docs/setup/page.tsx | 286 ++++--
app/dpa/page.tsx | 156 ++-
app/error.tsx | 22 +-
app/globals.css | 397 +++++---
app/healthz/route.ts | 15 +-
app/layout.tsx | 38 +-
app/not-found.tsx | 10 +-
app/o/[slug]/page.tsx | 16 +-
app/o/redirect/route.ts | 5 +-
app/o/test/route.ts | 7 +-
app/onboard/domain/page.tsx | 97 +-
app/opengraph-image.tsx | 58 +-
app/page.tsx | 685 ++++++++-----
app/partners/page.tsx | 262 +++--
app/pricing/page.tsx | 144 ++-
app/privacy/page.tsx | 190 +++-
app/r/[token]/route.ts | 40 +-
app/report/page.tsx | 1006 ++++++++++++-------
app/robots.ts | 22 +-
app/security/page.tsx | 394 +++++---
app/signup/page.tsx | 52 +-
app/sitemap.ts | 33 +-
app/status/page.tsx | 81 +-
app/success/page.tsx | 96 +-
app/support/page.tsx | 498 +++++++---
app/terms/page.tsx | 148 ++-
app/v1/ingest/lead/route.ts | 183 ++--
components/AddressAutocomplete.tsx | 134 ++-
components/AppErrorBoundary.tsx | 19 +-
components/BrandCSSInjector.tsx | 20 +-
components/BrandProvider.tsx | 12 +-
components/ClientOnly.tsx | 16 +-
components/CompanyContext.tsx | 16 +-
components/CookieConsent.tsx | 65 +-
components/EnvBanner.tsx | 37 +-
components/EstimateChart.tsx | 118 ++-
components/FooterPaid.tsx | 79 ++
components/HeroBrand.tsx | 169 ++++
components/LeadModal.tsx | 131 ++-
components/LoadingFallback.tsx | 2 +-
components/LockedOverlay.tsx | 11 +-
components/PaidFooter.tsx | 163 +++
components/SharedNavigation.tsx | 250 +++--
components/StickyBar.tsx | 145 +++
components/StickyCTA.tsx | 52 +-
components/StripeCheckoutButton.tsx | 98 +-
components/TenantProvider.tsx | 127 +--
components/UnlockButton.tsx | 4 +-
components/legal/GoogleAttribution.tsx | 16 +-
components/legal/LegalFooter.tsx | 296 ++++--
components/legal/LegalModal.tsx | 117 ++-
components/legal/PVWattsBadge.tsx | 16 +-
components/legal/SmartFooter.tsx | 233 +++--
components/ui/BlurGate.tsx | 22 +-
components/ui/Card.tsx | 14 +-
components/ui/ChartFrame.tsx | 31 +-
components/ui/DemoRibbon.tsx | 49 +-
components/ui/FeatureIconCard.tsx | 24 +-
components/ui/FocusTrap.tsx | 43 +-
components/ui/HeroCTA.tsx | 12 +-
components/ui/IconBadge.tsx | 19 +-
components/ui/KpiTile.tsx | 2 +-
components/ui/PrimaryButton.tsx | 22 +-
components/ui/StatTile.tsx | 18 +-
components/ui/StickyCTA.tsx | 6 +-
components/ui/TenantPreview.tsx | 12 +-
components/ui/TestimonialSlider.tsx | 49 +-
components/ui/TopBar.tsx | 12 +-
components/ui/TrustBar.tsx | 12 +-
components/ui/TrustChip.tsx | 26 +-
components/ui/dialog.tsx | 54 +-
components/ui/premium-tokens.css | 95 +-
components/ui/sunset-theme.css | 160 ++-
components/ui/useTenantTheme.ts | 22 +-
components/usePersonalization.ts | 30 +-
data/incentives.json | 6 +-
demo-showcase.js | 41 +
docs/Sunspire-legal.md | 1203 ++++++++++++-----------
docs/cms-integration-guide.md | 88 +-
docs/complete-setup-checklist.md | 14 +
docs/google-sheets-formulas.md | 23 +
email-campaigns/email-sequence.md | 14 +-
hooks/useBrandColors.ts | 31 +-
lib/brand.ts | 28 +-
lib/brandTheme.ts | 43 +-
lib/calc.ts | 94 +-
lib/company.ts | 37 +-
lib/estimate.ts | 42 +-
lib/features.ts | 23 +-
lib/flags.ts | 7 +
lib/googleMaps 2.ts | 134 +--
lib/googleMaps.ts | 134 +--
lib/mode.ts | 5 +
lib/pvwatts.ts | 67 +-
lib/rates.ts | 79 +-
lib/track.ts | 63 +-
middleware.ts | 67 +-
next.config.js | 64 +-
playwright-report/index.html | 2 +-
playwright.config.ts | 17 +-
postcss.config.js | 2 +-
public/embed.js | 46 +-
public/tenants/acme.json | 3 +-
public/tenants/default.json | 5 +-
scripts/generate-demo-links.js | 62 +-
scripts/generate-legal-docx.js | 186 ++--
scripts/prune-unused.js | 49 +-
scripts/prune-unused.ts | 49 +-
show-both-versions.js | 54 +
show-branding.js | 67 ++
show-demo-vs-paid.js | 56 ++
show-paid-experience.js | 49 +
show-same-company.js | 58 ++
src/brand/BrandProvider.tsx | 87 +-
src/brand/HeroBrand.tsx | 211 ++--
src/brand/NavBrandOverride.tsx | 4 +-
src/brand/useBrandTakeover.ts | 382 ++++---
src/components/BrandingProvider.tsx | 27 +-
src/components/LockedBlur.tsx | 17 +-
src/components/TenantLogo.tsx | 16 +-
src/components/ui/UnlockPill.tsx | 14 +-
src/demo/BlurMask.tsx | 22 +-
src/demo/DemoChrome.tsx | 148 ++-
src/demo/DemoNoIndex.tsx | 10 +-
src/demo/InstallSheet.tsx | 212 ++--
src/demo/LockOverlay.tsx | 464 +++++----
src/demo/PriceAnchor.tsx | 25 +-
src/demo/SocialProof.tsx | 85 +-
src/demo/StickyBuyBar.tsx | 58 +-
src/demo/cta.ts | 10 +-
src/demo/demoRuns.ts | 12 +-
src/demo/redaction.ts | 17 +-
src/demo/track.ts | 46 +-
src/demo/useABVariant.ts | 6 +-
src/demo/useCountdown.ts | 8 +-
src/demo/useDemo.ts | 12 +-
src/demo/usePreviewQuota.ts | 55 +-
src/lib/addresses.ts | 37 +-
src/lib/airtable.ts | 474 +++++----
src/lib/analytics.ts | 14 +-
src/lib/brand/reportBrand.ts | 73 +-
src/lib/brandVar.ts | 9 +-
src/lib/branding.ts | 22 +-
src/lib/checkout.ts | 42 +-
src/lib/cors.ts | 5 +-
src/lib/domainRoot.ts | 22 +-
src/lib/ensureBlur.ts | 72 +-
src/lib/isDemo.ts | 8 +-
src/lib/logger.ts | 4 +-
src/lib/ratelimit.ts | 4 +-
src/lib/retry.ts | 22 +-
src/lib/stripe.ts | 7 +-
src/lib/suppress.ts | 5 +-
src/lib/testids.ts | 3 +-
src/middleware/requestLogging.ts | 78 +-
src/personalization/DemoAwareAddressInput.tsx | 32 +-
src/personalization/DemoAwareCTA.tsx | 18 +-
src/personalization/DemoFooter.tsx | 27 +-
src/personalization/DemoFormModal.tsx | 35 +-
src/personalization/DemoWatermark.tsx | 8 +-
src/personalization/PersonalizationContext.tsx | 6 +-
src/personalization/PersonalizedBanner.tsx | 42 +-
src/personalization/useDemo.ts | 4 +-
src/personalization/usePersonalization.ts | 2 +-
src/report/components/MetricCard.tsx | 28 +-
src/report/components/ReportHeader.tsx | 26 +-
src/report/components/SavingsChart.tsx | 57 +-
src/report/sections/Assumptions.tsx | 38 +-
src/report/sections/Environmental.tsx | 36 +-
src/report/sections/Financial.tsx | 28 +-
src/server/airtable/leads.ts | 28 +-
src/server/auth/jwt.ts | 34 +-
src/server/auth/tenantScope.ts | 75 +-
src/services/finance.ts | 48 +-
src/services/pvwatts.ts | 124 ++-
src/services/rate.ts | 36 +-
src/styles/report.css | 101 +-
tailwind.config.js | 92 +-
test-domain.js | 92 +-
test-webhook.js | 74 +-
tests/address-verification.spec.ts | 61 +-
tests/debug-refund-final.spec.ts | 49 +-
tests/e2e.autocomplete.spec.ts | 10 +-
tests/e2e.checkout.spec.ts | 22 +-
tests/e2e.leads.spec.ts | 26 +-
tests/e2e.live.sunspire.spec.ts | 93 +-
tests/e2e.outreach.spec.ts | 10 +-
tests/e2e.simple.spec.ts | 32 +-
tests/e2e.sunspire.spec.ts | 143 +--
tests/final-live-verification.spec.ts | 253 +++--
tests/paid-footer-new.spec.ts | 77 ++
tests/paid-footer.spec.ts | 83 ++
tests/paid-ui.spec.ts | 48 +
tests/paid.spec.ts | 156 +++
types/global.d.ts | 5 -
utils/theme.ts | 133 +++
vercel.json | 4 +-
253 files changed, 13485 insertions(+), 6868 deletions(-)
CHANGE_SUMMARY.md | 767 ++++++++++++++++++------------------------------------
1 file changed, 254 insertions(+), 513 deletions(-)
commit 7f589880d543186147fbe11519d8b4bc3edabd53
Author: Hugo Wentzel <hugowentzel@gmail.com>
Date: Wed Sep 17 20:46:27 2025 -0400

    Paid: restore classic footer style, remove demo artifacts, spacing polish, non-overlapping cookie bar

    - Create lib/mode.ts utility for demo detection
    - Create FooterPaid component with 3-column layout from commit 6843467ee21c
    - Left: company logo + name, Middle: Legal links, Right: Questions + Powered by Sunspire
    - Add disclaimer box with last updated timestamp
    - Update app/page.tsx and app/report/page.tsx to use FooterPaid in paid mode
    - Remove demo CTAs, CRM chips, and banners from paid mode (already gated)
    - Tighten spacing: reduce card paddings (p-8 → p-6), grid gaps (gap-8 → gap-6)
    - Add Playwright tests for paid footer functionality
    - All 4 tests passing on paid URLs (no demo=1)
    - Footer shows company branding, legal links, contact info, disclaimer
    - Accessibility: role=contentinfo, proper alt tags, external link attributes

CHANGE_SUMMARY.md
app/page.tsx
app/report/page.tsx
components/FooterPaid.tsx
lib/mode.ts
playwright-report/index.html
test-results/.last-run.json
tests/paid-footer-new.spec.ts
