import { NextRequest, NextResponse } from 'next/server';

export interface NormalizedAddress {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Use Google Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: `Geocoding failed: ${data.status}` },
        { status: 400 }
      );
    }

    const result = data.results[0];
    const addressComponents = result.address_components || [];

    // Extract address components
    const extractComponent = (types: string[]) => {
      const component = addressComponents.find((comp: any) =>
        comp.types.some((type: string) => types.includes(type))
      );
      return component ? component.long_name : '';
    };

    const streetNumber = extractComponent(['street_number']);
    const route = extractComponent(['route']);
    const street = streetNumber && route ? `${streetNumber} ${route}` : (streetNumber || route);

    const normalizedAddress: NormalizedAddress = {
      formattedAddress: result.formatted_address || '',
      street,
      city: extractComponent(['locality']),
      state: extractComponent(['administrative_area_level_1']),
      postalCode: extractComponent(['postal_code']),
      country: extractComponent(['country']),
      lat: result.geometry?.location?.lat || 0,
      lng: result.geometry?.location?.lng || 0
    };

    return NextResponse.json(normalizedAddress);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}