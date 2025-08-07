export interface PVWattsRequest {
  lat: number;
  lng: number;
  system_capacity_kw: number;
  tilt?: number;
  azimuth?: number;
  losses?: number;
}

export interface PVWattsResponse {
  inputs: {
    lat: number;
    lon: number;
    system_capacity: number;
    tilt: number;
    azimuth: number;
    losses: number;
  };
  outputs: {
    ac_monthly: number[];
    ac_annual: number;
    solrad_monthly: number[];
    solrad_annual: number;
    dc_monthly: number[];
    dc_annual: number;
  };
}

export async function callPVWattsAPI(params: PVWattsRequest): Promise<PVWattsResponse> {
  const apiKey = process.env.NREL_API_KEY;
  
  if (!apiKey) {
    throw new Error('NREL_API_KEY not configured');
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    lat: params.lat.toString(),
    lon: params.lng.toString(),
    system_capacity: params.system_capacity_kw.toString(),
    tilt: (params.tilt || 20).toString(),
    azimuth: (params.azimuth || 180).toString(),
    losses: (params.losses || 14).toString(),
    array_type: '1', // Fixed (open rack)
    module_type: '0', // Standard
    dataset: 'nsrdb', // National Solar Radiation Database
    timeframe: 'monthly'
  });

  const url = `https://developer.nrel.gov/api/pvwatts/v8.json?${queryParams}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`PVWatts API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      throw new Error(`PVWatts API errors: ${data.errors.join(', ')}`);
    }
    
    return data;
  } catch (error) {
    console.error('PVWatts API call failed:', error);
    throw error;
  }
}

// Fallback function for when NREL API is not available
export function getFallbackPVWattsData(params: PVWattsRequest): PVWattsResponse {
  // Calculate estimated production based on latitude and system size
  const solarIrradiance = getEstimatedSolarIrradiance(params.lat);
  const estimatedAnnualProduction = params.system_capacity_kw * solarIrradiance * 365 * 0.75;
  
  // Generate monthly distribution (higher in summer, lower in winter)
  const monthlyDistribution = [0.06, 0.07, 0.09, 0.10, 0.11, 0.12, 0.12, 0.11, 0.10, 0.08, 0.07, 0.07];
  const ac_monthly = monthlyDistribution.map(ratio => Math.round(estimatedAnnualProduction * ratio));
  
  return {
    inputs: {
      lat: params.lat,
      lon: params.lng,
      system_capacity: params.system_capacity_kw,
      tilt: params.tilt || 20,
      azimuth: params.azimuth || 180,
      losses: params.losses || 14
    },
    outputs: {
      ac_monthly,
      ac_annual: Math.round(estimatedAnnualProduction),
      solrad_monthly: monthlyDistribution.map(ratio => Math.round(solarIrradiance * ratio * 30, 1)),
      solrad_annual: Math.round(solarIrradiance * 365, 1),
      dc_monthly: ac_monthly.map(ac => Math.round(ac / 0.75)),
      dc_annual: Math.round(estimatedAnnualProduction / 0.75)
    }
  };
}

function getEstimatedSolarIrradiance(latitude: number): number {
  const absLat = Math.abs(latitude);
  if (absLat <= 23.5) return 5.5;      // Tropical
  if (absLat <= 35) return 5.0;        // Subtropical
  if (absLat <= 60) return 4.0;        // Temperate
  return 2.5;                          // Polar
}
