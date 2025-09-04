import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/ui/sunset-theme.css'
import AppErrorBoundary from '@/components/AppErrorBoundary'
// import DemoRibbon from '@/components/ui/DemoRibbon'
import BrandProvider from '@/src/brand/BrandProvider'
import BrandCSSInjector from '@/components/BrandCSSInjector'
import BootProbe from './BootProbe'
import SharedNavigation from '@/components/SharedNavigation'
import { CompanyProvider } from '@/components/CompanyContext'
import CookieConsent from '@/components/CookieConsent'

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
        <BootProbe />
        <AppErrorBoundary>
          <BrandProvider>
            <CompanyProvider>
              <BrandCSSInjector />
              {/* DemoRibbon removed */}
              <SharedNavigation />
              {children}
            </CompanyProvider>
          </BrandProvider>
        </AppErrorBoundary>
        
        {/* Cookie Consent */}
        <CookieConsent />
      </body>
    </html>
  )
}
