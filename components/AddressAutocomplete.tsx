'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  initializeGoogleMaps, 
  createAutocompleteSessionToken, 
  getPlacePredictions, 
  getPlaceDetails, 
  geocodeAddress,
  debounce,
  PlaceResult 
} from '@/lib/googleMaps';

export interface AddressAutocompleteProps {
  onAddressSelected: (result: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function AddressAutocomplete({
  onAddressSelected,
  placeholder = "Enter your address...",
  className = "",
  value = "",
  onChange
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps API
  useEffect(() => {
    const init = async () => {
      try {
        await initializeGoogleMaps();
        const token = createAutocompleteSessionToken();
        setSessionToken(token);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error);
        setError('Address autocomplete temporarily unavailable');
      }
    };
    
    init();
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (input: string) => {
      if (!input.trim() || !sessionToken || !isInitialized) {
        setPredictions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await getPlacePredictions(input, sessionToken);
        setPredictions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Places API error:', error);
        setError('Address search temporarily unavailable');
        setPredictions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 250),
    [sessionToken, isInitialized]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    
    if (newValue.trim()) {
      debouncedSearch(newValue);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle address selection
  const handleAddressSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    if (!sessionToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const placeDetails = await getPlaceDetails(prediction.place_id, sessionToken);
      setInputValue(placeDetails.formattedAddress);
      onChange?.(placeDetails.formattedAddress);
      onAddressSelected(placeDetails);
      setShowDropdown(false);
      setPredictions([]);
      
      // Create new session token for next search
      const newToken = createAutocompleteSessionToken();
      setSessionToken(newToken);
    } catch (error) {
      console.error('Failed to get place details:', error);
      
      // Fallback to geocoding
      try {
        const geocodedResult = await geocodeAddress(prediction.description);
        setInputValue(geocodedResult.formattedAddress);
        onChange?.(geocodedResult.formattedAddress);
        onAddressSelected(geocodedResult);
        setShowDropdown(false);
        setPredictions([]);
      } catch (geocodeError) {
        console.error('Geocoding fallback failed:', geocodeError);
        setError('Failed to get address details. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const geocodedResult = await geocodeAddress(inputValue);
      onAddressSelected(geocodedResult);
      setShowDropdown(false);
    } catch (error) {
      console.error('Manual geocoding failed:', error);
      setError('Could not find this address. Please check the spelling and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
            disabled={!isInitialized}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[var(--brand-primary)] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              onClick={() => handleAddressSelect(prediction)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                index === 0 ? 'rounded-t-lg' : ''
              } ${index === predictions.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <div className="font-medium text-gray-900">{prediction.structured_formatting?.main_text}</div>
                  <div className="text-sm text-gray-500">{prediction.structured_formatting?.secondary_text}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fallback message when API is not available */}
      {!isInitialized && !error && (
        <div className="mt-2 text-sm text-gray-500">
          Loading address autocomplete...
        </div>
      )}
    </div>
  );
}
