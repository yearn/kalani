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
  header,
  aside,
}: {
  children: React.ReactNode,
  header: React.ReactNode,
  aside: React.ReactNode
}) {
  const enableDrawer = false
  const enableAside = aside ? (aside as any).props.childPropSegment !== '__DEFAULT__' : false

  return <html lang="en" className={`${mono.className}`}>
    <body className={`relative w-full h-screen overflow-x-hidden overflow-y-auto font-mono bg-black`}>
      <Providers>
        {header}
        {/* <Drawer className="fixed z-50 top-0 left-0 w-24 h-screen" /> */}
        <div className="flex items-start">
          {enableDrawer && <div className="min-w-24"></div>} {/* drawer shim */}

          <div className="grow min-h-screen border-r border-r-primary-1000">
            {children}
          </div>

          {enableAside && <aside className={`min-w-[26%] px-8 py-12 h-screen`}>
            <div className="max-w-[380px]">{aside}</div>
          </aside>}
        </div>
      </Providers>
      <Toaster />
    </body>
  </html>
}
