import { ENV } from '../config/env';
import { logger } from '../lib/logger';
import { retry } from '../lib/retry';

export interface PVWattsRequest {
  lat: number;
  lng: number;
  dc_kw: number;
  tilt?: number;
  azimuth?: number;
  module_type?: number;
  array_type?: number;
  losses?: number;
}

export interface PVWattsResponse {
  ac_annual: number;
  ac_monthly: number[];
  dc_kw: number;
  lat: number;
  lng: number;
}

export async function getProduction(request: PVWattsRequest): Promise<PVWattsResponse> {
  const {
    lat,
    lng,
    dc_kw,
    tilt = 20,
    azimuth = 180,
    module_type = 0,
    array_type = 0,
    losses = ENV.DEFAULT_LOSSES_PCT
  } = request;
  
  const url = new URL('https://developer.nrel.gov/api/pvwatts/v8.json');
  url.searchParams.set('api_key', ENV.NREL_API_KEY);
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lng.toString());
  url.searchParams.set('system_capacity', dc_kw.toString());
  url.searchParams.set('azimuth', azimuth.toString());
  url.searchParams.set('tilt', tilt.toString());
  url.searchParams.set('module_type', module_type.toString());
  url.searchParams.set('array_type', array_type.toString());
  url.searchParams.set('losses', losses.toString());
  url.searchParams.set('timeframe', 'hourly');
  
  try {
    const response = await retry(async () => {
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`PVWatts API error: ${res.status} ${res.statusText}`);
      }
      return res;
    });
    
    const data = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      throw new Error(`PVWatts API errors: ${data.errors.join(', ')}`);
    }
    
    if (!data.outputs) {
      throw new Error('No outputs in PVWatts response');
    }
    
    return {
      ac_annual: data.outputs.ac_annual || 0,
      ac_monthly: data.outputs.ac_monthly || [],
      dc_kw,
      lat,
      lng
    };
    
  } catch (error) {
    logger.error('PVWatts API call failed:', error);
    throw error;
  }
}
