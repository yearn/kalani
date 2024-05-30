import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import Providers from './providers'

const mono = JetBrains_Mono({ subsets: ['latin'] })

const sans = localFont({
  variable: '--font-venusrising-sans',
  display: 'swap',
  src: [
    { path: './fonts/VenusRisingRegular/font.woff2', weight: '400', style: 'normal' },
    { path: './fonts/VenusRisingRegular/font.woff', weight: '400', style: 'normal' },
    { path: './fonts/VenusRisingBold/font.woff2', weight: '700', style: 'normal' },
    { path: './fonts/VenusRisingBold/font.woff', weight: '700', style: 'normal' },
    { path: './fonts/VenusRisingHeavy/font.woff2', weight: '900', style: 'normal' },
    { path: './fonts/VenusRisingHeavy/font.woff', weight: '900', style: 'normal' }
  ]})

export const metadata: Metadata = {
  title: 'Kalani',
  description: 'Yearn vault automations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.className} ${mono.className}`}>
      <body className={`font-mono`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
