'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { PlaceResult } from '@/lib/calc';

// Sunset Theme Components
import '@/components/ui/sunset-theme.css';
import SunsetHero from '@/components/ui/SunsetHero';
import KpiTile from '@/components/ui/KpiTile';
import StickyCTA from '@/components/ui/StickyCTA';
import LegalFooter from '@/components/legal/LegalFooter';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { ssr: false });

function HomeContent() {
  const { tenant, loading } = useTenant();
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddressSelect = (placeResult: PlaceResult) => {
    setSelectedPlace(placeResult);
    setAddress(placeResult.formattedAddress);
  };

  const handleGenerateEstimate = () => {
    if (!selectedPlace) return;
    setIsLoading(true);
    const q = new URLSearchParams({
      address: selectedPlace.formattedAddress,
      lat: String(selectedPlace.lat),
      lng: String(selectedPlace.lng),
      placeId: selectedPlace.placeId,
    });
    router.push(`/report?${q.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-[var(--sun-1)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-[var(--ink)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <SunsetHero
          title="Solar Intelligence"
          highlight="in Seconds"
          subtitle="Transform your property with AI-powered solar analysis. Get instant estimates, detailed reports, and connect with premium installers."
          badges={["Used by 50+ Solar Companies","Bank-Level Security","SOC 2 Compliant"]}
        >
          <div className="card p-6 md:p-7">
            <div className="text-center mb-3 font-bold text-[var(--ink)]">Enter Your Property Address</div>
            <p className="p text-center mb-5">Get a comprehensive solar analysis tailored to your specific location</p>
            <div className="space-y-4">
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleAddressSelect}
                placeholder="Start typing your property address..."
                className="input"
              />
              <button
                onClick={handleGenerateEstimate}
                disabled={!address.trim() || isLoading}
                className={`btn-sunset w-full ${(!address.trim()||isLoading) ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Analyzing…" : "Generate Solar Intelligence Report →"}
              </button>
            </div>
          </div>
        </SunsetHero>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiTile label="Properties Analyzed" value="50K+" emoji="🏠" />
          <KpiTile label="Total Savings Generated" value="$2.5M" emoji="💰" />
          <KpiTile label="Accuracy Rate" value="98%" emoji="📊" />
          <KpiTile label="AI Support" value="24/7" emoji="🤖" />
        </div>
      </main>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <StickyCTA
          text="Want this running on your domain with your logo tomorrow?"
          cta="Get your white-label demo"
          href="mailto:sales@sunspire.app?subject=White-label%20Demo"
        />
      </div>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter />
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <TenantProvider>
      <HomeContent />
    </TenantProvider>
  );
}
