export function isDemoFromURL(url: URL | string) {
  const sp = new URL(url.toString(), 'https://dummy').searchParams;
  return sp.get('demo') === '1' || sp.get('demo') === 'true';
}

export function isDemoFromSearchParams(sp: URLSearchParams) {
  return sp.get('demo') === '1' || sp.get('demo') === 'true';
}

export function useIsDemo() {
  if (typeof window === 'undefined') return false;
  const sp = new URLSearchParams(window.location.search);
  return isDemoFromSearchParams(sp);
}
// Force deployment Tue Sep  9 19:48:58 EDT 2025
