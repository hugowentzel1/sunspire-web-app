'use client';

import { useState } from 'react';

export interface AddressAutocompleteProps {
  onAddressSelected: (result: any) => void;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Simple address object for compatibility
    const addressResult = {
      formattedAddress: inputValue,
      address: inputValue,
      city: '',
      state: '',
      zipCode: '',
      latitude: null,
      longitude: null
    };

    onAddressSelected(addressResult);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
          />
          
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-md hover:bg-[var(--brand-primary)]/90 transition-colors"
          >
            Get Quote
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Address autocomplete temporarily unavailable
      </p>
    </div>
  );
}
