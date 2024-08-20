import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Providers from './providers'
import { Toaster } from '@/components/shadcn/sonner'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zookeeper',
  description: 'Yearn vault control center',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mono.className}`}>
      <body className={`relative w-full h-screen overflow-x-hidden overflow-y-auto font-mono bg-black`}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
