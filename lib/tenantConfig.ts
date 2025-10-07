export type TenantFlags = {
  showCookieBanner?: boolean; // paid: default false
  showPoweredBy?: boolean;    // default true
};

export function getTenantFlags(company?: string): TenantFlags {
  return { showCookieBanner: false, showPoweredBy: true };
}
