'use client';

import { usePathname } from 'next/navigation';
import SharedNavigation from './SharedNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Don't show global navigation on the report page since it has its own custom banner
  if (pathname === '/report') {
    return null;
  }
  
  // Show global navigation on all other pages
  return <SharedNavigation />;
}
