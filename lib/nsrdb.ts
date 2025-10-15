export async function getSolarIrradiance(lat: number, lng: number) {
  const key = process.env.NREL_API_KEY!;
  const url = `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=${key}&lat=${lat}&lon=${lng}`;
  
  try {
    const r = await fetch(url, { next: { revalidate: 2592000 } }); // Cache 30 days
    const j = await r.json();
    
    return {
      avgGHI: j.outputs?.avg_ghi?.annual || 4.5, // kWh/m²/day
      avgDNI: j.outputs?.avg_dni?.annual || 4.0,
      month: j.outputs?.avg_ghi?.monthly || Array(12).fill(4.5)
    };
  } catch (error) {
    console.error('NSRDB fetch failed:', error);
    return { avgGHI: 4.5, avgDNI: 4.0, month: Array(12).fill(4.5) }; // Fallback
  }
}
