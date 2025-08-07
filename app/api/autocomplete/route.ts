import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  try {
    // Check if we have a Google Places API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (apiKey) {
      // Use real Google Places API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&components=country:us&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.predictions) {
        const predictions = data.predictions.map((prediction: any, index: number) => ({
          id: index.toString(),
          mainText: prediction.structured_formatting?.main_text || prediction.description.split(',')[0],
          secondaryText: prediction.structured_formatting?.secondary_text || prediction.description.split(',').slice(1).join(',').trim(),
          fullAddress: prediction.description
        }));
        
        return NextResponse.json({ predictions });
      }
    }
    
    // Fallback to mock data if no API key or API fails
    const mockPredictions = [
      { id: '1', mainText: '123 Main Street', secondaryText: 'New York, NY 10001, USA', fullAddress: '123 Main Street, New York, NY 10001, USA' },
      { id: '2', mainText: '456 Oak Avenue', secondaryText: 'Los Angeles, CA 90210, USA', fullAddress: '456 Oak Avenue, Los Angeles, CA 90210, USA' },
      { id: '3', mainText: '789 Pine Road', secondaryText: 'Chicago, IL 60601, USA', fullAddress: '789 Pine Road, Chicago, IL 60601, USA' },
      { id: '4', mainText: '321 Elm Street', secondaryText: 'Houston, TX 77001, USA', fullAddress: '321 Elm Street, Houston, TX 77001, USA' },
      { id: '5', mainText: '654 Maple Drive', secondaryText: 'Phoenix, AZ 85001, USA', fullAddress: '654 Maple Drive, Phoenix, AZ 85001, USA' },
      { id: '6', mainText: '987 Cedar Lane', secondaryText: 'Philadelphia, PA 19101, USA', fullAddress: '987 Cedar Lane, Philadelphia, PA 19101, USA' },
      { id: '7', mainText: '147 Birch Boulevard', secondaryText: 'San Antonio, TX 78201, USA', fullAddress: '147 Birch Boulevard, San Antonio, TX 78201, USA' },
      { id: '8', mainText: '258 Spruce Street', secondaryText: 'San Diego, CA 92101, USA', fullAddress: '258 Spruce Street, San Diego, CA 92101, USA' }
    ].filter(prediction => 
      prediction.fullAddress.toLowerCase().includes(query.toLowerCase())
    );
    
    return NextResponse.json({ predictions: mockPredictions });
    
  } catch (error) {
    console.error('Error in autocomplete API:', error);
    
    // Return mock data on error
    const mockPredictions = [
      { id: '1', mainText: '123 Main Street', secondaryText: 'New York, NY 10001, USA', fullAddress: '123 Main Street, New York, NY 10001, USA' },
      { id: '2', mainText: '456 Oak Avenue', secondaryText: 'Los Angeles, CA 90210, USA', fullAddress: '456 Oak Avenue, Los Angeles, CA 90210, USA' }
    ].filter(prediction => 
      prediction.fullAddress.toLowerCase().includes(query.toLowerCase())
    );
    
    return NextResponse.json({ predictions: mockPredictions });
  }
}
