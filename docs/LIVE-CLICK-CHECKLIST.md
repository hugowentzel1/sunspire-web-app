# Live site — simple click checklist

Open this file in GitHub or your editor and **click each link** in order.  
**Live app:** [sunspire-web-app.vercel.app](https://sunspire-web-app.vercel.app)

**One example company for every step:** **TestCo** (customer-facing) and **testco** (installer dashboard URL).  
If something 404s, your database may use another handle — try the same links with **`paid`** instead of **TestCo** / **testco**.

---

## Part A — Sunspire (click 1 → 12)

| Step | What you’re checking | Link |
|------|----------------------|------|
| **1** | Demo homepage loads | [Open demo home — TestCo](https://sunspire-web-app.vercel.app/?company=TestCo&demo=1) |
| **2** | Demo report + numbers load | [Open demo report — TestCo](https://sunspire-web-app.vercel.app/report?company=TestCo&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test) |
| **3** | Paid marketing page | [Open paid landing — TestCo](https://sunspire-web-app.vercel.app/paid?company=TestCo) |
| **4** | Paid report (book consult, etc.) | [Open paid report — TestCo](https://sunspire-web-app.vercel.app/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test) |
| **5** | Installer dashboard | [Open dashboard — testco (demo preview)](https://sunspire-web-app.vercel.app/c/testco?demo=1) |
| **6** | Leads list | [Open leads — testco](https://sunspire-web-app.vercel.app/c/testco/leads?demo=1) |
| **7** | Post-checkout success style page | [Open success — testco](https://sunspire-web-app.vercel.app/c/testco/success?demo=1) |
| **8** | Status page | [Open /status](https://sunspire-web-app.vercel.app/status) |
| **9** | Health API (JSON in browser) | [Open /api/health](https://sunspire-web-app.vercel.app/api/health) |
| **10** | Terms | [Open terms](https://sunspire-web-app.vercel.app/legal/terms) |
| **11** | Privacy | [Open privacy](https://sunspire-web-app.vercel.app/legal/privacy) |
| **12** | Installer docs | [Open docs — setup](https://sunspire-web-app.vercel.app/docs/setup) |

**Good:** page loads, no endless spinner, no 500. Dashboard may say **Access required** if `demo=1` isn’t enough — that can still be OK; you’re checking the app responds.

---

## Part B — Other tools (your logins)

These are **not** Sunspire pages — open them when you need to check billing, uptime, errors, or data.

| What | Open this |
|------|-----------|
| **Stripe** (payments, customers) | [dashboard.stripe.com](https://dashboard.stripe.com) |
| **Stripe webhooks** (delivery to your app) | [Stripe → Developers → Webhooks](https://dashboard.stripe.com/webhooks) |
| **UptimeRobot** (is `/api/health` up?) | [uptimerobot.com dashboard](https://dashboard.uptimerobot.com/dashboard) |
| **Sentry** (errors / alerts) | [sentry.io](https://sentry.io) → your org → project |
| **Supabase** (tenants, leads tables) | [supabase.com/dashboard](https://supabase.com/dashboard) |
| **Vercel** (deploys, env vars) | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Resend** (transactional email) | [resend.com](https://resend.com/overview) |
| **GitHub Actions** (synthetic tests, CI) | [sunspire-web-app → Actions](https://github.com/hugowentzel1/sunspire-web-app/actions) |

---

## Optional: same flow with the `paid` tenant slug

If you prefer one slug everywhere:

- [Demo home — paid](https://sunspire-web-app.vercel.app/?company=paid&demo=1)  
- [Paid landing — paid](https://sunspire-web-app.vercel.app/paid?company=paid)  
- [Dashboard — paid](https://sunspire-web-app.vercel.app/c/paid?demo=1)  
- [Leads — paid](https://sunspire-web-app.vercel.app/c/paid/leads?demo=1)  

---

## After this

- **Day-to-day ops:** [MAINTENANCE-GUIDE.md](../MAINTENANCE-GUIDE.md)  
- **Cold email growth:** [TO-DO-LIST.md](../TO-DO-LIST.md)  
- **Automated tests (optional):** `BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod`

The long **TEMPORARY-TO-DO-LIST** is only for the Supabase migration history — you don’t need it for daily “does live work?” checks.
