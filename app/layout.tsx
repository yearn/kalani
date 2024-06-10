import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Providers from './providers'
import ScrollArea from '@/components/ScrollArea'
import { Toaster } from '@/components/shadcn/sonner'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'] })

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
    <html lang="en" className={`${mono.className}`}>
      <body className={`font-mono`}>
        <Providers>
          <ScrollArea>{children}</ScrollArea>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
