export type TenantFlags = {
  showCookieBanner?: boolean; // paid: default false
  showPoweredBy?: boolean;    // default true
};

export function getTenantFlags(company?: string): TenantFlags {
  // By default, paid mode doesn't show cookie banner unless explicitly needed
  // All modes show "Powered by Sunspire"
  return { 
    showCookieBanner: false, 
    showPoweredBy: true 
  };
}

