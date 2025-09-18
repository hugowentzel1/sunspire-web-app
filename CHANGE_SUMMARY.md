CHANGE_SUMMARY.md | 71 +++++++++++++++++++
app/api/email-report/route.ts | 24 +++++++
app/globals.css | 38 ++++++++++
app/page.tsx | 134 ++++++++++++++++++++++-------------
app/report/page.tsx | 24 ++++---
components/AddressAutocomplete.tsx | 2 +-
components/CookieConsent.tsx | 35 ++++++++--
components/HeroBrand.tsx | 119 ++++++++++++++++++++++++++++++++
components/PaidFooter.tsx | 38 ++++++++++
components/StickyBar.tsx | 138 +++++++++++++++++++++++++++++++++++++
demo-showcase.js | 37 ++++++++++
lib/flags.ts | 5 ++
playwright-report/index.html | 2 +-
show-both-versions.js | 48 +++++++++++++
show-branding.js | 63 +++++++++++++++++
show-demo-vs-paid.js | 50 ++++++++++++++
show-paid-experience.js | 48 +++++++++++++
show-same-company.js | 54 +++++++++++++++
src/brand/HeroBrand.tsx | 6 +-
src/brand/useBrandTakeover.ts | 4 +-
tests/paid-ui.spec.ts | 40 +++++++++++
tests/paid.spec.ts | 132 +++++++++++++++++++++++++++++++++++
utils/theme.ts | 119 ++++++++++++++++++++++++++++++++
23 files changed, 1163 insertions(+), 68 deletions(-)

Changed files:

commit e13d79fef7c10fd65fc799c97a0ba06765389a26
Author: Hugo Wentzel <hugowentzel@gmail.com>
Date: Wed Sep 17 20:13:53 2025 -0400

    PAID UI: remove demo copy, white-label footer, sticky consultation/email bar, embed-safe cookie banner, tests

CHANGE_SUMMARY.md
app/api/email-report/route.ts
app/page.tsx
app/report/page.tsx
components/CookieConsent.tsx
components/PaidFooter.tsx
components/StickyBar.tsx
lib/flags.ts
playwright-report/index.html
show-paid-experience.js
src/brand/useBrandTakeover.ts
tests/paid-ui.spec.ts
