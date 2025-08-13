import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/ui/sunset-theme.css'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import DemoRibbon from '@/components/ui/DemoRibbon'
import { PersonalizationProvider } from '@/src/personalization/PersonalizationContext'
import PersonalizedBanner from '@/src/personalization/PersonalizedBanner'
import { DemoWatermark } from '@/src/personalization/DemoWatermark'
import { DemoFooter } from '@/src/personalization/DemoFooter'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sunspire - Solar Intelligence',
  description: 'AI-powered solar analysis and installer matching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const h = headers();
  const isDemo = h.get("referer")?.includes("demo=1") ?? false; // best-effort
  
  return (
    <html lang="en">
      <head>
        {isDemo && <meta name="robots" content="noindex,nofollow" />}
      </head>
      <body className={inter.className}>
        <PersonalizationProvider>
          <DemoRibbon />
          <AppErrorBoundary>{children}</AppErrorBoundary>
          {/* Non-blocking banner */}
          <PersonalizedBanner />
          {/* Demo components */}
          <DemoWatermark />
          <DemoFooter />
        </PersonalizationProvider>
      </body>
    </html>
  )
}
