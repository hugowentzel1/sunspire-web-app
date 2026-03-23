# Live site — check in order (click each link)

**Host:** `https://sunspire-web-app.vercel.app`

**Two example URLs we use everywhere below:**

| | URL |
|--|-----|
| **Paid (branded)** | `https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com` |
| **Demo (Meta + demo mode)** | `https://sunspire-web-app.vercel.app/paid?company=meta&demo=1` |

Go through the steps **1 → 16** in order. Each step: read what to check, then open the link.

---

## Sunspire (live)

**1 — Paid page with branding (Apple, red accent, logo)**  
Check: page loads, company feels “paid” / launch messaging, logo/color visible.  
→ [Open paid — Apple](https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com)

**2 — Demo-style experience (Meta on `/paid` with `demo=1`)**  
Check: demo copy/banner or demo behavior, CTA/address flow as you expect for prospects.  
→ [Open demo — Meta (`/paid?company=meta&demo=1`)](https://sunspire-web-app.vercel.app/paid?company=meta&demo=1)

**3 — Demo report (numbers / NREL area)**  
Check: report loads, production or kWh-style numbers appear, not an endless spinner.  
→ [Open demo report — Meta](https://sunspire-web-app.vercel.app/report?company=meta&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test)

**4 — Paid report (no `demo=1`)**  
Check: paid CTAs (e.g. consult / book), footer/modal area sane.  
→ [Open paid report — Apple](https://sunspire-web-app.vercel.app/report?company=Apple&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test)

**5 — Installer dashboard (preview)**  
Check: checklist or “Access required”, not a blank page or infinite loading. If `meta` isn’t in your DB, use [dashboard — testco](https://sunspire-web-app.vercel.app/c/testco?demo=1) instead.  
→ [Open dashboard — meta](https://sunspire-web-app.vercel.app/c/meta?demo=1)

**6 — Leads list**  
Check: “Leads Dashboard” or empty state; not stuck on “Loading…”. Fallback: [leads — testco](https://sunspire-web-app.vercel.app/c/testco/leads?demo=1).  
→ [Open leads — meta](https://sunspire-web-app.vercel.app/c/meta/leads?demo=1)

**7 — Success / activation page**  
Check: page renders with real content. Fallback: [success — testco](https://sunspire-web-app.vercel.app/c/testco/success?demo=1).  
→ [Open success — meta](https://sunspire-web-app.vercel.app/c/meta/success?demo=1)

**8 — System status**  
Check: “System Status”, service rows, synthetic section if you use it.  
→ [Open /status](https://sunspire-web-app.vercel.app/status)

**9 — Health API**  
Check: JSON in the browser (`timestamp`, `services`, etc.); **200** or **503** is OK.  
→ [Open /api/health](https://sunspire-web-app.vercel.app/api/health)

**10 — Terms**  
Check: legal text loads.  
→ [Open /legal/terms](https://sunspire-web-app.vercel.app/legal/terms)

**11 — Privacy**  
Check: policy loads.  
→ [Open /legal/privacy](https://sunspire-web-app.vercel.app/legal/privacy)

**12 — Installer docs**  
Check: setup doc loads.  
→ [Open /docs/setup](https://sunspire-web-app.vercel.app/docs/setup)

---

## Other dashboards (log in with your accounts)

**13 — Stripe**  
Check: payments, customers, recent activity.  
→ [Stripe Dashboard](https://dashboard.stripe.com)

**14 — Stripe webhooks**  
Check: endpoint points at your app’s `/api/stripe/webhook` (or your route); deliveries **200** where expected.  
→ [Stripe → Webhooks](https://dashboard.stripe.com/webhooks)

**15 — UptimeRobot**  
Check: monitor hits production `/api/health`; alerts go to the right email.  
→ [UptimeRobot dashboard](https://dashboard.uptimerobot.com/dashboard)

**16 — Sentry**  
Check: project, alerts, no unexplained spike.  
→ [sentry.io](https://sentry.io)

**Also useful (no fixed order):** [Supabase](https://supabase.com/dashboard) · [Vercel](https://vercel.com/dashboard) · [Resend](https://resend.com/overview) · [GitHub Actions](https://github.com/hugowentzel1/sunspire-web-app/actions)

---

## After that — cost & usage awareness

Do this **after** steps 1–16 when you want billing sanity (optional but recommended).

| Where | What to check |
|-------|----------------|
| **Stripe** | Billing / usage alerts so you’re not surprised by volume. |
| **Resend** | Email volume / plan limits. |
| **Supabase** | Usage, spend cap or alerts if available. |
| **Vercel** | Bandwidth / function usage / budget alerts. |

Set whatever alerts each product offers; note on your calendar for a **monthly** skim of all four.

---

## More docs (optional)

- **Ops:** [MAINTENANCE-GUIDE.md](../MAINTENANCE-GUIDE.md)  
- **Growth:** [TO-DO-LIST.md](../TO-DO-LIST.md)  
- **Automated tests:** `BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod`  
- **Old migration checklist:** [TEMPORARY-TO-DO-LIST.md](./TEMPORARY-TO-DO-LIST.md) — history only
