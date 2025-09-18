"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

// Fallback default tenant configuration
const defaultTenant: TenantConfig = {
  slug: "default",
  name: "Sunspire",
  tagline: "PREMIUM SOLAR INTELLIGENCE",
  logo: "/logo-default.svg",
  colors: {
    primary: "#FFA63D",
    secondary: "#FF6F3C",
    accent: "#1A99E6",
    success: "#1AB380",
    warning: "#FFA63D",
    error: "#FF6F3C",
    background: "#FAFAFF",
    surface: "#FDFDFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  },
  contact: {
    email: "hello@sunspire.com",
    phone: "+1 (555) 123-4567",
    address: "123 Solar Street, Sunny City, SC 12345",
  },
  social: {
    website: "https://sunspire.com",
    facebook: "https://facebook.com/sunspire",
    twitter: "https://twitter.com/sunspire",
    linkedin: "https://linkedin.com/company/sunspire",
  },
  features: {
    showTestimonials: true,
    showTrustBadges: true,
    showMethodology: true,
    showPricing: false,
  },
  testimonials: [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Homeowner",
      location: "Austin, TX",
      content:
        "Sunspire's estimate was spot-on! We saved $2,400 in our first year and the installation was seamless.",
      rating: 5,
    },
    {
      id: "2",
      name: "Mike Chen",
      role: "Property Manager",
      location: "San Diego, CA",
      content:
        "The accuracy of their solar estimates helped us make informed decisions for our portfolio. Highly recommended!",
      rating: 5,
    },
    {
      id: "3",
      name: "Lisa Rodriguez",
      role: "Business Owner",
      location: "Miami, FL",
      content:
        "Professional service from start to finish. The ROI calculations were exactly what we needed to justify the investment.",
      rating: 5,
    },
  ],
  trustBadges: [
    "Used by 50+ Solar Companies",
    "Bank-Level Security",
    "SOC 2 Compliant",
    "24/7 Support",
  ],
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
        let tenantSlug = urlParams.get("tenant");

        // If no tenant param, try to detect from domain
        if (!tenantSlug) {
          const hostname = window.location.hostname;
          if (hostname.includes("acme")) {
            tenantSlug = "acme";
          } else {
            tenantSlug = "default";
          }
        }

        // Try to load tenant configuration, but fallback to default if it fails
        try {
          const response = await fetch(`/tenants/${tenantSlug}.json`);
          if (response.ok) {
            const tenantData = await response.json();
            setTenant(tenantData);
          } else {
            // If tenant file doesn't exist, use default
            console.warn(
              `Tenant config not found for ${tenantSlug}, using default`,
            );
            setTenant(defaultTenant);
          }
        } catch (fetchError) {
          // If fetch fails, use default tenant
          console.warn(
            "Failed to fetch tenant config, using default:",
            fetchError,
          );
          setTenant(defaultTenant);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading tenant:", error);
        // Always fallback to default tenant instead of failing
        setTenant(defaultTenant);
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      loadTenant();
    } else {
      // Server-side: use default tenant
      setTenant(defaultTenant);
      setLoading(false);
    }
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}
