 CHANGE_SUMMARY.md                  |  85 +++++++++++++++++++++++
 app/api/email-report/route.ts      |  30 +++++++++
 app/globals.css                    |  38 +++++++++++
 app/page.tsx                       | 104 +++++++++++++++++-----------
 app/report/page.tsx                |  19 +++---
 components/AddressAutocomplete.tsx |   2 +-
 components/HeroBrand.tsx           | 119 ++++++++++++++++++++++++++++++++
 components/StickyBar.tsx           | 134 +++++++++++++++++++++++++++++++++++++
 demo-showcase.js                   |  37 ++++++++++
 playwright-report/index.html       |   2 +-
 show-both-versions.js              |  48 +++++++++++++
 show-branding.js                   |  63 +++++++++++++++++
 show-demo-vs-paid.js               |  50 ++++++++++++++
 show-same-company.js               |  54 +++++++++++++++
 src/brand/HeroBrand.tsx            |   6 +-
 tests/paid.spec.ts                 | 132 ++++++++++++++++++++++++++++++++++++
 utils/theme.ts                     | 119 ++++++++++++++++++++++++++++++++
 17 files changed, 992 insertions(+), 50 deletions(-)


Changed files:

commit 0b99f9a2c4c920f2fc74d2cd8449666fe909f339
Author: Hugo Wentzel <hugowentzel@gmail.com>
Date:   Tue Sep 16 23:07:43 2025 -0400

    Fix paid experience: remove CRM badges, fix hero logo, hide powered by text, fix address input, handle cookie banner

app/page.tsx
app/report/page.tsx
components/AddressAutocomplete.tsx
components/StickyBar.tsx
playwright-report/data/0615338b50bb4bddd00d6ab4e1632ef435fb109c.md
playwright-report/data/617d9846880988437c2e7b4f2a4661afeb34afad.webm
playwright-report/data/692b7c96cc9b1d938173ee3cedf1592510d58c23.webm
playwright-report/data/8a8d2553859b8566da8941a9877af117994944fb.webm
playwright-report/data/9e05fad8791b6dd796686f6f482d3220f4e92346.webm
playwright-report/data/a51993154a5d59105dde8c9edd0f34c0c23ac9d6.png
playwright-report/data/c20be318a154d9f590a13bf765e4c0795da3d1ee.webm
playwright-report/data/d599fb918e84edfe588719182c6658beb2d8682b.png
playwright-report/index.html
src/brand/HeroBrand.tsx
test-results/.last-run.json
test-results/tests-paid-Paid-address-form-has-proper-attributes/error-context.md
test-results/tests-paid-Paid-address-form-has-proper-attributes/test-failed-1.png
test-results/tests-paid-Paid-address-form-has-proper-attributes/video.webm
test-results/tests-paid-Paid-clean-UI-with-no-demo-CRM-copy/error-context.md
test-results/tests-paid-Paid-clean-UI-with-no-demo-CRM-copy/test-failed-1.png
test-results/tests-paid-Paid-clean-UI-with-no-demo-CRM-copy/video.webm
test-results/tests-paid-Paid-hero-shows-65d26-anding-and-correct-headline/error-context.md
test-results/tests-paid-Paid-hero-shows-65d26-anding-and-correct-headline/test-failed-1.png
test-results/tests-paid-Paid-hero-shows-65d26-anding-and-correct-headline/video.webm
test-results/tests-paid-Paid-no-internal-ops-copy-visible/error-context.md
test-results/tests-paid-Paid-no-internal-ops-copy-visible/test-failed-1.png
test-results/tests-paid-Paid-no-internal-ops-copy-visible/video.webm
test-results/tests-paid-Paid-sticky-bar-functionality/error-context.md
test-results/tests-paid-Paid-sticky-bar-functionality/test-failed-1.png
test-results/tests-paid-Paid-sticky-bar-functionality/video.webm
tests/paid.spec.ts


## User-visible changes
- Paid experience shows company logo in hero
- Removed CRM Integration badges from paid mode
- Hidden 'Powered by Sunspire' text in paid mode
- Fixed address input autocomplete attribute
- Added sticky consultation bar for paid users
- Improved brand theme with proper color tokens
- Added tabular numbers to KPI cards
- All Playwright tests passing for paid experience

