import { NextRequest, NextResponse } from 'next/server';
import { callPVWattsAPI, getFallbackPVWattsData } from '@/lib/pvwatts';
import { getUtilityRate, getStateFromZip } from '@/lib/rates';
import { calculateSolarEstimate, EstimateRequest } from '@/lib/estimate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Extract parameters from query string
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const address = searchParams.get('address') || '';
    const systemKw = searchParams.get('systemKw') ? parseFloat(searchParams.get('systemKw')!) : undefined;
    const tilt = searchParams.get('tilt') ? parseFloat(searchParams.get('tilt')!) : undefined;
    const azimuth = searchParams.get('azimuth') ? parseFloat(searchParams.get('azimuth')!) : undefined;
    const lossesPct = searchParams.get('lossesPct') ? parseFloat(searchParams.get('lossesPct')!) : undefined;
    const stateCode = searchParams.get('stateCode') || undefined;
    const zipCode = searchParams.get('zipCode') || undefined;
    
    // Validate required parameters
    if (!lat || !lng || !address) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat, lng, address' },
        { status: 400 }
      );
    }
    
    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }
    
    // Determine system size if not provided
    let systemSizeKW = systemKw;
    if (!systemSizeKW) {
      // Estimate system size based on average home usage (12,000 kWh/year)
      // and typical solar production (1 kW produces ~1,400 kWh/year)
      systemSizeKW = Math.round((12000 / 1400) * 10) / 10;
    }
    
    // Get utility rate
    const utilityRate = await getUtilityRate(stateCode, zipCode);
    
    // Get PVWatts data
    let pvwattsData;
    try {
      pvwattsData = await callPVWattsAPI({
        lat,
        lng,
        system_capacity_kw: systemSizeKW,
        tilt,
        azimuth,
        losses: lossesPct
      });
    } catch (error) {
      console.warn('PVWatts API failed, using fallback data:', error);
      pvwattsData = getFallbackPVWattsData({
        lat,
        lng,
        system_capacity_kw: systemSizeKW,
        tilt,
        azimuth,
        losses: lossesPct
      });
    }
    
    // Calculate solar estimate
    const estimateRequest: EstimateRequest = {
      lat,
      lng,
      address,
      systemKw: systemSizeKW,
      tilt,
      azimuth,
      lossesPct,
      stateCode,
      zipCode
    };
    
    const estimate = calculateSolarEstimate(pvwattsData, utilityRate, estimateRequest);
    
    // Return the estimate with PVWatts data and assumptions
    return NextResponse.json({
      estimate,
      pvwattsData,
      utilityRate,
      request: estimateRequest
    });
    
  } catch (error) {
    console.error('Error in estimate API:', error);
    return NextResponse.json(
      { error: 'Failed to generate estimate' },
      { status: 500 }
    );
  }
}
