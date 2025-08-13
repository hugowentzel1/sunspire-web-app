import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/ui/sunset-theme.css'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import DemoRibbon from '@/components/ui/DemoRibbon'
import { PersonalizationProvider } from '@/src/personalization/PersonalizationContext'
import PersonalizedBanner from '@/src/personalization/PersonalizedBanner'

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <PersonalizationProvider>
          <DemoRibbon />
          <AppErrorBoundary>{children}</AppErrorBoundary>
          {/* Non-blocking banner */}
          <PersonalizedBanner />
        </PersonalizationProvider>
      </body>
    </html>
  )
}
