'use client';

import { useState, useEffect, useCallback } from 'react';
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

const SERVICE_LABELS: Record<string, { title: string; desc: string }> = {
  airtable: { title: 'Airtable', desc: 'Data storage — tenants & leads' },
  stripe: { title: 'Stripe', desc: 'Payments — checkout & webhooks' },
  nrel: { title: 'NREL PVWatts', desc: 'Solar production — quotes' },
  eia: { title: 'EIA', desc: 'Utility rates — electricity data' },
  google_geocoding: { title: 'Google Geocoding', desc: 'Address lookup (server)' },
  google_places: { title: 'Google Places', desc: 'Address autocomplete (client)' },
  resend: { title: 'Resend', desc: 'Email — lead alerts & delivery' },
};

export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const searchParams = useSearchParams();
  const b = useBrandTakeover();

  const fetchHealth = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  // Auto-refresh every 60s when page is visible
  useEffect(() => {
    if (!health) return;
    const t = setInterval(() => fetchHealth(true), 60000);
    return () => clearInterval(t);
  }, [health, fetchHealth]);

  if (loading && !health) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Status check failed</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => fetchHealth(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Unable to determine system status.</p>
        </div>
      </div>
    );
  }

  const allOk = health.ok;
  const downCount = (health.services || []).filter((s) => s.status !== 'ok').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <SharedNavigation />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero: single source of truth */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">System Status</h1>
          <p className="text-slate-600 mb-4">
            This is the only page you need to confirm all Sunspire systems are up. If every service below is green, you’re good to go.
          </p>
          <p className="text-sm text-slate-500">
            Last updated: {new Date(health.timestamp).toLocaleString()}
            {' · '}
            <button
              type="button"
              onClick={() => fetchHealth(true)}
              disabled={refreshing}
              className="text-blue-600 hover:underline disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh now'}
            </button>
            {' · '}
            <span className="text-slate-400">Auto-refresh every 60s</span>
          </p>
        </div>

        {/* Overall status banner */}
        <div
          className={`rounded-xl border-2 px-6 py-5 mb-8 ${
            allOk
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-3xl ${allOk ? 'text-emerald-600' : 'text-amber-600'}`}
              aria-hidden
            >
              {allOk ? '✓' : '!'}
            </span>
            <div className="text-left">
              <span
                className={`text-xl font-bold ${
                  allOk ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {allOk
                  ? 'All systems operational'
                  : `${downCount} service${downCount !== 1 ? 's' : ''} need attention`}
              </span>
              <p
                className={`text-sm mt-0.5 ${
                  allOk ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {allOk
                  ? 'Every API Sunspire depends on is responding.'
                  : 'Check the list below and TO-DO-LIST / MAINTENANCE-GUIDE if needed.'}
              </p>
            </div>
          </div>
        </div>

        {/* What we check */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">What this page checks</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Data (Airtable), payments (Stripe), quotes (NREL + EIA), address (Google Geocoding + Places), email (Resend). All are probed by <code className="text-xs bg-slate-100 px-1 rounded">/api/health</code>.
            </p>
          </div>
          <div className="divide-y divide-slate-200">
            {(health.services || []).map((s) => {
              const label = SERVICE_LABELS[s.service] || {
                title: s.service,
                desc: '',
              };
              const isOk = s.status === 'ok';
              const isDegraded = s.status === 'degraded';
              return (
                <div
                  key={s.service}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-slate-900">
                      {label.title}
                    </h3>
                    {label.desc && (
                      <p className="text-sm text-slate-500 truncate">{label.desc}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {s.latency != null && s.latency > 0 && isOk && (
                      <span className="text-xs text-slate-400">{s.latency}ms</span>
                    )}
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-lg font-medium ${
                        isOk
                          ? 'bg-emerald-100 text-emerald-700'
                          : isDegraded
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                      aria-hidden
                    >
                      {isOk ? '✓' : isDegraded ? '!' : '✕'}
                    </span>
                    <span
                      className={`text-sm font-semibold min-w-[80px] ${
                        isOk
                          ? 'text-emerald-600'
                          : isDegraded
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {isOk ? 'Operational' : isDegraded ? 'Degraded' : 'Down'}
                    </span>
                    {s.error && (
                      <span
                        className="text-xs text-red-600 max-w-[180px] truncate"
                        title={s.error}
                      >
                        {s.error}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Not checked here */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-6 py-4 mb-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">
            Not checked on this page
          </h3>
          <p className="text-sm text-slate-600">
            Sentry (error monitoring) and Vercel (hosting limits) are not probed here. For Sentry trial/limits and Vercel function invocation limits, see <strong>TO-DO-LIST.md</strong> (BEFORE INSTANTLY section) and <strong>MAINTENANCE-GUIDE.md</strong>.
          </p>
        </div>

        <div className="text-center">
          <a
            href={
              searchParams?.get('demo')
                ? `/?${searchParams?.toString()}`
                : `/paid?${searchParams?.toString() || ''}`
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
