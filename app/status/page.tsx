'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

interface HealthStatus {
  ok: boolean;
  timestamp: string;
  env: {
    AIRTABLE_API_KEY: string;
    AIRTABLE_BASE_ID: string;
    STRIPE_LIVE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    GOOGLE_MAPS: string;
    NREL: string;
    EIA: string;
  };
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const b = useBrandTakeover();

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Status Check Failed</h1>
          <p className="text-gray-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-600 text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Status Unknown</h1>
          <p className="text-gray-600">Unable to determine system status</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    return status === '!!' ? '🟢' : '🔴';
  };

  const getStatusText = (status: string) => {
    return status === '!!' ? 'OK' : 'Not Configured';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date(health.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Stripe</h3>
                <p className="text-sm text-gray-500">Payment processing</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getStatusIcon(health.env.STRIPE_LIVE_SECRET_KEY)}</span>
                <span className={`text-sm font-medium ${health.env.STRIPE_LIVE_SECRET_KEY === '!!' ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusText(health.env.STRIPE_LIVE_SECRET_KEY)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Airtable</h3>
                <p className="text-sm text-gray-500">Data storage</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getStatusIcon(health.env.AIRTABLE_API_KEY)}</span>
                <span className={`text-sm font-medium ${health.env.AIRTABLE_API_KEY === '!!' ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusText(health.env.AIRTABLE_API_KEY)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Google Maps</h3>
                <p className="text-sm text-gray-500">Address autocomplete</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getStatusIcon(health.env.GOOGLE_MAPS)}</span>
                <span className={`text-sm font-medium ${health.env.GOOGLE_MAPS === '!!' ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusText(health.env.GOOGLE_MAPS)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">NREL API</h3>
                <p className="text-sm text-gray-500">Solar data</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getStatusIcon(health.env.NREL)}</span>
                <span className={`text-sm font-medium ${health.env.NREL === '!!' ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusText(health.env.NREL)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">EIA API</h3>
                <p className="text-sm text-gray-500">Energy data</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getStatusIcon(health.env.EIA)}</span>
                <span className={`text-sm font-medium ${health.env.EIA === '!!' ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusText(health.env.EIA)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}





