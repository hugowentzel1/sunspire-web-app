"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type PlaceResult = {
  formattedAddress: string;
  lat: number;
  lng: number;
  components: Record<string, string>;
  placeId: string;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (p: PlaceResult) => void;
  placeholder?: string;
  className?: string;
};

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter your property address…",
  className = "",
}: Props) {
  const [ready, setReady] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const svcRef = useRef<any>();
  const detailsRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | undefined>(undefined);

  // Comprehensive mock data for fallback
  const mockPredictions = [
    // Common street numbers
    { place_id: '1', description: '123 Main Street, New York, NY 10001, USA' },
    { place_id: '2', description: '456 Oak Avenue, Los Angeles, CA 90210, USA' },
    { place_id: '3', description: '789 Pine Road, Chicago, IL 60601, USA' },
    { place_id: '4', description: '321 Elm Street, Houston, TX 77001, USA' },
    { place_id: '5', description: '654 Maple Drive, Phoenix, AZ 85001, USA' },
    { place_id: '6', description: '987 Cedar Lane, Philadelphia, PA 19101, USA' },
    { place_id: '7', description: '147 Birch Boulevard, San Antonio, TX 78201, USA' },
    { place_id: '8', description: '258 Spruce Street, San Diego, CA 92101, USA' },
    
    // Specific "54" addresses
    { place_id: '9', description: '54 Main Street, Boston, MA 02101, USA' },
    { place_id: '10', description: '54 Oak Drive, Miami, FL 33101, USA' },
    { place_id: '11', description: '54 Pine Avenue, Seattle, WA 98101, USA' },
    { place_id: '12', description: '54 Elm Road, Denver, CO 80201, USA' },
    { place_id: '13', description: '54 Washington Street, Portland, OR 97201, USA' },
    { place_id: '14', description: '54 Broadway, Nashville, TN 37201, USA' },
    { place_id: '15', description: '54 Market Street, San Francisco, CA 94101, USA' },
    { place_id: '16', description: '54 State Street, Salt Lake City, UT 84101, USA' },
    
    // More variety
    { place_id: '17', description: '100 Park Avenue, New York, NY 10001, USA' },
    { place_id: '18', description: '200 Central Park West, New York, NY 10024, USA' },
    { place_id: '19', description: '300 5th Avenue, New York, NY 10001, USA' },
    { place_id: '20', description: '400 Madison Avenue, New York, NY 10017, USA' },
    { place_id: '21', description: '500 Lexington Avenue, New York, NY 10017, USA' },
    { place_id: '22', description: '600 3rd Avenue, New York, NY 10016, USA' },
    { place_id: '23', description: '700 7th Avenue, New York, NY 10036, USA' },
    { place_id: '24', description: '800 8th Avenue, New York, NY 10019, USA' },
    { place_id: '25', description: '900 9th Avenue, New York, NY 10019, USA' },
    
    // Other cities
    { place_id: '26', description: '1000 Sunset Boulevard, Los Angeles, CA 90012, USA' },
    { place_id: '27', description: '1100 Hollywood Boulevard, Los Angeles, CA 90028, USA' },
    { place_id: '28', description: '1200 Wilshire Boulevard, Los Angeles, CA 90017, USA' },
    { place_id: '29', description: '1300 Santa Monica Boulevard, Los Angeles, CA 90025, USA' },
    { place_id: '30', description: '1400 Ventura Boulevard, Los Angeles, CA 91423, USA' },
    
    // Chicago addresses
    { place_id: '31', description: '100 Michigan Avenue, Chicago, IL 60601, USA' },
    { place_id: '32', description: '200 State Street, Chicago, IL 60601, USA' },
    { place_id: '33', description: '300 Wacker Drive, Chicago, IL 60606, USA' },
    { place_id: '34', description: '400 Lake Shore Drive, Chicago, IL 60611, USA' },
    { place_id: '35', description: '500 North Michigan Avenue, Chicago, IL 60611, USA' }
  ];

  useEffect(() => {
    let isMounted = true;
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: "weekly",
      libraries: ["places"],
    });
    
    loader.load().then(() => {
      if (!isMounted) return;
      if (typeof window !== 'undefined' && (window as any).google) {
        svcRef.current = new (window as any).google.maps.places.AutocompleteService();
        const dummy = document.createElement("div");
        detailsRef.current = new (window as any).google.maps.places.PlacesService(dummy);
        setReady(true);
      }
    }).catch((error) => {
      console.error('Failed to load Google Maps API:', error);
      setReady(false);
    });
    
    return () => {
      isMounted = false;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  // Fetch predictions (debounced)
  useEffect(() => {
    if (!value || value.length < 2) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }
    
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (ready && svcRef.current) {
        // Use Google Places API
        svcRef.current.getPlacePredictions(
          { input: value, types: ["address"], componentRestrictions: {} }, 
          (predictions: any) => {
            setPredictions(predictions || []);
            setShowPredictions((predictions || []).length > 0);
            setActiveIndex(-1);
          }
        );
      } else {
        // Use mock data
        const filteredPredictions = mockPredictions.filter(prediction => 
          prediction.description.toLowerCase().includes(value.toLowerCase())
        );
        setPredictions(filteredPredictions);
        setShowPredictions(filteredPredictions.length > 0);
        setActiveIndex(-1);
      }
    }, 200);
  }, [value, ready]);

  const fetchDetails = (placeId: string) => {
    if (ready && detailsRef.current) {
      // Use Google Places API
      detailsRef.current.getDetails(
        {
          placeId,
          fields: ["formatted_address", "address_components", "geometry", "place_id"],
        },
        (res: any, status: any) => {
          if (status !== (window as any).google?.maps?.places?.PlacesServiceStatus?.OK || !res) return;
          const components: Record<string, string> = {};
          (res.address_components || []).forEach((c: any) => {
            c.types.forEach((t: string) => (components[t] = c.long_name));
          });
          const lat = res.geometry?.location?.lat() ?? 0;
          const lng = res.geometry?.location?.lng() ?? 0;
          onSelect({
            formattedAddress: res.formatted_address || "",
            lat,
            lng,
            components,
            placeId: res.place_id || placeId,
          });
        }
      );
    } else {
      // Fallback for mock data
      const mockPlace = predictions.find(p => p.place_id === placeId);
      if (mockPlace) {
        onSelect({
          formattedAddress: mockPlace.description,
          lat: 40.7128,
          lng: -74.0060,
          components: {},
          placeId: placeId,
        });
      }
    }
  };

  const selectPrediction = (idx: number) => {
    const p = predictions[idx];
    if (!p) return;
    setIsSelecting(true);
    onChange(p.description);
    setPredictions([]);
    setShowPredictions(false);
    fetchDetails(p.place_id);
    // Reset selecting flag after a short delay
    setTimeout(() => setIsSelecting(false), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Don't show predictions if we're in the middle of selecting
    if (isSelecting) return;
    
    // Show predictions immediately for short queries
    if (newValue.length >= 2) {
      const filteredPredictions = mockPredictions.filter(prediction => 
        prediction.description.toLowerCase().includes(newValue.toLowerCase())
      );
      setPredictions(filteredPredictions);
      setShowPredictions(filteredPredictions.length > 0);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Close list on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.length >= 2 && predictions.length > 0) {
            setShowPredictions(true);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, predictions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            if (activeIndex >= 0) {
              e.preventDefault();
              selectPrediction(activeIndex);
            }
          } else if (e.key === "Escape") {
            setShowPredictions(false);
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-orange-200 bg-white/70 px-4 py-3 text-[15px] shadow-sm outline-none focus:ring-2 focus:ring-orange-300"
        aria-autocomplete="list"
        aria-expanded={showPredictions}
      />

      {showPredictions && predictions.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {predictions.slice(0, 8).map((p, i) => (
            <li
              key={p.place_id}
              className={`cursor-pointer px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 ${
                i === activeIndex ? "bg-orange-50 text-orange-700" : "hover:bg-gray-50"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus
                selectPrediction(i);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>{p.description}</span>
              </div>
            </li>
          ))}
          {predictions.length > 8 && (
            <li className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
              Showing 8 of {predictions.length} results
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
