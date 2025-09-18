"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const DemoBanner = dynamic(() => import("@/src/demo/DemoChrome").then(mod => ({ default: mod.DemoBanner })), {
  ssr: false,
  loading: () => null
});

export default function ConditionalDemoBanner() {
  const pathname = usePathname();
  
  // Pages where demo banner should NOT show
  const noBannerPages = [
    '/privacy',
    '/terms', 
    '/dpa',
    '/do-not-sell',
    '/security',
    '/status',
    '/success',
    '/cancel',
    '/signup',
    '/report',
    '/demo-result'
  ];
  
  // Don't show banner on legal/regulatory pages
  if (noBannerPages.some(page => pathname.startsWith(page))) {
    return null;
  }
  
  return <DemoBanner />;
}
