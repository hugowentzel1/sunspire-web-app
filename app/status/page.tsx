'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import SharedNavigation from '@/components/SharedNavigation';
import Footer from '@/components/Footer';

interface HealthService {
  service: string;
  status: 'ok' | 'degraded' | 'down';
  latency?: number;
  error?: string;
}

interface HealthStatus {
  ok: boolean;
  timestamp: string;
  services: HealthService[];
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

  const serviceLabels: Record<string, { title: string; desc: string }> = {
    airtable: { title: 'Data storage', desc: 'Tenants & leads' },
    stripe: { title: 'Payments', desc: 'Checkout & webhooks' },
    nrel: { title: 'Quotes', desc: 'Solar production' },
    eia: { title: 'Rates', desc: 'Utility data' },
    google_geocoding: { title: 'Address lookup', desc: 'Server geocoding' },
    google_places: { title: 'Address autocomplete', desc: 'Places (client)' },
    resend: { title: 'Email', desc: 'Delivery & lead alerts' },
  };

  const allOk = health.ok;
  const downCount = (health.services || []).filter((s) => s.status !== 'ok').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SharedNavigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date(health.timestamp).toLocaleString()}
          </p>
          {/* Obvious overall status banner */}
          <div className={`mt-6 mx-auto max-w-md rounded-xl px-6 py-4 ${allOk ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            {allOk ? (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl" aria-hidden>✅</span>
                  <span className="text-xl font-bold text-green-800">All systems operational</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Every checked API is working.</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl" aria-hidden>❌</span>
                  <span className="text-xl font-bold text-red-800">Issue detected</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{downCount} service{downCount !== 1 ? 's' : ''} degraded or down.</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
            <p className="text-sm text-gray-500 mt-0.5">What’s currently working</p>
          </div>
          <div className="divide-y divide-gray-200">
            {(health.services || []).map((s) => {
              const label = serviceLabels[s.service] || { title: s.service, desc: '' };
              const isOk = s.status === 'ok';
              const isDegraded = s.status === 'degraded';
              return (
                <div key={s.service} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{label.title || s.service}</h3>
                    <p className="text-sm text-gray-500">{label.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.latency != null && s.latency > 0 && isOk && (
                      <span className="text-xs text-gray-400">{s.latency}ms</span>
                    )}
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-2xl ${isOk ? 'bg-green-100 text-green-700' : isDegraded ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} aria-hidden>
                      {isOk ? '✓' : isDegraded ? '!' : '✕'}
                    </span>
                    <span className={`text-sm font-semibold min-w-[90px] ${isOk ? 'text-green-600' : isDegraded ? 'text-amber-600' : 'text-red-600'}`}>
                      {isOk ? 'Operational' : isDegraded ? 'Degraded' : 'Down'}
                    </span>
                    {s.error && (
                      <span className="text-xs text-red-600 max-w-[200px] truncate" title={s.error}>{s.error}</span>
                    )}
                  </div>
                </div>
              );
            })}
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
      
      <Footer />
    </div>
  );
}





