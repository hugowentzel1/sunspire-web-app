import trustData from '@/data/trust.json';

export async function getTrustData() {
  try {
    // Check if Airtable credentials are available
    if (process.env.AIRTABLE_TRUST_BASE && process.env.AIRTABLE_TRUST_TOKEN) {
      // In a real implementation, you would fetch from Airtable here
      // For now, we'll just return the local data
      console.log('Airtable credentials available, but using local data for now');
    }
  } catch (error) {
    console.log('Airtable fetch failed, using local data:', error);
  }
  
  // Always return local data as fallback
  return trustData;
}
