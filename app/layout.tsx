import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/ui/premium-tokens.css'
import AppErrorBoundary from '@/components/AppErrorBoundary'

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
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </body>
    </html>
  )
}
