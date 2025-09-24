const required = [
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID', 
  'GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_APP_URL'
];

export function assertEnv() {
  // Only assert at runtime, not during build
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}
