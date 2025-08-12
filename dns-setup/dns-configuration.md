# DNS Configuration Guide

## Domain 1: sunspiredemo.com (Outreach Link Domain)

### CNAME Record for Vercel Redirect
**Host:** `demo`  
**Value:** `cname.vercel-dns.com` (Vercel will provide this)  
**TTL:** Automatic

### CNAME Record for Instantly Tracking
**Host:** `link`  
**Value:** `[Instantly will provide this]`  
**TTL:** Automatic

---

## Domain 2: getsunspire.com (Primary Sending Domain)

### Google Workspace Verification
**Type:** TXT  
**Host:** `@`  
**Value:** `google-site-verification=[Google will provide this]`  
**TTL:** Automatic

### SPF Record
**Type:** TXT  
**Host:** `@`  
**Value:** `v=spf1 include:_spf.google.com include:spf.instantly.ai ~all`  
**TTL:** Automatic

### DKIM Record
**Type:** TXT  
**Host:** `google._domainkey`  
**Value:** `[Google will provide this after DKIM setup]`  
**TTL:** Automatic

### DMARC Record
**Type:** TXT  
**Host:** `_dmarc`  
**Value:** `v=DMARC1; p=none; rua=mailto:dmarc@getsunspire.com; adkim=s; aspf=s; pct=100`  
**TTL:** Automatic

### Google Postmaster Tools
**Type:** TXT  
**Host:** `@`  
**Value:** `[Google Postmaster will provide this]`  
**TTL:** Automatic

---

## Domain 3: usesunspire.com (Secondary Sending Domain)

### Google Workspace Verification
**Type:** TXT  
**Host:** `@`  
**Value:** `google-site-verification=[Google will provide this]`  
**TTL:** Automatic

### SPF Record
**Type:** TXT  
**Host:** `@`  
**Value:** `v=spf1 include:_spf.google.com include:spf.instantly.ai ~all`  
**TTL:** Automatic

### DKIM Record
**Type:** TXT  
**Host:** `google._domainkey`  
**Value:** `[Google will provide this after DKIM setup]`  
**TTL:** Automatic

### DMARC Record
**Type:** TXT  
**Host:** `_dmarc`  
**Value:** `v=DMARC1; p=none; rua=mailto:dmarc@usesunspire.com; adkim=s; aspf=s; pct=100`  
**TTL:** Automatic

### Google Postmaster Tools
**Type:** TXT  
**Host:** `@`  
**Value:** `[Google Postmaster will provide this]`  
**TTL:** Automatic

---

## Domain 4: sunspiretool.com (Tertiary Sending Domain)

### Google Workspace Verification
**Type:** TXT  
**Host:** `@`  
**Value:** `google-site-verification=[Google will provide this]`  
**TTL:** Automatic

### SPF Record
**Type:** TXT  
**Host:** `@`  
**Value:** `v=spf1 include:_spf.google.com include:spf.instantly.ai ~all`  
**TTL:** Automatic

### DKIM Record
**Type:** TXT  
**Host:** `google._domainkey`  
**Value:** `[Google will provide this after DKIM setup]`  
**TTL:** Automatic

### DMARC Record
**Type:** TXT  
**Host:** `_dmarc`  
**Value:** `v=DMARC1; p=none; rua=mailto:dmarc@sunspiretool.com; adkim=s; aspf=s; pct=100`  
**TTL:** Automatic

### Google Postmaster Tools
**Type:** TXT  
**Host:** `@`  
**Value:** `[Google Postmaster will provide this]`  
**TTL:** Automatic

---

## Setup Order
1. Buy all 4 domains on Namecheap
2. Set up Google Workspace on each sending domain
3. Configure DNS records in this order:
   - Google verification TXT
   - SPF records
   - DKIM records
   - DMARC records
   - Google Postmaster TXT
4. Deploy Vercel redirect app
5. Connect demo.sunspiredemo.com to Vercel
6. Set up Instantly tracking domain
7. Configure Instantly compliance settings

