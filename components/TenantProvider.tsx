"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TenantConfig {
  slug: string;
  name: string;
  tagline: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    website: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  features: {
    showTestimonials: boolean;
    showTrustBadges: boolean;
    showMethodology: boolean;
    showPricing: boolean;
  };
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    location: string;
    content: string;
    rating: number;
  }>;
  trustBadges: string[];
}

interface TenantContextType {
  tenant: TenantConfig | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null,
});

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenant = async () => {
      try {
        // Get tenant slug from URL params or domain
        const urlParams = new URLSearchParams(window.location.search);
        let tenantSlug = urlParams.get('tenant');
        
        // If no tenant param, try to detect from domain
        if (!tenantSlug) {
          const hostname = window.location.hostname;
          if (hostname.includes('acme')) {
            tenantSlug = 'acme';
          } else {
            tenantSlug = 'default';
          }
        }

        // Load tenant configuration
        const response = await fetch(`/tenants/${tenantSlug}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load tenant config: ${response.status}`);
        }

        const tenantConfig: TenantConfig = await response.json();
        setTenant(tenantConfig);

        // Apply CSS custom properties for theming
        const root = document.documentElement;
        root.style.setProperty('--brand', tenantConfig.colors.primary);
        root.style.setProperty('--brand-foreground', tenantConfig.colors.text);
        root.style.setProperty('--brand-accent', tenantConfig.colors.accent);
        root.style.setProperty('--brand-secondary', tenantConfig.colors.secondary);
        root.style.setProperty('--brand-success', tenantConfig.colors.success);
        root.style.setProperty('--brand-warning', tenantConfig.colors.warning);
        root.style.setProperty('--brand-error', tenantConfig.colors.error);
        root.style.setProperty('--brand-background', tenantConfig.colors.background);
        root.style.setProperty('--brand-surface', tenantConfig.colors.surface);
        root.style.setProperty('--brand-text', tenantConfig.colors.text);
        root.style.setProperty('--brand-text-secondary', tenantConfig.colors.textSecondary);
        root.style.setProperty('--brand-border', tenantConfig.colors.border);

      } catch (err) {
        console.error('Error loading tenant configuration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tenant configuration');
        
        // Fallback to default tenant
        try {
          const response = await fetch('/tenants/default.json');
          if (response.ok) {
            const defaultTenant = await response.json();
            setTenant(defaultTenant);
          }
        } catch (fallbackErr) {
          console.error('Failed to load default tenant:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

