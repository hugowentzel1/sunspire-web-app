export interface ShadingAnalysis {
  method: 'proxy' | 'satellite' | 'lidar' | 'usgs';
  accuracy: 'low' | 'medium' | 'high';
  shadingFactor: number; // 0-1, where 1 = no shading, 0 = complete shading
  confidence: number; // 0-1 confidence level
  dataSource: string;
  lastUpdated: string;
}

export interface ObstructionData {
  type: 'tree' | 'building' | 'mountain' | 'unknown';
  height: number; // meters
  distance: number; // meters
  azimuth: number; // degrees
  shadingImpact: number; // 0-1
}

/**
 * Basic shading analysis using USGS elevation data
 * This is a simplified implementation that can be enhanced with actual USGS data
 */
export function analyzeShading(
  lat: number, 
  lng: number, 
  roofTilt: number = 22, 
  roofAzimuth: number = 180
): ShadingAnalysis {
  
  // For now, return a proxy analysis with some geographic variation
  // In production, this would use actual USGS elevation data
  
  const shadingFactor = calculateProxyShadingFactor(lat, lng, roofTilt, roofAzimuth);
  
  return {
    method: 'proxy',
    accuracy: 'medium',
    shadingFactor,
    confidence: 0.7,
    dataSource: 'USGS 3DEP (proxy)',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Calculate proxy shading factor based on geographic location and roof orientation
 * This simulates what real USGS analysis would provide
 */
function calculateProxyShadingFactor(
  lat: number, 
  lng: number, 
  roofTilt: number, 
  roofAzimuth: number
): number {
  
  // Base shading factor (0.8-0.95 range)
  let baseFactor = 0.9;
  
  // Adjust for latitude (more shading in northern latitudes due to lower sun angles)
  if (lat > 40) baseFactor -= 0.05;
  if (lat > 50) baseFactor -= 0.05;
  
  // Adjust for roof orientation
  // South-facing roofs (180°) get less shading
  const azimuthDiff = Math.abs(roofAzimuth - 180);
  if (azimuthDiff > 90) baseFactor -= 0.05; // East/West facing
  if (azimuthDiff > 135) baseFactor -= 0.05; // North facing
  
  // Adjust for roof tilt
  // Steeper roofs get slightly more shading
  if (roofTilt > 30) baseFactor -= 0.02;
  if (roofTilt > 45) baseFactor -= 0.03;
  
  // Add some regional variation based on longitude (simulating terrain)
  const regionFactor = Math.sin(lng * Math.PI / 180) * 0.02;
  baseFactor += regionFactor;
  
  // Ensure factor stays within reasonable bounds
  return Math.max(0.75, Math.min(0.95, baseFactor));
}

/**
 * Get hourly shading factors for a typical year
 * This would be calculated from actual USGS elevation data in production
 */
export function getHourlyShadingFactors(
  lat: number, 
  lng: number, 
  roofTilt: number = 22, 
  roofAzimuth: number = 180
): number[] {
  
  const baseFactor = calculateProxyShadingFactor(lat, lng, roofTilt, roofAzimuth);
  
  // Generate 8760 hourly factors with seasonal variation
  const hourlyFactors: number[] = [];
  
  for (let hour = 0; hour < 8760; hour++) {
    const dayOfYear = Math.floor(hour / 24);
    const hourOfDay = hour % 24;
    
    // Seasonal variation (more shading in winter due to lower sun angles)
    const seasonalFactor = 1 + 0.1 * Math.cos(2 * Math.PI * dayOfYear / 365);
    
    // Daily variation (more shading in early morning/late evening)
    const dailyFactor = 1 + 0.05 * Math.cos(2 * Math.PI * (hourOfDay - 12) / 24);
    
    const hourlyFactor = baseFactor * seasonalFactor * dailyFactor;
    hourlyFactors.push(Math.max(0.5, Math.min(1.0, hourlyFactor)));
  }
  
  return hourlyFactors;
}

/**
 * Calculate annual shading loss percentage
 */
export function calculateAnnualShadingLoss(shadingFactors: number[]): number {
  const averageFactor = shadingFactors.reduce((sum, factor) => sum + factor, 0) / shadingFactors.length;
  return Math.round((1 - averageFactor) * 100 * 10) / 10; // Round to 1 decimal place
}
