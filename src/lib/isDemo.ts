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
