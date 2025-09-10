"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function OutreachSlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    // Extract company from slug (remove suffix after dash if present)
    const company = slug.includes('-') ? slug.split('-')[0] : slug;
    
    // Redirect to demo URL with company parameter
    const demoUrl = `/?company=${company}&demo=1`;
    
    // Log the outreach click (optional)
    fetch('/api/links/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, company })
    }).catch(() => {
      // Fail silently if logging fails
    });
    
    // Redirect to demo
    window.location.href = demoUrl;
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your demo...</p>
      </div>
    </div>
  );
}
