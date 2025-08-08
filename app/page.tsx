'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { PlaceResult } from '@/lib/calc';

// Premium Components
import PremiumNav from '@/components/ui/PremiumNav';
import PremiumHero from '@/components/ui/PremiumHero';
import PremiumAddressInput from '@/components/ui/PremiumAddressInput';
import PremiumFeatures from '@/components/ui/PremiumFeatures';
import PremiumFooter from '@/components/ui/PremiumFooter';
import FixedCTA from '@/components/ui/FixedCTA';

function HomeContent() {
  const { tenant, loading } = useTenant();
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddressSelect = (placeResult: PlaceResult) => {
    setSelectedPlace(placeResult);
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
              <div className="min-h-screen bg-premium-light flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xl font-semibold text-gray-900">Loading...</p>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Premium Navigation */}
      <PremiumNav />

      {/* Premium Hero Section */}
      <PremiumHero
        title="Solar Intelligence in Seconds"
        subtitle="Enterprise-grade solar estimates powered by NREL PVWatts®. White-label ready for your solar business."
      >
        <PremiumAddressInput
          onAddressSelect={handleAddressSelect}
          onGenerateEstimate={handleGenerateEstimate}
          isLoading={isLoading}
        />
      </PremiumHero>

      {/* Premium Features Section */}
      <PremiumFeatures />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-premium-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Transform Your Solar Business?
             </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get your white-label solar intelligence platform up and running in 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-glass p-8 text-center">
              <div className="icon-premium-alt mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                 </div>
              <h3 className="text-2xl font-bold text-white mb-4">Schedule a Call</h3>
              <p className="text-gray-300 mb-6">
                Book a 15-minute consultation to discuss your white-label needs and see a live demo.
              </p>
              <a 
                href="mailto:sales@sunspire.app?subject=White-label%20Consultation&body=Hi%20Sunspire%2C%20I%27d%20like%20to%20schedule%20a%20call%20about%20white-labeling%20the%20solar%20intelligence%20platform."
                className="btn-premium-alt w-full"
              >
                Schedule Consultation
              </a>
            </div>

            <div className="card-glass p-8 text-center">
              <div className="icon-premium mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                 </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get Started Today</h3>
              <p className="text-gray-300 mb-6">
                Ready to go? We can have your white-label platform live within 24 hours.
              </p>
              <a 
                href="mailto:sales@sunspire.app?subject=White-label%20Setup&body=Hi%20Sunspire%2C%20I%27m%20ready%20to%20get%20started%20with%20white-labeling%20the%20solar%20intelligence%20platform.%20Please%20send%20me%20the%20next%20steps."
                className="btn-premium w-full"
              >
                Start White-Label Setup
              </a>
                 </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <PremiumFooter />

      {/* Fixed CTA Button */}
      <FixedCTA />
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
