# Sunspire Outreach Redirects

This Vercel app handles demo link redirects for cold email outreach campaigns.

## How it works

Any visit to `https://demo.sunspiredemo.com/ANYTHING` will redirect to your real demo with proper UTM tracking.

## Example

- **Input:** `https://demo.sunspiredemo.com/acme-solar-123`
- **Output:** `https://sunspire-web-app-git-main-hugo-wentzels-projects.vercel.app/?demo=1&utm_source=cold&utm_medium=email&utm_campaign=demo-v1&c=acme-solar-123`

## Deployment

Deploy this to Vercel and connect the `demo.sunspiredemo.com` domain.
