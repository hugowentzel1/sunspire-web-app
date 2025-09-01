"use client";

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCompany } from './CompanyContext';

export default function SharedNavigation() {
  const pathname = usePathname();
  const b = useBrandTakeover();
  const { company } = useCompany();
  
  // Don't render on pages that have their own custom banners
  if (pathname === '/report' || pathname === '/demo-result') {
    return null;
  }

  // Generate a default logo URL for common companies when no logo is provided
  const getDefaultLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    
    // Tech companies
    if (brandLower.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (brandLower.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
    if (brandLower.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    if (brandLower.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (brandLower.includes('meta') || brandLower.includes('facebook')) return 'https://logo.clearbit.com/facebook.com';
    if (brandLower.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
    if (brandLower.includes('spotify')) return 'https://logo.clearbit.com/spotify.com';
    if (brandLower.includes('twitter')) return 'https://logo.clearbit.com/twitter.com';
    if (brandLower.includes('linkedin')) return 'https://logo.clearbit.com/linkedin.com';
    if (brandLower.includes('instagram')) return 'https://logo.clearbit.com/instagram.com';
    if (brandLower.includes('twitch')) return 'https://logo.clearbit.com/twitch.tv';
    if (brandLower.includes('discord')) return 'https://logo.clearbit.com/discord.com';
    if (brandLower.includes('slack')) return 'https://logo.clearbit.com/slack.com';
    if (brandLower.includes('shopify')) return 'https://logo.clearbit.com/shopify.com';
    if (brandLower.includes('uber')) return 'https://logo.clearbit.com/uber.com';
    if (brandLower.includes('lyft')) return 'https://logo.clearbit.com/lyft.com';
    
    // Solar companies
    if (brandLower.includes('tesla')) return 'https://logo.clearbit.com/tesla.com';
    if (brandLower.includes('sunpower')) return 'https://logo.clearbit.com/sunpower.com';
    if (brandLower.includes('solarcity')) return 'https://logo.clearbit.com/solarcity.com';
    if (brandLower.includes('vivint')) return 'https://logo.clearbit.com/vivint.com';
    if (brandLower.includes('sunrun')) return 'https://logo.clearbit.com/sunrun.com';
    if (brandLower.includes('sunnova')) return 'https://logo.clearbit.com/sunnova.com';
    if (brandLower.includes('tealenergy')) return 'https://logo.clearbit.com/tealenergy.com';
    if (brandLower.includes('solarpro')) return 'https://logo.clearbit.com/solarpro.com';
    if (brandLower.includes('ecosolar')) return 'https://logo.clearbit.com/ecosolar.com';
    if (brandLower.includes('premiumsolar')) return 'https://logo.clearbit.com/premiumsolar.com';
    if (brandLower.includes('acme')) return 'https://logo.clearbit.com/acme.com';
    
    // Energy companies
    if (brandLower.includes('bp')) return 'https://logo.clearbit.com/bp.com';
    if (brandLower.includes('shell')) return 'https://logo.clearbit.com/shell.com';
    if (brandLower.includes('exxon')) return 'https://logo.clearbit.com/exxonmobil.com';
    if (brandLower.includes('chevron')) return 'https://logo.clearbit.com/chevron.com';
    
    // Real estate/home
    if (brandLower.includes('zillow')) return 'https://logo.clearbit.com/zillow.com';
    if (brandLower.includes('redfin')) return 'https://logo.clearbit.com/redfin.com';
    if (brandLower.includes('realtor')) return 'https://logo.clearbit.com/realtor.com';
    if (brandLower.includes('homedepot')) return 'https://logo.clearbit.com/homedepot.com';
    
    // Financial services
    if (brandLower.includes('chase')) return 'https://logo.clearbit.com/chase.com';
    if (brandLower.includes('wellsfargo')) return 'https://logo.clearbit.com/wellsfargo.com';
    if (brandLower.includes('bankofamerica')) return 'https://logo.clearbit.com/bankofamerica.com';
    if (brandLower.includes('goldmansachs')) return 'https://logo.clearbit.com/goldmansachs.com';
    
    // Other popular brands
    if (brandLower.includes('starbucks')) return 'https://logo.clearbit.com/starbucks.com';
    if (brandLower.includes('mcdonalds')) return 'https://logo.clearbit.com/mcdonalds.com';
    if (brandLower.includes('cocacola') || brandLower.includes('coca')) return 'https://logo.clearbit.com/coca-cola.com';
    if (brandLower.includes('target')) return 'https://logo.clearbit.com/target.com';
    if (brandLower.includes('bestbuy')) return 'https://logo.clearbit.com/bestbuy.com';
    if (brandLower.includes('snapchat')) return 'https://logo.clearbit.com/snapchat.com';
    if (brandLower.includes('whatsapp')) return 'https://logo.clearbit.com/whatsapp.com';
    if (brandLower.includes('firefox')) return 'https://logo.clearbit.com/mozilla.org';
    if (brandLower.includes('harleydavidson')) return 'https://logo.clearbit.com/harley-davidson.com';
    
    return null;
  };

  const logoUrl = b.logo || getDefaultLogo(b.brand);

  const handleLaunchClick = async () => {
    if (b.enabled) {
      // Start Stripe checkout with tracking
      try {
        // Collect tracking parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const company = urlParams.get('company');
        const utm_source = urlParams.get('utm_source');
        const utm_campaign = urlParams.get('utm_campaign');
        
        // Start checkout
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: 'starter',
            token,
            company,
            utm_source,
            utm_campaign
          })
        });
        
        if (!response.ok) {
          throw new Error('Checkout failed');
        }
        
        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Unable to start checkout. Please try again.');
      }
    } else {
      // Default demo behavior
      window.location.href = '/demo-result';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Company logo section removed - replaced with ready-to text */}
          <div className="text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              A ready-to-deploy solar intelligence tool — live on your site within 24 hours.
              {b.enabled ? (
                <span className="block mt-1 text-xs text-gray-500">
                  Not affiliated with {b.brand}
                </span>
              ) : (
                <span className="block mt-1 text-xs text-gray-500">
                  Not affiliated with Your Company
                </span>
              )}
            </p>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <a href="/pricing" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Pricing</a>
            <a href="/partners" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Partners</a>
            <a href="/support" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Support</a>
            <button 
              onClick={handleLaunchClick}
              className="btn-primary ml-12"
            >
              Activate on Your Domain — 24 Hours
            </button>
          </nav>
        </div>
      </div>
      
      {/* Bottom section removed - ready-to text is now in the main header */}
    </header>
  );
}
