'use client';

import { useState, useEffect, useRef } from 'react';

interface Prediction {
  description: string;
  place_id: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: string, placeId?: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  'data-testid'?: string;
}

export default function AddressAutocomplete({
  onSelect,
  placeholder = "Enter your address...",
  className = "",
  value = "",
  onChange,
  'data-testid': testId
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load Google Places API script
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (!(window as any).google?.maps?.places) {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        console.log('🔑 Google Maps API key:', apiKey ? 'Present' : 'Missing');
        if (apiKey) {
          // Check if script already exists
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
          if (existingScript) {
            console.log('Google Maps script already exists, waiting for load...');
            // Wait for the existing script to load
            const checkInterval = setInterval(() => {
              if ((window as any).google?.maps?.places) {
                console.log('Google Places API loaded from existing script');
                clearInterval(checkInterval);
              }
            }, 100);
            return;
          }
          
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.onload = () => {
            console.log('✅ Google Places API loaded successfully');
            // Initialize session token when API loads
            if ((window as any).google?.maps?.places) {
              tokenRef.current = new (window as any).google.maps.places.AutocompleteSessionToken();
            }
          };
          script.onerror = (error) => {
            console.error('❌ Failed to load Google Places API:', error);
          };
          document.head.appendChild(script);
        } else {
          console.warn('⚠️ Google Maps API key not found - autocomplete will not work');
        }
      } else {
        console.log('✅ Google Places API already loaded');
        // Initialize session token if API is already loaded
        if ((window as any).google?.maps?.places) {
          tokenRef.current = new (window as any).google.maps.places.AutocompleteSessionToken();
        }
      }
    };

    // Try to load immediately
    loadGoogleMapsAPI();
    
    // Also try after a short delay in case the script is still loading
    const timeoutId = setTimeout(loadGoogleMapsAPI, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Debounced search
  useEffect(() => {
    console.log('🔍 AddressAutocomplete useEffect triggered, query:', query, 'length:', query.length);
    const timeoutId = setTimeout(() => {
      if (query.length >= 3) {
        console.log('🔍 Query length >= 3, calling searchAddresses');
        searchAddresses(query);
      } else {
        console.log('🔍 Query length < 3, clearing predictions');
        setPredictions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchAddresses = async (searchQuery: string) => {
    // Wait for Google Places API to be available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    while (!(window as any).google?.maps?.places && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!(window as any).google?.maps?.places) {
      console.log('Google Places API not loaded after waiting');
      return;
    }

    console.log('Google Places API is ready, searching for:', searchQuery);
    setIsLoading(true);
    try {
      const service = new window.google.maps.places.AutocompleteService();
      const request = {
        input: searchQuery,
        types: ['address'],
        componentRestrictions: { country: 'us' },
        sessionToken: tokenRef.current || undefined
      };

      service.getPlacePredictions(request, (results, status) => {
        setIsLoading(false);
        console.log('Autocomplete response:', { status, resultsCount: results?.length || 0 });
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const formattedPredictions = results.map(result => ({
            description: result.description || '',
            place_id: result.place_id || ''
          }));
          setPredictions(formattedPredictions);
          setShowDropdown(true);
          setSelectedIndex(-1);
          console.log('Set predictions:', formattedPredictions.length);
        } else {
          console.log('No predictions found or error:', status);
          setPredictions([]);
          setShowDropdown(false);
        }
      });
    } catch (error) {
      console.error('Autocomplete error:', error);
      setIsLoading(false);
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔍 AddressAutocomplete handleInputChange called with:', newValue);
    setQuery(newValue);
    onChange?.(newValue);
    setShowDropdown(true);
  };

  const handleSelect = (prediction: Prediction) => {
    setQuery(prediction.description);
    onChange?.(prediction.description);
    // Don't call onSelect automatically - let user click Generate button
    setShowDropdown(false);
    setPredictions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current && 
      !inputRef.current.contains(e.target as Node) &&
      dropdownRef.current && 
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoComplete="off"
        data-testid={testId}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelect(prediction)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}
      
      {/* Google attribution */}
      <p className="mt-1 text-[11px] opacity-70">Powered by Google</p>
    </div>
  );
}
