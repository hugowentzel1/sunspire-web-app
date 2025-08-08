'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import StatTile from '@/components/ui/StatTile';
import { TrustChip } from '@/components/ui/TrustChip';
import LegalFooter from '@/components/legal/LegalFooter';
import { PlaceResult } from '@/lib/calc';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { ssr: false });

function HomeContent() {
  const { tenant, loading } = useTenant();
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddressSelect = (placeResult: PlaceResult) => {
    setAddress(placeResult.formattedAddress);
    setSelectedPlace(placeResult);
  };

  const handleGenerateEstimate = () => {
    if (!address.trim()) return;
    setIsLoading(true);
    
    if (selectedPlace) {
      const q = new URLSearchParams({
        address: selectedPlace.formattedAddress,
        lat: String(selectedPlace.lat),
        lng: String(selectedPlace.lng),
        placeId: selectedPlace.placeId,
      });
      router.push(`/report?${q.toString()}`);
    } else {
      const q = new URLSearchParams({
        address: address,
        lat: '40.7128',
        lng: '-74.0060',
        placeId: 'demo',
      });
      router.push(`/report?${q.toString()}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--accent-light)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-[var(--accent-dark)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.h1 
                  className="text-5xl lg:text-6xl font-black text-[var(--accent-dark)] leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Solar Intelligence in{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                    Seconds
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  PVWatts-powered estimates, branded reports, and lead capture—ready to white-label.
                </motion.p>
              </div>

              {/* Trust Chips */}
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <TrustChip>Used by 50+ teams</TrustChip>
                <TrustChip variant="success">Bank-level security</TrustChip>
                <TrustChip variant="warning">White-label ready</TrustChip>
              </motion.div>

              {/* Address Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="space-y-4"
              >
                <Card className="p-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Enter your address
                    </label>
                    <AddressAutocomplete
                      value={address}
                      onChange={setAddress}
                      onSelect={handleAddressSelect}
                      placeholder="Start typing your address..."
                      className="w-full"
                    />
                    <PrimaryButton
                      onClick={handleGenerateEstimate}
                      disabled={!selectedPlace || isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? 'Generating...' : 'Generate Solar Intelligence Report →'}
                    </PrimaryButton>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10"></div>
                <div className="relative z-10 p-8 text-center">
                  <motion.div
                    className="text-8xl mb-6 animate-float"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ☀️
                  </motion.div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Instant Solar Analysis
                    </h3>
                    <p className="text-gray-600">
                      Get accurate, professional solar estimates in seconds using industry-standard PVWatts data.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatTile
              label="Properties Analyzed"
              value="50K+"
              icon="🏠"
            />
            <StatTile
              label="Estimated Savings"
              value="$2.5M"
              icon="💰"
            />
            <StatTile
              label="Model Match"
              value="98%"
              icon="📊"
            />
            <StatTile
              label="AI Support"
              value="24/7"
              icon="🤖"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Triad */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
                         <h2 className="text-4xl font-bold text-[var(--accent-dark)] mb-4">
               Everything You Need to Close More Deals
             </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional solar proposals that convert prospects into customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full">
                                  <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-2xl text-white">
                   📄
                 </div>
                                 <h3 className="text-2xl font-bold text-[var(--accent-dark)] mb-4">
                   Beautiful Reports
                 </h3>
                <p className="text-gray-600">
                  Branded PDF export with professional layouts that impress prospects and close deals faster.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full">
                                 <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-hover)] flex items-center justify-center text-2xl text-white">
                   🎯
                 </div>
                 <h3 className="text-2xl font-bold text-[var(--accent-dark)] mb-4">
                   Accurate Estimates
                 </h3>
                <p className="text-gray-600">
                  PVWatts-powered calculations with local utility rates for precise, trustworthy estimates.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full">
                                 <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-2xl text-white">
                   🔗
                 </div>
                 <h3 className="text-2xl font-bold text-[var(--accent-dark)] mb-4">
                   Lead Routing
                 </h3>
                <p className="text-gray-600">
                  Airtable/CRM integration with webhooks for seamless lead management and follow-up.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter showGoogle={true} />
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
