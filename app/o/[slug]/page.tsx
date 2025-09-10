import { redirect } from 'next/navigation';

export default function OutreachSlugPage({ params }: { params: { slug: string } }) {
  const raw = params.slug || 'demo';
  const company = raw.split('-')[0]; // acme-xyz123 -> acme
  // Force redirect to demo with company - FIXED
  redirect(`/?company=${encodeURIComponent(company)}&demo=1`);
}
