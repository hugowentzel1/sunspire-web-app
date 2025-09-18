export const isDemoSearchParam = (searchParams: URLSearchParams) =>
  searchParams.get('demo') === '1';

export const isDemoFromSearchParams = (searchParams: Record<string, string | string[] | undefined>) =>
  String(searchParams.demo ?? '').toLowerCase() === '1' || String(searchParams.demo ?? '').toLowerCase() === 'true';
