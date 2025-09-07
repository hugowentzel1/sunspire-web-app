'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { getRootDomain, buildFixedQuoteDomain, extractCompanyWebsite } from '@/src/lib/domainRoot';

export default function DomainOnboardingPage() {
  const searchParams = useSearchParams();
  const tenantHandle = searchParams.get('tenant');
  const companyWebsite = searchParams.get('companyWebsite');
  
  const [requestedDomain, setRequestedDomain] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'attaching' | 'verifying' | 'verified' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<any>(null);

  // Apply brand takeover
  useBrandTakeover(tenantHandle || '');

  useEffect(() => {
    if (companyWebsite) {
      const cleaned = extractCompanyWebsite(companyWebsite);
      if (cleaned) {
        const root = getRootDomain(cleaned);
        if (root) {
          const quoteDomain = buildFixedQuoteDomain(root);
          if (quoteDomain) {
            setRequestedDomain(quoteDomain);
          }
        }
      }
    }
  }, [companyWebsite]);

  const handleAttachDomain = async () => {
    if (!tenantHandle || !requestedDomain) {
      setError('Missing tenant handle or requested domain');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('attaching');

    try {
      // Attach domain to Vercel
      const attachResponse = await fetch('/api/domains/attach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantHandle })
      });

      if (!attachResponse.ok) {
        throw new Error('Failed to attach domain');
      }

      setStatus('verifying');

      // Verify domain
      const verifyResponse = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantHandle })
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify domain');
      }

      // Start polling for verification status
      pollVerificationStatus();

    } catch (error) {
      console.error('Error attaching domain:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
      setIsLoading(false);
    }
  };

  const pollVerificationStatus = async () => {
    if (!tenantHandle) return;

    const poll = async () => {
      try {
        const response = await fetch(`/api/domains/status?tenant=${tenantHandle}`);
        const data = await response.json();
        
        setVerificationStatus(data);
        
        if (data.verified) {
          setStatus('verified');
          setIsLoading(false);
        } else {
          // Continue polling every 10 seconds
          setTimeout(poll, 10000);
        }
      } catch (error) {
        console.error('Error polling verification status:', error);
        setError('Failed to check verification status');
        setStatus('error');
        setIsLoading(false);
      }
    };

    poll();
  };

  const handleSkip = () => {
    // Redirect to the fallback domain
    window.location.href = `https://${tenantHandle}.usesunspire.com`;
  };

  if (!tenantHandle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h1>
          <p className="text-gray-600">This page requires a valid tenant handle.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Set Up Your Custom Domain
              </h1>
              <p className="text-lg text-gray-600">
                We're setting you up at <strong className="text-[var(--brand-primary)]">{requestedDomain || 'quote.yourdomain.com'}</strong>
              </p>
            </div>

            <div className="space-y-8">
              {/* DNS Instructions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">DNS Configuration</h2>
                <p className="text-gray-600 mb-4">
                  Add the following DNS record to your domain to complete the setup:
                </p>
                
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Type</div>
                      <div className="text-gray-900 font-semibold">CNAME</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Host</div>
                      <div className="text-gray-900 font-semibold">quote</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Value</div>
                      <div className="text-gray-900 font-semibold break-all">cname.vercel-dns.com</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> If you're using Cloudflare, make sure to set the DNS record to <strong>DNS-only</strong> (not proxied).
                  </p>
                </div>
              </div>

              {/* Status Display */}
              {status !== 'idle' && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                  
                  {status === 'attaching' && (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--brand-primary)]"></div>
                      <span className="text-gray-700">Attaching domain to Vercel...</span>
                    </div>
                  )}
                  
                  {status === 'verifying' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--brand-primary)]"></div>
                        <span className="text-gray-700">Verifying domain configuration...</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        This may take a few minutes while DNS propagates. We'll check every 10 seconds.
                      </p>
                    </div>
                  )}
                  
                  {status === 'verified' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-semibold">Domain verified successfully!</span>
                      </div>
                      <div className="mt-4">
                        <a 
                          href={`https://${requestedDomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Visit Your Site
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-red-700">{error}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {status === 'idle' && (
                  <button
                    onClick={handleAttachDomain}
                    disabled={!requestedDomain}
                    className="px-8 py-3 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    I Added the Record
                  </button>
                )}
                
                <button
                  onClick={handleSkip}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Skip for Now
                </button>
              </div>

              {/* Fallback Info */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  Your site is also available at{' '}
                  <a 
                    href={`https://${tenantHandle}.usesunspire.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-primary)] hover:underline"
                  >
                    {tenantHandle}.usesunspire.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
