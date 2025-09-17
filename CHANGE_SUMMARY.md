 app/globals.css                                    |   4 +-
 app/page.tsx                                       |  29 +--
 app/pricing/page.tsx                               |  50 ++--
 app/report/page.tsx                                |  41 ++--
 components/SharedNavigation.tsx                    |  14 +-
 components/StickyCTA.tsx                           |   8 +-
 .../1aad77e892c41031ceaf476241b8760256a39594.md    | 191 ++++++++++++++++
 .../2d2aa10567d6083a37ca747f6ae821032502a1e6.png   | Bin 0 -> 127213 bytes
 .../418a163b40dd1a9ec75458ab38697d69185983c8.webm  | Bin 0 -> 741559 bytes
 .../46f06557f5d14a0c9756dcded24d6950d19d244b.webm  | Bin 0 -> 454110 bytes
 .../666be4c277f720108a1532e1b92df0582a442f67.png   | Bin 0 -> 26806 bytes
 .../9b3fc91bb77561481394a5f841c24612ee6093c9.png   | Bin 0 -> 184490 bytes
 .../b180b4c66bc0b4a5fc6aff8d847f3052cc162f8e.md    |  22 ++
 .../d1ec8ab440e734627389c5b6140727abf145ab05.md    | 251 +++++++++++++++++++++
 .../dfd2309958b8aa90d75128a106763439778c6da8.webm  | Bin 0 -> 8887 bytes
 playwright-report/index.html                       |   2 +-
 test-results/.last-run.json                        |   8 +-
 .../error-context.md                               | 191 ++++++++++++++++
 .../test-failed-1.png                              | Bin 0 -> 184490 bytes
 .../video.webm                                     | Bin 0 -> 454110 bytes
 .../error-context.md                               | 251 +++++++++++++++++++++
 .../test-failed-1.png                              | Bin 0 -> 127213 bytes
 .../video.webm                                     | Bin 0 -> 741559 bytes
 .../error-context.md                               |  22 ++
 .../test-failed-1.png                              | Bin 0 -> 26806 bytes
 .../video.webm                                     | Bin 0 -> 8887 bytes
 tests/e2e.autocomplete.spec.ts                     |   2 +-
 tests/e2e.checkout.spec.ts                         |   2 +-
 tests/e2e.leads.spec.ts                            |   2 +-
 tests/e2e.outreach.spec.ts                         |   2 +-
 tests/final-production-check.spec.ts               | 172 ++++++++++++++
 tests/production-verification.spec.ts              | 149 ++++++++++++
 tests/ux.spec.ts                                   |  31 +++
 33 files changed, 1365 insertions(+), 79 deletions(-)


Changed files:

commit 2d98bb13ea3bb6ecd8300c182a5faf60e5fd7548
Author: Hugo Wentzel <hugowentzel@gmail.com>
Date:   Tue Sep 16 19:08:23 2025 -0400

    UX: tighten vertical spacing, sticky CTA on start+report, slim report banner, paid flow compression & polish

app/globals.css
app/page.tsx
app/pricing/page.tsx
app/report/page.tsx
components/SharedNavigation.tsx
components/StickyCTA.tsx
playwright-report/data/1aad77e892c41031ceaf476241b8760256a39594.md
playwright-report/data/2d2aa10567d6083a37ca747f6ae821032502a1e6.png
playwright-report/data/418a163b40dd1a9ec75458ab38697d69185983c8.webm
playwright-report/data/46f06557f5d14a0c9756dcded24d6950d19d244b.webm
playwright-report/data/666be4c277f720108a1532e1b92df0582a442f67.png
playwright-report/data/9b3fc91bb77561481394a5f841c24612ee6093c9.png
playwright-report/data/b180b4c66bc0b4a5fc6aff8d847f3052cc162f8e.md
playwright-report/data/d1ec8ab440e734627389c5b6140727abf145ab05.md
playwright-report/data/dfd2309958b8aa90d75128a106763439778c6da8.webm
playwright-report/index.html
test-results/.last-run.json
test-results/tests-ux-DEMO-hero-CTA-vis-860fb-ky-CTA-appears-after-scroll/error-context.md
test-results/tests-ux-DEMO-hero-CTA-vis-860fb-ky-CTA-appears-after-scroll/test-failed-1.png
test-results/tests-ux-DEMO-hero-CTA-vis-860fb-ky-CTA-appears-after-scroll/video.webm
test-results/tests-ux-DEMO-report-banne-3e40e-primary-and-one-outline-CTA/error-context.md
test-results/tests-ux-DEMO-report-banne-3e40e-primary-and-one-outline-CTA/test-failed-1.png
test-results/tests-ux-DEMO-report-banne-3e40e-primary-and-one-outline-CTA/video.webm
test-results/tests-ux-PAID-local-no-dem-c0e81-posed-post-purchase-context/error-context.md
test-results/tests-ux-PAID-local-no-dem-c0e81-posed-post-purchase-context/test-failed-1.png
test-results/tests-ux-PAID-local-no-dem-c0e81-posed-post-purchase-context/video.webm
tests/e2e.autocomplete.spec.ts
tests/e2e.checkout.spec.ts
tests/e2e.leads.spec.ts
tests/e2e.outreach.spec.ts
tests/final-production-check.spec.ts
tests/production-verification.spec.ts
tests/ux.spec.ts


## User-visible changes
- Tighter hero/feature/FAQ/footer spacing
- Sticky CTA on start + report
- Report banner compact; one primary + one outline CTA
- Paid flows compressed; demo locks removed; post-purchase sticky CTA updated

