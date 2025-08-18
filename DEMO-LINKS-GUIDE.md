# 🚀 Sunspire White-Label Demo Links Guide

## Overview
This guide shows you how to use personalized demo links to showcase different company branding for your white-label solar intelligence tool. Perfect for mass cold email campaigns and sales demos.

## 🎯 Available Company Demos

### 1. SolarPro Energy
- **Colors:** Professional Green (#059669)
- **Demo URL:** `http://localhost:3000?solarpro=1&demo=1`
- **Production:** `https://yourdomain.com?solarpro=1&demo=1`
- **Branding:** Professional, established solar company
- **Target Market:** Traditional solar installers

### 2. EcoSolar Solutions
- **Colors:** Eco-Friendly Green (#16A34A)
- **Demo URL:** `http://localhost:3000?ecosolar=1&demo=1`
- **Production:** `https://yourdomain.com?ecosolar=1&demo=1`
- **Branding:** Sustainable, environmental focus
- **Target Market:** Green energy companies

### 3. Premium Solar Group
- **Colors:** Luxury Purple (#7C3AED)
- **Demo URL:** `http://localhost:3000?premiumsolar=1&demo=1`
- **Production:** `https://yourdomain.com?premiumsolar=1&demo=1`
- **Branding:** High-end, luxury installations
- **Target Market:** Premium solar companies

### 4. ACME Solar
- **Colors:** Trustworthy Blue (#2563EB)
- **Demo URL:** `http://localhost:3000?acme=1&demo=1`
- **Production:** `https://yourdomain.com?acme=1&demo=1`
- **Branding:** Reliable, established company
- **Target Market:** Traditional solar businesses

## 📧 Email Campaign Templates

### Template 1: Personalized Company Demo
```
Subject: Exclusive Preview - [Company Name] Solar Intelligence Tool

Hi [Contact Name],

I wanted to share an exclusive preview of how [Company Name] could look with our white-label solar intelligence tool.

Check out this demo customized for your company:
[DEMO_URL]

Key Features:
• Your company branding and colors
• Professional solar estimates and reports
• White-label ready for immediate launch
• Premium, expensive-looking UI that converts

Would you like to see how this could look with your specific branding?

Best regards,
[Your Name]
```

### Template 2: Mass Email Version
```
Subject: See Your Solar Company in Action - Exclusive Demo

Hi [Contact Name],

I've created a personalized demo of how [Company Name] would look with our white-label solar intelligence tool.

Your Demo: [DEMO_URL]

This tool will make your company look like a $10M+ enterprise with:
• Premium, expensive-looking interface
• Your exact branding and colors
• Professional solar reports
• White-label ready to launch

Perfect for increasing conversions and looking more established.

Would you like to see your specific branding?

Best regards,
[Your Name]
```

## 🎨 Customization Features

### What Changes Per Company:
- **Company Name & Logo**
- **Brand Colors** (buttons, accents, highlights)
- **Contact Information**
- **Testimonials & Trust Badges**
- **Taglines & Messaging**

### What Stays Premium:
- **Button Styles** (expensive, lush appearance)
- **UI Components** (cards, shadows, animations)
- **Layout & Typography**
- **Premium Effects** (gradients, shadows, hover states)

## 📱 How to Use

### 1. Generate Demo Links
```bash
# Run the demo link generator
node scripts/generate-demo-links.js

# Generate CSV for mass email campaigns
node scripts/generate-demo-links.js --csv
```

### 2. Test Each Demo
- Visit each demo URL locally
- Verify branding appears correctly
- Check button colors and styling
- Test responsive design

### 3. Send Personalized Emails
- Use company-specific demo URLs
- Include relevant company information
- Follow up with screenshots
- Schedule demo calls

## 🔧 Technical Details

### URL Parameters:
- `?company=1` - Activates company branding
- `?demo=1` - Enables demo mode
- `?preview=1` - Shows preview features

### File Structure:
```
public/tenants/
├── solarpro.json      # SolarPro configuration
├── ecosolar.json      # EcoSolar configuration
├── premiumsolar.json  # Premium Solar configuration
└── acme.json         # ACME configuration
```

### Middleware:
- Automatically detects company URLs
- Injects appropriate tenant configuration
- Handles subdomain routing

## 💡 Pro Tips

### For Mass Email Campaigns:
1. **Segment by Company Type** (premium, eco, traditional)
2. **Personalize Subject Lines** with company names
3. **Include Screenshots** of their branded version
4. **Follow Up** with personalized demo calls
5. **Track Opens & Clicks** to measure engagement

### For Sales Demos:
1. **Prepare Company-Specific Examples**
2. **Show Before/After Comparisons**
3. **Highlight Premium Features**
4. **Demonstrate White-Label Capabilities**
5. **Close with Customization Options**

## 📊 Success Metrics

### Track These KPIs:
- **Demo Link Clicks** per company
- **Email Open Rates** by company type
- **Demo Request Conversions**
- **White-Label Lease Signings**
- **Revenue per Company Type**

## 🚀 Next Steps

1. **Test All Demo Links** locally
2. **Customize Email Templates** for your voice
3. **Create Company-Specific Screenshots**
4. **Launch Mass Email Campaign**
5. **Follow Up with High-Engagement Prospects**

---

**Need Help?** Run `node scripts/generate-demo-links.js` to see all available demo links and email templates.
