"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export function IconBadge({ children }: { children: React.ReactNode }) {
  const b = useBrandTakeover();
  
  // Use company brand colors for gradient, fallback to default orange
  // Better gradient that matches the main color more closely
  const gradientStyle = b.enabled && b.primary ? {
    background: `linear-gradient(135deg, ${b.primary}40, ${b.primary})`
  } : {
    background: 'linear-gradient(135deg, #fbbf2440, #d97706)'
  };

  return (
    <div 
      className="text-white rounded-2xl w-12 h-12 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.12)]"
      style={gradientStyle}
    >
      {children}
    </div>
  );
}
