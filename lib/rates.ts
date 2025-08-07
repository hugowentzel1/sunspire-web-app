export interface UtilityRate {
  rate: number;
  source: 'EIA' | 'Static';
  state?: string;
  zip?: string;
}

// Static utility rates by state (USD/kWh) - EIA 2023 data
const STATIC_RATES: { [state: string]: number } = {
  'AL': 0.12, 'AK': 0.23, 'AZ': 0.12, 'AR': 0.10, 'CA': 0.22,
  'CO': 0.12, 'CT': 0.21, 'DE': 0.13, 'FL': 0.12, 'GA': 0.12,
  'HI': 0.32, 'ID': 0.10, 'IL': 0.13, 'IN': 0.12, 'IA': 0.11,
  'KS': 0.12, 'KY': 0.11, 'LA': 0.10, 'ME': 0.16, 'MD': 0.14,
  'MA': 0.22, 'MI': 0.15, 'MN': 0.13, 'MS': 0.11, 'MO': 0.11,
  'MT': 0.11, 'NE': 0.10, 'NV': 0.11, 'NH': 0.19, 'NJ': 0.16,
  'NM': 0.12, 'NY': 0.18, 'NC': 0.11, 'ND': 0.10, 'OH': 0.12,
  'OK': 0.10, 'OR': 0.11, 'PA': 0.14, 'RI': 0.20, 'SC': 0.12,
  'SD': 0.11, 'TN': 0.11, 'TX': 0.11, 'UT': 0.10, 'VT': 0.18,
  'VA': 0.12, 'WA': 0.10, 'WV': 0.11, 'WI': 0.14, 'WY': 0.11
};

export async function getUtilityRate(stateCode?: string, zipCode?: string): Promise<UtilityRate> {
  const eiaApiKey = process.env.EIA_API_KEY;
  
  // Try EIA API first if we have a key and ZIP code
  if (eiaApiKey && zipCode) {
    try {
      const rate = await getEIAUtilityRate(zipCode, eiaApiKey);
      if (rate) {
        return {
          rate,
          source: 'EIA',
          zip: zipCode
        };
      }
    } catch (error) {
      console.warn('EIA API failed, falling back to static rates:', error);
    }
  }
  
  // Fallback to static state-based rates
  const state = stateCode?.toUpperCase();
  const staticRate = STATIC_RATES[state || 'CA'] || 0.14; // Default to CA rate
  
  return {
    rate: staticRate,
    source: 'Static',
    state: state || 'CA'
  };
}

async function getEIAUtilityRate(zipCode: string, apiKey: string): Promise<number | null> {
  try {
    // EIA API endpoint for electricity prices by ZIP code
    const url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${apiKey}&frequency=monthly&data[0]=price&facets[stateid][]=${zipCode.substring(0, 2)}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`EIA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response && data.response.data && data.response.data.length > 0) {
      // Convert from cents per kWh to dollars per kWh
      const rateInCents = data.response.data[0].price;
      return rateInCents / 100;
    }
    
    return null;
  } catch (error) {
    console.error('EIA API call failed:', error);
    return null;
  }
}

// Helper function to get state from ZIP code
export function getStateFromZip(zipCode: string): string | null {
  const zipPrefix = zipCode.substring(0, 2);
  
  // ZIP code to state mapping (simplified)
  const zipToState: { [prefix: string]: string } = {
    '00': 'NY', '01': 'MA', '02': 'RI', '03': 'NH', '04': 'ME',
    '05': 'VT', '06': 'CT', '07': 'NJ', '08': 'NY', '09': 'CT',
    '10': 'NY', '11': 'NY', '12': 'NY', '13': 'NY', '14': 'NY',
    '15': 'NY', '16': 'NY', '17': 'NY', '18': 'NY', '19': 'NY',
    '20': 'NY', '21': 'NY', '22': 'NY', '23': 'NY', '24': 'NY',
    '25': 'NY', '26': 'NY', '27': 'NY', '28': 'NY', '29': 'NY',
    '30': 'NY', '31': 'NY', '32': 'NY', '33': 'NY', '34': 'NY',
    '35': 'NY', '36': 'NY', '37': 'NY', '38': 'NY', '39': 'NY',
    '40': 'NY', '41': 'NY', '42': 'NY', '43': 'NY', '44': 'NY',
    '45': 'NY', '46': 'NY', '47': 'NY', '48': 'NY', '49': 'NY',
    '50': 'NY', '51': 'NY', '52': 'NY', '53': 'NY', '54': 'NY',
    '55': 'NY', '56': 'NY', '57': 'NY', '58': 'NY', '59': 'NY',
    '60': 'NY', '61': 'NY', '62': 'NY', '63': 'NY', '64': 'NY',
    '65': 'NY', '66': 'NY', '67': 'NY', '68': 'NY', '69': 'NY',
    '70': 'NY', '71': 'NY', '72': 'NY', '73': 'NY', '74': 'NY',
    '75': 'NY', '76': 'NY', '77': 'NY', '78': 'NY', '79': 'NY',
    '80': 'NY', '81': 'NY', '82': 'NY', '83': 'NY', '84': 'NY',
    '85': 'NY', '86': 'NY', '87': 'NY', '88': 'NY', '89': 'NY',
    '90': 'NY', '91': 'NY', '92': 'NY', '93': 'NY', '94': 'NY',
    '95': 'NY', '96': 'NY', '97': 'NY', '98': 'NY', '99': 'NY'
  };
  
  return zipToState[zipPrefix] || null;
}
