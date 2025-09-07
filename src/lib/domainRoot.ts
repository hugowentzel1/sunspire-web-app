import { parse } from 'tldts';

/**
 * Extract the root domain from a URL or domain string
 * @param urlOrDomain - Full URL or domain string (e.g., "https://www.example.com", "www.example.com", "example.com")
 * @returns Root domain (e.g., "example.com") or null if invalid
 */
export function getRootDomain(urlOrDomain: string): string | null {
  if (!urlOrDomain || typeof urlOrDomain !== 'string') {
    return null;
  }

  try {
    // Parse the domain
    const parsed = parse(urlOrDomain);
    
    // If we have a domain and it's not an IP address
    if (parsed.domain && !parsed.isIp) {
      return parsed.domain;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing domain:', error);
    return null;
  }
}

/**
 * Build a fixed quote domain from a root domain
 * @param rootDomain - Root domain (e.g., "example.com")
 * @returns Fixed quote domain (e.g., "quote.example.com") or null if invalid
 */
export function buildFixedQuoteDomain(rootDomain: string | null): string | null {
  if (!rootDomain) {
    return null;
  }

  // Ensure it's a valid root domain (no subdomains)
  const parsed = parse(rootDomain);
  if (!parsed.domain || parsed.isIp || parsed.subdomain) {
    return null;
  }

  return `quote.${rootDomain}`;
}

/**
 * Validate that a domain is a valid subdomain (not apex)
 * @param domain - Domain to validate
 * @returns true if valid subdomain, false otherwise
 */
export function isValidSubdomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  try {
    const parsed = parse(domain);
    
    // Must have a subdomain and not be an IP
    return !!(parsed.subdomain && parsed.domain && !parsed.isIp);
  } catch (error) {
    return false;
  }
}

/**
 * Extract company website from various input formats
 * @param input - URL, domain, or company website string
 * @returns Cleaned company website URL or null
 */
export function extractCompanyWebsite(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Clean up the input
  let cleaned = input.trim();
  
  // Add protocol if missing
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  // Basic URL validation
  try {
    new URL(cleaned);
    return cleaned;
  } catch (error) {
    return null;
  }
}
