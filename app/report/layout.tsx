import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import '@/components/ui/sunset-theme.css'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import DemoRibbon from '@/components/ui/DemoRibbon'
import BrandProvider from '@/src/brand/BrandProvider'
import BootProbe from '../BootProbe'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solar Analysis Report - Sunspire',
  description: 'Comprehensive solar analysis for your property',
}

export default function ReportLayout({
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
            <DemoRibbon />
            {/* No SharedNavigation here - report page has its own custom banner */}
            {children}
          </BrandProvider>
        </AppErrorBoundary>
      </body>
    </html>
  )
}
