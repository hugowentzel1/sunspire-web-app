'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { LeadModal } from '@/components/LeadModal';
import { SolarEstimate } from '@/lib/estimate';
import EstimateChart from '@/components/EstimateChart';
import { formatDateSafe } from '@/lib/format';

// Premium Components
import PremiumNav from '@/components/ui/PremiumNav';
import PremiumReportHeader from '@/components/ui/PremiumReportHeader';
import PremiumKPICards from '@/components/ui/PremiumKPICards';
import PremiumChartContainer from '@/components/ui/PremiumChartContainer';
import PremiumReportCTA from '@/components/ui/PremiumReportCTA';
import PremiumFooter from '@/components/ui/PremiumFooter';
import FixedCTA from '@/components/ui/FixedCTA';
import { motion } from 'framer-motion';
import '@/components/ui/sunset-theme.css';
import KpiTile from '@/components/ui/KpiTile';
import StickyCTA from '@/components/ui/StickyCTA';
import LegalFooter from '@/components/legal/LegalFooter';

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    const address = searchParams.get('address');
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const placeId = searchParams.get('placeId');

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError('Missing or invalid coordinates.');
      setIsLoading(false);
      return;
    }

    if (address && lat && lng) {
      fetchEstimate(address, lat, lng, placeId);
    } else {
      setError('Missing address or coordinates.');
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchEstimate = async (address: string, lat: number, lng: number, placeId?: string | null) => {
    try {
      console.log('Fetching estimate for:', { address, lat, lng, placeId });
      
      const params = new URLSearchParams({
        address,
        lat: lat.toString(),
        lng: lng.toString(),
        ...(placeId && { placeId })
      });

      const response = await fetch(`/api/estimate?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        throw new Error(`Failed to fetch estimate: ${response.status}`);
      }

      const data = await response.json();
      console.log('Estimate data received:', data);
      
      if (!data.estimate) {
        throw new Error('No estimate data in response');
      }
      
      setEstimate(data.estimate);
    } catch (error) {
      console.error('Error fetching estimate:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      const fallbackEstimate = {
        id: Date.now().toString(),
        address,
        coordinates: { lat, lng },
        date: new Date(),
        systemSizeKW: 8.5,
        tilt: 20,
        azimuth: 180,
        losses: 14,
        annualProductionKWh: 12000,
        monthlyProduction: Array(12).fill(1000),
        solarIrradiance: 4.5,
        grossCost: 25500,
        netCostAfterITC: 17850,
        year1Savings: 1680,
        paybackYear: 11,
        npv25Year: 25000,
        co2OffsetPerYear: 10200,
        utilityRate: 0.14,
        utilityRateSource: 'Static',
        assumptions: {
          itcPercentage: 0.30,
          costPerWatt: 3.00,
          degradationRate: 0.005,
          oandmPerKWYear: 22,
          electricityRateIncrease: 0.025,
          discountRate: 0.07
        },
        cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
          year: i + 1,
          production: Math.round(12000 * Math.pow(0.995, i)),
          savings: 1680 * Math.pow(1.025, i),
          cumulativeSavings: 1680 * Math.pow(1.025, i) * (i + 1),
          netCashflow: 1680 * Math.pow(1.025, i) - 17850 / 25
        }))
      };
      
      setEstimate(fallbackEstimate);
    } finally {
      setIsLoading(false);
    }
  };

  if (tenantLoading || isLoading) {
    return (
              <div className="min-h-screen bg-premium-light flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xl font-semibold text-gray-900">Generating your solar intelligence report...</p>
          </div>
        </div>
    );
  }

  if (error || !estimate) {
    return (
      <div className="min-h-screen bg-premium-light flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Error Generating Report</h2>
          <p className="text-gray-600 max-w-md mx-auto">{error || 'Unable to generate solar estimate. Please try again.'}</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-premium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app font-inter">
      {/* keep existing header */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="card p-7 text-center">
          <div
            className="mx-auto h-14 w-14 rounded-full"
            style={{background:'radial-gradient(circle at 40% 35%, #FFF1, transparent), linear-gradient(140deg, var(--sun-1), var(--sun-2), var(--sun-3))'}}
          />
          <h1 className="h2 mt-3">Solar Intelligence Report</h1>
          <p className="p mt-2">Comprehensive analysis for your property at {estimate.address}</p>
          <div className="p mt-1">Data Source: {estimate.utilityRateSource} • Generated on {formatDateSafe(estimate.date)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiTile label="System Size" value={`${estimate.systemSizeKW} kW`} emoji="⚡" />
          <KpiTile label="Annual Production" value={`${estimate.annualProductionKWh.toLocaleString()} kWh`} emoji="🌞" />
          <KpiTile label="Net Cost (After ITC)" value={`$${estimate.netCostAfterITC.toLocaleString()}`} emoji="💰" />
          <KpiTile label="Year 1 Savings" value={`$${estimate.year1Savings.toLocaleString()}`} emoji="📈" />
        </div>

        <div className="card p-6">
          <div className="h2 mb-2">Your Solar Savings Over Time</div>
          <p className="p mb-4">Simple view of how your solar investment pays off over 25 years</p>
          <EstimateChart cashflowData={estimate.cashflowProjection} netCostAfterITC={estimate.netCostAfterITC} />
        </div>

        {/* apply className="card p-6" to your three detail panels */}
      </main>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <StickyCTA
          text={`${estimate.systemSizeKW} kW • Payback ${estimate.paybackYear ?? "–"} yrs • $${(estimate.npv25Year ?? 0).toLocaleString()} over 25 yrs`}
          cta="Brand this for my company"
          href="mailto:sales@sunspire.app?subject=Brand%20Sunspire%20for%20us"
        />
      </div>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter />
      </footer>

      {/* Lead Modal remains intact */}
      {estimate && (
        <LeadModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          estimate={estimate}
          address={estimate.address}
        />
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <TenantProvider>
      <ReportContent />
    </TenantProvider>
  );
}
